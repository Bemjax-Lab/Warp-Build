# Async Interfaces

Every core constructor in Warp has an **async interface** — a lowercase method on `warp` that handles both creation and retrieval. The rule is simple:

- **Object argument → create** (or return existing if dedup applies)
- **String argument → retrieve** by name

```js
await warp.layout({ name: "Warp" })   // creates
await warp.layout("Warp")             // retrieves an instance or undefined 
```

Async interfaces are set up by `setupAsyncInterfaces(Constructor)` in `helpers.js`. Two constructors are exceptions: **Drive** has a manual async interface in `Drive.js`, and **Sandbox** has no retrieval (every call creates a new instance).

The constructor is also attached directly: `warp.Layout = Layout`, `warp.FileType = FileType`, etc. — so `new warp.Layout(...)` works for direct construction from outside the engine scope.

---

## Behavior Per Constructor

| Constructor | Method | String (retrieve) | Object (create) | Store | Dedup | Layout-routed |
|-------------|--------|-------------------|-----------------|-------|-------|---------------|
| **Store** | `warp.store()` | Registry lookup | New instance (dedup in constructor) | — | Yes: constructor returns existing if same name | No |
| **Layout** | `warp.layout()` | Cache → "layouts" store → construct | New instance, persist to store | `"layouts"` | Yes: cache + store | No |
| **FileType** | `warp.fileType()` | Cache → scan all layouts in store | Routes to `layout.fileType(data)` | `"layouts"` (indirect) | Yes: per-layout cache | **Yes** |
| **Search** | `warp.search()` | Cache → scan all layouts in store | Routes to `layout.search(data)` | `"layouts"` (indirect) | Yes: per-layout cache | **Yes** |
| **Sandbox** | `warp.sandbox()` | Returns `undefined` (no retrieval) | New instance, no persistence | — | No | No |
| **Drive** | `warp.drive()` | Registry scan by name | Factory with dedup by `type:name` | Varies by type | Yes: `_driveRegistry` | No |

---

## Detailed Behavior

### Store

```js
await warp.store("files")              // returns lists.instances.stores["files"] or undefined
await warp.store({ name: "files" })    // creates new Store, or returns existing if same name
```

**String:** Pure registry lookup — `lists.instances.stores[name]`. No store round-trip. Returns instance or `undefined`.

**Object:** Calls `new Store(options)`. The Store constructor itself deduplicates: if `lists.instances.stores[options.name]` already exists, it returns that instance instead of creating a new one (Store.js lines 19-21). The new instance auto-initializes a SharedWorker connection and queues operations until the worker confirms creation.

**No async interface creates a store implicitly.** Engine-level stores (`"files"`, `"blobs"`, `"layouts"`, `"preferences"`) are created explicitly in `init()`.

### Layout

```js
await warp.layout("Warp")             // cache → store fetch → construct → cache → return
await warp.layout({ name: "Warp" })   // construct → await _ready → cache → return
```

**String:** Checks `lists.instances.layouts[name]` first. On cache miss, fetches from the `"layouts"` store, constructs a new Layout instance, awaits its `_ready` promise (which persists the layoutJSON to the store), caches, and returns.

**Object:** Constructs `new Layout(data)`, awaits `_ready`, caches by name. The Layout constructor's `_ready` promise checks if this layout already exists in the store — if not, it persists the full layoutJSON and adds the name to `availableLayoutsNames`.

Layout instances own collections: `layout.fileType()`, `layout.search()`, `layout.app()`, `layout.brand()`. These are the primary way to create and retrieve layout-owned types.

### FileType (layout-routed)

```js
await warp.fileType("json")                                    // scan layouts for "json"
await warp.fileType("Warp.json")                               // targeted: layout "Warp", type "json"
await warp.fileType({ name: "json", mime: "text/plain", layout: "Warp" })  // create via layout
```

**String (no dot):** Scans every layout in `availableLayoutsNames`. For each, checks `lists.instances.fileTypes["layoutName.json"]`. On cache miss, fetches `layoutStore.get("layoutName.fileTypes.json")`. If found, constructs `new FileType(data)`, caches, continues. **Last match wins** — if multiple layouts define "json", the last one in the array is returned.

**String (with dot):** Targeted lookup. `"Warp.json"` → cache key `"Warp.json"`, store key `"Warp.fileTypes.json"`.

**Object:** Requires a `layout` property. Strips it, fetches the layout via `warp.layout(layoutRef)`, then delegates: `layout.fileType(data)`. The layout method creates the FileType instance, caches it in `lists.instances.fileTypes`, persists to the layouts store with a targeted set (`s.set("Warp.fileTypes.json", data)`), and returns the instance.

**Without `layout` property → throws.** FileTypes cannot exist outside a layout.

### Search (layout-routed)

Identical pattern to FileType. Replace `fileType` → `search`, `fileTypes` → `searches`.

```js
await warp.search("Files")                                     // scan layouts
await warp.search({ name: "Files", query: fn, html: "...", layout: "Warp" })  // create via layout
```

### Sandbox

```js
await warp.sandbox("name")            // always returns undefined — no retrieval
await warp.sandbox({ code: "..." })   // creates new Sandbox instance
```

**String:** Returns `undefined`. Sandboxes have no persistent identity.

**Object:** Creates `new Sandbox(options)`. Every call produces a fresh instance. No caching, no store persistence. The Sandbox provides isolated `eval()` with blocked globals (window, fetch, Function, etc.).

### Drive (manual async interface)

```js
await warp.drive("myDrive")                           // scan _driveRegistry for matching name
await warp.drive({ type: "object", name: "myDrive" }) // create or return existing
new warp.Drive("object", { name: "myDrive" })         // synchronous constructor (same dedup)
```

**String:** Searches `_driveRegistry` for any drive whose `.name` matches. Returns instance or `undefined`.

**Object:** Calls the `Drive()` factory function. The factory deduplicates by `type + ":" + name` — if a drive with that key exists in `_driveRegistry`, it returns the existing instance. Otherwise it creates a new one.

Drive is NOT wired through `setupAsyncInterfaces`. It has its own manual implementation in `Drive.js` because Drive is a factory that produces different subtypes:
- **ObjectDrive** — in-memory JS object tree
- **StoreDrive** — backed by a Warp Store (cross-tab sync)
- **HttpDrive** — HTTP endpoint with local cache store

---

## Instance Caching

All cached instances live in one central registry declared in `helpers.js`:

```js
var lists = {
    registeredEvents: [],
    eventHandlers: {},
    instances: {
        stores: {},      // Store dedup registry
        layouts: {},     // { "Warp": Layout instance }
        fileTypes: {},   // { "Warp.json": FileType instance }
        searches: {},    // { "Warp.Files": Search instance }
        apps: {},        // { "Warp.MyApp": App instance }
        brands: {}       // { "Warp.MyBrand": Brand instance }
    }
};
```

`lists` is declared in `helpers.js` because it runs first in the concatenation order — before Store, Layout, or any constructor that reads/writes it.

### Why caching exists

Without caching, every `warp.layout("Warp")` or `warp.fileType("json")` hits the SharedWorker store — a `postMessage` round-trip each time. For frequently accessed types (e.g. fileType lookups on every file open), this adds up.

Naive in-memory caching breaks cross-tab sync: Tab A adds a fileType, but Tab B's cached Layout still holds the old data. The solution is **event-driven invalidation** — cache instances in memory, but listen to store events to wipe stale entries.

### Cache keys

- **Stores:** plain name — `"files"`, `"layouts"`, `"preferences"`
- **Layouts:** plain name — `"Warp"`, `"MyLayout"`
- **Layout-owned types:** composite `"layoutName.itemName"` — `"Warp.json"`, `"Warp.Files"`

### Cache population

| Event | What happens |
|-------|-------------|
| `warp.store({ name: "x" })` | Store constructor puts itself in `lists.instances.stores["x"]` |
| `warp.layout({ name: "x" })` | `setupAsyncInterfaces` caches after construction |
| `warp.layout("x")` | Cache hit returns immediately; cache miss fetches from store, constructs, caches |
| `layout.fileType({ name: "y" })` | Layout.js caches in `lists.instances.fileTypes["x.y"]` |
| `warp.fileType("y")` | Scans layouts, cache hit returns; miss fetches, constructs, caches |

### Cache invalidation

The `"layouts"` store has `change` and `delete` listeners (set up in `init()` in `Instance.js`). When the store fires an event, the key string is parsed to determine what to invalidate:

| Store key | Meaning | Invalidation |
|-----------|---------|-------------|
| `"Warp"` | Whole layout created/changed | Wipe layout + all children from cache |
| `"Warp.fileTypes"` | All fileTypes in Warp changed | Wipe all cached fileTypes for Warp |
| `"Warp.fileTypes.json"` | Specific fileType changed | Delete `lists.instances.fileTypes["Warp.json"]` |

The common case is 3-part keys from targeted sets — cheap to handle (one `delete`). The 1-part key only fires during layout creation or direct store writes; at that point the cache is usually empty, so the wipe is a safety net.

```js
function invalidateCollection(layoutName, collection) {
    var prefix = layoutName + ".";
    for (var k in lists.instances[collection]) {
        if (k.indexOf(prefix) === 0) delete lists.instances[collection][k];
    }
}
```

This works **cross-tab**: the SharedWorker broadcasts store events to all connected tabs, so Tab B's cache is invalidated when Tab A modifies a layout.

**Stale references:** Code holding an old instance reference keeps the old data. The cache invalidation only removes the cache entry — it doesn't update existing references. To get fresh data, call the accessor again.

### Layout name index

`availableLayoutsNames` is an array populated at startup from the layouts store, and maintained by Layout create/destroy. It's used by the FileType/Search retrieve path to know which layouts to scan — without it, the engine would have to load all layout data from the store on every lookup.

---

## Property Access on Instances

`setupOptionsAndInstance` gives every constructor instance:
- `.json()` — returns the mutable options object
- `.serialize()` / `.toString()` — returns JSON string of options
- `.destroy()` — default no-op (constructors override this)

It also exposes all options properties directly on the instance via getters/setters:

```js
ft.name          // getter → options.name
ft.name = "x"    // setter → options.name = "x"
ft.json().name   // same value — both point to the same options object
```

This means `ft.name`, `ft.commit`, `ft.mime` etc. all work directly on the instance. The getters/setters delegate to the closure-scoped options object, so `.name` and `.json().name` always stay in sync.

---

## `setupAsyncInterfaces` — Full Logic

```
warp[methodName](nameOrJSON):

  if STRING:
    Store     → return lists.instances.stores[name]
    Layout    → cache check → store fetch → construct → cache → return
    FileType  → cache check per layout → store fetch → construct → cache → return (last match)
    Search    → (same as FileType)
    Sandbox   → return undefined
    others    → return undefined

  if OBJECT with .layout:
    → fetch layout by name or use reference
    → strip .layout from data
    → delegate to layout[methodName](data)
    → layout method creates instance, caches, persists, returns

  if OBJECT without .layout:
    FileType/Search → throw (layout required)
    Layout          → new Layout(data) → await _ready → cache → return
    Store           → new Store(data) → return (constructor deduplicates)
    Sandbox         → new Sandbox(data) → return
```

---

## Targeted Store Sets

Layout.js uses **targeted sets** when persisting layout-owned types. Instead of replacing the whole layout object in the store, it sets only the specific item:

```js
// creating a fileType — sets only that item
s.set("Warp.fileTypes.json", nameOrObj);

// creating the layout itself — sets the full layoutJSON once
s.set("Warp", layoutJSON);

// destroying a fileType
s.delete("Warp.fileTypes.json");

// destroying a layout
s.delete("Warp");
```

The store's dot-path notation handles nested keys. The `change` and `delete` events fire with `(key, value, client)` where key is exactly what was passed to `s.set()` / `s.delete()`.

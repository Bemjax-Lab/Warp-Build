# Warp Event Systems

Warp has three distinct event systems at different scopes.

---

## 1. Global Events (`warp.on / warp.off / warp.trigger`)

Engine-wide events. Handlers stored in `lists.eventHandlers[type]` (general) and `lists.keyEventHandlers[type][key]` (key-scoped).

### Syntax

```js
// general — fires for ALL occurrences
warp.on("layoutLoad", function (e) { ... });

// key-scoped — fires only when key matches
warp.on("layoutChanged", "MyLayout", function (e) { ... });

// remove handler
warp.off("layoutLoad", handler);
warp.off("layoutChanged", "MyLayout", handler);

// trigger (internal use)
warp.trigger("layoutLoad", layoutInstance);                    // general only
warp.trigger("layoutChanged", layoutInstance, "MyLayout");     // general + key-scoped
```

### Event object (`e`)

```js
{
    type: "eventName",          // event name
    data: <varies>,             // event-specific payload (usually the affected instance)
    cancelled: false,           // set to true by cancel()/preventDefault()
    cancel: function() {},      // cancel the event
    preventDefault: function() {} // alias for cancel
}
```

### Cancellation

Call `e.cancel()` or `e.preventDefault()` inside a `before*` handler to prevent the action.

### Registered events

Events MUST be registered before use with `helpers.registerEvents(["eventName"])`. Using an unregistered event in `warp.on()` throws.

#### Layout events
| Event | Data | Cancellable | When |
|-------|------|-------------|------|
| `beforeLayoutLoad` | Layout instance | Yes | Before layout initializes |
| `layoutLoad` | Layout instance | No | After layout is ready and cached |
| `beforeLayoutUnload` | Layout instance | Yes | Before layout destruction |
| `layoutUnload` | Layout instance | No | After layout destroyed and cleaned up |
| `layoutChanged` | Layout instance | No | After any layout mutation (debounced, fires once per tick) |

Key-scoped: `warp.on("layoutChanged", "Warp", fn)` — fires only for Warp layout changes.

#### App events
| Event | Data | Cancellable | When |
|-------|------|-------------|------|
| `beforeAppLoad` | App instance | Yes | Before app code evaluates |
| `appLoad` | App instance | No | After app is loaded and ready |
| `beforeAppUnload` | App instance | Yes | Before app destruction |
| `appUnload` | App instance | No | After app destroyed |

#### File events
| Event | Data | Cancellable | When |
|-------|------|-------------|------|
| `beforeFileOpen` | File instance | Yes | Before file opens |
| `fileOpen` | File instance | No | After file opened |
| `beforeFileClose` | File instance | Yes | Before file closes |
| `fileClose` | File instance | No | After file closed |

### Comma-separated subscription

```js
warp.on("layoutLoad, layoutUnload", function (e) { ... });
```

---

## 2. Layout Instance Events (`layout.on / layout.off`)

Per-layout events for granular change tracking. Handlers stored in a private `_eventHandlers` object inside each Layout instance.

### Syntax

```js
var layout = await warp.layout("Warp");

layout.on("changed", function (e) { ... });
layout.on("appChanged", function (e) { ... });
layout.off("appChanged", handler);
```

### Event object (`e`)

```js
{
    type: "eventName",
    layout: <Layout instance>,   // the layout that fired the event
    data: {
        collection: "apps",      // which collection changed (on "changed" only)
        action: "add"|"remove"|"update",
        name: "AppName"
    },
    cancelled: false,
    cancel: function() {}
}
```

### Instance events

| Event | data.collection | When |
|-------|----------------|------|
| `changed` | `"apps"`, `"brands"`, `"fileTypes"`, `"searches"` | Any collection mutation |
| `appChanged` | n/a | App added or removed |
| `brandChanged` | n/a | Brand added or removed |
| `fileTypeChanged` | n/a | FileType added or removed |
| `searchChanged` | n/a | Search added or removed |

All fire with `data.action` (`"add"` or `"remove"`) and `data.name`.

### Relationship to global events

When a layout mutation happens:
1. `layout._trigger("appChanged", ...)` fires instance handlers
2. `layout._trigger("changed", ...)` fires instance handlers
3. `warp.trigger("layoutChanged", layout, layoutName)` fires global handlers (debounced)

---

## 3. Store Events (`store.on / store.off`)

Per-store events for cross-tab state synchronization via SharedWorker. Handlers stored in the Store instance's private `_handlers` object.

### Syntax

```js
var s = await warp.store("myStore");

// general events — fire for any key
s.on("create",  function (key, value, client) { ... });
s.on("update",  function (key, value, client) { ... });
s.on("delete",  function (key, value, client) { ... });
s.on("change",  function (key, value, client) { ... });  // fires for ALL mutations

// key-scoped events — fire only for a specific key
s.on("keyCreate", "score", function (value, client) { ... });
s.on("keyUpdate", "score", function (value, client) { ... });
s.on("keyDelete", "score", function (value, client) { ... });
s.on("keyChange", "score", function (value, client) { ... });

// lifecycle
s.on("ready",   function () { ... });       // store created fresh
s.on("connect", function () { ... });       // joined existing store
s.on("error",   function (err) { ... });    // error occurred

// remove
s.off("change", handler);
s.off("keyChange", "score", handler);
```

### Store events matrix

| Mutation | Events fired |
|----------|-------------|
| `s.set(key, val)` (new key) | `create` + `change` + `keyCreate` + `keyChange` |
| `s.set(key, val)` (existing) | `update` + `change` + `keyUpdate` + `keyChange` |
| `s.delete(key)` | `delete` + `change` + `keyDelete` + `keyChange` |

### Cross-tab

Store events are broadcast to ALL connected tabs via SharedWorker. The `client` parameter identifies which tab made the change (matches `warp.id`).

---

## 4. Window Events (`win.on / win.off`)

Per-window events for UI state changes. Configured via manifest callbacks or `win.on()`.

### Syntax

```js
var win = await manager.win({ name: "my-win", ... });
win.on("show", function (e) { ... });
win.off("show", handler);
```

### Window events

| Event | Manifest callback | When |
|-------|------------------|------|
| `beforeshow` | `onBeforeShow` | Before window becomes visible |
| `show` | `onShow` | After window shown |
| `beforehide` | `onBeforeHide` | Before window hides |
| `hide` | `onHide` | After window hidden |
| `dragstart` | `onDragStart` | Drag begins |
| `drag` | `onDrag` | During drag |
| `dragend` | `onDragEnd` | Drag ends |
| `resize` | `onResize` | Window resized |
| `minimize` | `onMinimize` | Window minimized |
| `maximize` | `onMaximize` | Window maximized |
| `restore` | `onRestore` | Window restored from min/max |

### Manifest shorthand

```js
// In app manifest — these are auto-wired to win.on()
({
    win: {
        onShow: function (e) { e.win.state(4); },  // maximize on show
        onHide: function (w) { ... }
    }
})
```

---

## Summary

| System | Scope | Storage | Key-scoped | Cross-tab |
|--------|-------|---------|-----------|-----------|
| `warp.on` | Global | `lists.eventHandlers` | Yes (`warp.on(type, key, fn)`) | No (but layout sync fires these) |
| `layout.on` | Per-layout | Private `_eventHandlers` | No | No (but cross-tab sync fires these) |
| `store.on` | Per-store | Private `_handlers` | Yes (`keyCreate`, etc.) | Yes (SharedWorker broadcast) |
| `win.on` | Per-window | Private handlers | No | No |

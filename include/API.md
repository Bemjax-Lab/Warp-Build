# Warp API Reference

## Engine Instance

```js
var warp = new Warp(options);
```

### Options
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `contain` | boolean | `true` | Constrain windows to viewport |
| `load` | string/array/false | `false` | Layout(s) to load on init |
| `tests` | string/false | `false` | Test code to eval+run (Mocha) |
| `debug` | boolean | `false` | Debug mode |

---

## warp.load(arg)

Load layouts. Returns a Promise.

```js
// file dialog — user picks a .layout file
await warp.load();

// URL — fetch and parse a .layout archive
await warp.load("path/to/My.layout");

// array — parallel loading
await warp.load(["dist/Warp.layout", "dist/Other.layout"]);

// File/Blob — parse directly
await warp.load(file);

// warp.File — extract data and parse
await warp.load(warpFile);

// plain object — treat as layoutJSON
await warp.load({ name: "My", apps: {...}, ... });
```

Loading strategy for string URLs:
1. Check in-memory instance cache
2. Check shared store (another tab may have loaded it)
3. *(TODO)* Check localStorage cache
4. Fetch from URL

---

## warp.layout(nameOrObj)

Get or create a Layout instance.

```js
// get existing
var layout = await warp.layout("Warp");

// create from JSON
var layout = await warp.layout({ name: "My", apps: {...} });
```

---

## warp.app(name)

Get or create an App instance.

```js
// qualified name (layout.app)
var info = await warp.app("Warp.Info");

// unqualified (scans all layouts)
var info = await warp.app("Info");
```

Returns the app's public API (methods assigned to `this` in the app's JS file).

---

## warp.store(name)

Get or create a Store (cross-tab SharedWorker-backed key-value store).

```js
var s = await warp.store("myStore");
await s.set("key", value);
var val = await s.get("key");
await s.delete("key");
var all = await s.getAll();
```

---

## warp.prefs(category, name, value)

Persistent user preferences (backed by "preferences" store).

```js
// get all prefs in category
var termPrefs = await warp.prefs("terminal");

// get specific pref
var fontSize = await warp.prefs("terminal", "fontSize");

// set
await warp.prefs("terminal", "fontSize", 14);
```

---

## warp.on / warp.off / warp.trigger

See [EVENTS.md](EVENTS.md) for full event system documentation.

```js
warp.on("layoutLoad", function (e) { ... });
warp.on("layoutChanged", "Warp", function (e) { ... });  // key-scoped
warp.off("layoutLoad", handler);
```

---

## Layout Instance

```js
var layout = await warp.layout("Warp");

// get all apps/brands/fileTypes/searches (returns object)
var apps = await layout.app();
var brands = await layout.brand();
var types = await layout.fileType();
var searches = await layout.search();

// get specific item
var editorApp = await layout.app("Editor");

// add item
await layout.app({ name: "MyApp", folder: {...} });
await layout.brand({ name: "dark", ... });
await layout.fileType({ name: "md", mime: "text/markdown", ... });
await layout.search({ name: "files", ... });

// remove item
await layout.remove("apps", "MyApp");
await layout.remove("brands", "dark");

// destroy layout
await layout.destroy();

// get raw JSON
var json = layout.json();

// instance events
layout.on("changed", function (e) { ... });
layout.on("appChanged", function (e) { ... });
layout.off("changed", handler);
```

---

## App Environment

Inside `LayoutName.AppName.js`:

### `app`
| Property | Type | Description |
|----------|------|-------------|
| `app.body` | HTMLElement | Window body (your UI container) |
| `app.win` | Win | Window instance |
| `app.el` | HTMLElement | Same as `app.body` |

### `dom` (scoped DOM helpers)
```js
dom.query(".my-class");              // querySelector inside app.body
dom.queryAll(".items");              // querySelectorAll inside app.body
dom.on(element, "click", handler);   // addEventListener
dom.off(element, "click", handler);  // removeEventListener
dom.node("div", {                    // create element
    class: "my-class",
    text: "Hello",
    html: "<b>bold</b>"              // text OR html, not both
});
```

### `this` (public API)
```js
// methods on `this` become the app's public API
this.refresh = function () { ... };
this.getData = function () { return data; };

// other apps can call:
var info = await warp.app("Info");
info.refresh();
```

### `warp`
Full engine instance. Access layouts, stores, prefs, events, DOM, GUI.

### `lists`
Internal instance registry. `lists.instances.layouts`, `lists.instances.apps`, etc.

---

## GUI

```js
// create a window manager
var m = await warp.gui.manager({ name: "my-manager", defaultWin: { ... } });

// create a window
var w = await m.win({ name: "my-win", caption: "Title", width: 400, height: 300 });

// window API
w.show();
w.hide();
w.close();
w.state(0);  // 0=normal, 1=minimized, 4=maximized
w.options("caption", "New Title");
w.on("show", handler);
```

---

## CSS Size Classes

Warp cascades size classes from containers to children:

| Class | Size |
|-------|------|
| `.xs` | Extra small |
| `.sm` | Small |
| (none) | Medium (default) |
| `.lg` | Large |
| `.xl` | Extra large |

CSS variables for theming:
- `var(--defaultBg)`, `var(--defaultLight)`, `var(--defaultDark)`
- `var(--successBg)`, `var(--warningBg)`, `var(--dangerBg)`, `var(--infoBg)`

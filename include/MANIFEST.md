# Manifest Reference

Manifests are JS object literals (not JSON) — they support functions, comments, and expressions.
Parsed with `new Function("return (" + src + ")")()`.

---

## Layout Manifest (`LayoutName.manifest.js`)

```js
({
    name: "MyLayout",
    version: 0.1,
    image: false,                    // optional: Blob for layout icon image
    icon: "cabinet",                 // icon name from Warp GUI icon set
    desc: "Description of layout",
    win: {                           // default window position for all apps in this layout
        anchor: {
            from: { x: "mid", y: "mid" },
            to: { parent: null, x: "mid", y: "mid" }
        }
    },
    deps: [],                        // dependency array (reserved)
    apps: {},                        // auto-populated from apps/ directory
    brands: {},                      // brand definitions
    fileTypes: {                     // file type registry
        js: {
            name: "js",
            color: "rgb(247, 223, 30)",
            mime: "text/javascript",
            mode: "javascript"       // editor syntax mode
        }
    },
    searches: {},                    // search provider definitions
    onBeforeLoad: false,             // or: function(layout) { ... }
    onLoad: false,                   // or: function(layout) { ... }
    onBeforeDestroy: false           // or: function(layout) { ... }
})
```

### Lifecycle hooks (alternative to inline functions)

Place these files next to the manifest:
- `onBeforeLoad.js` — runs before layout initializes
- `onLoad.js` — runs after layout is ready
- `onBeforeDestroy.js` — runs before layout is destroyed

---

## App Manifest (`LayoutName.AppName.manifest.js`)

```js
({
    name: "MyApp",                   // FORCED from directory name, not from here
    desc: "What this app does",
    layout: "MyLayout",             // FORCED from parent layout directory
    deps: false,                     // or dependency array
    brands: false,                   // or brands folder path
    folder: {},                      // auto-populated by engine (holds .js, .html, .css Blobs)
    win: {
        name: "app-MyApp",          // unique window name
        caption: "My App",          // window title bar text
        width: 520,
        height: 400,
        title: "My App Title",      // internal title
        scrollable: true,           // enable body scroll
        minWidth: 300,
        minHeight: 200,
        state: 0,                   // 0=normal, 1=minimized, 4=maximized

        // window lifecycle callbacks (auto-wired to win.on)
        onShow: function (e) { },
        onHide: function (e) { },
        onBeforeShow: function (e) { },
        onBeforeHide: function (e) { },
        onDragStart: function (e) { },
        onDrag: function (e) { },
        onDragEnd: function (e) { },
        onResize: function (e) { },
        onMinimize: function (e) { },
        onMaximize: function (e) { },
        onRestore: function (e) { },

        // window position
        anchor: {
            from: { x: "mid", y: "mid" },
            to: { parent: null, x: "mid", y: "mid" }
        }
    }
})
```

### Anchor positions

`x` and `y` accept: `"start"`, `"mid"`, `"end"`, or pixel numbers.
`parent`: `null` (viewport) or `"window-name"` (relative to another window).

---

## Directory Structure

```
MyLayout/
  MyLayout.manifest.js              # Layout manifest (required)
  onBeforeLoad.js                    # Lifecycle hook (optional)
  onLoad.js                          # Lifecycle hook (optional)
  onBeforeDestroy.js                 # Lifecycle hook (optional)
  apps/
    MyApp/
      MyLayout.MyApp.manifest.js     # App manifest (required)
      MyLayout.MyApp.js              # App code (REQUIRED — engine throws without it)
      MyLayout.MyApp.html            # App HTML template (optional, injected into body)
      MyLayout.MyApp.css             # App scoped CSS (optional)
    AnotherApp/
      MyLayout.AnotherApp.manifest.js
      MyLayout.AnotherApp.js
      ...
```

### Key rules

1. **App JS is mandatory** — the engine throws if `LayoutName.AppName.js` is missing from the folder
2. **Names are forced** — `name` and `layout` in app manifest are overwritten from the directory structure
3. **File naming** — all files MUST be prefixed with `LayoutName.AppName.`
4. **Folder keys** — when loaded, `LayoutName.` prefix is stripped from folder keys (e.g., `MyLayout.MyApp.js` becomes `MyApp.js`)

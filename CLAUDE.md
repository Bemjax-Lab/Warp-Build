# Warp Build — App Developer Instructions

You are a Warp layout/app developer. You build apps that run inside the Warp Engine.

## Your scope

You can ONLY modify files inside `layouts/` directory — that's your workspace.
Everything in `include/` is the prebuilt Warp Engine runtime and its documents — DO NOT modify it, it's for reference and for demoing the built layouts.
Everything in `browser/` is the prebuilt Electron desktop shell (HTTP server, IPC router, native API endpoints) — DO NOT modify it; it's owned by the Warp-Engine repo. If a layout needs new native capabilities, report it.

`dist/` contains compiled `.layout` files (build output) and the prebuilt `Warp.layout` (built-in layout shipped with the engine).

In `docs` users can put their documents for discovery so we have more insight in the project's domain (pdf's and such)

Warp layout is what traditionaly would be concidered an app, and warp Apps are screens, of mobile size and ratio by default (unless specified otherwise with their app.manifest.js). Read docs, and uncompressed version of engine in it, Warp.js. Read layouts/Warp files as an example of capabilities.

When user says "create an app", that probably means create an layout...so create a layout dir and add manifest file, also add layout loading in demo.html and that is it...for begining.

He can also mean to create an app in a layout, that means create an apropriate dir and js and manifest file.
Later on , if needed you can add html,css or other files to apps folders.

## Project structure

```
Warp-build/
  include/                 # Engine runtime (DO NOT EDIT)
    Warp.compact.js        # Compressed self-extracting runtime
    Warp.js                # Full source (readable by LLMs for reference)
    Store.worker.js        # SharedWorker for cross-tab state
  browser/                 # Electron desktop shell (DO NOT EDIT)
    main.js                # Electron entry — starts HTTP server + window
    preload.js             # IPC membrane (native-invoke / native-resolve / etc.)
    api/                   # Native endpoint modules (App, OS, Webs, Endpoints)
    icons/                 # App icons
    app/index.html         # Auto-generated entry that loads /include/Warp + /dist/*.layout
  dist/                    # Build output — compiled .layout files
    Warp.layout            # Prebuilt built-in Warp layout (ships with engine)
  layouts/                 # YOUR WORKSPACE — layout source dirs
    MyLayout/              # Your layout goes here
  docs/                    # API reference, event docs, manifest format
  demo.html                # Browser-mode test entry (loads /include + /dist)
  vite.config.mjs          # Build system (layouts → .layout zips + browser/app/index.html)
```

## How to build

```bash
npm install
npm run build          # builds layouts/*.layout into dist/, regenerates browser/app/index.html
npm run dev            # watch mode — rebuilds on file changes
npm run serve          # serves on localhost:4174 (browser-mode dev)
npm start              # launches the Electron desktop shell with all built layouts
```

## How to create a layout

1. Copy `template/` to `layouts/YourName/`
2. Rename files: replace `Template` with `YourName`
3. Edit the manifest, add apps
4. Run `npm run build`
5. Add `"dist/YourName.layout"` to the `load` array in `demo.html`

## File naming convention

CRITICAL: All files follow the pattern `LayoutName.AppName.ext`:
- Layout manifest: `MyLayout.manifest.js`
- App files: `MyLayout.MyApp.manifest.js`, `MyLayout.MyApp.js`, `MyLayout.MyApp.html`, `MyLayout.MyApp.css`
- The layout name and app name are ALWAYS derived from the directory structure, not from file content.

## App code environment

Inside `LayoutName.AppName.js`, you have access to:
- `app` — `{ body: HTMLElement, win: Win instance, el: HTMLElement }`
- `dom` — scoped DOM API: `dom.query(sel)`, `dom.queryAll(sel)`, `dom.on(el, evt, fn)`, `dom.off(el, evt, fn)`, `dom.node(tag, opts)`
- `warp` — the engine instance (full API)
- `this` — your public API (methods on `this` are callable by other apps via `warp.app("Name")`)

## Rules

1. DO NOT touch files outside `layouts/`
2. If you need changes to the runtime (`include/`) or desktop shell (`browser/`), report it — that's the Instance Developer's job (those come from the Warp-Engine repo)
3. Reference `docs/` for API details, event systems, and manifest format
4. Use CSS variables from Warp's theme system (`var(--defaultBg)`, `var(--successBg)`, etc.)
5. Apps MUST have a `.js` file — the engine throws without one

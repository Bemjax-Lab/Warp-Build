# Warp Build — App Developer Instructions

You are a Warp layout/app developer. You build apps that run inside the Warp Engine.

## Your scope

You can ONLY modify files inside `layouts/` directory — that's your workspace.
Everything in `include/` is the prebuilt Warp Engine runtime and its documents - Do NOT modify it, its for reference and for demoing the built layouts

`dist/` contains compiled `.layout` files (build output).

In `docs` users can put their documents for discovery so we have more insight in the project's domain (pdf's and such)

Warp layout is what traditionaly would be concidered an app, and warp Apps are screens, of mobile size and ratio by default (unless specified otherwise with their app.manifest.js). Read docs, and uncompressed version of engine in it, Warp.js. Read layouts/Warp files as an example of capabilities.

When user says "create an app", that probably means create an layout...so create a layout dir and add manifest file, also add layout loading in demo.html and that is it...for begining.

He can also mean to create an app in a layout, that means create an apropriate dir and js and manifest file.
Later on , if needed you can add html,css or other files to apps folders.

## Project structure

```
Warp-build/
  include/                 # Engine runtime (DO NOT EDIT)
    Warp.compact.js        # Compressed self-extracting runtime (used by demo.html)
    Warp.js                # Full source (readable by LLMs for reference)
    Store.worker.js        # SharedWorker for cross-tab state
  dist/                    # Build output — compiled .layout files
    Warp.layout            # Built-in Warp layout
  layouts/                 # YOUR WORKSPACE — layout source dirs
    Warp/                  # Example layout (reference, read-only)
    MyLayout/              # Your layout goes here
  docs/                    # API reference, event docs, manifest format
  demo.html                # Load and test your layouts here
  vite.config.mjs          # Build system (layouts → .layout zips)
```

## How to build

```bash
npm install
npm run build          # builds layouts/*.layout into dist/
npm run dev            # watch mode — rebuilds on file changes
npm run serve          # serves on localhost:4173
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
2. If you need changes to the runtime (`include/`), report it — that's the Instance Developer's job
3. Reference `docs/` for API details, event systems, and manifest format
4. Use the Warp layout as a working example — read its apps to understand patterns
5. Use CSS variables from Warp's theme system (`var(--defaultBg)`, `var(--successBg)`, etc.)
6. Apps MUST have a `.js` file — the engine throws without one

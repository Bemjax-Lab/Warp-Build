# Warp Build

A development workspace for building apps (layouts) that run inside the Warp Engine. Designed to be used with [Claude Code](https://claude.com/claude-code) as the primary development tool.

## Project Structure

- `layouts/` — Your workspace. Create and edit layouts here.
- `include/` — Prebuilt Warp Engine runtime (do not edit).
- `dist/` — Compiled `.layout` files (build output).
- `template/` — Starter template for new layouts.
- `docs/` — API reference and documentation.
- `demo.html` — Load and test your layouts in the browser.

## Getting Started

```bash
npm install
npm run build    # Build layouts into dist/
npm run dev      # Watch mode — rebuilds on file changes
npm run serve    # Serve on localhost:4173
```

## Creating a Layout

1. Copy `template/` to `layouts/YourName/`
2. Rename files — replace `Template` with `YourName`
3. Edit the manifest and add apps
4. Run `npm run build`
5. Add `"dist/YourName.layout"` to the `load` array in `demo.html`

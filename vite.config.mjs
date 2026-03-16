import { defineConfig } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import archiver from "archiver";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LAYOUTS_DIR = path.resolve(__dirname, "layouts");
const DIST_DIR = path.resolve(__dirname, "dist");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function collectFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectFiles(full));
    else files.push(full);
  }
  return files;
}

async function buildLayouts() {
  if (!fs.existsSync(LAYOUTS_DIR)) return;
  ensureDir(DIST_DIR);

  const dirs = fs.readdirSync(LAYOUTS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory());

  await Promise.all(dirs.map(dir => new Promise((resolve, reject) => {
    const src  = path.join(LAYOUTS_DIR, dir.name);
    const dest = path.join(DIST_DIR, dir.name + ".layout");

    const output  = fs.createWriteStream(dest);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(`  ${dir.name}.layout  ${(archive.pointer() / 1024).toFixed(1)} KB`);
      resolve();
    });
    archive.on("error", reject);

    archive.pipe(output);
    archive.directory(src, false);
    archive.finalize();
  })));
}

function warpLayoutPlugin() {
  return {
    name: "warp-layout-build",
    async buildStart() {
      for (const f of collectFiles(LAYOUTS_DIR)) {
        this.addWatchFile(f);
      }
      console.log("Building layouts...");
      await buildLayouts();
      console.log("Done.");
    },
    configureServer(server) {
      // Initial build on dev server start
      buildLayouts().then(() => console.log("Layouts ready."));

      // Watch layouts dir and rebuild + reload on any change
      server.watcher.add(LAYOUTS_DIR);
      server.watcher.on("change", async (file) => {
        if (!file.startsWith(LAYOUTS_DIR)) return;
        console.log(`Layout changed: ${path.relative(LAYOUTS_DIR, file)} — rebuilding...`);
        await buildLayouts();
        server.ws.send({ type: "full-reload" });
      });
      server.watcher.on("add", async (file) => {
        if (!file.startsWith(LAYOUTS_DIR)) return;
        await buildLayouts();
        server.ws.send({ type: "full-reload" });
      });
      server.watcher.on("unlink", async (file) => {
        if (!file.startsWith(LAYOUTS_DIR)) return;
        await buildLayouts();
        server.ws.send({ type: "full-reload" });
      });
    }
  };
}

export default defineConfig({
  build: {
    outDir: "dist/.vite",
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      input: "vite-entry.js"
    }
  },
  plugins: [warpLayoutPlugin()]
});

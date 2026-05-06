/* ──────────────────────────────────────────────────────────────
   Endpoints endpoint — dynamically registers/unregisters layout
   node endpoints at runtime.
   Maps to warp.native.invoke("Endpoints", methodName, args)
   ────────────────────────────────────────────────────────────── */

import { app } from 'electron';
import fs from 'fs';
import path from 'path';

var router = null;

var Endpoints = {

    _init(routerRef) {
        router = routerRef;
    },

    async Register(endpointName, files) {
        if (!router) throw new Error('Router not ready');
        var layoutDir = path.join(app.getPath('userData'), 'node-endpoints', endpointName);
        fs.mkdirSync(layoutDir, { recursive: true });
        // write all files to disk
        for (var fileName in files) {
            fs.writeFileSync(path.join(layoutDir, fileName), files[fileName], 'utf8');
        }
        // install deps if package.json present
        if (files['package.json']) {
            var { execFile } = await import('child_process');
            await new Promise(function (resolve, reject) {
                execFile('npm', ['install', '--production'], { cwd: layoutDir, timeout: 60000, shell: true }, function (err) {
                    if (err) reject(err); else resolve();
                });
            });
        }
        // convention: main endpoint file is EndpointName/EndpointName.mjs
        var mainFile = endpointName + '.mjs';
        if (!files[mainFile]) throw new Error('Missing ' + mainFile + ' in node endpoint files');
        await router.register(endpointName, path.join(layoutDir, mainFile));
        return true;
    },

    async Unregister(endpointName) {
        if (!router) return false;
        var result = router.unregister(endpointName);
        // clean up files
        var layoutDir = path.join(app.getPath('userData'), 'node-endpoints', endpointName);
        try { fs.rmSync(layoutDir, { recursive: true, force: true }); } catch (err) { /* ignore */ }
        return result;
    }
};

export default Endpoints;

/* ──────────────────────────────────────────────────────────────
   Preload — the IPC membrane between renderer and main process.

   This file is the ONLY place where ipcRenderer (Node/Electron)
   and window (browser) coexist. It cannot be replaced by a router
   endpoint because endpoints run in main process, not here.

   It exposes exactly two functions:
   - invoke: send a message to the router (fire-and-forget)
   - on: listen for messages from the router (resolve/reject/trigger)

   Everything else (platform info, endpoint registration, window
   control, tabs) is accessed via warp.native.invoke() which uses
   these two primitives under the hood.
   ────────────────────────────────────────────────────────────── */

var electron = require('electron');
var contextBridge = electron.contextBridge;
var ipcRenderer = electron.ipcRenderer;

contextBridge.exposeInMainWorld('electronAPI', {
    invoke: function (json) { ipcRenderer.send('native-invoke', json); },
    on: function (channel, callback) {
        var allowed = ['native-resolve', 'native-reject', 'native-trigger'];
        if (allowed.indexOf(channel) === -1) return;
        ipcRenderer.on(channel, function (event) {
            var args = Array.prototype.slice.call(arguments, 1);
            callback.apply(null, args);
        });
    }
});

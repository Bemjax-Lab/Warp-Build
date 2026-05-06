/* ──────────────────────────────────────────────────────────────
   App endpoint — manages the main BrowserWindow.
   Maps to warp.native.invoke("App", methodName, args)
   ────────────────────────────────────────────────────────────── */

import { BaseWindow } from 'electron';

var router = null;

function getWindow() {
    var windows = BaseWindow.getAllWindows();
    return windows.length > 0 ? windows[0] : null;
}

var App = {

    _init(routerRef) {
        router = routerRef;
    },

    async Close() {
        var win = getWindow();
        if (win) win.close();
        return true;
    },

    async Minimize() {
        var win = getWindow();
        if (win) win.minimize();
        return true;
    },

    async Maximize() {
        var win = getWindow();
        if (!win) return false;
        if (win.isMaximized()) win.unmaximize();
        else win.maximize();
        return win.isMaximized();
    },

    async Opacity(value) {
        var win = getWindow();
        if (win) win.setOpacity(Math.min(1, Math.max(0, value)));
        return value;
    },

    async IgnoreMouseEvents(on) {
        var win = getWindow();
        if (win) win.setIgnoreMouseEvents(on, { forward: true });
        return on;
    }
};

export default App;

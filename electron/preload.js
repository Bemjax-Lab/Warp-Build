var electron = require('electron');
var contextBridge = electron.contextBridge;
var ipcRenderer = electron.ipcRenderer;

// Expose a safe bridge to the renderer.
// Add methods here as your app needs native features.
contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    },
    close:    function () { ipcRenderer.send('win-close'); },
    minimize: function () { ipcRenderer.send('win-minimize'); },
    maximize: function () { ipcRenderer.send('win-maximize'); },
    opacity:  function (value) { ipcRenderer.send('win-opacity', value); },
    ignoreMouseEvents: function (on) { ipcRenderer.send('win-ignore-mouse', on); }
});

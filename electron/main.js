var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipcMain = electron.ipcMain;
var path = require('path');

var mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        icon: path.join(__dirname, 'icons', 'icon-256.png'),
        frame: false,
        titleBarStyle: 'hidden',
        autoHideMenuBar: true,
        transparent: true,
        backgroundColor: '#00000000',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.setMenu(null);

    mainWindow.loadFile(path.join(__dirname, '..', 'demo.html'));
    mainWindow.maximize();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

// window control IPC handlers
ipcMain.on('win-close', function () { if (mainWindow) mainWindow.close(); });
ipcMain.on('win-minimize', function () { if (mainWindow) mainWindow.minimize(); });
ipcMain.on('win-maximize', function () {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
});
ipcMain.on('win-opacity', function (e, value) {
    if (mainWindow) mainWindow.setOpacity(Math.min(1, Math.max(0, value)));
});
ipcMain.on('win-ignore-mouse', function (e, on) {
    if (mainWindow) mainWindow.setIgnoreMouseEvents(on, { forward: true });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

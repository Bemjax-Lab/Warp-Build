var electron = require('electron');
var app = electron.app;
var BaseWindow = electron.BaseWindow;
var WebContentsView = electron.WebContentsView;
var ipcMain = electron.ipcMain;
var session = electron.session;
var path = require('path');
var http = require('http');
var fs = require('fs');

var mainWindow = null;
var engineView = null;
var apiRouter = null;
var serverPort = 0;

var MIME = {
    '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript',
    '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
    '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.woff': 'font/woff',
    '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.layout': 'application/zip'
};

function startServer(root, cb) {
    var server = http.createServer(function (req, res) {
        var url = req.url.split('?')[0];
        var file = path.join(root, url);
        fs.readFile(file, function (err, data) {
            if (err) { res.writeHead(404); res.end(); return; }
            var ext = path.extname(file);
            res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
            res.end(data);
        });
    });
    server.listen(50505, '127.0.0.1', function () {
        serverPort = server.address().port;
        cb(serverPort);
    });
}

function createWindow(port) {
    mainWindow = new BaseWindow({
        icon: path.join(__dirname, 'icons', 'icon-256.png'),
        frame: false,
        titleBarStyle: 'hidden',
        autoHideMenuBar: true,
        transparent: true,
        backgroundColor: '#00000000'
    });

    // engine view — on top, transparent background so web views show through
    engineView = new WebContentsView({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            transparent: true
        }
    });

    mainWindow.setIcon(path.join(__dirname, 'icons', 'icon-256.png'));
    mainWindow.contentView.addChildView(engineView);
    engineView.webContents.loadURL('http://127.0.0.1:' + port + '/browser/app/index.html');

    mainWindow.setMenu(null);
    mainWindow.maximize();

    // keep engine view filling the window
    function resizeEngine() {
        var bounds = mainWindow.getContentBounds();
        engineView.setBounds({ x: 0, y: 0, width: bounds.width, height: bounds.height });
    }
    mainWindow.on('resize', resizeEngine);
    resizeEngine();

    // init API router once renderer is ready
    engineView.webContents.on('did-finish-load', function () {
        import('./api/router.mjs').then(function (mod) {
            apiRouter = mod.default;
            apiRouter.init(engineView.webContents);
            if (pendingFilePath) {
                sendFileToEngine(pendingFilePath);
                pendingFilePath = null;
            }
        });
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
        engineView = null;
    });
}

// file association — track path to open
var pendingFilePath = null;

function sendFileToEngine(filePath) {
    if (engineView && engineView.webContents) {
        engineView.webContents.send('native-trigger', 'App', 'OpenFile', JSON.stringify({ path: filePath }));
    } else {
        pendingFilePath = filePath;
    }
}

// Windows/Linux: file path comes as command-line argument
var argPath = process.argv.find(function (a) { return a.endsWith('.layout'); });
if (argPath) pendingFilePath = path.resolve(argPath);

// macOS: file open events
app.on('open-file', function (e, filePath) {
    e.preventDefault();
    if (mainWindow) sendFileToEngine(filePath);
    else pendingFilePath = filePath;
});

app.setAppUserModelId('com.warpbrowser.app');

// enable WebGPU support
app.commandLine.appendSwitch('enable-unsafe-webgpu');

// better font rendering
app.commandLine.appendSwitch('enable-lcd-text');
app.commandLine.appendSwitch('disable-lcd-text', 'false');

app.whenReady().then(function () {
    // allow media permissions (microphone, camera)
    session.defaultSession.setPermissionRequestHandler(function (webContents, permission, callback) {
        if (permission === 'media') callback(true);
        else callback(true);
    });
    var root = path.join(__dirname, '..');
    startServer(root, createWindow);
});

// generic native API bridge — single IPC channel for all endpoint calls
ipcMain.on('native-invoke', function (e, json) {
    if (!apiRouter) return;
    try {
        var message = JSON.parse(json);
        apiRouter.invoke(message);
    } catch (err) {
        console.error('[IPC] Failed to parse native-invoke:', err.message);
    }
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

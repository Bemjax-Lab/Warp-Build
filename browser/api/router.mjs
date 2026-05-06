/* ──────────────────────────────────────────────────────────────
   API Router — dispatches incoming IPC messages to endpoint modules.

   Message format (from renderer):
   { endpoint: "Windows", method: "Create", id: "abc123", args: [...] }

   Each endpoint is a separate .mjs file in this folder exporting
   an object of async methods. The router loads them once on init,
   then dispatches by endpoint + method name.
   ────────────────────────────────────────────────────────────── */

var endpoints = {};
var sender = null;

async function init(webContentsSender) {
    sender = webContentsSender;

    var Webs = await import('./Webs/Webs.mjs');
    var App = await import('./App/App.mjs');
    var OS = await import('./OS/OS.mjs');
    var Endpoints = await import('./Endpoints/Endpoints.mjs');

    endpoints.Webs = Webs.default;
    endpoints.Tabs = Webs.default; // backward compat for BrowserWin
    endpoints.App = App.default;
    endpoints.OS = OS.default;
    endpoints.Endpoints = Endpoints.default;

    // init core endpoints that need router reference
    var routerRef = { trigger: trigger, evalInRenderer: evalInRenderer, register: register, unregister: unregister };
    for (var name in endpoints) {
        if (typeof endpoints[name]._init === 'function') endpoints[name]._init(routerRef);
    }

    // Layout endpoints (e.g. Agent) are registered dynamically when their
    // layout loads — see Layout.js _ready and main.js node-endpoint-register.
}

function resolve(messageId, result) {
    if (!sender) return;
    try {
        sender.send('native-resolve', messageId, JSON.stringify(result));
    } catch (e) {
        console.error('[API] resolve send failed:', e.message);
    }
}

function reject(messageId, error) {
    if (!sender) return;
    try {
        sender.send('native-reject', messageId, String(error));
    } catch (e) {
        console.error('[API] reject send failed:', e.message);
    }
}

function trigger(endpoint, method, data) {
    console.log('[API] trigger:', endpoint, method, JSON.stringify(data));
    if (!sender) { console.warn('[API] trigger: no sender!'); return; }
    try {
        sender.send('native-trigger', endpoint, method, JSON.stringify(data));
    } catch (e) {
        console.error('[API] trigger send failed:', e.message);
    }
}

async function invoke(message) {
    var endpoint = message.endpoint;
    var method = message.method;
    var id = message.id;
    var args = message.args || [];

    if (!endpoints[endpoint]) {
        reject(id, 'Endpoint "' + endpoint + '" does not exist');
        return;
    }

    if (typeof endpoints[endpoint][method] !== 'function') {
        reject(id, 'Method "' + endpoint + '.' + method + '" does not exist');
        return;
    }

    try {
        var result = await endpoints[endpoint][method].apply(null, args);
        resolve(id, result);
    } catch (e) {
        reject(id, endpoint + '.' + method + ' failed: ' + e.message);
    }
}

function setSender(webContents) {
    sender = webContents;
}

async function evalInRenderer(code) {
    if (!sender) throw new Error('No renderer');
    return sender.executeJavaScript(code);
}

async function register(name, filePath) {
    var mod = await import('file:///' + filePath.replace(/\\/g, '/'));
    endpoints[name] = mod.default;
    if (endpoints[name]._init) endpoints[name]._init({ trigger: trigger, evalInRenderer: evalInRenderer });
    return true;
}

function unregister(name) {
    if (!endpoints[name]) return false;
    if (typeof endpoints[name]._destroy === 'function') endpoints[name]._destroy();
    delete endpoints[name];
    return true;
}

export default { init, invoke, resolve, reject, trigger, setSender, evalInRenderer, register, unregister };

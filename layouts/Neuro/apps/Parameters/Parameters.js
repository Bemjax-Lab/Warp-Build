var debug, detailsApp, categoryDrawers;

this.selected = {};
this.model = null;

var self = this;

this.reset = function () {
    warp.gui.confirm('Start a new session and clear data?').then(async function (ok) {
        if (!ok) return;
        self.selected = {};
        warp.gui.toast('Starting a new evaluation');
        await _ready;
        app.selected = self.selected;
        await loadFile('gui.js');
        if (detailsApp) detailsApp.hide();
    });
};

this.loadSet = async function (preset) {
    self.selected = Object.assign({}, preset);
    await _ready;
    app.selected = self.selected;
    await loadFile('gui.js');
    if (debug && detailsApp) detailsApp.debug(self.selected);
};

this.focusParameter = function (parameter) {
    var el = dom.query('[model-parameter="' + parameter + '"]');
    console.log(el);
    categoryDrawers[el.getAttribute('model-category')].open();
    el.focus();
    if (el.parentNode.nodeName === 'SPAN') el = el.parentNode;
    el.parentNode.scrollIntoView();
};

this.removeParameter = function (parameter) {
    delete self.selected[parameter];
    var el = dom.query('[model-parameter="' + parameter + '"]');
    if (el) {
        if (el._allowMultiple) {
            // multi-select group: uncheck all child checkboxes
            el.querySelectorAll('input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
        } else if (el.tagName === 'SELECT') {
            el.value = '';
        } else if (el.type === 'radio') {
            dom.queryAll('input[name="' + el.name + '"]').forEach(function (r) { r.checked = false; });
        } else if (el.type === 'checkbox') {
            el.checked = false;
        } else {
            el.value = '';
        }
        el.classList.remove('has-value');
    }
    if (app.updateDetected) app.updateDetected();
    if (app.refreshLabels) app.refreshLabels();
    if (detailsApp && detailsApp.debug) detailsApp.debug(self.selected);
};

async function loadFile(path) {
    var layout = await warp.layout(self.layout);
    var src = await layout.apps[self.name].folder[path].text();
    if (path.endsWith(".json")) return JSON.parse(src);
    return eval(src);
}

async function loadFileFrom(appName, path) {
    var layout = await warp.layout(self.layout);
    var src = await layout.apps[appName].folder[path].text();
    if (path.endsWith(".json")) return JSON.parse(src);
    return eval(src);
}

async function init() {
    self.model = await loadFile('parametersModel.json');
    // Merge diagnosis-only parameters (owned by Localisation/diagnoses) as extra categories.
    // If a category exists on both sides (e.g. "systemic signs"), merge the inner
    // params instead of overwriting — otherwise the diagnosis-side category would
    // silently shadow params declared in the main model.
    var diagModel = await loadFileFrom('Localisation', 'diagnoses/diagnosesParameters.json');
    for (var cat in diagModel) {
        if (self.model[cat]) Object.assign(self.model[cat], diagModel[cat]);
        else self.model[cat] = diagModel[cat];
    }

    // shared Drawer constructor — exposed on the DOM wrapper so gui.js picks it up
    app.Drawer = await loadFile('drawer.js');

    detailsApp = await warp.app('Neuro.Localisation');

    // gui.js expects a merged app object — shim the appApi surface onto the
    // DOM wrapper that gui.js sees as `app`.
    app.model    = self.model;
    app.selected = self.selected;
    app.reset    = self.reset;
    app.query    = dom.query;

    await loadFile('gui.js');
}

// defer init to a microtask so appApi.layout / appApi.name (set by App.js
// after the eval returns) are available before loadFile reads self.layout.
// _ready resolves once init completes — loadSet/reset await it before re-rendering.
var _ready = Promise.resolve().then(init);

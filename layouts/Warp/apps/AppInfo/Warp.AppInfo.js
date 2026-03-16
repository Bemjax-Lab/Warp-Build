var self = this;
var headerEl = dom.query(".appinfo-header");
var statusEl = dom.query(".appinfo-status");
var actionsEl = dom.query(".appinfo-actions");
var detailsEl = dom.query(".appinfo-details");

var currentName = null;
var currentLayout = null;

function fullName() { return currentLayout + "." + currentName; }
function isLoaded() { return !!lists.instances.apps[fullName()]; }
function getInstance() { return lists.instances.apps[fullName()]; }

function render() {
    if (!currentName || !currentLayout) return;

    var layout = lists.instances.layouts[currentLayout];
    if (!layout) return;

    layout.app(currentName).then(function (appJson) {
        if (!appJson) return;

        app.win.options("caption", currentName);

        // Header
        headerEl.innerHTML = "";
        headerEl.appendChild(dom.node("div", { class: "name tlg", text: currentName }));
        headerEl.appendChild(dom.node("div", { class: "layout-name", text: "Layout: " + currentLayout }));
        if (appJson.desc) headerEl.appendChild(dom.node("div", { class: "desc", text: appJson.desc }));

        // Status
        renderStatus();

        // Actions
        renderActions(layout, appJson);

        // Details
        renderDetails(appJson);
    });
}

function renderStatus() {
    statusEl.innerHTML = "";
    var loaded = isLoaded();
    var dot = dom.node("span", { class: "dot" + (loaded ? " loaded" : "") });
    var label = dom.node("span", { class: "tsm", text: loaded ? "Loaded" : "Not loaded" });
    statusEl.appendChild(dot);
    statusEl.appendChild(label);

    if (loaded) {
        var inst = getInstance();
        var visible = inst.win && inst.win.options("state") > 0;
        var visLabel = dom.node("span", { class: "tsm op5", text: visible ? "Visible" : "Hidden" });
        statusEl.appendChild(dom.node("span", { class: "tsm op3", text: "|" }));
        statusEl.appendChild(visLabel);
    }
}

function renderActions(layout, appJson) {
    actionsEl.innerHTML = "";

    var loaded = isLoaded();

    var btnLoad = dom.node("button", { class: "xs rsm", text: loaded ? "Unload" : "Load" });
    dom.on(btnLoad, "click", function () {
        if (isLoaded()) {
            getInstance().destroy();
            render();
        } else {
            warp.app(fullName()).then(function () { render(); });
        }
    });
    actionsEl.appendChild(btnLoad);

    if (loaded) {
        var inst = getInstance();
        var visible = inst.win && inst.win.options("state") > 0;
        var btnVis = dom.node("button", { class: "xs rsm", text: visible ? "Hide" : "Show" });
        dom.on(btnVis, "click", function () {
            if (inst.win && inst.win.options("state") > 0) inst.hide();
            else inst.show();
            render();
        });
        actionsEl.appendChild(btnVis);
    }

    var btnRemove = dom.node("button", { class: "xs rsm", text: "Remove" });
    dom.on(btnRemove, "click", function () {
        warp.gui.confirm('Remove app "' + currentName + '" from ' + currentLayout + '?').then(function (ok) {
            if (!ok) return;
            if (isLoaded()) getInstance().destroy();
            layout.remove("apps", currentName).then(function () {
                warp.gui.toast('App "' + currentName + '" removed');
                headerEl.innerHTML = '<div class="op5 tsm">App removed</div>';
                statusEl.innerHTML = "";
                actionsEl.innerHTML = "";
                detailsEl.innerHTML = "";
            });
        });
    });
    actionsEl.appendChild(btnRemove);
}

function renderDetails(appJson) {
    detailsEl.innerHTML = "";

    // Deps
    if (appJson.deps && appJson.deps.length) {
        var sec = dom.node("div", { class: "appinfo-section" });
        sec.appendChild(dom.node("div", { class: "section-title", text: "Dependencies" }));
        sec.appendChild(dom.node("div", { class: "tsm", text: appJson.deps.join(", ") }));
        detailsEl.appendChild(sec);
    }

    // Brands
    if (appJson.brands) {
        var sec = dom.node("div", { class: "appinfo-section" });
        sec.appendChild(dom.node("div", { class: "section-title", text: "Brands" }));
        var brands = typeof appJson.brands === "object" ? Object.keys(appJson.brands).join(", ") : String(appJson.brands);
        sec.appendChild(dom.node("div", { class: "tsm", text: brands }));
        detailsEl.appendChild(sec);
    }

    // Files
    var folder = appJson.folder || {};
    var files = Object.keys(folder);
    if (files.length) {
        var sec = dom.node("div", { class: "appinfo-section" });
        sec.appendChild(dom.node("div", { class: "section-title", text: "Files [" + files.length + "]" }));
        files.forEach(function (f) {
            sec.appendChild(dom.node("div", { class: "appinfo-file", text: f }));
        });
        detailsEl.appendChild(sec);
    }

    // Win config
    if (appJson.win) {
        var sec = dom.node("div", { class: "appinfo-section" });
        sec.appendChild(dom.node("div", { class: "section-title", text: "Window" }));
        var winProps = appJson.win;
        for (var k in winProps) {
            if (!winProps.hasOwnProperty(k)) continue;
            var val = winProps[k];
            if (typeof val === "function") val = "fn()";
            else if (typeof val === "object" && val !== null) val = JSON.stringify(val);
            else val = String(val);
            var row = dom.node("div", { class: "tsm", text: k + ": " + val });
            sec.appendChild(row);
        }
        detailsEl.appendChild(sec);
    }
}

// Public method
this.scope = function (appName) {
    if (appName.indexOf(".") !== -1) {
        var parts = appName.split(".");
        currentLayout = parts[0];
        currentName = parts[1];
    } else {
        currentName = appName;
        for (var ln in lists.instances.layouts) {
            currentLayout = ln;
            break;
        }
    }
    render();
    app.show();
};

// Re-render on app lifecycle events
warp.on("appLoad", function () { if (currentName) render(); });
warp.on("appUnload", function () { if (currentName) render(); });

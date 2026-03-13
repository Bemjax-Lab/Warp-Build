var self = this;
var listEl = dom.query(".list");
var headingEl = dom.query(".heading");
var btnOpen = dom.query(".open");

// --- Drawer component ---
function Drawer(opts) {
    var drawer = this;
    var isOpen = false;

    var el = dom.node("div", { class: "drawer" });

    var cls = "title p5 pt10 pb10" + (opts.height ? " " + opts.height : "") + (opts.classList ? " " + opts.classList : "");
    var title = dom.node("div", { class: cls });

    if (opts.icon) {
        var iconEl = dom.node("span", { class: "icon icon-" + opts.icon + " layout-icon" });
        title.appendChild(iconEl);
    }

    var caption = dom.node("span", { class: "caption", text: opts.caption || "" });
    var caret = dom.node("span", { class: "icon icon-chevron-right caret" });
    title.appendChild(caption);
    title.appendChild(caret);

    var body = dom.node("div", { class: "body p5" });

    el.appendChild(title);
    el.appendChild(body);

    drawer.el = el;
    drawer.body = body;
    drawer.title = title;
    drawer.caption = caption;

    dom.on(title, "click", function () {
        if (isOpen) {
            if (opts.beforeClose) opts.beforeClose(drawer);
            isOpen = false;
            caret.classList.remove("open");
            body.classList.remove("open");
            if (opts.onClose) opts.onClose(drawer);
        } else {
            if (opts.beforeOpen) opts.beforeOpen(drawer);
            isOpen = true;
            caret.classList.add("open");
            body.classList.add("open");
            if (opts.onOpen) opts.onOpen(drawer);
        }
    });
}

// --- render key:value props into a container ---
function renderProps(container, obj, skip) {
    skip = skip || {};
    for (var key in obj) {
        if (!obj.hasOwnProperty(key) || skip[key]) continue;
        var val = obj[key];
        if (val === undefined || val === null) continue;
        if (typeof val === "function") { val = "fn()"; }
        else if (typeof val === "object") { val = JSON.stringify(val); }
        else { val = String(val); }

        var row = dom.node("div", { class: "prop-row" });
        row.appendChild(dom.node("span", { class: "prop-key", text: key }));
        row.appendChild(dom.node("span", { class: "prop-val meta", text: val }));
        container.appendChild(row);
    }
}

// --- AppDrawer ---
function AppDrawer(layout, name, appJson) {
    var layoutName = layout.json().name;
    var fullName = layoutName + "." + name;

    var d = new Drawer({
        caption: name,
        height: "hsm",
        classList: "dark-drawer",
        onOpen: function (drawer) {
            drawer.body.innerHTML = "";

            var inst = lists.instances.apps[fullName];
            var loaded = !!inst;

            var row = dom.node("div", { class: "app-status m10" });
            var dot = dom.node("span", { class: "status-dot " + (loaded ? "loaded" : "idle") });
            var label = dom.node("span", { class: "meta", text: loaded ? "Loaded" : "Not loaded" });
            row.appendChild(dot);
            row.appendChild(label);

            var btnAppOpen = dom.node("button", { class: "xs rsm", text: "Open" });
            dom.on(btnAppOpen, "click", function () {
                warp.app(fullName).then(function (inst) { if (inst) inst.show(); });
            });
            row.appendChild(btnAppOpen);

            var btnRemove = dom.node("button", { class: "xs rsm", text: "Remove" });
            dom.on(btnRemove, "click", function () {
                layout.remove("apps", name).then(function () { d.el.remove(); });
            });
            row.appendChild(btnRemove);

            drawer.body.appendChild(row);
        }
    });
    if (appJson.desc) {
        var descSpan = dom.node("span", { class: "meta", text: appJson.desc });
        d.caption.after(descSpan);
    }
    return d;
}

// --- FileTypeDrawer ---
function FileTypeDrawer(ftData) {
    var ftJson = ftData.json ? ftData.json() : ftData;
    var d = new Drawer({
        caption: "*." + ftJson.name,
        height: "hsm",
        classList: "dark-drawer",
        onOpen: function (drawer) {
            drawer.body.innerHTML = "";
            renderProps(drawer.body, ftJson, { name: 1, layout: 1 });
        }
    });
    if (ftJson.color) {
        var dot = dom.node("span");
        dot.style.cssText = "width:8px;height:8px;border-radius:50%;background:" + ftJson.color + ";flex-shrink:0;";
        d.title.insertBefore(dot, d.caption);
    }
    if (ftJson.mime) {
        var mimeSpan = dom.node("span", { class: "meta", text: ftJson.mime });
        d.caption.after(mimeSpan);
    }
    return d;
}

// --- SearchDrawer ---
function SearchDrawer(srData) {
    var srJson = srData.json ? srData.json() : srData;
    var d = new Drawer({
        caption: srJson.name,
        height: "hsm",
        classList: "dark-drawer",
        onOpen: function (drawer) {
            drawer.body.innerHTML = "";
            renderProps(drawer.body, srJson, { name: 1, layout: 1 });
        }
    });
    return d;
}

// --- BrandDrawer ---
function BrandDrawer(brData) {
    var brJson = brData.json ? brData.json() : brData;
    var d = new Drawer({
        caption: brJson.name,
        height: "hsm",
        classList: "dark-drawer",
        onOpen: function (drawer) {
            drawer.body.innerHTML = "";
            renderProps(drawer.body, brJson, { name: 1, layout: 1 });
        }
    });
    return d;
}

// --- LayoutDrawer ---
function LayoutDrawer(layout) {
    var json = layout.json();
    var _isOpen = false;

    function updateMeta() {
        var j = layout.json();
        var parts = [];
        var ac = j.apps ? Object.keys(j.apps).length : 0;
        var fc = j.fileTypes ? Object.keys(j.fileTypes).length : 0;
        var sc = j.searches ? Object.keys(j.searches).length : 0;
        var bc = j.brands ? Object.keys(j.brands).length : 0;
        if (ac) parts.push(ac + " app" + (ac > 1 ? "s" : ""));
        if (fc) parts.push(fc + " type" + (fc > 1 ? "s" : ""));
        if (sc) parts.push(sc + " search" + (sc > 1 ? "es" : ""));
        if (bc) parts.push(bc + " brand" + (bc > 1 ? "s" : ""));
        metaSpan.textContent = parts.join(", ");
    }

    async function renderBody(drawer) {
        drawer.body.innerHTML = "";

        var btnDestroy = dom.node("button", { class: "xs rsm m10", text: "Destroy" });
        dom.on(btnDestroy, "click", function () {
            layout.destroy().then(function () { self.refresh(); });
        });
        drawer.body.appendChild(btnDestroy);

        var appData = await layout.app() || {};
        var ftData = await layout.fileType() || {};
        var srData = await layout.search() || {};
        var brData = await layout.brand() || {};

        var appKeys = Object.keys(appData);
        var ftKeys = Object.keys(ftData);
        var srKeys = Object.keys(srData);
        var brKeys = Object.keys(brData);

        if (appKeys.length) {
            drawer.body.appendChild(dom.node("div", { class: "hxs section-hdr op5 pl10", text: "Apps [" + appKeys.length + "]" }));
            appKeys.forEach(function (a) {
                drawer.body.appendChild(AppDrawer(layout, a, appData[a]).el);
            });
        }

        if (ftKeys.length) {
            drawer.body.appendChild(dom.node("div", { class: "hxs section-hdr op5 pl10", text: "File Types [" + ftKeys.length + "]" }));
            ftKeys.forEach(function (f) {
                drawer.body.appendChild(FileTypeDrawer(ftData[f]).el);
            });
        }

        if (srKeys.length) {
            drawer.body.appendChild(dom.node("div", { class: "hxs section-hdr op5 pl10", text: "Searches [" + srKeys.length + "]" }));
            srKeys.forEach(function (s) {
                drawer.body.appendChild(SearchDrawer(srData[s]).el);
            });
        }

        if (brKeys.length) {
            drawer.body.appendChild(dom.node("div", { class: "hxs section-hdr op5 pl10", text: "Brands [" + brKeys.length + "]" }));
            brKeys.forEach(function (b) {
                drawer.body.appendChild(BrandDrawer(brData[b]).el);
            });
        }
    }

    var d = new Drawer({
        caption: json.name,
        icon: json.icon || false,
        height: false,
        beforeOpen: function (drawer) { drawer.title.classList.add("raised-xs"); },
        onClose: function (drawer) { _isOpen = false; drawer.title.classList.remove("raised-xs"); },
        onOpen: function (drawer) { _isOpen = true; renderBody(drawer); }
    });

    // live-update when this layout's collections change
    layout.on("changed", function () {
        updateMeta();
        if (_isOpen) renderBody(d);
    });

    // title meta
    var metaSpan = dom.node("span", { class: "meta" });
    d.caption.after(metaSpan);
    updateMeta();
    if (json.desc) {
        var descSpan = dom.node("span", { class: "meta", text: json.desc });
        metaSpan.after(descSpan);
    }

    return d;
}

// --- Open button ---
dom.on(btnOpen, "click", function () {
    warp.load();
});

// --- Refresh ---
this.refresh = async function () {
    listEl.innerHTML = "";
    var count = 0;

    for (var name in lists.instances.layouts) {
        count++;
        var layout = lists.instances.layouts[name];
        listEl.appendChild(LayoutDrawer(layout).el);
    }

    headingEl.textContent = "Layouts [" + count + "]";
};

// --- Auto-refresh on layout events ---
warp.on("layoutLoad", function () { self.refresh(); });
warp.on("layoutUnload", function () { self.refresh(); });
warp.on("layoutChanged", function () { self.refresh(); });

// --- Electron close ---
if (typeof electronAPI !== "undefined") {
    app.win.on("close", function () { electronAPI.close(); });
}

this.refresh();

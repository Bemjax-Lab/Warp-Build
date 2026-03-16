var self = this;
var headerEl = dom.query(".srinfo-header");
var detailsEl = dom.query(".srinfo-details");
var actionsEl = dom.query(".srinfo-actions");

var currentName = null;
var currentLayout = null;

function render() {
    if (!currentName || !currentLayout) return;
    var layout = lists.instances.layouts[currentLayout];
    if (!layout) return;

    layout.search(currentName).then(function (sr) {
        if (!sr) return;
        var srJson = sr.json();

        app.win.options("caption", srJson.name);

        headerEl.innerHTML = "";
        headerEl.appendChild(dom.node("div", { class: "name tlg", text: srJson.name }));
        headerEl.appendChild(dom.node("div", { class: "layout-name", text: "Layout: " + currentLayout }));
        if (srJson.desc) headerEl.appendChild(dom.node("div", { class: "desc", text: srJson.desc }));

        detailsEl.innerHTML = "";
        var skip = { name: 1, layout: 1, desc: 1, query: 1, item: 1, events: 1, html: 1 };
        for (var k in srJson) {
            if (!srJson.hasOwnProperty(k) || skip[k]) continue;
            var val = srJson[k];
            if (val === undefined || val === null || val === false) continue;
            if (typeof val === "function") val = "fn()";
            else if (typeof val === "object") val = JSON.stringify(val);
            else val = String(val);
            var row = dom.node("div", { class: "srinfo-row" });
            row.appendChild(dom.node("span", { class: "key", text: k }));
            row.appendChild(dom.node("span", { text: val }));
            detailsEl.appendChild(row);
        }

        // Show which functions are defined
        var fns = ["query", "item", "events"].filter(function (f) { return typeof srJson[f] === "function"; });
        if (fns.length) {
            var row = dom.node("div", { class: "srinfo-row" });
            row.appendChild(dom.node("span", { class: "key", text: "hooks" }));
            row.appendChild(dom.node("span", { text: fns.join(", ") }));
            detailsEl.appendChild(row);
        }

        actionsEl.innerHTML = "";
        var btnRemove = dom.node("button", { class: "xs rsm", text: "Remove" });
        dom.on(btnRemove, "click", function () {
            warp.gui.confirm('Remove search "' + currentName + '" from ' + currentLayout + '?').then(function (ok) {
                if (!ok) return;
                layout.remove("searches", currentName).then(function () {
                    warp.gui.toast('Search "' + currentName + '" removed');
                    headerEl.innerHTML = '<div class="op5 tsm">Search removed</div>';
                    detailsEl.innerHTML = "";
                    actionsEl.innerHTML = "";
                });
            });
        });
        actionsEl.appendChild(btnRemove);
    });
}

this.scope = function (name) {
    if (name.indexOf(".") !== -1) {
        var parts = name.split(".");
        currentLayout = parts[0];
        currentName = parts[1];
    } else {
        currentName = name;
        for (var ln in lists.instances.layouts) { currentLayout = ln; break; }
    }
    render();
    app.show();
};

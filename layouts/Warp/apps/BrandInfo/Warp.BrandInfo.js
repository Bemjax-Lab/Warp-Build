var self = this;
var headerEl = dom.query(".brinfo-header");
var detailsEl = dom.query(".brinfo-details");
var actionsEl = dom.query(".brinfo-actions");

var currentName = null;
var currentLayout = null;

function renderColors(container, colors, prefix) {
    for (var section in colors) {
        if (!colors.hasOwnProperty(section)) continue;
        var val = colors[section];
        if (typeof val === "object" && val !== null) {
            var sec = dom.node("div", { class: "brinfo-color-section" });
            sec.appendChild(dom.node("div", { class: "section-title", text: (prefix ? prefix + "." : "") + section }));
            for (var prop in val) {
                if (!val.hasOwnProperty(prop)) continue;
                var row = dom.node("div", { class: "brinfo-row" });
                row.appendChild(dom.node("span", { class: "key", text: prop }));
                var swatch = dom.node("span", { class: "brinfo-color-swatch" });
                swatch.style.background = val[prop];
                row.appendChild(swatch);
                row.appendChild(dom.node("span", { text: val[prop] }));
                sec.appendChild(row);
            }
            container.appendChild(sec);
        } else {
            var row = dom.node("div", { class: "brinfo-row" });
            row.appendChild(dom.node("span", { class: "key", text: section }));
            row.appendChild(dom.node("span", { text: String(val) }));
            container.appendChild(row);
        }
    }
}

function render() {
    if (!currentName || !currentLayout) return;
    var layout = lists.instances.layouts[currentLayout];
    if (!layout) return;

    layout.brand(currentName).then(function (br) {
        if (!br) return;
        var brJson = br.json();

        app.win.options("caption", brJson.name);

        headerEl.innerHTML = "";
        headerEl.appendChild(dom.node("div", { class: "name tlg", text: brJson.name }));
        headerEl.appendChild(dom.node("div", { class: "layout-name", text: "Layout: " + currentLayout }));
        if (brJson.short) headerEl.appendChild(dom.node("div", { class: "desc", text: "Short: " + brJson.short }));
        if (brJson.description) headerEl.appendChild(dom.node("div", { class: "desc", text: brJson.description }));

        detailsEl.innerHTML = "";
        var skip = { name: 1, layout: 1, short: 1, description: 1, colors: 1, family: 1, test: 1 };
        for (var k in brJson) {
            if (!brJson.hasOwnProperty(k) || skip[k]) continue;
            var val = brJson[k];
            if (val === undefined || val === null || val === false) continue;
            if (typeof val === "function") val = "fn()";
            else if (typeof val === "object") val = JSON.stringify(val);
            else val = String(val);
            var row = dom.node("div", { class: "brinfo-row" });
            row.appendChild(dom.node("span", { class: "key", text: k }));
            row.appendChild(dom.node("span", { text: val }));
            detailsEl.appendChild(row);
        }

        if (typeof brJson.test === "function") {
            var row = dom.node("div", { class: "brinfo-row" });
            row.appendChild(dom.node("span", { class: "key", text: "test" }));
            row.appendChild(dom.node("span", { text: "fn()" }));
            detailsEl.appendChild(row);
        }

        if (brJson.colors) renderColors(detailsEl, brJson.colors);

        actionsEl.innerHTML = "";
        var btnRemove = dom.node("button", { class: "xs rsm", text: "Remove" });
        dom.on(btnRemove, "click", function () {
            warp.gui.confirm('Remove brand "' + currentName + '" from ' + currentLayout + '?').then(function (ok) {
                if (!ok) return;
                layout.remove("brands", currentName).then(function () {
                    warp.gui.toast('Brand "' + currentName + '" removed');
                    headerEl.innerHTML = '<div class="op5 tsm">Brand removed</div>';
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

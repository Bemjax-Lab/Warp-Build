var self = this;
var headerEl = dom.query(".ftinfo-header");
var detailsEl = dom.query(".ftinfo-details");
var actionsEl = dom.query(".ftinfo-actions");

var currentName = null;
var currentLayout = null;

function render() {
    if (!currentName || !currentLayout) return;
    var layout = lists.instances.layouts[currentLayout];
    if (!layout) return;

    layout.fileType(currentName).then(function (ft) {
        if (!ft) return;
        var ftJson = ft.json();

        app.win.options("caption", "*." + currentName);

        headerEl.innerHTML = "";
        var nameRow = dom.node("div", { class: "name tlg" });
        if (ftJson.color) {
            var dot = dom.node("span", { class: "ftinfo-color" });
            dot.style.background = ftJson.color;
            nameRow.appendChild(dot);
        }
        nameRow.appendChild(dom.node("span", { text: "*." + ftJson.name }));
        headerEl.appendChild(nameRow);
        headerEl.appendChild(dom.node("div", { class: "layout-name", text: "Layout: " + currentLayout }));

        detailsEl.innerHTML = "";
        var skip = { name: 1, layout: 1, color: 1 };
        for (var k in ftJson) {
            if (!ftJson.hasOwnProperty(k) || skip[k]) continue;
            var val = ftJson[k];
            if (val === undefined || val === null || val === false) continue;
            if (typeof val === "function") val = "fn()";
            else if (typeof val === "object") val = JSON.stringify(val);
            else val = String(val);
            var row = dom.node("div", { class: "ftinfo-row" });
            row.appendChild(dom.node("span", { class: "key", text: k }));
            row.appendChild(dom.node("span", { text: val }));
            detailsEl.appendChild(row);
        }

        actionsEl.innerHTML = "";
        var btnRemove = dom.node("button", { class: "xs rsm", text: "Remove" });
        dom.on(btnRemove, "click", function () {
            warp.gui.confirm('Remove file type "' + currentName + '" from ' + currentLayout + '?').then(function (ok) {
                if (!ok) return;
                layout.remove("fileTypes", currentName).then(function () {
                    warp.gui.toast('FileType "' + currentName + '" removed');
                    headerEl.innerHTML = '<div class="op5 tsm">FileType removed</div>';
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

var $ = function(cls) { return app.el.querySelector("." + cls); };
var counter = 0;
var stateLabels = { 0: "hidden", 1: "restored", 2: "minimized", 3: "maximized", 4: "fullscreen" };

function refreshMgrs() {
    var sel = $("wb-mgr");
    var prev = sel.value;
    sel.innerHTML = "";
    Object.keys(warp.gui.managers).forEach(function(n) {
        sel.appendChild(warp.dom.node("option", { value: n, text: n }));
    });
    if (prev && sel.querySelector('option[value="' + prev + '"]')) sel.value = prev;
}

function refreshParents() {
    var sel = $("wb-parent");
    var prev = sel.value;
    sel.innerHTML = "";
    sel.appendChild(warp.dom.node("option", { value: "", text: "(viewport)" }));
    var mgrName = $("wb-mgr").value;
    var mgr = warp.gui.managers[mgrName];
    if (mgr && mgr.windows) {
        Object.keys(mgr.windows).forEach(function(n) {
            sel.appendChild(warp.dom.node("option", { value: n, text: n }));
        });
    }
    if (prev && sel.querySelector('option[value="' + prev + '"]')) sel.value = prev;
}

function refreshWins() {
    refreshParents();
    var list = $("wb-list");
    list.innerHTML = "";
    var mgrName = $("wb-mgr").value;
    var mgr = warp.gui.managers[mgrName];
    if (!mgr || !mgr.windows) return;
    Object.values(mgr.windows).forEach(function(win) {
        var st = stateLabels[win.options('state')] || win.options('state');
        list.appendChild(warp.dom.node("div", { class: "win-row", children: [
            { node: "span", class: "wname", text: win.name },
            { node: "span", class: "wstate", text: st },
            { node: "button", html: '<span class="icon icon-eye"></span>', title: "show",
              click: function() { win.show(); setTimeout(refreshWins, 100); } },
            { node: "button", html: '<span class="icon icon-minus"></span>', title: "minimize",
              click: function() { win.state(2); setTimeout(refreshWins, 100); } },
            { node: "button", class: "s5", html: '<span class="icon icon-close"></span>', title: "kill",
              click: function() { mgr.kill(win); refreshWins(); } }
        ]}));
    });
}

$("wb-new-mgr").addEventListener("click", async function() {
    var name = "mgr-" + (++counter);
    await warp.gui.manager({ name: name });
    refreshMgrs();
    $("wb-mgr").value = name;
});

$("wb-go").addEventListener("click", function() {
    var mgrName = $("wb-mgr").value;
    var mgr = warp.gui.managers[mgrName];
    if (!mgr) return;
    var name = $("wb-name").value.trim() || ("win-" + (++counter));
    var parent = $("wb-parent").value || undefined;
    var to = { x: $("wb-tx").value, y: $("wb-ty").value };
    if (parent) to.parent = parent;
    var maxw = $("wb-maxw").value.trim();
    var maxh = $("wb-maxh").value.trim();
    mgr.win({
        name: name,
        caption: $("wb-cap").value || name,
        image: $("wb-img").value.trim() || "",
        width: parseInt($("wb-w").value) || 300,
        height: parseInt($("wb-h").value) || 200,
        x: parseInt($("wb-x").value) || 0,
        y: parseInt($("wb-y").value) || 0,
        minWidth: parseInt($("wb-minw").value) || 0,
        minHeight: parseInt($("wb-minh").value) || 0,
        maxWidth: maxw ? parseInt(maxw) : false,
        maxHeight: maxh ? parseInt(maxh) : false,
        state: parseInt($("wb-state").value),
        headless: $("wb-headless").checked,
        draggable: $("wb-draggable").checked,
        scrollable: $("wb-scrollable").checked,
        scalable: $("wb-scalable").checked,
        keepRatio: $("wb-keepRatio").checked,
        close: $("wb-close").checked,
        minimize: $("wb-minimize").checked,
        maximize: $("wb-maximize").checked,
        destroyOnHide: $("wb-destroyOnHide").checked,
        activateOnShow: $("wb-activateOnShow").checked,
        backdrop: $("wb-backdrop").checked,
        backdropCloses: $("wb-backdropCloses").checked,
        backdropOpacity: parseFloat($("wb-bdop").value) || 0.7,
        classes: $("wb-classes").value.trim(),
        anchor: {
            from: { x: $("wb-fx").value, y: $("wb-fy").value },
            to: to
        }
    });
    $("wb-name").value = "";
    refreshWins();
});

$("wb-clear").addEventListener("click", function() {
    var mgrName = $("wb-mgr").value;
    var mgr = warp.gui.managers[mgrName];
    if (!mgr) return;
    Object.values(mgr.windows).forEach(function(win) { mgr.kill(win); });
    refreshWins();
});

$("wb-mgr").addEventListener("change", refreshWins);
refreshMgrs();
refreshWins();

var titles = { desc: "Warp CSS", scaffold: "Scaffolding", controls: "Controls", icons: "Icon Set", spacing: "Spacing & Elevation", colours: "Colours & Text", methods: "User Facing Methods" };
var titleEl = app.el.querySelector(".tab-title");
var btns = app.el.querySelectorAll(".tab-btn");
var panels = app.el.querySelectorAll(".tab-panel");

btns[0].classList.add("active");

btns.forEach(function (btn) {
    btn.addEventListener("click", function () {
        var tab = btn.getAttribute("data-tab");
        titleEl.textContent = titles[tab] || tab;
        btns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        panels.forEach(function (p) {
            p.classList.toggle("open", p.getAttribute("data-panel") === tab);
        });
    });
});

// populate icon grid
var icons = [
    "home","search","gear","sliders","user","users","star","heart",
    "bell","clock","calendar","tag","bookmark","thumbtack","link","globe",
    "filter","sort","bolt","magic","key","shield",
    "info","warn","check","check-circle","close","circle-xmark","ban","question",
    "exclamation","eye","eye-off","lock","unlock",
    "plus","minus","edit","pen","save","trash","copy","paste","cut",
    "download","upload","refresh","undo","redo","print","share","external",
    "file","file-lines","file-code","file-image","file-pdf","folder","folder-open","folder-tree",
    "hard-drive","server","database","cloud","floppy","box","cabinet",
    "window","layer-group","table-cells","columns","bars","grip","ellipsis","palette","image","puzzle","sidebar",
    "arrow-up","arrow-down","arrow-left","arrow-right",
    "chevron-up","chevron-down","chevron-left","chevron-right",
    "play","pause","stop","forward","backward","volume","music","camera","video",
    "code","terminal","bug","wrench","hammer","plug","power-off",
    "circle","square","list","list-check","sitemap","chart-bar","chart-line","chart-pie"
];

var grid = app.el.querySelector(".icon-grid");
icons.forEach(function (name) {
    var card = warp.dom.node("div", { class: "icon-card" });
    card.innerHTML = '<span class="icon icon-' + name + ' ic op7"></span><span class="il op4">' + name + '</span>';
    grid.appendChild(card);
});

// ── methods tab handlers ─────────────────────────────────────────
var $ = function (cls) { return app.el.querySelector("." + cls); };

$("gm-toast").addEventListener("click", function () {
    warp.gui.toast($("gm-text").value.trim() || "Hello from Warp!");
});

$("gm-error").addEventListener("click", function () {
    warp.gui.error("Something went wrong");
});

$("gm-alert").addEventListener("click", function () {
    warp.gui.alert("Heads up!");
});

$("gm-confirm").addEventListener("click", async function () {
    var ok = await warp.gui.confirm("Are you sure?");
    warp.gui.toast("Confirm: " + ok);
});

$("gm-input").addEventListener("click", async function () {
    var val = await warp.gui.input("default", "Enter a value:");
    warp.gui.toast("Input: " + val);
});

$("gm-destroy").addEventListener("click", async function () {
    var names = Object.keys(warp.lists.instances.layouts);
    var nonWarp = names.filter(function (n) { return n !== "Warp"; });
    if (!nonWarp.length) { warp.gui.error("No non-Warp layouts loaded to destroy"); return; }
    var name = nonWarp[0];
    var layout = await warp.layout(name);
    var appNames = Object.keys(await layout.app());
    var msg = "Destroy layout '" + name + "'";
    if (appNames.length) msg += " and its " + appNames.length + " app" + (appNames.length > 1 ? "s" : "") + " (" + appNames.join(", ") + ")";
    msg += "?";
    var ok = await warp.gui.confirm(msg);
    if (!ok) return;
    await layout.destroy();
    warp.gui.toast("Layout '" + name + "' destroyed");
});

$("gm-reload").addEventListener("click", async function () {
    var name = "Test";
    var existing = warp.lists.instances.layouts[name];
    if (existing) {
        var ok = await warp.gui.confirm("Layout '" + name + "' is already loaded. Destroy and reload it?");
        if (!ok) return;
        await existing.destroy();
    }
    await warp.load("../dist/Test.layout");
    warp.gui.toast("Layout '" + name + "' reloaded");
});

var self = this;
var panelEl = dom.query(".panel");
var tabBtns = dom.queryAll(".tabs button");
var activeTab = "mounted";

var typeIcons = {
    object: "database-2",
    store: "archive",
    http: "cloud"
};

function driveIcon(name, type) {
   
    return dom.node("div", {
        class: "p10 tc rmd",
        style: "cursor:pointer;opacity:0;transform:translateX(100px)",
        html: '<div class="icon icon-hard-drive" style="font-size:64px;position:relative;z-index:0"></div>'
            + '<div class="fr tsm" style="color:white; margin-top:-35px;position:relative;z-index:1;padding:3px;background:black;text-transform:uppercase">' + type + '</div>'
            + '<div class="" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + name + '</div>'
    });
}

function renderMounted() {
    panelEl.innerHTML = "";
    var drives = lists.instances.drives;
    for (var key in drives) {
        var d = drives[key];
        panelEl.appendChild(driveIcon(d.name, d.type));
    }
}


function renderTypes() {
    panelEl.innerHTML = "";
    for (var type in lists.driveTypes) {
        panelEl.appendChild(driveIcon(type, type));
    }
}

function animateIn() {
    var icons = Array.from(panelEl.children);
    if (!icons.length) return;
    warp.to.tween(icons, { duration: .3, x: 0, opacity: 1, stagger: 60, ease: ease.outQuad });
}

var badgeMounted = dom.query(".badge-mounted");
var badgeTypes = dom.query(".badge-types");

function updateBadges() {
    badgeMounted.textContent = Object.keys(lists.instances.drives).length;
    badgeTypes.textContent = Object.keys(lists.driveTypes).length;
}

function render() {
    if (activeTab === "mounted") renderMounted();
    else renderTypes();
    updateBadges();
    animateIn();
}

tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
        tabBtns.forEach(function (b) { b.classList.remove("clear"); });
        btn.classList.add("clear");
        activeTab = btn.getAttribute("data-tab");
        render();
    });
});

var lastCount = -1;
function check() {
    var count = Object.keys(lists.instances.drives).length;
    if (count !== lastCount) { lastCount = count; render(); }
}

check();
var poll = setInterval(check, 2000);
app.win.on("hide", function () { clearInterval(poll); });
app.win.on("show", function () { check(); poll = setInterval(check, 2000); });
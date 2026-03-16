var self = this;
var input = dom.query(".find-input");
var resultsEl = dom.query(".find-results");
var debounce = 0;
var drawers = {};

// --- SearchDrawer: one per search provider ---
function SearchDrawer(search) {
    var sj = search.json();
    var isOpen = true;
    var listEl = dom.node("div");

    var el = dom.node("div", { class: "find-drawer" });

    var head = dom.node("div", { class: "find-head" });
    if (sj.icon) head.appendChild(dom.node("span", { class: "icon " + sj.icon }));
    var caption = dom.node("span", { class: "caption tl-5", text: sj.name });
    var count = dom.node("span", { class: "meta", text: "" });
    var caret = dom.node("span", { class: "icon icon-chevron-right caret open" });
    var desc = sj.desc ? dom.node("span", { class: "meta txs", text: sj.desc }) : null;
    head.appendChild(caption);
    if (desc) head.appendChild(desc);
    head.appendChild(count);
    head.appendChild(caret);

    var body = dom.node("div", { class: "find-body open" });
    body.appendChild(listEl);

    el.appendChild(head);
    el.appendChild(body);

    dom.on(head, "click", function () {
        isOpen = !isOpen;
        caret.classList.toggle("open", isOpen);
        body.classList.toggle("open", isOpen);
    });

    async function runQuery(text) {
        listEl.innerHTML = "";
        count.textContent = "";
        var results = await Promise.resolve(sj.query(text));
        if (!results || !results.length) {
            listEl.innerHTML = '<div class="find-no">No results</div>';
            count.textContent = "(0)";
            return;
        }
        count.textContent = "(" + results.length + ")";
        results.forEach(function (data) {
            var item = document.createElement("div");
            item.classList.add("find-item", "tsm", "pl10");
            sj.item(data, item, text);
            listEl.appendChild(item);
        });
    }

    return { el: el, runQuery: runQuery, name: sj.name };
}

// --- Build drawers for all available searches ---
var building = false;
async function buildDrawers() {
    if (building) return;
    building = true;
    resultsEl.innerHTML = "";
    drawers = {};
    for (var ln in lists.instances.layouts) {
        var lay = lists.instances.layouts[ln];
        var json = lay.json();
        for (var sn in json.searches) {
            if (!lists.instances.searches[ln + "." + sn]) {
                await lay.search(json.searches[sn]);
            }
        }
        var searches = await lay.search();
        for (var sn in searches) {
            var d = SearchDrawer(searches[sn]);
            drawers[sn] = d;
            resultsEl.appendChild(d.el);
        }
    }
    building = false;
}

// --- Run all drawers ---
async function runAll(text) {
    for (var k in drawers) drawers[k].runQuery(text);
}

// --- Debounced input ---
dom.on(input, "input", function () {
    clearTimeout(debounce);
    var text = input.value.trim();
    if (!text) {
        resultsEl.classList.add("hidden");
        return;
    }
    resultsEl.classList.remove("hidden");
    debounce = setTimeout(function () {
        clearActive();
        runAll(text);
    }, 200);
});

// --- Keyboard navigation ---
var activeIdx = -1;

function getItems() {
    return resultsEl.querySelectorAll(".find-item");
}

function setActive(idx) {
    var items = getItems();
    if (!items.length) return;
    if (activeIdx >= 0 && activeIdx < items.length) items[activeIdx].classList.remove("active");
    activeIdx = idx;
    if (activeIdx < 0) activeIdx = items.length - 1;
    if (activeIdx >= items.length) activeIdx = 0;
    items[activeIdx].classList.add("active");
    items[activeIdx].scrollIntoView({ block: "nearest" });
}

function clearActive() {
    var items = getItems();
    if (activeIdx >= 0 && activeIdx < items.length) items[activeIdx].classList.remove("active");
    activeIdx = -1;
}

dom.on(resultsEl, "mousemove", function (e) {
    var item = e.target.closest(".find-item");
    if (!item) return;
    var items = getItems();
    for (var i = 0; i < items.length; i++) {
        if (items[i] === item) { setActive(i); break; }
    }
});

dom.on(input, "keydown", function (e) {
    if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(activeIdx + 1);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(activeIdx - 1);
    } else if (e.key === "Enter") {
        var items = getItems();
        if (activeIdx >= 0 && activeIdx < items.length) {
            e.preventDefault();
            items[activeIdx].click();
        }
    }
});



// --- Rebuild when layouts change ---
//we should add checking here and event removal....either on win events or on layout events
//
warp.on("layoutLoad", function () { buildDrawers(); });
warp.on("layoutUnload", function () { buildDrawers(); });
warp.on("layoutChanged", function () { buildDrawers(); });

app.win.on("show", function () {
    input.focus();
    input.select();
});

buildDrawers();

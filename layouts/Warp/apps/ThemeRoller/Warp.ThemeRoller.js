var $ = function(cls) { return app.el.querySelector("." + cls); };
var host = warp.gui.host;
var cs = getComputedStyle(warp.gui.el);
var tracked = [];

function toHex(str) {
    str = str.trim();
    if (str.startsWith("#")) {
        if (str.length === 4) return "#" + str[1]+str[1]+str[2]+str[2]+str[3]+str[3];
        return str.slice(0, 7);
    }
    var m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (m) return "#" + ((1<<24)+(+m[1]<<16)+(+m[2]<<8)+(+m[3])).toString(16).slice(1);
    var d = document.createElement("div");
    d.style.color = str;
    document.body.appendChild(d);
    var c = getComputedStyle(d).color;
    document.body.removeChild(d);
    var m2 = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (m2) return "#" + ((1<<24)+(+m2[1]<<16)+(+m2[2]<<8)+(+m2[3])).toString(16).slice(1);
    return "#000000";
}

var groups = [
    ["Default (s0)", [["--defaultColor","Color"],["--defaultBg","Bg"],["--defaultLight","Light"],["--defaultDark","Dark"]]],
    ["Primary (s1)", [["--primaryColor","Color"],["--primaryBg","Bg"],["--primaryLight","Light"],["--primaryDark","Dark"]]],
    ["Secondary (s2)", [["--secondaryColor","Color"],["--secondaryBg","Bg"],["--secondaryLight","Light"],["--secondaryDark","Dark"]]],
    ["Success (s3)", [["--successColor","Color"],["--successBg","Bg"],["--successLight","Light"],["--successDark","Dark"]]],
    ["Warning (s4)", [["--warningColor","Color"],["--warningBg","Bg"],["--warningLight","Light"],["--warningDark","Dark"]]],
    ["Danger (s5)", [["--dangerColor","Color"],["--dangerBg","Bg"],["--dangerLight","Light"],["--dangerDark","Dark"]]],
    ["Link (s6)", [["--linkColor","Color"],["--linkBg","Bg"],["--linkLight","Light"],["--linkDark","Dark"]]],
    ["Text & Items", [["--textBg","Text Bg"],["--textColor","Text"],["--itemBg","Item Bg"],["--itemColor","Item"]]],
    ["Window Head", [["--winHeadBg","Bg"],["--winHeadColor","Color"],["--winHeadActiveBg","Active Bg"],["--winHeadActiveColor","Active"]]],
    ["Window Body", [["--winBodyBg","Bg"],["--winBodyColor","Color"],["--winBodyActiveBg","Active Bg"],["--winBodyActiveColor","Active"]]]
];

var colorEl = $("sr-colors");
groups.forEach(function(g) {
    colorEl.appendChild(warp.dom.node("div", { class: "sec", text: g[0] }));

    var row = warp.dom.node("div", { class: "r4", style: "gap:8px" });
    g[1].forEach(function(v) {
        var varName = v[0], label = v[1];
        var cur = toHex(cs.getPropertyValue(varName));
        var hex = warp.dom.node("span", { class: "hex", text: cur });
        var inp = warp.dom.node("input", { type: "color", value: cur, input: function() {
            host.style.setProperty(varName, inp.value);
            hex.textContent = inp.value;
        }});
        var cv = warp.dom.node("div", { class: "cv" });
        cv.appendChild(warp.dom.node("label", { text: label }));
        cv.appendChild(inp);
        cv.appendChild(hex);
        row.appendChild(cv);
        tracked.push({ name: varName, input: inp, hex: hex });
    });
    colorEl.appendChild(row);
});

// ── presets (from gui.skins) ─────────────────────────────────────
var presetSel = $("sr-preset");
Object.keys(warp.gui.skins).forEach(function (name) {
    presetSel.appendChild(warp.dom.node("option", { value: name, text: name }));
});

function syncInputs() {
    tracked.forEach(function (t) {
        var cur = toHex(cs.getPropertyValue(t.name));
        t.input.value = cur;
        t.hex.textContent = cur;
    });
}

function clearOverrides() {
    tracked.forEach(function (t) { host.style.removeProperty(t.name); });
}

$("sr-apply").addEventListener("click", function () {
    var name = presetSel.value;
    if (name) {
        clearOverrides();
        warp.gui.skin(name);
        setTimeout(syncInputs, 50);
    }
});

$("sr-reset").addEventListener("click", function() {
    clearOverrides();
    warp.gui.skin("dark");
    setTimeout(syncInputs, 50);
});

$("sr-export").addEventListener("click", function() {
    var css = ":host {\n";
    tracked.forEach(function(t) {
        css += "    " + t.name + ": " + t.input.value + ";\n";
    });
    css += "}";
    navigator.clipboard.writeText(css);
    $("sr-export").textContent = "Copied!";
    setTimeout(function() { $("sr-export").innerHTML = '<span class="icon icon-download"></span> Export CSS'; }, 1500);
});

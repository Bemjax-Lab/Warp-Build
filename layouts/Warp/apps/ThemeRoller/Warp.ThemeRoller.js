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

// ── presets ──────────────────────────────────────────────────────
var presets = {
    light: {
        "--defaultColor": "#040e1a",
        "--defaultBg": "#e3e3e3",
        "--defaultLight": "#ffffff",
        "--defaultDark": "#c5c5c5",
        "--primaryColor": "#0a0a0a",
        "--primaryBg": "#ffa000",
        "--primaryLight": "#faa014",
        "--primaryDark": "#b97a13",
        "--secondaryColor": "#121213",
        "--secondaryBg": "#00f3e6",
        "--secondaryLight": "#1effff",
        "--secondaryDark": "#00d5c8",
        "--successColor": "#fffffa",
        "--successBg": "#449110",
        "--successLight": "#62af2a",
        "--successDark": "#267300",
        "--warningColor": "#0e0e0e",
        "--warningBg": "#f59700",
        "--warningLight": "#ffbf1e",
        "--warningDark": "#e18300",
        "--dangerColor": "#ffffff",
        "--dangerBg": "#c20000",
        "--dangerLight": "#e01e1e",
        "--dangerDark": "#a40024",
        "--linkColor": "#3ca0d2",
        "--linkBg": "#ffffff",
        "--linkLight": "#ffffff",
        "--linkDark": "#e1e1e1",
        "--textBg": "#f0f0f0",
        "--textColor": "#1c1b1b",
        "--itemBg": "#f0f0f0",
        "--itemColor": "#1c1b1b",
        "--winHeadBg": "#b9b9b9",
        "--winHeadColor": "#1c1b1b",
        "--winHeadActiveBg": "#000000",
        "--winHeadActiveColor": "#ffffff",
        "--winBodyBg": "#d3d3d3",
        "--winBodyColor": "#1c1b1b",
        "--winBodyActiveBg": "#f0f0f0",
        "--winBodyActiveColor": "#1c1b1b"
    },
    dark: {
        "--defaultColor": "#e0e0e0",
        "--defaultBg": "#3a3a3a",
        "--defaultLight": "#555555",
        "--defaultDark": "#2a2a2a",
        "--primaryColor": "#0a0a0a",
        "--primaryBg": "#ffa000",
        "--primaryLight": "#faa014",
        "--primaryDark": "#b97a13",
        "--secondaryColor": "#121213",
        "--secondaryBg": "#00f3e6",
        "--secondaryLight": "#1effff",
        "--secondaryDark": "#00d5c8",
        "--successColor": "#fffffa",
        "--successBg": "#449110",
        "--successLight": "#62af2a",
        "--successDark": "#267300",
        "--warningColor": "#0e0e0e",
        "--warningBg": "#f59700",
        "--warningLight": "#ffbf1e",
        "--warningDark": "#e18300",
        "--dangerColor": "#ffffff",
        "--dangerBg": "#c20000",
        "--dangerLight": "#e01e1e",
        "--dangerDark": "#a40024",
        "--linkColor": "#60c8ff",
        "--linkBg": "#2a2a2a",
        "--linkLight": "#3a3a3a",
        "--linkDark": "#1a1a1a",
        "--textBg": "#1e1e1e",
        "--textColor": "#d8d8d8",
        "--itemBg": "#141414",
        "--itemColor": "#d0d0d0",
        "--winHeadBg": "#1e1e1e",
        "--winHeadColor": "#aaaaaa",
        "--winHeadActiveBg": "#0f0f0f",
        "--winHeadActiveColor": "#ffffff",
        "--winBodyBg": "#232323",
        "--winBodyColor": "#cccccc",
        "--winBodyActiveBg": "#1e1e1e",
        "--winBodyActiveColor": "#e0e0e0"
    },
    teal: {
        "--defaultColor": "#c8e6e0",
        "--defaultBg": "#000000",
        "--defaultLight": "#264e4a",
        "--defaultDark": "#122c2a",
        "--primaryColor": "#f5f5f5",
        "--primaryBg": "#005c4d",
        "--primaryLight": "#40e8cc",
        "--primaryDark": "#1fba9e",
        "--secondaryColor": "#0a1a18",
        "--secondaryBg": "#f0a030",
        "--secondaryLight": "#ffb84d",
        "--secondaryDark": "#d08a20",
        "--successColor": "#e8fff4",
        "--successBg": "#1e8c5a",
        "--successLight": "#28a870",
        "--successDark": "#147040",
        "--warningColor": "#0e1210",
        "--warningBg": "#e8a020",
        "--warningLight": "#f5b840",
        "--warningDark": "#c88810",
        "--dangerColor": "#ffffff",
        "--dangerBg": "#b83040",
        "--dangerLight": "#d04050",
        "--dangerDark": "#901828",
        "--linkColor": "#50d8c0",
        "--linkBg": "#122c2a",
        "--linkLight": "#1a3a38",
        "--linkDark": "#0a201e",
        "--textBg": "#0e2220",
        "--textColor": "#f1f3f3",
        "--itemBg": "#040606",
        "--itemColor": "#c1b31a",
        "--winHeadBg": "#000000",
        "--winHeadColor": "#80aaa2",
        "--winHeadActiveBg": "#000000",
        "--winHeadActiveColor": "#e0f5f0",
        "--winBodyBg": "#11354b",
        "--winBodyColor": "#b8d4cc",
        "--winBodyActiveBg": "#000000",
        "--winBodyActiveColor": "#d8f0e8"
    }
};

var presetSel = $("sr-preset");
Object.keys(presets).forEach(function (name) {
    presetSel.appendChild(warp.dom.node("option", { value: name, text: name }));
});

function applyPreset(p) {
    tracked.forEach(function (t) {
        if (p[t.name] !== undefined) {
            host.style.setProperty(t.name, p[t.name]);
            t.input.value = toHex(p[t.name]);
            t.hex.textContent = t.input.value;
        }
    });
}

$("sr-apply").addEventListener("click", function () {
    var name = presetSel.value;
    if (name && presets[name]) applyPreset(presets[name]);
});

$("sr-reset").addEventListener("click", function() {
    tracked.forEach(function(t) {
        host.style.removeProperty(t.name);
        var cur = toHex(cs.getPropertyValue(t.name));
        t.input.value = cur;
        t.hex.textContent = cur;
    });
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

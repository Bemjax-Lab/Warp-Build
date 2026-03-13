app.el.style.height = "100%";

var ed = null;

async function getEd() {
    if (!ed) ed = await warp.app("Warp.Editor");
    return ed;
}

function apply(opts) {
    getEd().then(function (e) {
        var editor = e && e.getEditor();
        if (editor) editor.updateOptions(opts);
    });
}

// theme
dom.on(".theme", "change", function () {
    getEd().then(function (e) { if (e) e.setTheme(dom.query(".theme").value); });
});

// font family
dom.on(".font", "change", function () {
    apply({ fontFamily: this.value });
});

// font size
dom.on(".font-size", "input", function () {
    this.nextElementSibling.textContent = this.value;
    apply({ fontSize: parseInt(this.value) });
});

// tab size
dom.on(".tab-size", "change", function () {
    apply({ tabSize: parseInt(this.value) });
});

// language
dom.on(".language", "change", function () {
    getEd().then(function (e) {
        if (e) e.setLanguage(dom.query(".language").value);
    });
});

// minimap
dom.on(".minimap", "change", function () {
    apply({ minimap: { enabled: this.checked } });
});

// word wrap
dom.on(".wordwrap", "change", function () {
    apply({ wordWrap: this.checked ? "on" : "off" });
});

// line numbers
dom.on(".linenums", "change", function () {
    apply({ lineNumbers: this.checked ? "on" : "off" });
});

// font ligatures
dom.on(".ligatures", "change", function () {
    apply({ fontLigatures: this.checked });
});

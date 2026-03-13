app.el.style.height = "100%";

var settingsBtn = dom.node("button", {
    class: "xs round clear inverted mr10",
    html: '<span class="icon icon-gear txl"></span>',
    click: function () { warp.app("EditorSettings").then(app=>app.show()) }
});
app.win.head.querySelector(".right").prepend(settingsBtn);

var iframe = dom.query(".editor");
var editor = null;
var CDN = "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs";
var ready = false;

iframe.addEventListener("load", function () {
    var doc = iframe.contentDocument;
    doc.open();
    doc.write(
        "<!DOCTYPE html><html><head>" +
        "<style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;}</style>" +
        "<script src='" + CDN + "/loader.js'><\/script>" +
        "</head><body><div id='editor' style='width:100%;height:100%'></div>" +
        "<script>" +
        "require.config({paths:{vs:'" + CDN + "'}});" +
        "require(['vs/editor/editor.main'],function(){" +
        "  window.editor=monaco.editor.create(document.getElementById('editor'),{" +
        "    value:'// hello world\\n'," +
        "    language:'javascript'," +
        "    theme:'vs-dark'," +
        "    automaticLayout:true," +
        "    minimap:{enabled:false}," +
        "    fontSize:13," +
        "    tabSize:4," +
        "    scrollBeyondLastLine:false" +
        "  });" +
        "  window.monaco=monaco;" +
        "  parent.postMessage('monaco-ready','*');" +
        "});" +
        "<\/script></body></html>"
    );
    doc.close();
});

window.addEventListener("message", function (e) {
    if (e.data === "monaco-ready") {
        editor = iframe.contentWindow.editor;
        ready = true;
    }
});

// trigger iframe load
iframe.src = "about:blank";

app.win.on("resize", function () {
    if (editor) editor.layout();
});

// ─── Public API ──────────────────────────────────────────
this.getEditor = function () { return editor; };
this.getMonaco  = function () { return iframe.contentWindow ? iframe.contentWindow.monaco : null; };
this.getValue   = function () { return editor ? editor.getValue() : ""; };
this.setValue    = function (v) { if (editor) editor.setValue(v); };
this.setLanguage = function (lang) {
    var m = iframe.contentWindow && iframe.contentWindow.monaco;
    if (editor && m) m.editor.setModelLanguage(editor.getModel(), lang);
};
this.setTheme = function (theme) {
    var m = iframe.contentWindow && iframe.contentWindow.monaco;
    if (m) m.editor.setTheme(theme);
};

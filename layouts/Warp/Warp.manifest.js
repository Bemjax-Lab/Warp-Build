({
    name: "Warp",
    version: 0.1,
    image: false,
    icon: "cabinet",
    desc: "Default Engine's layout bringing basic GUI functionality and control for runtime",
    defaultWin : {anchor :{
        from: { x: 'mid', y: 'mid' },
        to: { parent: null, x: 'mid', y: 'mid' }
    }},
    deps: [],
    apps: {},
    brands: {},
    fileTypes: {
        unknown: {
            name: "unknown",
            color: "rgb(0, 0, 0)",
            mime: "application/octet-stream",
            mode: "text"
        },
        layout: {
            name: "layout",
            color: "rgb(255, 140, 0)",
            mime: "application/zip",
            mode: false,
            commit: function(file) {
                console.log(file);
            }
        },
        js: {
            name: "js",
            color: "rgb(247, 223, 30)",
            mime: "text/javascript",
            mode: "javascript"
        },
        css: {
            name: "css",
            color: "rgb(38, 77, 228)",
            mime: "text/css",
            mode: "css"
        },
        html: {
            name: "html",
            color: "rgb(227, 76, 38)",
            mime: "text/html",
            mode: "html"
        }
    },
    searches: {
        Warp: {
            name: "layouts content",
            desc: "Searches for apps and file types across loaded layouts",
            placeholder: "Search apps, file types...",
            icon: "ri-search-line",
            html: '<small class="op5">Apps &amp; file types in loaded layouts</small>',
            query: async function(text) {
                var results = [];
                var q = (text || "").toLowerCase();
                var store = await warp.store("layouts");
                var all = await store.get();
                for (var ln in all) {
                    var layout = all[ln];
                    if (!layout || typeof layout !== "object") continue;
                    var apps = layout.apps || {};
                    for (var an in apps) {
                        var a = apps[an];
                        if (!q || an.toLowerCase().includes(q) || (a.desc || "").toLowerCase().includes(q)) {
                            results.push({ label: an, type: "app", layout: ln, desc: a.desc || "" });
                        }
                    }
                    var fts = layout.fileTypes || {};
                    for (var fn in fts) {
                        var f = fts[fn];
                        if (!q || fn.toLowerCase().includes(q) || (f.mime || "").toLowerCase().includes(q)) {
                            results.push({ label: fn, type: "fileType", layout: ln, desc: f.mime || "" });
                        }
                    }
                    var srs = layout.searches || {};
                    for (var sn in srs) {
                        var s = srs[sn];
                        if (!q || sn.toLowerCase().includes(q) || (s.desc || "").toLowerCase().includes(q)) {
                            results.push({ label: sn, type: "search", layout: ln, desc: s.desc || "" });
                        }
                    }
                    var brs = layout.brands || {};
                    for (var bn in brs) {
                        var b = brs[bn];
                        if (!q || bn.toLowerCase().includes(q) || (b.description || "").toLowerCase().includes(q)) {
                            results.push({ label: bn, type: "brand", layout: ln, desc: b.description || "" });
                        }
                    }
                }
                return results;
            },
            item: function(data, el) {
                var icons = { app: "ri-apps-line", fileType: "ri-file-type-line", search: "ri-search-line", brand: "ri-palette-line" };
                var labels = { app: "App", fileType: "FileType", search: "Search", brand: "Brand" };
                var infoApps = { app: "AppInfo", fileType: "FileTypeInfo", search: "SearchInfo", brand: "BrandInfo" };
                var icon = icons[data.type] || "ri-question-line";
                var typeLabel = labels[data.type] || data.type;
                el.innerHTML = '<div class="p5" style="cursor:pointer">'
                    + '<small class="op5">' + typeLabel + ' &middot; ' + data.layout + '</small><br>'
                    + '<span class="icon ' + icon + '"></span> '
                    + data.label
                    + (data.desc ? ' <small class="op5" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + data.desc + '</small>' : '')
                    + '</div>';
                el.addEventListener("click", function() {
                    var infoApp = infoApps[data.type];
                    if (infoApp) {
                        warp.app(infoApp).then(function(a) {
                            if (a && a.scope) a.scope(data.layout + "." + data.label);
                        });
                    }
                });
                return el;
            }
        }
    },
    onBeforeLoad: false,
    onLoad: false,
    onBeforeDestroy: false
})


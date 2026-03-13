({
    name: "Warp",
    version: 0.1,
    image: false,
    icon: "cabinet",
    desc: "Default Engine's layout bringing basic GUI functionality and control for runtime",
    win : {anchor :{
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
    searches: {},
    onBeforeLoad: false,
    onLoad: false,
    onBeforeDestroy: false
})

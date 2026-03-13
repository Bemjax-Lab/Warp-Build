({
    name: "Info",
    desc: "Lists loaded layouts and their contents",
    deps: false,
    layout: "Warp",
    brands: false,
    folder: {},
    win: {
        width: 600, height: 450, title: "Info", onHide: function (w) {
            if (window.electronAPI) {
                electronAPI.close();
            }
        }, anchor :{
        from: { x: 'mid', y: 'mid' },
        to: { parent: null, x: 'mid', y: 'mid' }
    }
    }
})

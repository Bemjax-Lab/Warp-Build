({
    name: "Drive",
    desc: "Lists mounted drives and their files",
    deps: false,
    layout: "Warp",
    brands: false,
    folder: {},
    win: {
        width: 520, height: 400, title: "Drive",
        anchor: {
            from: { x: 'mid', y: 'mid' },
            to: { parent: null, x: 'mid', y: 'mid' }
        }
    }
})
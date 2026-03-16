({
    name: "BrandInfo",
    desc: "Displays detailed info and actions for a brand",
    deps: false,
    layout: "Warp",
    brands: false,
    folder: {},
    win: {
        width: 320, height: 350, title: "Brand Info", state: 0,
        anchor: {
            from: { x: 'mid', y: 'mid' },
            to: { parent: null, x: 'mid', y: 'mid' }
        }
    }
})

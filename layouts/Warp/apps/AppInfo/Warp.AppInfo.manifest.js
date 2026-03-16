({
    name: "AppInfo",
    desc: "Displays detailed info and actions for a specific app",
    deps: false,
    layout: "Warp",
    brands: false,
    folder: {},
    win: {
        width: 340, height: 400, title: "App Info", state: 0,
        anchor: {
            from: { x: 'mid', y: 'mid' },
            to: { parent: null, x: 'mid', y: 'mid' }
        }
    }
})

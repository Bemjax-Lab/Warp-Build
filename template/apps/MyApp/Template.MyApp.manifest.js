({
    name: "MyApp",
    desc: "A sample app",
    layout: "Template",
    deps: false,
    brands: false,
    folder: {},
    win: {
        name: "app-MyApp",
        caption: "My App",
        width: 400,
        height: 300,
        scrollable: true,
        anchor: {
            from: { x: "mid", y: "mid" },
            to: { parent: null, x: "mid", y: "mid" }
        }
    }
})

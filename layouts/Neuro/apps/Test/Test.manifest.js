({
    name: "Test",
    desc: "View and edit a saved test",

    layout: "Neuro",
    win : {
        x :20,
        height:800,
        anchor: {
            from: { x: 'min', y: 'min' },
            to: { parent : "app-Tests", x: 'max', y: 'min' }
        }
    }

})

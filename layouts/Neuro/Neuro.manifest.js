({
    name: "Neuro",
    version: 0.1,
    image: "https://cdn.labmanager.com/assets/articleNo/32468/aImg/57726/scientists-may-have-found-how-to-diagnose-elusive-neuro-disorder-m.webp",
    desc: "Veterinary neurological localization and diagnostic layout",
    deps: [],
    brands: {},
    fileTypes: {},
    searches: {},
    onBeforeLoad: false,
    onLoad: function(layout) {
        setTimeout(function() {
            warp.app('Neuro.Welcome').then(app => app.show());
        }, 800);
    },
    onBeforeDestroy: false,
    defaultWin : {
        width: 420, height: 600,
        anchor: {
            from: { x: 'mid', y: 'mid' },
            to: { x: 'mid', y: 'mid' }
        }
    }
})

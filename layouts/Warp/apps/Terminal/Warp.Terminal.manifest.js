({
    name: "Terminal",
    desc: "In-browser terminal emulator",
    layout: "Warp",
    deps: false,
    brands: false,
    folder: {},
    win: { width: 640, height: 480, title: "Terminal", scrollable: false,
           minWidth: 320, minHeight: 240,
           onShow: function (e) {
               var inp = e.win.body.querySelector(".cmd-input");
               if (inp) inp.focus();
           }
}
})

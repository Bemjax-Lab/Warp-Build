({
    name: "EditorSettings",
    desc: "Settings for Monaco editor",
    layout: "Warp",
    deps: false,
    brands: false,
    folder: {},
    win: { width: 260, height: "auto", title: "Editor Settings", scrollable: false, backdrop :true,
           minWidth: 220, minHeight: 300, anchor : { from : { y : "mid"}, to : {   parent : "app-Editor" , y :"mid"  }     } }
})
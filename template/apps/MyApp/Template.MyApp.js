// app  — { body, win, el }
// dom  — { query, queryAll, on, off, node }
// warp — engine instance
// this — your public API

var heading = dom.query(".heading");
var btn = dom.query(".action-btn");

dom.on(btn, "click", function () {
    heading.textContent = "Clicked!";
});

// public API — callable by other apps via warp.app("MyApp")
this.greet = function (name) {
    heading.textContent = "Hello, " + name + "!";
};

var $ = function(cls) { return app.el.querySelector("." + cls); };

var output = $("output");
var input = $("cmd-input");
var MAX_HISTORY = 10;
var history = [];
var historyIndex = -1;

// --- load persisted history from prefs ---
(async function () {
    var saved = await warp.prefs("Terminal");
    if (saved) {
        for (var i = 0; i < MAX_HISTORY; i++) {
            if (saved[i] !== undefined && saved[i] !== null) history.push(saved[i]);
        }
    }
    historyIndex = history.length;
})();

function scrollToBottom() {
    output.scrollTop = output.scrollHeight;
}

// --- value formatting (shallow, for inline display) ---
function valToString(a) {
    if (a === null) return "null";
    if (a === undefined) return "undefined";
    if (typeof a === "function") return "[Function" + (a.name ? ": " + a.name : "") + "]";
    if (typeof a === "object") {
        var name = a.constructor && a.constructor.name;
        if (Array.isArray(a)) return "[Array(" + a.length + ")]";
        return "[" + (name || "Object") + "]";
    }
    return String(a);
}

// --- render a clickable value span ---
function valSpan(val) {
    if (val === null) return document.createTextNode("null");
    if (val === undefined) return document.createTextNode("undefined");

    if (typeof val === "function") {
        var fnLink = document.createElement("a");
        fnLink.className = "obj-link";
        fnLink.textContent = "[Function" + (val.name ? ": " + val.name : "") + "]";
        fnLink.addEventListener("click", function (e) {
            e.stopPropagation();
            conPrint("info", [val.toString()]);
        });
        return fnLink;
    }

    if (typeof val === "object") {
        var link = document.createElement("a");
        link.className = "obj-link";
        var n = val.constructor && val.constructor.name;
        link.textContent = Array.isArray(val) ? "[Array(" + val.length + ")]" : "[" + (n || "Object") + "]";
        link.addEventListener("click", function (e) {
            e.stopPropagation();
            expandObj(val);
        });
        return link;
    }

    var str = String(val);
    if (typeof val === "string" && str.length > 20) {
        var sLink = document.createElement("a");
        sLink.className = "obj-link";
        sLink.textContent = '"' + str.substring(0, 20) + '..." [String]';
        sLink.addEventListener("click", function (e) {
            e.stopPropagation();
            conPrint("info", [str]);
        });
        return sLink;
    }
    return document.createTextNode(JSON.stringify(val));
}

// --- expand object: render first-level props with clickable values ---
function expandObj(obj) {
    var keys;
    try { keys = Object.keys(obj); } catch (e) { conPrint("error", ["Cannot read properties"]); return; }

    if (Array.isArray(obj)) {
        if (obj.length === 0) { conPrint("info", ["[]"]); return; }
        obj.forEach(function (v, i) {
            var row = document.createElement("div");
            row.className = "info";
            var keyEl = document.createElement("span");
            keyEl.className = "prop-key-t";
            keyEl.textContent = "[" + i + "]: ";
            row.appendChild(keyEl);
            row.appendChild(valSpan(v));
            output.appendChild(row);
        });
    } else {
        if (keys.length === 0) { conPrint("info", ["{}"]); return; }
        keys.forEach(function (k) {
            var v;
            try { v = obj[k]; } catch (e) { v = "[error]"; }
            var row = document.createElement("div");
            row.className = "info";
            var keyEl = document.createElement("span");
            keyEl.className = "prop-key-t";
            keyEl.textContent = k + ": ";
            row.appendChild(keyEl);
            row.appendChild(valSpan(v));
            output.appendChild(row);
        });
    }
    scrollToBottom();
}

// --- print a line with clickable object links ---
function conPrint(level, args) {
    var line = document.createElement("div");
    line.className = level;

    args.forEach(function (a, i) {
        if (i > 0) line.appendChild(document.createTextNode(" "));
        if (a !== null && typeof a === "object") {
            line.appendChild(valSpan(a));
        } else if (typeof a === "function") {
            line.appendChild(valSpan(a));
        } else {
            line.appendChild(document.createTextNode(valToString(a)));
        }
    });

    output.appendChild(line);
    scrollToBottom();
}

// --- intercept console ---
var _con = { log: console.log, warn: console.warn, error: console.error, info: console.info };
console.log   = function () { _con.log.apply(console, arguments);   conPrint("log",   Array.from(arguments)); };
console.warn  = function () { _con.warn.apply(console, arguments);  conPrint("warn",  Array.from(arguments)); };
console.error = function () { _con.error.apply(console, arguments); conPrint("error", Array.from(arguments)); };
console.info  = function () { _con.info.apply(console, arguments);  conPrint("info",  Array.from(arguments)); };

// --- global error catching ---
window.addEventListener("error", function (e) {
    conPrint("error", ["Uncaught " + e.message]);
});
window.addEventListener("unhandledrejection", function (e) {
    conPrint("error", ["Unhandled rejection: " + (e.reason && e.reason.message || e.reason)]);
});

// --- persist history to prefs (rotating indices 0..9) ---
function saveHistory() {
    var start = Math.max(0, history.length - MAX_HISTORY);
    for (var i = 0; i < MAX_HISTORY; i++) {
        var val = history[start + i];
        warp.prefs("Terminal", i, val !== undefined ? val : null);
    }
}

// --- command execution (async) ---
async function execCommand(cmd) {
    if (!cmd) return;

    history.push(cmd);
    if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);
    historyIndex = history.length;
    saveHistory();

    conPrint("cmd", [cmd]);

    try {
        var result;
        try {
            result = await eval("(async function(){return(\n" + cmd + "\n)})()");
        } catch (e1) {
            result = await eval("(async function(){\n" + cmd + "\n})()");
        }
        if (result !== undefined) {
            if (result !== null && typeof result === "object") {
                conPrint("result", [result]);
            } else {
                conPrint("result", [valToString(result)]);
            }
        }
    } catch (e) {
        conPrint("error", [e.message || String(e)]);
    }
}

input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        var cmd = input.value.trim();
        execCommand(cmd);
        input.value = "";
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = history[historyIndex];
        }
    } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
            historyIndex++;
            input.value = history[historyIndex];
        } else {
            historyIndex = history.length;
            input.value = "";
        }
    } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        output.innerHTML = "";
    }
});

// click anywhere to focus input
app.el.addEventListener("click", function() { input.focus(); });

// fill win body
app.el.style.height = "100%";

input.focus();
conPrint("info", ["Warp Terminal ready."]);

this.exec = function(cmd) { return execCommand(cmd); };
this.clear = function() { output.innerHTML = ""; };
this.print = function(text, cls) { conPrint(cls || "result", [text]); };

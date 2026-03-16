var ICE_SERVERS = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" }
];

var pc          = null;
var channel     = null;
var msgHandlers = {};
var msgBuffer   = {};
var activeApps  = {};   // name → instance, tracked so we can destroy on disconnect

// ---- DOM ----
function el(id) { return app.el.querySelector("#" + id); }
function show(id) { el(id).classList.remove("hidden"); }
function hide(id) { el(id).classList.add("hidden"); }
function showScreen(name) {
    app.el.querySelectorAll(".screen").forEach(function (s) { s.classList.add("hidden"); });
    show("screen-" + name);
}

// ---- SDP helpers ----
function sdpEncode(desc) {
    return btoa(JSON.stringify({ type: desc.type, sdp: desc.sdp }));
}
function sdpDecode(text) {
    try { return JSON.parse(atob(text.trim())); } catch (e) { return null; }
}
function gatherSDP(conn) {
    return new Promise(function (resolve) {
        if (conn.iceGatheringState === "complete") { resolve(conn.localDescription); return; }
        var to = setTimeout(function () { resolve(conn.localDescription); }, 6000);
        conn.addEventListener("icegatheringstatechange", function fn() {
            if (conn.iceGatheringState === "complete") {
                conn.removeEventListener("icegatheringstatechange", fn);
                clearTimeout(to);
                resolve(conn.localDescription);
            }
        });
    });
}

// ---- open a mode app and track it ----
function openApp(name, cb) {
    warp.app(name).then(function (inst) {
        if (!inst) return;
        activeApps[name] = inst;
        if (cb) cb(inst);
    });
}

// ---- destroy all tracked mode apps ----
function closeAllApps() {
    Object.keys(activeApps).forEach(function (name) {
        try { activeApps[name].destroy(); } catch (e) {}
    });
    activeApps = {};
}

// ---- full disconnect + reset ----
function disconnect() {
    closeAllApps();
    msgHandlers = {};
    msgBuffer   = {};
    if (channel) { try { channel.close(); } catch (e) {} channel = null; }
    if (pc)      { try { pc.close();      } catch (e) {} pc      = null; }
    showScreen("start");
}

// ---- channel setup ----
function setupChannel(ch) {
    channel = ch;

    channel.onopen = function () {
        showScreen("connected");

        // Chat: auto-open on first incoming message
        msgHandlers["chat"] = function (msg) {
            openApp("Slice.Chat", function (c) { c.receive(msg); });
        };

        // Voice: incoming call
        msgHandlers["voice-request"] = function () {
            openApp("Slice.Voice", function (v) { v.incoming(); });
        };

        // Video: incoming call
        msgHandlers["video-request"] = function () {
            openApp("Slice.Video", function (v) { v.incoming(); });
        };
    };

    channel.onclose = function () { disconnect(); };

    channel.onmessage = function (e) {
        try {
            var msg = JSON.parse(e.data);
            if (msgHandlers[msg.type]) {
                msgHandlers[msg.type](msg);
            } else {
                if (!msgBuffer[msg.type]) msgBuffer[msg.type] = [];
                msgBuffer[msg.type].push(msg);
            }
        } catch (err) {}
    };
}

// ---- peer connection ----
function createPC() {
    if (pc) { try { pc.close(); } catch (e) {} }
    pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pc.ondatachannel = function (e) { setupChannel(e.channel); };
    pc.oniceconnectionstatechange = function () {
        if (pc.iceConnectionState === "failed") {
            warp.gui && warp.gui.error("Connection failed — peer unreachable");
            disconnect();
        }
    };
    return pc;
}

// ---- ROLE A: create offer ----
el("btn-create").addEventListener("click", function () {
    showScreen("offer");
    el("offer-text").value = "Generating…";
    el("offer-status").textContent = "";

    createPC();
    setupChannel(pc.createDataChannel("slice"));

    app.body.classList.add("disabled");
    pc.createOffer()
        .then(function (o) { return pc.setLocalDescription(o); })
        .then(function ()   { return gatherSDP(pc); })
        .then(function (desc) {
            el("offer-text").value = sdpEncode(desc);
            app.body.classList.remove("disabled");
        });
});

el("btn-copy-offer").addEventListener("click", function () {
    el("offer-text").select();
    document.execCommand("copy");
    el("btn-copy-offer").textContent = "Copied!";
    setTimeout(function () { el("btn-copy-offer").textContent = "Copy Offer"; }, 1500);
});

el("btn-connect").addEventListener("click", function () {
    var desc = sdpDecode(el("answer-input").value);
    if (!desc || desc.type !== "answer") {
        el("offer-status").textContent = "Invalid answer — paste again";
        return;
    }
    el("offer-status").textContent = "Connecting…";
    pc.setRemoteDescription(new RTCSessionDescription(desc))
        .catch(function (e) { el("offer-status").textContent = "Error: " + e.message; });
});

// ---- auto-paste on focus ----
function autoPaste(id) {
    el(id).addEventListener("focus", function () {
        if (!navigator.clipboard) return;
        navigator.clipboard.readText().then(function (text) {
            if (text && text.trim()) el(id).value = text.trim();
        }).catch(function () {});
    });
}

autoPaste("answer-input");
autoPaste("offer-input");

// ---- ROLE B: join ----
el("btn-join").addEventListener("click", function () { showScreen("join"); });

el("btn-gen-answer").addEventListener("click", function () {
    var desc = sdpDecode(el("offer-input").value);
    if (!desc || desc.type !== "offer") {
        el("join-status").textContent = "Invalid offer — paste again";
        return;
    }
    el("join-status").textContent = "Generating answer…";
    createPC();

    pc.setRemoteDescription(new RTCSessionDescription(desc))
        .then(function ()   { return pc.createAnswer(); })
        .then(function (a)  { return pc.setLocalDescription(a); })
        .then(function ()   { return gatherSDP(pc); })
        .then(function (answerDesc) {
            el("answer-text").value = sdpEncode(answerDesc);
            show("answer-ready-label");
            show("answer-text");
            show("btn-copy-answer");
            el("join-status").textContent = "Send the answer to peer A, then wait…";
        })
        .catch(function (e) { el("join-status").textContent = "Error: " + e.message; });
});

el("btn-copy-answer").addEventListener("click", function () {
    el("answer-text").select();
    document.execCommand("copy");
    el("btn-copy-answer").textContent = "Copied!";
    setTimeout(function () { el("btn-copy-answer").textContent = "Copy Answer"; }, 1500);
});

// ---- mode buttons ----
el("btn-voice").addEventListener("click", function () {
    openApp("Slice.Voice", function (v) { v.initiate(); });
});
el("btn-chat").addEventListener("click", function () {
    openApp("Slice.Chat", function (c) { c.open(); });
});
el("btn-video").addEventListener("click", function () {
    openApp("Slice.Video", function (v) { v.initiate(); });
});

// ---- disconnect button ----
el("btn-disconnect").addEventListener("click", disconnect);

// ---- public API ----
this.getPc     = function () { return pc; };
this.getChannel = function () { return channel; };
this.gatherSDP  = gatherSDP;

this.send = function (obj) {
    if (channel && channel.readyState === "open") channel.send(JSON.stringify(obj));
};

this.onMessage = function (type, fn) {
    msgHandlers[type] = fn;
    if (msgBuffer[type] && msgBuffer[type].length) {
        var pending = msgBuffer[type];
        delete msgBuffer[type];
        pending.forEach(fn);
    }
};

this.offMessage = function (type) { delete msgHandlers[type]; };

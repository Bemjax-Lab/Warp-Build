// ---- helpers ----
function el(id) { return app.el.querySelector("#" + id); }
function show(id) { el(id).classList.remove("hidden"); }
function hide(id) { el(id).classList.add("hidden"); }
function showScreen(name) {
    app.el.querySelectorAll(".screen").forEach(function(s) { s.classList.add("hidden"); });
    show("screen-" + name);
}

// ---- state ----
var pc = null;
var channel = null;

var ICE_SERVERS = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" }
];

// ---- gather full SDP (wait for ICE complete) ----
function gatherSDP(pc) {
    return new Promise(function(resolve) {
        if (pc.iceGatheringState === "complete") {
            resolve(pc.localDescription);
            return;
        }
        pc.addEventListener("icegatheringstatechange", function onState() {
            if (pc.iceGatheringState === "complete") {
                pc.removeEventListener("icegatheringstatechange", onState);
                resolve(pc.localDescription);
            }
        });
    });
}

function sdpToText(desc) {
    return btoa(JSON.stringify({ type: desc.type, sdp: desc.sdp }));
}

function textToSDP(text) {
    try { return JSON.parse(atob(text.trim())); }
    catch(e) { return null; }
}

// ---- chat UI ----
function addMessage(text, kind) {
    var msgs = el("messages");
    var d = document.createElement("div");
    d.className = "msg " + kind;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
}

function setupChannel(ch) {
    channel = ch;
    channel.onopen = function() {
        showScreen("chat");
        addMessage("Connection established", "system");
        el("msg-input").focus();
    };
    channel.onclose = function() {
        addMessage("Connection closed", "system");
        el("btn-send").disabled = true;
    };
    channel.onmessage = function(e) {
        addMessage(e.data, "theirs");
    };
}

// ---- ROLE A: create offer ----
el("btn-create").addEventListener("click", function() {
    showScreen("offer");
    el("offer-text").value = "Generating…";
    el("offer-status").textContent = "";

    pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    var ch = pc.createDataChannel("chat");
    setupChannel(ch);

    pc.createOffer().then(function(offer) {
        return pc.setLocalDescription(offer);
    }).then(function() {
        return gatherSDP(pc);
    }).then(function(desc) {
        el("offer-text").value = sdpToText(desc);
    });
});

el("btn-copy-offer").addEventListener("click", function() {
    el("offer-text").select();
    document.execCommand("copy");
    el("btn-copy-offer").textContent = "Copied!";
    setTimeout(function() { el("btn-copy-offer").textContent = "Copy Offer"; }, 1500);
});

el("btn-connect").addEventListener("click", function() {
    var raw = el("answer-input").value.trim();
    var desc = textToSDP(raw);
    if (!desc || desc.type !== "answer") {
        el("offer-status").textContent = "Invalid answer — paste again";
        return;
    }
    el("offer-status").textContent = "Connecting…";
    pc.setRemoteDescription(new RTCSessionDescription(desc)).then(function() {
        el("offer-status").textContent = "Waiting for channel…";
    }).catch(function(e) {
        el("offer-status").textContent = "Error: " + e.message;
    });
});

// ---- ROLE B: join with offer ----
el("btn-join").addEventListener("click", function() {
    showScreen("join");
});

el("btn-gen-answer").addEventListener("click", function() {
    var raw = el("offer-input").value.trim();
    var desc = textToSDP(raw);
    if (!desc || desc.type !== "offer") {
        el("join-status").textContent = "Invalid offer — paste again";
        return;
    }
    el("join-status").textContent = "Generating answer…";

    pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pc.ondatachannel = function(e) {
        setupChannel(e.channel);
    };

    pc.setRemoteDescription(new RTCSessionDescription(desc)).then(function() {
        return pc.createAnswer();
    }).then(function(answer) {
        return pc.setLocalDescription(answer);
    }).then(function() {
        return gatherSDP(pc);
    }).then(function(answerDesc) {
        el("answer-text").value = sdpToText(answerDesc);
        show("answer-ready-label");
        show("answer-text");
        show("btn-copy-answer");
        el("join-status").textContent = "Send the answer to peer A, then wait…";
    }).catch(function(e) {
        el("join-status").textContent = "Error: " + e.message;
    });
});

el("btn-copy-answer").addEventListener("click", function() {
    el("answer-text").select();
    document.execCommand("copy");
    el("btn-copy-answer").textContent = "Copied!";
    setTimeout(function() { el("btn-copy-answer").textContent = "Copy Answer"; }, 1500);
});

// ---- send message ----
function sendMessage() {
    var input = el("msg-input");
    var text = input.value.trim();
    if (!text || !channel || channel.readyState !== "open") return;
    channel.send(text);
    addMessage(text, "mine");
    input.value = "";
    input.focus();
}

el("btn-send").addEventListener("click", sendMessage);
el("msg-input").addEventListener("keydown", function(e) {
    if (e.key === "Enter") { sendMessage(); e.preventDefault(); }
});

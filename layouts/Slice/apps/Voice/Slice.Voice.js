var w           = null;
var localStream = null;
var timer       = null;
var seconds     = 0;
var muted       = false;
var ringTimeout = null;

var remoteAudio   = app.el.querySelector(".remote-audio");
var avatarWrap    = app.el.querySelector(".avatar-wrap");
var statusEl      = app.el.querySelector(".call-status");
var ctrlIncoming  = app.el.querySelector(".ctrl-incoming");
var ctrlCall      = app.el.querySelector(".ctrl-call");
var btnAccept     = app.el.querySelector(".btn-accept");
var btnDecline    = app.el.querySelector(".btn-decline");
var btnMute       = app.el.querySelector(".btn-mute");
var btnEnd        = app.el.querySelector(".btn-end");

// ---- ring tone ----
var ringCtx, ringOsc1, ringOsc2, ringGain, ringTimerInterval;

function startRingTone() {
    try {
        ringCtx  = new (window.AudioContext || window.webkitAudioContext)();
        ringGain = ringCtx.createGain();
        ringGain.connect(ringCtx.destination);
        ringOsc1 = ringCtx.createOscillator();
        ringOsc2 = ringCtx.createOscillator();
        ringOsc1.frequency.value = 440;
        ringOsc2.frequency.value = 480;
        ringOsc1.connect(ringGain);
        ringOsc2.connect(ringGain);
        ringOsc1.start();
        ringOsc2.start();
        var on = true;
        ringGain.gain.value = 0.08;
        function tick() {
            on = !on;
            ringGain.gain.setTargetAtTime(on ? 0.08 : 0, ringCtx.currentTime, 0.02);
            ringTimerInterval = setTimeout(tick, on ? 2000 : 3000);
        }
        ringTimerInterval = setTimeout(tick, 2000);
    } catch (e) {}
}

function stopRingTone() {
    clearTimeout(ringTimerInterval);
    if (!ringCtx) return;
    try { ringOsc1.stop(); ringOsc2.stop(); ringCtx.close(); } catch (e) {}
    ringCtx = null;
}

// ---- UI states ----
function showIncoming(statusText) {
    statusEl.textContent = statusText || "Incoming call";
    avatarWrap.className = "avatar-wrap ringing";
    ctrlIncoming.classList.remove("hidden");
    ctrlCall.classList.add("hidden");
}

function showCalling(statusText) {
    statusEl.textContent = statusText || "Calling…";
    avatarWrap.className = "avatar-wrap ringing";
    ctrlIncoming.classList.add("hidden");
    ctrlCall.classList.remove("hidden");
}

function showConnected() {
    stopRingTone();
    clearTimeout(ringTimeout);
    avatarWrap.className = "avatar-wrap connected";
    ctrlIncoming.classList.add("hidden");
    ctrlCall.classList.remove("hidden");
    seconds = 0;
    if (timer) clearInterval(timer);
    timer = setInterval(function () {
        seconds++;
        var m = Math.floor(seconds / 60), s = seconds % 60;
        statusEl.textContent = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    }, 1000);
}

// ---- track listener ----
function onTrack(e) {
    remoteAudio.srcObject = e.streams[0];
    remoteAudio.play().catch(function () {});
    showConnected();
}

// ---- cleanup ----
function endCall() {
    stopRingTone();
    clearTimeout(ringTimeout);
    if (timer) { clearInterval(timer); timer = null; }
    if (localStream) { localStream.getTracks().forEach(function (t) { t.stop(); }); localStream = null; }
    remoteAudio.srcObject = null;
    if (w) {
        w.offMessage("sdp-offer");
        w.offMessage("sdp-answer");
        w.offMessage("call-end");
        var pc = w.getPc();
        if (pc) pc.removeEventListener("track", onTrack);
        w.send({ type: "call-end", context: "voice" });
        w = null;
    }
    app.destroy();
}

btnEnd.addEventListener("click", endCall);

btnMute.addEventListener("click", function () {
    muted = !muted;
    if (localStream) localStream.getAudioTracks().forEach(function (t) { t.enabled = !muted; });
    btnMute.classList.toggle("muted", muted);
});

// ---- renegotiation helpers ----
async function setupAsResponder(pc) {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStream.getTracks().forEach(function (t) { pc.addTrack(t, localStream); });
    pc.addEventListener("track", onTrack);

    w.onMessage("sdp-offer", function (msg) {
        if (msg.context !== "voice") return;
        pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
            .then(function () { return pc.createAnswer(); })
            .then(function (a) { return pc.setLocalDescription(a); })
            .then(function () { return w.gatherSDP(pc); })
            .then(function (desc) {
                w.send({ type: "sdp-answer", context: "voice", sdp: { type: desc.type, sdp: desc.sdp } });
            });
    });
}

// ---- public API ----

// This peer clicked Voice
this.initiate = async function () {
    w = await warp.app("Slice.Welcome");
    if (!w) return;
    var pc = w.getPc();
    if (!pc) return;

    app.win.show();
    showCalling("Calling…");
    startRingTone();

    // 30s no-answer timeout
    ringTimeout = setTimeout(function () {
        statusEl.textContent = "No answer";
        w.send({ type: "call-end", context: "voice" });
        setTimeout(endCall, 1500);
    }, 30000);

    try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStream.getTracks().forEach(function (t) { pc.addTrack(t, localStream); });
    } catch (e) {
        statusEl.textContent = "Mic unavailable";
        clearTimeout(ringTimeout);
        return;
    }

    pc.addEventListener("track", onTrack);
    w.send({ type: "voice-request" });

    var offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    var desc = await w.gatherSDP(pc);
    w.send({ type: "sdp-offer", context: "voice", sdp: { type: desc.type, sdp: desc.sdp } });

    w.onMessage("sdp-answer", function (msg) {
        if (msg.context !== "voice") return;
        pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    });

    w.onMessage("call-end", function (msg) {
        if (msg.context !== "voice") return;
        statusEl.textContent = "Call ended";
        setTimeout(endCall, 1000);
    });
};

// Peer is calling us — show accept/decline
this.incoming = async function () {
    w = await warp.app("Slice.Welcome");
    if (!w) return;
    var pc = w.getPc();

    app.win.show();
    showIncoming("Incoming call");
    startRingTone();

    // Decline
    btnDecline.addEventListener("click", function () {
        w.send({ type: "call-end", context: "voice" });
        endCall();
    }, { once: true });

    // Accept
    btnAccept.addEventListener("click", async function () {
        stopRingTone();
        showCalling("Connecting…");
        try {
            await setupAsResponder(pc);
        } catch (e) {
            statusEl.textContent = "Mic unavailable";
            endCall();
        }
        w.onMessage("call-end", function (msg) {
            if (msg.context !== "voice") return;
            statusEl.textContent = "Call ended";
            setTimeout(endCall, 1000);
        });
    }, { once: true });
};

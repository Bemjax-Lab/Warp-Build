var w           = null;
var localStream = null;
var muted       = false;
var camOff      = false;

var remoteVideo = app.el.querySelector(".remote-video");
var localVideo  = app.el.querySelector(".local-video");
var statusText  = app.el.querySelector(".status-text");
var btnMute     = app.el.querySelector(".btn-mute");
var btnCam      = app.el.querySelector(".btn-cam");

function setStatus(text) { statusText.textContent = text; }

// ---- track listener ----
function onTrack(e) {
    remoteVideo.srcObject = e.streams[0];
    remoteVideo.play().catch(function () {});
    setStatus("Connected");
}

// ---- end call ----
function endCall() {
    if (localStream) { localStream.getTracks().forEach(function (t) { t.stop(); }); localStream = null; }
    remoteVideo.srcObject = null;
    if (w) {
        w.offMessage("video-request");
        w.offMessage("sdp-offer");
        w.offMessage("sdp-answer");
        w.offMessage("call-end");
        var pc = w.getPc();
        if (pc) pc.removeEventListener("track", onTrack);
        w.send({ type: "call-end", context: "video" });
    }
    app.destroy();
}

app.el.querySelector(".btn-end").addEventListener("click", endCall);

btnMute.addEventListener("click", function () {
    muted = !muted;
    if (localStream) localStream.getAudioTracks().forEach(function (t) { t.enabled = !muted; });
    btnMute.classList.toggle("muted", muted);
    btnMute.querySelector("span").textContent = muted ? "Unmute" : "Mute";
});

btnCam.addEventListener("click", function () {
    camOff = !camOff;
    if (localStream) localStream.getVideoTracks().forEach(function (t) { t.enabled = !camOff; });
    btnCam.classList.toggle("cam-off", camOff);
    localVideo.classList.toggle("cam-off", camOff);
    btnCam.querySelector("span").textContent = camOff ? "Camera" : "Camera";
});

// ---- shared renegotiation ----
async function setupMedia(pc) {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localVideo.srcObject = localStream;
    localVideo.play().catch(function () {});
    localStream.getTracks().forEach(function (t) { pc.addTrack(t, localStream); });
    pc.addEventListener("track", onTrack);
}

async function handleSdpOffer(msg, pc) {
    await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    var answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    var desc = await w.gatherSDP(pc);
    w.send({ type: "sdp-answer", context: "video", sdp: { type: desc.type, sdp: desc.sdp } });
}

// ---- public API ----
this.initiate = async function () {
    w = await warp.app("Slice.Welcome");
    if (!w) return;
    var pc = w.getPc();

    app.win.show();
    setStatus("Starting camera…");

    try {
        await setupMedia(pc);
    } catch (e) {
        setStatus("Camera/mic unavailable");
        return;
    }

    setStatus("Calling…");
    w.send({ type: "video-request" });

    var offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    var desc = await w.gatherSDP(pc);
    w.send({ type: "sdp-offer", context: "video", sdp: { type: desc.type, sdp: desc.sdp } });

    w.onMessage("sdp-answer", function (msg) {
        if (msg.context !== "video") return;
        pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    });

    w.onMessage("call-end", function (msg) {
        if (msg.context === "video") endCall();
    });
};

this.incoming = async function () {
    w = await warp.app("Slice.Welcome");
    if (!w) return;
    var pc = w.getPc();

    app.win.show();
    setStatus("Incoming video…");

    try {
        await setupMedia(pc);
    } catch (e) {
        setStatus("Camera/mic unavailable");
    }

    w.onMessage("sdp-offer", function (msg) {
        if (msg.context !== "video") return;
        handleSdpOffer(msg, pc);
    });

    w.onMessage("call-end", function (msg) {
        if (msg.context === "video") endCall();
    });
};

// Register incoming video-request handler
warp.app("Slice.Welcome").then(function (welcome) {
    welcome.onMessage("video-request", function () {
        warp.app("Slice.Video").then(function (v) { if (v) v.incoming(); });
    });
});

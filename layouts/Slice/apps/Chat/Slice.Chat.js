var w          = null;
var messagesEl = app.el.querySelector(".messages");
var msgInput   = app.el.querySelector(".msg-input");

function addMessage(text, kind) {
    var d = document.createElement("div");
    d.className = "msg " + kind;
    d.textContent = text;
    messagesEl.appendChild(d);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function sendMessage() {
    var text = msgInput.value.trim();
    if (!text || !w) return;
    w.send({ type: "chat", text: text });
    addMessage(text, "mine");
    msgInput.value = "";
    msgInput.focus();
}

app.el.querySelector("#btn-send").addEventListener("click", sendMessage);
msgInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { sendMessage(); e.preventDefault(); }
});

// Connect to Welcome on load so send() works immediately
warp.app("Slice.Welcome").then(function (welcome) {
    w = welcome;
});

// ---- public API ----

// Called by Welcome when user clicks Chat button
this.open = function () {
    app.win.show();
    msgInput.focus();
};

// Called by Welcome when an incoming chat message arrives
this.receive = function (msg) {
    addMessage(msg.text, "theirs");
    app.win.show();
    msgInput.focus();
};

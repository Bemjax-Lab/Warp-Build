var apiKey = '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';
var model = 'claude-sonnet-4-20250514';
var systemPrompt = false;
var messages = [];
var thinking = false;

var inputEl   = dom.query('.input-area textarea');
var messagesEl = dom.query('.messages');
var statusEl  = dom.query('.status');

function clearChat() {
    messages = [];
    messagesEl.innerHTML = '';
    inputEl.focus();
}

function appendMessage(role, text, image) {
    var div = document.createElement('div');
    div.className = role + ' message';
    var label = document.createElement('span');
    label.className = 'role';
    label.textContent = (role === 'user' ? 'You' : 'Assistant') + ': ';
    var content = document.createElement('span');
    if (image) {
        var img = document.createElement('img');
        img.src = typeof image === 'string' ? image : URL.createObjectURL(image);
        img.style.cssText = 'width:100%; display:block; border-radius:4px; margin:0px';
        content.appendChild(img);
    }
    var textEl = document.createElement('span');
   // textEl.innerHTML = marked.parse(text);
   textEl.innerHTML = text;
    textEl.className = 'p0 mt-20';
    content.appendChild(textEl);
    textEl.querySelectorAll('pre code:not(.language-json)').forEach(function (block) {
       // hljs.highlightElement(block);
    });
    div.appendChild(label);
    div.appendChild(content);
    messagesEl.appendChild(div);
    div.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buildImageSource(image) {
    if (typeof image === 'string' && image.startsWith('data:')) {
        var parts = image.split(',');
        var mediaType = parts[0].match(/data:([^;]+)/)[1];
        return { type: 'base64', media_type: mediaType, data: parts[1] };
    }
    return { type: 'url', url: image };
}

function send(text, image) {
    thinking = true;
    if (!text) text = inputEl.value.trim();
    if (!text) return;
    appendMessage('user', text, image);
    var userContent = image ? [{ type: 'image', source: buildImageSource(image) }, { type: 'text', text: text }] : text;
    var msgIndex = messages.length;
    messages.push({ role: 'user', content: userContent });
    inputEl.value = '';
    statusEl.classList.remove('hidden');
    var body = { model: model, max_tokens: 1024, messages: messages };
    if (systemPrompt) body.system = systemPrompt;
    return fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify(body)
    }).then(function (res) {
        return res.json();
    }).then(function (json) {
        if (json.error) throw new Error(json.error.message);
        var reply = json.content[0].text;
        if (Array.isArray(messages[msgIndex].content)) {
            messages[msgIndex].content = messages[msgIndex].content.find(function(b) { return b.type === 'text'; }).text;
        }
        appendMessage('assistant', reply);
        messages.push({ role: 'assistant', content: reply });
        statusEl.classList.add('hidden');
        inputEl.focus();
        return reply;
    }).catch(function (e) {
        statusEl.classList.add('hidden');
        appendMessage('assistant', 'Error: ' + e.message);
        inputEl.focus();
    }).finally(function () {
        thinking = false;
    });
}

dom.on(dom.query('.clear-chat'), 'click', clearChat);
dom.on(dom.query('.send'), 'click', function () { send(); });
inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
    }
});

inputEl.focus();

this.send = function (text, image) {
    if (thinking) return Promise.reject(new Error('Already processing a message'));
    return send(text, image);
};
this.setSystemPrompt = function (prompt) { systemPrompt = prompt; };
this.clearChat = clearChat;

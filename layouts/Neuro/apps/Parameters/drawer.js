// Shared Drawer constructor for Neuro apps.
// Loaded via loadFile/loadFileFrom which does direct eval —
// the wrapping parens make the expression evaluate to the constructor.

var DrawerOptions = {
    caption: '',       // string — drawer title text
    class: false,      // string|false — extra CSS classes on root el
    height: false,     // string|false — CSS value for title min-height (e.g. 'var(--sm)')
    onOpen: false,     // function(drawer)|false
    onClose: false     // function(drawer)|false
};

(function Drawer(opts) {
    opts = opts || {};
    for (var k in DrawerOptions) {
        if (opts[k] === undefined) opts[k] = DrawerOptions[k];
    }

    var drawer = this;
    var isOpen = false;

    var el = warp.dom.node('div', { class: 'drawer' + (opts.class ? ' ' + opts.class : '') });
    var title = warp.dom.node('div', { class: 'title' });
    var caption = warp.dom.node('span', { class: 'caption', text: opts.caption });
    var caret = warp.dom.node('span', { class: 'icon icon-chevron-right caret' });
    var body = warp.dom.node('div', { class: 'body' });

    if (opts.height) title.style.minHeight = opts.height;

    title.appendChild(caption);
    title.appendChild(caret);
    el.appendChild(title);
    el.appendChild(body);

    drawer.el = el;
    drawer.body = body;
    drawer.title = title;
    drawer.caption = caption;

    drawer.isOpen = function () { return isOpen; };

    drawer.open = function () {
        if (isOpen) return;
        isOpen = true;
        caret.classList.add('open');
        body.classList.add('open');
        if (opts.onOpen) opts.onOpen(drawer);
    };

    drawer.close = function () {
        if (!isOpen) return;
        isOpen = false;
        caret.classList.remove('open');
        body.classList.remove('open');
        if (opts.onClose) opts.onClose(drawer);
    };

    title.addEventListener('click', function () {
        if (isOpen) drawer.close(); else drawer.open();
    });
})

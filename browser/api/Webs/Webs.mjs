/* ──────────────────────────────────────────────────────────────
   Webs endpoint — manages WebContentsView instances (headless web pages).
   Maps to warp.native.invoke("Webs", methodName, args)

   Each web is a WebContentsView attached to the main window.
   Webs can be visible (positioned in the UI) or offscreen.
   ────────────────────────────────────────────────────────────── */

import { WebContentsView, webContents, BaseWindow } from 'electron';

var instances = {};
var router = null;

var Webs = {

    _init(routerRef) {
        router = routerRef;
    },

    async Create(tabId, url, offscreen) {
        var view = new WebContentsView({
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                sandbox: true,
                backgroundThrottling: false
            }
        });

        var tab = {
            id: tabId,
            view: view,
            url: url || 'about:blank',
            ready: false,
            favicon: false,
            offscreen: offscreen || false,
            title: ''
        };

        instances[tabId] = tab;

        // clean UA — strip Electron/warp-browser tokens so sites see standard Chrome
        var ua = view.webContents.getUserAgent();
        view.webContents.setUserAgent(ua.replace(/\s*Electron\/\S+/g, '').replace(/\s*warp-browser\/\S+/g, ''));

        // attach to main window — brief on-screen flash so Chromium activates the renderer,
        // then move off-screen. Without this, backgroundThrottling:false doesn't work on first frame.
        var win = BaseWindow.getAllWindows()[0];
        if (win) {
            view.setBounds({ x: 0, y: 0, width: 1, height: 1 });
            win.contentView.addChildView(view, 0);
            setTimeout(function () {
                view.setBounds({ x: -10000, y: -10000, width: 500, height: 500 });
                tab.hidden = true;
            }, 50);
        }

        view.webContents.on('did-finish-load', function () {
            tab.ready = true;
            tab.url = view.webContents.getURL();
            tab.title = view.webContents.getTitle();
            if (router) {
                router.trigger('Webs', 'LoadEnd', { id: tabId, url: tab.url, title: tab.title });
            }
        });

        view.webContents.on('page-title-updated', function (e, title) {
            tab.title = title;
            if (router) {
                router.trigger('Webs', 'TitleChanged', { id: tabId, title: title });
            }
        });

        view.webContents.on('page-favicon-updated', function (e, favicons) {
            tab.favicon = favicons[0] || false;
            if (router) {
                router.trigger('Webs', 'IconChanged', { id: tabId, favicon: tab.favicon });
            }
        });

        view.webContents.on('did-navigate', function (e, url) {
            tab.url = url;
            if (router) {
                router.trigger('Webs', 'AddressChanged', { id: tabId, url: url });
            }
        });

        view.webContents.on('did-navigate-in-page', function (e, url) {
            tab.url = url;
            if (router) {
                router.trigger('Webs', 'AddressChanged', { id: tabId, url: url });
            }
        });

        view.webContents.on('did-fail-load', function (e, errorCode, errorDescription) {
            if (router) {
                router.trigger('Webs', 'LoadError', { id: tabId, errorCode: errorCode, error: errorDescription });
            }
        });

        if (url && url !== 'about:blank') {
            view.webContents.loadURL(url);
        }

        return { id: tabId, url: tab.url, favicon: false };
    },

    async Destroy(tabId) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        var win = BaseWindow.getAllWindows()[0];
        if (win) win.contentView.removeChildView(tab.view);
        tab.view.webContents.close();
        delete instances[tabId];
        return tabId;
    },

    async Navigate(tabId, url) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        tab.ready = false;
        tab.view.webContents.loadURL(url);
        tab.url = url;
        return url;
    },

    async Back(tabId) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        if (tab.view.webContents.canGoBack()) {
            tab.view.webContents.goBack();
            return true;
        }
        return false;
    },

    async Forward(tabId) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        if (tab.view.webContents.canGoForward()) {
            tab.view.webContents.goForward();
            return true;
        }
        return false;
    },

    async Eval(tabId, code) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        var result = await tab.view.webContents.executeJavaScript(code);
        return result;
    },

    async Capture(tabId, rect) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        var options = rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : undefined;
        var image = await tab.view.webContents.capturePage(options);
        return image.toDataURL();
    },

    async Activate(tabId) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        tab.view.webContents.focus();
        return tabId;
    },

    async Deactivate(tabId) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        tab.view.webContents.blur();
        return tabId;
    },

    async Sleep(tabId, state) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        if (state === null) {
            return tab.view.webContents.backgroundThrottling;
        }
        tab.view.webContents.backgroundThrottling = !!state;
        return !!state;
    },

    async Offscreen(tabId, state) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        if (state === null) return tab.offscreen;
        tab.offscreen = !!state;
        return !!state;
    },

    async Agent(tabId, agent) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        if (agent) {
            tab.view.webContents.setUserAgent(agent);
        }
        return tab.view.webContents.getUserAgent();
    },

    async Bounds(tabId, x, y, w, h) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        var win = BaseWindow.getAllWindows()[0];
        if (!win) return false;
        var winBounds = win.getBounds();
        tab.view.setBounds({
            x: Math.round(x - winBounds.x),
            y: Math.round(y - winBounds.y),
            width: Math.round(w),
            height: Math.round(h)
        });
        return true;
    },

    async Hide(tabId) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        // off-screen — view stays attached and active, no throttling
        var b = tab.view.getBounds();
        if (b.width > 0 && b.height > 0) tab._savedBounds = b;
        tab.view.setBounds({ x: -10000, y: -10000, width: (tab._savedBounds && tab._savedBounds.width) || 500, height: (tab._savedBounds && tab._savedBounds.height) || 500 });
        tab.hidden = true;
        return tabId;
    },

    async Show(tabId) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        tab.hidden = false;
        return tabId;
    },

    async BringToFront(tabId) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        var win = BaseWindow.getAllWindows()[0];
        if (!win) return false;
        win.contentView.removeChildView(tab.view);
        win.contentView.addChildView(tab.view);
        tab.view.webContents.focus();
        return tabId;
    },

    async SendToBack(tabId) {
        var tab = instances[tabId];
        if (!tab) throw new Error('Tab ' + tabId + ' does not exist');
        var win = BaseWindow.getAllWindows()[0];
        if (!win) return false;
        win.contentView.removeChildView(tab.view);
        win.contentView.addChildView(tab.view, 0);
        return tabId;
    },

    // internal — get a tab's view for attaching to windows
    _get(tabId) {
        return instances[tabId] || null;
    },

    _instances: instances
};

export default Webs;

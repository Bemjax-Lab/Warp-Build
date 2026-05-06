// Drawer constructor loaded from shared drawer.js into app.Drawer by Parameters init
const Drawer = app.Drawer;

function drawerGui(container, model, scope, onScopeChange) {
        let drawers = {};
        function categoryCount(items) {
            let n = 0;
            for (const p in items) {
                const v = scope[p];
                if (v === undefined || v === null || v === '') continue;
                if (Array.isArray(v) && v.length === 0) continue;
                n++;
            }
            return n;
        }
        function refreshLabels() {
            let idx = 0;
            for (const cat in model) {
                idx++;
                const d = drawers[cat];
                if (!d) continue;
                const n = categoryCount(model[cat]);
                d.caption.textContent = idx + '. ' + cat + (n > 0 ? ' [' + n + ']' : '');
            }
        }
        function updateData(prop, value) {
            if (!scope)
                throw Error('no model provided');
            scope[prop] = value;
            refreshLabels();
            if (onScopeChange)
                onScopeChange(prop, value);
        }
        if (!model)
            throw Error('no model provided');
        var lastDrawer;
        function input(prop, obj, type) {
            return warp.dom.node('input', {
                type: type,
                class: 'sm',
                placeholder: prop + ' : '
            });
        }
        function select(prop, obj) {
            if (obj.allowMultiple) {
                const group = warp.dom.node('div', { class: 'multi-select-group' });
                group.innerHTML =
                    `<div class="multi-select-title">${ prop } :</div>` +
                    obj.values.map(v =>
                        `<label><input type="checkbox" value="${ v }"> ${ v }</label>`
                    ).join('');
                group.getValues = function () {
                    return Array.from(group.querySelectorAll('input:checked')).map(cb => cb.value);
                };
                group.setValues = function (val) {
                    group.querySelectorAll('input').forEach(cb => {
                        cb.checked = Array.isArray(val) ? val.includes(cb.value) : cb.value === val;
                    });
                };
                group._allowMultiple = true;
                return group;
            }
            const el = warp.dom.node('select', { class: 'sm' });
            el.innerHTML = `
            <option value="" class="disabled" selected disabled>${ prop } : </option>
            ${ obj.values.map(v => `<option value="${ v }">${ v }</option>`).join('') }
        `;
            return el;
        }
        let i = 0;
        for (let category in model) {
            i++;
            const d = new Drawer({
                caption: i + '. ' + category,
                class: 'mt0 mb0 dark',
                onOpen: function (drw) {
                    if (lastDrawer && lastDrawer !== drw) {
                        lastDrawer.close();
                    }
                    lastDrawer = drw;
                    container.scrollTop = drw.el.offsetTop - container.offsetTop;
                },
                onClose: function () {
                }
            });
            drawers[category] = d;
            const items = model[category];
            for (let prop in items) {
                const item = items[prop];
                let el;
                if (typeof item.values === 'string') {
                    el = input(prop, item, 'text');
                } else if (typeof item.values === 'number') {
                    el = input(prop, item, 'number');
                } else {
                    el = select(prop, item);
                }
                // initialize from scope if present
                if (scope && scope.hasOwnProperty(prop)) {
                    if (el._allowMultiple) { el.setValues(scope[prop]); } else { el.value = scope[prop]; }
                    let wrapper = warp.dom.node('span', { class: 'field-wrap', html: `<label>${ item.desc } : </label><br>` });
                    wrapper.append(el);
                    el.classList.add('has-value');
                    d.body.appendChild(wrapper);
                } else {
                    d.body.appendChild(el);
                }
                if (el._allowMultiple) {
                    el.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                        cb.onchange = () => {
                            const values = el.getValues();
                            updateData(prop, values.length > 0 ? values : undefined);
                            if (values.length > 0) el.classList.add('has-value');
                            else el.classList.remove('has-value');
                        };
                    });
                } else {
                    el.onchange = () => {
                        updateData(prop, el.value);
                        if (el.parentNode.nodeName !== 'SPAN') {
                            let wrapper = warp.dom.node('span', { class: 'field-wrap', html: `<label>${ items[prop].desc } : </label><br>` });
                            el.parentNode.insertBefore(wrapper, el);
                            wrapper.append(el);
                            el.classList.add('has-value');
                        }
                    };
                }
                el.setAttribute('title', item.desc);
                el.setAttribute('model-parameter', prop);
                el.setAttribute('model-category', category);
            }
            d.body.classList.add('p10', 'pt20');
            container.appendChild(d.el);
        }
        refreshLabels();
        drawers._refreshLabels = refreshLabels;
        return drawers;
    }
    app.win.caption('Parameters');
    app.win.body.style.overflowY = 'hidden';
    app.body.style.overflowY = 'hidden';
    app.win.head.style.border = 'none';
    app.win.head.style.border = 'none';
    let debugInput = app.el.querySelector('input.debug');
    debugInput.checked = !!debug;
    debugInput.onchange = function () {
        debug = this.checked;
        if (debug) {
            detailsApp.debug(app.selected);
        } else {
            detailsApp.hide();
        }
    };
    var detectedEl = app.el.querySelector('.detected');
    var debugLabel = app.el.querySelector('label.debug');
    var countEl = app.el.querySelector('.count');
    function updateDetected() {
        if (!detailsApp || !detailsApp.detect) return;
        var detected = detailsApp.detect(app.selected);
        detectedEl.innerHTML = '';
        var total = 0;
        if (!detected) {
            detectedEl.innerHTML = '<span class="ti op6 m20">nothing detected</span>';
            debugLabel.classList.add('hidden');
            countEl.textContent = '0';
            return;
        }
        ['definite', 'probable', 'possible'].forEach(function (lvl) {
            (detected[lvl] || []).forEach(function (entry) {
                total++;
                var count = entry.diagnoses ? entry.diagnoses.length : 0;
                var d = new app.Drawer({
                    caption: entry.location + ' [' + count + ']',
                    class: 'mt0 mb0 dark'
                });
                d.caption.classList.add('confidence-' + lvl, 'strong');
                if (entry.diagnoses && entry.diagnoses.length) {
                    var list = warp.dom.node('div', { class: 'dx-list' });
                    entry.diagnoses.forEach(function (diag) {
                        list.appendChild(detailsApp.renderDiagnosisCard(diag));
                    });
                    d.body.appendChild(list);
                } else {
                    d.body.appendChild(warp.dom.node('div', { class: 'p5 pl10 op5', text: 'no diagnoses matched' }));
                }
                detectedEl.appendChild(d.el);
            });
        });
        countEl.textContent = total;
        debugLabel.classList.remove('hidden');
    }
    updateDetected();
    app.updateDetected = updateDetected;

    app.el.querySelector('button.save').onclick = async function () {
        var name = await warp.gui.input('', 'Enter a name for this test');
        if (!name) return;
        var loc = await warp.app('Neuro.Localisation');
        await loc.ready;
        var detected = loc.detect(app.selected);
        var result = { definite: [], probable: [], possible: [] };
        if (detected) {
            if (detected.definite) detected.definite.forEach(function (r) { result.definite.push(r.location); });
            if (detected.probable) detected.probable.forEach(function (r) { result.probable.push(r.location); });
            if (detected.possible) detected.possible.forEach(function (r) { result.possible.push(r.location); });
        }
        var testsApp = await warp.app('Neuro.Tests');
        testsApp.save({ name: name, parameters: app.selected, result: result, comment: '' });
    };
    app.el.querySelector('button.reset').onclick = function () {
        app.reset();
    };
    app.el.querySelector('.neurovet').innerHTML = '';
    categoryDrawers = drawerGui(app.el.querySelector('.neurovet'), app.model, app.selected, function (prop, val) {
        app.query('button.reset').classList.remove('disabled');
        updateDetected();
        if (debug) {
            detailsApp.debug(app.selected);
        } else {
            detailsApp.hide();
        }
    });
    app.refreshLabels = categoryDrawers._refreshLabels;

    // ── Parameter search ─────────────────────────────────────────────────────
    // Type any part of a param name; first match has its drawer opened and is
    // scrolled into view. Empty input clears the status.
    var searchInput  = app.el.querySelector('input.param-search');
    var searchStatus = app.el.querySelector('.param-search-status');
    var lastHighlighted = null;

    function findParam(query) {
        var q = (query || '').trim().toLowerCase();
        if (!q) {
            searchStatus.textContent = '';
            if (lastHighlighted) { lastHighlighted.classList.remove('search-hit'); lastHighlighted = null; }
            return;
        }
        var matches = app.el.querySelectorAll('[model-parameter]');
        var hits = [];
        for (var i = 0; i < matches.length; i++) {
            var name = (matches[i].getAttribute('model-parameter') || '').toLowerCase();
            if (name.indexOf(q) !== -1) hits.push(matches[i]);
        }
        if (!hits.length) {
            searchStatus.textContent = 'no match';
            if (lastHighlighted) { lastHighlighted.classList.remove('search-hit'); lastHighlighted = null; }
            return;
        }
        var first = hits[0];
        var category = first.getAttribute('model-category');
        if (category && categoryDrawers[category]) categoryDrawers[category].open();
        // If the control sits inside a .field-wrap span (selects/inputs that
        // already have a value), put the highlight on the wrapper so the
        // outline doesn't clip against the select chrome.
        var hit = first.parentNode && first.parentNode.classList && first.parentNode.classList.contains('field-wrap')
            ? first.parentNode : first;
        hit.scrollIntoView({ block: 'center' });
        if (lastHighlighted) lastHighlighted.classList.remove('search-hit');
        hit.classList.add('search-hit');
        lastHighlighted = hit;
        searchStatus.textContent = hits.length === 1 ? '1 match: ' + first.getAttribute('model-parameter')
            : hits.length + ' matches — showing first: ' + first.getAttribute('model-parameter');
    }

    searchInput.oninput = function () { findParam(searchInput.value); };
    searchInput.onkeydown = function (e) { if (e.key === 'Enter') findParam(searchInput.value); };
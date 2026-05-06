var self = this;
var detectedEl, selectedDrawer, parametersApp;
var Drawer; // loaded from Parameters's drawer.js in init()

this.rules = null;
this.diagnoses = null;

const ruleFiles = [
    'C1-C5', 'C6-T2', 'T3-L3', 'L4-S3', 'L7-S3',
    'brainstem-diffuse', 'cerebellum', 'diencephalon', 'forebrain',
    'medulla-caudal', 'medulla-rostral', 'midbrain',
    'peripheral', 'pons',
    'vestibular-central', 'vestibular-paradoxical', 'vestibular-peripheral',
    'multifocal'
];

const diagnosisFiles = [
    'C1-C5.js', 'C6-T2.js', 'T3-L3.js', 'L4-S3.js', 'L7-S3.js',
    'brainstem.js', 'cerebellum.js', 'forebrain.js', 'peripheral.js',
    'vestibular-peripheral.js', 'vestibular-central.js', 'vestibular-paradoxical.js',
    'multifocal.js'
];

// read a file from this app's folder, eval in the app closure
async function loadFile(path) {
    var layout = await warp.layout(self.layout);
    var src = await layout.apps[self.name].folder[path].text();
    if (path.endsWith('.json')) return JSON.parse(src);
    return eval(src);
}

// read a file from another app's folder in the same layout, eval in this closure
async function loadFileFrom(appName, path) {
    var layout = await warp.layout(self.layout);
    var src = await layout.apps[appName].folder[path].text();
    if (path.endsWith('.json')) return JSON.parse(src);
    return eval(src);
}

// Map a confidence tier string to a CSS modifier class.
function tierClass(confidence) {
    switch (confidence) {
        case 'HIGHLY LIKELY':         return 'dx-tier-high';
        case 'LIKELY':                return 'dx-tier-likely';
        case 'POSSIBLE':              return 'dx-tier-possible';
        case 'LESS LIKELY':           return 'dx-tier-less';
        case 'ESSENTIALLY EXCLUDED':  return 'dx-tier-excluded';
        default:                      return '';
    }
}

// Map alert type to CSS modifier class.
function alertClass(type) {
    var t = (type || '').toUpperCase();
    if (t === 'CRITICAL') return 'dx-alert-critical';
    if (t === 'URGENT')   return 'dx-alert-urgent';
    if (t === 'WARNING')  return 'dx-alert-warning';
    return 'dx-alert-info';
}

// Build a diagnosis card. `diag` shape: { name, category, score, confidence, flags[], alerts[], workup[] }.
// Plain-string entries are rendered as a name-only minimal card (legacy fallback).
this.renderDiagnosisCard = function (diag) {
    if (typeof diag === 'string') {
        return warp.dom.node('div', { class: 'dx-card', text: diag });
    }

    var card = warp.dom.node('div', { class: 'dx-card ' + tierClass(diag.confidence) });

    // Header row : name + tier badge.
    var head = warp.dom.node('div', { class: 'dx-head' });
    head.appendChild(warp.dom.node('span', { class: 'dx-name strong', text: diag.name || '' }));
    var tierTxt = (diag.confidence || '') + (diag.score != null ? ' · ' + Math.round(diag.score) : '');
    if (tierTxt.trim()) {
        head.appendChild(warp.dom.node('span', { class: 'dx-tier', text: tierTxt.trim() }));
    }
    card.appendChild(head);

    // Category meta line.
    if (diag.category) {
        card.appendChild(warp.dom.node('div', { class: 'dx-meta tsm op7', text: diag.category }));
    }

    // Alerts — most severe first.
    var alerts = diag.alerts || [];
    var sevOrder = { CRITICAL: 0, URGENT: 1, WARNING: 2, INFO: 3 };
    alerts.slice().sort(function (a, b) {
        return (sevOrder[(a.type || '').toUpperCase()] || 9) - (sevOrder[(b.type || '').toUpperCase()] || 9);
    }).forEach(function (al) {
        var box = warp.dom.node('div', { class: 'dx-alert ' + alertClass(al.type) });
        var title = (al.type ? al.type + ' — ' : '') + (al.title || '');
        box.appendChild(warp.dom.node('div', { class: 'dx-alert-title strong tsm', text: title }));
        if (al.text) box.appendChild(warp.dom.node('div', { class: 'dx-alert-text tsm op8', text: al.text }));
        card.appendChild(box);
    });

    // Collapsible details (flags + workup) — only render the toggle if there's something to show.
    var hasFlags = (diag.flags || []).length > 0;
    var hasWorkup = (diag.workup || []).length > 0;
    if (hasFlags || hasWorkup) {
        var detail = warp.dom.node('div', { class: 'dx-detail hidden' });
        if (hasFlags) {
            detail.appendChild(warp.dom.node('div', { class: 'dx-section-title tsm op7', text: 'Score modifiers' }));
            diag.flags.forEach(function (f) {
                detail.appendChild(warp.dom.node('div', { class: 'dx-flag tsm op8', text: '• ' + f }));
            });
        }
        if (hasWorkup) {
            detail.appendChild(warp.dom.node('div', { class: 'dx-section-title tsm op7 mt5', text: 'Workup' }));
            diag.workup.forEach(function (w) {
                detail.appendChild(warp.dom.node('div', { class: 'dx-workup tsm op8', text: '• ' + w }));
            });
        }
        var toggle = warp.dom.node('button', { class: 'dx-toggle xs', text: 'Details' });
        toggle.onclick = function (e) {
            e.stopPropagation();
            detail.classList.toggle('hidden');
            toggle.textContent = detail.classList.contains('hidden') ? 'Details' : 'Hide';
        };
        card.appendChild(toggle);
        card.appendChild(detail);
    }

    return card;
};

// Render detected results as drawers, caption coloured by confidence, body lists matched diagnoses.
this.debug = async function (selected) {
    var detected = self.detect(selected);
    detectedEl.innerHTML = '';
    if (!detected) {
        detectedEl.textContent = 'No localisation detected, add or change parameters';
    } else {
        ['definite', 'probable', 'possible'].forEach(function (level) {
            (detected[level] || []).forEach(function (entry) {
                var count = entry.diagnoses ? entry.diagnoses.length : 0;
                var d = new Drawer({
                    caption: entry.location + ' [' + count + ']',
                    class: 'mt0 mb0 dark'
                });
                d.caption.classList.add('confidence-' + level, 'strong');

                // Evidence panel (hidden by default, toggled by Evidence button in body top).
                // Only the reasoning title takes the confidence colour — bullets stay normal.
                var evidenceEl = warp.dom.node('div', { class: 'hidden evidence-panel p10 ml10 mr10 mt5 tl' });
                if (entry.reasoning) {
                    var reasoningRow = warp.dom.node('div', { class: 'mb5 ti' });
                    reasoningRow.appendChild(warp.dom.node('span', { class: 'confidence-' + level + ' strong', text: entry.reasoning }));
                    evidenceEl.appendChild(reasoningRow);
                }
                (entry.evidence || []).forEach(function (ev) {
                    evidenceEl.appendChild(warp.dom.node('div', { class: 'tsm op7', text: '• ' + ev }));
                });

                var evBar = warp.dom.node('div', { class: 'p5 pl10' });
                var evBtn = warp.dom.node('button', { class: 'xs', text: 'Evidence', click: function (e) {
                    e.stopPropagation();
                    evidenceEl.classList.toggle('hidden');
                }});
                evBar.appendChild(evBtn);
                d.body.appendChild(evBar);
                d.body.appendChild(evidenceEl);

                if (entry.diagnoses && entry.diagnoses.length) {
                    var list = warp.dom.node('div', { class: 'dx-list' });
                    entry.diagnoses.forEach(function (diag) {
                        list.appendChild(self.renderDiagnosisCard(diag));
                    });
                    d.body.appendChild(list);
                } else {
                    d.body.appendChild(warp.dom.node('div', { class: 'p5 pl10 op5', text: 'no diagnoses matched' }));
                }
                detectedEl.appendChild(d.el);
            });
        });
    }

    // Refresh "Selected parameters" drawer under detected localisations.
    renderSelectedDrawer(selected);
    self.show();
};

function renderSelectedDrawer(selected) {
    if (!selectedDrawer) return;
    var keys = Object.keys(selected || {});
    selectedDrawer.caption.textContent = 'Selected parameters : ' + keys.length;
    var list = warp.dom.node('div', { class: 'list' });
    keys.forEach(function (param) {
        var val = selected[param];
        var display = Array.isArray(val) ? val.join(', ') : val;
        var row = warp.dom.node('div', { class: 'item xs' });
        var label = warp.dom.node('a', { class: 'parameter', style: 'flex:1; cursor:pointer', title: 'Click to focus this parameter in Parameters app' });
        label.innerHTML = '<span class="op6">' + param + '</span> : <span style="color:darkorange">' + display + '</span>';
        label.onclick = function () { if (parametersApp && parametersApp.focusParameter) parametersApp.focusParameter(param); };
        var btn = warp.dom.node('button', { class: 'xs round', text: 'x', title: 'Remove this parameter', click: function () {
            if (parametersApp && parametersApp.removeParameter) parametersApp.removeParameter(param);
        }});
        row.appendChild(label);
        row.appendChild(btn);
        list.appendChild(row);
    });
    selectedDrawer.body.innerHTML = '';
    selectedDrawer.body.appendChild(list);
}

// Rewired 2026-05-04 — multifocal detection stable at 99/99.
function detectDiagnoses(location, match, selected) {
    if (!self.diagnoses || !self.diagnoses[location]) return [];
    var pool = self.diagnoses[location];
    var scored = [];
    for (var i = 0; i < pool.length; i++) {
        var dx = pool[i];
        try {
            var r = dx.score(selected, location);
            if (r && r.score > 0) {
                scored.push({
                    id: dx.id,
                    name: dx.name,
                    category: dx.category,
                    score: r.score,
                    confidence: self._ddxConfidence ? self._ddxConfidence(r.score) : '',
                    flags: r.flags || [],
                    alerts: r.alerts || [],
                    workup: dx.workup || []
                });
            }
        } catch (e) { /* skip broken */ }
    }
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored;
}

this.detect = function (selected) {
    var results = { definite: [], probable: [], possible: [] };
    for (var locName in self.rules) {
        var rule = self.rules[locName];
        var result = rule.test(selected);
        if (typeof result === 'object' && result !== null && result.match) {
            var location = result.location || locName;
            if (result.match === 'definite' || result.match === 'probable' || result.match === 'possible') {
                var entry = { location: location, evidence: result.evidence || [], reasoning: result.reasoning || '' };
                if (result.redirect) entry.redirect = result.redirect;
                entry.diagnoses = detectDiagnoses(location, result.match, selected);
                results[result.match].push(entry);
            }
        } else if (result === true) {
            var entry2 = { location: locName, evidence: [], reasoning: '' };
            entry2.diagnoses = detectDiagnoses(locName, 'definite', selected);
            results.definite.push(entry2);
        }
    }
    var hasMatches = results.definite.length || results.probable.length || results.possible.length;
    return hasMatches ? results : false;
};

async function init() {
    Drawer = await loadFileFrom('Parameters', 'drawer.js');

    // Helpers + ddxHelpers + rules + multifocal + diagnoses share ONE eval block so
    // everything can see every helper in scope (rule tests and diagnosis score functions).
    var layout = await warp.layout(self.layout);
    var folder = layout.apps[self.name].folder;
    app.rules = {};
    app.diagnoses = {};
    var bundled = await folder['helpers.js'].text();
    bundled += '\n' + await folder['ddxHelpers.js'].text();
    for (const name of ruleFiles) {
        bundled += '\n' + await folder['rules/' + name + '.js'].text();
    }
    for (const name of diagnosisFiles) {
        bundled += '\n' + await folder['diagnoses/' + name].text();
    }
    // Expose ddxConfidence to the outer closure so detectDiagnoses can tier scores.
    bundled += '\napp._ddxConfidence = ddxConfidence;';
    eval(bundled);
    self.rules = app.rules;
    self.diagnoses = app.diagnoses;
    self._ddxConfidence = app._ddxConfidence;

    parametersApp = await warp.app('Neuro.Parameters');
    app.win.body.style.overflowY = 'hidden';
    app.el.style.overflowX = 'hidden';
    app.win.head.style.border = 'none';
    app.el.innerHTML = '<div class="p20 tl op8" style="background:rgb(10,10,10)"><div class="strong ml-5">Detected : </div></div><div class="detected tl"></div>';
    detectedEl = app.el.querySelector('.detected');

    selectedDrawer = new Drawer({ caption: 'Selected parameters : 0', class: 'mt0 mb0 dark' });
    app.el.appendChild(selectedDrawer.el);
}

self.ready = Promise.resolve().then(init);

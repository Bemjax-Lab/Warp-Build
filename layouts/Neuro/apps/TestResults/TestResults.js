var self = this;
var resultsEl, summaryEl, countEl;
var lastResults = [];

function $(sel) { return app.el.querySelector(sel); }

function sameArr(a, b) {
    var x = (a || []).slice().sort();
    var y = (b || []).slice().sort();
    if (x.length !== y.length) return false;
    for (var i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
    return true;
}

function computePass(expected, actual) {
    return sameArr(expected.definite, actual.definite)
        && sameArr(expected.probable, actual.probable)
        && sameArr(expected.possible, actual.possible);
}

// Highlight entries present in one side but not the other.
function renderValsPart(mine, other) {
    var mineArr  = (mine  || []).slice().sort();
    var otherSet = new Set((other || []).slice());
    var parts = mineArr.map(function (v) {
        var cls = otherSet.has(v) ? '' : ' class="diff"';
        return '<span' + cls + '>' + v + '</span>';
    });
    return '[' + (parts.length ? parts.join(', ') : '') + ']';
}

function buildResultRow(r) {
    var pass = computePass(r.expected, r.actual);
    var row = warp.dom.node('div', { class: 'result ' + (pass ? 'pass' : 'fail') + ' collapsed' });
    var top = warp.dom.node('div', { class: 'row-top' });
    var name = warp.dom.node('span', { class: 'name strong', text: r.name });
    var tag = warp.dom.node('span', { class: 'tag ' + (pass ? 'pass' : 'fail'), text: pass ? 'PASS' : 'FAIL' });

    var loadBtn = warp.dom.node('button', { class: 'xs', text: 'Load', title: 'Load this test\'s parameters into Parameters app' });
    loadBtn.onclick = async function (e) {
        e.stopPropagation();
        if (!r.parameters) return;
        var params = await warp.app('Neuro.Parameters');
        if (params && params.loadSet) {
            params.loadSet(r.parameters);
            params.show();
        }
    };
    var editBtn = warp.dom.node('button', { class: 'xs', text: 'Edit', title: 'Open this test in the Test app' });
    editBtn.onclick = async function (e) {
        e.stopPropagation();
        if (!r.parameters) return;
        var testApp = await warp.app('Neuro.Test');
        if (testApp && testApp.open) {
            testApp.open({
                name: r.name,
                parameters: r.parameters,
                result: r.expected,
                comment: r.comment || ''
            }, !!r.predefined);
        }
    };

    top.appendChild(name);
    top.appendChild(tag);
    top.appendChild(loadBtn);
    top.appendChild(editBtn);
    row.appendChild(top);

    var detail = warp.dom.node('div', { class: 'detail' });
    ['definite', 'probable', 'possible'].forEach(function (lvl) {
        var exp = r.expected[lvl] || [];
        var act = r.actual[lvl] || [];
        if (!exp.length && !act.length) return;   // skip empty tier
        var section = warp.dom.node('div', { class: 'tier' });
        section.appendChild(warp.dom.node('div', {
            class: 'tier-name strong confidence-' + lvl,
            text: lvl.toUpperCase()
        }));
        var expLine = warp.dom.node('div', { class: 'line' });
        expLine.innerHTML = '<span class="lbl">expected</span><span class="vals expected">' + renderValsPart(exp, act) + '</span>';
        var actLine = warp.dom.node('div', { class: 'line' });
        actLine.innerHTML = '<span class="lbl">actual</span><span class="vals actual">' + renderValsPart(act, exp) + '</span>';
        section.appendChild(expLine);
        section.appendChild(actLine);
        detail.appendChild(section);
    });
    if (r.comment) {
        detail.appendChild(warp.dom.node('div', { class: 'comment', text: r.comment }));
    }
    row.appendChild(detail);

    row.onclick = function () { row.classList.toggle('collapsed'); };
    return { row: row, pass: pass };
}

// Public API — always takes an array of results.
// Each result: { name, expected:{definite,probable,possible}, actual:{definite,probable,possible}, comment? }
this.render = function (results) {
    results = Array.isArray(results) ? results : [results];
    lastResults = results;
    var total = results.length;
    resultsEl.innerHTML = '';

    // render in DECLARED order — no sorting
    var built = results.map(buildResultRow);
    var passCount = built.filter(function (b) { return b.pass; }).length;
    built.forEach(function (b) { resultsEl.appendChild(b.row); });

    if (total === 1) {
        var r = results[0];
        var pass = computePass(r.expected, r.actual);
        summaryEl.textContent = r.name;
        summaryEl.className = 'summary strong ' + (pass ? 'pass' : 'fail');
        countEl.textContent = pass ? 'PASS' : 'FAIL';
    } else {
        summaryEl.textContent = 'Run all';
        summaryEl.className = 'summary strong';
        var allPass = passCount === total;
        countEl.textContent = passCount + ' / ' + total + ' passed' + (allPass ? ' — ALL PASS' : ' — ' + (total - passCount) + ' failing');
        if (allPass) {
            var banner = warp.dom.node('div', {
                class: 'all-pass-banner strong tc',
                text: 'All ' + total + ' tests pass'
            });
            resultsEl.insertBefore(banner, resultsEl.firstChild);
        }
    }

    self.show();
};

function compactTiers(obj) {
    var out = {};
    ['definite', 'probable', 'possible'].forEach(function (lvl) {
        if (obj && obj[lvl] && obj[lvl].length) out[lvl] = obj[lvl];
    });
    return out;
}

async function init() {
    resultsEl = $('.results.list');
    summaryEl = $('.summary');
    countEl   = $('.count');
    $('.close').onclick = function () { self.hide(); };
    $('.copy').onclick = async function () {
        var fails = lastResults.filter(function (r) { return !computePass(r.expected, r.actual); });
        if (!fails.length) { warp.gui.toast('No failing results to copy'); return; }
        var out = {};
        fails.forEach(function (r) {
            out[r.name] = { expected: compactTiers(r.expected), got: compactTiers(r.actual) };
        });
        await navigator.clipboard.writeText(JSON.stringify(out, null, 2));
        warp.gui.toast('Copied ' + fails.length + ' failing test(s)');
    };
}

self.ready = Promise.resolve().then(init);

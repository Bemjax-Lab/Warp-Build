var self = this;
var Drawer;
var currentTest = null;
var dirty = false;
var isPredefined = false;

var stdLocs = [
    'C1-C5', 'C6-T2', 'T3-L3', 'L4-S3', 'L7-S3',
    'brainstem-diffuse', 'cerebellum', 'diencephalon', 'forebrain',
    'medulla-caudal', 'medulla-rostral', 'midbrain',
    'peripheral', 'pons',
    'vestibular-central', 'vestibular-paradoxical', 'vestibular-peripheral'
];
// 'multifocal' is available at all tiers per Ivana 2026-04-23.
function locsForLevel(level) {
    return stdLocs.concat(['multifocal']);
}

this.currentName = function () {
    return currentTest ? currentTest.name : null;
};

this.open = async function (testData, predefined) {
    if (!Drawer) {
        var layout = await warp.layout(self.layout);
        var src = await layout.apps['Parameters'].folder['drawer.js'].text();
        Drawer = eval(src);
    }
    isPredefined = !!predefined;
    currentTest = {
        name: testData.name,
        parameters: Object.assign({}, testData.parameters),
        result: testData.result
            ? { definite: (testData.result.definite || []).slice(), probable: (testData.result.probable || []).slice(), possible: (testData.result.possible || []).slice() }
            : { definite: [], probable: [], possible: [] },
        comment: testData.comment || ''
    };
    dirty = false;
    render();
    self.show();
};

function markDirty() {
    dirty = true;
    render();
}

function runDetection() {
    return warp.app('Neuro.Localisation').then(function (loc) {
        return loc.ready.then(function () {
            var detected = loc.detect(currentTest.parameters);
            var actual = { definite: [], probable: [], possible: [] };
            if (detected) {
                ['definite', 'probable', 'possible'].forEach(function (lvl) {
                    if (detected[lvl]) detected[lvl].forEach(function (r) { actual[lvl].push(r.location); });
                });
            }
            return actual;
        });
    });
}

function compareResults(actual) {
    return ['definite', 'probable', 'possible'].every(function (lvl) {
        var exp = (currentTest.result[lvl] || []).slice().sort();
        var act = (actual[lvl] || []).slice().sort();
        if (exp.length !== act.length) return false;
        for (var i = 0; i < exp.length; i++) { if (exp[i] !== act[i]) return false; }
        return true;
    });
}

function hideMenu() {
    var overlay = app.win.el.querySelector('.overlay');
    overlay.style.display = 'none';
    overlay.innerHTML = '';
    overlay.onclick = null;
}

function showAddForm(level) {
    var panel = dom.node('div', { class: 'p10 s0 raised rounded-sm' });

    var title = dom.node('p', { class: 'p5 tsm' });
    title.innerHTML = 'Add localisation result with <span class="strong confidence-' + level + '">' + level.toUpperCase() + '</span> confidence';

    var select = dom.node('select', { class: 'sm mt10 mb10' });
    select.innerHTML = '<option value="" disabled selected>Select localisation...</option>' +
        locsForLevel(level).map(function (n) { return '<option value="' + n + '">' + n + '</option>'; }).join('');

    var bar = dom.node('div', { class: 'mt10', style: 'display:flex;gap:5px;justify-content:flex-end' });
    bar.appendChild(dom.node('button', { class: 'xs primary', text: 'Add', click: function () {
        var val = select.value;
        if (!val) return;
        if (currentTest.result[level].indexOf(val) === -1) {
            currentTest.result[level].push(val);
            markDirty();
        }
        hideMenu();
    }}));
    bar.appendChild(dom.node('button', { class: 'xs', text: 'Cancel', click: hideMenu }));

    panel.appendChild(title);
    panel.appendChild(select);
    panel.appendChild(bar);

    panel.style.cssText = 'position:absolute;top:calc(50% - 50px);left:50%;transform:translate(-50%,-50%);width:250px;z-index:11;';
    var overlay = app.win.el.querySelector('.overlay');
    overlay.innerHTML = '';
    overlay.appendChild(panel);
    overlay.style.display = 'block';
    overlay.style.cursor = 'pointer';
    overlay.onclick = function (e) { if (e.target === overlay) hideMenu(); };
}


function renderResultSection(level, label, container) {
    var header = dom.node('div', { class: 'p5 pt0 pl10 ml10' });
    var headerText = dom.node('span', { class: 'confidence-' + level + ' strong', text: label });
    var addBtn = dom.node('button', { class: 'mi ml5', text: 'Add', click: function () {
        showAddForm(level);
    }});

    header.appendChild(headerText);
    header.appendChild(addBtn);
    container.appendChild(header);

    var result = currentTest.result;
    if (result[level] && result[level].length) {
        var list = dom.node('div', { class: 'list ml20' });
        result[level].forEach(function (name) {
            var row = dom.node('div', { class: 'ml10 mr20 item xs', style: 'cursor:auto' });
            var rowLabel = dom.node('span', { class: 'confidence-' + level, style: 'flex:1', text: name });
            var btn = dom.node('button', { class: 'xs round', text: 'x', click: function () {
                var arr = result[level];
                var idx = arr.indexOf(name);
                if (idx !== -1) arr.splice(idx, 1);
                markDirty();
            }});
            row.appendChild(rowLabel);
            row.appendChild(btn);
            list.appendChild(row);
        });
        container.appendChild(list);
    } else {
       // container.appendChild(dom.node('div', { class: 'p5 pl10 ml20 op4', text: 'nothing' }));
    }
}

function render() {
    app.win.caption(currentTest ? 'Test : ' + currentTest.name : 'Test');
    if (!currentTest) return;

    // button states
    var saveBtn = dom.query('.save');
    if (dirty) saveBtn.classList.remove('disabled');
    else saveBtn.classList.add('disabled');

    var deleteBtn = dom.query('.delete');
    if (isPredefined) deleteBtn.classList.add('disabled');
    else deleteBtn.classList.remove('disabled');

    // results label
    var resultCount = currentTest.result.definite.length + currentTest.result.probable.length + currentTest.result.possible.length;
    dom.query('.results-label').textContent = 'Results (' + resultCount + ') :';

    // results
    var resultsEl = dom.query('.results');
    resultsEl.innerHTML = '';
    renderResultSection('definite', 'DEFINITE', resultsEl);
    renderResultSection('probable', 'PROBABLE', resultsEl);
    renderResultSection('possible', 'POSSIBLE', resultsEl);

    // comment
    var commentEl = dom.query('.comment');
    if (commentEl.value !== currentTest.comment) commentEl.value = currentTest.comment;

    // parameters list
    var paramsEl = dom.query('.params');
    paramsEl.innerHTML = '';
    var keys = Object.keys(currentTest.parameters);
    dom.query('.params-label').textContent = 'Parameters (' + keys.length + ') :';

    for (var i = 0; i < keys.length; i++) {
        (function (param) {
            var val = currentTest.parameters[param];
            var display = Array.isArray(val) ? val.join(', ') : val;
            var row = dom.node('div', { class: 'ml10 mr10 item sm', style: 'cursor:auto' });
            var label = dom.node('span', { style: 'flex:1' });
            label.innerHTML = '<span class="op6">' + param + '</span> : <span style="color:darkorange">' + display + '</span>';
            row.appendChild(label);
            row.appendChild(dom.node('button', { class: 'xs round tlg', text: 'x', click: function () {
                delete currentTest.parameters[param];
                markDirty();
            }}));
            paramsEl.appendChild(row);
        })(keys[i]);
    }
}

// bind toolbar buttons
dom.on('.test', 'click', async function () {
    if (!currentTest) return;
    var actual = await runDetection();
    var tr = await warp.app('Neuro.TestResults');
    await tr.ready;
    tr.render([{
        name: currentTest.name,
        parameters: currentTest.parameters,
        expected: currentTest.result || { definite: [], probable: [], possible: [] },
        actual: actual,
        comment: currentTest.comment || '',
        predefined: isPredefined
    }]);
});

dom.on('.load', 'click', async function () {
    if (!currentTest) return;
    var params = await warp.app('Neuro.Parameters');
    if (params && params.loadSet) {
        params.loadSet(currentTest.parameters);
        params.show();
    }
});

dom.on('.save', 'click', async function () {
    if (!currentTest || !dirty) return;
    var actual = await runDetection();
    if (!compareResults(actual)) {
        var ok = await warp.gui.confirm('This test fails. Are you sure you want to save it?');
        if (!ok) return;
    }
    var testsApp = await warp.app('Neuro.Tests');
    if (testsApp) {
        testsApp.save(currentTest);
        dirty = false;
        render();
        warp.gui.toast('Test "' + currentTest.name + '" saved');
    }
});

dom.on('.delete', 'click', async function () {
    if (!currentTest) return;
    var ok = await warp.gui.confirm('Delete test "' + currentTest.name + '"?');
    if (!ok) return;
    var testsApp = await warp.app('Neuro.Tests');
    if (testsApp && testsApp.remove) testsApp.remove(currentTest.name);
    currentTest = null;
    self.hide();
    warp.gui.toast('Test deleted');
});

dom.on('.rename', 'click', async function () {
    if (!currentTest) return;
    var newName = await warp.gui.input(currentTest.name, 'Rename test');
    if (!newName || newName === currentTest.name) return;
    var testsApp = await warp.app('Neuro.Tests');
    if (!testsApp) return;
    var oldName = currentTest.name;
    // predefined: keep source intact, create a user-defined copy under new name
    if (!isPredefined) testsApp.remove(oldName);
    currentTest.name = newName;
    isPredefined = false;
    testsApp.save(currentTest);
    dirty = false;
    render();
    warp.gui.toast('Renamed to "' + newName + '"');
});

dom.on('.comment', 'input', function (e) {
    if (!currentTest) return;
    currentTest.comment = e.target.value;
    dirty = true;
    // lightweight: just toggle the save button class, don't call full render() which would lose focus on the textarea
    dom.query('.save').classList.remove('disabled');
});

app.win.on('hide', function () {
    if (!dirty) return;
    warp.gui.confirm('Unsaved changes will be lost. Close anyway?').then(function (ok) {
        if (ok) {
            dirty = false;
            self.hide();
        } else {
            self.show();
        }
    });
});

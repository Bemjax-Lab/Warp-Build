var self = this;
var Drawer;
var userList = {};
var definedDrawer, userDrawer;
var failedNames = {};

// read a file from this app's folder, eval in the app closure
async function loadFile(path) {
    var layout = await warp.layout("Neuro");
    var src = await layout.apps["Tests"].folder[path].text();
    if (path.endsWith('.json')) return JSON.parse(src);
    return eval(src);
}


var definedTests;

function readUser() {
    try {
        var data = localStorage.getItem('parameters.json');
        if (data) Object.assign(userList, JSON.parse(data));
    } catch (e) {
        console.error('Failed to load user tests');
    }
}

function writeUser() {
    try {
        localStorage.setItem('parameters.json', JSON.stringify(userList));
        warp.gui.toast('Tests have been saved');
    } catch (e) {
        console.error('Failed to save user tests');
    }
}

function render() {
    if (!definedDrawer || !userDrawer) return;
    definedDrawer.body.innerHTML = '';
    userDrawer.body.innerHTML = '';

    var definedList = warp.dom.node('div', { class: 'list' });
    Object.values(definedTests).forEach(function (data) {
        definedList.append(item(data, false));
    });
    definedDrawer.body.append(definedList);
    definedDrawer.caption.textContent = 'Predefined (' + Object.keys(definedTests).length + ')';

    var userListEl = warp.dom.node('div', { class: 'list' });
    Object.values(userList).forEach(function (data) {
        userListEl.append(item(data, true));
    });
    userDrawer.body.append(userListEl);
    userDrawer.caption.textContent = 'User defined (' + Object.keys(userList).length + ')';
}

this.save = function (data) {
    userList[data.name] = data;
    render();
    writeUser();
};

this.remove = async function (name) {
    delete userList[name];
    render();
    writeUser();
    var testApp = await warp.app('Neuro.Test');
    if (testApp && testApp.currentName && testApp.currentName() === name) testApp.hide();
};

function item(data, removable) {
    var div = warp.dom.node('div', { class: 'item sm' });
    div.style.cursor = 'auto';
    div.onclick = async function () {
        var testApp = await warp.app('Neuro.Test');
        if (!testApp || !testApp.open) return;
        if (!removable && userList[data.name]) {
            var useUser = await warp.gui.confirm('This test is overridden with a user defined test. Would you like to edit that test instead?');
            if (useUser) {
                testApp.open(userList[data.name], false);
                return;
            }
        }
        testApp.open(data, !removable);
    };

    var label = warp.dom.node('a', { title: 'Click to edit this test' });
    label.style.cursor = 'pointer';
    label.style.flex = '1';
    label.style.overflow = 'hidden';
    var nameStyle = failedNames[data.name] ? ' style="color:var(--dangerBg)"' : '';
    label.innerHTML = '<span' + nameStyle + '>' + data.name + '</span> &nbsp;<span class="op5">(' + Object.keys(data.parameters).length + ')</span>'
        + (data.comment ? ' <small class="op7" style="color:var(--itemColor);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + data.comment + '</small>' : '');
    div.appendChild(label);

    var loadBtn = warp.dom.node('button', { class: 'xs', text: 'Load', title: 'Select all test parameters' });
    loadBtn.onclick = async function (e) {
        e.stopPropagation();
        var params = await warp.app('Neuro.Parameters');
        if (params && params.loadSet) {
            params.loadSet(data.parameters);
            params.show();
        }
    };
    div.appendChild(loadBtn);

    if (removable) {
        var removeBtn = warp.dom.node('button', { class: 'xs round', text: 'x' });
        removeBtn.onclick = function (e) {
            e.stopPropagation();
            warp.gui.confirm('Remove "' + data.name + '"?').then(function (ok) {
                if (!ok) return;
                self.remove(data.name);
            });
        };
        div.appendChild(removeBtn);
    }

    return div;
}

function flattenDetected(detected) {
    var result = { definite: [], probable: [], possible: [] };
    if (!detected) return result;
    if (detected.definite) detected.definite.forEach(function (r) { result.definite.push(r.location); });
    if (detected.probable) detected.probable.forEach(function (r) { result.probable.push(r.location); });
    if (detected.possible) detected.possible.forEach(function (r) { result.possible.push(r.location); });
    return result;
}

function compareResults(expected, actual) {
    if (!expected) return false;
    var levels = ['definite', 'probable', 'possible'];
    for (var i = 0; i < levels.length; i++) {
        var lvl = levels[i];
        var exp = (expected[lvl] || []).slice().sort();
        var act = (actual[lvl] || []).slice().sort();
        if (exp.length !== act.length) return false;
        for (var j = 0; j < exp.length; j++) {
            if (exp[j] !== act[j]) return false;
        }
    }
    return true;
}


function renderResultColumn(result) {
    var col = warp.dom.node('div');
    ['definite', 'probable', 'possible'].forEach(function (lvl) {
        var items = result[lvl] || [];
        if (!items.length) return;
        items.forEach(function (name) {
            col.appendChild(warp.dom.node('div', { class: 'confidence-' + lvl, text: name }));
        });
    });
    if (!col.children.length) col.appendChild(warp.dom.node('div', { class: 'op4', text: 'nothing' }));
    return col;
}

function renderFailedTest(name, expected, actual) {
    var card = warp.dom.node('div', { class: 'p5 mb5' });
    card.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
    var openTest = async function () {
        var testData = userList[name] || definedTests[name];
        if (!testData) return;
        var testApp = await warp.app('Neuro.Test');
        if (testApp && testApp.open) testApp.open(testData, !!definedTests[name] && !userList[name]);
    };
    var link = warp.dom.node('a', { class: 'strong mb5', text: name, title: 'Click to edit this test', click: openTest });
    link.style.cursor = 'pointer';
    var editBtn = warp.dom.node('button', { class: 'xs ml5', text: 'Edit', click: openTest });
    card.appendChild(link);
    card.appendChild(editBtn);

    var row = warp.dom.node('div', { class: 'r2' });

    var expCol = warp.dom.node('div');
    expCol.appendChild(warp.dom.node('div', { class: 'op6 mb5', text: 'Expected :' }));
    expCol.appendChild(renderResultColumn(expected));

    var gotCol = warp.dom.node('div');
    gotCol.appendChild(warp.dom.node('div', { class: 'op6 mb5', text: 'Got :' }));
    gotCol.appendChild(renderResultColumn(actual));

    row.appendChild(expCol);
    row.appendChild(gotCol);
    card.appendChild(row);
    return card;
}

async function runAllTests() {
    var loc = await warp.app('Neuro.Localisation');
    await loc.ready;
    var allTests = {};
    Object.assign(allTests, definedTests, userList);
    var results = [];
    failedNames = {};
    for (var name in allTests) {
        var test = allTests[name];
        if (!test.result) continue;
        var actual = flattenDetected(loc.detect(test.parameters));
        var pass = compareResults(test.result, actual);
        if (!pass) failedNames[name] = true;
        results.push({
            name: name,
            parameters: test.parameters,
            expected: test.result,
            actual: actual,
            comment: test.comment || '',
            predefined: !!definedTests[name] && !userList[name]
        });
    }
    render();
    var tr = await warp.app('Neuro.TestResults');
    await tr.ready;
    tr.render(results);
}

function exportTests() {
    var today = new Date().toISOString().slice(0, 10);
    var blob = new Blob([JSON.stringify(userList, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = warp.dom.node('a', { href: url, download: 'tests-' + today + '.json' });
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

var listEl = dom.query('.list');

dom.on('.run-all', 'click', runAllTests);
dom.on('.export', 'click', exportTests);

async function init() {

    definedTests = await loadFile("definedTests.json");

    Drawer = await (async function () {
        var layout = await warp.layout(self.layout);
        var src = await layout.apps['Parameters'].folder['drawer.js'].text();
        return eval(src);
    })();

    definedDrawer = new Drawer({ caption: 'Predefined', class: 'mt0 mb0 dark' });
    userDrawer = new Drawer({ caption: 'User Tests', class: 'mt0 mb0 dark' });

    listEl.append(definedDrawer.el);
    listEl.append(userDrawer.el);

    readUser();
    render();
    definedDrawer.open();
}

Promise.resolve().then(init);

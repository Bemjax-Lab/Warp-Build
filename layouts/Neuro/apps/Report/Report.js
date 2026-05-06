var app = this;

this.inspect = async function (form) {
    app.show();
    var el = dom.query('.report');
    el.innerHTML = '<h2 style="text-transform:capitalize; color:rgb(20,20,20)" class="tl">' + form.breed + '</h2><p class="deseases"></p>';
    var cont = dom.query('.deseases');
    var diaApp = await warp.app('Neuro.Parameters');
    if (form.detected) {
        form.detected.forEach(function (location) {
            location.diagnoses.forEach(function (diagnoseId) {
                var diagnose = diaApp.provided.diagnoses.list[diagnoseId];
                if (diagnose) {
                    var h3 = document.createElement('h3');
                    h3.style.color = 'rgb(20,20,20)';
                    h3.textContent = diagnose.name.toUpperCase();
                    cont.append(h3);
                    diagnose.symptoms.forEach(function (symId) {
                        var sym = diaApp.provided.symptoms.list[symId];
                        var div = document.createElement('div');
                        div.textContent = 'symptom ' + sym.name;
                        cont.append(div);
                    });
                }
            });
        });
    }
};

this.init = function () {
    app.win.caption('<span style="color:rgb(200,200,200)">N<span style="font-family:Oswald; font-weight:normal; color:teal">L</span></span> Report');
    app.win.body.style.overflowY = 'hidden';
    app.win.head.style.border = 'none';
    app.win.content.style.color = 'rgb(20,20,20)';
    app.win.content.style.backgroundColor = 'rgb(220,220,220)';
    app.el.innerHTML = '<div style="background:rgb(180,180,180);" class="tl p10"><div class="m10 mt0 strong" style="font-family:Oswald;font-size:20px; color:rgb(20,20,20)">Neuro<span style="font-family:Oswald; font-weight:bold; color:teal">Loc</span></div><div class="m10">Diff. diagnosys report</div></div><div class="m20 report p20"></div>';
};

// Forebrain diagnoses — rewritten from DDX-main/src/regions/Forebrain.js in our style.
// Uses OUR parameter names directly (no normalise adapter).
// Diagnosis-only params (fever, vaccinated, cough, petechiae, ...) live in
// apps/Localisation/diagnoses/diagnosesParameters.json and are merged into the
// Parameters model at init — Parameters app renders them as extra categories.

app.diagnoses = app.diagnoses || {};
app.diagnoses['forebrain'] = [

// ── 1. Idiopathic Epilepsy ──────────────────────────────────────────────
{ id: 'fb-ie', name: 'Idiopathic Epilepsy', category: 'Functional',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 0;
        if (isBreed(s, predispositions.ie)) A += 20;
        if      (age >= 1 && age <= 5) A += 25;
        else if (age > 5 && age <= 7)  A += 15;
        else if (age < 1)              { A += 5; flags.push('Age <1y — consider storage disease or hydrocephalus'); }
        else if (age > 7)              { A += 5; flags.push('Age >7y — structural cause more likely (tumor)'); }

        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 40;
        else if (oc === 'subacute')                   B = 35;
        else                                          B = 30;

        var C = 0;
        if      (pl === 'none')    C = 30;
        else if (pl === 'at-site') C = 15;
        else                       C = 10;

        var D = 0;
        if (hasSeizures) D += 35;
        if (!s.consciousnessLevel || s.consciousnessLevel === 'alert') D += 15;
        if ((!s.behavior || s.behavior === 'normal') && s.menaceResponseR !== 'absent' && s.menaceResponseL !== 'absent') D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 20;
        var mult = 1;
        if (!hasSeizures)           { mult *= 0.05; flags.push('No seizures — excludes idiopathic epilepsy (×0.05)'); }
        if (age > 7 && hasSeizures) { mult *= 0.7;  flags.push('Late-onset seizures >7y — rule out structural first (×0.7)'); }
        if (s.fever === 'yes')      { mult *= 0.6;  flags.push('Fever — encephalitis more likely than IE (×0.6)'); }
        if (mentalDepressed(s))     { mult *= 0.7;  flags.push('Persistent mental depression — structural/encephalitis more likely (×0.7)'); }

        var postureAbnormal = pelvicPosturalDeficit(s) || thoracicPosturalDeficit(s);
        var abnormalInterictal = (s.menaceResponseR === 'absent' || s.menaceResponseL === 'absent' ||
                                  postureAbnormal ||
                                  (hasValue(s, 'gait', 'circling L') || hasValue(s, 'gait', 'circling R')) || (s.behavior && s.behavior !== 'normal'));
        if (abnormalInterictal) {
            mult *= 0.1;
            flags.push('Persistent interictal neurological deficit (menace/PR/circling) — near-excludes idiopathic epilepsy; structural cause likely (×0.1)');
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain (rule out structural cause — mandatory before IE diagnosis)',
        'CSF analysis (rule out encephalitis/meningitis)',
        'Fasting bile acids + ammonia (hepatic encephalopathy)',
        'Blood glucose, electrolytes, calcium, BUN (metabolic causes)',
        'Genetic testing (breed-specific mutations: EAEE in Border Collie, Lagotto Romagnolo)',
        'Phenobarbital or KBr — start after MRI/CSF confirms idiopathic'
    ]
},

// ── 2. Forebrain Tumor (Meningioma / Glioma) ───────────────────────────
{ id: 'fb-tumor', name: 'Forebrain Tumor (Meningioma/Glioma)', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 0;
        var gliomaBreeds = ['Boxer', 'Bulldog', 'French Bulldog', 'Boston Terrier'];
        if (isBreed(s, gliomaBreeds)) A += 20;
        else if (isBreed(s, predispositions.large)) A += 10;
        if      (age >= 8) A += 30;
        else if (age >= 6) A += 20;
        else if (age >= 4) A += 10;

        var B = 0;
        if      (oc === 'chronic')  B = 45;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15;
        else                        B = 5;

        var C = 0;
        if      (pl === 'none')    C = 25;
        else if (pl === 'at-site') C = 20;
        else                       C = 15;

        var D = 0;
        if (hasSeizures)                                                      D += 15;
        if (mentalDepressed(s))                                                D += 20;
        if ((hasValue(s, 'gait', 'circling L') || hasValue(s, 'gait', 'circling R')))                                   D += 15;
        if (s.menaceResponseR === 'absent' || s.menaceResponseL === 'absent')  D += 15;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 15;
        var mult = 1;
        if (age < 3)           { mult *= 0.3; flags.push('Age <3y — forebrain tumor unlikely (×0.3)'); }
        if (oc === 'peracute') { mult *= 0.5; flags.push('Peracute onset — stroke more likely than tumor (×0.5)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain with contrast (modality of choice — mass, ring-enhancement)',
        'CSF analysis (cytology — rule out inflammatory)',
        'Thoracic radiographs + abdominal ultrasound (staging)',
        'CBC/biochemistry/blood pressure',
        'Neurosurgery or radiation therapy referral'
    ]
},

// ── 3. GME — Forebrain (Granulomatous Meningoencephalitis) ─────────────
{ id: 'fb-gme', name: 'GME — Forebrain (Granulomatous Meningoencephalitis)', category: 'Inflammatory',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 0;
        var gmeBreeds = ['Maltese', 'Yorkshire Terrier', 'Toy Poodle', 'Miniature Poodle', 'Poodle',
            'Chihuahua', 'Dachshund', 'Pug', 'West Highland White Terrier', 'Boston Terrier'];
        if (isBreed(s, gmeBreeds))     A += 20;
        else if (isBreed(s, predispositions.toy)) A += 15;
        if      (age >= 2 && age <= 6) A += 25;
        else if (age > 6 && age <= 9)  A += 15;
        else                           A += 5;

        var B = 0;
        if      (oc === 'subacute') B = 45;
        else if (oc === 'chronic')  B = 35;
        else if (oc === 'acute')    B = 25;
        else                        B = 10;

        var C = 0;
        if      (pl === 'at-site') C = 35;
        else if (pl === 'none')    C = 20;
        else                       C = 15;

        var D = 0;
        if (hasSeizures)                     D += 20;
        if (mentalDepressed(s))              D += 20;
        if ((hasValue(s, 'gait', 'circling L') || hasValue(s, 'gait', 'circling R'))) D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 10;
        var mult = 1;
        if (s.fever === 'yes' && pl === 'at-site') { mult *= 1.3; flags.push('Fever + cervical pain — meningoencephalitis pattern (×1.3)'); }
        if (age > 10)                               { mult *= 0.6; flags.push('Age >10y — tumor more likely than GME (×0.6)'); }
        if (!hasSeizures && !mentalDepressed(s) && (!s.behavior || s.behavior === 'normal') && s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.55; flags.push('No forebrain deficit + no systemic signs — GME unlikely as sole pain presentation (×0.55)');
        }
        if (oc === 'chronic' && s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.6; flags.push('Chronic onset + no systemic signs — inflammatory encephalitis less likely; consider structural/degenerative (×0.6)');
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain with contrast (multifocal or focal enhancing lesions)',
        'CSF analysis — pleocytosis (mononuclear/mixed), elevated protein',
        'Infectious panel: Toxoplasma, Neospora, Cryptococcus, CDV, Ehrlichia',
        'CSF PCR panel (Toxoplasma, Neospora, CDV)',
        'Treatment: prednisolone ± cytarabine (or CCNU) — referral recommended'
    ]
},

// ── 4. NME / NLE — Necrotizing Meningoencephalitis ─────────────────────
{ id: 'fb-nme', name: 'NME / NLE — Necrotizing Meningoencephalitis', category: 'Inflammatory',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 0;
        if (isBreed(s, predispositions.nme)) A += 40;
        if      (age >= 1 && age <= 5) A += 15;
        else if (age > 5 && age <= 8)  A += 10;

        var B = 0;
        if      (oc === 'subacute') B = 40;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'chronic')  B = 20;
        else                        B = 15;

        var C = 0;
        if      (pl === 'at-site') C = 25;
        else if (pl === 'none')    C = 20;
        else                       C = 15;

        var D = 0;
        if (hasSeizures)                     D += 30;
        if (mentalDepressed(s))              D += 20;
        if ((hasValue(s, 'gait', 'circling L') || hasValue(s, 'gait', 'circling R'))) D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (isBreed(s, predispositions.nme)) { mult *= 1.5; flags.push('NME-predisposed breed (×1.5)'); }
        else if (breedKnown(s))              { mult *= 0.3; flags.push('Not an NME-predisposed breed — consider GME instead (×0.3)'); }
        if (!hasSeizures) { mult *= 0.5; flags.push('No seizures — NME less typical without (×0.5)'); }
        if (age < 1)      { mult *= 0.3; flags.push('Age <1y — NME almost never occurs before 1y (×0.3)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain (asymmetric necrotic forebrain lesions — characteristic pattern in Pug/Maltese)',
        'CSF analysis (pleocytosis, elevated protein)',
        'Infectious disease panel (CDV, Toxoplasma, Cryptococcus)',
        'Genetic testing (Pug NME: LRRTM3 association)',
        'Definitive Dx: histopathology (brain biopsy or post-mortem)',
        'Treatment: immunosuppression — guarded-to-poor prognosis'
    ]
},

// ── 5. Hydrocephalus ───────────────────────────────────────────────────
{ id: 'fb-hydro', name: 'Hydrocephalus', category: 'Structural',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 0;
        var hydroBreeds = ['Chihuahua', 'Yorkshire Terrier', 'Maltese', 'Pomeranian', 'Toy Poodle',
            'Boston Terrier', 'Pug', 'Bulldog', 'French Bulldog', 'Lhasa Apso', 'Shih Tzu'];
        if (isBreed(s, hydroBreeds)) A += 30;
        else if (isBreed(s, predispositions.toy)) A += 15;
        if      (age < 1) A += 30;
        else if (age < 2) A += 25;
        else if (age < 4) A += 10;

        var B = 0;
        if      (oc === 'chronic')  B = 40;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15;
        else                        B = 5;

        var C = 0;
        if      (pl === 'none')    C = 25;
        else if (pl === 'at-site') C = 20;
        else                       C = 15;

        var D = 0;
        if (hasSeizures)                                                      D += 20;
        if (mentalDepressed(s))                                                D += 20;
        if ((hasValue(s, 'gait', 'circling L') || hasValue(s, 'gait', 'circling R')))                                   D += 10;
        if (s.menaceResponseR === 'absent' || s.menaceResponseL === 'absent')  D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (age >= 4) { mult *= 0.4; flags.push('Age ≥4y — congenital hydrocephalus unlikely to first present now (×0.4)'); }
        if (breedKnown(s) && !isBreed(s, hydroBreeds) && !isBreed(s, predispositions.toy)) {
            mult *= 0.5; flags.push('Not a predisposed breed (×0.5)');
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain (T2 ventricular dilation, periventricular signal)',
        'Ultrasound through open fontanelle (if present — young toy breeds)',
        'CSF analysis (rule out obstructive cause, infection)',
        'CBC/biochemistry',
        'Medical management: omeprazole, acetazolamide (reduce CSF production)',
        'Surgical: ventriculoperitoneal shunt (specialist referral)'
    ]
},

// ── 6. Forebrain Ischemic Stroke (Cerebrovascular Disease) ─────────────
{ id: 'fb-stroke', name: 'Forebrain Ischemic Stroke (Cerebrovascular Disease)', category: 'Vascular',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 0;
        if (s.breed === 'Cavalier King Charles Spaniel') { A += 20; flags.push('CKCS — predisposed to cerebrovascular disease'); }
        else if (isBreed(s, predispositions.large)) A += 10;
        if      (age >= 7) A += 25;
        else if (age >= 5) A += 20;
        else if (age >= 3) A += 15;
        else               A += 5;

        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 25;
        else                        B = 5;
        if (s.progression === 'stable' || s.progression === 'improving') B = Math.min(50, B + 10);

        var C = 0;
        if      (pl === 'none')    C = 30;
        else if (pl === 'at-site') C = 15;
        else                       C = 10;

        var D = 0;
        if (hasSeizures)                                                      D += 20;
        if (mentalDepressed(s))                                                D += 20;
        if ((hasValue(s, 'gait', 'circling L') || hasValue(s, 'gait', 'circling R')))                                   D += 15;
        if (s.menaceResponseR === 'absent' || s.menaceResponseL === 'absent')  D += 10;
        if (s.progression === 'stable')                                        D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (oc === 'peracute' && pl === 'none')    { mult *= 1.5; flags.push('Peracute + painless — stroke signature (×1.5)'); }
        if (oc === 'chronic' || oc === 'subacute') { mult *= 0.2; flags.push('Chronic/subacute onset — argues against stroke (×0.2)'); }
        if (s.progression === 'worsening' && (parseFloat(s.duration) || 0) > 3) {
            mult *= 0.5; flags.push('Progressive >3 days — tumor/inflammation more likely than stroke (×0.5)');
        }

        alerts.push({
            type: 'INFO',
            title: 'Underlying Cause Workup Required',
            text: 'Forebrain stroke: screen for hypertension (most common cause), hyperadrenocorticism, hypothyroidism, proteinuria/renal disease, coagulopathy, cardiac disease, polycythemia.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain (DWI/FLAIR — forebrain hyperintense lesion without mass effect — diagnostic)',
        'Blood pressure (hypertension — #1 treatable cause)',
        'UCCR / low-dose dex suppression test (hyperadrenocorticism)',
        'Total T4 (hypothyroidism)',
        'Urinalysis + UPC (proteinuria → renal disease)',
        'Coagulation panel (PT/aPTT)',
        'Echocardiography (cardiac emboli)',
        'CBC (polycythemia), biochemistry'
    ]
},

// ── 7. Tick-Borne Meningoencephalitis — Forebrain ──────────────────────
{ id: 'fb-tickborne', name: 'Tick-Borne Meningoencephalitis (Ehrlichia canis / Rickettsia rickettsii) — Forebrain', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 25;

        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 45;
        else if (oc === 'subacute')                   B = 30;
        else if (oc === 'chronic')                    B = 8;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        var C = 0;
        if      (pl === 'at-site') C = 40;
        else if (pl === 'none')    C = 10;
        else                       C = 15;

        var D = 0;
        if (hasSeizures)                                                      D += 20;
        if (mentalDepressed(s))                                                D += 20;
        if ((hasValue(s, 'gait', 'circling L') || hasValue(s, 'gait', 'circling R')))                                   D += 10;
        if (s.menaceResponseR === 'absent' || s.menaceResponseL === 'absent')  D += 10;

        var sysBonus = 0;
        if (s.fever === 'yes')     { sysBonus += 30; flags.push('Fever — MAJOR sign for both Ehrlichia and Rickettsia; tick-borne meningoencephalitis elevated'); }
        if (s.petechiae === 'yes') { sysBonus += 20; flags.push('Petechiae/ecchymoses — vasculitis; strongly suggests Rickettsia rickettsii over Ehrlichia'); }
        if (s.limbEdema === 'yes') { sysBonus += 15; flags.push('Limb/facial oedema — Rickettsia vasculitis pattern (more likely than Ehrlichia)'); }
        if (s.weightLoss === 'yes') sysBonus += 10;
        if (s.anorexia === 'yes')   sysBonus += 10;
        if (s.lethargy === 'yes')   sysBonus += 10;
        if (oc === 'peracute' && s.petechiae === 'yes') {
            flags.push('Peracute + petechiae — Rickettsia rickettsii pattern; treat as RMSF until proven otherwise');
        } else if (oc === 'subacute' && s.petechiae !== 'yes') {
            flags.push('Subacute without petechiae — Ehrlichia canis more likely than Rickettsia');
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + sysBonus + 10;
        var mult = 1;
        if (s.fever !== 'yes') { mult *= 0.2; flags.push('No fever — both Ehrlichia and Rickettsia are always febrile; afebrile presentation near-excludes tick-borne disease (×0.2)'); }
        if (s.fever === 'yes' && (oc === 'peracute' || oc === 'acute')) {
            mult *= 1.4; flags.push('Fever + acute/peracute onset — tick-borne meningoencephalitis pattern (×1.4)');
        }
        if (s.petechiae === 'yes') { mult *= 1.2; flags.push('Petechiae — Rickettsia vasculitis pattern (×1.2)'); }

        alerts.push({
            type: 'CRITICAL',
            title: '⚠️ SAFETY CRITICAL — Doxycycline BEFORE Corticosteroids',
            text: 'Both Ehrlichia AND Rickettsia: start doxycycline 10 mg/kg PO/IV q24h IMMEDIATELY — do NOT wait for results. NEVER give corticosteroids before ruling out tick-borne disease — corticosteroids in Rickettsia can be FATAL. CBC mandatory (thrombocytopenia <50,000/μL). Ehrlichia IFAT + PCR; Rickettsia PCR (blood, first 5 days) + paired serology. Petechiae + peracute = Rickettsia until proven otherwise.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        '⚠️ Start doxycycline 10 mg/kg PO q24h immediately — do NOT wait for results',
        'CBC — thrombocytopenia (<50,000/μL) hallmark of both; anaemia, leukopenia possible',
        'Ehrlichia canis IFAT (≥1:80) + PCR (blood)',
        'Rickettsia rickettsii PCR (blood — highest sensitivity in first 5 days) + IgG/IgM serology (paired titres)',
        'Coagulation panel (DIC risk — Rickettsia)',
        'MRI brain with contrast (meningeal enhancement, multifocal lesions)',
        'CSF analysis (neutrophilic or mixed pleocytosis, elevated protein)',
        'Tick exposure history — Amblyomma cajennense = Rickettsia; Rhipicephalus sanguineus = Ehrlichia',
        'DO NOT administer corticosteroids — can be fatal in Rickettsia rickettsii'
    ]
},

// ── 8. Metabolic Encephalopathy ────────────────────────────────────────
{ id: 'fb-metabolic', name: 'Metabolic Encephalopathy (Hepatic / Hypoglycemic / Hypertensive / Uremic / Electrolyte)', category: 'Metabolic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 0;
        if (age < 1)                   { A = 30; flags.push('Age <1y — hepatic shunt or neonatal hypoglycemia most likely'); }
        else if (age >= 1 && age <= 3)  A = 25;
        else if (age >= 4)              A = 30;
        if (isBreed(s, predispositions.toy)) A = Math.min(50, A + 10);

        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 40;
        else if (oc === 'subacute')                   B = 35;
        else if (oc === 'chronic')                    B = 30;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        var C = 0;
        if      (pl === 'none')    C = 40;
        else if (pl === 'at-site') C = 10;
        else                       C = 15;

        var D = 0;
        if (hasSeizures)          D += 20;
        if (mentalDepressed(s))   D += 25;
        if (s.behavior && s.behavior !== 'normal') D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 15;
        var mult = 1;

        var otherEncephalopathySigns = mentalDepressed(s) || (s.behavior && s.behavior !== 'normal');
        if (hasSeizures && !otherEncephalopathySigns) {
            mult *= 0.1;
            flags.push('Seizures as the only sign — HE/metabolic encephalopathy does NOT present this way; seizures occur late alongside obtundation/behaviour change (×0.1)');
        }

        if (pl === 'at-site' && (s.painCervical === 'severe' || s.painThoracolumbar === 'severe' || s.painLumbar === 'severe' || s.painLumbosacral === 'severe')) {
            mult *= 0.2; flags.push('Severe cervical pain — metabolic encephalopathy is painless; consider meningoencephalitis (×0.2)');
        }

        alerts.push({
            type: 'URGENT',
            title: 'Measure Blood Glucose Immediately',
            text: 'ALWAYS measure blood glucose in any dog with episodic neurological signs before advanced diagnostics. Hypoglycemia (<60 mg/dL) is immediately treatable — dextrose 0.5 mL/kg 50% IV (diluted) bolus.'
        });
        alerts.push({
            type: 'URGENT',
            title: 'Measure Blood Pressure',
            text: 'BLOOD PRESSURE MUST BE MEASURED IN EVERY DOG WITH ACUTE FOREBRAIN SIGNS. Hypertensive encephalopathy (>180 mmHg systolic) requires emergency antihypertensive therapy (amlodipine, hydralazine) before MRI.'
        });
        alerts.push({
            type: 'INFO',
            title: 'Post-Prandial Worsening — Hepatic Encephalopathy',
            text: 'If signs worsen after eating, hepatic encephalopathy (portosystemic shunt or acquired liver disease) ranks 1–2. Measure fasting bile acids + post-prandial bile acids, ammonia. Young dogs with PSS: nausea, ptyalism, head-pressing post-meal are pathognomonic.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        '⚠️ Blood glucose IMMEDIATELY (dextrose if <60 mg/dL before any other diagnostics)',
        '⚠️ Blood pressure (>180 mmHg systolic = hypertensive encephalopathy — treat before MRI)',
        'CBC/biochemistry — BUN, creatinine, ALT, ALP, albumin, glucose, calcium, sodium',
        'Fasting + 2-hour post-prandial bile acids (hepatic shunt/insufficiency)',
        'Blood ammonia (hepatic encephalopathy — handle carefully, analyse immediately)',
        'Urinalysis + UPC (renal disease, ammonium biurate crystals in PSS)',
        'Abdominal ultrasound (portosystemic shunt, liver size/echotexture, adrenals)',
        'MRI brain (after metabolic causes addressed — white matter changes in hepatic encephalopathy)',
        'Insulinoma: fasted blood glucose + insulin:glucose ratio; abdominal ultrasound + CT'
    ]
},

// ── 9. Cognitive Dysfunction Syndrome (CDS) ────────────────────────────
{ id: 'fb-cds', name: 'Cognitive Dysfunction Syndrome (CDS)', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 0;
        if      (age >= 14) A = 50;
        else if (age >= 12) A = 45;
        else if (age >= 10) A = 30;
        else                A = 0;

        var B = 0;
        if      (oc === 'chronic')  B = 50;
        else if (oc === 'subacute') B = 20;
        else                        B = 0;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        var C = 0;
        if      (pl === 'none')    C = 35;
        else if (pl === 'at-site') C = 5;
        else                       C = 10;

        var D = 0;
        if (s.consciousnessLevel === 'somnolent/depressed/obtunded') D += 30;
        if (!hasSeizures) D += 20;
        if (!s.gait || hasValue(s, 'gait', 'normal') || hasValue(s, 'gait', 'ataxia')) D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;

        if (age < 10) { mult *= 0.05; flags.push('Age <10y — CDS does not occur in dogs under 10 years (×0.05)'); }
        if (hasSeizures) { mult *= 0.05; flags.push('Seizures EXCLUDE CDS — CDS does not cause seizures (×0.05)'); }
        if (oc === 'peracute' || oc === 'acute') { mult *= 0.05; flags.push('Acute onset excludes CDS (×0.05)'); }

        var focalDeficit = (s.menaceResponseR === 'absent' || s.menaceResponseL === 'absent' ||
                            pelvicPosturalDeficit(s) || thoracicPosturalDeficit(s));
        if (focalDeficit) {
            mult *= 0.05;
            flags.push('Focal neurological deficit (menace, postural reactions) — excludes CDS; consider structural disease (×0.05)');
        }

        if (s.consciousnessLevel === 'stuporous' || s.consciousnessLevel === 'comatose') {
            mult *= 0.1; flags.push('Stupor/coma — not consistent with CDS; consider metabolic or structural (×0.1)');
        }
        if (s.fever === 'yes') { mult *= 0.3; flags.push('Fever — CDS is not an inflammatory disease (×0.3)'); }

        alerts.push({
            type: 'INFO',
            title: 'CDS — Diagnosis of Exclusion',
            text: 'CDS is the most overdiagnosed condition in veterinary neurology. DISHA signs (Disorientation, Interaction changes, Sleep-wake alterations, Housetraining loss, Activity changes) are required. MRI and full metabolic panel must exclude structural and metabolic causes first. Never diagnose in dogs under 10 years of age.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain (MANDATORY to rule out structural cause — cerebral atrophy may be visible in CDS)',
        'CBC/biochemistry/urinalysis (metabolic causes: hepatic encephalopathy, renal disease)',
        'Fasting bile acids + ammonia (hepatic encephalopathy)',
        'Total T4 (hypothyroidism — can mimic CDS)',
        'Blood pressure (hypertension)',
        'UCCR / low-dose dex (hyperadrenocorticism)',
        'NOTE: CDS is a DISHA diagnosis — requires ≥2 DISHA signs AND exclusion of structural + metabolic causes',
        'Selegiline (L-deprenyl) — only licensed treatment; omega-3, antioxidants, MCT diet as support'
    ]
},

// ── 10. CDV Encephalitis — Forebrain ───────────────────────────────────
{ id: 'fb-cdv', name: 'Canine Distemper Encephalitis (CDV) — Forebrain', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;
        var hasSeizures = s.epilepticSeizures === 'yes';
        var hasMyoclonus = hasValue(s, 'gait', 'myoclonus');

        var A = 0;
        if      (age < 1)              { A = 40; flags.push('Age <1y — highest CDV risk (unvaccinated puppy)'); }
        else if (age >= 1 && age <= 3)  A = 30;
        else if (age > 3 && age <= 6)   A = 15;
        else                            { A = 5; flags.push('Age >6y — CDV encephalitis uncommon in older vaccinated dogs'); }

        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 40;
        else if (oc === 'subacute')                   B = 35;
        else if (oc === 'chronic')                    B = 15;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        var C = 0;
        if      (pl === 'at-site') C = 25;
        else if (pl === 'none')    C = 20;
        else                       C = 15;

        var D = 0;
        if (hasSeizures)                     D += 20;
        if (mentalDepressed(s))              D += 20;
        if ((hasValue(s, 'gait', 'circling L') || hasValue(s, 'gait', 'circling R'))) D += 10;
        if (hasMyoclonus) {
            D += 30;
            flags.push('Myoclonus — highly characteristic of CDV (~40% of cases); near-confirms diagnosis when present');
        }

        var sysBonus = 0;
        if (s.fever === 'yes')          { sysBonus += 20; flags.push('Fever — systemic CDV sign'); }
        if (s.cough === 'yes')          { sysBonus += 15; flags.push('Cough — respiratory CDV involvement (STRONG support)'); }
        if (s.nasalDischarge === 'yes') { sysBonus += 10; flags.push('Nasal discharge — systemic CDV sign'); }
        if (s.vomiting === 'yes' || s.diarrhea === 'yes') { sysBonus += 10; flags.push('GI signs — systemic CDV phase'); }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + sysBonus + 10;
        var mult = 1;
        if (hasMyoclonus) { mult *= 1.5; flags.push('Myoclonus present — CDV multiplier (×1.5)'); }
        if (s.vaccinated === 'yes' || s.vaccinated === 'upToDate') {
            mult *= 0.3; flags.push('Vaccinated dog — CDV unlikely but not impossible in breakthrough infection (×0.3)');
        }
        if (oc === 'chronic' && !hasMyoclonus) { mult *= 0.4; flags.push('Chronic without myoclonus — consider other encephalitis (×0.4)'); }

        alerts.push({
            type: 'CRITICAL',
            title: 'Suspected CDV — Isolation Required',
            text: 'CDV is highly contagious. ISOLATE the patient immediately from other dogs. CDV PCR (nasal swab, urine, CSF) is confirmatory. Check vaccination history. Report to clinic infection control protocol. No specific antiviral. CHRONIC INFLAMMATORY PHASE: prednisolone 2 mg/kg bid × 15d, then taper (1 mg/kg bid × 15d → 0.5 mg/kg bid × 15d); only start if CBC normal and no systemic signs. Anticonvulsants if seizures (phenobarbital or levetiracetam). Screen for coinfections: Neospora caninum, Toxoplasma gondii, Hepatozoon canis. Prognosis: ~75% die or require euthanasia; ~25% acceptable sequelae.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CDV PCR — nasal swab, conjunctival swab, urine, and/or CSF (highest sensitivity combination)',
        'CDV serology (IgM for acute infection) — less reliable than PCR',
        'MRI brain (periventricular white matter lesions, demyelination)',
        'CSF analysis (lymphocytic pleocytosis, elevated protein, CDV PCR on CSF)',
        'CBC/biochemistry (lymphopenia in acute phase — characteristic inclusion bodies on blood smear)',
        'ISOLATION mandatory — highly contagious',
        'Treatment: supportive (IV fluids, seizure control, anti-oedema); phenobarbital for seizures',
        'Prognosis: neurological form carries poor long-term prognosis'
    ]
},

// ── 11. Infectious Meningoencephalitis — Forebrain ─────────────────────
{ id: 'fb-infectious-me', name: 'Infectious Meningoencephalitis (Bacterial/Fungal/Protozoal/Leptospiral/Leishmania)', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 0;
        if      (age < 2)              { A = 30; flags.push('Age <2y — bacterial meningoencephalitis or protozoal more common in young'); }
        else if (age >= 2 && age <= 8)  A = 25;
        else                            A = 20;
        if (s.immunosuppressed === 'yes') { A = Math.min(50, A + 15); flags.push('Immunosuppressed — fungal meningoencephalitis (Cryptococcus) elevated risk'); }

        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 40;
        else if (oc === 'subacute')                   B = 35;
        else if (oc === 'chronic')                    B = 25;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        var C = 0;
        if      (pl === 'at-site') C = 40;
        else if (pl === 'none')    C = 10;
        else                       C = 15;

        var D = 0;
        if (hasSeizures)                                                      D += 20;
        if (mentalDepressed(s))                                                D += 20;
        if ((hasValue(s, 'gait', 'circling L') || hasValue(s, 'gait', 'circling R')))                                   D += 10;
        if (s.menaceResponseR === 'absent' || s.menaceResponseL === 'absent')  D += 10;

        var sysBonus = 0;
        if (s.fever === 'yes')             { sysBonus += 25; flags.push('Fever — infectious/bacterial meningoencephalitis elevated'); }
        if (s.weightLoss === 'yes')          sysBonus += 10;
        if (s.anorexia === 'yes')            sysBonus += 5;
        if (s.lethargy === 'yes')            sysBonus += 5;
        if (s.nasalDischarge === 'yes')    { sysBonus += 10; flags.push('Nasal discharge/mass — Cryptococcus neoformans nasal involvement (consider nasal cytology/culture)'); }
        if (s.otitis === 'yes')            { sysBonus += 15; flags.push('Otitis media/interna — primary source of bacterial meningoencephalitis in ~60% of cases; prioritise bacterial work-up'); }
        if (s.polydipsiaPolyuria === 'yes'){ sysBonus += 10; flags.push('PU/PD — renal involvement; consider Leptospirosis'); }
        if (s.skinLesions === 'yes')       { sysBonus += 10; flags.push('Skin lesions — consider Leishmaniasis (lymphadenopathy, exfoliative dermatitis)'); }
        if (s.lymphadenopathy === 'yes')   { sysBonus += 10; flags.push('Lymphadenopathy — Leishmaniasis, protozoal, or fungal disseminated infection'); }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + sysBonus + 10;
        var mult = 1;
        if (s.fever === 'yes' && pl === 'at-site' && (oc === 'peracute' || oc === 'acute')) {
            mult *= 1.4; flags.push('Fever + meningeal pain + acute onset — bacterial/suppurative meningoencephalitis pattern (×1.4)');
        }
        if (!s.fever && oc === 'chronic') { mult *= 0.5; flags.push('No fever + chronic — fungal/Leishmania more likely than bacterial (×0.5)'); }
        if (!hasSeizures && !mentalDepressed(s) && (!s.behavior || s.behavior === 'normal') && s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.55; flags.push('No forebrain deficit + no systemic signs — infectious meningoencephalitis unlikely as sole pain presentation (×0.55)');
        }
        if (oc === 'chronic' && s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.6; flags.push('Chronic onset + no systemic signs — infectious meningoencephalitis less likely; consider structural/degenerative (×0.6)');
        }

        alerts.push({
            type: 'URGENT',
            title: 'Culture Before Antibiotics — Collect CSF/Blood First',
            text: 'BACTERIAL: blood cultures + CSF culture before antibiotics. Start broad-spectrum: amoxicillin-clavulanate + metronidazole (CNS penetration). FUNGAL (Cryptococcus): cryptococcal antigen (latex agglutination — VERY sensitive), CSF India ink. Treatment: fluconazole ± amphotericin B. PROTOZOAL (Toxo/Neospora): Toxoplasma/Neospora IgG (×4 rise)/PCR (CSF). Treatment: trimethoprim-sulpha/clindamycin + pyrimethamine. LEPTOSPIRA: PCR blood/urine, MAT titres. LEISHMANIA: Leishmania IFAT/PCR.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CSF analysis (cytology — suppurative = bacterial; mixed = fungal/protozoal; mononuclear = fungal/Leishmania)',
        'CSF culture + sensitivity (bacterial — BEFORE antibiotics)',
        'CSF PCR panel: Toxoplasma, Neospora, Cryptococcus, Leptospira, Leishmania',
        'Blood culture (bacterial — aerobic + anaerobic)',
        'Cryptococcal antigen — serum and CSF (latex agglutination — highly sensitive)',
        'Toxoplasma / Neospora serology (IgM + IgG; paired titres 3-4 weeks apart)',
        'Leptospira PCR (blood + urine) + MAT titres',
        'Leishmania IFAT + quantitative PCR (blood/bone marrow)',
        'MRI brain with contrast (meningeal enhancement, multifocal parenchymal lesions)',
        'CBC/biochemistry (leucocytosis with left shift = bacterial; mild abnormalities in fungal/protozoal)',
        'NEVER start corticosteroids before ruling out infectious causes'
    ]
},

// ── 12. Rabies Encephalitis ────────────────────────────────────────────
{ id: 'fb-rabies', name: 'Rabies Encephalitis', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 20;
        if (s.vaccinated === 'yes' || s.vaccinated === 'upToDate') {
            A = 0; flags.push('Vaccinated against rabies — rabies very unlikely (but legally must rule out in endemic areas)');
        }
        if (s.biteHistory === 'yes' || s.wildlifeExposure === 'yes') {
            A += 30; flags.push('Bite wound / wildlife contact — CRITICAL rabies risk factor');
        }

        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 45;
        else if (oc === 'subacute')                   B = 35;
        else if (oc === 'chronic')                    B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        var C = 0;
        if      (pl === 'none')    C = 20;
        else if (pl === 'at-site') C = 15;
        else                       C = 10;

        var D = 0;
        if (hasSeizures)                             D += 20;
        if (mentalDepressed(s))                      D += 15;
        if (s.behavior === 'aggressive')             { D += 30; flags.push('Aggression / behavior change — cardinal rabies sign'); }
        if ((hasValue(s, 'gait', 'circling L') || hasValue(s, 'gait', 'circling R')))         D += 10;
        if (s.swallowingFunction === 'dysphagia')    { D += 20; flags.push('Dysphagia/pharyngeal spasm — rabies hallmark (hydrophobia)'); }
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia')) {
            D += 10; flags.push('Ascending paralysis — dumb rabies form');
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (s.vaccinated === 'yes' || s.vaccinated === 'upToDate') {
            mult *= 0.05; flags.push('Vaccinated — rabies near-excluded (×0.05)');
        }
        if (oc === 'chronic') { mult *= 0.05; flags.push('Chronic course — rabies always kills within days of neurological signs (×0.05)'); }

        alerts.push({
            type: 'CRITICAL',
            title: '⚠️ ZOONOTIC — IMMEDIATE ISOLATION — Do NOT handle saliva/brain tissue unprotected',
            text: 'RABIES IS FATAL AND ZOONOTIC. Isolate the patient immediately. Do NOT perform CSF tap, biopsy, or any procedure creating aerosols without full PPE (N95 mask, double gloves, eye protection). Notify public health authority immediately. Ante-mortem diagnosis requires saliva PCR, skin biopsy (nuchal hair follicles) — only at reference laboratory. Definitive diagnosis requires post-mortem brain FA test. Human contacts must be assessed for post-exposure prophylaxis (PEP).'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        '⚠️ NOTIFY PUBLIC HEALTH AUTHORITY IMMEDIATELY — mandatory reportable disease',
        'DO NOT perform invasive procedures without full PPE (N95, double gloves, eye shield)',
        'ISOLATE patient — no contact with saliva, CSF, or neural tissue',
        'Vaccination history and bite/wildlife exposure documentation',
        'Ante-mortem: saliva RT-PCR + skin biopsy nuchal region (DFA) — reference lab only',
        'Post-mortem: brain DFA test (gold standard — mandatory for definitive diagnosis)',
        'Human contact tracing — all individuals who contacted saliva/neural tissue need PEP assessment',
        'No treatment — supportive care only (disease is 100% fatal once neurological signs begin)'
    ]
},

// ── 13. Pituitary Macroadenoma ─────────────────────────────────────────
{ id: 'fb-pituitary', name: 'Pituitary Macroadenoma', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 0;
        var hacBreeds = ['Boxer', 'Poodle', 'Miniature Poodle', 'Dachshund', 'Yorkshire Terrier',
            'German Shepherd', 'Labrador Retriever', 'Golden Retriever', 'Beagle', 'Bull Terrier'];
        if (isBreed(s, hacBreeds))                  { A += 20; flags.push('HAC-predisposed breed — pituitary macroadenoma risk'); }
        else if (isBreed(s, predispositions.large))  A += 10;
        if      (age >= 8) A += 30;
        else if (age >= 6) A += 20;
        else if (age >= 4) A += 10;
        else               { A += 0; flags.push('Age <4y — pituitary macroadenoma uncommon'); }

        var B = 0;
        if      (oc === 'chronic')  B = 45;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 10;
        else                        B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        var C = 0;
        if      (pl === 'none')    C = 30;
        else if (pl === 'at-site') C = 15;
        else                       C = 10;

        var D = 0;
        if (hasSeizures)                     D += 15;
        if (mentalDepressed(s))              D += 25;
        if ((hasValue(s, 'gait', 'circling L') || hasValue(s, 'gait', 'circling R'))) D += 15;
        if (s.menaceResponseR === 'absent' || s.menaceResponseL === 'absent') {
            D += 20; flags.push('Blindness (absent menace) — optic chiasm compression by pituitary mass');
        }
        if (s.polydipsiaPolyuria === 'yes') { D += 15; flags.push('PU/PD — hyperadrenocorticism (HAC); pituitary-dependent HAC most common cause'); }
        if (s.potBelly === 'yes')           { D += 10; flags.push('Pot belly/muscle wasting — HAC phenotype'); }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 15;
        var mult = 1;
        if (age < 4)           { mult *= 0.2; flags.push('Age <4y — pituitary macroadenoma very unlikely (×0.2)'); }
        if (oc === 'peracute') { mult *= 0.3; flags.push('Peracute onset — tumour unlikely (×0.3)'); }
        if (s.polydipsiaPolyuria === 'yes' && mentalDepressed(s) && oc === 'chronic') {
            mult *= 1.5; flags.push('HAC signs + mental depression + chronic — pituitary macroadenoma pattern (×1.5)');
        }

        alerts.push({
            type: 'INFO',
            title: 'HAC Workup Mandatory — LDDST / HDDS Test',
            text: 'Screen for HAC before advanced imaging: UCCR (urine), ACTH stimulation test, low-dose dexamethasone suppression test (LDDST). High-dose DST (HDDST) differentiates pituitary-dependent (PDH) from adrenal tumor. PDH = 85% of HAC. Pituitary macroadenoma (>1 cm) compresses diencephalon — neurological signs correlate with tumour size. Referral for pituitary irradiation or transsphenoidal hypophysectomy.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain — pituitary region (T1 post-contrast: macroadenoma >1 cm, dorsal extension, diencephalic compression)',
        'CT pituitary (alternative to MRI — less detail but identifies large macroadenomas)',
        'UCCR (urine cortisol:creatinine ratio — screen for HAC)',
        'ACTH stimulation test (confirm HAC)',
        'Low-dose dexamethasone suppression test (LDDST)',
        'High-dose DST (differentiate PDH from adrenal tumor)',
        'CBC/biochemistry (stress leukogram, elevated ALP, hyperglycaemia in HAC)',
        'Abdominal ultrasound (bilateral adrenal hyperplasia vs adrenal mass)',
        'Blood pressure (HAC associated with hypertension)',
        'Pituitary irradiation or transsphenoidal hypophysectomy (specialist referral)',
        'Trilostane/mitotane for PDH (adrenal-directed treatment — does not shrink tumour)'
    ]
},

// ── 14. Congenital Forebrain Disease ───────────────────────────────────
{ id: 'fb-congenital', name: 'Congenital Forebrain Disease (Lissencephaly / Cortical Dysplasia / Agenesis)', category: 'Structural',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 0;
        var congenBreeds = ['Lhasa Apso', 'Irish Setter', 'Wire Fox Terrier', 'Miniature Poodle',
            'Border Collie', 'Rottweiler'];
        if (isBreed(s, congenBreeds))            { A += 30; flags.push('Breed predisposed to lissencephaly or cortical dysplasia'); }
        else if (isBreed(s, predispositions.toy)) A += 10;
        if      (age < 0.5)             { A += 40; flags.push('Age <6 months — congenital structural anomaly most likely'); }
        else if (age >= 0.5 && age < 1)  A += 35;
        else if (age >= 1 && age <= 2)   { A += 15; flags.push('Age 1-2y — congenital disease possible if signs since puppyhood'); }
        else                             { A += 0;  flags.push('Age >2y — if signs only started now, congenital cause unlikely'); }

        var B = 0;
        if      (oc === 'chronic')  B = 45;
        else if (oc === 'subacute') B = 25;
        else if (oc === 'acute')    B = 10;
        else                        B = 5;
        if (s.progression === 'stable')    B = Math.min(50, B + 15);
        if (s.progression === 'worsening') { B = Math.max(0, B - 15); flags.push('Progressive worsening — less typical of static congenital lesion; consider acquired cause'); }

        var C = 0;
        if      (pl === 'none')    C = 35;
        else if (pl === 'at-site') C = 10;
        else                       C = 15;

        var D = 0;
        if (hasSeizures)                                                      D += 25;
        if (mentalDepressed(s))                                                D += 20;
        if ((hasValue(s, 'gait', 'circling L') || hasValue(s, 'gait', 'circling R')))                                   D += 10;
        if (s.menaceResponseR === 'absent' || s.menaceResponseL === 'absent')  D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (age > 3 && oc !== 'chronic') { mult *= 0.1; flags.push('Age >3y without signs from puppyhood — congenital brain malformation very unlikely (×0.1)'); }
        if (s.fever === 'yes')           { mult *= 0.2; flags.push('Fever — congenital malformations are not febrile (×0.2)'); }
        if (s.progression === 'stable')  { mult *= 1.3; flags.push('Non-progressive (stable) — consistent with static congenital anomaly (×1.3)'); }

        alerts.push({
            type: 'INFO',
            title: 'Congenital Brain Malformation — Signs Present from Birth or Early Life',
            text: 'Key feature: signs present since puppyhood (or worsening of existing signs). Lissencephaly: smooth brain surface on MRI, small brain, seizures, visual deficits — Lhasa Apso predisposed. Cortical dysplasia: similar presentation. Signs are typically non-progressive. MRI is diagnostic. No specific treatment — seizure management with phenobarbital ± KBr. Prognosis: variable (depends on severity); many dogs can have acceptable quality of life.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain (T1/T2 — lissencephaly: agyria, simplified gyral pattern, thin cortex; small brain)',
        'Thorough signalment history — onset of signs (puppyhood vs acquired)',
        'Purebred breeding history (recessive conditions in predisposed breeds)',
        'CSF analysis (rule out inflammatory cause)',
        'CBC/biochemistry (rule out metabolic causes)',
        'Genetic counselling (do not breed affected animals or carrier parents)',
        'Seizure management: phenobarbital (start 2-3 mg/kg PO q12h; target trough 20-30 μg/mL)',
        'Prognosis: guarded to good for quality of life in mild cases; poor in severe cortical dysplasia'
    ]
}

];

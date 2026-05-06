// L7-S3 / Cauda Equina diagnoses — rewritten from DDX-main/src/regions/L7-S3.js in our style.
// Uses OUR parameter names directly (no normalise adapter).
// Diagnosis-only params (fever, vaccinated, cough, petechiae, ...) live in
// apps/Localisation/diagnoses/diagnosesParameters.json and are merged into the
// Parameters model at init — Parameters app renders them as extra categories.
// Cauda equina only (no spinal cord) — LMN pelvic, perineal, tail signs.
// Pain: lumbosacral (L7-S1 most common disc in dogs).

app.diagnoses = app.diagnoses || {};
app.diagnoses['L7-S3'] = [

// ── 1. Hansen Type I IVDD — L7-S1 (Acute) ──────────────────────────────
{ id: 'ls-ivdd1', name: 'Hansen Type I IVDD — L7-S1 (Acute)', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var perinealDec = (s.perinealReflexR === 'decreased' || s.perinealReflexR === 'absent' ||
                           s.perinealReflexL === 'decreased' || s.perinealReflexL === 'absent');
        var withdrawalDec = (s.withdrawalPelvicR === 'decreased' || s.withdrawalPelvicR === 'absent' ||
                             s.withdrawalPelvicL === 'decreased' || s.withdrawalPelvicL === 'absent' ||
                             s.extensorTonePelvicR === 'decreased' || s.extensorTonePelvicL === 'decreased');

        // [A] Signalment — chondrodystrophic breeds 3-8y; less common site than thoracolumbar
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if (age >= 3 && age <= 8) A = 50;
        else if ((age >= 2 && age < 3) || (age > 8 && age <= 10)) A = 30;
        else A = 10;
        if (!isBreed(s, predispositions.chondro)) A = Math.round(A * 0.5);

        // [B] Temporal — peracute/acute onset
        var B = 0;
        if      (oc === 'peracute') B = 25;
        else if (oc === 'acute')    B = 30;
        else if (oc === 'subacute') B = 15;
        else                        B = 0;
        if (s.progression === 'stable' || s.progression === 'improving') B += 15;
        else if (s.progression === 'worsening') B += 5;

        // [C] Pain — severe lumbosacral pain; hallmark
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 5;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 35;
            else if (hasPainLevel(s, 'mild'))     C = 20;
        }

        // [D] Deficit — cauda equina LMN pattern; can stay ambulatory
        var D = 0;
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia')) {
            D = 20;
            if (perinealDec)   D += 15;
            if (withdrawalDec) D += 10;
            if (s.asymmetry)   D += 5;
        } else if (!s.gait || hasValue(s, 'gait', 'normal')) {
            D = 15; // pain-only with LMN signs at LS junction
            if (perinealDec) D += 15;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L7-S3') + 15;
        var mult = 1;
        if (oc === 'chronic' || (parseFloat(s.duration) || 0) > 14) {
            mult *= 0.05; flags.push('Chronic onset — essentially excludes Type I IVDD (×0.05)');
        }
        if (s.painProgression === 'disappeared within 24/48 h') {
            mult *= 0.3; flags.push('Pain resolved 24–48 h — FCEM/ANNPE more likely (×0.3)');
        }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI lumbosacral (gold standard — L7-S1 disc herniation, cauda equina compression)',
        'CT myelogram (alternative if MRI unavailable)',
        'Deep pain assessment — cauda equina IVDD: preserve sensation at paws and perineum',
        'CBC/biochemistry/urinalysis',
        'Bladder assessment (LMN bladder: easily expressed, urinary/fecal incontinence)'
    ]
},

// ── 2. Hansen Type II IVDD — L7-S1 (Chronic) ───────────────────────────
{ id: 'ls-ivdd2', name: 'Hansen Type II IVDD — L7-S1 (Chronic)', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var perinealDec = (s.perinealReflexR === 'decreased' || s.perinealReflexR === 'absent' ||
                           s.perinealReflexL === 'decreased' || s.perinealReflexL === 'absent');
        var withdrawalDec = (s.withdrawalPelvicR === 'decreased' || s.withdrawalPelvicR === 'absent' ||
                             s.withdrawalPelvicL === 'decreased' || s.withdrawalPelvicL === 'absent' ||
                             s.extensorTonePelvicR === 'decreased' || s.extensorTonePelvicL === 'decreased');

        // [A] Signalment — older large/medium breeds; also older chondrodystrophics
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age >= 7)  A = 50;
        else if (age >= 5)  A = 30;
        else if (age >= 3)  A = 15;
        else                A = 0;
        if (isBreed(s, predispositions.large))  A = Math.min(50, A + 10);
        if (isBreed(s, predispositions.chondro) && age >= 7) A = Math.min(50, A + 5);

        // [B] Temporal — chronic progressive is hallmark
        var B = 0;
        if      (oc === 'chronic')  B = 50;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 10;
        else                        B = 0;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — variable; often moderate lumbosacral pain
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 10;
        else {
            if      (hasPainLevel(s, 'mild'))     C = 35;
            else if (hasPainLevel(s, 'moderate')) C = 30;
            else if (hasPainLevel(s, 'severe'))   C = 15; // severe pain → suspect Type I or tumor
        }

        // [D] Deficit — ambulatory paraparesis typical; DLSS overlap common
        var D = 0;
        var ambulatory = s.ambulation === 'ambulatory';
        if (hasValue(s, 'gait', 'paraparesis') && ambulatory) {
            D = 35;
            if (perinealDec)   D += 10;
            if (withdrawalDec) D += 5;
        } else if (!s.gait || hasValue(s, 'gait', 'normal')) {
            D = 20;
            if (perinealDec) D += 15; // LMN signs without gait deficit = Type II cauda equina
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L7-S3') + 15;
        var mult = 1;
        if (oc === 'peracute') { mult *= 0.1; flags.push('Peracute onset — essentially excludes Type II (×0.1)'); }
        if (s.onset === 'acute') { mult *= 0.2; flags.push('Acute onset — Type II IVDD is a chronic degenerative process (×0.2)'); }
        if (hasPainLevel(s, 'severe') && pl === 'at-site') {
            mult *= 0.4; flags.push('Severe LS pain — consider Type I IVDD or discospondylitis (×0.4)');
        }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI lumbosacral (disc protrusion/bulging, foraminal stenosis, epidural fat signal)',
        'CT (bony stenosis, facet joint hypertrophy)',
        'Bladder assessment'
    ]
},

// ── 3. Peracute Non-Compressive Myelopathy (FCEM/ANNPE) — L7-S1 ────────
{ id: 'ls-fcem-annpe', name: 'Peracute Non-Compressive Myelopathy (FCEM/ANNPE) — L7-S1', category: 'Vascular/Traumatic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var perinealDec = (s.perinealReflexR === 'decreased' || s.perinealReflexR === 'absent' ||
                           s.perinealReflexL === 'decreased' || s.perinealReflexL === 'absent');
        var withdrawalDec = (s.withdrawalPelvicR === 'decreased' || s.withdrawalPelvicR === 'absent' ||
                             s.withdrawalPelvicL === 'decreased' || s.withdrawalPelvicL === 'absent' ||
                             s.extensorTonePelvicR === 'decreased' || s.extensorTonePelvicL === 'decreased');

        // [A] Signalment — any adult; large/medium breeds most; also chondrodystrophic (ANNPE)
        var age = parseFloat(s.age) || 0;
        var A = age >= 1 ? 40 : 20;
        if (isBreed(s, predispositions.fcem) || isBreed(s, predispositions.chondro)) A = Math.min(50, A + 10);

        // [B] Temporal — peracute during exertion is hallmark; NON-progressive
        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 20;
        else                        B = 0;
        if (s.progression === 'stable' || s.progression === 'improving') B = Math.min(50, B + 10);

        // [C] Pain — classically transient or absent; resolves within 24–48h
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 40;
        else {
            if      (s.painProgression === 'disappeared within 24/48 h') C = 50;
            else if (hasPainLevel(s, 'mild'))     C = 30;
            else if (hasPainLevel(s, 'moderate')) C = 5;
            else                                  C = 0;
        }

        // [D] Deficit — asymmetric LMN cauda equina signs; asymmetry is hallmark
        var D = 0;
        var asym = !!(s.asymmetry);
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia')) {
            D = 20;
            if (asym)          D += 15;
            if (perinealDec)   D += 10;
            if (withdrawalDec) D += 5;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L7-S3') + 15;
        var mult = 1;
        if (oc === 'chronic') { mult *= 0.05; flags.push('Chronic onset excludes FCEM/ANNPE (×0.05)'); }
        if (s.progression === 'worsening' && (parseFloat(s.duration) || 0) > 2) {
            mult *= 0.2; flags.push('Progressive after 48 h — not consistent with FCEM/ANNPE (×0.2)');
        }
        if (oc === 'peracute') {
            mult *= 1.5; flags.push('Peracute onset during activity — strong FCEM/ANNPE pattern (×1.5)');
        }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI lumbosacral (FCEM: normal discs + T2 cauda equina lesion; ANNPE: collapsed L7-S1 disc + cord lesion)',
        'ANNPE at L7-S1 is less common than thoracolumbar but well-described, especially in chondrodystrophics',
        'CBC/biochemistry',
        'Rule out thromboembolism (cardiac echo if systemic disease suspected)'
    ]
},

// ── 4. DLSS / Cauda Equina Syndrome ────────────────────────────────────
{ id: 'ce-dlss', name: 'Degenerative Lumbosacral Stenosis (DLSS) / Cauda Equina Syndrome', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // Cauda equina LMN signs
        var perinealDec = (s.perinealReflexR === 'decreased' || s.perinealReflexR === 'absent' ||
                           s.perinealReflexL === 'decreased' || s.perinealReflexL === 'absent');
        var withdrawalDec = (s.withdrawalPelvicR === 'decreased' || s.withdrawalPelvicR === 'absent' ||
                             s.withdrawalPelvicL === 'decreased' || s.withdrawalPelvicL === 'absent' ||
                             s.extensorTonePelvicR === 'decreased' || s.extensorTonePelvicL === 'decreased');
        var tailParesis = s.tailPosture === 'flaccid';

        // [A] Signalment — large breeds >5 years; GSD most predisposed
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age >= 7)       A = 50;
        else if (age >= 5)       A = 40;
        else if (age >= 3)       A = 20;
        else                     A = 5;
        if (isBreed(s, predispositions.large)) A = Math.min(50, A + 10);

        // [B] Temporal — chronic is hallmark; insidious onset over months
        var B = 0;
        if      (oc === 'chronic')  B = 50;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15; // acute disc extrusion at L7-S1 possible
        else                        B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);
        else                               B = Math.min(50, B + 5);

        // [C] Pain — lumbosacral pain is the hallmark; worse on LS extension/palpation
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 5;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 40;
            else if (hasPainLevel(s, 'mild'))     C = 25;
        }

        // [D] Deficit — AMBULATORY is the expected state; non-ambulatory is atypical
        // Cauda equina = sciatic claudication, exercise intolerance, reluctance to jump
        var D = 0;
        var ambulatory  = s.ambulation === 'ambulatory';
        var paraparesis = hasValue(s, 'gait', 'paraparesis');
        if (ambulatory && (!s.gait || hasValue(s, 'gait', 'normal'))) {
            D = 50; // pain-only/ambulatory = most classic DLSS presentation
        } else if (ambulatory && paraparesis) {
            D = 35; // ambulatory paraparesis — more advanced
        } else if (!ambulatory) {
            D = 10; // non-ambulatory is unusual for cauda equina
        }
        if (perinealDec)  D = Math.min(50, D + 10); // confirms L7-S3 nerve roots
        if (withdrawalDec) D = Math.min(50, D + 5);
        if (tailParesis)  D = Math.min(50, D + 5);

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L7-S3') + 20;
        var mult = 1;
        if (s.ambulation === 'non ambulatory') {
            mult *= 0.3; flags.push('Non-ambulatory — atypical for cauda equina; consider L4-S3 lesion (×0.3)');
        }
        if (hasValue(s, 'gait', 'ataxia')) {
            mult *= 0.3; flags.push('Proprioceptive ataxia — no spinal cord at L7-S3; consider L4-S3 (×0.3)');
        }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI lumbosacral (gold standard — L7-S1 disc extrusion/protrusion, foraminal stenosis, epidural fat signal)',
        'CT (bony stenosis, facet joint hypertrophy — often better than MRI for DLSS)',
        'Radiographs (spondylosis, transitional vertebra L7, disc space narrowing)',
        'Dynamic radiographs: flexion/extension (lumbosacral instability)',
        'EMG (perineal and tail muscles — L7-S3 denervation pattern)',
        'Bladder/bowel assessment (LMN bladder: easily expressed, urinary incontinence)'
    ]
},

// ── 5. Discospondylitis — L7-S1 ────────────────────────────────────────
{ id: 'ls-disco', name: 'Discospondylitis — L7-S1', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var perinealDec = (s.perinealReflexR === 'decreased' || s.perinealReflexR === 'absent' ||
                           s.perinealReflexL === 'decreased' || s.perinealReflexL === 'absent');

        // [A] Signalment — middle-aged large breeds; intact/recently bred
        // L7-S1 is the MOST COMMON site for discospondylitis in dogs
        var age = parseFloat(s.age) || 0;
        var A = 30;
        if (age >= 4 && age <= 10) A = 45;
        if (isBreed(s, predispositions.large)) A = Math.min(50, A + 10);

        // [B] Temporal — subacute/chronic progressive
        var B = 0;
        if      (oc === 'subacute') B = 35;
        else if (oc === 'chronic')  B = 25;
        else if (oc === 'acute')    B = 15;
        else                        B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 20);
        else                               B = Math.min(50, B + 5);

        // [C] Pain — severe focal lumbosacral pain; hallmark of the disease
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 0;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 40;
            else if (hasPainLevel(s, 'mild'))     C = 25;
        }

        // [D] Deficit — pain-dominant; ambulatory paresis when cord/nerve root compressed
        var D = 0;
        var ambulatory = s.ambulation === 'ambulatory';
        if (ambulatory && (!s.gait || hasValue(s, 'gait', 'normal'))) {
            D = 40; // pain-only ambulatory = very common presentation
        } else if (ambulatory && hasValue(s, 'gait', 'paraparesis')) {
            D = 30;
            if (perinealDec) D += 10;
        } else if (!ambulatory) {
            D = 20; // can progress to non-ambulatory
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L7-S3') + systemicScore(s) + 10;
        var mult = 1;
        if (pl === 'none') { mult *= 0.05; flags.push('Painless — near-excludes discospondylitis (×0.05)'); }

        alerts.push({
            type: 'WARNING',
            title: 'Brucella canis — Mandatory Screening (Zoonotic)',
            text: 'L7-S1 is the most common discospondylitis site. Brucella canis MUST be ruled out before treatment if patient is intact or recently bred. Zoonotic risk. ELISA/AGID/PCR serology required.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Radiographs (endplate lysis, disc space narrowing at L7-S1 — often diagnostic)',
        'MRI lumbosacral (early lesions, epidural empyema, nerve root compression)',
        'CBC/biochemistry (leukocytosis, elevated CRP)',
        'Blood cultures (3 sets, aerobic + anaerobic)',
        'Brucella canis serology — MANDATORY before treatment (ELISA, AGID, PCR)',
        'Urine culture (ascending urinary tract infection common source)'
    ]
},

// ── 6. Spinal Tumor — Cauda Equina / Lumbosacral ───────────────────────
{ id: 'ls-tumor', name: 'Spinal Tumor — Cauda Equina / Lumbosacral', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var perinealDec = (s.perinealReflexR === 'decreased' || s.perinealReflexR === 'absent' ||
                           s.perinealReflexL === 'decreased' || s.perinealReflexL === 'absent');

        // [A] Signalment — middle-aged to older; any breed
        // Nerve sheath tumors, meningiomas, vertebral tumors (osteosarcoma, lymphoma)
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age >= 7)       A = 50;
        else if (age >= 4)       A = 35;
        else if (age >= 2)       A = 20;
        else                     A = 10;
        if (isBreed(s, predispositions.large)) A = Math.min(50, A + 5);

        // [B] Temporal — slow progressive; acute with pathological fracture
        var B = 0;
        if      (oc === 'chronic')  B = 40;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15;
        else                        B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 15);

        // [C] Pain — often severe; constant (vs DLSS which worsens with activity)
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 10;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 35;
            else if (hasPainLevel(s, 'mild'))     C = 20;
        }

        // [D] Deficit — progressive LMN signs; nerve sheath tumor: monoparesis of pelvic limb possible
        var D = 0;
        var monoParaPelvic = (hasValue(s, 'gait', 'monoparesis RT') || hasValue(s, 'gait', 'monoparesis LT') ||
                              hasValue(s, 'gait', 'monoplegia RT') || hasValue(s, 'gait', 'monoplegia LT'));
        if (monoParaPelvic) {
            D = 40; // sciatic nerve involvement: pelvic monoparesis
            if (perinealDec) D += 10;
        } else if (hasValue(s, 'gait', 'paraparesis')) {
            D = 25;
            if (perinealDec) D += 15;
            if (s.asymmetry) D += 10;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L7-S3') + 10;
        var mult = 1;
        if (age < 2 && breedKnown(s) && !isBreed(s, predispositions.large)) {
            mult *= 0.1; flags.push('Age <2y small breed — spinal neoplasia very unlikely (×0.1)');
        } else if (age < 2) {
            mult *= 0.3; flags.push('Age <2y — spinal neoplasia uncommon in young dogs (×0.3)');
        } else if (age < 4 && breedKnown(s) && !isBreed(s, predispositions.large)) {
            mult *= 0.3; flags.push('Age <4y small/medium breed — spinal neoplasia uncommon (×0.3)');
        }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI lumbosacral with contrast (mass characterization; nerve sheath "dumbbell" foraminal extension)',
        'CT (bony destruction — osteosarcoma, vertebral lymphoma)',
        'CT thorax + abdominal ultrasound (staging — primary tumor search)',
        'CBC/biochemistry (hypercalcemia in some tumors)',
        'CSF analysis with cytology',
        'Biopsy/histopathology (definitive)'
    ]
},

// ── 7. Fracture/Luxation — Lumbosacral ─────────────────────────────────
{ id: 'ls-fracture', name: 'Fracture/Luxation — Lumbosacral', category: 'Vascular/Traumatic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var perinealDec = (s.perinealReflexR === 'decreased' || s.perinealReflexR === 'absent' ||
                           s.perinealReflexL === 'decreased' || s.perinealReflexL === 'absent');

        // [A] Signalment — any age; trauma history is the key
        var A = s.traumaHistory === 'yes' ? 50 : 25;

        // [B] Temporal — peracute/acute
        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 30;
        else if (oc === 'subacute') B = 10;
        else                        B = 0;

        // [C] Pain — severe lumbosacral pain
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 0;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 30;
            else if (hasPainLevel(s, 'mild'))     C = 15;
        }

        // [D] Deficit — LMN cauda equina signs; tail paresis/paralysis common
        var D = 0;
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia')) {
            D = 30;
            if (perinealDec) D += 15;
            if (s.deepPain === 'absent') D += 5;
        } else if (!s.gait || hasValue(s, 'gait', 'normal')) {
            D = 20;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L7-S3') + 10;
        var mult = 1;
        if (s.traumaHistory === 'yes') {
            mult *= 2.0; flags.push('Confirmed trauma — fracture/luxation most likely (×2.0)');
        } else if (oc === 'peracute') {
            mult *= 1.5; flags.push('Peracute onset — consider occult trauma (×1.5)');
        }
        if (oc === 'chronic') { mult *= 0.1; flags.push('Chronic onset inconsistent with fracture/luxation (×0.1)'); }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Radiographs (fracture, sacral fracture, L7 fracture/luxation — first test)',
        'CT (fracture characterization, surgical planning)',
        'Handle with care — immobilize before transport',
        'Full trauma workup (thoracic/abdominal radiographs)',
        'Bladder assessment (LMN bladder)',
        'Perineal sensation and tail tone assessment'
    ]
},

// ── 8. Tick-Borne Disease — Lumbosacral / Cauda Equina ─────────────────
{ id: 'ls-tickborne', name: 'Tick-Borne Disease (Ehrlichia canis / Rickettsia rickettsii) — Lumbosacral / Cauda Equina', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var perinealDec = (s.perinealReflexR === 'decreased' || s.perinealReflexR === 'absent' ||
                           s.perinealReflexL === 'decreased' || s.perinealReflexL === 'absent');

        // [A] — any age, any breed; tick exposure key
        var A = 25;

        // [B] — peracute/acute (Rickettsia hallmark); acute to subacute (Ehrlichia)
        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 45;
        else if (oc === 'subacute')                   B = 30;
        else if (oc === 'chronic')                    B = 8;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — lumbosacral pain with polyradiculoneuritis/meningeal involvement
        var C = 0;
        if      (pl === 'elsewhere') C = 15;
        else if (pl === 'none')      C = 15;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 45;
            else if (hasPainLevel(s, 'moderate')) C = 35;
            else if (hasPainLevel(s, 'mild'))     C = 20;
        }

        // [D] Deficit — cauda equina LMN signs; often ambulatory
        var D = 0;
        var ambulatory = s.ambulation === 'ambulatory';
        if (hasValue(s, 'gait', 'paraparesis') && ambulatory) {
            D = 30;
            if (perinealDec) D += 10;
        } else if (!s.gait || hasValue(s, 'gait', 'normal')) {
            D = 25;
            if (perinealDec) D += 10;
        }

        // Systemic signs — fever MANDATORY for both agents
        var sysBonus = 0;
        if (s.fever === 'yes')      { sysBonus += 30; flags.push('Fever — MAJOR sign for both Ehrlichia and Rickettsia; tick-borne disease elevated'); }
        if (s.petechiae === 'yes')  { sysBonus += 20; flags.push('Petechiae/ecchymoses — vasculitis; strongly suggests Rickettsia rickettsii over Ehrlichia'); }
        if (s.limbEdema === 'yes')  { sysBonus += 15; flags.push('Limb oedema — Rickettsia vasculitis pattern (more likely than Ehrlichia)'); }
        if (s.weightLoss === 'yes')   sysBonus += 10;
        if (s.anorexia === 'yes')     sysBonus += 10;
        if (s.lethargy === 'yes')     sysBonus += 10;
        // Differentiating hints
        if (oc === 'peracute' && s.petechiae === 'yes') {
            flags.push('Peracute + petechiae — Rickettsia rickettsii pattern; treat as RMSF until proven otherwise');
        } else if (oc === 'subacute' && s.petechiae !== 'yes') {
            flags.push('Subacute without petechiae — Ehrlichia canis more likely than Rickettsia');
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L7-S3') + sysBonus + 10;
        var mult = 1;
        if (s.fever !== 'yes') { mult *= 0.2; flags.push('No fever — both Ehrlichia and Rickettsia are always febrile; afebrile presentation near-excludes tick-borne disease (×0.2)'); }
        if (s.fever === 'yes' && (oc === 'peracute' || oc === 'acute')) {
            mult *= 1.4; flags.push('Fever + acute/peracute onset — tick-borne disease pattern (×1.4)');
        }
        if (s.petechiae === 'yes') { mult *= 1.2; flags.push('Petechiae — Rickettsia vasculitis pattern (×1.2)'); }

        alerts.push({
            type: 'CRITICAL',
            title: '⚠️ SAFETY CRITICAL — Doxycycline BEFORE Corticosteroids',
            text: 'Both Ehrlichia AND Rickettsia: start doxycycline 10 mg/kg PO/IV q24h IMMEDIATELY — do NOT wait for results. NEVER give corticosteroids before ruling out tick-borne disease — corticosteroids in Rickettsia can be FATAL. CBC mandatory (thrombocytopenia <50,000/μL). Ehrlichia IFAT + PCR; Rickettsia PCR (blood, first 5 days) + paired serology.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CBC — thrombocytopenia hallmark (<50,000/μL)',
        'Ehrlichia canis serology (IFAT) + PCR (blood)',
        'MRI lumbosacral spine with contrast',
        'CSF analysis (pleocytosis)',
        'Start doxycycline 10 mg/kg PO q24h × minimum 4 weeks'
    ]
}

];

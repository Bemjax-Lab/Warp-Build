// C6-T2 diagnoses — rewritten from DDX-main/src/regions/C6-T2.js in our style.
// Uses OUR parameter names directly (no normalise adapter).
// Diagnosis-only params (fever, vaccinated, cough, petechiae, ...) live in
// apps/Localisation/diagnoses/diagnosesParameters.json and are merged into the
// Parameters model at init — Parameters app renders them as extra categories.

app.diagnoses = app.diagnoses || {};
app.diagnoses['C6-T2'] = [

// ── Disease 1: Hansen Type I IVDD — Cervicothoracic ────────────────────
{ id: 'c6t2-ivdd1', name: 'Hansen Type I IVDD — Cervicothoracic (Acute)', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // C6-T2 signature: LMN front + UMN pelvic
        var lmnThoracic = (s.withdrawalThoracicR === 'decreased' || s.withdrawalThoracicR === 'absent' ||
                           s.withdrawalThoracicL === 'decreased' || s.withdrawalThoracicL === 'absent' ||
                           s.extensorToneThoracicR === 'decreased' || s.extensorToneThoracicL === 'decreased');
        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');
        var horner = (s.hornersSyndromeR === 'present' || s.hornersSyndromeL === 'present');
        var monoFront = (hasValue(s, 'gait', 'monoparesis RT') || hasValue(s, 'gait', 'monoparesis LT') ||
                         hasValue(s, 'gait', 'monoplegia RT')  || hasValue(s, 'gait', 'monoplegia LT') ||
                         hasValue(s, 'gait', 'lameness RT')    || hasValue(s, 'gait', 'lameness LT'));

        // [A] Signalment
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if (age >= 3 && age <= 8) A = 50;
        else if ((age >= 2 && age < 3) || (age > 8 && age <= 10)) A = 30;
        else A = 10;
        if (!isBreed(s, predispositions.chondro)) A = Math.round(A * 0.5);

        // [B] Temporal
        var B = 0;
        if      (oc === 'peracute') B = 25;
        else if (oc === 'acute')    B = 30;
        else if (oc === 'subacute') B = 20;
        else                        B = 0;
        if (s.progression === 'stable' || s.progression === 'improving') B += 15;
        else if (s.progression === 'worsening') B += 5;

        // [C] Pain — cervicothoracic pain common
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 5;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 35;
            else if (hasPainLevel(s, 'mild'))     C = 20;
        }

        // [D] Deficit — LMN front + UMN pelvic is the C6-T2 signature
        var D = 0;
        var tetrap = hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia');
        var hemi   = hasValue(s, 'gait', 'hemiparesis RT') || hasValue(s, 'gait', 'hemiparesis LT');
        if (tetrap || hemi) {
            D = 15;
            if (lmnThoracic)     D += 20; // LMN front confirms C6-T2
            if (patellarNormInc) D += 10; // UMN pelvic confirms C6-T2
            if (horner)          D +=  5; // Horner = C8-T2 sympathetic
        } else if (monoFront) {
            D = 30; // front limb monoparesis = specific for C6-T2 nerve root
            if (lmnThoracic) D += 10;
            if (horner)      D += 10;
        } else if (!s.gait || hasValue(s, 'gait', 'normal')) {
            D = 25; // pain-only presentation possible
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C6-T2') + 20;
        var mult = 1;
        if (oc === 'chronic' || (parseFloat(s.duration) || 0) > 14) {
            mult *= 0.05; flags.push('Chronic onset — essentially excludes Type I (×0.05)');
        }
        if (s.painProgression === 'disappeared within 24/48 h') {
            mult *= 0.3; flags.push('Pain resolved 24–48 h — FCEM/ANNPE more likely (×0.3)');
        }
        // Large/giant breed age penalty — fibroid metaplasia; Type I uncommon and occurs later
        if (breedKnown(s) && !isBreed(s, predispositions.chondro)) {
            if (age < 4) {
                mult *= 0.1; flags.push('Large/giant breed <4y — Hansen Type I very unlikely this young (×0.1)');
            } else if (age < 5) {
                mult *= 0.3; flags.push('Large/giant breed <5y — Hansen Type I uncommon under 5y (×0.3)');
            }
        }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI cervicothoracic spine (C6–T2)',
        'CT myelogram (alternative)',
        'CBC/biochemistry/urinalysis',
        'Deep pain assessment — critical prognostic factor'
    ]
},

// ── Disease 2: Hansen Type II IVDD — Cervicothoracic ───────────────────
{ id: 'c6t2-ivdd2', name: 'Hansen Type II IVDD — Cervicothoracic (Chronic)', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnThoracic = (s.withdrawalThoracicR === 'decreased' || s.withdrawalThoracicR === 'absent' ||
                           s.withdrawalThoracicL === 'decreased' || s.withdrawalThoracicL === 'absent' ||
                           s.extensorToneThoracicR === 'decreased' || s.extensorToneThoracicL === 'decreased');
        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');
        var horner = (s.hornersSyndromeR === 'present' || s.hornersSyndromeL === 'present');

        // [A] Signalment — older large breeds; also older chondrodystrophics
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age >= 7) A = 50;
        else if (age >= 5) A = 30;
        else if (age >= 3) A = 15;
        else               A = 0;
        if (isBreed(s, predispositions.large))                    A = Math.min(50, A + 10);
        if (isBreed(s, predispositions.chondro) && age >= 7)      A = Math.min(50, A + 5);

        // [B] Temporal — chronic/subacute hallmark
        var B = 0;
        if      (oc === 'chronic')  B = 50;
        else if (oc === 'subacute') B = 35;
        else if (oc === 'acute')    B = 10;
        else                        B = 0;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — often mild; gradual onset
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 15;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 35;
            else if (hasPainLevel(s, 'moderate')) C = 30;
            else if (hasPainLevel(s, 'mild'))     C = 25;
        }

        // [D] Deficit — LMN front + UMN pelvic confirms C6-T2
        var D = 0;
        var tetrap = hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia');
        var hemi   = hasValue(s, 'gait', 'hemiparesis RT') || hasValue(s, 'gait', 'hemiparesis LT');
        if (tetrap || hemi) {
            D = 15;
            if (lmnThoracic)     D += 20;
            if (patellarNormInc) D += 10;
            if (horner)          D +=  5;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C6-T2') + 15;
        var mult = 1;
        if (oc === 'peracute')   { mult *= 0.1; flags.push('Peracute onset — essentially excludes Type II (×0.1)'); }
        if (s.onset === 'acute') { mult *= 0.2; flags.push('Acute onset — Type II IVDD is a chronic degenerative process (×0.2)'); }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI cervicothoracic spine (disc bulging, cord T2 signal, foraminal stenosis)',
        'CT (bony detail, foraminal stenosis)',
        'CBC/biochemistry'
    ]
},

// ── Disease 3: FCEM/ANNPE/IIVDE — Cervicothoracic ──────────────────────
{ id: 'c6t2-fcem', name: 'Peracute Non-Compressive Myelopathy (FCEM/ANNPE/IIVDE) — Cervicothoracic', category: 'Vascular/Traumatic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnThoracic = (s.withdrawalThoracicR === 'decreased' || s.withdrawalThoracicR === 'absent' ||
                           s.withdrawalThoracicL === 'decreased' || s.withdrawalThoracicL === 'absent' ||
                           s.extensorToneThoracicR === 'decreased' || s.extensorToneThoracicL === 'decreased');
        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');
        var asym = !!(s.asymmetry);

        // [A] Signalment — any adult; large breeds predisposed
        var age = parseFloat(s.age) || 0;
        var A = age >= 1 ? 40 : 20;
        if (isBreed(s, predispositions.fcem)) A = Math.min(50, A + 10);

        // [B] Temporal — peracute during activity is hallmark
        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 20;
        else                        B = 0;
        if (s.progression === 'stable' || s.progression === 'improving') B = Math.min(50, B + 10);

        // [C] Pain — classically absent or transient
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 40;
        else {
            if      (s.painProgression === 'disappeared within 24/48 h') C = 50;
            else if (hasPainLevel(s, 'mild'))     C = 30;
            else if (hasPainLevel(s, 'moderate')) C = 5;
            else                                  C = 0;
        }

        // [D] Deficit — asymmetric LMN front + UMN pelvic is the C6-T2 FCEM signature
        var D = 0;
        var tetrap = hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia');
        var hemi   = hasValue(s, 'gait', 'hemiparesis RT') || hasValue(s, 'gait', 'hemiparesis LT');
        if (tetrap || hemi) {
            D = 15;
            if (asym)            D += 20; // asymmetry hallmark of FCEM/ANNPE
            if (lmnThoracic)     D += 10;
            if (patellarNormInc) D +=  5;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C6-T2') + 15;
        var mult = 1;
        if (oc === 'chronic') { mult *= 0.05; flags.push('Chronic onset excludes FCEM/ANNPE/IIVDE (×0.05)'); }
        if (s.progression === 'worsening' && (parseFloat(s.duration) || 0) > 2) {
            mult *= 0.2; flags.push('Progressive after 48 h — not consistent with FCEM/ANNPE (×0.2)');
        }
        if (oc === 'peracute') {
            mult *= 1.5; flags.push('Peracute onset during activity — strong FCEM/ANNPE pattern (×1.5)');
        }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI cervicothoracic spine (FCEM: normal discs + T2 cord lesion; ANNPE: disc narrowing + short T2)',
        'MRI differentiates FCEM from ANNPE/IIVDE — cannot be distinguished clinically',
        'CBC/biochemistry'
    ]
},

// ── Disease 4: Brachial Plexus / Peripheral Nerve Sheath Tumor ─────────
{ id: 'c6t2-mnst', name: 'Brachial Plexus / Peripheral Nerve Sheath Tumor (PNST/MNST)', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnThoracic = (s.withdrawalThoracicR === 'decreased' || s.withdrawalThoracicR === 'absent' ||
                           s.withdrawalThoracicL === 'decreased' || s.withdrawalThoracicL === 'absent' ||
                           s.extensorToneThoracicR === 'decreased' || s.extensorToneThoracicL === 'decreased');
        var horner = (s.hornersSyndromeR === 'present' || s.hornersSyndromeL === 'present');
        var monoFront = (hasValue(s, 'gait', 'monoparesis RT') || hasValue(s, 'gait', 'monoparesis LT') ||
                         hasValue(s, 'gait', 'monoplegia RT')  || hasValue(s, 'gait', 'monoplegia LT') ||
                         hasValue(s, 'gait', 'lameness RT')    || hasValue(s, 'gait', 'lameness LT'));

        // [A] Signalment — middle-aged to older; any breed; large breeds predisposed
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age >= 7) A = 50;
        else if (age >= 5) A = 35;
        else if (age >= 3) A = 20;
        else               A = 5;
        if (isBreed(s, predispositions.large)) A = Math.min(50, A + 5);

        // [B] Temporal — very slow progression over months; often delayed diagnosis
        var B = 0;
        if      (oc === 'chronic')  B = 50;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 10;
        else                        B = 0;
        if (s.progression === 'worsening') B = Math.min(50, B + 15);

        // [C] Pain — cervical + front limb pain; "root signature" (non-weight-bearing)
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 20;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 40;
            else if (hasPainLevel(s, 'mild'))     C = 25;
        }

        // [D] Deficit — front limb monoparesis is near-pathognomonic for brachial plexus lesion
        var D = 0;
        if (monoFront) {
            D = 40;
            if (lmnThoracic) D += 5;
            if (horner)      D += 5; // T1-T3 sympathetic chain involvement
        } else if (hasValue(s, 'gait', 'hemiparesis RT') || hasValue(s, 'gait', 'hemiparesis LT')) {
            D = 25;
            if (lmnThoracic) D += 15;
            if (horner)      D += 10;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C6-T2') + 10;
        var mult = 1;
        if (oc === 'peracute') { mult *= 0.2; flags.push('Peracute onset atypical for PNST/MNST (×0.2)'); }
        if (monoFront && oc === 'chronic') {
            mult *= 1.5; flags.push('Chronic front limb monoparesis in older dog — PNST/MNST strongly suspected (×1.5)');
        }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI cervicothoracic spine + brachial plexus (foraminal "dumbbell" extension; T1+contrast enhancing mass)',
        'CT thorax (lung metastases, sternal lymph nodes)',
        'EMG/nerve conduction (denervation maps affected nerve root — guides resection)',
        'Biopsy/histopathology (definitive; benign PNST vs MNST cannot be distinguished on imaging)'
    ]
},

// ── Disease 5: Discospondylitis — Cervicothoracic ──────────────────────
{ id: 'c6t2-disco', name: 'Discospondylitis — Cervicothoracic', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnThoracic = (s.withdrawalThoracicR === 'decreased' || s.withdrawalThoracicR === 'absent' ||
                           s.withdrawalThoracicL === 'decreased' || s.withdrawalThoracicL === 'absent' ||
                           s.extensorToneThoracicR === 'decreased' || s.extensorToneThoracicL === 'decreased');
        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');

        // [A] Signalment — middle-aged large breeds; intact/recently bred
        var age = parseFloat(s.age) || 0;
        var A = 30;
        if (age >= 4 && age <= 10) A = 40;
        if (isBreed(s, predispositions.large)) A = Math.min(50, A + 10);

        // [B] Temporal — subacute/chronic progressive
        var B = 0;
        if      (oc === 'subacute') B = 35;
        else if (oc === 'chronic')  B = 25;
        else if (oc === 'acute')    B = 15;
        else                        B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 20);
        else                               B = Math.min(50, B + 5);

        // [C] Pain — focal cervicothoracic pain, often severe
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 0;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 40;
            else if (hasPainLevel(s, 'mild'))     C = 25;
        }

        // [D] Deficit — pain-dominant early; LMN front + UMN pelvic as disease progresses
        var D = 0;
        var tetrap = hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia');
        if (tetrap) {
            D = 20;
            if (lmnThoracic)     D += 15;
            if (patellarNormInc) D += 10;
        } else if (!s.gait || hasValue(s, 'gait', 'normal')) {
            D = 40; // pain-only very common early presentation
        } else {
            D = 20;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C6-T2') + systemicScore(s) + 10;
        var mult = 1;
        if (pl === 'none') { mult *= 0.05; flags.push('Painless — near-excludes discospondylitis (×0.05)'); }

        alerts.push({
            type: 'WARNING',
            title: 'Brucella canis — Mandatory Screening (Zoonotic)',
            text: 'Brucella canis MUST be ruled out before starting treatment if patient is intact or recently bred. Zoonotic risk. ELISA/AGID/PCR serology required.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Radiographs (endplate lysis, disc space narrowing — first test)',
        'MRI cervicothoracic spine (early lesions, epidural empyema)',
        'CBC/biochemistry (leukocytosis, elevated CRP)',
        'Blood cultures (3 sets)',
        'Brucella canis serology — MANDATORY before treatment (zoonotic)',
        'Urine culture'
    ]
},

// ── Disease 6: CSM Disc-Associated (Wobbler) — Doberman/Large Breed ────
{ id: 'c6t2-csm-disc', name: 'CSM Disc-Associated (Wobbler) — Doberman/Large Breed Type', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnThoracic = (s.withdrawalThoracicR === 'decreased' || s.withdrawalThoracicR === 'absent' ||
                           s.withdrawalThoracicL === 'decreased' || s.withdrawalThoracicL === 'absent' ||
                           s.extensorToneThoracicR === 'decreased' || s.extensorToneThoracicL === 'decreased');
        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');

        // [A] Signalment — middle-aged+ Doberman; C5-C6/C6-C7 are the classic CSM discs
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age >= 6) A = 50;
        else if (age >= 4) A = 35;
        else if (age >= 2) A = 15;
        else               A = 5;
        if (isBreed(s, predispositions.csmDisc))     A = Math.min(50, A + 20);
        else if (!isBreed(s, predispositions.large)) A = Math.round(A * 0.5);

        // [B] Temporal — chronic/subacute progressive is hallmark
        var B = 0;
        if      (oc === 'chronic')  B = 50;
        else if (oc === 'subacute') B = 35;
        else if (oc === 'acute')    B = 10;
        else                        B = 0;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — often mild or absent (dynamic disc compression)
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 35; // commonly painless
        else {
            if      (hasPainLevel(s, 'severe'))   C = 15;
            else if (hasPainLevel(s, 'moderate')) C = 25;
            else if (hasPainLevel(s, 'mild'))     C = 40;
        }

        // [D] Deficit — "disconnected" gait: LMN front (choppy) + UMN pelvic (swaying) at C6-T2
        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) {
            D = 20;
            if (lmnThoracic)     D += 20; // LMN front confirms C6-T2 level
            if (patellarNormInc) D += 10; // UMN pelvic
        } else if (hasValue(s, 'gait', 'ataxia')) {
            D = 35; // pelvic > thoracic ataxia = Wobbler hallmark
            if (patellarNormInc) D += 10;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C6-T2') + 15;
        var mult = 1;
        if (oc === 'peracute' && (s.progression === 'stable' || s.progression === 'improving')) {
            mult *= 0.3; flags.push('Peracute non-progressive onset — FCEM/ANNPE more likely (×0.3)');
        }
        if (age < 2) { mult *= 0.2; flags.push('Age <2y — disc-associated CSM uncommon this young (×0.2)'); }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI cervicothoracic spine (dynamic: flexion/extension — disc protrusion at C5-C6/C6-C7, cord T2 hyperintensity)',
        'CT myelogram (dynamic views — disc protrusion pattern)',
        'Survey whole cervical spine (multifocal CSM common in Dobermans)',
        'Neurological grading (Olby/Frankel scale)'
    ]
},

// ── Disease 7: CSM Osseous-Associated (Wobbler) — Giant Breed ──────────
{ id: 'c6t2-csm-oss', name: 'CSM Osseous-Associated (Wobbler) — Great Dane/Giant Breed Type', category: 'Anomalous/Congenital',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnThoracic = (s.withdrawalThoracicR === 'decreased' || s.withdrawalThoracicR === 'absent' ||
                           s.withdrawalThoracicL === 'decreased' || s.withdrawalThoracicL === 'absent' ||
                           s.extensorToneThoracicR === 'decreased' || s.extensorToneThoracicL === 'decreased');
        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');

        // [A] Signalment — young giant breeds; Great Dane typically 1–4 years
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age >= 1 && age <= 4) A = 50;
        else if (age < 1)              A = 30;
        else if (age > 4 && age <= 7)  A = 25;
        else                           A = 10;
        if (isBreed(s, predispositions.csmOss))      A = Math.min(50, A + 20);
        else if (!isBreed(s, predispositions.large)) A = Math.round(A * 0.3);

        // [B] Temporal — chronic progressive; no acute episodes
        var B = 0;
        if      (oc === 'chronic')  B = 50;
        else if (oc === 'subacute') B = 35;
        else if (oc === 'acute')    B = 10;
        else                        B = 0;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — often absent/mild (bony, relatively static compression)
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 40; // commonly painless
        else {
            if      (hasPainLevel(s, 'severe'))   C = 10;
            else if (hasPainLevel(s, 'moderate')) C = 20;
            else if (hasPainLevel(s, 'mild'))     C = 35;
        }

        // [D] Deficit — LMN front + UMN pelvic "wobbling" gait at C6-T2
        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) {
            D = 20;
            if (lmnThoracic)     D += 20;
            if (patellarNormInc) D += 10;
        } else if (hasValue(s, 'gait', 'ataxia')) {
            D = 35;
            if (patellarNormInc) D += 10;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C6-T2') + 10;
        var mult = 1;
        if (oc === 'peracute') { mult *= 0.2; flags.push('Peracute onset unusual for osseous CSM (×0.2)'); }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI cervicothoracic spine (bony malformation, articular process hypertrophy at C4-C5/C5-C6/C6-C7)',
        'CT (superior for bony detail — vertebral malformation characterization)',
        'Dynamic MRI/CT myelogram (extension worsens cord compression)',
        'Survey whole cervical spine (multifocal lesions common)'
    ]
},

// ── Disease 8: SRMA — Cervicothoracic ──────────────────────────────────
{ id: 'c6t2-srma', name: 'Steroid-Responsive Meningitis-Arteritis (SRMA)', category: 'Inflammatory/Immune',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A] Signalment — young dogs <2y most common; medium/large breeds predisposed
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age < 2)              A = 50;
        else if (age >= 2 && age <= 4) A = 30;
        else                           A = 10;
        if (isBreed(s, predispositions.srma)) A = Math.min(50, A + 15);

        // [B] Temporal — acute/subacute; episodic relapses characteristic
        var B = 0;
        if      (oc === 'acute')    B = 50;
        else if (oc === 'subacute') B = 35;
        else if (oc === 'peracute') B = 20;
        else                        B = 0; // chronic makes SRMA unlikely
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — cervical pain is the HALLMARK (maps to 'cervical' = at-site for C6-T2)
        var C = 0;
        if      (pl === 'elsewhere') C = 10;
        else if (pl === 'none')      C = 5; // no pain → strong negative
        else { // at-site (cervical)
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 40;
            else if (hasPainLevel(s, 'mild'))     C = 25;
        }
        if (s.fever === 'yes') C = Math.min(50, C + 20);

        // [D] Deficit — classic SRMA: pain ONLY, no neurological deficits
        var D = 0;
        if (!s.gait || hasValue(s, 'gait', 'normal')) {
            D = 50; // pain without deficits = classic SRMA
        } else if (hasValue(s, 'gait', 'ataxia')) {
            D = 25;
        } else {
            D = 5; // tetraparesis is unusual for SRMA
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C6-T2') + systemicScore(s) + 15;
        var mult = 1;
        if (age > 4)       { mult *= 0.25; flags.push('Age >4y — SRMA is a disease of young dogs; rare above 4y (×0.25)'); }
        if (!s.fever)      { mult *= 0.5;  flags.push('No fever — fever is strongly expected in SRMA (×0.5)'); }
        if (pl === 'none') { mult *= 0.2;  flags.push('No cervical pain — pain is the hallmark of SRMA (×0.2)'); }
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) {
            mult *= 0.3; flags.push('Tetraparesis/plegia — unusual for SRMA; consider structural disease (×0.3)');
        }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CSF analysis — ESSENTIAL: neutrophilic pleocytosis (>50 cells/μL, >80% neutrophils in acute phase)',
        'CBC (neutrophilia, elevated CRP/acute-phase proteins)',
        'CRP (strongly elevated — >20 mg/L typical; useful for monitoring)',
        'MRI cervicothoracic spine with contrast (meningeal enhancement; normal parenchyma)',
        'Infectious disease panel (rule out bacterial/protozoal meningitis before immunosuppression)',
        'Brucella canis serology (mandatory — exclude before CSF tap if intact)',
        'Start prednisolone 2 mg/kg/day after CSF — taper over 6+ months; high relapse rate if tapered too quickly'
    ]
},

// ── Disease 9: Meningomyelitis / Myelitis — Cervicothoracic ────────────
{ id: 'c6t2-meningo', name: 'Meningomyelitis / Myelitis — Cervicothoracic', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnThoracic = (s.withdrawalThoracicR === 'decreased' || s.withdrawalThoracicR === 'absent' ||
                           s.withdrawalThoracicL === 'decreased' || s.withdrawalThoracicL === 'absent' ||
                           s.extensorToneThoracicR === 'decreased' || s.extensorToneThoracicL === 'decreased');
        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');

        // [A] Signalment — no strong breed predisposition; any age
        var age = parseFloat(s.age) || 0;
        var A = 25;
        if      (age >= 1 && age <= 8) A = 30;
        else if (age < 1)              A = 15;

        // [B] Temporal — subacute progression (days to weeks) is hallmark
        var B = 0;
        if      (oc === 'subacute') B = 50;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'chronic')  B = 20;
        else                        B = 10;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — variable; mild-moderate cervicothoracic pain common
        var C = 0;
        if      (pl === 'elsewhere') C = 15;
        else if (pl === 'none')      C = 20;
        else {
            if      (hasPainLevel(s, 'mild'))     C = 40;
            else if (hasPainLevel(s, 'moderate')) C = 35;
            else if (hasPainLevel(s, 'severe'))   C = 20;
            else                                  C = 30;
        }
        if (s.fever === 'yes') C = Math.min(50, C + 15);

        // [D] Deficit — asymmetric tetraparesis; C6-T2 signature: LMN thoracic + UMN pelvic
        var D = 0;
        var hemi = hasValue(s, 'gait', 'hemiparesis RT') || hasValue(s, 'gait', 'hemiparesis LT');
        if (hemi) {
            D = 40;
            if (s.asymmetry) D += 10;
        } else if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) {
            D = 25;
            if (lmnThoracic)     D += 10; // LMN front limbs confirms C6-T2 level
            if (patellarNormInc) D +=  5; // UMN pelvic confirms C6-T2 level
            if (s.asymmetry)     D += 10;
        } else if (hasValue(s, 'gait', 'ataxia')) {
            D = 20;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C6-T2') + systemicScore(s) + 10;
        var mult = 1;
        if (oc === 'peracute') { mult *= 0.3; flags.push('Peracute onset — less typical for meningomyelitis (×0.3)'); }
        if ((!s.gait || hasValue(s, 'gait', 'normal')) && s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.55; flags.push('No gait deficit + no systemic signs — meningomyelitis unlikely as sole pain presentation (×0.55)');
        }
        if (oc === 'chronic' && s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.6; flags.push('Chronic onset + no systemic signs — inflammatory myelitis less likely; consider structural/degenerative (×0.6)');
        }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI cervicothoracic spine with contrast (intramedullary T2 hyperintensity, leptomeningeal enhancement)',
        'CSF analysis — ESSENTIAL: inflammatory cells (neutrophilic, eosinophilic, or lymphocytic pleocytosis)',
        'CSF culture + sensitivity (bacterial meningomyelitis)',
        'Infectious disease panel: Toxoplasma, Neospora, Cryptococcus, Distemper, tick-borne diseases',
        'CBC/biochemistry (leukocytosis, elevated CRP in bacterial/protozoal cases)'
    ]
},

// ── Disease 10: Tick-Borne Meningomyelitis — Cervicothoracic ───────────
{ id: 'c6t2-tickborne', name: 'Tick-Borne Meningomyelitis (Ehrlichia canis / Rickettsia rickettsii) — Cervicothoracic', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A] — any age, any breed; tick exposure key
        var A = 25;

        // [B] — peracute/acute (Rickettsia hallmark); acute to subacute (Ehrlichia)
        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 45;
        else if (oc === 'subacute')                   B = 30;
        else if (oc === 'chronic')                    B = 8;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — cervicothoracic/meningeal; Rickettsia mimics SRMA
        var C = 0;
        if      (pl === 'at-site') C = 45;
        else if (pl === 'none')    C = 10;
        else                       C = 15;

        // [D] Deficit — LMN forelimb + UMN pelvic at C6-T2
        var D = 0;
        var lmnThoracic = (s.withdrawalThoracicR === 'decreased' || s.withdrawalThoracicR === 'absent' ||
                           s.withdrawalThoracicL === 'decreased' || s.withdrawalThoracicL === 'absent' ||
                           s.extensorToneThoracicR === 'decreased' || s.extensorToneThoracicL === 'decreased');
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) {
            D = 30;
            if (lmnThoracic) { D += 10; flags.push('LMN thoracic limb signs at C6-T2 — consistent with tick-borne myelitis at this level'); }
        } else if (hasValue(s, 'gait', 'ataxia'))              D = 25;
        else if (!s.gait || hasValue(s, 'gait', 'normal'))     D = 20;

        // Systemic signs — fever MANDATORY for both agents
        var sysBonus = 0;
        if (s.fever === 'yes')     { sysBonus += 30; flags.push('Fever — MAJOR sign for both Ehrlichia and Rickettsia; tick-borne meningomyelitis elevated'); }
        if (s.petechiae === 'yes') { sysBonus += 20; flags.push('Petechiae/ecchymoses — vasculitis; strongly suggests Rickettsia rickettsii over Ehrlichia'); }
        if (s.limbEdema === 'yes') { sysBonus += 15; flags.push('Limb oedema — Rickettsia vasculitis pattern (more likely than Ehrlichia)'); }
        if (s.weightLoss === 'yes') sysBonus += 10;
        if (s.anorexia === 'yes')   sysBonus += 10;
        if (s.lethargy === 'yes')   sysBonus += 10;
        // Differentiating hints
        if (oc === 'peracute' && s.petechiae === 'yes') {
            flags.push('Peracute + petechiae — Rickettsia rickettsii pattern; treat as RMSF until proven otherwise');
        } else if (oc === 'subacute' && s.petechiae !== 'yes') {
            flags.push('Subacute without petechiae — Ehrlichia canis more likely than Rickettsia');
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C6-T2') + sysBonus + 10;
        var mult = 1;
        if (s.fever !== 'yes') { mult *= 0.2; flags.push('No fever — both Ehrlichia and Rickettsia are always febrile; afebrile presentation near-excludes tick-borne disease (×0.2)'); }
        if (s.fever === 'yes' && (oc === 'peracute' || oc === 'acute')) {
            mult *= 1.4; flags.push('Fever + acute/peracute onset — tick-borne meningomyelitis pattern (×1.4)');
        }
        if (s.petechiae === 'yes') { mult *= 1.2; flags.push('Petechiae — Rickettsia vasculitis pattern (×1.2)'); }

        alerts.push({
            type: 'CRITICAL',
            title: '⚠️ SAFETY CRITICAL — Doxycycline BEFORE Corticosteroids',
            text: 'Both Ehrlichia AND Rickettsia: start doxycycline 10 mg/kg PO/IV q24h IMMEDIATELY — do NOT wait for results. NEVER give corticosteroids before ruling out tick-borne disease — corticosteroids in Rickettsia can be FATAL. CBC mandatory (thrombocytopenia <50,000/μL). Rickettsia mimics SRMA — always check platelet count before steroids. Ehrlichia IFAT + PCR; Rickettsia PCR (blood, first 5 days) + paired serology.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        '⚠️ Start doxycycline 10 mg/kg PO q24h immediately — do NOT wait for results',
        'CBC — thrombocytopenia (<50,000/μL) hallmark of both; anaemia, leukopenia possible',
        'Ehrlichia canis IFAT (≥1:80) + PCR (blood)',
        'Rickettsia rickettsii PCR (blood — highest sensitivity in first 5 days) + IgG/IgM serology (paired titres)',
        'Coagulation panel (DIC risk — Rickettsia)',
        'MRI cervicothoracic spine with contrast (meningeal enhancement)',
        'CSF analysis (neutrophilic or mixed pleocytosis, elevated protein)',
        'Tick exposure history — Amblyomma cajennense = Rickettsia; Rhipicephalus sanguineus = Ehrlichia',
        'DO NOT administer corticosteroids — can be fatal in Rickettsia rickettsii'
    ]
},

// ── Disease 12: GME — Cervicothoracic ──────────────────────────────────
{ id: 'c6t2-gme', name: 'GME — Cervicothoracic (Granulomatous Meningoencephalomyelitis)', category: 'Inflammatory',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — small/toy breeds, young adults
        var A = 0;
        var gmeBreeds = ['Maltese', 'Yorkshire Terrier', 'Toy Poodle', 'Miniature Poodle', 'Poodle',
            'Chihuahua', 'Dachshund', 'Pug', 'West Highland White Terrier', 'Boston Terrier'];
        if (isBreed(s, gmeBreeds))                { A += 20; flags.push('GME-predisposed breed'); }
        else if (isBreed(s, predispositions.toy))   A += 15;
        if      (age >= 2 && age <= 6) A += 25;
        else if (age > 6 && age <= 9)  A += 15;
        else                           A += 5;

        // [B] Temporal — subacute to chronic typical
        var B = 0;
        if      (oc === 'subacute') B = 45;
        else if (oc === 'chronic')  B = 35;
        else if (oc === 'acute')    B = 25;
        else /* peracute */         B = 10;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — cervicothoracic meningeal pain
        var C = 0;
        if      (pl === 'at-site') C = 40;
        else if (pl === 'none')    C = 20;
        else                       C = 15;

        // [D] Deficit — LMN forelimb (reduced/absent reflexes) + UMN pelvic limb
        var D = 0;
        var tetrap = hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia');
        var lmnFL = (s.withdrawalThoracicR === 'decreased' || s.withdrawalThoracicR === 'absent' ||
                     s.withdrawalThoracicL === 'decreased' || s.withdrawalThoracicL === 'absent' ||
                     s.extensorToneThoracicR === 'decreased' || s.extensorToneThoracicL === 'decreased');
        if (tetrap)                                        D = 35;
        else if (hasValue(s, 'gait', 'ataxia'))            D = 30;
        else if (!s.gait || hasValue(s, 'gait', 'normal')) D = 20;
        if (lmnFL) { D += 10; flags.push('LMN signs forelimb — C6-T2 localisation confirmed'); }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C6-T2') + systemicScore(s) + 10;
        var mult = 1;
        if (s.fever === 'yes' && pl === 'at-site') { mult *= 1.3; flags.push('Fever + cervicothoracic pain — meningomyelitis pattern (×1.3)'); }
        if (age > 10)                               { mult *= 0.5; flags.push('Age >10y — tumour more likely than GME (×0.5)'); }
        if (breedKnown(s) && !isBreed(s, gmeBreeds) && !isBreed(s, predispositions.toy)) {
            mult *= 0.5; flags.push('Not a GME-predisposed breed — consider infectious myelitis (×0.5)');
        }
        if ((!s.gait || hasValue(s, 'gait', 'normal')) && s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.55; flags.push('No gait deficit + no systemic signs — GME unlikely as sole pain presentation (×0.55)');
        }
        if (oc === 'chronic' && s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.6; flags.push('Chronic onset + no systemic signs — inflammatory myelitis less likely; consider structural/degenerative (×0.6)');
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI cervicothoracic spine + brain with contrast (multifocal enhancing lesions)',
        'CSF analysis (mononuclear pleocytosis, elevated protein)',
        'Infectious panel: Toxoplasma, Neospora, Cryptococcus, CDV, Ehrlichia, Rickettsia',
        'CSF PCR panel (Toxoplasma, Neospora, CDV)',
        'Definitive Dx: histopathology (biopsy or post-mortem)',
        'Treatment: prednisolone ± cytarabine — referral recommended'
    ]
},

// ── Disease 13: Spinal Arachnoid Diverticulum — Cervicothoracic ────────
{ id: 'c6t2-sad', name: 'Spinal Arachnoid Diverticulum — Cervicothoracic', category: 'Anomalous/Congenital',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — large breeds; Rottweiler predisposed; C6-T2 common site; any breed possible
        var A = 10; // base — SAD occurs in any breed
        if (s.breed === 'Rottweiler')                            { A += 30; flags.push('Rottweiler — highest predisposition for spinal arachnoid diverticulum'); }
        else if (isBreed(s, predispositions.large))                A += 20;
        else if (isBreed(s, ['French Bulldog', 'Bulldog', 'Pug'])) { A += 10; flags.push('Brachycephalic — arachnoid diverticulum reported'); }
        else { flags.push('Not a typical predisposed breed — SAD less common but reported in any breed'); }
        if      (age >= 1 && age <= 5) A += 25;
        else if (age > 5 && age <= 9)  A += 15;
        else if (age >= 10)            A += 5;
        else /* <1y */                 A += 10;

        // [B] Temporal — chronic, slowly progressive
        var B = 0;
        if      (oc === 'chronic')  B = 45;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15;
        else /* peracute */         B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 5);

        // [C] Pain — often absent; painless chronic progression is characteristic
        var C = 0;
        if      (pl === 'none')    C = 35;
        else if (pl === 'at-site') C = 20;
        else                       C = 15;

        // [D] Deficit — LMN forelimb weakness, UMN pelvic limb
        var D = 0;
        var tetrap = hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia');
        if (tetrap)                                        D = 35;
        else if (hasValue(s, 'gait', 'ataxia'))            D = 30;
        else if (!s.gait || hasValue(s, 'gait', 'normal')) D = 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C6-T2') + 10;
        var mult = 1;
        if (breedKnown(s) && !isBreed(s, predispositions.large) && s.breed !== 'Rottweiler') {
            mult *= 0.5; flags.push('Not a large breed or Rottweiler — arachnoid diverticulum less common but possible (×0.5)');
        }
        if (oc === 'peracute')   { mult *= 0.3; flags.push('Peracute onset — not typical for arachnoid diverticulum (×0.3)'); }
        if (s.onset === 'acute') { mult *= 0.3; flags.push('Acute onset — SAD is a chronic developmental condition; acute isolated pain is atypical (×0.3)'); }
        if (s.fever === 'yes')   { mult *= 0.2; flags.push('Fever — arachnoid diverticulum is not inflammatory (×0.2)'); }

        alerts.push({
            type: 'INFO',
            title: 'Spinal Arachnoid Diverticulum — MRI + CT Myelography Diagnosis',
            text: 'Cannot be diagnosed without imaging. MRI (T2: CSF-intensity extradural or intradural-extramedullary cyst compressing cord) ± CT myelography. Surgical treatment (fenestration, cyst marsupialisation or omentalization) is curative in most cases. Prognosis good with early surgical decompression.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI cervicothoracic spine (T2: CSF-intensity cyst; cord compression; syrinx may be present)',
        'CT myelography (delineates communication with subarachnoid space)',
        'CSF analysis (usually normal; rule out inflammatory cause)',
        'Surgical referral — fenestration or marsupialisation; good prognosis',
        'Breed history (Rottweiler, large breeds — confirm predisposition)'
    ]
},

// ── Disease 14: Vertebral Tumor / Lymphoma — Cervicothoracic ───────────
{ id: 'c6t2-vtumor', name: 'Vertebral Tumor / Spinal Lymphoma — Cervicothoracic', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — middle-aged to older; any breed; lymphoma can be younger
        var A = 0;
        if      (age >= 8) A = 35;
        else if (age >= 5) A = 25;
        else if (age >= 3) A = 15;
        else               { A = 5; flags.push('Age <3y — vertebral tumour uncommon; consider lymphoma in young dogs'); }
        if (isBreed(s, predispositions.large)) A += 10;

        // [B] Temporal — subacute to chronic progression typical
        var B = 0;
        if      (oc === 'chronic')  B = 40;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15;
        else /* peracute */         B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — vertebral tumours are often severely painful (bone destruction)
        var C = 0;
        if      (pl === 'at-site' && hasPainLevel(s, 'severe'))   { C = 45; flags.push('Severe localised pain — bone destruction by tumour or lymphoma'); }
        else if (pl === 'at-site' && hasPainLevel(s, 'moderate'))   C = 35;
        else if (pl === 'at-site')                                  C = 25;
        else if (pl === 'none')                                     C = 10;
        else                                                        C = 15;

        // [D] Deficit — compression of cord; LMN forelimb + UMN pelvic limb
        var D = 0;
        var tetrap = hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia');
        if (tetrap)                                        D = 35;
        else if (hasValue(s, 'gait', 'ataxia'))            D = 30;
        else if (!s.gait || hasValue(s, 'gait', 'normal')) D = 15;

        // Systemic signs suggesting lymphoma or metastatic disease
        var sysBonus = 0;
        if (s.weightLoss === 'yes')      { sysBonus += 15; flags.push('Weight loss — systemic neoplasia (lymphoma, metastatic disease)'); }
        if (s.lymphadenopathy === 'yes') { sysBonus += 20; flags.push('Lymphadenopathy — spinal lymphoma (STRONG sign)'); }
        if (s.anorexia === 'yes')          sysBonus += 5;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C6-T2') + sysBonus + 10;
        var mult = 1;
        if (oc === 'peracute')            { mult *= 0.3; flags.push('Peracute onset — tumour unlikely unless pathological fracture (×0.3)'); }
        if (age < 3 && !s.lymphadenopathy) { mult *= 0.3; flags.push('Age <3y without lymphadenopathy — vertebral tumour uncommon (×0.3)'); }
        if (s.lymphadenopathy === 'yes' && age < 8) {
            mult *= 1.4; flags.push('Lymphadenopathy in younger dog — spinal lymphoma pattern (×1.4)');
        }
        if (pl === 'at-site' && s.progression === 'worsening') {
            mult *= 1.2; flags.push('Progressive pain + worsening deficits — bone tumour with cord compression (×1.2)');
        }

        alerts.push({
            type: 'INFO',
            title: 'Vertebral Tumour — Staging Required Before Treatment',
            text: 'Primary vertebral tumours (osteosarcoma, multilobular tumour of bone) and spinal lymphoma have completely different treatment protocols. Staging: thoracic radiographs + abdominal ultrasound (metastasis), CBC/biochemistry, lymph node fine needle aspirate (lymphoma?). CT-guided bone biopsy for histopathology before surgery. Lymphoma: CHOP-based chemotherapy. Primary bone tumour: surgical resection ± radiation; palliative if metastatic.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI cervicothoracic spine with contrast (extradural mass; bone destruction; cord compression)',
        'CT spine (bone detail — osteolysis, periosteal reaction; better than MRI for bone)',
        'Thoracic radiographs (pulmonary metastasis — 3 views)',
        'Abdominal ultrasound (metastasis; lymphoma staging)',
        'CBC/biochemistry (anaemia, hypercalcaemia — PTHrP in lymphoma)',
        'Peripheral lymph node FNA (cytology — lymphoma diagnosis often possible from node alone)',
        'CT-guided bone biopsy (histopathology — definitive)',
        'Bone marrow aspirate (lymphoma staging)',
        'Treatment: lymphoma → CHOP chemotherapy; primary bone tumour → surgical excision ± radiation'
    ]
}

];

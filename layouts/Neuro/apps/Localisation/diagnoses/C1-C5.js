// C1-C5 diagnoses — rewritten from DDX-main/src/regions/C1-C5.js in our style.
// Uses OUR parameter names directly (no normalise adapter).
// Diagnosis-only params (fever, vaccinated, cough, petechiae, ...) live in
// apps/Localisation/diagnoses/diagnosesParameters.json and are merged into the
// Parameters model at init — Parameters app renders them as extra categories.

app.diagnoses = app.diagnoses || {};
app.diagnoses['C1-C5'] = [

// ── Disease 1: Hansen Type I IVDD — Cervical ───────────────────────────
{ id: 'c1c5-ivdd1', name: 'Hansen Type I IVDD — Cervical (Acute)', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // UMN confirmation: normal/increased patellar reflex = C1-C5 location
        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');
        var tetrap = hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia');
        var hemi   = hasValue(s, 'gait', 'hemiparesis RT') || hasValue(s, 'gait', 'hemiparesis LT');

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

        // [C] Pain — cervical IVDD almost always painful
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 5;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 35;
            else if (hasPainLevel(s, 'mild'))     C = 20;
        }

        // [D] Deficit — UMN all 4 limbs; pain-only presentation also common
        var D = 0;
        if (tetrap || hemi) {
            D = 25;
            if (patellarNormInc) D += 15;
            if (s.asymmetry)     D +=  5;
        } else if (hasValue(s, 'gait', 'ataxia')) {
            D = 20;
            if (patellarNormInc) D += 10;
        } else if (!s.gait || hasValue(s, 'gait', 'normal')) {
            D = 35; // pain-only = classic cervical IVDD
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + 20;
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
                mult *= 0.1; flags.push('Large/giant breed <4y — cervical Hansen Type I very unlikely this young (×0.1)');
            } else if (age < 5) {
                mult *= 0.3; flags.push('Large/giant breed <5y — cervical Hansen Type I uncommon under 5y (×0.3)');
            }
        }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI cervical spine (gold standard)',
        'CT myelogram (alternative)',
        'CBC/biochemistry/urinalysis',
        'Respiratory monitoring (C3-C5 lesion risks phrenic nerve — watch for dyspnea)'
    ]
},

// ── Disease 2: Hansen Type II IVDD — Cervical (Chronic) ────────────────
{ id: 'c1c5-ivdd2', name: 'Hansen Type II IVDD — Cervical (Chronic)', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');
        var tetrap = hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia');
        var hemi   = hasValue(s, 'gait', 'hemiparesis RT') || hasValue(s, 'gait', 'hemiparesis LT');

        // [A] Signalment — older large/giant breeds; C2-C3 classic level
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age >= 7) A = 50;
        else if (age >= 5) A = 30;
        else if (age >= 3) A = 15;
        else               { A = 0; flags.push('Age <3y — Hansen Type II very unlikely this young'); }
        if (isBreed(s, predispositions.large))                    A = Math.min(50, A + 15);
        else if (isBreed(s, predispositions.chondro) && age >= 7) A = Math.min(50, A + 10);

        // [B] Temporal — chronic/subacute hallmark; slowly progressive
        var B = 0;
        if      (oc === 'chronic')  B = 50;
        else if (oc === 'subacute') B = 35;
        else if (oc === 'acute')    B = 10;
        else /* peracute */         B = 0;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — mild to moderate cervical pain typical; severe uncommon
        var C = 0;
        if      (pl === 'none')      C = 15;
        else if (pl === 'elsewhere') C = 20;
        else {
            if      (hasPainLevel(s, 'mild'))     C = 35;
            else if (hasPainLevel(s, 'moderate')) C = 30;
            else if (hasPainLevel(s, 'severe'))   { C = 15; flags.push('Severe pain — Type II usually mild pain; consider Type I or discospondylitis'); }
        }

        // [D] Deficit — UMN all 4 limbs (C1-C5 level, no LMN thoracic sign)
        var D = 0;
        if (tetrap || hemi) {
            D = 20;
            if (patellarNormInc) D += 15;
            if (s.asymmetry)     D +=  5;
        } else if (hasValue(s, 'gait', 'ataxia')) {
            D = 20;
            if (patellarNormInc) D += 10;
        } else if (!s.gait || hasValue(s, 'gait', 'normal')) {
            D = 25; // pain-only / ataxia-only also occurs
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + 15;
        var mult = 1;
        if (oc === 'peracute')   { mult *= 0.1; flags.push('Peracute onset — essentially excludes Type II (×0.1)'); }
        if (s.onset === 'acute') { mult *= 0.2; flags.push('Acute onset — Type II IVDD is a chronic degenerative process (×0.2)'); }
        if (age < 3)             { mult *= 0.1; flags.push('Age <3y — Hansen Type II very unlikely (×0.1)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI cervical spine (disc bulging/protrusion C2-C3, cord T2 signal change, foraminal stenosis)',
        'CT (bony detail, foraminal involvement)',
        'CBC/biochemistry',
        'Conservative management if mild (NSAIDs, rest, physiotherapy)',
        'Surgery (ventral slot or laminectomy) if neurological deficits or refractory pain'
    ]
},

// ── Disease 3: CSM Disc-Associated (Wobbler — Doberman/Large Breed) ────
{ id: 'c1c5-csm-disc', name: 'CSM Disc-Associated (Wobbler) — Doberman/Large Breed Type', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');

        // [A] Signalment — middle-aged+ Doberman; other large breeds possible but much less likely
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if (isBreed(s, predispositions.csmDisc) || isBreed(s, predispositions.large)) {
            // Known predisposed or large breed — full age scoring
            if      (age >= 6)  A = 50;
            else if (age >= 4)  A = 35;
            else if (age >= 2)  A = 15;
            else                A = 5;
            if (isBreed(s, predispositions.csmDisc)) A = Math.min(50, A + 20);
        } else {
            // Small breed or unknown — reduced base
            if      (age >= 6)  A = 20;
            else if (age >= 4)  A = 15;
            else if (age >= 2)  A = 8;
            else                A = 3;
        }

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
            if      (hasPainLevel(s, 'severe'))   C = 15; // severe cervical pain unusual
            else if (hasPainLevel(s, 'moderate')) C = 25;
            else if (hasPainLevel(s, 'mild'))     C = 40;
        }

        // [D] Deficit — "floating" pelvic ataxia is the classic Wobbler presentation
        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) {
            D = 30;
            if (patellarNormInc) D += 15;
        } else if (hasValue(s, 'gait', 'ataxia')) {
            D = 40; // pelvic > thoracic ataxia = Wobbler hallmark
            if (patellarNormInc) D += 10;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + 15;
        var mult = 1;
        if (breedKnown(s) && !isBreed(s, predispositions.large) && !isBreed(s, predispositions.csmDisc)) {
            mult *= 0.15; flags.push('Non-large/non-CSM breed — disc-type Wobbler essentially excluded (×0.15)');
        }
        if (oc === 'peracute' && (s.progression === 'stable' || s.progression === 'improving')) {
            mult *= 0.3; flags.push('Peracute non-progressive onset — FCEM/ANNPE more likely (×0.3)');
        }
        if (age < 2) { mult *= 0.2; flags.push('Age <2 years — consider CSM Osseous type or AA instability (×0.2)'); }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI cervical spine (dynamic: flexion/extension — disc protrusion, cord T2 hyperintensity)',
        'CT myelogram (dynamic views — disc protrusion pattern)',
        'Survey whole cervical spine (multifocal CSM common in Dobermans)',
        'Neurological grading (Olby/Frankel scale)'
    ]
},

// ── Disease 3: CSM Osseous-Associated (Wobbler — Giant Breed) ──────────
{ id: 'c1c5-csm-oss', name: 'CSM Osseous-Associated (Wobbler) — Great Dane/Giant Breed Type', category: 'Anomalous/Congenital',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');

        // [A] Signalment — young giant breeds ONLY; Great Dane typically 1–4 years
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if (isBreed(s, predispositions.csmOss)) {
            // Confirmed predisposed breed — full age-based scoring
            if      (age >= 1 && age <= 4)  A = 50;
            else if (age < 1)               A = 25;
            else if (age > 4 && age <= 7)   A = 30;
            else                            A = 10;
        } else {
            // Not a known csmOss breed — much lower base (still possible in large breeds)
            if      (age >= 1 && age <= 4)  A = 15;
            else if (age > 4 && age <= 7)   A = 10;
            else                            A = 5;
        }

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

        // [D] Deficit — UMN "wobbling" gait, pelvic worse than thoracic
        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) {
            D = 30;
            if (patellarNormInc) D += 15;
        } else if (hasValue(s, 'gait', 'ataxia')) {
            D = 40;
            if (patellarNormInc) D += 10;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + 10;
        var mult = 1;
        if (!isBreed(s, predispositions.csmOss)) {
            // Always penalise — unknown breed still not a known predisposed giant breed
            mult *= 0.25; flags.push('Not a known giant/osseous-CSM breed — osseous Wobbler uncommon (×0.25)');
        }
        if (oc === 'peracute') { mult *= 0.2; flags.push('Peracute onset unusual for osseous CSM (×0.2)'); }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI cervical spine (bony malformation, articular process hypertrophy, cord compression)',
        'CT (superior for bony detail — vertebral malformation characterization)',
        'Dynamic MRI/CT myelogram (extension worsens cord compression)',
        'Survey whole cervical spine (multifocal lesions common)'
    ]
},

// ── Disease 4: FCEM/ANNPE/IIVDE — Cervical ─────────────────────────────
{ id: 'c1c5-fcem', name: 'Peracute Non-Compressive Myelopathy (FCEM/ANNPE/IIVDE) — Cervical', category: 'Vascular/Traumatic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');
        var asym = !!(s.asymmetry);

        // [A] Signalment — any adult dog; large breeds predisposed
        var age = parseFloat(s.age) || 0;
        var A = age >= 1 ? 40 : 20;
        if (isBreed(s, predispositions.fcem)) A = Math.min(50, A + 10);

        // [B] Temporal — peracute onset is hallmark
        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 20;
        else                        B = 0;
        if (s.progression === 'stable' || s.progression === 'improving') B = Math.min(50, B + 10);

        // [C] Pain — classically absent or very transient
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 40;
        else {
            if      (s.painProgression === 'disappeared within 24/48 h') C = 50;
            else if (hasPainLevel(s, 'mild'))     C = 30;
            else if (hasPainLevel(s, 'moderate')) C = 5;
            else                                  C = 0;
        }

        // [D] Deficit — asymmetric tetraparesis / hemiparesis is hallmark at cervical level
        var tetrap = hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia');
        var hemi   = hasValue(s, 'gait', 'hemiparesis RT') || hasValue(s, 'gait', 'hemiparesis LT');
        var D = 0;
        if (tetrap || hemi) {
            D = 20;
            if (asym)          D += 20; // hemisection pattern = FCEM/ANNPE hallmark
            if (patellarNormInc) D += 10;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + 15;
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
        'MRI cervical spine (FCEM: normal discs + T2 cord lesion; ANNPE: collapsed disc + short T2)',
        'MRI differentiates FCEM from ANNPE/IIVDE — cannot be distinguished clinically',
        'CBC/biochemistry'
    ]
},

// ── Disease 5: Atlantoaxial Instability ────────────────────────────────
{ id: 'c1c5-aa', name: 'Atlantoaxial Instability', category: 'Anomalous/Congenital',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');

        // [A] Signalment — young toy breeds (congenital); large breeds possible (traumatic)
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age < 2)              A = 50;
        else if (age >= 2 && age <= 4) A = 20;
        else                           A = 5;
        if (isBreed(s, predispositions.toy)) A = Math.min(50, A + 20);
        else                                  A = Math.round(A * 0.4);

        // [B] Temporal — acute episodes common; may have chronic/waxing course
        var B = 0;
        if      (oc === 'peracute') B = 40;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'subacute') B = 25;
        else                        B = 15;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — severe cervical pain, worse on head movement
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 5;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 35;
            else if (hasPainLevel(s, 'mild'))     C = 20;
        }

        // [D] Deficit — tetraparesis; severe: tetraplegia, respiratory distress
        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) {
            D = 35;
            if (patellarNormInc) D += 10;
        } else if (hasValue(s, 'gait', 'ataxia')) {
            D = 25;
            if (patellarNormInc) D += 10;
        } else if (!s.gait || hasValue(s, 'gait', 'normal')) {
            D = 30; // pain-only is common presentation early
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + 10;
        var mult = 1;
        if (age > 4) {
            mult *= 0.1; flags.push('Age >4y — congenital AA instability essentially excluded in adults (×0.1)');
        } else if (age > 2) {
            mult *= 0.4; flags.push('Age 2–4y — AA instability uncommon after early adulthood (×0.4)');
        }
        if (breedKnown(s) && !isBreed(s, predispositions.toy)) {
            mult *= 0.2; flags.push('Non-toy breed — AA instability rare outside toy/small breeds (×0.2)');
        }

        alerts.push({
            type: 'CRITICAL',
            title: 'AA Instability — DO NOT FLEX THE NECK',
            text: 'NEVER perform forced cervical flexion for radiographs. Stressed flexion can cause acute spinal cord transection, respiratory arrest, and immediate death. Diagnose with CT or MRI in neutral position. Lateral radiograph in natural position only — NO stressed views.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CT cervical (C1–C2) in neutral position — preferred; NO forced flexion',
        'MRI cervical (C1–C2) in neutral position',
        'Lateral radiograph in natural position ONLY — never stressed flexion',
        'Surgical stabilization (C1–C2 ventral fixation — definitive treatment)'
    ]
},

// ── Disease 6: SRMA ────────────────────────────────────────────────────
{ id: 'c1c5-srma', name: 'Steroid-Responsive Meningitis-Arteritis (SRMA)', category: 'Inflammatory/Immune',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A] Signalment — young dogs; breed predisposed
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age < 2)              A = 50;
        else if (age >= 2 && age <= 4) A = 30;
        else                           A = 10;
        if (isBreed(s, predispositions.srma)) A = Math.min(50, A + 15);

        // [B] Temporal — acute/subacute; episodic relapses characteristic
        var B = 0;
        if      (oc === 'acute')    B = 50;
        else if (oc === 'subacute') B = 40;
        else if (oc === 'peracute') B = 20;
        else                        B = 10;

        // [C] Pain — cervical hyperesthesia is the hallmark; fever is key systemic sign
        var C = 0;
        if      (pl === 'elsewhere') C = 10;
        else if (pl === 'none')      C = 0;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 35;
            else if (hasPainLevel(s, 'mild'))     C = 20;
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

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + systemicScore(s) + 15;
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
        'CSF analysis — DIAGNOSTIC: massive neutrophilic pleocytosis (>50 cells/μL, predominantly PMN)',
        'CBC/biochemistry (leukocytosis, markedly elevated CRP — typically >70 mg/L)',
        'MRI brain + cervical spine (leptomeningeal enhancement; rule out structural disease first)',
        'Treatment: prednisolone 1–2 mg/kg/day — taper over 6 months minimum; excellent prognosis if treated early'
    ]
},

// ── Disease 7: Discospondylitis — Cervical ─────────────────────────────
{ id: 'c1c5-disco', name: 'Discospondylitis — Cervical', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

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

        // [C] Pain — severe focal cervical pain; reluctance to lower head/neck
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 0;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 30;
            else if (hasPainLevel(s, 'mild'))     C = 20;
        }

        // [D] Deficit — pain-dominant early; tetraparesis with UMN signs as progresses
        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) {
            D = 25;
            if (patellarNormInc) D += 10;
        } else if (!s.gait || hasValue(s, 'gait', 'normal')) {
            D = 40; // pain-only very common
        } else {
            D = 20;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + systemicScore(s) + 10;
        var mult = 1;
        if (pl === 'none') { mult *= 0.05; flags.push('Painless — near-excludes discospondylitis (×0.05)'); }
        if (pl !== 'none' && pl !== 'elsewhere' && hasPainLevel(s, 'severe')) {
            mult *= 1.4; flags.push('Severe focal pain — strongly supports discospondylitis (×1.4)');
        }

        alerts.push({
            type: 'WARNING',
            title: 'Brucella canis — Mandatory Screening (Zoonotic)',
            text: 'Brucella canis MUST be ruled out before starting treatment if patient is intact or recently bred. Zoonotic risk to owners and clinic staff. ELISA/AGID/PCR serology required.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Radiographs (endplate lysis, disc space collapse — first test)',
        'MRI cervical spine (early lesions, epidural abscess, cord compression)',
        'CBC/biochemistry (leukocytosis, elevated CRP)',
        'Blood cultures (3 sets)',
        'Brucella canis serology — MANDATORY before treatment (zoonotic)',
        'Urine culture'
    ]
},

// ── Disease 8: Spinal Tumor — Cervical (Nerve Sheath / Meningioma) ─────
{ id: 'c1c5-tumor', name: 'Spinal Tumor — Cervical (Nerve Sheath Tumor, Meningioma)', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');

        // [A] Signalment — middle-aged to older; any breed; NST: large breeds
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age >= 7) A = 50;
        else if (age >= 4) A = 35;
        else if (age >= 2) A = 20;
        else               A = 10;
        if (isBreed(s, predispositions.large)) A = Math.min(50, A + 5);

        // [B] Temporal — slowly progressive; occasional acute decompensation
        var B = 0;
        if      (oc === 'chronic')  B = 40;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15;
        else                        B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 15);

        // [C] Pain — nerve sheath tumor: often severe; "root signature" (holds limb up)
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 15;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 35;
            else if (hasPainLevel(s, 'mild'))     C = 20;
        }

        // [D] Deficit — often asymmetric; NST: hemiparesis or monoparesis ipsilateral
        var D = 0;
        var tetrap = hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia');
        var hemi   = hasValue(s, 'gait', 'hemiparesis RT') || hasValue(s, 'gait', 'hemiparesis LT');
        if (hemi) {
            D = 40; // hemiparesis is strong signal for unilateral NST
            if (patellarNormInc) D += 10;
        } else if (tetrap) {
            D = 20;
            if (patellarNormInc) D += 10;
            if (s.asymmetry)     D += 10;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + 10;
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
        'MRI cervical spine with contrast (foraminal extension "dumbbell sign" in NST)',
        'CT thorax (staging — lung metastases)',
        'CBC/biochemistry',
        'CSF analysis with cytology (neoplastic cells, elevated protein)',
        'Biopsy/histopathology (definitive)'
    ]
},

// ── Disease 9: Chiari-like Malformation / Syringomyelia ────────────────
{ id: 'c1c5-clm-sm', name: 'Chiari-like Malformation / Syringomyelia', category: 'Anomalous/Congenital',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');

        // [A] Signalment — CKCS strongly predisposed; other small/brachycephalic breeds
        var age = parseFloat(s.age) || 0;
        var A = 10;
        if (s.breed === 'Cavalier King Charles Spaniel') {
            A = 50;
            flags.push('CKCS — highest predisposition for CLM/SM');
        } else if (isBreed(s, predispositions.toy)) {
            A = 30;
        } else if (isBreed(s, predispositions.chondro)) {
            A = 25;
        } else if (isBreed(s, predispositions.large)) {
            A = 8;
        }
        if      (age >= 1 && age <= 6) A = Math.min(50, A + 5);
        else if (age > 8)              A = Math.round(A * 0.7);

        // [B] Temporal — chronic insidious onset is hallmark
        var B = 0;
        if      (oc === 'chronic')  B = 50;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15;
        else                        B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — neuropathic cervical pain; intermittent/positional is hallmark; mild typical
        var C = 0;
        if      (pl === 'elsewhere') C = 10;
        else if (pl === 'none')      C = 20;
        else {
            if      (hasPainLevel(s, 'mild'))     C = 40;
            else if (hasPainLevel(s, 'moderate')) C = 20; // moderate less typical than mild for SM
            else if (hasPainLevel(s, 'severe'))   C = 10; // severe focal pain uncommon in SM
            else                                  C = 25;
        }
        // Pain pattern: intermittent/positional is hallmark of neuropathic SM pain
        if (s.painPattern === 'intermittent' || s.painPattern === 'positional') {
            C = Math.min(50, C + 15); flags.push('Intermittent/positional pain — hallmark neuropathic SM pattern (+15 C)');
        } else if (s.painPattern === 'constant') {
            C = Math.max(0, C - 10); flags.push('Constant pain — less typical for SM; consider disc/tumor (-10 C)');
        }

        // [D] Deficit — ataxia is most typical; tetraparesis suggests more compressive disease
        var D = 0;
        if (hasValue(s, 'gait', 'ataxia')) {
            D = 35;
            if (patellarNormInc) D += 10;
        } else if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) {
            D = 15; // reduced — tetraparesis more typical of disc/tumor than SM
            if (patellarNormInc) D += 5;
            if (s.breed !== 'Cavalier King Charles Spaniel') {
                flags.push('Tetraparesis in non-CKCS — less typical for CLM/SM; consider disc disease or tumor');
            }
        } else if (!s.gait || hasValue(s, 'gait', 'normal')) {
            D = 10; // pain-only without phantom scratching is non-specific
        }
        // Phantom scratching: near-pathognomonic for SM
        if (s.phantomScratching === 'yes') {
            D = Math.min(50, D + 20); flags.push('Phantom scratching — near-pathognomonic for syringomyelia (+20 D)');
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + 10;
        var mult = 1;
        if (s.phantomScratching === 'yes') { mult *= 1.8; flags.push('Phantom scratching confirmed — strongly supports CLM/SM (×1.8)'); }
        if (s.painPattern === 'intermittent' || s.painPattern === 'positional') { mult *= 1.2; flags.push('Intermittent/positional pain pattern — supports SM neuropathic pain (×1.2)'); }
        if ((hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) && s.breed !== 'Cavalier King Charles Spaniel') {
            mult *= 0.5; flags.push('Tetraparesis in non-CKCS — compressive disc/tumor more likely than SM (×0.5)');
        }
        if (breedKnown(s) && s.breed !== 'Cavalier King Charles Spaniel' && !isBreed(s, predispositions.toy) && !isBreed(s, predispositions.chondro)) {
            mult *= 0.2; flags.push('Non-brachycephalic/non-toy breed — CLM/SM very uncommon outside small/brachycephalic breeds (×0.2)');
        }
        if (oc === 'acute' && s.breed !== 'Cavalier King Charles Spaniel') {
            mult *= 0.4; flags.push('Acute onset in non-CKCS — CLM/SM is chronic/insidious; consider IVDD or inflammatory (×0.4)');
        }
        if (oc === 'peracute') { mult *= 0.2; flags.push('Peracute onset — atypical for CLM/SM (×0.2)'); }
        if (s.species === 'cat') { mult *= 0.3; flags.push('Cat — CLM/SM very rare in cats (×0.3)'); }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain + cervical spine — gold standard (foramen magnum overcrowding, syrinx within cord)',
        'Assess for phantom scratching — pathognomonic for SM (neuropathic itch at neck/shoulder without skin lesion)',
        'CM grading (A–D) and syrinx width measurement',
        'Medical management: gabapentin (neuropathic pain), omeprazole (CSF production), furosemide',
        'Surgical option: foramen magnum decompression — indicated for progressive/refractory cases'
    ]
},

// ── Disease 10: Spinal Arachnoid Diverticulum — Cervical ───────────────
{ id: 'c1c5-sad', name: 'Spinal Arachnoid Diverticulum — Cervical', category: 'Anomalous/Congenital',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');

        // [A] Signalment — Rottweiler highly predisposed at cervical level (C2-C4); other large breeds possible
        var age = parseFloat(s.age) || 0;
        var A = 15;
        if (s.breed === 'Rottweiler') {
            A = 50; flags.push('Rottweiler — highest predisposition for cervical SAD (C2-C4)');
        } else if (isBreed(s, predispositions.large)) {
            A = 30;
        }
        if (age >= 1 && age <= 5) A = Math.min(50, A + 10);

        // [B] Temporal — chronic insidious; occasionally acute decompensation
        var B = 0;
        if      (oc === 'chronic')  B = 50;
        else if (oc === 'subacute') B = 35;
        else if (oc === 'acute')    B = 15;
        else                        B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — variable; often mild or absent; not a dominant feature
        var C = 0;
        if      (pl === 'elsewhere') C = 20;
        else if (pl === 'none')      C = 35; // frequently painless
        else {
            if      (hasPainLevel(s, 'mild'))     C = 35;
            else if (hasPainLevel(s, 'moderate')) C = 25;
            else if (hasPainLevel(s, 'severe'))   C = 10; // severe pain uncommon
            else                                  C = 30;
        }

        // [D] Deficit — chronic progressive UMN tetraparesis/ataxia is typical presentation
        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) {
            D = 35;
            if (patellarNormInc) D += 15;
        } else if (hasValue(s, 'gait', 'ataxia')) {
            D = 30;
            if (patellarNormInc) D += 10;
        } else if (!s.gait || hasValue(s, 'gait', 'normal')) {
            D = 15;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + 10;
        var mult = 1;
        if (breedKnown(s) && !isBreed(s, predispositions.large) && s.breed !== 'Rottweiler') {
            mult *= 0.5; flags.push('Non-large/non-Rottweiler breed — cervical SAD less common but reported in small breeds (×0.5)');
        }
        if (oc === 'peracute')   { mult *= 0.2; flags.push('Peracute onset — atypical for arachnoid diverticulum (×0.2)'); }
        if (s.onset === 'acute') { mult *= 0.3; flags.push('Acute onset — SAD is a chronic developmental condition; acute isolated pain is atypical (×0.3)'); }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI spine T2 (intradural fluid-filled cyst, cord compression/displacement)',
        'CT myelogram (contrast pooling within cyst — confirms diagnosis, superior for surgical planning)',
        'Surgical treatment: cyst fenestration/marsupialisation (good prognosis if treated before severe myelopathy)'
    ]
},

// ── Disease 11: Meningomyelitis / Myelitis — Cervical ──────────────────
{ id: 'c1c5-meningo', name: 'Meningomyelitis / Myelitis — Cervical', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var patellarNormInc = (s.patellarReflexR === 'normal' || s.patellarReflexR === 'increased' ||
                               s.patellarReflexL === 'normal' || s.patellarReflexL === 'increased');

        // [A] Signalment — no strong breed predisposition; any age/breed
        var age = parseFloat(s.age) || 0;
        var A = 25;
        if      (age >= 1 && age <= 8) A = 30;
        else if (age < 1)              A = 20;

        // [B] Temporal — subacute progression (days to weeks) is hallmark
        var B = 0;
        if      (oc === 'subacute') B = 50;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'chronic')  B = 20;
        else                        B = 10; // peracute unusual
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — variable; mild to moderate cervical pain common
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

        // [D] Deficit — highly asymmetric tetraparesis is characteristic; pain-only possible early
        var D = 0;
        var hemi = hasValue(s, 'gait', 'hemiparesis RT') || hasValue(s, 'gait', 'hemiparesis LT');
        if (hemi) {
            D = 40; // asymmetric/hemisection pattern strongly supports meningomyelitis
            if (s.asymmetry) D += 10;
        } else if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) {
            D = 25;
            if (s.asymmetry)     D += 10;
            if (patellarNormInc) D += 5;
        } else if (hasValue(s, 'gait', 'ataxia')) {
            D = 20;
        } else if (!s.gait || hasValue(s, 'gait', 'normal')) {
            D = 15; // pain-only presentation possible early in meningomyelitis
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + systemicScore(s) + 10;
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
        'MRI brain + cervical spine with contrast (intramedullary T2 hyperintensity, leptomeningeal enhancement)',
        'CSF analysis — ESSENTIAL: inflammatory cells (neutrophilic, eosinophilic, or lymphocytic pleocytosis)',
        'CSF culture + sensitivity (bacterial meningomyelitis)',
        'Infectious disease panel: Toxoplasma, Neospora, Cryptococcus, Distemper, tick-borne diseases',
        'CBC/biochemistry (leukocytosis, elevated CRP in bacterial/protozoal cases)'
    ]
},

// ── Disease 13: Tick-Borne Meningomyelitis — Cervical ──────────────────
{ id: 'c1c5-tickborne', name: 'Tick-Borne Meningomyelitis (Ehrlichia canis / Rickettsia rickettsii) — Cervical', category: 'Inflammatory/Infectious',
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

        // [C] Pain — cervical/meningeal; Rickettsia mimics SRMA
        var C = 0;
        if      (pl === 'at-site') C = 45;
        else if (pl === 'none')    C = 10;
        else                       C = 15;

        // [D] Deficit — tetraparesis/ataxia; may present pain-only
        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) D = 35;
        else if (hasValue(s, 'gait', 'ataxia'))                                         D = 30;
        else if (!s.gait || hasValue(s, 'gait', 'normal'))                              D = 20;

        // Systemic signs — fever MANDATORY for both agents
        var sysBonus = 0;
        if (s.fever === 'yes')     { sysBonus += 30; flags.push('Fever — MAJOR sign for both Ehrlichia and Rickettsia; fever + acute cervical pain = tick-borne until ruled out'); }
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

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + sysBonus + 10;
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
        'MRI cervical spine with contrast (meningeal enhancement, intramedullary lesion)',
        'CSF analysis (neutrophilic or mixed pleocytosis, elevated protein)',
        'Tick exposure history — Amblyomma cajennense = Rickettsia; Rhipicephalus sanguineus = Ehrlichia',
        'DO NOT administer corticosteroids — can be fatal in Rickettsia rickettsii'
    ]
},

// ── Disease 15: GME — Cervical ─────────────────────────────────────────
{ id: 'c1c5-gme', name: 'GME — Cervical (Granulomatous Meningoencephalomyelitis)', category: 'Inflammatory',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — small/toy breeds, young adults; same predispositions as forebrain GME
        var A = 0;
        var gmeBreeds = ['Maltese', 'Yorkshire Terrier', 'Toy Poodle', 'Miniature Poodle', 'Poodle',
            'Chihuahua', 'Dachshund', 'Pug', 'West Highland White Terrier', 'Boston Terrier'];
        if (isBreed(s, gmeBreeds))                { A += 20; flags.push('GME-predisposed breed'); }
        else if (isBreed(s, predispositions.toy))   A += 15;
        if      (age >= 2 && age <= 6) A += 25;
        else if (age > 6 && age <= 9)  A += 15;
        else                           A += 5;

        // [B] Temporal — subacute to chronic; can be acute
        var B = 0;
        if      (oc === 'subacute') B = 45;
        else if (oc === 'chronic')  B = 35;
        else if (oc === 'acute')    B = 25;
        else /* peracute */         B = 10;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — meningeal irritation; cervical pain common
        var C = 0;
        if      (pl === 'at-site') C = 40;
        else if (pl === 'none')    C = 20;
        else                       C = 15;

        // [D] Deficit — tetraparesis, ataxia, or pain-dominant
        var D = 0;
        var tetrap = hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia');
        if (tetrap)                                        D = 35;
        else if (hasValue(s, 'gait', 'ataxia'))            D = 30;
        else if (!s.gait || hasValue(s, 'gait', 'normal')) D = 20; // pain-dominant GME common in cervical

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + systemicScore(s) + 10;
        var mult = 1;
        if (s.fever === 'yes' && pl === 'at-site') { mult *= 1.3; flags.push('Fever + cervical pain — meningomyelitis pattern (×1.3)'); }
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
        'MRI cervical spine + brain with contrast (multifocal enhancing lesions)',
        'CSF analysis (mononuclear pleocytosis, elevated protein)',
        'Infectious panel: Toxoplasma, Neospora, Cryptococcus, CDV, Ehrlichia, Rickettsia',
        'CSF PCR panel (Toxoplasma, Neospora, CDV, Cryptococcus)',
        'Definitive Dx: histopathology (biopsy or post-mortem)',
        'Treatment: prednisolone ± cytarabine or CCNU — referral recommended'
    ]
},

// ── Disease 16: Infectious Myelitis — Cervical (CDV/Protozoal/Leishmania) ─
{ id: 'c1c5-infectious-myelitis', name: 'Infectious Myelitis — Cervical (CDV / Toxoplasma / Neospora / Leishmaniasis)', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — CDV: young unvaccinated; Protozoal: young dogs; Leishmania: any
        var A = 0;
        if      (age < 2)              { A = 35; flags.push('Age <2y — CDV myelitis or protozoal (Neospora) most likely in young unvaccinated'); }
        else if (age >= 2 && age <= 6)   A = 25;
        else                             A = 20;
        if (s.vaccinated === 'yes' || s.vaccinated === 'upToDate') {
            flags.push('Vaccinated — CDV less likely; consider protozoal or Leishmania');
        }

        // [B] Temporal — acute to subacute
        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 40;
        else if (oc === 'subacute')                   B = 35;
        else if (oc === 'chronic')                    B = 20;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — meningeal irritation variable
        var C = 0;
        if      (pl === 'at-site') C = 35;
        else if (pl === 'none')    C = 15;
        else                       C = 15;

        // [D] Deficit — tetraparesis/ataxia
        var D = 0;
        var tetrap = hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia');
        if (tetrap)                                        D = 35;
        else if (hasValue(s, 'gait', 'ataxia'))            D = 30;
        else if (!s.gait || hasValue(s, 'gait', 'normal')) D = 15;

        // CDV specific
        if (hasValue(s, 'gait', 'myoclonus')) { D += 25; flags.push('Myoclonus — highly characteristic of CDV (~40% of cases)'); }
        if (s.cough === 'yes')                { flags.push('Cough — systemic CDV respiratory involvement (STRONG support for CDV)'); }
        if (s.nasalDischarge === 'yes')         flags.push('Nasal discharge — systemic CDV sign');
        // Neospora specific
        if (s.muscleAtrophy === 'yes')        { flags.push('Muscle atrophy — Neospora polyradiculoneuritis; pelvic limb rigidity in young dogs'); }
        // Leishmania specific
        if (s.skinLesions === 'yes')          { flags.push('Skin lesions — consider Leishmaniasis (exfoliative dermatitis, hyperkeratosis)'); }
        if (s.lymphadenopathy === 'yes')      { flags.push('Lymphadenopathy — Leishmania or disseminated CDV/protozoal'); }

        var sysBonus = 0;
        if (s.fever === 'yes')      { sysBonus += 20; flags.push('Fever — systemic infectious disease'); }
        if (s.weightLoss === 'yes')   sysBonus += 10;
        if (s.anorexia === 'yes')     sysBonus += 5;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + sysBonus + 10;
        var mult = 1;
        if (hasValue(s, 'gait', 'myoclonus')) { mult *= 1.5; flags.push('Myoclonus — CDV multiplier (×1.5)'); }
        if (s.vaccinated === 'yes' || s.vaccinated === 'upToDate') {
            mult *= 0.5; flags.push('Vaccinated — CDV reduced; protozoal/Leishmania still possible (×0.5)');
        }
        if ((!s.gait || hasValue(s, 'gait', 'normal')) && s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.55; flags.push('No gait deficit + no systemic signs — infectious myelitis unlikely as sole pain presentation (×0.55)');
        }
        if (oc === 'chronic' && s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.6; flags.push('Chronic onset + no systemic signs — infectious myelitis less likely; consider structural/degenerative (×0.6)');
        }

        alerts.push({
            type: 'URGENT',
            title: 'Infectious Myelitis — Do NOT Start Corticosteroids Before Ruling Out Infection',
            text: 'CDV: PCR (nasal/urine/CSF) + serology. ISOLATE if CDV suspected. Neospora/Toxoplasma: IgG/IgM serology + PCR CSF; treat with trimethoprim-sulpha + clindamycin ± pyrimethamine. Leishmaniasis: IFAT + quantitative PCR (blood/bone marrow). Do NOT give corticosteroids as first-line before infectious panel results — can cause fatal deterioration in protozoal disease.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CDV PCR — nasal/conjunctival swab, urine, CSF (combination highest sensitivity)',
        'CDV serology (IgM for acute) — less reliable than PCR',
        'Toxoplasma / Neospora IgG + IgM serology (paired titres)',
        'PCR CSF — Toxoplasma, Neospora, CDV, Cryptococcus panel',
        'Leishmania IFAT + quantitative PCR (blood + bone marrow aspirate)',
        'MRI cervical spine + brain with contrast (intramedullary lesions, meningeal enhancement)',
        'CSF analysis (cytology: lymphocytic/mixed pleocytosis)',
        'CBC/biochemistry (lymphopenia in CDV; hypoalbuminaemia in Leishmania)',
        'ISOLATE if CDV suspected — highly contagious'
    ]
},

// ── 13. Rabies Encephalomyelitis — Paralytic/Dumb Form ─────────────────
{ id: 'c1c5-rabies', name: 'Rabies Encephalomyelitis — Paralytic (Dumb) Form', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A] Signalment — any unvaccinated dog; exposure history critical
        var A = 20;
        if (s.vaccinated === 'yes' || s.vaccinated === 'upToDate') {
            A = 0; flags.push('Vaccinated against rabies — rabies very unlikely (but legally must rule out in endemic areas)');
        }
        if (s.biteHistory === 'yes' || s.wildlifeExposure === 'yes') {
            A += 30; flags.push('Bite wound / wildlife contact — CRITICAL rabies risk factor');
        }

        // [B] Temporal — rapidly progressive; death within days
        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 45;
        else if (oc === 'subacute')                   B = 30;
        else                                          B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — pharyngeal spasm may mimic cervical pain; not true meningeal
        var C = 0;
        if      (pl === 'none')    C = 20;
        else if (pl === 'at-site') C = 15;
        else                       C = 10;

        // [D] Deficit — ascending paralysis reaching cervical cord; tetraparesis/plegia
        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) { D += 25; flags.push('Tetraparesis/plegia — ascending paralytic rabies reaching cervical cord'); }
        if (mentalDepressed(s))                                                          D += 20;
        if (s.swallowingFunction === 'dysphagia')                                       { D += 25; flags.push('Dysphagia — CN IX/X brainstem involvement; rabies hallmark'); }
        if (s.behavior === 'aggressive')                                                { D += 15; flags.push('Aggression — furious component overlapping paralytic form'); }
        if (s.gagReflex === 'decreased' || s.gagReflex === 'absent')                    { D += 15; flags.push('Absent gag reflex — brainstem co-involvement (CN IX/X)'); }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'C1-C5') + 10;
        var mult = 1;
        if (s.vaccinated === 'yes' || s.vaccinated === 'upToDate') {
            mult *= 0.05; flags.push('Vaccinated — rabies near-excluded (×0.05)');
        }
        if (oc === 'chronic') { mult *= 0.05; flags.push('Chronic course — rabies kills within days of neurological onset (×0.05)'); }
        if (s.biteHistory !== 'yes' && s.wildlifeExposure !== 'yes' && s.behavior !== 'aggressive' && s.swallowingFunction !== 'dysphagia') {
            mult *= 0.1; flags.push('No bite/wildlife exposure and no hallmark signs — paralytic rabies unlikely without context (×0.1)');
        }

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
}

];

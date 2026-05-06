// L4-S3 diagnoses — rewritten from DDX-main/src/regions/L4-S3.js in our style.
// Uses OUR parameter names directly (no normalise adapter).
// Diagnosis-only params (fever, vaccinated, cough, petechiae, ...) live in
// apps/Localisation/diagnoses/diagnosesParameters.json and are merged into the
// Parameters model at init — Parameters app renders them as extra categories.
// LMN pelvic limb signs expected (decreased patellar, withdrawal, perineal reflexes).

app.diagnoses = app.diagnoses || {};
app.diagnoses['L4-S3'] = [

// ── 1. Hansen Type I IVDD — Lumbar (Acute) ─────────────────────────────
{ id: 'l4s3-ivdd1', name: 'Hansen Type I IVDD — Lumbar (Acute)', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnPelvic = (s.patellarReflexR === 'decreased' || s.patellarReflexR === 'absent' ||
                         s.patellarReflexL === 'decreased' || s.patellarReflexL === 'absent' ||
                         s.extensorTonePelvicR === 'decreased' || s.extensorTonePelvicL === 'decreased');
        var withdrawalDec = (s.withdrawalPelvicR === 'decreased' || s.withdrawalPelvicR === 'absent' ||
                             s.withdrawalPelvicL === 'decreased' || s.withdrawalPelvicL === 'absent');

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
        else if (oc === 'acute')    B = 25;
        else if (oc === 'subacute') B = 15;
        else                        B = 0;
        if (s.progression === 'stable' || s.progression === 'improving') B += 15;
        else if (s.progression === 'worsening') B += 5;

        // [C] Pain
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 0;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 30;
            else if (hasPainLevel(s, 'mild'))     C = 15;
        }

        // [D] Deficit — LMN pelvic pattern confirms L4-S3 involvement
        var D = 0;
        var isParaPara = hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia');
        if (isParaPara) {
            D = 20;
            if (lmnPelvic)     D += 20; // decreased patella confirms L4-S3 level
            if (withdrawalDec) D += 5;
            if (s.asymmetry)   D += 5;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L4-S3') + 20;
        var mult = 1;
        if (oc === 'chronic' || (parseFloat(s.duration) || 0) > 14) {
            mult *= 0.05; flags.push('Chronic onset — essentially excludes Type I IVDD (×0.05)');
        }
        if (s.painProgression === 'disappeared within 24/48 h') {
            mult *= 0.3; flags.push('Pain resolved 24–48 h — FCEM/ANNPE more likely (×0.3)');
        }

        // ── PMM ALERT — fires for non-ambulatory L4-S3 IVDD
        if (s.ambulation === 'non ambulatory') {
            var dpAbsent = s.deepPain === 'absent';
            alerts.push({
                type: dpAbsent ? 'CRITICAL' : 'WARNING',
                title: dpAbsent
                    ? 'Progressive Myelomalacia — Grave Risk'
                    : 'Progressive Myelomalacia Risk — Monitor Closely',
                text: dpAbsent
                    ? 'Non-ambulatory lumbar IVDD with ABSENT deep pain: progressive myelomalacia (PMM) is a critical concern. Monitor cutaneous trunci reflex daily for cranial migration of the cutoff level — ascending PMM is fatal. Reassess neurological status every 4–6 h. Prognosis is grave. Emergency surgical decompression is the only treatment option; even then, PMM may not be halted.'
                    : 'Non-ambulatory lumbar IVDD with intact deep pain: monitor for ascending myelomalacia. Assess cutaneous trunci reflex level and deep pain perception every 8–12 h. Any cranial migration of the cutaneous trunci cutoff or loss of deep pain is an emergency — immediate re-evaluation and escalation of care required.'
            });
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI lumbar spine (gold standard — disc herniation, cord/cauda equina compression)',
        'CT myelogram (alternative if MRI unavailable)',
        'Deep pain assessment — critical prognostic factor',
        'CBC/biochemistry/urinalysis',
        'Bladder assessment (LMN bladder: easily expressed, may dribble — vs UMN: hard to express)'
    ]
},

// ── 2. Hansen Type II IVDD — Lumbar (Chronic) ──────────────────────────
{ id: 'l4s3-ivdd2', name: 'Hansen Type II IVDD — Lumbar (Chronic)', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnPelvic = (s.patellarReflexR === 'decreased' || s.patellarReflexR === 'absent' ||
                         s.patellarReflexL === 'decreased' || s.patellarReflexL === 'absent' ||
                         s.extensorTonePelvicR === 'decreased' || s.extensorTonePelvicL === 'decreased');
        var withdrawalDec = (s.withdrawalPelvicR === 'decreased' || s.withdrawalPelvicR === 'absent' ||
                             s.withdrawalPelvicL === 'decreased' || s.withdrawalPelvicL === 'absent');

        // [A] Signalment — older dogs, large/giant breeds; also older chondrodystrophics
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if (age >= 7)            A = 50;
        else if (age >= 5)       A = 30;
        else if (age >= 3)       A = 15;
        else                     A = 0;
        if (isBreed(s, predispositions.large))   A = Math.min(50, A + 10);
        if (isBreed(s, predispositions.chondro) && age >= 7) A = Math.min(50, A + 5);

        // [B] Temporal — chronic/subacute is hallmark
        var B = 0;
        if      (oc === 'chronic')  B = 50;
        else if (oc === 'subacute') B = 35;
        else if (oc === 'acute')    B = 10;
        else                        B = 0;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 10;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 40;
            else if (hasPainLevel(s, 'moderate')) C = 30;
            else if (hasPainLevel(s, 'mild'))     C = 20;
        }

        // [D] Deficit — LMN signs confirm L4-S3 level
        var D = 0;
        var isParaPara = hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia');
        if (isParaPara) {
            D = 20;
            if (lmnPelvic)     D += 20;
            if (withdrawalDec) D += 10;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L4-S3') + 15;
        var mult = 1;
        if (oc === 'peracute') {
            mult *= 0.1; flags.push('Peracute onset — essentially excludes Type II IVDD (×0.1)');
        }
        if (s.onset === 'acute') { mult *= 0.2; flags.push('Acute onset — Type II IVDD is a chronic degenerative process (×0.2)'); }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI lumbar spine (disc bulging, dorsal annular protrusion, foraminal stenosis)',
        'CT (bony remodeling, foraminal stenosis — often better than MRI for this)',
        'CBC/biochemistry',
        'Bladder assessment'
    ]
},

// ── 3. Peracute Non-Compressive Myelopathy (FCEM/ANNPE/IIVDE) — Lumbar ──
{ id: 'l4s3-fcem-annpe', name: 'Peracute Non-Compressive Myelopathy (FCEM/ANNPE/IIVDE) — Lumbar', category: 'Vascular/Traumatic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnPelvic = (s.patellarReflexR === 'decreased' || s.patellarReflexR === 'absent' ||
                         s.patellarReflexL === 'decreased' || s.patellarReflexL === 'absent' ||
                         s.extensorTonePelvicR === 'decreased' || s.extensorTonePelvicL === 'decreased');
        var withdrawalDec = (s.withdrawalPelvicR === 'decreased' || s.withdrawalPelvicR === 'absent' ||
                             s.withdrawalPelvicL === 'decreased' || s.withdrawalPelvicL === 'absent');
        var asym = !!(s.asymmetry);

        // [A] Signalment — any adult dog; large/medium breeds predisposed
        var age = parseFloat(s.age) || 0;
        var A = age >= 1 ? 40 : 20;
        if (isBreed(s, predispositions.fcem)) A = Math.min(50, A + 10);

        // [B] Temporal — peracute onset hallmark; non-progressive after first hours
        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 20;
        else                        B = 0;
        if (s.progression === 'stable' || s.progression === 'improving') B = Math.min(50, B + 10);

        // [C] Pain — classically absent or very transient (resolves <24–48 h)
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 40;
        else {
            if      (s.painProgression === 'disappeared within 24/48 h') C = 50;
            else if (hasPainLevel(s, 'mild'))     C = 30;
            else if (hasPainLevel(s, 'moderate')) C = 5;
            else                                  C = 0;
        }

        // [D] Deficit — asymmetry is classic; LMN signs at lumbar level
        var D = 0;
        var isParaPara = hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia');
        if (isParaPara) {
            D = 20;
            if (asym)          D += 15; // hemisection-like asymmetry is hallmark
            if (lmnPelvic)     D += 10;
            if (withdrawalDec) D += 5;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L4-S3') + 15;
        var mult = 1;
        if (oc === 'chronic') {
            mult *= 0.05; flags.push('Chronic onset excludes FCEM/ANNPE/IIVDE (×0.05)');
        }
        if (s.progression === 'worsening' && (parseFloat(s.duration) || 0) > 2) {
            mult *= 0.2; flags.push('Progressive after 48 h — not consistent with FCEM/ANNPE (×0.2)');
        }
        if (oc === 'peracute') {
            mult *= 1.5; flags.push('Peracute onset during activity — strong FCEM/ANNPE pattern (×1.5)');
        }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI lumbar spine (FCEM: normal discs + T2 cord lesion; ANNPE: collapsed disc + short T2 lesion at disc level)',
        'MRI differentiates FCEM from ANNPE/IIVDE — cannot be distinguished clinically',
        'CBC/biochemistry',
        'Rule out thromboembolism (cardiac echo if systemic disease suspected)'
    ]
},

// ── 4. Degenerative Myelopathy (DM) — Advanced (L4-S3 Stage) ───────────
{ id: 'l4s3-dm', name: 'Degenerative Myelopathy (DM) — Advanced (L4-S3 Stage)', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnPelvic = (s.patellarReflexR === 'decreased' || s.patellarReflexR === 'absent' ||
                         s.patellarReflexL === 'decreased' || s.patellarReflexL === 'absent' ||
                         s.extensorTonePelvicR === 'decreased' || s.extensorTonePelvicL === 'decreased');
        var withdrawalDec = (s.withdrawalPelvicR === 'decreased' || s.withdrawalPelvicR === 'absent' ||
                             s.withdrawalPelvicL === 'decreased' || s.withdrawalPelvicL === 'absent');
        var perinealDec = (s.perinealReflexR === 'decreased' || s.perinealReflexR === 'absent' ||
                           s.perinealReflexL === 'decreased' || s.perinealReflexL === 'absent');

        // [A] Signalment — older dogs, DM-predisposed breeds
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if (age >= 8)      A = 50;
        else if (age >= 5) A = 30;
        else               A = 0;
        if (isBreed(s, predispositions.dm)) A = Math.min(50, A + 10);
        else if (isBreed(s, predispositions.large)) A = Math.min(50, A + 5);

        // [B] Temporal — chronic progressive; no acute episodes
        var B = 0;
        if      (oc === 'chronic')  B = 50;
        else if (oc === 'subacute') B = 15;
        else                        B = 0;
        if (s.progression === 'worsening') B = Math.min(50, B + 15);

        // [C] Pain — strictly absent; any at-site pain strongly against DM
        var C = pl === 'none' ? 50 : (pl === 'elsewhere' ? 25 : 0);

        // [D] Deficit — Stage 3 DM: LMN signs as disease advances caudally
        // Loss of patellar reflex, fecal/urinary incontinence are Stage 3 hallmarks
        var D = 0;
        var isParaPara = hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia');
        if (isParaPara) {
            D = 20;
            if (lmnPelvic)   D += 15; // patella loss = advanced DM stage
            if (withdrawalDec) D += 10;
            if (perinealDec) D += 5;  // Stage 3+ DM
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L4-S3') + 15;
        var mult = 1;
        if (pl === 'at-site' && hasAnyPain(s) && !hasPainLevel(s, 'mild')) {
            mult *= 0.2; flags.push('Pain at lesion site — strongly against DM (×0.2)');
        }
        if (oc === 'peracute') { mult *= 0.05; flags.push('Peracute onset excludes DM (×0.05)'); }
        if (oc === 'acute')    { mult *= 0.2;  flags.push('Acute onset unlikely for DM (×0.2)'); }
        if (age < 5)           { mult *= 0.05; flags.push('Age <5 years essentially excludes DM (×0.05)'); }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI lumbar spine + T3-L3 (must be normal — DM is diagnosis by exclusion)',
        'SOD1 genetic test (GSD, Corgi, Boxer, Pembroke WC — homozygous mutation)',
        'EMG/nerve conduction velocity (late-stage: LMN denervation changes)',
        'CBC/biochemistry (to exclude metabolic causes)'
    ]
},

// ── 5. Spinal Tumor — Lumbar ───────────────────────────────────────────
{ id: 'l4s3-tumor', name: 'Spinal Tumor — Lumbar', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnPelvic = (s.patellarReflexR === 'decreased' || s.patellarReflexR === 'absent' ||
                         s.patellarReflexL === 'decreased' || s.patellarReflexL === 'absent' ||
                         s.extensorTonePelvicR === 'decreased' || s.extensorTonePelvicL === 'decreased');
        var withdrawalDec = (s.withdrawalPelvicR === 'decreased' || s.withdrawalPelvicR === 'absent' ||
                             s.withdrawalPelvicL === 'decreased' || s.withdrawalPelvicL === 'absent');

        // [A] Signalment — middle-aged to older; any breed
        // Exception: nephroblastoma/embryonal tumors can occur in young dogs
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age >= 7)       A = 50;
        else if (age >= 4)       A = 35;
        else if (age >= 2)       A = 20;
        else                     A = 10; // rare but possible
        if (isBreed(s, predispositions.large)) A = Math.min(50, A + 5);

        // [B] Temporal — chronic progressive; acute decompensation episodes possible
        var B = 0;
        if      (oc === 'chronic')  B = 40;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15;
        else                        B = 5; // peracute possible with hemorrhage into tumor
        if (s.progression === 'worsening') B = Math.min(50, B + 15);

        // [C] Pain — often present; nerve root involvement → severe pain
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 10;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 35;
            else if (hasPainLevel(s, 'mild'))     C = 20;
        }

        // [D] Deficit — often asymmetric; LMN if nerve root / cauda equina involvement
        var D = 0;
        var isParaPara = hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia');
        if (isParaPara) {
            D = 20;
            if (lmnPelvic)     D += 15;
            if (withdrawalDec) D += 10;
            if (s.asymmetry)   D += 5;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L4-S3') + 10;
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
        'MRI lumbar spine with contrast (mass characterization; intradural vs extradural vs intramedullary)',
        'CT thorax + abdomen (staging: primary tumor search, metastases)',
        'CBC/biochemistry (systemic effects, hypercalcemia)',
        'CSF analysis with cytology (neoplastic cells; elevated protein)',
        'Biopsy / histopathology (definitive diagnosis)'
    ]
},

// ── 6. Fracture/Luxation — Lumbar ──────────────────────────────────────
{ id: 'l4s3-fracture', name: 'Fracture/Luxation — Lumbar', category: 'Vascular/Traumatic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnPelvic = (s.patellarReflexR === 'decreased' || s.patellarReflexR === 'absent' ||
                         s.patellarReflexL === 'decreased' || s.patellarReflexL === 'absent' ||
                         s.extensorTonePelvicR === 'decreased' || s.extensorTonePelvicL === 'decreased');

        // [A] Signalment — age-neutral; trauma history is the key variable
        var A = s.traumaHistory === 'yes' ? 50 : 25;

        // [B] Temporal — peracute/acute following trauma
        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 30;
        else if (oc === 'subacute') B = 10;
        else                        B = 0;

        // [C] Pain — severe pain typical
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 0;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 30;
            else if (hasPainLevel(s, 'mild'))     C = 15;
        }

        // [D] Deficit — rapid severe deficits expected; LMN at L4-S3
        var D = 0;
        var isParaPara = hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia');
        if (isParaPara) {
            D = 30;
            if (lmnPelvic) D += 15;
            if (s.deepPain === 'absent') D += 5;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L4-S3') + 10;
        var mult = 1;
        if (s.traumaHistory === 'yes') {
            mult *= 2.0; flags.push('Confirmed trauma history — fracture/luxation strongly suspected (×2.0)');
        } else if (oc === 'peracute') {
            mult *= 1.5; flags.push('Peracute onset — consider occult trauma (×1.5)');
        }
        if (oc === 'chronic') { mult *= 0.1; flags.push('Chronic onset inconsistent with fracture/luxation (×0.1)'); }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Radiographs (fracture, luxation, subluxation — FIRST and fastest)',
        'CT (fracture characterization, surgical planning — gold standard)',
        'MRI (cord damage, contusion assessment)',
        'HANDLE WITH EXTREME CARE — immobilize spine before any further movement',
        'Full trauma workup: thoracic/abdominal radiographs (pneumothorax, hemoabdomen)',
        'Deep pain assessment — critical prognostic factor for recovery'
    ]
},

// ── 7. Discospondylitis — Lumbar ───────────────────────────────────────
{ id: 'l4s3-discospondylitis', name: 'Discospondylitis — Lumbar', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnPelvic = (s.patellarReflexR === 'decreased' || s.patellarReflexR === 'absent' ||
                         s.patellarReflexL === 'decreased' || s.patellarReflexL === 'absent' ||
                         s.extensorTonePelvicR === 'decreased' || s.extensorTonePelvicL === 'decreased');

        // [A] Signalment — middle-aged large breeds; intact/recently bred males
        var age = parseFloat(s.age) || 0;
        var A = 30;
        if (age >= 4 && age <= 10) A = 40;
        if (isBreed(s, predispositions.large)) A = Math.min(50, A + 10);

        // [B] Temporal — subacute/chronic, often progressive
        var B = 0;
        if      (oc === 'subacute') B = 30;
        else if (oc === 'chronic')  B = 25;
        else if (oc === 'acute')    B = 15;
        else                        B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 20);
        else                               B = Math.min(50, B + 5);

        // [C] Pain — hallmark: severe focal pain, worse on deep palpation
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 0;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 40;
            else if (hasPainLevel(s, 'mild'))     C = 25;
        }

        // [D] Deficit — ambulatory paraparesis most common; LMN if L4-S3 level affected
        var D = 0;
        if (hasValue(s, 'gait', 'paraparesis') && s.ambulation === 'ambulatory') {
            D = 35;
            if (lmnPelvic) D += 10;
        } else if (hasValue(s, 'gait', 'paraparesis')) {
            D = 25;
            if (lmnPelvic) D += 10;
        } else if (hasValue(s, 'gait', 'paraplegia')) {
            D = 15;
        } else {
            D = 35; // pain-dominant, no paresis yet — common early presentation
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L4-S3') + systemicScore(s) + 10;
        var mult = 1;
        if (pl === 'none') { mult *= 0.05; flags.push('Painless presentation — near-excludes discospondylitis (×0.05)'); }

        alerts.push({
            type: 'WARNING',
            title: 'Brucella canis — Mandatory Screening (Zoonotic)',
            text: 'Brucella canis MUST be ruled out before starting any treatment, especially if the patient is intact or recently bred. Zoonotic risk to owners and clinic staff. Use ELISA/AGID/PCR serology.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Radiographs (endplate lysis, disc space collapse — first test, often diagnostic)',
        'MRI (early lesions, epidural empyema/abscess, cord compression — superior sensitivity)',
        'CBC/biochemistry (leukocytosis, elevated acute-phase proteins)',
        'Blood cultures (3 sets, aerobic + anaerobic)',
        'Brucella canis serology — MANDATORY before treatment (ELISA, AGID, PCR)',
        'Urine culture (ascending infection common)',
        'Consider echocardiography (infective endocarditis as primary source)'
    ]
},

// ── 8. Arachnoid Diverticulum — Lumbar ─────────────────────────────────
{ id: 'l4s3-arachnoid', name: 'Arachnoid Diverticulum — Lumbar', category: 'Developmental/Structural',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnPelvic = (s.patellarReflexR === 'decreased' || s.patellarReflexR === 'absent' ||
                         s.patellarReflexL === 'decreased' || s.patellarReflexL === 'absent' ||
                         s.extensorTonePelvicR === 'decreased' || s.extensorTonePelvicL === 'decreased');

        // [A] Signalment — young to middle-aged large breeds; GSD predisposed
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age >= 1 && age <= 5)    A = 50;
        else if (age < 1)                 A = 30;
        else if (age > 5 && age <= 8)     A = 25;
        else                              A = 15;
        if (isBreed(s, predispositions.large)) A = Math.min(50, A + 10);

        // [B] Temporal — chronic progressive; episodes of acute worsening possible
        var B = 0;
        if      (oc === 'chronic')  B = 45;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15;
        else                        B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — variable; often mild or absent
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 35;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 20;
            else if (hasPainLevel(s, 'moderate')) C = 30;
            else if (hasPainLevel(s, 'mild'))     C = 40;
        }

        // [D] Deficit — LMN signs if lumbar level arachnoid diverticulum
        var D = 0;
        var isParaPara = hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia');
        if (isParaPara) {
            D = 25;
            if (lmnPelvic) D += 20;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L4-S3') + 5;
        var mult = 1;
        if (oc === 'peracute') { mult *= 0.2; flags.push('Peracute onset — atypical for arachnoid diverticulum (×0.2)'); }
        if (s.onset === 'acute') { mult *= 0.3; flags.push('Acute onset — SAD is a chronic developmental condition; acute isolated pain is atypical (×0.3)'); }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI lumbar spine (fluid-filled cyst dorsal to cord, CSF signal intensity)',
        'MRI myelogram sequences (CISS / FIESTA — best for arachnoid cysts)',
        'CT myelogram (cyst fills with contrast on delayed images)',
        'CSF analysis (usually normal)',
        'Surgical fenestration (definitive for progressive cases)'
    ]
},

// ── 9. Neospora caninum / Toxoplasma gondii — Ascending LMN ────────────
{ id: 'l4s3-neospora', name: 'Neospora caninum / Toxoplasma gondii — Ascending LMN Neuromyelitis', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnPelvic = (s.patellarReflexR === 'decreased' || s.patellarReflexR === 'absent' ||
                         s.patellarReflexL === 'decreased' || s.patellarReflexL === 'absent' ||
                         s.extensorTonePelvicR === 'decreased' || s.extensorTonePelvicL === 'decreased');
        var withdrawalDec = (s.withdrawalPelvicR === 'decreased' || s.withdrawalPelvicR === 'absent' ||
                             s.withdrawalPelvicL === 'decreased' || s.withdrawalPelvicL === 'absent');
        // Rigid hyperextension of pelvic limbs — pathognomonic for Neospora
        var hyperextension = s.bodyPosture === 'decerebrate rigidity';

        // [A] Signalment — primarily young dogs; <6 months most severe
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age < 0.5)              A = 50; // <6 months — highest risk
        else if (age >= 0.5 && age < 2)  A = 45;
        else if (age >= 2  && age < 4)   A = 25;
        else                             A = 10; // older dogs: rare
        if (s.species === 'dog') A = Math.min(50, A + 5); // Neospora: dogs are primary host

        // [B] Temporal — chronic progressive over weeks to months
        var B = 0;
        if      (oc === 'chronic')  B = 45;
        else if (oc === 'subacute') B = 35;
        else if (oc === 'acute')    B = 15;
        else                        B = 0;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — often present (myositis, nerve root inflammation)
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 15;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 40;
            else if (hasPainLevel(s, 'moderate')) C = 35;
            else if (hasPainLevel(s, 'mild'))     C = 25;
        }

        // [D] Deficit — KEY: rigid hyperextension (muscle contracture despite LMN)
        // Paradoxical: LMN paresis + muscle fibrosis → stiff extended limbs, not flaccid
        var D = 0;
        if (hyperextension) {
            D = 50; // near-pathognomonic if young dog
            flags.push('Rigid pelvic limb hyperextension — highly characteristic of Neospora/Toxoplasma');
        } else {
            var isParaPara = hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia');
            if (isParaPara) {
                D = 15;
                if (lmnPelvic)     D += 10;
                if (withdrawalDec) D += 10;
            }
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L4-S3') + 10;
        var mult = 1;
        if (age > 5 && !hyperextension) {
            mult *= 0.3; flags.push('Older dog without rigid hyperextension — Neospora less likely (×0.3)');
        }
        if (oc === 'peracute') { mult *= 0.1; flags.push('Peracute onset not typical for Neospora/Toxoplasma (×0.1)'); }
        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Serology: Neospora caninum IgG/IgM (IFAT — gold standard; titer >1:200 significant)',
        'Serology: Toxoplasma gondii IgG/IgM (IFAT)',
        'PCR: blood + CSF for Neospora caninum / Toxoplasma gondii DNA',
        'CSF analysis (pleocytosis, elevated protein; send PCR)',
        'MRI spine + brain (multifocal lesions; myositis — T2 hyperintensity in muscles)',
        'Muscle biopsy: semitendinosus/sartorius (bradyzoites/tachyzoites)',
        'Treatment: clindamycin ± trimethoprim-sulfa — START IMMEDIATELY if high suspicion; muscle contracture is irreversible once established'
    ]
},

// ── 10. Meningomyelitis / Myelitis — Lumbar ────────────────────────────
{ id: 'l4s3-meningo', name: 'Meningomyelitis / Myelitis — Lumbar', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnPelvic = (s.patellarReflexR === 'decreased' || s.patellarReflexR === 'absent' ||
                         s.patellarReflexL === 'decreased' || s.patellarReflexL === 'absent' ||
                         s.extensorTonePelvicR === 'decreased' || s.extensorTonePelvicL === 'decreased');
        var withdrawalDec = (s.withdrawalPelvicR === 'decreased' || s.withdrawalPelvicR === 'absent' ||
                             s.withdrawalPelvicL === 'decreased' || s.withdrawalPelvicL === 'absent');

        // [A] Signalment — no strong breed predisposition; any age
        var age = parseFloat(s.age) || 0;
        var A = 25;
        if (age >= 1 && age <= 8) A = 30;
        else if (age < 1) A = 15;

        // [B] Temporal — subacute progression (days to weeks) is hallmark
        var B = 0;
        if      (oc === 'subacute') B = 50;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'chronic')  B = 20;
        else                        B = 10;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — variable; lumbar pain common; fever adds to suspicion
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

        // [D] Deficit — LMN paraparesis (L4-S3 level); asymmetry strongly supports myelitis
        var D = 0;
        var isParaPara = hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia');
        if (isParaPara) {
            D = 25;
            if (lmnPelvic)     D += 15; // LMN confirms L4-S3 level
            if (withdrawalDec) D += 10;
            if (s.asymmetry)   D += 15; // asymmetric pattern strongly supports myelitis
        } else if (hasValue(s, 'gait', 'ataxia')) {
            D = 20;
            if (s.asymmetry) D += 10;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L4-S3') + systemicScore(s) + 10;
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
        'MRI lumbar spine with contrast (intramedullary T2 hyperintensity, leptomeningeal enhancement)',
        'CSF analysis — ESSENTIAL: inflammatory cells (neutrophilic, eosinophilic, or lymphocytic pleocytosis)',
        'CSF culture + sensitivity (bacterial myelitis)',
        'Infectious disease panel: Toxoplasma, Neospora, Cryptococcus, Distemper, tick-borne diseases',
        'CBC/biochemistry (leukocytosis, elevated CRP in bacterial/protozoal cases)'
    ]
},

// ── 11. Tick-Borne Myelitis — Lumbar ───────────────────────────────────
{ id: 'l4s3-tickborne', name: 'Tick-Borne Myelitis (Ehrlichia canis / Rickettsia rickettsii) — Lumbar', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var lmnPelvic = (s.patellarReflexR === 'decreased' || s.patellarReflexR === 'absent' ||
                         s.patellarReflexL === 'decreased' || s.patellarReflexL === 'absent' ||
                         s.extensorTonePelvicR === 'decreased' || s.extensorTonePelvicL === 'decreased');

        // [A] — any age, any breed; tick exposure key
        var A = 25;

        // [B] — peracute/acute (Rickettsia hallmark); acute to subacute (Ehrlichia)
        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 45;
        else if (oc === 'subacute')                   B = 30;
        else if (oc === 'chronic')                    B = 8;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — lumbar pain with myelitis/meningeal involvement
        var C = 0;
        if      (pl === 'elsewhere') C = 15;
        else if (pl === 'none')      C = 15;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 45;
            else if (hasPainLevel(s, 'moderate')) C = 35;
            else if (hasPainLevel(s, 'mild'))     C = 20;
        }

        // [D] Deficit — LMN paraparesis at L4-S3 level
        var D = 0;
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia')) {
            D = 30;
            if (lmnPelvic) D += 10;
        } else if (!s.gait || hasValue(s, 'gait', 'normal')) D = 20;

        // Systemic signs — fever MANDATORY for both agents
        var sysBonus = 0;
        if (s.fever === 'yes')      { sysBonus += 30; flags.push('Fever — MAJOR sign for both Ehrlichia and Rickettsia; tick-borne myelitis elevated'); }
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

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'L4-S3') + sysBonus + 10;
        var mult = 1;
        if (s.fever !== 'yes') { mult *= 0.2; flags.push('No fever — both Ehrlichia and Rickettsia are always febrile; afebrile presentation near-excludes tick-borne disease (×0.2)'); }
        if (s.fever === 'yes' && (oc === 'peracute' || oc === 'acute')) {
            mult *= 1.4; flags.push('Fever + acute/peracute onset — tick-borne myelitis pattern (×1.4)');
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
        '⚠️ Start doxycycline 10 mg/kg PO q24h immediately — do NOT wait for results',
        'CBC — thrombocytopenia (<50,000/μL) hallmark of both; anaemia, leukopenia possible',
        'Ehrlichia canis IFAT (≥1:80) + PCR (blood)',
        'Rickettsia rickettsii PCR (blood — highest sensitivity in first 5 days) + IgG/IgM serology (paired titres)',
        'Coagulation panel (DIC risk — Rickettsia)',
        'MRI lumbar spine with contrast',
        'CSF analysis (pleocytosis)',
        'Start doxycycline 10 mg/kg PO q24h × minimum 4 weeks'
    ]
}

];

// T3-L3 diagnoses — rewritten from DDX-main/src/regions/T3-L3.js in our style.
// Uses OUR parameter names directly (no normalise adapter).
// Diagnosis-only params (fever, vaccinated, cough, petechiae, ...) live in
// apps/Localisation/diagnoses/diagnosesParameters.json and are merged into the
// Parameters model at init — Parameters app renders them as extra categories.

app.diagnoses = app.diagnoses || {};
app.diagnoses['T3-L3'] = [

// ── 1. Hansen Type I (Acute IVDD) ──────────────────────────────────────
{ id: 't3l3-ivdd1', name: 'Hansen Type I IVDD (Acute)', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A] Signalment
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age >= 3 && age <= 8) A = 50;
        else if ((age >= 2 && age < 3) || (age > 8 && age <= 10)) A = 30;
        else A = 10;
        if (!isBreed(s, predispositions.chondro)) A = Math.round(A * 0.5);

        // [B] Temporal
        var B = 0;
        if      (oc === 'peracute') B = 25;
        else if (oc === 'acute')    B = 25;
        else if (oc === 'subacute') B = 15;
        else                        B = 0;
        // Progression
        if (s.progression === 'stable' || s.progression === 'improving') B += 15;
        else if (s.progression === 'worsening') B += 5;

        // [C] Pain — location rule
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 0;
        else { // at-site
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 30;
            else if (hasPainLevel(s, 'mild'))     C = 15;
            else C = 0;
        }

        // [D] Deficit pattern
        var D = 0;
        var isParaParaplegia = hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia');
        if (isParaParaplegia) {
            D = 40;
            if (s.asymmetry && s.asymmetry !== 'L worst then R' && s.asymmetry !== 'R worse then L') {
                // symmetric
            } else if (s.asymmetry) {
                D += 10;
            }
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'T3-L3') + 20;

        // Flags (multipliers)
        var mult = 1;
        // FLAG 1: chronic >2 weeks → ×0.05
        if (oc === 'chronic' || (parseFloat(s.duration) || 0) > 14) {
            mult *= 0.05;
            flags.push('Chronic onset — essentially excludes Type I (×0.05)');
        }
        // FLAG 2: non-chondrodystrophic large breed + no trauma → ×0.5
        if (!isBreed(s, predispositions.chondro) && isBreed(s, predispositions.large) && s.traumaHistory !== 'yes') {
            mult *= 0.5;
            flags.push('Non-chondrodystrophic large breed without trauma (×0.5)');
        }
        // FLAG 3: pain resolved within 24-48h → ×0.3
        if (s.painProgression === 'disappeared within 24/48 h') {
            mult *= 0.3;
            flags.push('Pain resolved 24–48 h — favours FCEM/ANNPE over Type I (×0.3)');
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI spine (gold standard — extradural compression confirms)',
        'CT myelogram (if MRI unavailable)',
        'CBC/biochemistry/urinalysis',
        'Neurological grade (deep pain status is critical prognostic factor)'
    ]
},

// ── 2. Hansen Type II IVDD (Chronic) ───────────────────────────────────
{ id: 't3l3-ivdd2', name: 'Hansen Type II IVDD (Chronic)', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A]
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age > 7)           A = 50;
        else if (age >= 5)          A = 30;
        else                        A = 10;
        if (isBreed(s, predispositions.chondro) || isBreed(s, predispositions.large)) { /* full score */ }
        else A = Math.round(A * 0.8);

        // [B]
        var B = 0;
        if (oc === 'chronic') { B = 25; }
        else if (oc === 'subacute') { B = 15; }
        else { B = 0; }
        if (s.progression === 'worsening') B += 25;
        else if (s.progression === 'stable') B += 15;

        // [C] — pain-location rule; Type II is low-pain, so painless is best
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 50;
        else { // at-site
            if      (hasPainLevel(s, 'mild'))     C = 30;
            else if (hasPainLevel(s, 'moderate')) C = 15;
            else if (hasPainLevel(s, 'severe'))   C = 0;
            else C = 50;
        }

        // [D]
        var D = 0;
        var isAmb = s.ambulation === 'ambulatory';
        if      (hasValue(s, 'gait', 'paraparesis') && isAmb)  D = 50;
        else if (hasValue(s, 'gait', 'paraparesis') && !isAmb) D = 20;
        else if (hasValue(s, 'gait', 'tetraparesis') && isAmb) D = 40;
        else if (hasValue(s, 'gait', 'tetraparesis') && !isAmb) D = 15;
        else if (hasValue(s, 'gait', 'paraplegia') || hasValue(s, 'gait', 'tetraplegia')) D = 15;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'T3-L3') + 20;

        var mult = 1;
        if (s.ambulation === 'non ambulatory' && (hasValue(s, 'gait', 'paraplegia') || hasValue(s, 'gait', 'tetraplegia'))) {
            mult *= 0.5;
            flags.push('Non-ambulatory severe deficits rare in Type II — consider tumor (×0.5)');
        }
        if (oc === 'peracute' || oc === 'acute') {
            mult *= 0.3;
            flags.push('Acute onset uncommon for Type II (×0.3)');
        }
        if (pl === 'at-site' && hasPainLevel(s, 'severe')) {
            mult *= 0.4;
            flags.push('Severe pain at lesion site — consider tumor or discospondylitis (×0.4)');
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI spine (diffuse disc protrusion with cord compression)',
        'CT myelogram',
        'CBC/biochemistry'
    ]
},

// ── 3. Peracute Non-Compressive Myelopathy (FCEM/ANNPE/IIVDE) ──────────
{ id: 't3l3-fcem-annpe', name: 'Peracute Non-Compressive Myelopathy (FCEM/ANNPE/IIVDE)', category: 'Vascular/Traumatic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A]
        var age = parseFloat(s.age) || 0;
        var A = 0;
        A = age >= 1 ? 40 : 20;
        if (isBreed(s, predispositions.fcem) || s.breed === 'Miniature Schnauzer') A += 10;

        // [B]
        var B = 0;
        if      (oc === 'peracute')  B = 30;
        else if (oc === 'acute')     B = 15;
        else                         B = 0;
        if      (s.progression === 'stable' || s.progression === 'improving') B += 20;
        else if (s.progression === 'worsening') B += 0;

        // [C] — distinct pain pattern scoring for FCEM/ANNPE
        var C = 0;
        if (pl === 'elsewhere') {
            C = 25;
        } else if (pl === 'none') {
            C = 40; // painless = classic FCEM
        } else { // at-site
            // Yelp at onset then painless = most specific
            if (s.painProgression === 'disappeared within 24/48 h') C = 50;
            else if (hasPainLevel(s, 'mild'))     C = 30;
            else if (hasPainLevel(s, 'moderate')) C = 5;
            else if (hasPainLevel(s, 'severe'))   C = 0;
            else C = 40;
        }

        // [D]
        var D = 0;
        var asym = s.asymmetry === 'L worst then R' || s.asymmetry === 'R worse then L';
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia')) {
            D = asym ? 50 : 30;
        }
        // Asymmetric cutaneous trunci reflex adds support
        var ctR = s.cutaneusTrunciLevelR, ctL = s.cutaneusTrunciLevelL;
        if (ctR && ctL && ctR !== 'normal' && ctL !== 'normal' && ctR !== ctL) D = Math.min(50, D + 10);

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'T3-L3') + 15;

        var mult = 1;
        if (oc === 'chronic') {
            mult *= 0.05;
            flags.push('Chronic onset essentially excludes FCEM/ANNPE (×0.05)');
        }
        if (s.progression === 'worsening' && (parseFloat(s.duration) || 0) > 2) {
            mult *= 0.2;
            flags.push('Progressive after 48 h — FCEM/ANNPE should be non-progressive (×0.2)');
        }
        if (pl === 'at-site' && hasPainLevel(s, 'severe') && s.painProgression !== 'disappeared within 24/48 h') {
            mult *= 0.2;
            flags.push('Severe persistent pain at lesion site argues against FCEM/ANNPE (×0.2)');
        }
        if (s.traumaHistory === 'yes' || s.onset === 'peracute') {
            // Vigorous exercise / acute onset = supporting flag
            mult *= 1.5;
            flags.push('Acute onset during activity/exercise — strong FCEM/ANNPE pattern (×1.5)');
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI spine (distinguishes FCEM vs ANNPE vs IIVDE — high-field preferred)',
        'FCEM: normal disc spaces, T2 lesion >1 vertebral body',
        'ANNPE: narrowed disc space, short T2 lesion <1 vertebral body over disc',
        'IIVDE: linear tract from disc into cord parenchyma (rare, 0.5%)',
        'CBC/biochemistry/urinalysis',
        'Thoracic radiographs'
    ]
},

// ── 4. Degenerative Myelopathy (DM) ────────────────────────────────────
{ id: 't3l3-dm', name: 'Degenerative Myelopathy (DM)', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A]
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age >= 8)          A = 50;
        else if (age >= 5)          A = 30;
        else                        A = 0;
        if (isBreed(s, predispositions.dm))   A += 10;
        else if (isBreed(s, predispositions.large))  A += 5;

        // [B]
        var B = 0;
        if (oc === 'chronic') B = 25;
        else if (oc === 'subacute') B = 10;
        else B = 0;
        if (s.progression === 'worsening') B += 25;
        else if (s.progression === 'stable') B += 0;

        // [C] — DM is STRICTLY painless; pain at lesion site = significant negative
        var C = 0;
        if      (pl === 'none')      C = 50;
        else if (pl === 'elsewhere') C = 25; // incidental pain in older dogs — neutral
        else { // at-site
            if      (!hasAnyPain(s) || hasPainLevel(s, 'mild')) C = 10;
            else C = 0; // moderate/severe at lesion site = near-exclusion (flag fires)
        }

        // [D] — DM stages matter
        var D = 0;
        var isAmb = s.ambulation === 'ambulatory';
        // Stage 1: ambulatory UMN paraparesis, intact/hyperreflexic reflexes
        if (hasValue(s, 'gait', 'paraparesis') && isAmb) D = 50;
        // Stage 2: non-ambulatory, but with DM history
        else if (hasValue(s, 'gait', 'paraparesis') && !isAmb) D = 50;
        else if (hasValue(s, 'gait', 'paraplegia')) D = 50;
        // Stage 3: thoracic limb involvement preceded by pelvic signs
        else if (hasValue(s, 'gait', 'tetraparesis')) D = 10; // without confirmed DM history
        else D = 0;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'T3-L3') + 15;

        var mult = 1;
        if (pl === 'at-site' && hasAnyPain(s) && !hasPainLevel(s, 'mild')) {
            mult *= 0.05;
            flags.push('Moderate/severe pain at T3-L3 — ESSENTIALLY EXCLUDES DM (×0.05)');
        }
        if (oc === 'peracute') {
            mult *= 0.05;
            flags.push('Peracute onset essentially excludes DM (×0.05)');
        }
        if (age < 5) {
            mult *= 0.05;
            flags.push('Age <5 years essentially excludes DM (×0.05)');
        }
        if (age >= 5 && age < 8 && !isBreed(s, predispositions.dm)) {
            mult *= 0.4;
            flags.push('Age 5–8y, non-DM breed — DM uncommon before 8y outside predisposed breeds (×0.4)');
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI spine (MUST be normal — DM is a diagnosis of exclusion)',
        'SOD1 genetic mutation test (confirms susceptibility — not diagnosis)',
        'CBC/biochemistry (rule out metabolic disease)',
        'CSF analysis (if inflammatory disease possible)',
        'EMG (denervation potentials in late-stage DM)'
    ]
},

// ── 5. Spinal Tumor ────────────────────────────────────────────────────
{ id: 't3l3-tumor', name: 'Spinal Tumor (Primary/Meningioma/Nerve Sheath)', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A] — no strong breed predisposition
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age >= 5)  A = 50;
        else if (age >= 2)  A = 25;
        else                A = 10;
        // No breed bonus — no strong predisposition at T3-L3

        // [B] — do NOT heavily penalize acute onset (threshold effect on chronic disease)
        var B = 0;
        if      (oc === 'chronic')   B = 25;
        else if (oc === 'subacute')  B = 20;
        else                         B = 15; // acute/peracute still possible
        if      (s.progression === 'worsening') B += 25;
        else if (s.progression === 'stable')    B += 5;

        // [C] — moderate pain most typical
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 15; // painless tumors occur
        else { // at-site
            if      (hasPainLevel(s, 'moderate')) C = 50;
            else if (hasPainLevel(s, 'mild'))     C = 35;
            else if (hasPainLevel(s, 'severe'))   C = 30;
            else C = 50;
        }

        // [D]
        var D = 0;
        var isAmb = s.ambulation === 'ambulatory';
        var paraOrPlegia = hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia');
        if (paraOrPlegia && !isAmb && s.progression === 'worsening') D = 50;
        else if (paraOrPlegia && isAmb) D = 35;
        else if (s.progression !== 'worsening') D = 15;
        else D = 20;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'T3-L3') + 10;

        var mult = 1;
        if (age < 2 && breedKnown(s) && !isBreed(s, predispositions.large)) {
            mult *= 0.1; flags.push('Age <2y small breed — spinal neoplasia very unlikely (×0.1)');
        } else if (age < 2) {
            mult *= 0.3; flags.push('Age <2y — spinal neoplasia uncommon in young dogs (×0.3)');
        } else if (age < 4 && breedKnown(s) && !isBreed(s, predispositions.large)) {
            mult *= 0.3; flags.push('Age <4y small/medium breed — spinal neoplasia uncommon (×0.3)');
        }
        if (oc === 'peracute' && (s.progression === 'stable' || s.progression === 'improving')) {
            mult *= 0.2;
            flags.push('Genuine peracute non-progressive onset argues against tumor — favours vascular (×0.2)');
        }
        if (!isAmb && hasValue(s, 'gait', 'paraplegia') && oc === 'chronic' && s.progression === 'worsening') {
            mult *= 1.5;
            flags.push('Non-ambulatory chronic progressive — tumor more likely than Type II IVDD (×1.5)');
        }
        // T2-T10 regional note
        var ctR = s.cutaneusTrunciLevelR;
        if (ctR && ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10'].includes(ctR)) {
            alerts.push({
                type: 'NOTE',
                title: 'T2–T10 Subregion',
                text: 'IVDD is uncommon between T2–T10 (intercapital ligament protection). Neoplasia and discospondylitis are more likely in this subregion. Adjust differential priorities accordingly.'
            });
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI spine with contrast (classify: extradural / intradural-extramedullary / intramedullary)',
        'CT spine',
        'Thoracic/abdominal imaging (metastasis screen)',
        'CBC/biochemistry',
        'Biopsy/histopathology (definitive)'
    ]
},

// ── 6. Fracture / Luxation ─────────────────────────────────────────────
{ id: 't3l3-fracture', name: 'Fracture / Luxation — Thoracolumbar', category: 'Traumatic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A] — trauma is democratic, no predisposition
        var A = 30; // any age, any breed

        // [B]
        var B = 0;
        if (s.traumaHistory === 'yes' && (oc === 'peracute' || oc === 'acute')) B = 50;
        else if (oc === 'peracute' || oc === 'acute') B = 10;
        else B = 0;

        // [C] — pain persists after trauma (key differentiator from FCEM/ANNPE)
        var C = 0;
        if      (pl === 'elsewhere')    C = 25;
        else if (pl === 'none')         C = 5;
        else { // at-site
            if (hasPainLevel(s, 'severe'))    C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 35;
            else C = 20;
        }
        if (s.painProgression === 'disappeared within 24/48 h') C = 5; // pain resolution = against fracture

        // [D] — any pattern can occur after trauma
        var D = s.traumaHistory === 'yes' ? 50 : 20;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'T3-L3') + 10;

        var mult = 1;
        if (s.traumaHistory !== 'yes') {
            mult *= 0.2;
            flags.push('No trauma history — fracture/luxation without trauma uncommon (×0.2)');
        }
        if (s.painProgression === 'disappeared within 24/48 h') {
            mult *= 0.1;
            flags.push('Pain resolved in 24–48 h — near-excludes fracture, strongly favours FCEM/ANNPE (×0.1)');
        }
        if (s.traumaHistory === 'yes' && (oc === 'peracute' || oc === 'acute')) {
            mult *= 1.5;
            flags.push('Witnessed trauma + acute onset (×1.5)');
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CT spine (preferred for fracture/luxation)',
        'Radiographs (initial triage)',
        'MRI if neurological deficits exceed imaging findings',
        'Stabilisation before transfer if severe instability'
    ]
},

// ── 7. Discospondylitis ────────────────────────────────────────────────
{ id: 't3l3-disco', name: 'Discospondylitis (incl. Epidural Empyema)', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A] — any age, any breed
        var A = 30;

        // [B]
        var B = 0;
        if      (oc === 'subacute') B = 25; // typical
        else if (oc === 'acute')    B = 15;
        else if (oc === 'chronic')  B = 10;
        if      (s.progression === 'worsening') B += 25;
        else if (s.progression === 'stable')    B += 10;

        // [C] — pain is CARDINAL sign
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 0; // painless near-excludes
        else { // at-site
            if      (hasPainLevel(s, 'severe'))   C = 50;
            else if (hasPainLevel(s, 'moderate')) C = 40;
            else if (hasPainLevel(s, 'mild'))     C = 25;
            else C = 0;
        }

        // [D] — discospondylitis typically causes mild/no neuro deficits
        var D = 0;
        if      (!s.gait || hasValue(s, 'gait', 'normal'))                D = 40; // no deficits = typical
        else if (hasValue(s, 'gait', 'paraparesis') && s.ambulation === 'ambulatory') D = 50;
        else if (hasValue(s, 'gait', 'paraparesis') && s.ambulation !== 'ambulatory') D = 30;
        else if (hasValue(s, 'gait', 'paraplegia')) D = 20;

        // Systemic signs bonus (unique to infectious diseases)
        var sysBonus = systemicScore(s);
        if (s.reproductiveStatus === 'intact' && s.species === 'dog') sysBonus += 5;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'T3-L3') + sysBonus + 10;

        var mult = 1;
        if (pl === 'none') {
            mult *= 0.05;
            flags.push('Completely painless — near-excludes discospondylitis (pain is cardinal sign) (×0.05)');
        }
        if (oc === 'peracute' && s.progression === 'stable') {
            mult *= 0.3;
            flags.push('Peracute non-progressive pattern argues against discospondylitis (×0.3)');
        }

        // Brucella warning — always fires for discospondylitis
        alerts.push({
            type: 'WARNING',
            title: 'Brucella canis — Zoonotic Risk',
            text: 'Brucella canis must be ruled out in all discospondylitis cases. Perform rapid slide agglutination test or card test (especially if intact or recently bred). Brucellosis has zoonotic potential — inform owner and use appropriate biosafety measures. Do NOT start treatment until Brucella serology is available.'
        });

        // Spinal Epidural Empyema warning — fires if high score + fever + rapid deterioration
        var rawTotal = total * mult;
        if (rawTotal > 100 && s.fever === 'yes' && s.progression === 'worsening') {
            alerts.push({
                type: 'URGENT',
                title: 'Spinal Epidural Empyema Cannot Be Excluded',
                text: 'Classic triad: spinal hyperesthesia + fever + rapidly progressive paresis/plegia. Check CBC for peripheral neutrophilia. MRI urgently required — purulent epidural accumulation may extend over several vertebral lengths. Surgical drainage may be necessary. Note: radiographic evidence of discospondylitis may be absent early.'
            });
        }

        return { score: rawTotal, flags: flags, alerts: alerts };
    },
    workup: [
        'Radiographs (vertebral endplate lysis — may be absent early)',
        'MRI spine (gold standard)',
        'CT spine',
        'CBC/biochemistry/urinalysis',
        'Blood cultures × 3 (aerobic + anaerobic)',
        'Urine culture',
        'Brucella canis serology — MANDATORY before treatment (zoonotic)',
        'Echocardiography (rule out endocarditis)',
        'Fungal serology if non-responsive (Aspergillus, Paecilomyces)'
    ]
},

// ── 8. Arachnoid Diverticulum ──────────────────────────────────────────
{ id: 't3l3-arachnoid', name: 'Spinal Arachnoid Diverticulum', category: 'Anomalous/Congenital',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A]
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age >= 1 && age <= 4) A = 40;
        else if (age > 4 && age <= 8)  A = 30;
        else if (age < 1)              A = 20;
        else                           A = 15;
        if (isBreed(s, predispositions.screwTail) || s.breed === 'Rottweiler') { /* full age score */ }
        else A = Math.round(A * 0.8);

        // [B]
        var B = 0;
        if      (oc === 'chronic')   B = 25;
        else if (oc === 'subacute')  B = 15;
        else                         B = 5;
        if      (s.progression === 'worsening') B += 25;
        else if (s.progression === 'stable')    B += 10;

        // [C] — painless presentation strongly supports
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 50;
        else { // at-site (18.9% have pain)
            if      (hasPainLevel(s, 'mild'))                    C = 20;
            else if (hasPainLevel(s, 'moderate'))                C = 10;
            else if (hasPainLevel(s, 'severe'))                  C = 0;
            else                                                 C = 50;
        }

        // [D]
        var D = 0;
        var isAmb = s.ambulation === 'ambulatory';
        if      (hasValue(s, 'gait', 'paraparesis') && isAmb && s.progression === 'worsening') D = 50;
        else if (hasValue(s, 'gait', 'paraparesis') && !isAmb) D = 30;
        else if (hasValue(s, 'gait', 'paraplegia'))             D = 20;
        else if (hasValue(s, 'gait', 'ataxia'))                 D = 35; // ambulatory ataxia is typical early SAD presentation
        else                                                    D = 15;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'T3-L3') + 10;

        var mult = 1;
        if (pl === 'at-site' && hasPainLevel(s, 'severe')) {
            mult *= 0.2;
            flags.push('Severe pain at lesion — consider discospondylitis or tumor instead (×0.2)');
        }
        if (oc === 'peracute') {
            mult *= 0.2;
            flags.push('Peracute onset atypical for arachnoid diverticulum (×0.2)');
        }
        if (s.onset === 'acute') { mult *= 0.3; flags.push('Acute onset — SAD is a chronic developmental condition; acute isolated pain is atypical (×0.3)'); }
        if (isBreed(s, predispositions.screwTail) && age >= 1 && age <= 4 && pl === 'none' && s.progression === 'worsening') {
            mult *= 1.5;
            flags.push('Screw-tailed breed + young adult + painless + progressive — highly characteristic (×1.5)');
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI spine (dorsal teardrop CSF accumulation compressing cord)',
        'CT myelogram (if MRI unavailable)',
        'Exclude concurrent IVDD or vertebral malformations'
    ]
},

// ── 9. Tick-Borne Myelitis — Thoracolumbar ─────────────────────────────
{ id: 't3l3-tickborne', name: 'Tick-Borne Myelitis (Ehrlichia canis / Rickettsia rickettsii) — Thoracolumbar', category: 'Inflammatory/Infectious',
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

        // [C] Pain — thoracolumbar pain with myelitis/meningeal involvement
        var C = 0;
        if      (pl === 'elsewhere') C = 15;
        else if (pl === 'none')      C = 15;
        else {
            if      (hasPainLevel(s, 'severe'))   C = 45;
            else if (hasPainLevel(s, 'moderate')) C = 35;
            else if (hasPainLevel(s, 'mild'))     C = 20;
        }

        // [D] Deficit — UMN paraparesis typical at T3-L3
        var D = 0;
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia')) D = 35;
        else if (hasValue(s, 'gait', 'ataxia'))                                      D = 30;
        else if (!s.gait || hasValue(s, 'gait', 'normal'))                           D = 20;

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

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'T3-L3') + sysBonus + 10;
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
        'MRI thoracolumbar spine with contrast (meningeal enhancement, intramedullary lesion)',
        'CSF analysis (neutrophilic or mixed pleocytosis, elevated protein)',
        'Tick exposure history — Amblyomma cajennense = Rickettsia; Rhipicephalus sanguineus = Ehrlichia',
        'DO NOT administer corticosteroids — can be fatal in Rickettsia rickettsii'
    ]
},

// ── 10. Hemivertebra ───────────────────────────────────────────────────
{ id: 't3l3-hemi', name: 'Hemivertebra', category: 'Anomalous/Congenital',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A]
        var age = parseFloat(s.age) || 0;
        var A = 0;
        if      (age < 1)             A = 50;
        else if (age >= 1 && age <= 3) A = 30;
        else                           A = 10;
        if (isBreed(s, predispositions.screwTail)) { /* full score */ }
        else A = Math.round(A * 0.5);

        // [B]
        var B = 0;
        if (oc === 'chronic') B = 20;
        // Congenital = chronic onset from young age
        if (age < 1 && (oc === 'chronic' || oc === 'subacute')) B = 25;
        if      (s.progression === 'stable')    B += 25;
        else if (s.progression === 'worsening') B += 20;
        else                                    B += 5;

        // [C]
        var C = 0;
        if      (pl === 'elsewhere') C = 25;
        else if (pl === 'none')      C = 50;
        else { // at-site
            if      (hasPainLevel(s, 'mild'))               C = 20;
            else if (hasPainLevel(s, 'moderate') || hasPainLevel(s, 'severe')) C = 5;
            else C = 50;
        }

        // [D]
        var D = 0;
        if (hasValue(s, 'gait', 'paraparesis') && (s.progression === 'stable' || s.progression === 'worsening')) D = 50;
        else if (hasValue(s, 'gait', 'paraplegia')) D = 15;
        else D = 20;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'T3-L3') + 10;

        var mult = 1;
        if (age > 3 && (oc === 'peracute' || oc === 'acute')) {
            mult *= 0.1;
            flags.push('Age >3 years + acute onset — hemivertebra unlikely to be the cause (×0.1)');
        }
        if (isBreed(s, predispositions.screwTail) && age < 1 && (s.progression === 'stable' || s.progression === 'worsening') && pl === 'none') {
            mult *= 1.5;
            flags.push('Screw-tailed breed + <1 year + non-painful + progressive — highly characteristic (×1.5)');
        }
        if (s.progression === 'worsening' && s.ambulation === 'non ambulatory') {
            mult *= 0.3;
            flags.push('Rapidly progressive severe deficits — exclude IVDD, tumor (×0.3)');
            alerts.push({
                type: 'NOTE',
                title: 'Hemivertebra — Incidental Finding Risk',
                text: 'Hemivertebra is frequently incidental. Clinical significance must be established. Always exclude concurrent IVDD (common in predisposed breeds) and neoplasia before attributing severe deficits to hemivertebra.'
            });
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Radiographs (wedge-shaped/butterfly vertebrae — most common T8)',
        'MRI (cord compression assessment, concurrent disease)',
        'CT (vertebral anatomy detail)'
    ]
},

// ── 11. Meningomyelitis / Myelitis — Thoracolumbar ─────────────────────
{ id: 't3l3-meningo', name: 'Meningomyelitis / Myelitis — Thoracolumbar', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

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
        else                        B = 10; // peracute unusual
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — variable; mild-moderate thoracolumbar pain common
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

        // [D] Deficit — highly asymmetric paraparesis is characteristic
        var D = 0;
        var isParaPara = hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia');
        if (isParaPara) {
            D = 25;
            if (s.asymmetry) D += 20; // asymmetric pattern strongly supports meningomyelitis
        } else if (hasValue(s, 'gait', 'ataxia')) {
            D = 20;
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'T3-L3') + systemicScore(s) + 10;
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
        'MRI thoracolumbar spine with contrast (intramedullary T2 hyperintensity, leptomeningeal enhancement)',
        'CSF analysis — ESSENTIAL: inflammatory cells (neutrophilic, eosinophilic, or lymphocytic pleocytosis)',
        'CSF culture + sensitivity (bacterial meningomyelitis)',
        'Infectious disease panel: Toxoplasma, Neospora, Cryptococcus, Distemper, tick-borne diseases',
        'CBC/biochemistry (leukocytosis, elevated CRP in bacterial/protozoal cases)'
    ]
},

// ── 12. GME — Thoracolumbar ────────────────────────────────────────────
{ id: 't3l3-gme', name: 'GME — Thoracolumbar (Granulomatous Meningoencephalomyelitis)', category: 'Inflammatory',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — small/toy breeds, young adults
        var A = 0;
        var gmeBreeds = ['Maltese', 'Yorkshire Terrier', 'Toy Poodle', 'Miniature Poodle', 'Poodle',
            'Chihuahua', 'Dachshund', 'Pug', 'West Highland White Terrier', 'Boston Terrier'];
        if (isBreed(s, gmeBreeds))              { A += 20; flags.push('GME-predisposed breed'); }
        else if (isBreed(s, predispositions.toy)) A += 15;
        if      (age >= 2 && age <= 6) A += 25;
        else if (age > 6 && age <= 9)  A += 15;
        else                           A += 5;

        // [B] Temporal — subacute to chronic; can be acute
        var B = 0;
        if      (oc === 'subacute')  B = 45;
        else if (oc === 'chronic')   B = 35;
        else if (oc === 'acute')     B = 25;
        else /* peracute */          B = 10;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — thoracolumbar meningeal/spinal pain
        var C = 0;
        if      (pl === 'at-site')  C = 40;
        else if (pl === 'none')     C = 20;
        else                        C = 15;

        // [D] Deficit — paraparesis/paraplegia, UMN signs
        var D = 0;
        var parap = hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia');
        if (parap)                                         D = 35;
        else if (hasValue(s, 'gait', 'ataxia'))            D = 30;
        else if (!s.gait || hasValue(s, 'gait', 'normal')) D = 20;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'T3-L3') + systemicScore(s) + 10;
        var mult = 1;
        if (s.fever === 'yes' && pl === 'at-site') { mult *= 1.3; flags.push('Fever + spinal pain — meningomyelitis pattern (×1.3)'); }
        if (age > 10) { mult *= 0.5; flags.push('Age >10y — tumour more likely than GME (×0.5)'); }
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
        'MRI thoracolumbar spine + brain with contrast (multifocal enhancing lesions)',
        'CSF analysis (mononuclear pleocytosis, elevated protein)',
        'Infectious panel: Toxoplasma, Neospora, Cryptococcus, CDV, Ehrlichia, Rickettsia',
        'CSF PCR panel (Toxoplasma, Neospora, CDV)',
        'Definitive Dx: histopathology (biopsy or post-mortem)',
        'Treatment: prednisolone ± cytarabine or CCNU — referral recommended'
    ]
},

// ── 13. Rabies Encephalomyelitis — Paralytic/Dumb Form ─────────────────
{ id: 't3l3-rabies', name: 'Rabies Encephalomyelitis — Paralytic (Dumb) Form', category: 'Inflammatory/Infectious',
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

        // [C] Pain — not a prominent feature of paralytic rabies
        var C = 0;
        if      (pl === 'none')    C = 25;
        else if (pl === 'at-site') C = 15;
        else                       C = 10;

        // [D] Deficit — ascending LMN paralysis starting in pelvic limbs
        var D = 0;
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia')) { D += 25; flags.push('Pelvic limb paresis/paralysis — ascending paralytic rabies; often LMN at early stage'); }
        if (mentalDepressed(s))                                                       D += 15;
        if (s.swallowingFunction === 'dysphagia')                                     { D += 20; flags.push('Dysphagia — brainstem co-involvement; rabies hallmark'); }
        if (s.behavior === 'aggressive')                                              { D += 15; flags.push('Aggression — concurrent furious component'); }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + postureScore(s, 'T3-L3') + 10;
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

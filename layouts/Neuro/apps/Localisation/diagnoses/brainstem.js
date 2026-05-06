// Brainstem diagnoses — rewritten from DDX-main/src/regions/Brainstem.js in our style.
// Uses OUR parameter names directly (no normalise adapter).
// DDX has ONE Brainstem file but we have 4 brainstem locations (medulla-rostral,
// medulla-caudal, midbrain, pons) — per layout lead's decision, the same
// diagnoses pool applies to all 4.

app.diagnoses = app.diagnoses || {};

var _brainstemDx = [

// ── 1. GME — Brainstem ─────────────────────────────────────────────────
{ id: 'bs-gme', name: 'GME — Brainstem (Granulomatous Meningoencephalitis)', category: 'Inflammatory',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        var gmeBreeds = ['Maltese', 'Yorkshire Terrier', 'Toy Poodle', 'Miniature Poodle', 'Poodle',
            'Chihuahua', 'Dachshund', 'Beagle', 'Cocker Spaniel', 'Boston Terrier'];
        if (isBreed(s, gmeBreeds))     A += 20;
        else if (isBreed(s, predispositions.toy)) A += 15;
        if      (age >= 2 && age <= 7) A += 25;
        else if (age > 7)              A += 10;
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
        if (mentalDepressed(s))                                                        D += 25;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                                         D += 20;
        if (s.vomiting === 'yes')                                                      D += 15;
        if (centralVestibularSigns(s))                                                 D += 15;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 10;
        var mult = 1;
        if (s.fever === 'yes' && pl === 'at-site') { mult *= 1.3; flags.push('Fever + cervical pain — meningoencephalitis pattern (×1.3)'); }
        if (age > 10)                               { mult *= 0.6; flags.push('Age >10y — tumor more likely than GME (×0.6)'); }
        if (!mentalDepressed(s) && !(hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')) && s.vomiting !== 'yes' && !centralVestibularSigns(s) && !(hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) && s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.55; flags.push('No brainstem deficit + no systemic signs — GME unlikely as sole pain presentation (×0.55)');
        }
        if (oc === 'chronic' && s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.6; flags.push('Chronic onset + no systemic signs — inflammatory encephalitis less likely; consider structural/degenerative (×0.6)');
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain with contrast (brainstem/multifocal enhancing lesions)',
        'CSF analysis — mononuclear/mixed pleocytosis, elevated protein',
        'Infectious panel: Toxoplasma, Neospora, Cryptococcus, CDV, Ehrlichia',
        'CSF PCR panel',
        'Treatment: prednisolone ± cytarabine — referral recommended'
    ]
},

// ── 2. Brainstem Tumor ─────────────────────────────────────────────────
{ id: 'bs-tumor', name: 'Brainstem Tumor', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        if      (age >= 8) A += 30;
        else if (age >= 5) A += 20;
        else if (age >= 2) A += 5;
        else               { flags.push('Age <2y — brainstem tumor very unlikely'); }
        if (isBreed(s, predispositions.large)) A += 10;

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
        if (mentalDepressed(s))                                                        D += 20;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                                         D += 15;
        if (centralVestibularSigns(s))                                                 D += 15;
        if (s.vomiting === 'yes')                                                      D += 10;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (age < 3)           { mult *= 0.2; flags.push('Age <3y — brainstem tumor very unlikely (×0.2)'); }
        if (oc === 'peracute') { mult *= 0.4; flags.push('Peracute onset — stroke more likely than tumor (×0.4)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain with contrast (brainstem mass lesion)',
        'CSF analysis (cytology)',
        'Thoracic radiographs + abdominal ultrasound (staging)',
        'Neurology/oncology referral for radiation therapy',
        'Biopsy high-risk — RT often empirical'
    ]
},

// ── 3. Ischemic Stroke — Brainstem ─────────────────────────────────────
{ id: 'bs-stroke', name: 'Ischemic Stroke — Brainstem', category: 'Vascular',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        if      (age >= 7) A += 25;
        else if (age >= 5) A += 20;
        else if (age >= 3) A += 15;
        else               A += 5;
        if (isBreed(s, predispositions.large)) A += 10;
        if (isBreed(s, predispositions.fcem))  A += 5;

        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 25;
        else                        B = 5;

        var C = 0;
        if      (pl === 'none')    C = 30;
        else if (pl === 'at-site') C = 15;
        else                       C = 10;

        var D = 0;
        if (mentalDepressed(s))                    D += 20;
        if (centralVestibularSigns(s))             D += 20;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))     D += 15;
        if (s.asymmetry && s.asymmetry !== 'none') D += 15;
        if (s.progression === 'stable')            D += 10;

        var midbrain = (s.pupilSizeR === 'increased' || s.pupilSizeL === 'increased' ||
                        s.directPlrR === 'absent' || s.directPlrL === 'absent');
        var ponsLevel = (s.palpebralReflexR === 'decreased' || s.palpebralReflexR === 'absent' ||
                         s.palpebralReflexL === 'decreased' || s.palpebralReflexL === 'absent');
        var caudMedulla = (s.gagReflex === 'decreased' || s.gagReflex === 'absent' ||
                           s.swallowingFunction === 'dysphagia');
        if (midbrain)    flags.push('Fixed mydriasis / absent PLR — midbrain involvement (CN III; report to radiologist for DWI targeting)');
        if (ponsLevel)   flags.push('Decreased/absent palpebral reflex — pontine involvement (CN V; ± CN VII facial asymmetry)');
        if (centralVestibularSigns(s) && ponsLevel) flags.push('Central vestibular + CN V/VII — rostral medulla pattern (CN V/VI/VII + vestibular nuclei)');
        if (caudMedulla) flags.push('Dysphagia / absent gag reflex — caudal medulla involvement (CN IX/X; aspiration risk — nil per os, monitor breathing)');

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
            text: 'Brainstem stroke: screen for hypertension, hyperadrenocorticism, hypothyroidism, proteinuria/renal disease, coagulopathy, cardiac disease.'
        });
        if (caudMedulla) alerts.push({
            type: 'WARNING',
            title: 'Caudal Medulla — Aspiration Risk',
            text: 'Dysphagia / absent gag reflex indicates caudal medulla involvement (CN IX/X). Risk of aspiration pneumonia is HIGH. Feed via nasogastric or oesophagostomy tube. Nil per os until swallowing evaluated. Monitor respiratory pattern (caudal medulla = respiratory centre).'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain (DWI/FLAIR — brainstem hyperintense lesion; MRA if vascular)',
        'Blood pressure (hypertension #1 cause)',
        'Urinalysis + UPC (proteinuria → renal disease)',
        'UCCR / low-dose dex (hyperadrenocorticism)',
        'Total T4 (hypothyroidism)',
        'Echocardiography (cardiac emboli)',
        'Coagulation panel (PT/aPTT)',
        'CBC/biochemistry'
    ]
},

// ── 4. Bacterial Meningitis / Meningoencephalitis ──────────────────────
{ id: 'bs-meningitis', name: 'Bacterial Meningitis / Meningoencephalitis', category: 'Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var A = 20;

        var B = 0;
        if      (oc === 'acute')    B = 40;
        else if (oc === 'subacute') B = 35;
        else if (oc === 'peracute') B = 30;
        else                        B = 10;

        var C = 0;
        if      (pl === 'at-site' && hasPainLevel(s, 'severe')) C = 50;
        else if (pl === 'at-site')                              C = 35;
        else if (pl === 'none')  { C = 5; flags.push('No cervical pain — bacterial meningitis unlikely (pain is cardinal)'); }
        else                       C = 15;

        var D = 0;
        if (mentalDepressed(s))                D += 25;
        if (s.vomiting === 'yes')              D += 10;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R'))) D += 10;
        if (centralVestibularSigns(s))         D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 5;
        var mult = 1;
        if (pl === 'none') { mult *= 0.2; flags.push('Absent cervical pain — near-excludes bacterial meningitis (×0.2)'); }
        if (pl === 'at-site' && hasPainLevel(s, 'severe') && mentalDepressed(s) && s.fever === 'yes') {
            mult *= 1.5; flags.push('Fever + severe cervical pain + mental depression — classic bacterial meningitis triad (×1.5)');
        }

        alerts.push({
            type: 'CRITICAL',
            title: 'Immediate CSF + Blood Cultures — Start Empirical Antibiotics',
            text: 'Collect CSF + blood cultures FIRST, then start broad-spectrum antibiotics immediately (ampicillin + metronidazole, or 3rd-gen cephalosporin). Do NOT delay treatment pending culture results.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CSF analysis — URGENT (neutrophilic pleocytosis, very high protein, low glucose)',
        'CSF + blood culture and sensitivity',
        'CBC (leukocytosis with left shift)',
        'MRI brain with contrast (meningeal enhancement)',
        'Source workup: ears, sinuses, dental, wounds, diskospondylitis',
        'Broad-spectrum antibiotics IV — STAT'
    ]
},

// ── 5. CDV Meningoencephalitis — Brainstem ─────────────────────────────
{ id: 'bs-cdv', name: 'Canine Distemper Virus (CDV) Meningoencephalitis — Brainstem', category: 'Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        if      (age < 1)  { A += 35; flags.push('Age <1y — CDV most common in unvaccinated puppies'); }
        else if (age < 2)    A += 25;
        else if (age < 4)    A += 15;
        else if (age >= 7) { A += 10; flags.push('Age ≥7y — Old Dog Encephalitis (ODE) form of CDV possible'); }
        else                 A += 10;

        var B = 0;
        if      (oc === 'subacute') B = 45;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'chronic')  B = 25;
        else                        B = 10;

        var C = 0;
        if      (pl === 'at-site') C = 25;
        else if (pl === 'none')    C = 20;
        else                       C = 15;

        var D = 0;
        if (mentalDepressed(s))                                                        D += 25;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) D += 20;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                                         D += 15;
        if (s.fever === 'yes')                                                         D += 15;
        if (s.vomiting === 'yes' || s.lethargy === 'yes')                              D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 5;
        var mult = 1;
        if (age >= 2 && age < 7)          { mult *= 0.5; flags.push('Age 2-6y in vaccinated population — CDV less likely (×0.5)'); }
        if (s.fever === 'yes' && age < 2) { mult *= 1.3; flags.push('Fever in young dog — CDV encephalitis supported (×1.3)'); }

        alerts.push({
            type: 'WARNING',
            title: 'CDV — Highly Contagious / Isolation Required',
            text: 'If CDV confirmed or suspected: isolate immediately — highly contagious to unvaccinated dogs. Not zoonotic. Treatment is supportive only (no antiviral). Obtain vaccination history.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CDV serology (IgM titre — acute phase) or CSF PCR (most specific)',
        'MRI brain (multifocal white matter T2 hyperintensity)',
        'CSF analysis — mononuclear pleocytosis, CDV IgG in CSF',
        'CBC (lymphopenia in acute phase)',
        'Conjunctival/epithelial inclusion bodies (acute systemic phase)',
        'Vaccination history (unvaccinated / incomplete series)',
        'Treatment: supportive — nursing care, anticonvulsants if seizures'
    ]
},

// ── 6. Neospora caninum / Toxoplasma gondii — Brainstem ────────────────
{ id: 'bs-neospora', name: 'Neospora caninum / Toxoplasma gondii — Brainstem Encephalitis', category: 'Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        if (isBreed(s, ['Labrador Retriever'])) A += 15;
        if      (age < 1)  { A += 30; flags.push('Age <1y — Neospora CNS peaks in puppies'); }
        else if (age < 3)    A += 20;
        else if (age < 6)    A += 10;
        else                 A += 5;

        var B = 0;
        if      (oc === 'subacute') B = 45;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'chronic')  B = 20;
        else                        B = 10;

        var C = 0;
        if      (pl === 'at-site') C = 25;
        else if (pl === 'none')    C = 25;
        else                       C = 15;

        var D = 0;
        if (mentalDepressed(s))                                                        D += 20;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) D += 20;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                                         D += 15;
        if (s.fever === 'yes')                                                         D += 10;
        if (s.vomiting === 'yes')                                                      D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 5;
        var mult = 1;
        if (s.progression === 'worsening') { mult *= 1.2; flags.push('Progressive worsening — consistent with protozoal encephalitis (×1.2)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Neospora caninum serology (IFA ≥1:800) + Toxoplasma IgM/IgG',
        'CSF PCR (Neospora caninum, Toxoplasma gondii)',
        'CSF analysis — mononuclear/mixed pleocytosis',
        'MRI brain (multifocal enhancing lesions)',
        'Treatment: clindamycin 12.5 mg/kg PO q12h OR trimethoprim-sulfadiazine 15 mg/kg q12h — start early'
    ]
},

// ── 7. Cryptococcosis — CNS / Brainstem ────────────────────────────────
{ id: 'bs-crypto', name: 'Cryptococcosis — CNS Brainstem (Cryptococcus neoformans/gattii)', category: 'Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 15;
        if (age >= 2 && age <= 8) A += 15;

        var B = 0;
        if      (oc === 'subacute') B = 40;
        else if (oc === 'chronic')  B = 35;
        else if (oc === 'acute')    B = 20;
        else                        B = 10;

        var C = 0;
        if      (pl === 'at-site') C = 30;
        else if (pl === 'none')    C = 20;
        else                       C = 10;

        var D = 0;
        if (mentalDepressed(s))                                                        D += 25;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                                         D += 15;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) D += 15;
        if (s.vomiting === 'yes')                                                      D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 5;
        var mult = 1;
        if (s.fever === 'yes') { mult *= 1.2; flags.push('Fever — infectious meningitis pattern (×1.2)'); }

        alerts.push({
            type: 'INFO',
            title: 'Cryptococcal Antigen Test (LCAT)',
            text: 'Serum and CSF cryptococcal lateral flow antigen test (LCAT) is highly sensitive and specific — send before treatment. First-line: fluconazole 5-10 mg/kg PO q12h long course; amphotericin B lipid complex for severe CNS disease.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Serum + CSF cryptococcal lateral flow antigen test (LCAT) — highly sensitive',
        'CSF analysis — mononuclear pleocytosis; India ink (encapsulated yeasts)',
        'MRI brain (meningeal enhancement, gelatinous pseudocysts)',
        'CBC/biochemistry + thoracic radiographs (pulmonary involvement)',
        'Fluconazole 5-10 mg/kg PO q12h — prolonged course (months)',
        'Amphotericin B lipid complex for severe CNS disease'
    ]
},

// ── 7. Thiamine (Vitamin B1) Deficiency — Brainstem ────────────────────
{ id: 'bs-thiamine', name: 'Thiamine (Vitamin B1) Deficiency — Brainstem', category: 'Metabolic/Nutritional',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var A = 15;

        var B = 0;
        if      (oc === 'acute' || oc === 'peracute') B = 40;
        else if (oc === 'subacute')                   B = 30;
        else                                          B = 10;

        var C = 0;
        if (pl === 'none') C = 35;
        else               { C = 10; flags.push('Pain present — unusual for thiamine deficiency'); }

        var D = 0;
        if (mentalDepressed(s))                                                                                  D += 25;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia') || hasValue(s, 'gait', 'ataxia')) D += 20;
        if (!s.asymmetry || s.asymmetry === 'none')                                                              D += 15;
        if (s.vomiting === 'yes')                                                                                D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (pl !== 'none')    { mult *= 0.5; flags.push('Pain present — thiamine deficiency is painless (×0.5)'); }
        if (oc === 'chronic') { mult *= 0.4; flags.push('Chronic gradual onset unusual for thiamine deficiency (×0.4)'); }

        alerts.push({
            type: 'WARNING',
            title: 'Treat Empirically — Thiamine 25-50 mg IV/IM STAT',
            text: 'Thiamine deficiency can be rapidly fatal and is reversible. Treat empirically if suspected: thiamine 25-50 mg IV/IM STAT, then 25 mg/day for 5 days. Clinical improvement within 24-48h supports diagnosis. Obtain dietary history (exclusive fish, raw, heat-processed diet, or prolonged anorexia).'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Dietary history (exclusive fish/raw diet, severely processed food, prolonged anorexia)',
        'MRI brain (bilateral symmetric brainstem T2 hyperintensity — periventricular, caudal colliculi)',
        'Serum thiamine levels (send-out lab — treat empirically while pending)',
        'CBC/biochemistry (rule out metabolic causes)',
        'Thiamine supplementation trial — response within 24-48h is diagnostic'
    ]
},

// ── 9. Head Trauma — Brainstem ─────────────────────────────────────────
{ id: 'bs-trauma', name: 'Head Trauma / Traumatic Brain Injury — Brainstem', category: 'Traumatic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 25;
        if (age < 3) A = 35;

        var B = 0;
        if      (s.traumaHistory === 'yes' && (oc === 'peracute' || oc === 'acute')) B = 50;
        else if (oc === 'peracute' || oc === 'acute')                                B = 20;
        else                                                                         B = 0;

        var C = 0;
        if      (pl === 'at-site') C = 35;
        else if (pl === 'none')    C = 15;
        else                       C = 20;

        var D = 0;
        if (mentalDepressed(s))                                                        D += 25;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                                         D += 15;
        if (centralVestibularSigns(s))                                                 D += 15;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) D += 15;
        if (s.vomiting === 'yes')                                                      D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (s.traumaHistory === 'yes') {
            mult *= 2.0; flags.push('Confirmed trauma history — brainstem TBI must be considered (×2.0)');
        } else {
            mult *= 0.2; flags.push('No trauma history — brainstem TBI unlikely without witnessed trauma (×0.2)');
        }
        if (oc === 'chronic' || oc === 'subacute') {
            mult *= 0.1; flags.push('Chronic/subacute onset inconsistent with acute trauma (×0.1)');
        }

        alerts.push({
            type: 'CRITICAL',
            title: 'Traumatic Brain Injury — EMERGENCY STABILISATION FIRST',
            text: 'TBI management priority: (1) Airway, breathing, circulation — oxygen supplementation, IV access. (2) Modified Glasgow Coma Scale assessment. (3) Avoid hypotension (MAP >80 mmHg) and hypoxia. (4) Elevate head 30°. (5) Mannitol 0.5-1 g/kg IV if signs of raised ICP (deteriorating consciousness, anisocoria, Cushing\'s reflex). DO NOT perform CSF tap — risk of brainstem herniation.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Modified Glasgow Coma Scale (Motor + Brainstem reflexes + Level of consciousness — serial assessments)',
        'CT brain (preferred over MRI in acute trauma — faster, detects haemorrhage, fractures)',
        'Skull radiographs (if CT unavailable)',
        'Blood pressure monitoring (MAP target >80 mmHg)',
        'CBC/biochemistry/coagulation panel',
        'Thoracic/abdominal radiographs (concurrent trauma)',
        'MRI brain (delayed — better parenchymal detail once stable)',
        'AVOID CSF tap acutely — herniation risk'
    ]
},

// ── 10. Rabies Encephalitis ────────────────────────────────────────────
{ id: 'bs-rabies', name: 'Rabies Encephalitis — Brainstem (Furious/Dumb Form)', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

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
        else                                          B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        var C = 0;
        if      (pl === 'none')    C = 20;
        else if (pl === 'at-site') C = 15;
        else                       C = 10;

        var D = 0;
        if (mentalDepressed(s))                                                                         D += 20;
        if (s.swallowingFunction === 'dysphagia')                                                       { D += 30; flags.push('Dysphagia/pharyngeal spasm — rabies hallmark (hydrophobia); cardinal brainstem sign'); }
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                                                          D += 15;
        if (s.behavior === 'aggressive')                                                                { D += 20; flags.push('Aggression — furious rabies form'); }
        if (s.gagReflex === 'decreased' || s.gagReflex === 'absent')                                    { D += 15; flags.push('Absent gag reflex — brainstem CN IX/X involvement'); }
        if (centralVestibularSigns(s))                                                                  D += 10;

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
}

];

app.diagnoses['medulla-rostral'] = _brainstemDx;
app.diagnoses['medulla-caudal']  = _brainstemDx;
app.diagnoses['midbrain']        = _brainstemDx;
app.diagnoses['pons']            = _brainstemDx;

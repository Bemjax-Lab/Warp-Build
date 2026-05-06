// Central Vestibular diagnoses — rewritten from DDX-main/src/regions/CentralVestibular.js in our style.
// Uses OUR parameter names directly (no normalise adapter).
// Diagnosis-only params (fever, vaccinated, cough, petechiae, ...) live in
// apps/Localisation/diagnoses/diagnosesParameters.json and are merged into the
// Parameters model at init — Parameters app renders them as extra categories.

app.diagnoses = app.diagnoses || {};
app.diagnoses['vestibular-central'] = [

// ── 1. Ischemic Stroke — Central Vestibular ───────────────────────────────
{ id: 'cv-stroke', name: 'Ischemic Stroke — Central Vestibular (Brainstem)', category: 'Vascular',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — middle-aged to older
        var A = 0;
        if      (age >= 7) A += 25;
        else if (age >= 5) A += 20;
        else if (age >= 3) A += 15;
        else               A += 5;
        if (isBreed(s, predispositions.large)) A += 10;

        // [B] Temporal — PERACUTE is hallmark
        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 25;
        else                        B = 5;

        // [C] Pain — typically absent (ischemic)
        var C = 0;
        if      (pl === 'none')    C = 30;
        else if (pl === 'at-site') C = 15;
        else                       C = 10;

        // [D] Deficit — central vestibular pattern
        var D = 0;
        if (hasHeadTilt(s))                                                                      D += 20;
        if (centralVestibularSigns(s))                                                           D += 20;
        if ((s.nystagmusR === 'horizontal' || s.nystagmusL === 'horizontal') ||
            (s.nystagmusR === 'rotatory' || s.nystagmusL === 'rotatory'))                        D += 10;
        if (mentalDepressed(s))                                                                  D += 15;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                                                   D += 10;
        if (s.asymmetry && s.asymmetry !== 'none')                                               D += 10;
        if (s.progression === 'stable' || s.progression === 'improving')                         D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (oc === 'peracute' && pl === 'none')    { mult *= 1.5; flags.push('Peracute + painless — stroke signature (×1.5)'); }
        if (oc === 'chronic' || oc === 'subacute') { mult *= 0.2; flags.push('Chronic/subacute — argues against stroke (×0.2)'); }
        if (s.progression === 'worsening' && (parseFloat(s.duration) || 0) > 3) {
            mult *= 0.5; flags.push('Progressive >3 days — tumor/inflammation more likely (×0.5)');
        }

        alerts.push({
            type: 'INFO',
            title: 'Underlying Cause Workup Required',
            text: 'Brainstem stroke: screen for hypertension, hyperadrenocorticism, hypothyroidism, proteinuria/renal disease, coagulopathy, cardiac disease.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain (DWI/FLAIR — brainstem/medullary hyperintense lesion)',
        'Blood pressure (hypertension — #1 cause)',
        'UCCR / low-dose dex (hyperadrenocorticism)',
        'Total T4 (hypothyroidism)',
        'Urinalysis + UPC (renal disease)',
        'Coagulation panel (PT/aPTT)',
        'Echocardiography (cardiac emboli)',
        'CBC/biochemistry'
    ]
},

// ── 2. Immune-Mediated Meningoencephalitis (GME / NME / NLE) ─────────────
{ id: 'cv-imme', name: 'Immune-Mediated Meningoencephalitis (GME / NME / NLE)', category: 'Inflammatory/Immune',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — small/toy breeds strongly predisposed; young to middle-aged
        // GME: Maltese, Yorkshire Terrier, Toy/Miniature Poodle, Chihuahua, Dachshund, Beagle, Cocker Spaniel, Boston Terrier
        // NME: Pug, Maltese, Yorkshire Terrier, Chihuahua, French Bulldog, Boston Terrier, Papillon
        // NLE: Yorkshire Terrier, French Bulldog
        var A = 0;
        var immeBreeds = ['Maltese', 'Yorkshire Terrier', 'Toy Poodle', 'Miniature Poodle', 'Poodle',
            'Chihuahua', 'Dachshund', 'Beagle', 'Cocker Spaniel', 'Boston Terrier',
            'Pug', 'French Bulldog', 'Papillon'];
        if (isBreed(s, immeBreeds))               { A += 25; flags.push('Breed predisposed to immune-mediated meningoencephalitis (GME/NME/NLE)'); }
        else if (isBreed(s, predispositions.toy)) A += 15;
        if      (age >= 2 && age <= 8) A += 25;
        else if (age > 8)              A += 10;
        else                           A += 5;

        // [B] Temporal — subacute to chronic; GME can be acute
        var B = 0;
        if      (oc === 'subacute') B = 45;
        else if (oc === 'chronic')  B = 35;
        else if (oc === 'acute')    B = 25;
        else                        B = 10;

        // [C] Pain — meningeal irritation common
        var C = 0;
        if      (pl === 'at-site') C = 35;
        else if (pl === 'none')    C = 20;
        else                       C = 15;

        // [D] Deficit — central vestibular + mental depression
        var D = 0;
        if (hasHeadTilt(s))                    D += 20;
        if (centralVestibularSigns(s))         D += 20;
        if (mentalDepressed(s))                D += 20;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R'))) D += 10;
        if (s.vomiting === 'yes')              D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 10;
        var mult = 1;
        if (s.fever === 'yes' && pl === 'at-site') { mult *= 1.3; flags.push('Fever + cervical pain — immune-mediated meningoencephalitis pattern (×1.3)'); }
        if (age > 10) { mult *= 0.6; flags.push('Age >10y — neoplasia more likely than IMME (×0.6)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain with contrast (focal or multifocal brainstem/meningeal/parenchymal enhancement)',
        'CSF analysis — mononuclear/mixed pleocytosis, elevated protein (histopathology needed for GME/NME/NLE subtype)',
        'Infectious panel: Toxoplasma, Neospora, Cryptococcus, CDV, Ehrlichia, Bartonella',
        'CSF PCR panel (rule out infectious causes)',
        'Breed predisposition note: NME — Pug, French Bulldog, Chihuahua; NLE — Yorkshire Terrier, French Bulldog; GME — toy breeds broadly',
        'Treatment: prednisolone ± cytarabine ± cyclosporine — referral recommended'
    ]
},

// ── 3. Brainstem Tumor — Central Vestibular ───────────────────────────────
{ id: 'cv-tumor', name: 'Brainstem Tumor — Central Vestibular', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — older dogs
        var A = 0;
        if      (age >= 8) A += 30;
        else if (age >= 5) A += 20;
        else if (age >= 2) A += 5;
        else               { flags.push('Age <2y — brainstem tumor very unlikely'); }
        if (isBreed(s, predispositions.large)) A += 10;

        // [B] Temporal — chronic progressive
        var B = 0;
        if      (oc === 'chronic')  B = 45;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15;
        else                        B = 5;

        // [C] Pain
        var C = 0;
        if      (pl === 'none')    C = 25;
        else if (pl === 'at-site') C = 20;
        else                       C = 15;

        // [D] Deficit — central vestibular + progressive signs
        var D = 0;
        if (hasHeadTilt(s))                    D += 20;
        if (centralVestibularSigns(s))         D += 20;
        if (mentalDepressed(s))                D += 15;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R'))) D += 15;
        if (s.vomiting === 'yes')              D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (age < 3)           { mult *= 0.2; flags.push('Age <3y — brainstem tumor very unlikely (×0.2)'); }
        if (oc === 'peracute') { mult *= 0.4; flags.push('Peracute — stroke more likely than tumor (×0.4)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain with contrast (brainstem mass)',
        'CSF analysis (cytology)',
        'Thoracic radiographs + abdominal ultrasound (staging)',
        'Neurology/oncology referral — radiation therapy'
    ]
},

// ── 4. Canine Distemper Virus (CDV) Meningoencephalitis ───────────────────
{ id: 'cv-cdv', name: 'Canine Distemper Virus (CDV) Meningoencephalitis', category: 'Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — young unvaccinated dogs most at risk; ODE form in old dogs
        var A = 0;
        if      (age < 1)  { A += 35; flags.push('Age <1y — CDV most common in unvaccinated puppies'); }
        else if (age < 2)   A += 25;
        else if (age < 4)   A += 15;
        else if (age >= 7) { A += 10; flags.push('Age ≥7y — Old Dog Encephalitis (ODE) form of CDV possible'); }
        else                A += 10;

        // [B] Temporal — subacute to chronic; ODE insidious
        var B = 0;
        if      (oc === 'subacute') B = 45;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'chronic')  B = 25;
        else                        B = 10;

        // [C] Pain — meningeal irritation possible
        var C = 0;
        if      (pl === 'at-site') C = 25;
        else if (pl === 'none')    C = 20;
        else                       C = 15;

        // [D] Deficit — multifocal CNS signs + systemic signs
        var D = 0;
        if (hasHeadTilt(s))                               D += 15;
        if (mentalDepressed(s))                           D += 20;
        if (s.fever === 'yes')                            D += 15;
        if (s.vomiting === 'yes' || s.lethargy === 'yes') D += 10;
        if (centralVestibularSigns(s))                    D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 5;
        var mult = 1;
        if (age >= 2 && age < 7)          { mult *= 0.5; flags.push('Age 2-6y in vaccinated population — CDV less likely (×0.5)'); }
        if (s.fever === 'yes' && age < 2) { mult *= 1.3; flags.push('Fever in young dog — CDV encephalitis supported (×1.3)'); }

        alerts.push({
            type: 'WARNING',
            title: 'CDV — Highly Contagious / Isolation Required',
            text: 'If CDV confirmed or suspected: isolate immediately — highly contagious to unvaccinated dogs. Not zoonotic. Treatment is supportive only (no antiviral). Obtain vaccination history. Notify owner of exposure risk to in-contact animals.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CDV serology (IgM titre — acute phase) or CSF PCR (most specific)',
        'MRI brain (multifocal white matter T2 hyperintensity)',
        'CSF analysis — mononuclear pleocytosis, elevated CDV IgG in CSF',
        'CBC (lymphopenia in acute phase)',
        'Conjunctival/epithelial inclusion bodies (acute systemic phase)',
        'Vaccination history (unvaccinated / incomplete series)',
        'Treatment: supportive — nursing care, anticonvulsants if seizures'
    ]
},

// ── 5. Neospora caninum / Toxoplasma gondii — Brainstem ───────────────────
{ id: 'cv-neospora', name: 'Neospora caninum / Toxoplasma gondii — Brainstem Encephalitis', category: 'Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — young dogs; Labrador predisposed for Neospora
        var A = 0;
        if (isBreed(s, ['Labrador Retriever'])) A += 15;
        if      (age < 1) { A += 30; flags.push('Age <1y — Neospora CNS peaks in puppies'); }
        else if (age < 3)  A += 20;
        else if (age < 6)  A += 10;
        else               A += 5;

        // [B] Temporal — subacute to chronic progressive
        var B = 0;
        if      (oc === 'subacute') B = 45;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'chronic')  B = 20;
        else                        B = 10;

        // [C] Pain — meningeal component possible
        var C = 0;
        if      (pl === 'at-site') C = 25;
        else if (pl === 'none')    C = 25;
        else                       C = 15;

        // [D] Deficit
        var D = 0;
        if (hasHeadTilt(s))                                                                      D += 15;
        if (mentalDepressed(s))                                                                  D += 15;
        if (centralVestibularSigns(s))                                                           D += 15;
        if (s.fever === 'yes')                                                                   D += 10;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia'))           D += 10;

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

// ── 6. Cryptococcosis — CNS ────────────────────────────────────────────────
{ id: 'cv-crypto', name: 'Cryptococcosis — CNS (Cryptococcus neoformans/gattii)', category: 'Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — any breed/age; cats >> dogs; no strong canine breed predisposition
        var A = 15;
        if (age >= 2 && age <= 8) A += 15;

        // [B] Temporal — subacute to chronic
        var B = 0;
        if      (oc === 'subacute') B = 40;
        else if (oc === 'chronic')  B = 35;
        else if (oc === 'acute')    B = 20;
        else                        B = 10;

        // [C] Pain — meningeal irritation (chronic meningitis pattern)
        var C = 0;
        if      (pl === 'at-site') C = 30;
        else if (pl === 'none')    C = 20;
        else                       C = 10;

        // [D] Deficit
        var D = 0;
        if (hasHeadTilt(s))                    D += 15;
        if (mentalDepressed(s))                D += 20;
        if (centralVestibularSigns(s))         D += 15;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R'))) D += 10;
        if (s.vomiting === 'yes')              D += 10;

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

// ── 7. Thiamine (Vitamin B1) Deficiency ───────────────────────────────────
{ id: 'cv-thiamine', name: 'Thiamine (Vitamin B1) Deficiency', category: 'Metabolic/Nutritional',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A] Signalment — any breed/age; dietary history is key
        var A = 15;

        // [B] Temporal — acute to subacute onset (rapid decompensation)
        var B = 0;
        if      (oc === 'acute' || oc === 'peracute') B = 40;
        else if (oc === 'subacute')                   B = 30;
        else                                          B = 10;

        // [C] Pain — absent (metabolic)
        var C = 0;
        if (pl === 'none') C = 35;
        else               { C = 10; flags.push('Pain present — unusual for thiamine deficiency'); }

        // [D] Deficit — bilateral symmetric vestibular + mental depression
        var D = 0;
        if (hasHeadTilt(s))                                                                      D += 15;
        if (mentalDepressed(s))                                                                  D += 20;
        if ((s.nystagmusR && s.nystagmusR !== 'none') || (s.nystagmusL && s.nystagmusL !== 'none')) D += 15;
        if (!s.asymmetry || s.asymmetry === 'none')                                              D += 15;
        if (s.vomiting === 'yes')                                                                D += 10;

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
        'MRI brain (bilateral symmetric brainstem T2 hyperintensity — vestibular nuclei, caudal colliculi)',
        'Serum thiamine levels (send-out lab — treat empirically while pending)',
        'CBC/biochemistry (rule out metabolic causes)',
        'Thiamine supplementation trial — response within 24-48h is diagnostic'
    ]
},

// ── 8. Otogenic / Hematogenous Bacterial Meningoencephalitis ─────────────
{ id: 'cv-bacterial', name: 'Otogenic / Hematogenous Bacterial Meningoencephalitis', category: 'Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — any breed/age; otitis-prone breeds at higher risk for otogenic route
        // French Bulldogs: brachycephalic ear canal anatomy — increasingly common otogenic source
        var A = 15;
        var otitisBreeds = ['French Bulldog', 'Cocker Spaniel', 'Basset Hound', 'Shar Pei',
            'Labrador Retriever', 'Golden Retriever', 'Bulldog'];
        if (isBreed(s, ['French Bulldog'])) { A += 20; flags.push('French Bulldog — high risk for otogenic bacterial meningoencephalitis'); }
        else if (isBreed(s, otitisBreeds))   A += 10;
        if (age >= 1 && age <= 10) A += 10;

        // [B] Temporal — acute to subacute; peracute possible with septic emboli
        var B = 0;
        if      (oc === 'acute')    B = 40;
        else if (oc === 'subacute') B = 35;
        else if (oc === 'peracute') B = 30;
        else                        B = 10;

        // [C] Pain — severe cervical rigidity is cardinal
        var C = 0;
        if      (pl === 'at-site' && hasPainLevel(s, 'severe')) C = 50;
        else if (pl === 'at-site')                              C = 35;
        else if (pl === 'none') { C = 5; flags.push('No cervical pain — bacterial meningoencephalitis unlikely (pain is cardinal)'); }
        else                                                    C = 15;

        // [D] Deficit — mental depression cardinal; otogenic route adds CN VII / Horner's / head tilt
        var D = 0;
        if (mentalDepressed(s))                D += 25;
        if (hasHeadTilt(s))                    D += 15;
        if (centralVestibularSigns(s))         D += 10;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R'))) D += 15; // CN VII palsy — otogenic marker
        if (s.vomiting === 'yes')              D += 10;
        if (s.otitis === 'yes')                D += 20; // strong otogenic indicator

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 5;
        var mult = 1;
        if (s.otitis === 'yes') { mult *= 1.4; flags.push('Otitis present — strongly supports otogenic source (×1.4)'); }
        if (pl === 'none')      { mult *= 0.2; flags.push('Absent cervical pain — near-excludes bacterial meningoencephalitis (×0.2)'); }
        if (pl === 'at-site' && hasPainLevel(s, 'severe') && mentalDepressed(s) && s.fever === 'yes') {
            mult *= 1.5; flags.push('Fever + severe cervical pain + mental depression — bacterial meningoencephalitis triad (×1.5)');
        }

        alerts.push({
            type: 'CRITICAL',
            title: 'ALWAYS Check Ears — Otogenic Source Must Be Excluded',
            text: 'Otoscopic exam + CT bullae mandatory to exclude otogenic source before or alongside CSF. Collect CSF + blood + ear cultures, then start broad-spectrum antibiotics immediately (ampicillin-sulbactam or 3rd-gen cephalosporin). Do NOT delay treatment pending culture results. French Bulldogs: otogenic route increasingly recognised.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Otoscopic exam — ALWAYS (discharge, membrane rupture, polyp): exclude otogenic source first',
        'CT bullae + brain (tympanic bulla involvement, brain abscess, meningeal enhancement)',
        'CSF analysis — URGENT (neutrophilic pleocytosis, very high protein, low glucose)',
        'CSF + blood + ear canal culture and sensitivity',
        'MRI brain with contrast (if CT inconclusive — leptomeningeal/parenchymal enhancement, abscess)',
        'CBC (leukocytosis with left shift), CRP',
        'Source workup beyond ears: sinuses, dental, diskospondylitis, haematogenous focus',
        'Broad-spectrum antibiotics IV — STAT; consider TECA-BO if chronic otogenic source'
    ]
},

// ── 9. Metronidazole Toxicity — Central Vestibular ────────────────────────
{ id: 'cv-toxic', name: 'Metronidazole Toxicity — Central Vestibular', category: 'Toxic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A] Signalment — any breed/age; drug history is entirely determinative
        var A = 30;

        // [B] Temporal — signs appear 7-12 days after starting high-dose therapy (subacute)
        // Can also occur after 1-6 weeks of treatment at any dose
        var B = 0;
        if      (oc === 'subacute')                   B = 45;
        else if (oc === 'acute' || oc === 'peracute') B = 35;
        else /* chronic */                            B = 15;

        // [C] Pain — absent (toxic/metabolic)
        var C = 0;
        if (pl === 'none') C = 35;
        else               { C = 10; flags.push('Pain present — metronidazole toxicity is painless; reconsider'); }

        // [D] Deficit — central vestibular nuclei damage (brainstem)
        // Nystagmus: spontaneous and positional, any direction including vertical
        // Mental depression: possible in severe cases and in cats (supratentorial signs)
        var D = 0;
        if (hasHeadTilt(s))                                                                      D += 20;
        if ((s.nystagmusR && s.nystagmusR !== 'none') || (s.nystagmusL && s.nystagmusL !== 'none')) D += 20;
        if (centralVestibularSigns(s))                                                           D += 10; // vertical/positional nystagmus consistent with metro
        if (mentalDepressed(s))                                                                  D += 10; // possible in severe cases / cats
        if (s.vomiting === 'yes' || s.lethargy === 'yes')                                        D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (s.recentNeurologicDrug === 'metronidazole') {
            mult *= 2.0; flags.push('Metronidazole history — strongly supports drug toxicity (×2.0)');
        } else if (!s.recentNeurologicDrug || s.recentNeurologicDrug === 'none') {
            mult *= 0.4; flags.push('No drug history — toxicity less likely without it (×0.4)');
        } else {
            mult *= 0.5; flags.push('Different drug noted — verify neurotoxic potential (×0.5)');
        }
        if (oc === 'chronic') { flags.push('Signs typically appear 7-12 days into therapy — verify treatment duration'); }

        alerts.push({
            type: 'WARNING',
            title: 'Stop Metronidazole — Diazepam Protocol',
            text: 'STOP metronidazole immediately. Diazepam 0.43 mg/kg IV or PO q8h × 3 days — average recovery 38.7h vs 11.6 days untreated (Evans et al. 2003). Safe daily dose ≤30 mg/kg/day. Toxic range: 67–129 mg/kg/day in dogs. Permanent neurological deficits possible.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Drug history (metronidazole dose + duration — toxic range 67–129 mg/kg/day; safe ≤30 mg/kg/day)',
        'Signs typically onset 7–12 days into therapy; reported with as little as 1 week of treatment',
        'MRI brain (bilateral symmetric T2 hyperintensity — vestibular nuclei, cerebellar nuclei, rostral colliculus, olivary nucleus)',
        'CSF analysis (elevated protein in some cases; otherwise normal)',
        'Stop drug immediately',
        'Diazepam 0.43 mg/kg IV or PO q8h × 3 days (Evans et al. 2003)',
        'Recovery ~38.7h with diazepam vs ~11.6 days without; permanent deficits possible'
    ]
}

];

// Paradoxical Vestibular diagnoses — rewritten from DDX-main/src/regions/ParadoxicalVestibular.js in our style.
// Uses OUR parameter names directly (no normalise adapter).
// Diagnosis-only params (fever, vaccinated, cough, petechiae, ...) live in
// apps/Localisation/diagnoses/diagnosesParameters.json and are merged into the
// Parameters model at init — Parameters app renders them as extra categories.

app.diagnoses = app.diagnoses || {};
app.diagnoses['vestibular-paradoxical'] = [

// ── 1. Cerebellar Ischemic Stroke ─────────────────────────────────────────
{ id: 'pv-stroke', name: 'Cerebellar Ischemic Stroke — Paradoxical Vestibular', category: 'Vascular',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — older dogs
        var A = 0;
        if      (age >= 7) A += 25;
        else if (age >= 5) A += 20;
        else if (age >= 3) A += 15;
        else               A += 5;
        if (isBreed(s, predispositions.large)) A += 10;

        // [B] Temporal — PERACUTE hallmark
        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 25;
        else                        B = 5;

        // [C] Pain — absent (ischemic)
        var C = 0;
        if      (pl === 'none')    C = 30;
        else if (pl === 'at-site') C = 15;
        else                       C = 10;

        // [D] Deficit — paradoxical vestibular + cerebellar signs
        var D = 0;
        if (hasHeadTilt(s))                                                                      D += 20;
        if (cerebellarSigns(s))                                                                  D += 20;
        if (!mentalDepressed(s))                                                                 D += 15;
        if ((s.nystagmusR && s.nystagmusR !== 'none') || (s.nystagmusL && s.nystagmusL !== 'none')) D += 10;
        if (s.progression === 'stable' || s.progression === 'improving')                         D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 8;
        var mult = 1;
        if (oc === 'peracute' && pl === 'none')    { mult *= 1.5; flags.push('Peracute + painless — stroke signature (×1.5)'); }
        if (oc === 'chronic' || oc === 'subacute') { mult *= 0.2; flags.push('Chronic/subacute — argues against stroke (×0.2)'); }

        alerts.push({
            type: 'INFO',
            title: 'Underlying Cause Workup Required',
            text: 'Cerebellar stroke: screen for hypertension, hyperadrenocorticism, hypothyroidism, renal disease (proteinuria), coagulopathy, cardiac emboli.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain (DWI/FLAIR — cerebellar/flocculonodular T2 hyperintensity)',
        'Blood pressure',
        'UCCR / low-dose dex (hyperadrenocorticism)',
        'Total T4 (hypothyroidism)',
        'Urinalysis + UPC (renal disease)',
        'Coagulation panel (PT/aPTT)',
        'Echocardiography (cardiac emboli)'
    ]
},

// ── 2. Cerebellar Tumor — Paradoxical Vestibular ──────────────────────────
{ id: 'pv-tumor', name: 'Cerebellar Tumor — Paradoxical Vestibular (Medulloblastoma/Meningioma)', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — bimodal: medulloblastoma young, meningioma old
        var A = 0;
        if      (age < 2)  { A += 20; flags.push('Age <2y — medulloblastoma possible'); }
        else if (age >= 8) { A += 25; flags.push('Age ≥8y — cerebellar meningioma more likely'); }
        else                 A += 10;
        if (isBreed(s, predispositions.large)) A += 10;

        // [B] Temporal — chronic progressive
        var B = 0;
        if      (oc === 'chronic')  B = 40;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15;
        else                        B = 5;

        // [C] Pain
        var C = 0;
        if      (pl === 'none')    C = 25;
        else if (pl === 'at-site') C = 20;
        else                       C = 15;

        // [D] Deficit — paradoxical vestibular + cerebellar
        var D = 0;
        if (hasHeadTilt(s))                                                                      D += 20;
        if (cerebellarSigns(s))                                                                  D += 20;
        if (!mentalDepressed(s))                                                                 D += 10;
        if ((s.nystagmusR && s.nystagmusR !== 'none') || (s.nystagmusL && s.nystagmusL !== 'none')) D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (oc === 'peracute')   { mult *= 0.4; flags.push('Peracute — stroke more likely than tumor (×0.4)'); }
        if (!cerebellarSigns(s)) { mult *= 0.4; flags.push('No cerebellar signs — tumor less supported (×0.4)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain with contrast (flocculonodular/cerebellar mass)',
        'CSF analysis (cytology)',
        'Thoracic + abdominal imaging (staging)',
        'Neurosurgery referral (posterior fossa approach)',
        'Radiation therapy'
    ]
},

// ── 3. GME — Cerebellar / Paradoxical Vestibular ──────────────────────────
{ id: 'pv-gme', name: 'GME — Cerebellar / Paradoxical Vestibular (Granulomatous Meningoencephalitis)', category: 'Inflammatory',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — small/toy breeds, young adults
        var A = 0;
        var gmeBreeds = ['Maltese', 'Yorkshire Terrier', 'Toy Poodle', 'Miniature Poodle', 'Poodle',
            'Chihuahua', 'Dachshund', 'Beagle', 'Cocker Spaniel', 'Boston Terrier'];
        if (isBreed(s, gmeBreeds))                A += 20;
        else if (isBreed(s, predispositions.toy)) A += 15;
        if      (age >= 2 && age <= 7) A += 25;
        else if (age > 7)              A += 10;
        else                           A += 5;

        // [B] Temporal — subacute to chronic
        var B = 0;
        if      (oc === 'subacute') B = 45;
        else if (oc === 'chronic')  B = 35;
        else if (oc === 'acute')    B = 25;
        else                        B = 10;

        // [C] Pain — meningeal irritation
        var C = 0;
        if      (pl === 'at-site') C = 35;
        else if (pl === 'none')    C = 20;
        else                       C = 15;

        // [D] Deficit — cerebellar + paradoxical vestibular
        var D = 0;
        if (hasHeadTilt(s))                                                                      D += 20;
        if (cerebellarSigns(s))                                                                  D += 20;
        if ((s.nystagmusR && s.nystagmusR !== 'none') || (s.nystagmusL && s.nystagmusL !== 'none')) D += 10;
        if (!mentalDepressed(s))                                                                 D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 10;
        var mult = 1;
        if (s.fever === 'yes' && pl === 'at-site') { mult *= 1.3; flags.push('Fever + cervical pain — meningoencephalitis pattern (×1.3)'); }
        if (age > 10) { mult *= 0.6; flags.push('Age >10y — tumor more likely than GME (×0.6)'); }
        if (!hasHeadTilt(s) && !cerebellarSigns(s) &&
            ((!s.nystagmusR || s.nystagmusR === 'none') && (!s.nystagmusL || s.nystagmusL === 'none')) &&
            s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.55; flags.push('No vestibular/cerebellar deficit + no systemic signs — GME unlikely as sole pain presentation (×0.55)');
        }
        if (oc === 'chronic' && s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.6; flags.push('Chronic onset + no systemic signs — inflammatory encephalitis less likely; consider structural/degenerative (×0.6)');
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain with contrast (cerebellar/flocculonodular enhancing lesions)',
        'CSF analysis — mononuclear/mixed pleocytosis, elevated protein',
        'Infectious panel: Toxoplasma, Neospora, Cryptococcus, CDV',
        'CSF PCR panel',
        'Treatment: prednisolone ± cytarabine — referral recommended'
    ]
},

// ── 4. CDV — Cerebellar Encephalitis ──────────────────────────────────────
{ id: 'pv-cdv', name: 'Canine Distemper Virus (CDV) — Cerebellar Encephalitis', category: 'Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — young unvaccinated dogs
        var A = 0;
        if      (age < 1) { A += 35; flags.push('Age <1y — CDV most common in unvaccinated puppies'); }
        else if (age < 2)  A += 25;
        else if (age < 4)  A += 15;
        else               A += 5;

        // [B] Temporal — subacute progressive
        var B = 0;
        if      (oc === 'subacute') B = 45;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'chronic')  B = 20;
        else                        B = 10;

        // [C] Pain
        var C = 0;
        if      (pl === 'at-site') C = 20;
        else if (pl === 'none')    C = 25;
        else                       C = 15;

        // [D] Deficit — cerebellar + paradoxical vestibular + systemic
        var D = 0;
        if (cerebellarSigns(s))                           D += 25;
        if (hasHeadTilt(s))                               D += 15;
        if (s.fever === 'yes')                            D += 10;
        if (!mentalDepressed(s))                          D += 10;
        if (s.vomiting === 'yes' || s.lethargy === 'yes') D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 5;
        var mult = 1;
        if (age >= 2 && age < 7)          { mult *= 0.5; flags.push('Age 2-6y in vaccinated population — CDV less likely (×0.5)'); }
        if (s.fever === 'yes' && age < 2) { mult *= 1.3; flags.push('Fever in young dog — CDV encephalitis supported (×1.3)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CDV serology (IgM) or CSF PCR (most specific)',
        'MRI brain (multifocal white matter T2 hyperintensity, cerebellar involvement)',
        'CSF analysis — mononuclear pleocytosis, CDV IgG in CSF',
        'CBC (lymphopenia in acute phase)',
        'Vaccination history (unvaccinated / incomplete series)',
        'Treatment: supportive — nursing care, anticonvulsants if needed'
    ]
},

// ── 5. Neospora caninum — Cerebellar / Paradoxical Vestibular ─────────────
{ id: 'pv-neospora', name: 'Neospora caninum — Cerebellar / Paradoxical Vestibular Encephalitis', category: 'Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — young dogs; Labrador predisposed
        var A = 0;
        if (isBreed(s, ['Labrador Retriever'])) A += 20;
        if      (age < 1) { A += 30; flags.push('Age <1y — Neospora cerebellar encephalitis peaks in puppies'); }
        else if (age < 3)  A += 20;
        else if (age < 6)  A += 10;
        else               A += 5;

        // [B] Temporal — subacute progressive
        var B = 0;
        if      (oc === 'subacute') B = 45;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'chronic')  B = 20;
        else                        B = 10;

        // [C] Pain
        var C = 0;
        if      (pl === 'at-site') C = 25;
        else if (pl === 'none')    C = 25;
        else                       C = 15;

        // [D] Deficit — cerebellar signs + paradoxical vestibular
        var D = 0;
        if (cerebellarSigns(s))                                                                  D += 25;
        if (hasHeadTilt(s))                                                                      D += 15;
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'tetraparesis'))           D += 20;
        if (s.fever === 'yes')                                                                   D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 5;
        var mult = 1;
        if (s.progression === 'worsening') { mult *= 1.2; flags.push('Progressive worsening — consistent with Neospora (×1.2)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Neospora caninum serology (IFA ≥1:800)',
        'CSF PCR (Neospora caninum)',
        'CSF analysis — mononuclear/mixed pleocytosis',
        'MRI brain + spine (multifocal enhancing lesions)',
        'Treatment: clindamycin 12.5 mg/kg PO q12h OR trimethoprim-sulfadiazine 15 mg/kg q12h'
    ]
},

// ── 6. Intracranial Arachnoid Cyst — Posterior Fossa ─────────────────────
{ id: 'pv-arachnoid', name: 'Intracranial Arachnoid Cyst — Posterior Fossa', category: 'Anomalous/Congenital',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — brachycephalic/screwTail breeds; young to middle-aged
        var A = 0;
        if (isBreed(s, predispositions.screwTail))    { A += 35; flags.push('ScrewTail/brachycephalic breed — highest risk for posterior fossa arachnoid cyst'); }
        else if (isBreed(s, predispositions.toy))      A += 15;
        else if (isBreed(s, predispositions.chondro))  A += 15;
        else                                           A += 5;
        if      (age <= 4) A += 20;
        else if (age <= 8) A += 10;
        else               A += 5;

        // [B] Temporal — chronic, slowly progressive or incidental
        var B = 0;
        if      (oc === 'chronic')  B = 45;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15;
        else                        { B = 5; flags.push('Peracute — uncommon for arachnoid cyst'); }

        // [C] Pain — usually absent
        var C = 0;
        if      (pl === 'none')    C = 35;
        else if (pl === 'at-site') C = 15;
        else                       C = 10;

        // [D] Deficit — cerebellar signs ± paradoxical vestibular
        var D = 0;
        if (hasHeadTilt(s))      D += 20;
        if (cerebellarSigns(s))  D += 25;
        if (!mentalDepressed(s)) D += 15;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (oc === 'peracute') { mult *= 0.2; flags.push('Peracute — arachnoid cysts rarely present acutely (×0.2)'); }
        if (s.progression === 'stable' && oc === 'chronic') {
            mult *= 1.3; flags.push('Stable chronic — consistent with slowly expanding arachnoid cyst (×1.3)');
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain (T1/T2 — CSF-intensity extra-axial cyst posterior fossa; phase-contrast for flow)',
        'CT (if MRI unavailable — hypodense non-enhancing cyst)',
        'CSF analysis (usually normal)',
        'Surgical fenestration or cysto-peritoneal shunt if progressive',
        'Conservative management if mild and stable'
    ]
},

// ── 7. Metronidazole Toxicity — Cerebellar / Paradoxical Vestibular ───────
{ id: 'pv-toxic', name: 'Metronidazole Toxicity — Cerebellar / Paradoxical Vestibular', category: 'Toxic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A] Signalment — any breed/age; drug history is key
        var A = 30;

        // [B] Temporal — acute after drug initiation
        var B = 0;
        if      (oc === 'acute' || oc === 'peracute') B = 45;
        else if (oc === 'subacute')                   B = 30;
        else                                          B = 10;

        // [C] Pain — absent (toxic)
        var C = 0;
        if (pl === 'none') C = 35;
        else               C = 10;

        // [D] Deficit — cerebellar + vestibular
        var D = 0;
        if (cerebellarSigns(s))                                                                  D += 30;
        if (hasHeadTilt(s))                                                                      D += 15;
        if ((s.nystagmusR && s.nystagmusR !== 'none') || (s.nystagmusL && s.nystagmusL !== 'none')) D += 15;
        if (!mentalDepressed(s))                                                                 D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (s.recentNeurologicDrug === 'metronidazole') {
            mult *= 2.0; flags.push('Metronidazole history — strongly supports drug toxicity (×2.0)');
        } else if (!s.recentNeurologicDrug || s.recentNeurologicDrug === 'none') {
            mult *= 0.4; flags.push('No drug history — toxicity less likely without it (×0.4)');
        } else {
            mult *= 0.5; flags.push('Different drug noted — verify neurotoxic potential (×0.5)');
        }

        alerts.push({
            type: 'WARNING',
            title: 'Stop Metronidazole — Diazepam Protocol',
            text: 'STOP metronidazole immediately. Diazepam 0.5 mg/kg IV bolus → 0.5 mg/kg/h CRI for 24-48h accelerates recovery. Most dogs recover within 1-2 weeks of cessation.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Drug history (metronidazole dose + duration — >60 mg/kg/day is high risk)',
        'MRI brain (bilateral symmetric cerebellar dentate nuclei T2 hyperintensity — classic)',
        'CSF analysis (usually normal)',
        'Stop drug + supportive care',
        'Diazepam CRI (accelerates recovery)'
    ]
}

];

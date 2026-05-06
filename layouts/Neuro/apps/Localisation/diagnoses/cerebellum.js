// Cerebellum diagnoses — rewritten from DDX-main/src/regions/Cerebellum.js in our style.
// Uses OUR parameter names directly (no normalise adapter).

app.diagnoses = app.diagnoses || {};
app.diagnoses['cerebellum'] = [

// ── 1. Cerebellar Cortical Abiotrophy (CCA) ────────────────────────────
{ id: 'cb-abiotrophy', name: 'Cerebellar Cortical Abiotrophy (CCA)', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        // KB breed list: Airedale Terrier, Coton de Tulear, American Staffordshire Terrier;
        // overlap: Beagle, Gordon Setter, Rough Collie, Labrador Retriever
        var ccaBreeds = ['Beagle', 'Gordon Setter', 'Rough Collie', 'Labrador Retriever',
            'Airedale Terrier', 'Coton de Tulear', 'American Staffordshire Terrier',
            'Australian Kelpie', 'Brittany Spaniel', 'Old English Sheepdog',
            'Scottish Terrier', 'Finnish Harrier'];
        if (isBreed(s, ccaBreeds)) A += 30;
        if      (age < 1) A += 30;
        else if (age < 2) A += 25;
        else if (age < 4) A += 10;
        else              { flags.push('Age >4y — CCA usually manifests before 2y'); }

        var B = 0;
        if      (oc === 'chronic')  B = 40;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15;
        else                        B = 5;

        var C = 0;
        if (pl === 'none') C = 40;
        else               { C = 10; flags.push('Pain present — pure CCA is painless; consider tumor or inflammatory overlay'); }

        var D = 0;
        if ((hasValue(s, 'gait', 'hypermetria L') || hasValue(s, 'gait', 'hypermetria R')))                                D += 30;
        if (hasValue(s, 'gait', 'head tremor'))                                D += 20;
        if (!mentalDepressed(s))                                               D += 10;
        if (hasValue(s, 'gait', 'ataxia') || (hasValue(s, 'gait', 'hypermetria L') || hasValue(s, 'gait', 'hypermetria R'))) D += 5;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (!cerebellarSigns(s)) { mult *= 0.3; flags.push('No dysmetria or intention tremor — CCA less likely (×0.3)'); }
        if (age > 5)             { mult *= 0.3; flags.push('Age >5y — late-onset CCA very unusual (×0.3)'); }
        if (pl !== 'none')       { mult *= 0.5; flags.push('Pain present — atypical for pure CCA (×0.5)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain (cerebellar cortical atrophy on T2/FLAIR)',
        'CSF analysis (usually normal — rules out inflammatory)',
        'Genetic testing (breed-specific mutations)',
        'BAER (vestibulocochlear function)',
        'No specific treatment — supportive care, physiotherapy',
        'Prognosis varies by breed (some stable, some slowly progressive)'
    ]
},

// ── 2. Cerebellar Tumor (Medulloblastoma / Meningioma) ─────────────────
{ id: 'cb-tumor', name: 'Cerebellar Tumor (Medulloblastoma/Meningioma)', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        if      (age < 2)  { A += 20; flags.push('Age <2y — medulloblastoma possible'); }
        else if (age >= 8) { A += 25; flags.push('Age ≥8y — cerebellar meningioma more likely'); }
        else                 A += 10;
        if (isBreed(s, predispositions.large)) A += 10;

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
        if ((hasValue(s, 'gait', 'hypermetria L') || hasValue(s, 'gait', 'hypermetria R'))) D += 25;
        if (hasValue(s, 'gait', 'head tremor')) D += 15;
        if (hasHeadTilt(s))                     D += 15;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (oc === 'peracute')    { mult *= 0.4; flags.push('Peracute onset — stroke more likely than tumor (×0.4)'); }
        if (!cerebellarSigns(s))  { mult *= 0.4; flags.push('No dysmetria or intention tremor — cerebellar tumor less supported (×0.4)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain with contrast (cerebellar mass — ring-enhancing or meningeal)',
        'CSF analysis (cytology)',
        'Thoracic + abdominal imaging (staging)',
        'Neurosurgery referral (posterior fossa approach)',
        'Radiation therapy'
    ]
},

// ── 3. Cerebellar Ischemic Stroke ──────────────────────────────────────
{ id: 'cb-stroke', name: 'Cerebellar Ischemic Stroke', category: 'Vascular',
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
        if (s.breed === 'Greyhound' || s.breed === 'Cavalier King Charles Spaniel') {
            A += 10; flags.push('Greyhound/CKCS — predisposed to cerebellar stroke');
        }

        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 25;
        else                        B = 5;

        var C = 0;
        if      (pl === 'none')    C = 30;
        else if (pl === 'at-site') C = 15;
        else                       C = 10;

        var D = 0;
        if ((hasValue(s, 'gait', 'hypermetria L') || hasValue(s, 'gait', 'hypermetria R')))    D += 25;
        if (hasHeadTilt(s))                        D += 20;
        if ((s.nystagmusR && s.nystagmusR !== 'none') || (s.nystagmusL && s.nystagmusL !== 'none')) D += 15;
        if (s.asymmetry && s.asymmetry !== 'none') D += 15;
        if (s.progression === 'stable')            D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 8;
        var mult = 1;
        if (oc === 'peracute' && pl === 'none')    { mult *= 1.5; flags.push('Peracute + painless — cerebellar stroke signature (×1.5)'); }
        if (oc === 'chronic' || oc === 'subacute') { mult *= 0.2; flags.push('Chronic/subacute onset — argues against stroke (×0.2)'); }

        alerts.push({
            type: 'INFO',
            title: 'Underlying Cause Workup Required',
            text: 'Cerebellar stroke: screen for hypertension, hyperadrenocorticism, hypothyroidism, renal disease (proteinuria), coagulopathy, cardiac emboli.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain (DWI/FLAIR — cerebellar hyperintense lesion)',
        'Blood pressure',
        'UCCR / low-dose dex (hyperadrenocorticism)',
        'Total T4 (hypothyroidism)',
        'Urinalysis + UPC (renal disease)',
        'Coagulation panel (PT/aPTT)',
        'Echocardiography (cardiac emboli)'
    ]
},

// ── 4. Metronidazole / Drug Toxicity (Cerebellar) ──────────────────────
{ id: 'cb-toxic', name: 'Metronidazole / Drug Toxicity (Cerebellar)', category: 'Toxic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        var A = 30;

        var B = 0;
        if      (oc === 'acute' || oc === 'peracute') B = 45;
        else if (oc === 'subacute')                   B = 30;
        else                                          B = 10;

        var C = 0;
        if (pl === 'none') C = 35;
        else               C = 10;

        var D = 0;
        if ((hasValue(s, 'gait', 'hypermetria L') || hasValue(s, 'gait', 'hypermetria R')))    D += 30;
        if (hasValue(s, 'gait', 'head tremor'))    D += 20;
        if ((s.nystagmusR && s.nystagmusR !== 'none') || (s.nystagmusL && s.nystagmusL !== 'none')) D += 15;

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
},

// ── 5. Neospora caninum — Cerebellar Encephalitis ──────────────────────
{ id: 'cb-neospora', name: 'Neospora caninum — Cerebellar Encephalitis', category: 'Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        if (isBreed(s, ['Labrador Retriever'])) A += 20;
        if      (age < 1) { A += 30; flags.push('Age <1y — Neospora cerebellar encephalitis peaks in puppies'); }
        else if (age < 3)   A += 20;
        else if (age < 6)   A += 10;
        else                { A += 5; flags.push('Age >6y — Neospora CNS less common in older dogs'); }

        var B = 0;
        if      (oc === 'subacute') B = 45;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'chronic')  B = 20;
        else                        { B = 10; flags.push('Peracute onset — less typical for Neospora (usually progressive)'); }

        var C = 0;
        if      (pl === 'at-site') C = 25;
        else if (pl === 'none')    C = 25;
        else                       C = 15;

        var D = 0;
        if ((hasValue(s, 'gait', 'hypermetria L') || hasValue(s, 'gait', 'hypermetria R')))                                      D += 25;
        if (hasValue(s, 'gait', 'head tremor'))                                      D += 15;
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'tetraparesis')) D += 20;
        if (mentalDepressed(s))                                                      D += 10;
        if (s.fever === 'yes')                                                       D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 5;
        var mult = 1;
        if (age >= 1 && oc === 'peracute') { mult *= 0.3; flags.push('Peracute in dog >1y — Neospora unlikely (×0.3)'); }
        if (s.progression === 'worsening') { mult *= 1.2; flags.push('Progressive worsening — consistent with Neospora (×1.2)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Neospora caninum serology (IFA titres ≥1:800 strongly supportive)',
        'CSF analysis — mononuclear/mixed pleocytosis',
        'CSF PCR (Neospora caninum)',
        'MRI brain + spine (multifocal enhancing lesions)',
        'CBC/biochemistry (systemic involvement)',
        'Treatment: clindamycin 12.5 mg/kg PO q12h OR trimethoprim-sulfadiazine 15 mg/kg q12h — start early',
        'Prognosis guarded if spinal involvement (rigid limb contracture)'
    ]
},

// ── 6. CDV Cerebellar Encephalitis ─────────────────────────────────────
{ id: 'cb-cdv', name: 'Canine Distemper Virus (CDV) — Cerebellar Encephalitis', category: 'Infectious',
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
        else if (pl === 'none')    C = 25;
        else                       C = 15;

        var D = 0;
        if ((hasValue(s, 'gait', 'hypermetria L') || hasValue(s, 'gait', 'hypermetria R'))) D += 25;
        if (hasValue(s, 'gait', 'head tremor')) D += 15;
        if (hasValue(s, 'gait', 'myoclonus'))   { D += 30; flags.push('Myoclonus — highly characteristic of CDV (~40% of cases); no other cerebellar disease causes this'); }
        if (mentalDepressed(s))                 D += 10;
        if (s.fever === 'yes')                  D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 5;
        var mult = 1;
        if (age >= 2 && age < 7)          { mult *= 0.5; flags.push('Age 2-6y vaccinated population — CDV less likely (×0.5)'); }
        if (s.fever === 'yes' && age < 2) { mult *= 1.3; flags.push('Fever in young dog — CDV encephalitis supported (×1.3)'); }
        if (hasValue(s, 'gait', 'myoclonus')) { mult *= 1.5; flags.push('Myoclonus present — CDV strongly favoured (×1.5)'); }

        alerts.push({
            type: 'WARNING',
            title: 'CDV — Highly Contagious / Isolate Immediately',
            text: 'If CDV confirmed or suspected: isolate immediately — highly contagious to unvaccinated dogs. Treatment is supportive. Obtain vaccination history. CDV myoclonus may persist even after recovery.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CDV serology (IgM acute phase) or CSF PCR (most specific)',
        'MRI brain (multifocal white matter T2 hyperintensity, cerebellar involvement)',
        'CSF analysis (mononuclear pleocytosis, CDV IgG in CSF)',
        'CBC (lymphopenia in acute phase)',
        'Vaccination history (unvaccinated / incomplete series)',
        'Treatment: supportive — anticonvulsants for seizures; myoclonus does not respond to treatment'
    ]
},

// ── 7. Immune-Mediated Meningoencephalitis (GME/NME/NLE) — Cerebellar ──
{ id: 'cb-imme', name: 'Immune-Mediated Meningoencephalitis (GME/NME/NLE) — Cerebellar', category: 'Inflammatory/Immune',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        var immeBreeds = ['Pug', 'Maltese', 'Yorkshire Terrier', 'Chihuahua', 'French Bulldog',
            'Toy Poodle', 'Miniature Poodle', 'Poodle', 'West Highland White Terrier', 'Boston Terrier'];
        if (isBreed(s, immeBreeds))               { A += 30; flags.push('IMME-predisposed breed (GME/NME/NLE)'); }
        else if (isBreed(s, predispositions.toy))   A += 15;
        if      (age >= 1 && age <= 6) A += 20;
        else if (age > 6 && age <= 9)  A += 10;
        else                           A += 5;

        var B = 0;
        if      (oc === 'subacute') B = 45;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'chronic')  B = 20;
        else                        B = 10;

        var C = 0;
        if      (pl === 'at-site') C = 35;
        else if (pl === 'none')    C = 20;
        else                       C = 15;

        var D = 0;
        if ((hasValue(s, 'gait', 'hypermetria L') || hasValue(s, 'gait', 'hypermetria R')))                                        D += 20;
        if (hasValue(s, 'gait', 'head tremor'))                                        D += 15;
        if (mentalDepressed(s))                                                        D += 15;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'paraparesis')) D += 15;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 10;
        var mult = 1;
        if (s.fever === 'yes' && pl === 'at-site') { mult *= 1.3; flags.push('Fever + cervical pain — meningoencephalitis pattern (×1.3)'); }
        if (age > 10)                               { mult *= 0.6; flags.push('Age >10y — tumor more likely than IMME (×0.6)'); }
        if (!cerebellarSigns(s))                    { mult *= 0.5; flags.push('No cerebellar signs — consider forebrain localization for IMME (×0.5)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain with contrast (multifocal/focal enhancing lesions; cerebellar involvement)',
        'CSF analysis — pleocytosis (mononuclear/mixed), elevated protein',
        'Infectious panel: CDV, Neospora, Toxoplasma, Cryptococcus, Ehrlichia',
        'CSF PCR panel (CDV, Neospora, Toxoplasma)',
        'NME genetic testing (Pug: LRRTM3; post-mortem histopathology for definitive diagnosis)',
        'Treatment: prednisolone ± cytarabine (or CCNU) — referral recommended'
    ]
},

// ── 8. Steroid-Responsive Tremor Syndrome ──────────────────────────────
{ id: 'cb-shaker', name: 'Steroid-Responsive Tremor Syndrome', category: 'Inflammatory',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        var shakerBreeds = ['Maltese', 'West Highland White Terrier', 'Bichon Frise', 'Poodle',
            'Toy Poodle', 'Miniature Poodle', 'Beagle', 'Dachshund'];
        if (isBreed(s, shakerBreeds))             { A += 35; flags.push('Predisposed breed — Steroid-Responsive Tremor Syndrome strongly supported'); }
        else if (isBreed(s, predispositions.toy))   A += 20;
        else                                      { A += 5; flags.push('Non-toy/white breed — shaker syndrome less typical but possible'); }
        if      (age >= 1 && age <= 5) A += 25;
        else if (age < 1)               A += 10;
        else                           { A += 5; flags.push('Age >5y — shaker syndrome less common; consider other cerebellar disease'); }

        var B = 0;
        if      (oc === 'acute')    B = 45;
        else if (oc === 'subacute') B = 40;
        else if (oc === 'peracute') B = 25;
        else                        B = 10;

        var C = 0;
        if (pl === 'none') C = 40;
        else               { C = 10; flags.push('Pain present — unusual for corticosteroid-responsive tremor syndrome'); }

        var D = 0;
        if (hasValue(s, 'gait', 'head tremor')) { D += 35; flags.push('Head/body tremor — hallmark of shaker syndrome'); }
        if ((hasValue(s, 'gait', 'hypermetria L') || hasValue(s, 'gait', 'hypermetria R'))) D += 15;
        if (!mentalDepressed(s))                D += 15;
        if ((s.nystagmusR && s.nystagmusR !== 'none') || (s.nystagmusL && s.nystagmusL !== 'none')) D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (mentalDepressed(s))  { mult *= 0.4; flags.push('Mental depression — atypical for shaker syndrome (×0.4)'); }
        if (s.fever === 'yes')   { mult *= 0.5; flags.push('Fever — shaker syndrome is typically afebrile (×0.5)'); }
        if (oc === 'chronic')    { mult *= 0.5; flags.push('Chronic onset — less typical for shaker syndrome (×0.5)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain (rule out structural cerebellar lesion — usually normal in shaker syndrome)',
        'CSF analysis (mild lymphocytic pleocytosis in some cases)',
        'Infectious panel (Neospora, Toxoplasma, CDV, Cryptococcus)',
        'CBC/biochemistry (rule out metabolic/toxic causes)',
        'Prednisolone trial 1-2 mg/kg/day — response within 1-2 weeks is diagnostic',
        'Taper steroids over 3-6 months; most dogs achieve remission'
    ]
},

// ── 9. Intracranial Arachnoid Cyst — Posterior Fossa ───────────────────
{ id: 'cb-arachnoid', name: 'Intracranial Arachnoid Cyst — Posterior Fossa', category: 'Anomalous/Congenital',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        if (isBreed(s, predispositions.screwTail))    { A += 35; flags.push('ScrewTail/brachycephalic breed — highest risk for intracranial arachnoid cyst'); }
        else if (isBreed(s, predispositions.toy))       A += 15;
        else if (isBreed(s, predispositions.chondro))   A += 15;
        else                                            A += 5;
        if      (age <= 4) A += 20;
        else if (age <= 8) A += 10;
        else               A += 5;

        var B = 0;
        if      (oc === 'chronic')  B = 45;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15;
        else                        { B = 5; flags.push('Peracute onset — uncommon for arachnoid cyst (unless acute decompensation)'); }

        var C = 0;
        if      (pl === 'none')    C = 35;
        else if (pl === 'at-site') C = 15;
        else                       C = 10;

        var D = 0;
        if ((hasValue(s, 'gait', 'hypermetria L') || hasValue(s, 'gait', 'hypermetria R'))) D += 25;
        if (hasValue(s, 'gait', 'head tremor')) D += 15;
        if (!mentalDepressed(s))                D += 15;
        if (mentalDepressed(s))                 D += 10; // can occur if hydrocephalus

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (oc === 'peracute')     { mult *= 0.2; flags.push('Peracute — arachnoid cysts rarely present acutely (×0.2)'); }
        if (s.progression === 'stable' && oc === 'chronic') {
            mult *= 1.3; flags.push('Stable chronic course — consistent with slowly expanding arachnoid cyst (×1.3)');
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain (T1/T2 — CSF-intensity extra-axial cyst posterior fossa; phase-contrast for flow)',
        'CT (if MRI unavailable — hypodense non-enhancing cyst)',
        'CSF analysis (usually normal; rule out inflammatory)',
        'Surgical decompression (fenestration or cysto-peritoneal shunt) if progressive',
        'Many cases managed conservatively if mild and stable'
    ]
},

// ── 10. Cerebellar Hypoplasia ──────────────────────────────────────────
{ id: 'cb-hypoplasia', name: 'Cerebellar Hypoplasia', category: 'Anomalous/Congenital',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 20; // base — any breed/age possible
        if      (age < 1) { A += 35; flags.push('Age <1y — cerebellar hypoplasia presents from birth/weaning'); }
        else if (age < 2)   A += 15;
        else                { A += 0; flags.push('Age >2y — cerebellar hypoplasia should have been apparent since puppyhood'); }

        var B = 0;
        if      (oc === 'chronic' || oc === 'subacute') B = 45;
        else if (oc === 'acute')                        B = 15;
        else                                            B = 5;

        var C = 0;
        if (pl === 'none') C = 40;
        else               { C = 5; flags.push('Pain present — unexpected for cerebellar hypoplasia; reconsider diagnosis'); }

        var D = 0;
        if ((hasValue(s, 'gait', 'hypermetria L') || hasValue(s, 'gait', 'hypermetria R'))) D += 30;
        if (hasValue(s, 'gait', 'head tremor')) D += 25;
        if (!mentalDepressed(s))                D += 15;
        if ((s.nystagmusR && s.nystagmusR !== 'none') || (s.nystagmusL && s.nystagmusL !== 'none')) D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (s.progression === 'worsening')  { mult *= 0.1; flags.push('Progressive worsening — hypoplasia is STATIC; consider degenerative/inflammatory cerebellar disease (×0.1)'); }
        if (s.progression === 'stable')     { mult *= 1.5; flags.push('Non-progressive/stable — hallmark of cerebellar hypoplasia (×1.5)'); }
        if (oc === 'peracute')              { mult *= 0.1; flags.push('Peracute onset — cerebellar hypoplasia signs are present from birth, not sudden (×0.1)'); }
        if (age > 3)                        { mult *= 0.3; flags.push('Age >3y — cerebellar hypoplasia would have been evident from puppyhood (×0.3)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain (small/hypoplastic cerebellum — T2 normal signal differentiates from abiotrophy)',
        'Detailed history (signs from birth vs. onset later — static vs. progressive)',
        'CDV serology/PCR (in utero CDV can cause cerebellar hypoplasia)',
        'CSF analysis (usually normal)',
        'No treatment — manage with environmental modifications',
        'Prognosis for life good if signs are mild-moderate and static; owner education essential'
    ]
}

];

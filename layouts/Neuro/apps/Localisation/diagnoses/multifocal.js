// Multifocal diagnoses — rewritten from DDX-main/src/regions/Multifocal.js in our style.
// Single localisation 'Multifocal'. The 4 trigger patterns in multifocalRules.js
// all produce the same 'Multifocal' entry; evidence lines record which pattern(s) fired.

app.diagnoses = app.diagnoses || {};

app.diagnoses['multifocal'] = [

// ── 1. Immune-Mediated Meningoencephalitis (GME / NME / NLE) ─────────────
{ id: 'mf-imme', name: 'Immune-Mediated Meningoencephalitis (GME / NME / NLE)', category: 'Inflammatory/Immune',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 0;
        var immeBreeds = ['Maltese', 'Yorkshire Terrier', 'Toy Poodle', 'Miniature Poodle', 'Poodle',
            'Chihuahua', 'Pug', 'West Highland White Terrier', 'Boston Terrier', 'French Bulldog',
            'Dachshund'];
        if (isBreed(s, immeBreeds))               { A += 30; flags.push('IMME-predisposed breed (GME/NME/NLE)'); }
        else if (isBreed(s, predispositions.toy))  A += 15;
        if      (age >= 1 && age <= 6) A += 25;
        else if (age > 6 && age <= 9)  A += 15;
        else if (age > 9)              { A += 5; flags.push('Age >9y — tumour more likely than IMME at this age'); }
        else                           A += 5;

        var B = 0;
        if      (oc === 'subacute') B = 45;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'chronic')  B = 20;
        else                        B = 15;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        var C = 0;
        if      (pl === 'at-site') C = 35;
        else if (pl === 'none')    C = 15;
        else                       C = 20;

        var D = 0;
        if (hasSeizures)                                                      D += 20;
        if (mentalDepressed(s))                                                D += 15;
        if (cerebellarSigns(s))                                                D += 15;
        if (centralVestibularSigns(s))                                         D += 15;
        if ((hasValue(s, 'gait', 'circling L') || hasValue(s, 'gait', 'circling R')))                                   D += 10;
        if (s.menaceResponseR === 'absent' || s.menaceResponseL === 'absent')  D += 10;
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'tetraparesis')) D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 10;
        var mult = 1;
        if (isBreed(s, immeBreeds))  { mult *= 1.5; flags.push('IMME-predisposed breed — strong support (×1.5)'); }
        if (age > 10)                { mult *= 0.4; flags.push('Age >10y — neoplastic cause more likely (×0.4)'); }
        if (s.fever === 'yes' && pl === 'at-site') { mult *= 1.2; flags.push('Fever + pain — meningoencephalitis pattern (×1.2)'); }
        if (breedKnown(s) && !isBreed(s, immeBreeds) && !isBreed(s, predispositions.toy)) {
            mult *= 0.5; flags.push('Not an IMME-predisposed breed — infectious or neoplastic more likely (×0.5)');
        }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain ± entire spine with contrast (multifocal enhancing lesions — characteristic pattern)',
        'CSF analysis (mononuclear/mixed pleocytosis, elevated protein)',
        'Infectious panel BEFORE immunosuppression: CDV PCR, Toxoplasma/Neospora IgG/PCR, Cryptococcal antigen, Ehrlichia/Rickettsia serology',
        'NME: Pug — LRRTM3 genetic association; MRI shows asymmetric necrotic forebrain lesions',
        'Definitive Dx: histopathology (brain biopsy or post-mortem)',
        'Treatment: prednisolone 2 mg/kg/day ± cytarabine 200 mg/m² IV over 8h q3weeks (or CCNU)',
        'Prognosis: GME — months to years with treatment; NME/NLE — guarded, often <6 months'
    ]
},

// ── 2. Canine Distemper Virus (CDV) Encephalitis — Multifocal ─────────────
{ id: 'mf-cdv', name: 'Canine Distemper Virus (CDV) Encephalitis — Multifocal', category: 'Inflammatory/Infectious',
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
        if (hasSeizures)                                                              D += 15;
        if (mentalDepressed(s))                                                        D += 15;
        if (cerebellarSigns(s))                                                        D += 15;
        if (centralVestibularSigns(s))                                                 D += 10;
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'tetraparesis')) D += 10;
        if (hasMyoclonus) {
            D += 30; flags.push('Myoclonus — highly characteristic of CDV (~40% of cases); near-confirms diagnosis when present');
        }

        var sysBonus = 0;
        if (s.fever === 'yes')          { sysBonus += 20; flags.push('Fever — systemic CDV'); }
        if (s.cough === 'yes')          { sysBonus += 15; flags.push('Cough — respiratory CDV (STRONG support)'); }
        if (s.nasalDischarge === 'yes')   sysBonus += 10;
        if (s.vomiting === 'yes' || s.diarrhea === 'yes') sysBonus += 5;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + sysBonus + 10;
        var mult = 1;
        if (hasMyoclonus) { mult *= 1.5; flags.push('Myoclonus — CDV multiplier (×1.5)'); }
        if (s.vaccinated === 'yes' || s.vaccinated === 'upToDate') {
            mult *= 0.3; flags.push('Vaccinated — CDV unlikely but breakthrough possible (×0.3)');
        }
        if (oc === 'chronic' && !hasMyoclonus) { mult *= 0.3; flags.push('Chronic without myoclonus — consider IMME (×0.3)'); }

        alerts.push({
            type: 'CRITICAL',
            title: 'Suspected CDV — Isolation Required',
            text: 'CDV is highly contagious. ISOLATE the patient immediately. CDV PCR (nasal swab, urine, CSF). Check vaccination history. No specific antiviral. CHRONIC INFLAMMATORY PHASE: prednisolone 2 mg/kg bid × 15d, then taper; only when CBC normal and no systemic signs. Anticonvulsants if seizures (phenobarbital/levetiracetam). Screen for coinfections: Neospora caninum, Toxoplasma gondii, Hepatozoon canis. Prognosis: ~75% die or require euthanasia; ~25% acceptable sequelae.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CDV PCR — nasal/conjunctival swab + urine + CSF (highest sensitivity combination)',
        'CDV serology (IgM — acute infection)',
        'MRI brain ± spine (periventricular white matter lesions, demyelination, multifocal)',
        'CSF analysis (lymphocytic pleocytosis, CDV PCR on CSF)',
        'CBC (lymphopenia in acute phase)',
        'ISOLATION mandatory — highly contagious',
        'Supportive care: seizure control (phenobarbital), IV fluids, nursing',
        'Prognosis: neurological form poor long-term'
    ]
},

// ── 3. Tick-Borne Meningoencephalitis (Ehrlichia / Rickettsia) ─────────────
{ id: 'mf-tickborne', name: 'Tick-Borne Meningoencephalitis (Ehrlichia canis / Rickettsia rickettsii)', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 25;

        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 45;
        else if (oc === 'subacute')                   B = 30;
        else if (oc === 'chronic')                    B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        var C = 0;
        if      (pl === 'at-site') C = 40;
        else if (pl === 'none')    C = 10;
        else                       C = 20;

        var D = 0;
        if (hasSeizures)                                                              D += 15;
        if (mentalDepressed(s))                                                        D += 15;
        if (cerebellarSigns(s))                                                        D += 10;
        if (centralVestibularSigns(s))                                                 D += 10;
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'tetraparesis')) D += 10;
        if ((hasValue(s, 'gait', 'circling L') || hasValue(s, 'gait', 'circling R')))                                           D += 10;

        var sysBonus = 0;
        if (s.fever === 'yes')     { sysBonus += 30; flags.push('Fever — MAJOR sign for both Ehrlichia and Rickettsia'); }
        if (s.weightLoss === 'yes')  sysBonus += 10;
        if (s.anorexia === 'yes')    sysBonus += 5;
        if (s.lethargy === 'yes')    sysBonus += 5;
        if (s.petechiae === 'yes') { sysBonus += 20; flags.push('Petechiae/ecchymoses — thrombocytopenia; STRONG sign for tick-borne disease'); }
        if (s.limbEdema === 'yes') { sysBonus += 15; flags.push('Limb oedema — vasculitis; more typical of Rickettsia'); }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + sysBonus + 10;
        var mult = 1;
        if (s.fever === 'yes' && (oc === 'peracute' || oc === 'acute')) {
            mult *= 1.4; flags.push('Fever + acute/peracute — tick-borne meningoencephalitis pattern (×1.4)');
        }
        if (s.fever !== 'yes') { mult *= 0.2; flags.push('No fever — tick-borne meningoencephalitis is always febrile; afebrile presentation makes it unlikely (×0.2)'); }

        alerts.push({
            type: 'CRITICAL',
            title: '⚠️ SAFETY CRITICAL — Doxycycline BEFORE Corticosteroids',
            text: 'Ehrlichia AND Rickettsia: start doxycycline 10 mg/kg PO/IV q24h IMMEDIATELY. DO NOT give corticosteroids before ruling out tick-borne disease — corticosteroids in Rickettsia can be FATAL. Check CBC (thrombocytopenia hallmark). Ehrlichia IFAT + PCR; Rickettsia PCR + paired serology. Petechiae + fever + acute multifocal CNS = tick-borne until proven otherwise.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        '⚠️ Start doxycycline 10 mg/kg PO q24h immediately — do NOT wait for results',
        'CBC — thrombocytopenia (<50,000/μL) hallmark of both; if present, treat without delay',
        'Ehrlichia canis IFAT (≥1:80) + PCR (blood)',
        'Rickettsia rickettsii PCR (blood — first 5 days) + IgG/IgM IFAT (paired titres)',
        'Coagulation panel (DIC risk with Rickettsia)',
        'MRI brain ± spine with contrast (meningeal enhancement, multifocal lesions)',
        'CSF analysis (neutrophilic or mixed pleocytosis)',
        'Blood pressure (vasculitis → hypotension in Rickettsia)'
    ]
},

// ── 4. Infectious Meningoencephalitis — Multifocal ────────────────────────
{ id: 'mf-infectious', name: 'Infectious Meningoencephalitis — Multifocal (Bacterial / Fungal / Protozoal / Leishmania)', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;
        var hasSeizures = s.epilepticSeizures === 'yes';
        var hasParaTetra = hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'tetraparesis');

        var A = 0;
        if      (age < 2)              { A = 30; flags.push('Age <2y — bacterial or protozoal (Neospora) more common'); }
        else if (age >= 2 && age <= 8)  A = 25;
        else                            A = 20;
        if (s.immunosuppressed === 'yes') { A = Math.min(50, A + 15); flags.push('Immunosuppressed — fungal (Cryptococcus) elevated risk'); }

        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 40;
        else if (oc === 'subacute')                   B = 35;
        else if (oc === 'chronic')                    B = 25;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        var C = 0;
        if      (pl === 'at-site') C = 40;
        else if (pl === 'none')    C = 10;
        else                       C = 20;

        var D = 0;
        if (hasSeizures)               D += 15;
        if (mentalDepressed(s))        D += 15;
        if (cerebellarSigns(s))        D += 10;
        if (centralVestibularSigns(s)) D += 10;
        if (hasParaTetra)              D += 10;

        var sysBonus = 0;
        if (s.fever === 'yes')           { sysBonus += 25; flags.push('Fever — infectious meningoencephalitis elevated'); }
        if (s.nasalDischarge === 'yes')  { sysBonus += 10; flags.push('Nasal discharge/mass — Cryptococcus nasal involvement (nasal cytology/culture)'); }
        if (s.skinLesions === 'yes')     { sysBonus += 10; flags.push('Skin lesions — Leishmaniasis (exfoliative dermatitis, hyperkeratosis)'); }
        if (s.lymphadenopathy === 'yes') { sysBonus += 10; flags.push('Lymphadenopathy — Leishmania, protozoal, or disseminated fungal'); }
        if (s.weightLoss === 'yes')        sysBonus += 5;
        if (s.anorexia === 'yes')          sysBonus += 5;
        if (s.otitis === 'yes') { sysBonus += 15; flags.push('Otitis media/interna — primary source of bacterial meningoencephalitis in ~60% of cases; prioritise bacterial work-up'); }

        if (age < 2 && (s.extensorTonePelvicR === 'increased' || s.extensorTonePelvicL === 'increased')) {
            sysBonus += 20; flags.push('Young dog + pelvic limb rigidity — Neospora polyradiculoneuritis/encephalitis (STRONG sign)');
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + sysBonus + 10;
        var mult = 1;
        if (s.fever === 'yes' && pl === 'at-site' && (oc === 'peracute' || oc === 'acute')) {
            mult *= 1.4; flags.push('Fever + meningeal pain + acute — bacterial/suppurative meningoencephalitis pattern (×1.4)');
        }
        if (!s.fever && oc === 'chronic') { mult *= 0.5; flags.push('No fever + chronic — fungal or Leishmania more likely than bacterial (×0.5)'); }
        if (!hasSeizures && !mentalDepressed(s) && !cerebellarSigns(s) && !centralVestibularSigns(s) && !hasParaTetra && s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.55; flags.push('No neurological deficit + no systemic signs — infectious meningoencephalitis unlikely as sole pain presentation (×0.55)');
        }
        if (oc === 'chronic' && s.fever !== 'yes' && s.weightLoss !== 'yes' && s.anorexia !== 'yes') {
            mult *= 0.6; flags.push('Chronic onset + no systemic signs — infectious meningoencephalitis less likely; consider structural/degenerative (×0.6)');
        }

        alerts.push({
            type: 'URGENT',
            title: 'Collect CSF and Blood Cultures BEFORE Antibiotics',
            text: 'BACTERIAL: blood cultures + CSF culture before antibiotics. Broad-spectrum: amoxicillin-clavulanate + metronidazole. FUNGAL (Cryptococcus): cryptococcal antigen (latex agglutination) on serum and CSF; fluconazole ± amphotericin B. PROTOZOAL (Toxo/Neospora): IgG/IgM serology + PCR CSF; trimethoprim-sulpha + clindamycin ± pyrimethamine. LEISHMANIA: IFAT + quantitative PCR. DO NOT start corticosteroids before ruling out infectious causes.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CSF analysis (suppurative = bacterial; mixed = fungal/protozoal; mononuclear = fungal/Leishmania)',
        'CSF culture + sensitivity (bacterial — BEFORE antibiotics)',
        'CSF PCR panel: Toxoplasma, Neospora, Cryptococcus, CDV, Leptospira, Leishmania',
        'Blood culture (aerobic + anaerobic)',
        'Cryptococcal antigen — serum and CSF (latex agglutination — highly sensitive)',
        'Toxoplasma / Neospora serology (IgM + IgG; paired titres)',
        'Leishmania IFAT + quantitative PCR (blood + bone marrow)',
        'MRI brain ± spine with contrast (multifocal enhancing lesions, meningeal enhancement)',
        'CBC/biochemistry (leucocytosis with left shift = bacterial; mild changes = fungal/protozoal)',
        'NEVER start corticosteroids before ruling out infectious causes'
    ]
},

// ── 5. Multifocal CNS Neoplasia (Lymphoma / Metastatic) ───────────────────
{ id: 'mf-neoplastic', name: 'Multifocal CNS Neoplasia (Lymphoma / Metastatic)', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;
        var hasSeizures = s.epilepticSeizures === 'yes';

        var A = 0;
        if      (age >= 8) A = 35;
        else if (age >= 5) A = 25;
        else if (age >= 3) A = 15;
        else               { A = 5; flags.push('Age <3y — multifocal neoplasia uncommon; consider IMME or CDV'); }
        if (isBreed(s, predispositions.large)) A += 10;
        var hsaBreeds = ['German Shepherd', 'Golden Retriever', 'Labrador Retriever'];
        if (isBreed(s, hsaBreeds)) { A += 10; flags.push('HSA-predisposed breed — metastatic hemangiosarcoma most common multifocal CNS tumour in this breed'); }

        var B = 0;
        if      (oc === 'chronic')  B = 40;
        else if (oc === 'subacute') B = 35;
        else if (oc === 'acute')    B = 20;
        else                        B = 10;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        var C = 0;
        if      (pl === 'at-site') C = 25;
        else if (pl === 'none')    C = 20;
        else                       C = 15;

        var D = 0;
        if (hasSeizures)                                                              D += 15;
        if (mentalDepressed(s))                                                        D += 15;
        if (cerebellarSigns(s))                                                        D += 10;
        if (centralVestibularSigns(s))                                                 D += 10;
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'tetraparesis')) D += 10;

        var sysBonus = 0;
        if (s.weightLoss === 'yes')      { sysBonus += 15; flags.push('Weight loss — systemic neoplasia (lymphoma, metastatic)'); }
        if (s.lymphadenopathy === 'yes') { sysBonus += 25; flags.push('Lymphadenopathy — CNS lymphoma (STRONG sign; FNA peripheral node may be diagnostic)'); }
        if (s.anorexia === 'yes')          sysBonus += 5;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + sysBonus + 10;
        var mult = 1;
        if (age < 3) { mult *= 0.2; flags.push('Age <3y — multifocal neoplasia very unlikely (×0.2)'); }
        if (s.lymphadenopathy === 'yes') { mult *= 1.5; flags.push('Lymphadenopathy — CNS lymphoma pattern (×1.5)'); }
        if (oc === 'chronic' && s.progression === 'worsening' && age >= 7) {
            mult *= 1.3; flags.push('Chronic progressive + older dog — neoplastic cause elevated (×1.3)');
        }
        if (s.fever === 'yes' && pl === 'at-site' && oc === 'acute') {
            mult *= 0.5; flags.push('Fever + acute + meningeal pain — infectious more likely than neoplastic (×0.5)');
        }

        alerts.push({
            type: 'INFO',
            title: 'Staging Required — FNA Lymph Nodes Before CSF',
            text: 'CNS lymphoma: peripheral lymph node FNA may give diagnosis without CSF. Full staging: CBC (atypical lymphocytes), biochemistry, thoracic radiographs + abdominal ultrasound, bone marrow aspirate. Metastatic (hemangiosarcoma): abdominal ultrasound + echocardiography mandatory — primary tumour is usually splenic or cardiac. Treatment: CHOP-based chemotherapy for lymphoma; palliative for metastatic disease.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Peripheral lymph node FNA (cytology — CNS lymphoma often diagnosable from peripheral node)',
        'CBC (atypical lymphocytes, anaemia, thrombocytopenia)',
        'Biochemistry (hypercalcaemia — PTHrP in lymphoma; elevated liver enzymes)',
        'MRI brain ± spine with contrast (multifocal enhancing lesions, leptomeningeal spread)',
        'CSF analysis (cytology — neoplastic cells in ~50% of CNS lymphoma)',
        'Thoracic radiographs 3 views (pulmonary metastasis, mediastinal mass)',
        'Abdominal ultrasound (splenic mass — HSA; hepatomegaly; abdominal lymphadenopathy)',
        'Echocardiography (cardiac HSA — right atrial mass)',
        'Bone marrow aspirate (lymphoma staging)',
        'Treatment: lymphoma → CHOP chemotherapy; metastatic → palliative; prognosis poor in both'
    ]
},

// ── 6. Rabies Encephalitis — Multifocal ─────────────────────────────────
{ id: 'mf-rabies', name: 'Rabies Encephalitis — Multifocal (Furious + Dumb Forms)', category: 'Inflammatory/Infectious',
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
        if (s.behavior === 'aggressive')                                   { D += 30; flags.push('Aggression — cardinal sign of furious rabies; multifocal CNS involvement'); }
        if (s.swallowingFunction === 'dysphagia')                          { D += 25; flags.push('Dysphagia/pharyngeal spasm — brainstem CN IX/X; rabies hallmark (hydrophobia)'); }
        if (mentalDepressed(s))                                              D += 15;
        if (s.epilepticSeizures === 'yes')                                   D += 15;
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia')) {
            D += 15; flags.push('Ascending paralysis — dumb/paralytic rabies form; spinal cord involvement');
        }
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                               D += 10;
        if (s.gagReflex === 'decreased' || s.gagReflex === 'absent')         D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (s.vaccinated === 'yes' || s.vaccinated === 'upToDate') {
            mult *= 0.05; flags.push('Vaccinated — rabies near-excluded (×0.05)');
        }
        if (oc === 'chronic') { mult *= 0.05; flags.push('Chronic course — rabies always kills within days of neurological signs (×0.05)'); }
        if ((s.biteHistory === 'yes' || s.wildlifeExposure === 'yes') && (s.behavior === 'aggressive' || s.swallowingFunction === 'dysphagia')) {
            mult *= 1.5; flags.push('Exposure history + hallmark signs (aggression/dysphagia) — rabies must be top priority (×1.5)');
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

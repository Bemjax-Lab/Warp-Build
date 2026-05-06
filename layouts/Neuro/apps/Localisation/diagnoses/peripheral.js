// Peripheral (LMN / NMJ / Muscle) diagnoses — rewritten from DDX-main/src/regions/Peripheral.js in our style.
// Uses OUR parameter names directly (no normalise adapter).
// Diagnosis-only params (fever, vaccinated, cough, petechiae, ...) live in
// apps/Localisation/diagnoses/diagnosesParameters.json and are merged into the
// Parameters model at init — Parameters app renders them as extra categories.

app.diagnoses = app.diagnoses || {};
app.diagnoses['peripheral'] = [

// ── 1. Acute Polyradiculoneuritis (APR / Coonhound Paralysis) ──────────
{ id: 'peri-apr', name: 'Acute Polyradiculoneuritis (Coonhound Paralysis / Immune-mediated)', category: 'Inflammatory/Immune',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var lmnPelvic = ['decreased','absent'].indexOf(s.patellarReflexR) !== -1 ||
                        ['decreased','absent'].indexOf(s.patellarReflexL) !== -1 ||
                        ['decreased','absent'].indexOf(s.withdrawalPelvicR) !== -1 ||
                        ['decreased','absent'].indexOf(s.withdrawalPelvicL) !== -1;
        var lmnThoracic = ['decreased','absent'].indexOf(s.withdrawalThoracicR) !== -1 ||
                          ['decreased','absent'].indexOf(s.withdrawalThoracicL) !== -1;
        var flaccidTone = s.extensorTonePelvicR === 'decreased' ||
                          s.extensorTonePelvicL === 'decreased';

        var A = 20;
        if (age >= 1 && age <= 8) A += 10;

        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 40;
        else if (oc === 'subacute') B = 20;
        else                        B = 5;

        var C = 0;
        if (pl === 'none') C = 40;
        else               { C = 10; flags.push('Spinal pain present — APR is typically painless; consider IVDD or discospondylitis'); }

        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) D += 25;
        if (lmnPelvic)                                                                  D += 20;
        if (lmnThoracic)                                                                D += 15;
        if (flaccidTone)                                                                D += 10;
        if (!mentalDepressed(s))                                                        D += 15;
        if (s.tailPosture === 'flaccid')                                                D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (oc === 'peracute' && pl === 'none' && !mentalDepressed(s)) {
            mult *= 1.5; flags.push('Peracute + painless + normal mentation — APR signature (×1.5)');
        }
        if (mentalDepressed(s)) { mult *= 0.3; flags.push('Mental depression — peripheral neuropathy does not cause altered mentation (×0.3)'); }
        if (s.progression === 'worsening' && (parseFloat(s.duration) || 0) > 14) {
            mult *= 0.5; flags.push('Still worsening >14 days — consider inherited polyneuropathy or neoplastic (×0.5)');
        }

        alerts.push({
            type: 'INFO',
            title: 'APR — Intensive Nursing Care Essential',
            text: 'Acute polyradiculoneuritis: no specific treatment — intensive supportive care (bladder management, turning, physiotherapy, padded bedding). Most dogs recover in 2-6 months. Avoid raccoon exposure recurrence. Check for concurrent otitis (immune trigger).'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CSF analysis (cytoalbuminous dissociation — elevated protein, normal cell count)',
        'Electromyography (EMG) + nerve conduction studies (denervation potentials, decreased NCV)',
        'MRI spine (nerve root enhancement post-contrast)',
        'Raccoon exposure history (not always present in idiopathic APR)',
        'Serology: Neospora, Toxoplasma, CDV (rule out infectious polyradiculoneuritis)',
        'CBC/biochemistry (rule out metabolic causes)',
        'Treatment: supportive nursing only — no steroids (may worsen)'
    ]
},

// ── 2. Myasthenia Gravis (Acquired) ────────────────────────────────────
{ id: 'peri-mg', name: 'Myasthenia Gravis — Acquired', category: 'Inflammatory/Immune',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        var mgBreeds = ['Golden Retriever','Labrador Retriever','German Shepherd','Akita',
            'Dachshund','Scottish Terrier','Smooth Fox Terrier','Springer Spaniel'];
        if (isBreed(s, mgBreeds)) A += 20;
        if      ((age >= 2 && age <= 4) || (age >= 9 && age <= 13)) { A += 25; flags.push('Bimodal MG age peak (2-4y or 9-13y)'); }
        else if (age >= 5 && age <= 8)  A += 10;
        else                            A += 5;

        var B = 0;
        if      (oc === 'subacute')  B = 40;
        else if (oc === 'acute')     B = 30;
        else if (oc === 'chronic')   B = 25;
        else                         B = 15;

        var C = 0;
        if (pl === 'none') C = 35;
        else               { C = 10; flags.push('Spinal pain — atypical for myasthenia gravis'); }

        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'paraparesis')) D += 20;
        if (s.regurgitation === 'yes')                          { D += 25; flags.push('Regurgitation — megaesophagus in ~70% of generalized MG; strongly supports diagnosis'); }
        if (!mentalDepressed(s))                                D += 15;
        if (s.paroxysmalEvents === 'yes')                       { D += 20; flags.push('Episodic/exercise-induced weakness (fatigability) — PATHOGNOMONIC for NMJ disease; score weakness after exercise vs rest'); }
        if (s.gagReflex === 'decreased' || s.gagReflex === 'absent') D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (s.regurgitation === 'yes' && !mentalDepressed(s) && pl === 'none') {
            mult *= 1.5; flags.push('Regurgitation + normal mentation + painless — MG megaesophagus pattern (×1.5)');
        }
        if (s.paroxysmalEvents === 'yes' && !mentalDepressed(s) && pl === 'none') {
            mult *= 1.3; flags.push('Fatigability + normal mentation + painless — NMJ pattern strongly supports MG (×1.3)');
        }
        if (mentalDepressed(s)) { mult *= 0.3; flags.push('Mental depression — MG does not cause altered mentation (×0.3)'); }

        alerts.push({
            type: 'WARNING',
            title: 'Aspiration Pneumonia Risk — Elevate Head',
            text: 'Megaesophagus in MG carries high aspiration pneumonia risk. Feed upright (Bailey chair), small frequent meals, elevated food/water bowls. Thoracic radiographs to assess for aspiration. Pyridostigmine trial 1-3 mg/kg PO q8-12h — response within 24-48h supports diagnosis.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Acetylcholine receptor (AChR) antibody titre — serum (diagnostic if elevated)',
        'Thoracic radiographs (megaesophagus, aspiration pneumonia)',
        'Edrophonium (Tensilon) test — short-acting AChE inhibitor challenge',
        'EMG (decremental response on repetitive nerve stimulation)',
        'CT/MRI chest (thymoma — paraneoplastic MG)',
        'CBC/biochemistry + thyroid panel',
        'Treatment: pyridostigmine 1-3 mg/kg PO q8-12h; immunosuppression for refractory cases'
    ]
},

// ── 3. Myasthenia Gravis — Congenital ──────────────────────────────────
{ id: 'peri-mg-congenital', name: 'Myasthenia Gravis — Congenital', category: 'Anomalous/Congenital',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        var conMGBreeds = ['English Springer Spaniel','Springer Spaniel',
            'Smooth Fox Terrier','Jack Russell Terrier'];
        if (isBreed(s, conMGBreeds)) { A += 40; flags.push('Breed predisposed to congenital MG (Springer Spaniel, Smooth Fox Terrier, Jack Russell Terrier)'); }
        else                         { A += 5;  flags.push('Not a congenital MG-predisposed breed — acquired MG more likely'); }
        if      (age < 0.5)             { A += 35; flags.push('Age <6 months — congenital MG classic onset (signs from birth/early weeks)'); }
        else if (age >= 0.5 && age < 1)   A += 25;
        else if (age >= 1 && age <= 2)  { A += 10; flags.push('Age 1-2y — congenital MG possible if signs present since puppyhood'); }
        else                            { A += 0;  flags.push('Age >2y — congenital MG very unlikely if signs did not start in puppyhood'); }

        var B = 0;
        if      (oc === 'chronic')   B = 45;
        else if (oc === 'subacute')  B = 30;
        else if (oc === 'acute')     B = 10;
        else                         B = 5;
        if (s.progression === 'stable') B = Math.min(50, B + 10);

        var C = 0;
        if (pl === 'none') C = 40;
        else               { C = 5; flags.push('Spinal pain — congenital MG is painless; reconsider diagnosis'); }

        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'paraparesis')) D += 20;
        if (s.regurgitation === 'yes')                        { D += 25; flags.push('Regurgitation — megaesophagus in congenital MG; aspiration pneumonia risk'); }
        if (!mentalDepressed(s))                              D += 15;
        if (s.paroxysmalEvents === 'yes')                     { D += 25; flags.push('Exercise-induced fatigability — PATHOGNOMONIC for NMJ disease; present in congenital MG from puppyhood'); }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (breedKnown(s) && !isBreed(s, conMGBreeds)) { mult *= 0.2; flags.push('Not a predisposed breed — congenital MG very unlikely (×0.2)'); }
        if (age > 2)                  { mult *= 0.1; flags.push('Age >2y without signs from puppyhood — congenital MG essentially excluded (×0.1)'); }
        if (s.paroxysmalEvents === 'yes' && !mentalDepressed(s) && pl === 'none') {
            mult *= 1.4; flags.push('Fatigability + normal mentation + painless in young dog — congenital NMJ disease pattern (×1.4)');
        }
        if (mentalDepressed(s)) { mult *= 0.2; flags.push('Mental depression — MG does not cause altered mentation (×0.2)'); }

        alerts.push({
            type: 'INFO',
            title: 'AChR Antibody NEGATIVE in Congenital MG — Do Not Rule Out on Serology Alone',
            text: 'Congenital MG is caused by a deficiency or dysfunction of the acetylcholine receptor itself (not autoimmune). AChR antibody titre is NEGATIVE — unlike acquired MG. Diagnosis requires EMG (decremental response on repetitive nerve stimulation) + edrophonium (Tensilon) response. No immunosuppression needed — pyridostigmine may help symptom management. Genetic condition — do not breed affected animals.'
        });
        alerts.push({
            type: 'WARNING',
            title: 'Aspiration Pneumonia Risk — Megaesophagus Management',
            text: 'Feed upright position (Bailey chair or elevated bowl). Small frequent meals. Thoracic radiographs to assess for aspiration pneumonia. Pyridostigmine 1-3 mg/kg PO q8-12h — may partially improve muscle strength.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'AChR antibody titre — EXPECTED NEGATIVE in congenital MG (do not use to rule out)',
        'EMG + repetitive nerve stimulation (decremental response >10% — confirms NMJ disease)',
        'Edrophonium (Tensilon) test (transient improvement supports NMJ disease)',
        'Thoracic radiographs (megaesophagus, aspiration pneumonia)',
        'Muscle biopsy (reduced AChR density on motor end-plates — specialist lab)',
        'Genetic testing if breed-specific mutation identified',
        'Pyridostigmine 1-3 mg/kg PO q8-12h (symptomatic — no immunosuppression needed)',
        'Do not breed affected animals — autosomal recessive in predisposed breeds'
    ]
},

// ── 4. Botulism ────────────────────────────────────────────────────────
{ id: 'peri-botulism', name: 'Botulism (Clostridium botulinum Toxin)', category: 'Toxic/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var lmnPelvic = ['decreased','absent'].indexOf(s.patellarReflexR) !== -1 ||
                        ['decreased','absent'].indexOf(s.patellarReflexL) !== -1 ||
                        ['decreased','absent'].indexOf(s.withdrawalPelvicR) !== -1 ||
                        ['decreased','absent'].indexOf(s.withdrawalPelvicL) !== -1;

        var A = 20;

        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 40;
        else if (oc === 'subacute') B = 15;
        else                        B = 5;

        var C = 0;
        if (pl === 'none') C = 40;
        else               { C = 5; flags.push('Spinal pain — botulism is painless; reconsider diagnosis'); }

        var autonomicSigns = (s.pupilSizeR === 'increased' || s.pupilSizeL === 'increased' ||
                              s.directPlrR === 'decreased' || s.directPlrR === 'absent' ||
                              s.directPlrL === 'decreased' || s.directPlrL === 'absent');
        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia'))  D += 25;
        if (lmnPelvic)                                                                    D += 15;
        if (s.gagReflex === 'decreased' || s.gagReflex === 'absent')                    { D += 15; flags.push('Decreased/absent gag reflex — CN IX/X involvement consistent with botulism'); }
        if (autonomicSigns)                                                              { D += 20; flags.push('Autonomic signs (mydriasis/decreased PLR) — KEY differentiator from APR; strongly supports botulism'); }
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                                           D += 10;
        if (!mentalDepressed(s))                                                         D += 15;
        if (s.regurgitation === 'yes')                                                   D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (oc === 'peracute' && pl === 'none' && !mentalDepressed(s)) {
            mult *= 1.4; flags.push('Peracute + painless + normal mentation — botulism pattern (×1.4)');
        }
        if (mentalDepressed(s)) { mult *= 0.2; flags.push('Mental depression — botulism spares mentation; consider other diagnosis (×0.2)'); }
        if (oc === 'chronic')   { mult *= 0.2; flags.push('Chronic onset — botulism is peracute/acute (×0.2)'); }

        alerts.push({
            type: 'WARNING',
            title: 'Botulism — Supportive Care + Antitoxin',
            text: 'Intensive supportive care essential: manual bladder expression, aspiration pneumonia prevention, nutritional support. Botulinum antitoxin (type C in dogs) if available and early. Obtain dietary history — carrion, raw meat, decaying organic matter. Most dogs recover in 2-3 weeks with good nursing.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Dietary history — carrion, raw/spoiled meat, decaying organic matter, contaminated water',
        'Mouse inoculation test or ELISA (serum, vomitus, faeces — type C most common in dogs)',
        'EMG (facilitation on repetitive nerve stimulation at high frequency — unlike MG)',
        'CSF (usually normal — differentiates from APR)',
        'Thoracic radiographs (aspiration pneumonia)',
        'Treatment: supportive nursing — antitoxin if available and early phase'
    ]
},

// ── 5. Tick Paralysis ──────────────────────────────────────────────────
{ id: 'peri-tick', name: 'Tick Paralysis (Ixodes / Dermacentor)', category: 'Toxic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var lmnSigns = ['decreased','absent'].indexOf(s.patellarReflexR) !== -1 ||
                       ['decreased','absent'].indexOf(s.patellarReflexL) !== -1 ||
                       ['decreased','absent'].indexOf(s.withdrawalPelvicR) !== -1 ||
                       ['decreased','absent'].indexOf(s.withdrawalPelvicL) !== -1;

        var A = 20;
        if (age < 2) { A += 10; flags.push('Young dog — tick paralysis more severe in young/small dogs'); }

        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 40;
        else if (oc === 'subacute') B = 15;
        else                        B = 5;

        var C = 0;
        if (pl === 'none') C = 40;
        else               { C = 5; flags.push('Spinal pain — tick paralysis is painless; reconsider diagnosis'); }

        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia') ||
            hasValue(s, 'gait', 'paraparesis')  || hasValue(s, 'gait', 'paraplegia'))     D += 25;
        if (lmnSigns)                                                                      D += 20;
        if (!mentalDepressed(s))                                                           D += 20;
        if (s.progression === 'worsening')                                                 D += 10;
        if (s.tickDiscovery === 'yes')                                                     { D += 30; flags.push('Tick found on patient — EXPLICIT criterion for tick paralysis; removal is curative'); }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (s.tickDiscovery === 'yes') {
            mult *= 2.0; flags.push('Tick discovered on patient — tick paralysis diagnosis strongly supported (×2.0)');
        } else if (oc === 'peracute' && pl === 'none' && !mentalDepressed(s)) {
            mult *= 1.4; flags.push('Peracute + painless + normal mentation — tick paralysis pattern (×1.4)');
        }
        if (mentalDepressed(s)) { mult *= 0.2; flags.push('Mental depression — tick paralysis spares mentation (×0.2)'); }
        if (oc === 'chronic')   { mult *= 0.1; flags.push('Chronic onset — tick paralysis is peracute/acute (×0.1)'); }

        alerts.push({
            type: 'WARNING',
            title: 'Search for Attached Tick — Removal is Curative',
            text: 'Perform thorough full-body search for attached tick (interdigital, ear canals, axilla, groin, perineum). Removal of tick leads to recovery within 24-72h in most cases. If Ixodes (Australia/NZ): hyperimmune serum available. Monitor for respiratory paralysis in severe cases.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Full-body tick search — interdigital spaces, ear canals, axilla, groin, perineum',
        'Remove tick — recovery within 24-72h is diagnostic',
        'EMG (similar pattern to botulism — decreased nerve conduction)',
        'CSF (normal — differentiates from APR)',
        'Thoracic radiographs (respiratory muscle involvement in severe cases)',
        'Hyperimmune serum (Ixodes holocyclus — Australia/NZ only)'
    ]
},

// ── 6. Polymyositis — Immune-mediated ──────────────────────────────────
{ id: 'peri-polymyositis', name: 'Polymyositis — Immune-mediated', category: 'Inflammatory/Immune',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        var pmBreeds = ['Boxer','German Shepherd','Labrador Retriever','Golden Retriever',
            'Newfoundland','Pembroke Welsh Corgi'];
        if (isBreed(s, pmBreeds)) A += 20;
        if      (age >= 3 && age <= 9) A += 20;
        else if (age > 9)              A += 10;
        else                           A += 5;

        var B = 0;
        if      (oc === 'subacute')  B = 40;
        else if (oc === 'chronic')   B = 35;
        else if (oc === 'acute')     B = 25;
        else                         B = 10;

        var C = 0;
        if      (pl === 'none')     C = 15;
        else if (pl === 'at-site')  C = 25;
        else                        C = 15;
        if (s.musclePain === 'focal' || s.musclePain === 'generalized') { C = Math.min(50, C + 20); flags.push('Muscle pain on palpation — KEY feature of polymyositis; distinguishes from neuropathy'); }

        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'paraparesis')) D += 20;
        if (s.fever === 'yes')                                  D += 20;
        if (s.weightLoss === 'yes')                             D += 10;
        if (s.anorexia === 'yes')                               D += 10;
        if (s.regurgitation === 'yes')                          { D += 15; flags.push('Regurgitation — esophageal myositis with megaesophagus possible in polymyositis'); }
        if (!mentalDepressed(s))                                D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 5;
        var mult = 1;
        if (s.fever === 'yes' && (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'paraparesis'))) {
            mult *= 1.3; flags.push('Fever + weakness — inflammatory myopathy pattern (×1.3)');
        }
        if (mentalDepressed(s)) { mult *= 0.5; flags.push('Significant mental depression — polymyositis spares mentation; consider encephalitis (×0.5)'); }

        alerts.push({
            type: 'INFO',
            title: 'CK + EMG — Key Diagnostics',
            text: 'Creatine kinase (CK) elevation supports myopathy over neuropathy. EMG: fibrillation potentials + positive sharp waves. Muscle biopsy is definitive. Treatment: prednisolone 2 mg/kg/day — taper over months. Rule out underlying neoplasia (paraneoplastic polymyositis).'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Serum CK (elevated — myopathy marker; may be >10× normal)',
        'Serum AST, ALT (elevated with severe myonecrosis)',
        'EMG (fibrillation potentials, positive sharp waves, myotonic discharges)',
        'Muscle biopsy (inflammatory infiltrate — definitive)',
        'ANA, anti-dsDNA (immune-mediated screening)',
        'Thoracic radiographs + abdominal ultrasound (paraneoplastic workup)',
        'Treatment: prednisolone 2 mg/kg PO q24h — taper based on CK normalisation'
    ]
},

// ── 7. Diabetic Neuropathy ─────────────────────────────────────────────
{ id: 'peri-diabetic', name: 'Diabetic Neuropathy (Diabetes Mellitus — Peripheral Neuropathy)', category: 'Metabolic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var plantigrade = s.bodyPosture && s.bodyPosture.indexOf('plantigrade') === 0;

        var A = 0;
        if      (age >= 8)  A += 25;
        else if (age >= 6)  A += 20;
        else if (age >= 4)  A += 10;
        else                { A += 0; flags.push('Age <4y — diabetic neuropathy very rare in young dogs'); }

        var B = 0;
        if      (oc === 'chronic')   B = 45;
        else if (oc === 'subacute')  B = 25;
        else                         B = 5;

        var C = 0;
        if (pl === 'none') C = 35;
        else               { C = 10; flags.push('Spinal pain — atypical for diabetic neuropathy'); }

        var D = 0;
        if (plantigrade)                                        { D += 30; flags.push('Plantigrade stance — hallmark of diabetic neuropathy in dogs'); }
        if (s.polydipsiaPolyuria === 'yes')                     { D += 25; flags.push('Polydipsia/polyuria — strongly supports underlying diabetes mellitus'); }
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'tetraparesis')) D += 15;
        if (!mentalDepressed(s))                                D += 10;
        if (s.weightLoss === 'yes')                             D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (plantigrade && s.polydipsiaPolyuria === 'yes') {
            mult *= 1.5; flags.push('Plantigrade + PU/PD — diabetic neuropathy signature (×1.5)');
        }
        if (age < 4) { mult *= 0.1; flags.push('Age <4y — diabetic neuropathy essentially excluded (×0.1)'); }
        if (oc === 'peracute' || oc === 'acute') { mult *= 0.2; flags.push('Acute onset — diabetic neuropathy is insidious/chronic (×0.2)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Blood glucose + fructosamine (confirm diabetes mellitus)',
        'Urinalysis (glucosuria, ketonuria)',
        'CBC/biochemistry (diabetic panel)',
        'EMG + nerve conduction studies (reduced amplitude, slowed NCV)',
        'Urine culture (UTI common in diabetic dogs)',
        'Insulin therapy — neuropathy may partially reverse with glycaemic control',
        'Ophthalmic exam (diabetic cataracts common)'
    ]
},

// ── 8. Hypothyroid Polyneuropathy ──────────────────────────────────────
{ id: 'peri-hypothyroid', name: 'Hypothyroid Polyneuropathy (Peripheral Neuropathy)', category: 'Metabolic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        var hypothyBreeds = ['Golden Retriever','Labrador Retriever','Doberman Pinscher',
            'Irish Setter','Airedale Terrier','Great Dane','Boxer','Shetland Sheepdog'];
        if (isBreed(s, hypothyBreeds)) A += 20;
        else if (isBreed(s, predispositions.large)) A += 10;
        if      (age >= 4 && age <= 10) A += 25;
        else if (age < 4)               { A += 5; flags.push('Age <4y — hypothyroidism rare in young dogs'); }
        else                            A += 15;

        var B = 0;
        if      (oc === 'chronic')   B = 45;
        else if (oc === 'subacute')  B = 30;
        else if (oc === 'acute')     B = 10;
        else                         B = 5;

        var C = 0;
        if (pl === 'none') C = 35;
        else               { C = 10; flags.push('Spinal pain — atypical for hypothyroid polyneuropathy'); }

        var D = 0;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                   { D += 20; flags.push('Facial paresis — cranial nerve involvement consistent with hypothyroid polyneuropathy'); }
        if (s.gagReflex === 'decreased' || s.gagReflex === 'absent') { D += 15; flags.push('Decreased gag reflex — laryngeal/pharyngeal paresis associated with hypothyroid neuropathy'); }
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'paraparesis')) D += 15;
        if (s.lethargy === 'yes')                                D += 15;
        if (!mentalDepressed(s))                                 D += 10;
        if (s.regurgitation === 'yes')                           D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (isBreed(s, predispositions.large) && age >= 5 && s.lethargy === 'yes') {
            mult *= 1.2; flags.push('Large breed + middle-aged + lethargy — hypothyroid polyneuropathy supported (×1.2)');
        }
        if (age < 4) { mult *= 0.2; flags.push('Age <4y — hypothyroidism rare in young dogs (×0.2)'); }
        if (oc === 'peracute') { mult *= 0.2; flags.push('Peracute onset — hypothyroid neuropathy is insidious (×0.2)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Total T4 + free T4 by equilibrium dialysis + TSH (full thyroid panel)',
        'CBC (normocytic normochromic anaemia)',
        'Biochemistry (hypercholesterolaemia, elevated CK)',
        'EMG + nerve conduction studies (axonal degeneration pattern)',
        'Thoracic radiographs (megaesophagus, laryngeal paralysis assessment)',
        'Levothyroxine supplementation — neurological signs may partially reverse',
        'Response to treatment within 1-3 months supports diagnosis'
    ]
},

// ── 9. Inherited Polyneuropathy (Breed-specific) ───────────────────────
{ id: 'peri-inherited', name: 'Inherited Polyneuropathy (Breed-specific)', category: 'Degenerative/Genetic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var lmnSigns = ['decreased','absent'].indexOf(s.patellarReflexR) !== -1 ||
                       ['decreased','absent'].indexOf(s.patellarReflexL) !== -1 ||
                       ['decreased','absent'].indexOf(s.withdrawalPelvicR) !== -1 ||
                       ['decreased','absent'].indexOf(s.withdrawalPelvicL) !== -1;

        var A = 0;
        var inheritedBreeds = [
            'Leonberger',
            'Alaskan Malamute',
            'Greyhound',
            'Rottweiler',
            'Boxer',
            'German Shepherd',
            'Miniature Schnauzer'
        ];
        if (isBreed(s, inheritedBreeds)) { A += 40; flags.push('Breed with documented inherited polyneuropathy — strong predisposition'); }
        else                             { A += 5;  flags.push('No known inherited polyneuropathy breed predisposition — consider acquired causes'); }
        if      (age >= 1 && age <= 5)   A += 20;
        else if (age < 1)                A += 10;
        else if (age > 7)               { A += 5; flags.push('Age >7y — late-onset inherited polyneuropathy possible but acquired causes more likely'); }

        var B = 0;
        if      (oc === 'chronic')   B = 45;
        else if (oc === 'subacute')  B = 20;
        else                         B = 5;

        var C = 0;
        if (pl === 'none') C = 40;
        else               { C = 5; flags.push('Spinal pain — inherited polyneuropathy is painless; reconsider diagnosis'); }

        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'paraparesis')) D += 20;
        if (lmnSigns)                                            D += 20;
        if (!mentalDepressed(s))                                 D += 15;
        if (!s.fever || s.fever !== 'yes')                       D += 10;
        if (s.progression === 'worsening')                       D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (breedKnown(s) && !isBreed(s, inheritedBreeds)) { mult *= 0.3; flags.push('Not a predisposed breed — inherited polyneuropathy much less likely (×0.3)'); }
        if (oc === 'peracute' || oc === 'acute') { mult *= 0.1; flags.push('Acute onset — inherited polyneuropathy is slowly progressive (×0.1)'); }
        if (s.fever === 'yes') { mult *= 0.3; flags.push('Fever — inherited polyneuropathy is non-inflammatory (×0.3)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Genetic testing (breed-specific: Leonberger LPN1/LPN2 ARHGEF10/GJA9, Greyhound NDRG1)',
        'EMG + nerve conduction studies (axonal vs. demyelinating pattern)',
        'Sural/peroneal nerve biopsy (axonal degeneration, onion-bulb formation)',
        'CSF analysis (usually normal or mildly elevated protein)',
        'CBC/biochemistry + thyroid panel (rule out acquired metabolic causes)',
        'No specific treatment — physiotherapy, supportive care',
        'Prognosis variable by breed and mutation type'
    ]
},

// ── 10. Brachial Plexus Avulsion ───────────────────────────────────────
{ id: 'peri-brachial-avulsion', name: 'Brachial Plexus Avulsion (Traumatic)', category: 'Traumatic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var lmnFL = ['decreased','absent'].indexOf(s.withdrawalThoracicR) !== -1 ||
                    ['decreased','absent'].indexOf(s.withdrawalThoracicL) !== -1;

        var A = 20;

        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'subacute') B = 10;
        else                        B = 0;

        var C = 0;
        if (pl === 'none') C = 30;
        else               C = 20;

        var D = 0;
        var monoFL = hasValue(s, 'gait', 'monoparesis RT') || hasValue(s, 'gait', 'monoparesis LT') ||
                     hasValue(s, 'gait', 'monoplegia RT')  || hasValue(s, 'gait', 'monoplegia LT');
        if (monoFL)    { D += 30; flags.push('Thoracic limb monoparesis/monoplegia — brachial plexus avulsion pattern'); }
        if (lmnFL)     { D += 25; flags.push('LMN signs thoracic limb (absent withdrawal/triceps) — brachial plexus involvement'); }
        if (s.hornersSyndromeR === 'present' || s.hornersSyndromeL === 'present') { D += 15; flags.push('Horner\'s syndrome — C8-T1 root avulsion affecting sympathetic fibres'); }
        if (!mentalDepressed(s))       D += 10;
        if (s.selfMutilation === 'yes') { D += 10; flags.push('Self-mutilation of limb — loss of pain sensation (absent deep pain = grave prognosis for limb)'); }
        var dpArr = Array.isArray(s.deepPain) ? s.deepPain : (s.deepPain ? [s.deepPain] : []);
        if (dpArr.indexOf('absent RT') !== -1 || dpArr.indexOf('absent LT') !== -1) { flags.push('Absent deep pain thoracic limb — complete avulsion; amputation likely required'); }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (s.traumaHistory === 'yes')  { mult *= 2.0; flags.push('Confirmed trauma history — brachial plexus avulsion (×2.0)'); }
        if (oc === 'chronic')           { mult *= 0.3; flags.push('Chronic onset without trauma — consider PNST instead (×0.3)'); }
        if (mentalDepressed(s))         { mult *= 0.2; flags.push('Mental depression — peripheral avulsion spares mentation (×0.2)'); }

        alerts.push({
            type: 'WARNING',
            title: 'Deep Pain Assessment Critical — Amputation May Be Required',
            text: 'Test deep pain (digit compression) carefully. Absent deep pain thoracic limb = complete avulsion = no chance of limb function recovery. Discuss amputation early. Self-mutilation risk is HIGH — consider e-collar and early amputation decision. Horner\'s syndrome (C8-T1 involvement) is a poor prognostic sign. EMG at 5-7 days post-injury to map denervation extent.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Deep pain assessment — digit/toe compression: absent = complete avulsion (grave limb prognosis)',
        'EMG (at 5-7 days post-injury — fibrillation potentials map denervation extent and root level)',
        'MRI brachial plexus / cervical spine (root avulsion vs. extraforaminal injury)',
        'Radiographs: shoulder, cervical spine (fractures, luxations)',
        'Horner\'s syndrome assessment (C8-T1 root involvement)',
        'Trauma history confirmation (RTA, fall, bite wound to axilla)',
        'Amputation discussion if absent deep pain — prevents self-mutilation; best long-term outcome',
        'Physiotherapy for partial avulsions — recovery possible in incomplete injuries'
    ]
},

// ── 11. Focal Limb Neuropathy (Radial / Sciatic / Femoral / Peroneal) ──
{ id: 'peri-focal-neuropathy', name: 'Focal Limb Neuropathy (Radial / Sciatic / Femoral / Peroneal Nerve)', category: 'Traumatic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var absentWithdrawalFL = s.withdrawalThoracicR === 'absent' || s.withdrawalThoracicL === 'absent';
        var absentPatellar = s.patellarReflexR === 'absent' || s.patellarReflexL === 'absent';
        var absentWithdrawalPL = ['absent','decreased'].indexOf(s.withdrawalPelvicR) !== -1 || ['absent','decreased'].indexOf(s.withdrawalPelvicL) !== -1;
        var patellarNorm = s.patellarReflexR === 'normal' || s.patellarReflexL === 'normal';

        var A = 20;

        var B = 0;
        if      (oc === 'peracute') B = 45;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'subacute') B = 20;
        else                        B = 5;

        var C = 0;
        if (pl === 'none') C = 35;
        else               C = 15;

        var D = 0;
        var monoTL = hasValue(s, 'gait', 'monoparesis RT') || hasValue(s, 'gait', 'monoparesis LT') ||
                     hasValue(s, 'gait', 'monoplegia RT')  || hasValue(s, 'gait', 'monoplegia LT');
        var monoPL = hasValue(s, 'gait', 'monoparesis RP') || hasValue(s, 'gait', 'monoparesis LP') ||
                     hasValue(s, 'gait', 'monoplegia RP')  || hasValue(s, 'gait', 'monoplegia LP');
        if (monoTL || monoPL) { D += 30; flags.push('Single limb paresis/plegia — focal peripheral nerve lesion'); }

        if (absentWithdrawalFL && monoTL) {
            D += 20; flags.push('Absent thoracic withdrawal + monoparesis — RADIAL NERVE injury likely (knuckling, loss of elbow/carpal extension)');
        }
        if (absentPatellar && monoPL) {
            D += 25; flags.push('Absent patellar reflex pelvic limb — FEMORAL NERVE injury; rapid quadriceps atrophy expected');
        }
        if (absentWithdrawalPL && patellarNorm) {
            D += 20; flags.push('Decreased/absent pelvic withdrawal + intact patellar — SCIATIC or PERONEAL nerve injury');
        }
        if (s.muscleAtrophy === 'yes') { D += 10; flags.push('Focal muscle atrophy — LMN denervation of specific muscle group'); }
        if (!mentalDepressed(s))       D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (s.traumaHistory === 'yes') {
            mult *= 1.8; flags.push('Trauma or injection history — focal neuropathy confirmed (×1.8)');
        }
        if (oc === 'chronic') { mult *= 0.4; flags.push('Chronic — if no trauma, consider PNST (progressive monoparesis with atrophy) (×0.4)'); }
        if (mentalDepressed(s)) { mult *= 0.2; flags.push('Mental depression — focal peripheral neuropathy spares mentation (×0.2)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Neurological localisation — identify specific nerve: radial (absent thoracic withdrawal, carpal ext loss), femoral (patellar reflex), sciatic/peroneal (withdrawal, hock)',
        'EMG (5-7 days post-injury — fibrillation potentials in denervated muscles)',
        'MRI/CT of affected region (nerve root, peripheral nerve, injection site)',
        'Trauma/injection history confirmation',
        'Radiographs (fractures compressing nerve — sciatic: pelvic fracture)',
        'If chronic progressive: rule out PNST (nerve sheath tumour — root signature)',
        'Physiotherapy during recovery; most traumatic neuropathies recover partially or fully'
    ]
},

// ── 12. Peripheral Nerve Sheath Tumor (PNST) ───────────────────────────
{ id: 'peri-pnst', name: 'Peripheral Nerve Sheath Tumor (PNST) — Root Signature', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        if      (age >= 7)  A = 30;
        else if (age >= 5)  A = 25;
        else if (age >= 3)  A = 15;
        else               { A = 5; flags.push('Age <3y — PNST uncommon in young dogs'); }
        if (isBreed(s, predispositions.large)) A += 10;

        var B = 0;
        if      (oc === 'chronic')   B = 50;
        else if (oc === 'subacute')  B = 30;
        else if (oc === 'acute')     B = 10;
        else                         B = 5;

        var C = 0;
        if      (pl === 'at-site')  C = 35;
        else if (pl === 'none')     C = 20;
        else                        C = 15;

        var D = 0;
        var monoLimb = hasValue(s, 'gait', 'monoparesis') || hasValue(s, 'gait', 'monoplegia');
        if (monoLimb)                  { D += 35; flags.push('Single limb paresis/plegia — root signature pattern of PNST'); }
        if (s.muscleAtrophy === 'yes') { D += 20; flags.push('Progressive muscle atrophy — denervation from PNST compression'); }
        if (!mentalDepressed(s))       D += 10;
        if (s.progression === 'worsening') D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (oc === 'chronic' && monoLimb && s.muscleAtrophy === 'yes') {
            mult *= 1.5; flags.push('Chronic progressive monoparesis + muscle atrophy — PNST root signature (×1.5)');
        }
        if (oc === 'peracute') { mult *= 0.2; flags.push('Peracute onset — PNST is slowly progressive; consider trauma (×0.2)'); }
        if (mentalDepressed(s)) { mult *= 0.2; flags.push('Mental depression — PNST spares mentation (×0.2)'); }

        alerts.push({
            type: 'INFO',
            title: 'PNST — MRI + CT Myelography; Early Diagnosis Improves Outcome',
            text: 'PNST (nerve sheath tumour, schwannoma, neurofibroma) presents as "root signature": progressive monoparesis in one limb with muscle atrophy and limb/root pain. MRI with contrast is modality of choice. Surgical excision possible if confined to peripheral nerve; poor prognosis if intraspinal extension. Chest CT for staging.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brachial or lumbar plexus with contrast (nerve thickening, contrast enhancement)',
        'CT spine (intraspinal extension — determines resectability)',
        'EMG (localises denervation to specific nerve distribution)',
        'Thoracic CT/radiographs (staging — pulmonary metastasis rare but possible)',
        'Fine needle aspirate or biopsy (spindle cell neoplasm on cytology)',
        'Surgical excision if confined — intraspinal extension markedly worsens prognosis',
        'Radiation therapy for incompletely resected tumours'
    ]
},

// ── 13. Idiopathic Facial Nerve Paralysis ──────────────────────────────
{ id: 'peri-facial', name: 'Idiopathic Facial Nerve Paralysis', category: 'Inflammatory/Idiopathic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var facialPalsyR = s.palpebralReflexR === 'absent' || s.palpebralReflexR === 'decreased' ||
                           s.palpebralClosureR === 'absent' || s.palpebralClosureR === 'incomplete';
        var facialPalsyL = s.palpebralReflexL === 'absent' || s.palpebralReflexL === 'decreased' ||
                           s.palpebralClosureL === 'absent' || s.palpebralClosureL === 'incomplete';

        var A = 0;
        var facialBreeds = ['Cocker Spaniel','Pembroke Welsh Corgi','Cardigan Welsh Corgi','Boxer',
            'English Springer Spaniel'];
        if (isBreed(s, facialBreeds))         { A += 25; flags.push('Breed predisposed to idiopathic facial nerve paralysis'); }
        if      (age >= 5 && age <= 12) A += 20;
        else if (age >= 3 && age < 5)   A += 10;
        else                            A += 5;

        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 45;
        else if (oc === 'subacute')                   B = 20;
        else if (oc === 'chronic')                    B = 10;

        var C = 0;
        if (pl === 'none') C = 40;
        else               { C = 10; flags.push('Pain present — idiopathic facial paralysis is painless; consider otitis or tumour'); }

        var D = 0;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))  { D += 20; flags.push('Facial asymmetry — CN VII paralysis'); }
        if (facialPalsyR)                       { D += 25; flags.push('Right palpebral reflex/closure absent — CN VII right side paralysed'); }
        if (facialPalsyL)                       { D += 25; flags.push('Left palpebral reflex/closure absent — CN VII left side paralysed'); }
        if (!mentalDepressed(s))                 D += 15;
        if (!s.gait || hasValue(s, 'gait', 'normal')) D += 15;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if ((facialPalsyR || facialPalsyL) && !mentalDepressed(s) && pl === 'none') {
            mult *= 1.5; flags.push('Facial palsy + normal mentation + painless — idiopathic facial paralysis signature (×1.5)');
        }
        if (s.otoscopicAbnormality === 'yes' || s.earDischarge === 'yes') {
            mult *= 0.3; flags.push('Ear abnormality — otitis media-interna more likely than idiopathic (×0.3)');
        }
        if (mentalDepressed(s)) { mult *= 0.2; flags.push('Mental depression — idiopathic facial paralysis does not cause altered mentation; consider central cause (×0.2)'); }
        var anyNystagmus = (s.nystagmusR && s.nystagmusR !== 'none') || (s.nystagmusL && s.nystagmusL !== 'none');
        if (s.vestibularSigns === 'yes' || anyNystagmus) {
            mult *= 0.3; flags.push('Vestibular signs — suggests otitis media-interna or central lesion rather than idiopathic (×0.3)');
        }

        alerts.push({
            type: 'INFO',
            title: 'Eye Care Essential — Corneal Exposure Risk',
            text: 'Inability to close eyelid (lagophthalmos) risks corneal ulceration. Apply lubricating eye drops (artificial tears) q4-6h and lubricant ointment at night. Check cornea for ulcer (fluorescein stain). Most cases resolve spontaneously in 4-8 weeks; some dogs have permanent partial palsy. Rule out otitis (otoscopy + MRI) and central cause.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Thorough otoscopic exam (rule out otitis media-interna as cause)',
        'MRI brain + tympanic bullae (peripheral CN VII: no central lesion; rule out otitis/tumour)',
        'Fluorescein stain cornea (exposure keratitis/ulceration)',
        'CBC/biochemistry + total T4 (hypothyroidism can cause facial palsy)',
        'Artificial tears q4-6h + lubricant ointment at night (corneal protection mandatory)',
        'Prognosis: most resolve 4-8 weeks; breed-predisposed dogs may have recurrent episodes'
    ]
},

// ── 14. Idiopathic Trigeminal Neuropathy ───────────────────────────────
{ id: 'peri-trigeminal', name: 'Idiopathic Trigeminal Neuropathy (Dropped Jaw Syndrome)', category: 'Inflammatory/Idiopathic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 20;
        if (age >= 3 && age <= 10) A += 15;
        else                       A += 5;

        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 50;
        else if (oc === 'subacute')                   B = 20;
        else if (oc === 'chronic')                    B = 5;

        var C = 0;
        if (pl === 'none') C = 45;
        else               { C = 10; flags.push('Pain present — painful jaw disease (MMM, temporomandibular joint) more likely than idiopathic trigeminal neuropathy'); }

        var D = 0;
        if (s.jawTone === 'dropped jaw' || s.jawTone === 'decreased tone') {
            D += 40; flags.push('Absent/decreased jaw tone — bilateral CN V motor branch paralysis; pathognomonic for trigeminal neuropathy');
        }
        if (s.swallowingFunction === 'dysphagia')      { D += 15; flags.push('Dysphagia — cannot close mouth to swallow; aspiration risk'); }
        if (s.drooling === 'yes')        { D += 10; flags.push('Drooling — bilateral jaw drop (saliva cannot be retained)'); }
        if (!mentalDepressed(s))          D += 20;
        if (!s.gait || hasValue(s, 'gait', 'normal')) D += 15;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if ((s.jawTone === 'dropped jaw' || s.jawTone === 'decreased tone') && pl === 'none' && !mentalDepressed(s)) {
            mult *= 2.0; flags.push('Dropped jaw + painless + normal mentation — idiopathic trigeminal neuropathy CONFIRMED pattern (×2.0)');
        }
        if ((s.musclePain === 'focal' || s.musclePain === 'generalized') || s.jawTone === 'trismus') {
            mult *= 0.1; flags.push('Muscle pain / trismus — suggests MMM (masticatory muscle myositis), not idiopathic trigeminal neuropathy (×0.1)');
        }
        if (oc === 'chronic') { mult *= 0.2; flags.push('Chronic course — idiopathic trigeminal neuropathy resolves in 2-4 weeks; consider MMM or neoplasia if chronic (×0.2)'); }

        alerts.push({
            type: 'INFO',
            title: 'Excellent Prognosis — Spontaneous Recovery 2-4 Weeks',
            text: 'Idiopathic trigeminal neuropathy resolves spontaneously in 2-4 weeks in most cases. Key management: soft food (dog cannot chew hard food), hand-feeding or slurry diet, aspiration prevention (feed in upright position). No specific treatment required. Differentiate from MMM (trismus ≠ jaw drop; MMM is painful; 2M antibody test diagnostic for MMM).'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Neurological exam — jaw tone assessment (bilateral motor CN V paresis)',
        'MRI brain + cranial nerves (rule out CN V tumour, brainstem lesion, inflammation)',
        'Serum 2M antibody (rule out masticatory muscle myositis — MMM has trismus, not jaw drop)',
        'Serum CK (MMM: elevated; trigeminal neuropathy: normal)',
        'CBC/biochemistry (rule out metabolic cause)',
        'Soft diet / slurry feeding — aspiration risk management',
        'Prognosis: excellent — full recovery in 2-4 weeks; some residual masseter atrophy'
    ]
},

// ── 15. Laryngeal Paralysis / GOLPP ────────────────────────────────────
{ id: 'peri-golpp', name: 'Laryngeal Paralysis / GOLPP (Geriatric Onset Laryngeal Paralysis Polyneuropathy)', category: 'Degenerative',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        var golppBreeds = ['Labrador Retriever','Golden Retriever','Siberian Husky','Bouvier des Flandres',
            'Saint Bernard','Newfoundland','Great Pyrenees','Irish Setter'];
        if (s.breed === 'Labrador Retriever')   { A += 35; flags.push('Labrador Retriever — highest GOLPP predisposition; check for concomitant pelvic limb weakness (polyneuropathy)'); }
        else if (isBreed(s, golppBreeds))        { A += 20; flags.push('Predisposed breed for laryngeal paralysis'); }
        else if (isBreed(s, predispositions.large)) A += 10;
        if      (age >= 10) A += 30;
        else if (age >= 8)  A += 25;
        else if (age >= 6)  A += 15;
        else               { A += 0; flags.push('Age <6y — GOLPP very unlikely; consider congenital laryngeal paralysis'); }

        var B = 0;
        if      (oc === 'chronic')   B = 50;
        else if (oc === 'subacute')  B = 30;
        else if (oc === 'acute')     B = 10;
        else                         B = 5;

        var C = 0;
        if (pl === 'none') C = 40;
        else               { C = 10; flags.push('Spinal pain — atypical for laryngeal paralysis; consider concurrent disc disease'); }

        var D = 0;
        if (s.inspiratoryStridor === 'present')    { D += 30; flags.push('Inspiratory stridor — hallmark of laryngeal paralysis; bilateral arytenoid collapse'); }
        if (s.voiceChanges === 'dysphonia')        { D += 20; flags.push('Voice change (dysphonia) — arytenoid/vocal fold paresis'); }
        if (s.exerciseIntolerance === 'yes')       { D += 15; flags.push('Exercise intolerance + dyspnoea — laryngeal obstruction with exertion'); }
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'ataxia') || hasValue(s, 'gait', 'paresis')) {
            D += 15; flags.push('Pelvic limb weakness/ataxia — GOLPP polyneuropathy component (pelvic limb involvement confirms GOLPP)');
        }
        if (!mentalDepressed(s))               D += 10;
        if (s.muscleAtrophy === 'yes')         { D += 10; flags.push('Muscle atrophy — generalised neuropathy in GOLPP'); }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (s.breed === 'Labrador Retriever' && age >= 8 && s.inspiratoryStridor === 'present') {
            mult *= 1.8; flags.push('Labrador + age ≥8y + inspiratory stridor — GOLPP confirmed pattern (×1.8)');
        }
        if (age < 6) { mult *= 0.05; flags.push('Age <6y — GOLPP essentially excluded in young dogs (×0.05)'); }
        if (oc === 'peracute') { mult *= 0.2; flags.push('Peracute — not typical for GOLPP; consider anaphylaxis or acute pharyngeal mass (×0.2)'); }

        alerts.push({
            type: 'WARNING',
            title: 'Respiratory Emergency Risk — Avoid Heat/Stress/Exercise',
            text: 'Laryngeal paralysis can cause fatal respiratory obstruction with heat, excitement, or exercise. Strict rest, cool environment mandatory. If respiratory distress: oxygen supplementation, sedation (acepromazine 0.01-0.02 mg/kg IM), emergency tieback surgery. Bilateral cricoarytenoid lateralisation (tieback) is treatment of choice — 90% improvement. Aspiration pneumonia risk post-surgery.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Laryngoscopy under light sedation (observe arytenoid abduction — bilateral paradoxical motion)',
        'Thoracic radiographs (aspiration pneumonia, megaesophagus assessment)',
        'EMG laryngeal muscles + pelvic limb muscles (denervation — confirms GOLPP polyneuropathy)',
        'CBC/biochemistry + total T4 (hypothyroidism can cause laryngeal paralysis)',
        'Blood pressure (hypertension as concurrent cause)',
        'Neck/chest radiographs (mass compressing recurrent laryngeal nerve — neoplastic)',
        'Tieback surgery (unilateral arytenoid lateralisation) — treatment of choice',
        'Pre/post-op chest radiographs (aspiration pneumonia monitoring)'
    ]
},

// ── 16. Masticatory Muscle Myositis (MMM) ──────────────────────────────
{ id: 'peri-mmm', name: 'Masticatory Muscle Myositis (MMM)', category: 'Inflammatory/Immune',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        var mmmBreeds = ['German Shepherd','Golden Retriever','Labrador Retriever','Doberman Pinscher',
            'Cavalier King Charles Spaniel'];
        if (isBreed(s, mmmBreeds))             { A += 20; flags.push('MMM-predisposed breed'); }
        if      (age >= 2 && age <= 9) A += 20;
        else if (age >= 1)             A += 10;

        var B = 0;
        if      (oc === 'acute' || oc === 'subacute') B = 40;
        else if (oc === 'chronic')                    B = 35;
        else                                          B = 25;

        var C = 0;
        if (s.jawTone === 'trismus')    { C = 50; flags.push('Trismus — inability to open jaw; PATHOGNOMONIC for MMM (acute) or fibrosis (chronic)'); }
        else if (s.musclePain === 'focal' || s.musclePain === 'generalized') { C = 35; flags.push('Masticatory muscle pain on palpation — acute MMM'); }
        else if (pl === 'none')    C = 10;

        var D = 0;
        if (s.jawTone === 'trismus')         { D += 30; flags.push('Trismus — jaw cannot be opened; MMM fibrosis in chronic cases'); }
        if (s.muscleAtrophy === 'yes')       { D += 20; flags.push('Temporal/masseter atrophy — chronic MMM denervation/fibrosis'); }
        if (!s.gait || hasValue(s, 'gait', 'normal'))   D += 20;
        if (!mentalDepressed(s))              D += 10;

        var sysBonus = 0;
        if (s.fever === 'yes')   { sysBonus += 10; flags.push('Fever — acute inflammatory MMM'); }
        if (s.anorexia === 'yes')  sysBonus += 5;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + sysBonus + 5;
        var mult = 1;
        if (s.jawTone === 'trismus' && pl !== 'elsewhere') {
            mult *= 2.0; flags.push('Trismus — MMM confirmed pattern (×2.0)');
        }
        if (s.jawTone === 'dropped jaw' || s.jawTone === 'decreased tone') {
            mult *= 0.1; flags.push('Absent jaw tone (dropped jaw) — suggests trigeminal neuropathy, NOT MMM (trismus = cannot OPEN jaw, not dropped jaw) (×0.1)');
        }
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'tetraparesis')) {
            mult *= 0.3; flags.push('Limb paresis — MMM is confined to masticatory muscles; consider systemic myositis (×0.3)');
        }

        alerts.push({
            type: 'URGENT',
            title: '2M Antibody Test — Diagnostic Before Immunosuppression',
            text: 'Serum 2M (type 2M muscle fibre antibody) test is DIAGNOSTIC for MMM — highly specific. Send blood to specialist lab before starting immunosuppression. Treat with prednisolone 2 mg/kg PO q24h. Open mouth gently 3x/day to prevent fibrosis. Chronic trismus: jaw physiotherapy under sedation. Prognosis: good if treated early; fibrosis is irreversible.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Serum 2M antibody test (type 2M muscle fibre antibody — DIAGNOSTIC; highly specific)',
        'Serum CK (usually normal or mildly elevated in MMM)',
        'EMG masticatory muscles (fibrillation potentials in acute; reduced recruitment in chronic)',
        'Muscle biopsy masticatory muscles (2M fibre selective inflammation/necrosis — confirmatory)',
        'MRI head (acute: muscle swelling, contrast enhancement; chronic: atrophy)',
        'CBC/biochemistry (rule out other inflammatory disease)',
        'Treatment: prednisolone 2 mg/kg PO q24h; taper slowly over months based on clinical response',
        'Jaw physiotherapy (prevent fibrosis) — gentle opening exercises 3×/day'
    ]
},

// ── 17. Protozoal Polyradiculoneuritis (Neospora caninum) ──────────────
{ id: 'peri-neospora', name: 'Protozoal Polyradiculoneuritis (Neospora caninum)', category: 'Inflammatory/Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var lmnPelvic = ['decreased','absent'].indexOf(s.patellarReflexR) !== -1 ||
                        ['decreased','absent'].indexOf(s.patellarReflexL) !== -1 ||
                        ['decreased','absent'].indexOf(s.withdrawalPelvicR) !== -1 ||
                        ['decreased','absent'].indexOf(s.withdrawalPelvicL) !== -1;

        var A = 0;
        if      (age < 0.5)             { A = 45; flags.push('Age <6 months — neonatal/juvenile Neospora polyradiculoneuritis; classic age'); }
        else if (age >= 0.5 && age < 2)  { A = 30; flags.push('Age <2y — juvenile Neospora; consider vertical transmission from dam'); }
        else if (age >= 2 && age <= 5)    A = 15;
        else                             { A = 5; flags.push('Age >5y — adult-onset Neospora less typical; consider immunosuppression'); }

        var B = 0;
        if      (oc === 'subacute')  B = 40;
        else if (oc === 'acute')     B = 35;
        else if (oc === 'chronic')   B = 20;
        else                         B = 25;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        var C = 0;
        if      (pl === 'at-site')  C = 25;
        else if (pl === 'none')     C = 20;
        else                        C = 15;

        var D = 0;
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'paraplegia') ||
            hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia')) D += 25;
        if (lmnPelvic) D += 20;
        if ((s.extensorTonePelvicR === 'increased' || s.extensorTonePelvicL === 'increased')) { D += 25; flags.push('Pelvic limb rigidity/hyperextension — HALLMARK of Neospora polyradiculoneuritis in young dogs'); }
        if (s.muscleAtrophy === 'yes')       { D += 15; flags.push('Muscle atrophy — Neospora neuropathy and myopathy component'); }
        if (!mentalDepressed(s))             D += 10;

        var sysBonus = 0;
        if (s.fever === 'yes')        { sysBonus += 15; flags.push('Fever — systemic Neospora infection'); }
        if (s.swallowingFunction === 'dysphagia') { sysBonus += 10; flags.push('Dysphagia — Neospora can affect cranial nerves'); }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + sysBonus + 10;
        var mult = 1;
        if (age < 2 && (s.extensorTonePelvicR === 'increased' || s.extensorTonePelvicL === 'increased')) {
            mult *= 2.0; flags.push('Young dog + pelvic limb rigidity — Neospora polyradiculoneuritis CONFIRMED pattern (×2.0)');
        }
        if (age > 5 && !s.immunosuppressed) { mult *= 0.5; flags.push('Adult without immunosuppression — Neospora less likely (×0.5)'); }

        alerts.push({
            type: 'URGENT',
            title: 'Treat Promptly — Progressive and Often Fatal if Untreated',
            text: 'Neospora caninum polyradiculoneuritis progresses rapidly in young dogs. Treat immediately: trimethoprim-sulphadiazine 15 mg/kg PO q12h + clindamycin 10-15 mg/kg PO q12h ± pyrimethamine 0.5-1 mg/kg PO q24h. Check dam for Neospora serology (vertical transmission). Prognosis: guarded — pelvic limb rigidity may be irreversible even with treatment; early treatment improves outcome.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Neospora caninum IgG + IgM serology (patient and dam — vertical transmission)',
        'Neospora PCR (blood, CSF, muscle — PCR most sensitive)',
        'CSF analysis (pleocytosis — mononuclear or mixed; elevated protein)',
        'EMG (fibrillation potentials — polyradiculoneuritis + myopathy pattern)',
        'Muscle/nerve biopsy (Neospora tachyzoites, necrosis)',
        'MRI spine + brain (multifocal lesions if CNS involvement)',
        'Treatment: trimethoprim-sulpha + clindamycin ± pyrimethamine — START IMMEDIATELY',
        'Dam testing and management (prevent future litters transmitting Neospora)'
    ]
},

// ── 18. Hereditary Motor Neuronopathy ──────────────────────────────────
{ id: 'peri-hmn', name: 'Hereditary Motor Neuronopathy (Spinal Muscular Atrophy)', category: 'Degenerative/Genetic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var lmnSigns = ['decreased','absent'].indexOf(s.patellarReflexR) !== -1 ||
                       ['decreased','absent'].indexOf(s.patellarReflexL) !== -1 ||
                       ['decreased','absent'].indexOf(s.withdrawalPelvicR) !== -1 ||
                       ['decreased','absent'].indexOf(s.withdrawalPelvicL) !== -1;

        var A = 0;
        var hmnBreeds = ['Brittany Spaniel','Brittany','Rottweiler','Boxer'];
        if (isBreed(s, hmnBreeds)) { A += 35; flags.push('HMN-predisposed breed (Brittany Spaniel, Rottweiler, Boxer)'); }
        else                       { A += 5;  flags.push('Not a predisposed breed — hereditary motor neuronopathy less likely'); }
        if      (age < 1)              { A += 30; flags.push('Age <1y — hereditary motor neuronopathy classic early onset'); }
        else if (age >= 1 && age <= 3)   A += 20;
        else                           { A += 5; flags.push('Age >3y — hereditary MN disease less likely; consider acquired causes'); }

        var B = 0;
        if      (oc === 'chronic')   B = 45;
        else if (oc === 'subacute')  B = 25;
        else                         B = 5;

        var C = 0;
        if (pl === 'none') C = 45;
        else               { C = 5; flags.push('Pain present — hereditary MN disease is painless and has NO sensory deficits; reconsider diagnosis'); }

        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'paraparesis')) D += 25;
        if (lmnSigns)                    D += 20;
        if (s.muscleAtrophy === 'yes')   D += 15;
        if (!mentalDepressed(s))         D += 10;
        if (hasValue(s, 'gait', 'fasciculation')) {
            D += 25; flags.push('Muscle fasciculations — PATHOGNOMONIC for motor neuron disease; absent in neuropathy/myopathy');
        }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (hasValue(s, 'gait', 'fasciculation') && !mentalDepressed(s) && pl === 'none') {
            mult *= 1.8; flags.push('Fasciculations + painless + normal mentation — motor neuron disease pattern (×1.8)');
        }
        if (breedKnown(s) && !isBreed(s, hmnBreeds)) { mult *= 0.3; flags.push('Not a predisposed breed — hereditary MN disease much less likely (×0.3)'); }
        if (s.fever === 'yes') { mult *= 0.3; flags.push('Fever — hereditary MN disease is non-inflammatory (×0.3)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'EMG (fibrillation potentials + fasciculation potentials — LMN denervation; no sensory abnormalities)',
        'Nerve conduction studies (normal sensory; reduced motor amplitude)',
        'Muscle biopsy (grouped atrophy — LMN denervation pattern)',
        'Genetic testing (breed-specific mutations)',
        'CSF analysis (usually normal)',
        'CBC/biochemistry + CK (CK mildly elevated; rule out myopathy)',
        'No specific treatment — physiotherapy, supportive care',
        'Genetic counselling — autosomal recessive; do not breed affected animals or carriers'
    ]
},

// ── 19. Myopathies ─────────────────────────────────────────────────────
{ id: 'peri-myopathy', name: 'Myopathy (Muscular Dystrophy / Hereditary / Myotonia / Endocrine / Paraneoplastic)', category: 'Degenerative/Metabolic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var A = 0;
        var dystrophyBreeds = ['Golden Retriever','Irish Terrier','Labrador Retriever','Bouvier des Flandres',
            'Miniature Schnauzer','Cavalier King Charles Spaniel'];
        var myotoniaBreeds = ['Chow Chow','Miniature Schnauzer','Labrador Retriever','Great Dane','Staffordshire Bull Terrier'];
        if (isBreed(s, dystrophyBreeds))  { A += 20; flags.push('Breed predisposed to hereditary myopathy (dystrophy/centronuclear)'); }
        else if (isBreed(s, myotoniaBreeds)) { A += 15; flags.push('Breed predisposed to myotonia congenita'); }
        else if (isBreed(s, predispositions.large)) A += 5;
        if      (age < 1)              { A += 25; flags.push('Age <1y — hereditary myopathy (dystrophy, centronuclear) classic onset'); }
        else if (age >= 1 && age <= 3)   A += 20;
        else if (age >= 4 && age <= 9)   A += 15;
        else                             A += 20;

        var B = 0;
        if      (oc === 'chronic')   B = 45;
        else if (oc === 'subacute')  B = 30;
        else if (oc === 'acute')     B = 15;
        else                         B = 5;

        var C = 0;
        if (pl === 'none') C = 35;
        else if (s.musclePain === 'focal' || s.musclePain === 'generalized') { C = 20; flags.push('Muscle pain — consider polymyositis rather than hereditary/endocrine myopathy'); }
        else C = 15;

        var D = 0;
        if (hasValue(s, 'gait', 'paraparesis') || hasValue(s, 'gait', 'tetraparesis')) D += 20;
        if (s.exerciseIntolerance === 'yes')   { D += 20; flags.push('Exercise intolerance — myopathy / metabolic muscle disease'); }
        if (s.muscleAtrophy === 'yes')         { D += 15; flags.push('Muscle atrophy — dystrophy or chronic denervation (check EMG to differentiate myopathy vs neuropathy)'); }
        if (!mentalDepressed(s))               D += 10;
        if (s.stiffnessWorseAtRest === 'yes') {
            D += 20; flags.push('Stiffness worse at rest, improves with exercise — myotonia congenita pattern');
        }
        if (s.percussionDimpling === 'yes')    {
            D += 25; flags.push('Percussion dimpling of tongue or muscle — PATHOGNOMONIC for myotonia congenita');
        }
        if (s.potBelly === 'yes')              { D += 10; flags.push('Pot belly — HAC myopathy (muscle wasting + abdominal enlargement)'); }
        if (s.polydipsiaPolyuria === 'yes')    { D += 10; flags.push('PU/PD — endocrine myopathy (HAC, hypothyroidism, diabetes)'); }
        if (s.weightLoss === 'yes')            { D += 10; flags.push('Weight loss + muscle wasting — paraneoplastic myopathy/neuropathy; full oncology workup needed'); }

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (s.percussionDimpling === 'yes') { mult *= 2.0; flags.push('Percussion dimpling — myotonia confirmed (×2.0)'); }
        if ((s.musclePain === 'focal' || s.musclePain === 'generalized') && s.fever === 'yes') { mult *= 0.5; flags.push('Painful + fever — inflammatory myopathy (polymyositis) more likely than hereditary myopathy (×0.5)'); }
        if (oc === 'peracute') { mult *= 0.2; flags.push('Peracute — myopathies are chronic; consider APR, botulism, tick paralysis (×0.2)'); }

        alerts.push({
            type: 'INFO',
            title: 'CK Elevation Key — Differentiates Myopathy from Neuropathy',
            text: 'Markedly elevated CK (>10× normal) supports myopathy over neuropathy. EMG differentiates: myopathic (short-duration, small-amplitude potentials ± myotonic discharges) vs. neuropathic (fibrillation, positive sharp waves). Muscle biopsy is definitive. For HAC myopathy: ACTH stim test. For paraneoplastic: full oncology workup. Muscular dystrophy: genetic testing + dystrophin immunohistochemistry.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Serum CK (markedly elevated in dystrophy/centronuclear/inflammatory; mildly elevated in endocrine myopathy)',
        'EMG (myopathic discharges vs denervation — critical to differentiate myopathy from neuropathy)',
        'Muscle biopsy (definitive — histopathology ± immunohistochemistry for dystrophin)',
        'Genetic testing (Golden Retriever muscular dystrophy, Labrador centronuclear myopathy)',
        'Endocrine panel: UCCR + ACTH stim (HAC), Total T4 + TSH (hypothyroid), blood glucose (hypoglycaemia)',
        'Thoracic radiographs + abdominal ultrasound (paraneoplastic workup)',
        'CBC/biochemistry (metabolic screen)',
        'Myotonia: percussion of tongue/epaxial muscles; EMG = dive-bomber discharges',
        'HAC: trilostane/mitotane; myotonia: mexiletine; hereditary: no specific treatment'
    ]
},

// ── 20. CIDP (Chronic Inflammatory Demyelinating Polyneuropathy) ───────
{ id: 'peri-cidp', name: 'CIDP (Chronic Inflammatory Demyelinating Polyneuropathy)', category: 'Inflammatory/Immune',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var lmnSigns = ['decreased','absent'].indexOf(s.patellarReflexR) !== -1 ||
                       ['decreased','absent'].indexOf(s.patellarReflexL) !== -1 ||
                       ['decreased','absent'].indexOf(s.withdrawalPelvicR) !== -1 ||
                       ['decreased','absent'].indexOf(s.withdrawalPelvicL) !== -1;

        var A = 20;
        if      (age >= 3 && age <= 9) A += 20;
        else if (age < 3)              { A += 5; flags.push('Age <3y — CIDP uncommon in young dogs; consider inherited polyneuropathy'); }
        else                           A += 10;

        var B = 0;
        if      (oc === 'chronic')   B = 50;
        else if (oc === 'subacute')  B = 30;
        else if (oc === 'acute')     B = 10;
        else                         B = 5;

        var C = 0;
        if (pl === 'none') C = 40;
        else               { C = 15; flags.push('Pain present — atypical for CIDP; consider infectious polyradiculoneuritis'); }

        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'paraparesis')) D += 25;
        if (lmnSigns)                    D += 20;
        if (!mentalDepressed(s))         D += 15;
        if (s.progression === 'worsening' && oc === 'chronic') D += 10;
        if (!s.fever || s.fever !== 'yes') D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (oc === 'chronic' && lmnSigns && !mentalDepressed(s) && pl === 'none') {
            mult *= 1.4; flags.push('Chronic LMN weakness + painless + normal mentation — CIDP pattern (×1.4)');
        }
        if (age < 3) { mult *= 0.3; flags.push('Age <3y — CIDP very uncommon in young dogs; consider inherited polyneuropathy (×0.3)'); }
        if (oc === 'peracute') { mult *= 0.1; flags.push('Peracute — CIDP is chronic; consider APR instead (×0.1)'); }
        if (s.fever === 'yes') { mult *= 0.4; flags.push('Fever — CIDP is not typically febrile; consider infectious cause (×0.4)'); }

        alerts.push({
            type: 'INFO',
            title: 'CIDP — Responds to Immunosuppression; EMG + CSF + Nerve Biopsy Needed',
            text: 'CIDP is a diagnosis of exclusion after ruling out infectious and metabolic causes. Key: markedly slowed nerve conduction velocity (demyelination), cytoalbuminous dissociation on CSF. Treatment: prednisolone 2 mg/kg/day ± azathioprine. Response to immunosuppression supports diagnosis. Relapsing-remitting course is characteristic.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'EMG + nerve conduction studies (markedly slowed NCV — demyelination; prolonged distal latency)',
        'CSF analysis (cytoalbuminous dissociation — elevated protein, normal cell count)',
        'Sural/peroneal nerve biopsy (demyelination + remyelination onion bulbs; inflammatory infiltrate)',
        'CBC/biochemistry + thyroid panel (rule out metabolic polyneuropathy)',
        'Neospora/Toxoplasma serology (infectious polyradiculoneuritis)',
        'Urine Bence-Jones proteins (paraproteinaemia-associated neuropathy)',
        'Treatment: prednisolone 2 mg/kg PO q24h ± azathioprine 2 mg/kg PO q24h',
        'Prognosis: variable — many dogs respond but may require long-term immunosuppression'
    ]
},

// ── 21. Toxic Neuropathy / Paralysis ───────────────────────────────────
{ id: 'peri-toxic', name: 'Toxic Neuropathy / Paralysis (Organophosphate / Vincristine / Snake & Spider Envenomation)', category: 'Toxic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        var lmnSigns = ['decreased','absent'].indexOf(s.patellarReflexR) !== -1 ||
                       ['decreased','absent'].indexOf(s.patellarReflexL) !== -1 ||
                       ['decreased','absent'].indexOf(s.withdrawalPelvicR) !== -1 ||
                       ['decreased','absent'].indexOf(s.withdrawalPelvicL) !== -1;

        var A = 20;

        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 40;
        else if (oc === 'subacute') B = 20;
        else                        B = 5;

        var C = 0;
        if (pl === 'none') C = 35;
        else               C = 15;

        var D = 0;
        if (hasValue(s, 'gait', 'tetraparesis') || hasValue(s, 'gait', 'tetraplegia') ||
            hasValue(s, 'gait', 'paraparesis')  || hasValue(s, 'gait', 'paraplegia')) D += 25;
        if (lmnSigns)  D += 20;
        if (!mentalDepressed(s)) D += 10;

        var opSigns = (s.salivation === 'yes' || s.lacrimation === 'yes' ||
                       s.urination === 'urinaryIncontinence' || s.defecation === 'yes' ||
                       s.miosis === 'yes');
        if (opSigns) {
            D += 20; flags.push('SLUD signs (salivation/lacrimation/urination/defecation) and/or miosis — organophosphate/carbamate toxicity (STRONG indicator)');
        }
        if (s.epilepticSeizures && s.epilepticSeizures !== 'no') {
            D += 10; flags.push('Seizures — organophosphate toxicity (nicotinic + muscarinic + CNS effects)');
        }

        if (s.biteHistory === 'yes')       { D += 20; flags.push('Bite wound — snake or spider envenomation; examine wound site'); }
        if (s.biteWoundSwelling === 'yes') { D += 10; flags.push('Local swelling — envenomation site reaction'); }

        if (s.chemotherapyHistory === 'yes') { D += 25; flags.push('Chemotherapy history — vincristine neuropathy (axonal neuropathy 2-4 weeks post-treatment)'); }

        var sysBonus = 0;
        if (s.toxinExposure === 'yes')      { sysBonus += 25; flags.push('Confirmed toxin exposure — organophosphate/carbamate (dip, spray, flea product)'); }
        if (s.vomiting === 'yes' || s.diarrhea === 'yes') sysBonus += 5;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + sysBonus + 5;
        var mult = 1;
        if (s.toxinExposure === 'yes' || s.biteHistory === 'yes' || s.chemotherapyHistory === 'yes') {
            mult *= 2.0; flags.push('Confirmed exposure history — toxic neuropathy/paralysis (×2.0)');
        }
        if (oc === 'chronic' && !s.chemotherapyHistory) { mult *= 0.2; flags.push('Chronic without chemo history — toxic neuropathy is acute/subacute (×0.2)'); }

        alerts.push({
            type: 'CRITICAL',
            title: 'Organophosphate: Atropine + Pralidoxime IMMEDIATELY',
            text: 'ORGANOPHOSPHATE/CARBAMATE: Atropine sulphate 0.2-0.4 mg/kg IV (titrate to dry secretions — NOT heart rate). Pralidoxime (2-PAM) 20-50 mg/kg IM/IV slowly if organophosphate (not carbamate). Remove contaminated clothing/fur (PPE for handler). SNAKE BITE: antivenom if available and species identified; supportive care. VINCRISTINE: dose reduction or discontinuation; recovery takes weeks. SPIDER (Latrodectus): calcium gluconate + muscle relaxants.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        '⚠️ ORGANOPHOSPHATE: Atropine IV immediately; Pralidoxime if OP (not carbamate); remove contamination',
        'RBC cholinesterase activity (decreased in OP toxicity — confirmatory)',
        'Toxicology screen — urine and gastric contents',
        'Snake ID if possible — contact veterinary toxicology (antivenom selection)',
        'CBC/biochemistry (haemolysis, coagulopathy in some snake venoms)',
        'Coagulation panel (DIC risk with some snake venoms)',
        'EMG + nerve conduction (if subacute: vincristine neuropathy — axonal pattern)',
        'Thoracic radiographs (aspiration pneumonia from weakness)',
        'Chemotherapy history + vincristine dose review (if chemo patient)',
        'Supportive care: IV fluids, oxygen, bladder management, intensive nursing'
    ]
}

];

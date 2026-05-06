// Vestibular (Peripheral) diagnoses — rewritten from DDX-main/src/regions/Vestibular.js in our style.
// Uses OUR parameter names directly (no normalise adapter).
// Diagnosis-only params (fever, vaccinated, cough, petechiae, ...) live in
// apps/Localisation/diagnoses/diagnosesParameters.json and are merged into the
// Parameters model at init — Parameters app renders them as extra categories.

app.diagnoses = app.diagnoses || {};
app.diagnoses['vestibular-peripheral'] = [

// ── 1. Idiopathic Peripheral Vestibular Syndrome (Old Dog Vestibular) ───
{ id: 'vest-idiopathic', name: 'Idiopathic Peripheral Vestibular Syndrome', category: 'Unknown',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — older dogs
        var A = 0;
        if      (age >= 8) A += 30;
        else if (age >= 5) A += 20;
        else if (age >= 3) A += 10;
        else               { A += 5; flags.push('Age <3y — idiopathic vestibular unusual in young dogs; consider congenital'); }

        // [B] Temporal — PERACUTE onset is hallmark
        var B = 0;
        if      (oc === 'peracute') B = 50;
        else if (oc === 'acute')    B = 25;
        else                        { B = 5; flags.push('Non-peracute onset — atypical for idiopathic vestibular syndrome'); }

        // [C] Pain — absent (peripheral vestibular is painless)
        var C = 0;
        if (pl === 'none') C = 35;
        else               { C = 10; flags.push('Pain present — idiopathic vestibular is painless; consider otitis or central'); }

        // [D] Deficit — peripheral vestibular pattern
        var D = 0;
        if (hasHeadTilt(s))                                                                      D += 20;
        if ((s.nystagmusR === 'horizontal' || s.nystagmusL === 'horizontal') ||
            (s.nystagmusR === 'rotatory' || s.nystagmusL === 'rotatory'))                        D += 20;
        if (!mentalDepressed(s))                                                                 D += 15;
        if (s.vomiting === 'yes')                                                                D += 10;
        if (s.otitis !== 'yes')                                                                  D += 5;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 15;
        var mult = 1;
        if (oc === 'peracute' && !mentalDepressed(s) && pl === 'none') { mult *= 1.5; flags.push('Peracute + normal mentation + painless — classic idiopathic vestibular (×1.5)'); }
        if (centralVestibularSigns(s))         { mult *= 0.2; flags.push('Vertical/changing nystagmus — central vestibular, NOT peripheral idiopathic (×0.2)'); }
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R'))) { mult *= 0.3; flags.push('Facial paresis — suggests otitis media-interna, not idiopathic (×0.3)'); }
        if (mentalDepressed(s))                { mult *= 0.2; flags.push('Mental depression — central vestibular lesion, NOT peripheral idiopathic (×0.2)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Otoscopic examination (rule out otitis externa/media)',
        'CT/MRI brain + bullae (rule out otitis media-interna, central lesion)',
        'Complete neurological exam (confirm normal mentation, normal postural reactions)',
        'Thyroid panel (T4 — hypothyroid vestibular)',
        'No treatment needed — usually self-limiting in 2-6 weeks',
        'Symptomatic: meclizine 12.5-25 mg PO q12h'
    ]
},

// ── 2. Otitis Media-Interna ────────────────────────────────────────────
{ id: 'vest-otitis', name: 'Otitis Media-Interna', category: 'Infectious',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — any breed; cocker, predispositions.chondro slightly higher; common condition
        var A = 20; // base — otitis can happen in any breed
        var otitisBreeds = ['Cocker Spaniel', 'Basset Hound', 'Shar Pei', 'Labrador Retriever', 'Golden Retriever'];
        if (isBreed(s, otitisBreeds))                 A += 20;
        else if (isBreed(s, predispositions.chondro)) A += 10;
        if (age >= 2 && age <= 10)                    A += 10;

        // [B] Temporal — acute to subacute
        var B = 0;
        if      (oc === 'subacute') B = 40;
        else if (oc === 'acute')    B = 35;
        else if (oc === 'chronic')  B = 25;
        else /* peracute */         B = 20;

        // [C] Pain — otalgia/head pain
        var C = 0;
        if      (pl === 'at-site') C = 30;
        else if (pl === 'none')    C = 20;
        else                       C = 15;

        // CN VII laterality — ipsilateral facial nerve palsy strongly supports otitis media-interna
        // Contralateral facial palsy argues against (would be central lesion)
        var ipsilateralCN7 = (s.palpebralReflexR === 'decreased' || s.palpebralReflexR === 'absent' ||
                              s.palpebralClosureR === 'decreased' || s.palpebralClosureR === 'absent') ||
                             (s.palpebralReflexL === 'decreased' || s.palpebralReflexL === 'absent' ||
                              s.palpebralClosureL === 'decreased' || s.palpebralClosureL === 'absent');
        // Bilateral CN VII palsy argues against unilateral otitis
        var bilateralCN7 = (s.palpebralReflexR === 'decreased' || s.palpebralReflexR === 'absent') &&
                           (s.palpebralReflexL === 'decreased' || s.palpebralReflexL === 'absent');

        // [D] Deficit
        var D = 0;
        if (s.otitis === 'yes')                                                                  D += 30;
        if (hasHeadTilt(s))                                                                      D += 20;
        if ((s.nystagmusR === 'horizontal' || s.nystagmusL === 'horizontal') ||
            (s.nystagmusR === 'rotatory' || s.nystagmusL === 'rotatory'))                        D += 15;
        if (ipsilateralCN7 && !bilateralCN7)                                                     { D += 20; flags.push('Ipsilateral facial nerve palsy — strongly supports otitis media-interna (CN VII runs through petrous bone)'); }
        else if (bilateralCN7)                                                                   { flags.push('Bilateral CN VII palsy — atypical for unilateral otitis; consider central or bilateral middle ear disease'); }
        else if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                                              D += 10; // asymmetric without laterality data — partial credit
        if (!mentalDepressed(s))                                                                 D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + systemicScore(s) + 15;
        var mult = 1;
        if (s.otitis === 'yes')        { mult *= 1.5; flags.push('Otitis confirmed — strongly supports otitis media-interna (×1.5)'); }
        if (centralVestibularSigns(s)) { mult *= 0.3; flags.push('Vertical nystagmus — central lesion, not otitis media (×0.3)'); }
        if (mentalDepressed(s))        { mult *= 0.3; flags.push('Mental depression — central vestibular, not otitis media-interna (×0.3)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Otoscopic examination (discharge, polyp, membrane rupture)',
        'CT bullae (tympanic bullae involvement — modality of choice)',
        'Culture and sensitivity (ear discharge)',
        'MRI brain + bullae (if CN VII palsy or central signs suspected)',
        'BAER test (vestibulocochlear function)',
        'Systemic antibiotics 6-8 weeks (guided by culture)',
        'Consider TECA-BO for refractory/chronic cases'
    ]
},

// ── 3. Hypothyroid Vestibular Syndrome ────────────────────────────────
{ id: 'vest-hypothyroid', name: 'Hypothyroid Vestibular Syndrome', category: 'Metabolic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — middle-aged large breeds
        var A = 0;
        var hypothyBreeds = ['Golden Retriever', 'Labrador Retriever', 'Doberman Pinscher',
            'Irish Setter', 'Airedale Terrier', 'Great Dane', 'Boxer', 'Shetland Sheepdog'];
        if (isBreed(s, hypothyBreeds))              A += 20;
        else if (isBreed(s, predispositions.large)) A += 10;
        if      (age >= 4 && age <= 10) A += 25;
        else if (age < 4)               { A += 5; flags.push('Age <4y — hypothyroidism rare; consider congenital if large breed'); }
        else                             A += 15;

        // [B] Temporal — subacute to chronic
        var B = 0;
        if      (oc === 'chronic')  B = 35;
        else if (oc === 'subacute') B = 35;
        else if (oc === 'acute')    B = 20;
        else /* peracute */         B = 10;

        // [C] Pain — absent
        var C = 0;
        if (pl === 'none') C = 30;
        else               { C = 10; flags.push('Pain present — unusual for hypothyroid vestibular'); }

        // [D] Deficit — peripheral vestibular + hypothyroid signs
        var D = 0;
        if (hasHeadTilt(s))                                                                      D += 20;
        if ((s.nystagmusR === 'horizontal' || s.nystagmusL === 'horizontal') ||
            (s.nystagmusR === 'rotatory' || s.nystagmusL === 'rotatory'))                        D += 15;
        if (!mentalDepressed(s))                                                                 D += 10;
        if (s.lethargy === 'yes')                                                                D += 15;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (isBreed(s, predispositions.large) && age >= 5) { mult *= 1.2; flags.push('Large breed middle-aged — hypothyroid vestibular plausible (×1.2)'); }
        if (centralVestibularSigns(s)) { mult *= 0.3; flags.push('Vertical nystagmus — central lesion, not hypothyroid peripheral (×0.3)'); }
        if (oc === 'peracute')         { mult *= 0.5; flags.push('Peracute onset — idiopathic vestibular more likely than hypothyroid (×0.5)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Total T4 (free T4 by equilibrium dialysis + TSH if borderline)',
        'CBC (normocytic normochromic anaemia)',
        'Biochemistry (hypercholesterolaemia)',
        'MRI brain + bullae (rule out central/structural)',
        'Levothyroxine trial — response within 4-6 weeks confirms Dx',
        'Bilateral vestibular dysfunction + large breed → hypothyroid is classic'
    ]
},

// ── 4. Ototoxic Vestibulotoxicity (Aminoglycoside / Cisplatin) ──────────
{ id: 'vest-ototoxic', name: 'Ototoxic Vestibulotoxicity (Aminoglycoside/Cisplatin)', category: 'Toxic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A] Signalment — any breed/age; entirely drug-dependent
        var A = 20;

        // [B] Temporal — acute after drug exposure
        var B = 0;
        if      (oc === 'acute' || oc === 'peracute') B = 45;
        else if (oc === 'subacute')                   B = 30;
        else                                          B = 10;

        // [C] Pain — absent (toxic)
        var C = 0;
        if (pl === 'none') C = 35;
        else               C = 10;

        // [D] Deficit — peripheral vestibular
        var D = 0;
        if (hasHeadTilt(s))                                                                      D += 20;
        if ((s.nystagmusR === 'horizontal' || s.nystagmusL === 'horizontal') ||
            (s.nystagmusR === 'rotatory' || s.nystagmusL === 'rotatory'))                        D += 20;
        if (!mentalDepressed(s))                                                                 D += 15;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        var drug = s.recentNeurologicDrug || '';
        if (drug === 'aminoglycoside' || drug === 'cisplatin' || drug === 'chlorhexidine-ear') {
            mult *= 2.0;
            if (drug === 'chlorhexidine-ear') flags.push('Chlorhexidine ear cleaning with ruptured tympanic membrane — confirmed ototoxic trigger (×2.0)');
            else flags.push('Ototoxic drug history — strongly supports vestibulotoxicity (×2.0)');
        } else if (!drug || drug === 'none') {
            mult *= 0.2; flags.push('No ototoxic drug/agent history — ototoxicity unlikely without it (×0.2)');
        } else {
            mult *= 0.5; flags.push('Different drug noted — verify ototoxic potential (×0.5)');
        }

        alerts.push({
            type: 'WARNING',
            title: 'Stop Ototoxic Drug — Cochlear/Vestibular Damage May Be Irreversible',
            text: 'Aminoglycoside/cisplatin ototoxicity: STOP drug immediately. Cochlear and vestibular damage may be permanent. IV fluids to enhance drug elimination where safe.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Drug/agent history (aminoglycosides, cisplatin, furosemide high-dose, chlorhexidine ear cleaning with ruptured tympanum)',
        'BAER test (cochlear function — may be irreversibly lost)',
        'MRI brain + bullae (rule out concurrent structural lesion)',
        'Stop offending drug',
        'Supportive care — vestibular adaptation over weeks to months',
        'Alternative antibiotic if infection requires ongoing treatment'
    ]
},

// ── 5. Congenital Vestibular Disease ──────────────────────────────────────
{ id: 'vest-congenital', name: 'Congenital Vestibular Disease', category: 'Anomalous/Congenital',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — breed-specific; signs from birth/weaning
        var A = 0;
        var congenBreeds = ['Doberman Pinscher', 'Beagle', 'Akita', 'English Cocker Spaniel',
            'German Shepherd', 'Smooth Fox Terrier', 'Tibetan Terrier'];
        if (isBreed(s, congenBreeds)) { A += 30; flags.push('Breed predisposed to congenital vestibular disease'); }
        if      (age < 1) { A += 35; flags.push('Age <1y — congenital vestibular disease presents from birth/weaning'); }
        else if (age < 2)  A += 15;
        else              { A += 0; flags.push('Age >2y — congenital vestibular disease would have been evident since puppyhood'); }

        // [B] Temporal — chronic/static from birth
        var B = 0;
        if      (oc === 'chronic')  B = 50;
        else if (oc === 'subacute') B = 20;
        else                        B = 5;

        // [C] Pain — absent (congenital structural)
        var C = 0;
        if (pl === 'none') C = 40;
        else               { C = 5; flags.push('Pain present — unexpected for congenital vestibular disease'); }

        // [D] Deficit — peripheral vestibular pattern; nystagmus often absent (central compensation)
        var D = 0;
        if (hasHeadTilt(s))                                                                      D += 25;
        if (!mentalDepressed(s))                                                                 D += 20;
        if ((s.nystagmusR === 'horizontal' || s.nystagmusL === 'horizontal') ||
            (s.nystagmusR === 'rotatory' || s.nystagmusL === 'rotatory'))                        D += 10;
        if ((!s.nystagmusR || s.nystagmusR === 'none') && (!s.nystagmusL || s.nystagmusL === 'none')) D += 10; // often absent due to adaptation

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (s.progression === 'worsening')       { mult *= 0.1; flags.push('Progressive worsening — congenital vestibular is STATIC; consider inflammatory/neoplastic (×0.1)'); }
        if (s.progression === 'stable')          { mult *= 1.5; flags.push('Non-progressive/stable — hallmark of congenital vestibular disease (×1.5)'); }
        if (oc === 'peracute' || oc === 'acute') { mult *= 0.1; flags.push('Acute onset — congenital vestibular signs are present from birth, not sudden (×0.1)'); }
        if (age > 2)                             { mult *= 0.2; flags.push('Age >2y — congenital vestibular disease would have been apparent since puppyhood (×0.2)'); }
        if (centralVestibularSigns(s))           { mult *= 0.2; flags.push('Vertical/changing nystagmus — central lesion, not congenital peripheral (×0.2)'); }
        if (mentalDepressed(s))                  { mult *= 0.2; flags.push('Mental depression — central lesion, not congenital peripheral vestibular (×0.2)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'Detailed history — signs present from birth or weaning (static vs. progressive)',
        'BAER test (sensorineural deafness common — bilateral in Dalmatian/white coat breeds)',
        'MRI brain + bullae (rule out structural middle ear disease or central lesion)',
        'CT bullae (rule out otitis media, polyp)',
        'No treatment — signs often improve with central compensation over weeks to months',
        'Owner education: static condition, manageable long-term'
    ]
},

// ── 6. Nasopharyngeal Polyp ────────────────────────────────────────────────
{ id: 'vest-polyp', name: 'Nasopharyngeal Polyp — Middle Ear Extension', category: 'Structural',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — young dogs (more common in cats); any breed
        var A = 0;
        if      (age < 2) { A += 30; flags.push('Age <2y — nasopharyngeal polyp most common in young animals'); }
        else if (age < 4)  A += 20;
        else if (age < 7)  A += 10;
        else              { A += 5; flags.push('Age >7y — polyp less likely; consider neoplasia'); }

        // [B] Temporal — subacute to chronic (slow growth)
        var B = 0;
        if      (oc === 'chronic')  B = 40;
        else if (oc === 'subacute') B = 40;
        else if (oc === 'acute')    B = 20;
        else                        B = 10;

        // [C] Pain — otalgia possible; head pain with middle ear involvement
        var C = 0;
        if      (pl === 'at-site') C = 25;
        else if (pl === 'none')    C = 20;
        else                       C = 10;

        // [D] Deficit — peripheral vestibular + possible Horner's + possible CN VII
        var D = 0;
        if (hasHeadTilt(s))                                                                      D += 20;
        if ((s.nystagmusR === 'horizontal' || s.nystagmusL === 'horizontal') ||
            (s.nystagmusR === 'rotatory' || s.nystagmusL === 'rotatory'))                        D += 15;
        if (!mentalDepressed(s))                                                                 D += 15;
        if (s.otitis === 'yes')                                                                  D += 15;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                                                   D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (centralVestibularSigns(s)) { mult *= 0.2; flags.push('Vertical/changing nystagmus — central lesion, not polyp (×0.2)'); }
        if (mentalDepressed(s))        { mult *= 0.2; flags.push('Mental depression — central lesion, not nasopharyngeal polyp (×0.2)'); }
        if (age > 7)                   { mult *= 0.4; flags.push('Age >7y — neoplasia more likely than benign polyp (×0.4)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CT bullae (tympanic bulla soft tissue mass — modality of choice)',
        'Otoscopic exam under anaesthesia (polyp visible in ear canal or nasopharynx)',
        'MRI brain + bullae (if CN deficits or central signs present)',
        'Biopsy (inflammatory polyp — fibrovascular stalk)',
        'Treatment: traction-avulsion ± bulla osteotomy (TECA-BO for recurrence prevention)',
        'Prognosis good with complete removal; recurrence risk without bulla osteotomy'
    ]
},

// ── 7. CN VIII Nerve Sheath Tumor (Schwannoma) ────────────────────────────
{ id: 'vest-cn8-tumor', name: 'CN VIII Nerve Sheath Tumor (Schwannoma/PNST)', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — middle-aged to older dogs; any breed
        var A = 0;
        if      (age >= 8) A += 30;
        else if (age >= 5) A += 20;
        else if (age >= 3) A += 10;
        else               { A += 2; flags.push('Age <3y — CN VIII tumor very unlikely'); }

        // [B] Temporal — slowly progressive (chronic)
        var B = 0;
        if      (oc === 'chronic')  B = 45;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 10;
        else                        B = 5;

        // [C] Pain — mild otalgia possible with nerve involvement
        var C = 0;
        if      (pl === 'none')    C = 25;
        else if (pl === 'at-site') C = 20;
        else                       C = 10;

        // [D] Deficit — slowly progressive unilateral peripheral vestibular ± CN VII
        var D = 0;
        if (hasHeadTilt(s))                                                                      D += 20;
        if ((s.nystagmusR === 'horizontal' || s.nystagmusL === 'horizontal') ||
            (s.nystagmusR === 'rotatory' || s.nystagmusL === 'rotatory'))                        D += 15;
        if (!mentalDepressed(s))                                                                 D += 15;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                                                   D += 15;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 8;
        var mult = 1;
        if (age < 3)                   { mult *= 0.1; flags.push('Age <3y — CN VIII tumor essentially excluded (×0.1)'); }
        if (oc === 'peracute')         { mult *= 0.2; flags.push('Peracute — tumor does not present acutely; consider stroke or idiopathic (×0.2)'); }
        if (centralVestibularSigns(s)) { mult *= 0.3; flags.push('Vertical/changing nystagmus — consider intracranial extension (×0.3)'); }
        if (mentalDepressed(s))        { mult *= 0.3; flags.push('Mental depression — suggests intracranial extension (×0.3)'); }

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'MRI brain with contrast (mass at internal acoustic meatus / cerebellopontine angle — enhancing)',
        'CT bullae (bony erosion of petrous temporal bone)',
        'CSF analysis (elevated protein; cytology)',
        'Thoracic radiographs (staging)',
        'Neurosurgery referral (translabyrinthine or retrosigmoid approach)',
        'Radiation therapy if surgical resection incomplete'
    ]
},

// ── 8. Head Trauma — Petrous Temporal Bone / CN VIII ──────────────────────
{ id: 'vest-trauma', name: 'Head Trauma — Petrous Temporal Bone / CN VIII Injury', category: 'Vascular/Traumatic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];

        // [A] Signalment — any breed/age
        var A = 20;

        // [B] Temporal — peracute to acute (trauma)
        var B = 0;
        if      (oc === 'peracute' || oc === 'acute') B = 45;
        else if (oc === 'subacute')                   B = 20;
        else                                          B = 5;

        // [C] Pain — head pain common post-trauma
        var C = 0;
        if      (pl === 'at-site') C = 30;
        else if (pl === 'none')    C = 15;
        else                       C = 10;

        // [D] Deficit — acute peripheral vestibular ± CN VII
        var D = 0;
        if (hasHeadTilt(s))                                                                      D += 20;
        if ((s.nystagmusR === 'horizontal' || s.nystagmusL === 'horizontal') ||
            (s.nystagmusR === 'rotatory' || s.nystagmusL === 'rotatory'))                        D += 15;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                                                   D += 15;
        if (!mentalDepressed(s))                                                                 D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 5;
        var mult = 1;
        if (s.traumaHistory === 'yes') { mult *= 2.0; flags.push('Trauma history confirmed — strongly supports traumatic vestibular injury (×2.0)'); }
        else                           { mult *= 0.2; flags.push('No trauma history — traumatic aetiology unlikely without it (×0.2)'); }
        if (oc === 'chronic')          { mult *= 0.2; flags.push('Chronic onset — trauma presents acutely (×0.2)'); }
        if (mentalDepressed(s))        { mult *= 0.5; flags.push('Mental depression — consider concurrent intracranial injury (×0.5)'); }

        alerts.push({
            type: 'WARNING',
            title: 'Head Trauma — Assess for Intracranial Injury',
            text: 'Assess for concurrent intracranial haemorrhage or brainstem injury. Monitor mentation closely. CT skull + brain recommended urgently. Monitor for Cushing\'s reflex (bradycardia + hypertension = raised ICP).'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CT skull + brain URGENT (petrous temporal bone fracture, intracranial haemorrhage)',
        'Neurological monitoring — mentation, pupil size/symmetry, heart rate',
        'Blood pressure monitoring (Cushing\'s reflex)',
        'MRI brain (if CT inconclusive or brainstem injury suspected)',
        'Supportive care: head elevation 30°, mannitol if raised ICP suspected',
        'BAER test (sensorineural deafness may be permanent)'
    ]
},

// ── 7. Middle Ear / Petrous Temporal Bone Malignancy ──────────────────────
{ id: 'vest-ear-tumor', name: 'Middle Ear / Petrous Temporal Bone Malignancy', category: 'Neoplastic',
    score: function (s, region) {
        var oc = onsetClass(s);
        var pl = painLocation(s, region);
        var flags = [], alerts = [];
        var age = parseFloat(s.age) || 0;

        // [A] Signalment — older dogs; ceruminous gland adenocarcinoma, SCC, OSA
        // Cocker Spaniels predisposed to ceruminous gland tumors (chronic otitis→ malignant transformation)
        var A = 0;
        if      (age >= 9) A = 50;
        else if (age >= 7) A = 35;
        else if (age >= 5) A = 20;
        else               A = 5;
        if (isBreed(s, ['Cocker Spaniel', 'English Cocker Spaniel'])) A = Math.min(50, A + 15);
        else if (isBreed(s, predispositions.large))                    A = Math.min(50, A + 5);

        // [B] Temporal — chronic, slowly progressive; may have acute deterioration
        var B = 0;
        if      (oc === 'chronic')  B = 45;
        else if (oc === 'subacute') B = 30;
        else if (oc === 'acute')    B = 15;
        else                        B = 5;
        if (s.progression === 'worsening') B = Math.min(50, B + 10);

        // [C] Pain — otalgia; head pain; often significant
        var C = 0;
        if      (pl === 'at-site') C = 35;
        else if (pl === 'none')    C = 10;
        else                       C = 15;

        // [D] Deficit — peripheral vestibular ± CN VII (ipsilateral); Horner's syndrome possible
        var D = 0;
        if (s.otitis === 'yes')                                                                  D += 20;
        if (hasHeadTilt(s))                                                                      D += 15;
        if ((s.nystagmusR === 'horizontal' || s.nystagmusL === 'horizontal') ||
            (s.nystagmusR === 'rotatory' || s.nystagmusL === 'rotatory'))                        D += 10;
        if ((hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')))                                                   D += 15;
        if ((s.hornersSyndromeR === 'present') !== (s.hornersSyndromeL === 'present'))           { D += 20; flags.push('Horner\'s syndrome — sympathetic pathway through petrous bone; supports middle ear/petrous mass'); }
        if (!mentalDepressed(s))                                                                 D += 10;

        var total = Math.min(50, A) + Math.min(50, B) + Math.min(50, C) + Math.min(50, D) + 10;
        var mult = 1;
        if (age < 5) { mult *= 0.2; flags.push('Age <5y — ear malignancy rare in young dogs (×0.2)'); }
        if (oc === 'peracute' && s.progression === 'stable') {
            mult *= 0.3; flags.push('Peracute non-progressive — idiopathic or traumatic more likely than tumor (×0.3)');
        }
        if (s.otitis === 'yes' && age >= 9 && s.progression === 'worsening') {
            mult *= 1.5; flags.push('Chronic otitis + older dog + progression — malignant transformation must be excluded (×1.5)');
        }

        alerts.push({
            type: 'WARNING',
            title: 'Chronic Otitis in Older Dog — Exclude Malignancy',
            text: 'Middle ear malignancy (ceruminous gland adenocarcinoma, SCC) can masquerade as refractory otitis media-interna. In dogs ≥7y with chronic progressive vestibular signs + facial nerve palsy not responding to antimicrobials, CT/MRI with contrast is mandatory. Biopsy under CT guidance if mass identified.'
        });

        return { score: total * mult, flags: flags, alerts: alerts };
    },
    workup: [
        'CT bullae with contrast (FIRST — lytic bony destruction pathognomonic for malignancy)',
        'MRI brain + bullae with contrast (intracranial extension assessment)',
        'Otoscopic examination under anaesthesia (visible mass, ulceration, hemorrhagic discharge)',
        'Biopsy + histopathology (definitive — CT-guided or via otoscope)',
        'Thoracic radiographs (metastasis screening)',
        'TECA-BO (total ear canal ablation + bulla osteotomy) — primary surgical treatment',
        'Oncology referral for adjuvant radiotherapy'
    ]
}

];

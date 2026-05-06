// ddxHelpers.js — helpers specific to the diagnosis scoring layer.
// Kept separate from helpers.js (used by localisation rules) until diagnoses are stable.
// All functions use OUR parameter names directly — no DDX normalisation adapter.

// ── Breed ────────────────────────────────────────────────────────────────────
function isBreed(s, list) {
    if (!list || !s.breed) return false;
    return list.indexOf(s.breed) !== -1;
}
function breedKnown(s) {
    return !!(s.breed && s.breed !== 'unknown' && s.breed !== 'mixed/unknown');
}

// Breed predisposition lists — referenced by diagnosis score functions.
var predispositions = {
    chondro:  ['Dachshund','French Bulldog','Beagle','Basset Hound','Cocker Spaniel',
               'Cavalier King Charles Spaniel','Shih Tzu','Lhasa Apso','Pekingese','Bulldog',
               'Pembroke Welsh Corgi','Cardigan Welsh Corgi','Miniature Poodle','Bichon Frise'],
    screwTail:['French Bulldog','Bulldog','Pug','Boston Terrier'],
    large:    ['German Shepherd','Labrador Retriever','Golden Retriever','Rottweiler',
               'Doberman Pinscher','Bernese Mountain Dog','Irish Setter','Weimaraner','Dalmatian',
               'Boxer','Standard Poodle','Border Collie','Airedale Terrier','Great Dane',
               'Saint Bernard','Irish Wolfhound','Mastiff','Newfoundland','Leonberger'],
    dm:       ['German Shepherd','Boxer','Pembroke Welsh Corgi','Cardigan Welsh Corgi',
               'Siberian Husky','Miniature Poodle','Standard Poodle','Chesapeake Bay Retriever',
               'Rhodesian Ridgeback','Bernese Mountain Dog','Kerry Blue Terrier','Golden Retriever',
               'Wire Fox Terrier','American Eskimo Dog','Soft Coated Wheaten Terrier','Pug'],
    csmDisc:  ['Doberman Pinscher'],
    csmOss:   ['Great Dane','Mastiff','Bernese Mountain Dog','Saint Bernard'],
    toy:      ['Yorkshire Terrier','Chihuahua','Pomeranian','Toy Poodle','Maltese',
               'Miniature Pinscher','Papillon'],
    fcem:     ['Labrador Retriever','Golden Retriever','German Shepherd',
               'Miniature Schnauzer','Bernese Mountain Dog','Shetland Sheepdog','Irish Wolfhound'],
    srma:     ['Boxer','Beagle','Bernese Mountain Dog','Weimaraner',
               'Nova Scotia Duck Tolling Retriever','Bichon Frise'],
    ie:       ['Border Collie','Belgian Malinois','German Shepherd','Labrador Retriever',
               'Golden Retriever','Irish Setter','Vizsla','Bernese Mountain Dog','Standard Poodle',
               'Keeshond','Australian Shepherd'],
    nme:      ['Pug','Maltese','Yorkshire Terrier','Chihuahua','French Bulldog',
               'Boston Terrier','Papillon']
};

// ── Onset classification with duration ───────────────────────────────────────
function onsetClass(s) {
    if (s.onset === 'peracute') return 'peracute';
    if (s.onset === 'acute') {
        var d = parseFloat(s.duration) || 0;
        if (d <= 2) return 'acute';
        if (d <= 14) return 'subacute';
        return 'chronic';
    }
    return 'chronic';
}

// ── Pain: returns 'at-site' | 'elsewhere' | 'none' per location ──────────────
// Our params: painCervical, painThoracolumbar, painLumbar, painLumbosacral
// Each is one of 'none' | 'mild' | 'moderate' | 'severe' | undefined.
// Region → expected pain-param key(s).
var DDX_PAIN_PARAMS = {
    'C1-C5':                ['painCervical'],
    'C6-T2':                ['painCervical'],
    'T3-L3':                ['painThoracolumbar'],
    'L4-S3':                ['painThoracolumbar', 'painLumbar'],
    'L7-S3':                ['painLumbosacral'],
    'forebrain':            ['painCervical'], // cervical pain ≈ meningeal signs proxy
    'diencephalon':         ['painCervical'],
    'cerebellum':           ['painCervical'],
    'medulla-rostral':      ['painCervical'],
    'medulla-caudal':       ['painCervical'],
    'midbrain':             ['painCervical'],
    'pons':                 ['painCervical'],
    'brainstem-diffuse':    ['painCervical'],
    'vestibular-peripheral':   [],
    'vestibular-central':      ['painCervical'],
    'vestibular-paradoxical':  ['painCervical'],
    'peripheral':              [],
    'multifocal':              ['painCervical', 'painThoracolumbar', 'painLumbar', 'painLumbosacral']
};

function ddxAnyPain(s) {
    return (s.painCervical && s.painCervical !== 'none')
        || (s.painThoracolumbar && s.painThoracolumbar !== 'none')
        || (s.painLumbar && s.painLumbar !== 'none')
        || (s.painLumbosacral && s.painLumbosacral !== 'none');
}

function painLocation(s, region) {
    if (!ddxAnyPain(s)) return 'none';
    var key = (region || '').toLowerCase().indexOf('multifocal') === 0 ? 'multifocal' : region;
    var expected = DDX_PAIN_PARAMS[key] || [];
    for (var i = 0; i < expected.length; i++) {
        var v = s[expected[i]];
        if (v && v !== 'none') return 'at-site';
    }
    return 'elsewhere';
}

// ── Systemic signs ───────────────────────────────────────────────────────────
function systemicScore(s) {
    var bonus = 0;
    if (s.fever === 'yes')      bonus += 15;
    if (s.weightLoss === 'yes') bonus += 10;
    if (s.anorexia === 'yes')   bonus += 10;
    if (s.lethargy === 'yes')   bonus += 10;
    return bonus;
}

// ── Mentation / cerebellar / vestibular derived flags ────────────────────────
function mentalDepressed(s) {
    return s.consciousnessLevel === 'somnolent/depressed/obtunded'
        || s.consciousnessLevel === 'stuporous'
        || s.consciousnessLevel === 'comatose';
}
function cerebellarSigns(s) {
    // Our params: gait may include 'hypermetria' / 'head tremor'; ataxiaType may include 'cerebellar'
    return (hasValue(s, 'gait', 'hypermetria L') || hasValue(s, 'gait', 'hypermetria R'))
        || hasValue(s, 'gait', 'head tremor')
        || hasValue(s, 'ataxiaType', 'cerebellar');
}
function centralVestibularSigns(s) {
    return s.nystagmusR === 'vertical' || s.nystagmusL === 'vertical'
        || s.nystagmusR === 'direction changing' || s.nystagmusL === 'direction changing';
}

// ── Postural deficit presence ────────────────────────────────────────────────
function pelvicPosturalDeficit(s) {
    return s.pelvicRight === 'decreased' || s.pelvicRight === 'absent'
        || s.pelvicLeft === 'decreased' || s.pelvicLeft === 'absent';
}
function thoracicPosturalDeficit(s) {
    return s.thoracicRight === 'decreased' || s.thoracicRight === 'absent'
        || s.thoracicLeft === 'decreased' || s.thoracicLeft === 'absent';
}

// ── Postural score per region (0–20 bonus for matching pattern) ──────────────
function postureScore(s, region) {
    var pP = pelvicPosturalDeficit(s);
    var pT = thoracicPosturalDeficit(s);
    var bonus = 0;
    switch (region) {
        case 'C1-C5':
            if (pP && pT) bonus = 20;
            else if (pP || pT) bonus = 12;
            break;
        case 'C6-T2':
            if (pP) bonus += 12;
            if (pT) bonus += 8;
            break;
        case 'T3-L3':
            if (pP && !pT) bonus = 18;
            else if (pP) bonus = 10;
            break;
        case 'L4-S3':
        case 'L7-S3':
            if (pP && !pT) bonus = 18;
            else if (pP) bonus = 8;
            break;
        case 'forebrain':
        case 'diencephalon':
        case 'cerebellum':
            bonus = 0; // posturals may be normal; handled inside per-diagnosis scoring
            break;
        case 'medulla-rostral':
        case 'medulla-caudal':
        case 'midbrain':
        case 'pons':
        case 'brainstem-diffuse':
            if (pP || pT) bonus = 8;
            break;
    }
    return bonus;
}

// ── Confidence tier from final score ─────────────────────────────────────────
function ddxConfidence(score) {
    if (score > 200) return 'HIGHLY LIKELY';
    if (score >= 100) return 'LIKELY';
    if (score >= 50) return 'POSSIBLE';
    if (score >= 10) return 'LESS LIKELY';
    return 'ESSENTIALLY EXCLUDED';
}

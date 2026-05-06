// Multifocal — unified into the main rules array. Treated like any other localisation.
// Parameter-based (faithful to Ivana's 4 rules). If ANY of the 4 patterns match,
// fires DEFINITE at location 'multifocal'; evidence lists each matched pattern.
//
// TODO (pending Ivana input):
//   - 'leaning' / 'falling' are not in parametersModel — vestibular-sign trigger
//     currently uses head tilt OR any nystagmus. Remap when params added.
//   - 'abnormal mental status' is mapped to consciousnessLevel !== 'alert' only.
//     If Ivana also wants behaviour-abnormal included, extend abnormalMental().

app.rules['multifocal'] = (function () {

    function seizures(s)       { return s.epilepticSeizures === 'yes'; }
    function abnormalMental(s) {
        return (!!(s.consciousnessLevel) && s.consciousnessLevel !== 'alert')
            || (!!(s.behavior) && s.behavior !== 'normal');
    }
    function menaceAbsent(s)   { return s.menaceResponseR === 'absent' || s.menaceResponseL === 'absent'; }
    function circling(s)       { return (hasValue(s, 'gait', 'circling L') || hasValue(s, 'gait', 'circling R')); }
    function anyNystagmus(s) {
        return (s.nystagmusR && s.nystagmusR !== 'none')
            || (s.nystagmusL && s.nystagmusL !== 'none');
    }
    function vestibularSigns(s) {
        return hasHeadTilt(s) || anyNystagmus(s)
            || hasValue(s, 'ataxiaType', 'vestibular')
            || hasValue(s, 'gait', 'rolling L') || hasValue(s, 'gait', 'rolling R');
    }
    function cerebellarParamSigns(s) {
        return (hasValue(s, 'gait', 'hypermetria L') || hasValue(s, 'gait', 'hypermetria R'))
            || hasValue(s, 'gait', 'head tremor')
            || hasValue(s, 'ataxiaType', 'cerebellar');
    }
    function umnTetraparesis(s) {
        if (!hasValue(s, 'gait', 'tetraparesis')) return false;
        // Pass 4 (2026-05-04): "compatible with UMN" — patellar/tone are NOT explicitly
        // decreased/absent. Allows undefined (not tested) to be treated as compatible
        // with UMN, so the pattern fires even when those reflexes weren't documented.
        var patellarOK = s.patellarReflexR !== 'decreased' && s.patellarReflexR !== 'absent'
                      && s.patellarReflexL !== 'decreased' && s.patellarReflexL !== 'absent';
        var toneOK = s.extensorToneThoracicR !== 'decreased'
                  && s.extensorToneThoracicL !== 'decreased'
                  && s.extensorTonePelvicR   !== 'decreased'
                  && s.extensorTonePelvicL   !== 'decreased';
        return patellarOK && toneOK;
    }

    var patterns = [
        {
            name: 'Forebrain + vestibular',
            text: 'Forebrain signs (seizures or abnormal behaviour) combined with vestibular signs. Pass 7/8: trigger is seizures || behaviour abnormal — vestibular nuclei in brainstem can produce altered mentation OR menace deficit (so those alone are central vestibular, not multifocal).',
            test: function (s) {
                var strongForebrain = seizures(s) || (!!(s.behavior) && s.behavior !== 'normal');
                if (!(strongForebrain && vestibularSigns(s))) return false;
                return 'definite';
            }
        },
        {
            name: 'Forebrain + vestibular + cerebellar',
            text: 'Seizures combined with vestibular signs (head tilt or nystagmus) and cerebellar signs (dysmetria or head tremor). Indicates forebrain + cerebellar + brainstem (rostral medulla) or cerebellar peduncle involvement.',
            test: function (s) {
                return seizures(s) && vestibularSigns(s) && cerebellarParamSigns(s);
            }
        },
        {
            name: 'Forebrain + UMN tetraparesis',
            text: 'Seizures combined with tetraparesis (any reflex pattern compatible with UMN). Seizures localise unambiguously to forebrain; tetraparesis to spinal cord. Two lesion sites required. Pass 5 (2026-05-04): tightened to require seizures (not just any forebrain trigger) — mentation alone + tetraparesis is more often brainstem-mediated than truly multifocal.',
            test: function (s) {
                return seizures(s) && umnTetraparesis(s);
            }
        },
        {
            name: 'Forebrain + cerebellar',
            text: 'Forebrain signs (seizures, abnormal behaviour, or altered mentation) combined with cerebellar signs. Pass 8 (Ivana Q2 yes): mentation re-included as a forebrain trigger here — cerebellum cannot produce altered mentation, so somnolent + cerebellar = multifocal. Bilateral menace alone is still NOT a trigger (cerebellum can have ipsilateral bilateral menace deficit).',
            test: function (s) {
                var forebrainForCerebellar = seizures(s)
                    || (!!(s.behavior) && s.behavior !== 'normal')
                    || (!!(s.consciousnessLevel) && s.consciousnessLevel !== 'alert');
                if (!(forebrainForCerebellar && cerebellarParamSigns(s))) return false;
                return 'definite';
            }
        },
        {
            name: 'Vestibular + cerebellar',
            text: 'Vestibular signs combined with cerebellar signs (hypermetria, head tremor, or ataxiaType cerebellar). Pass 8 (Ivana Q3 yes): hypermetria gait sign alone is enough — explicit ataxiaType cerebellar is not required. Tier: DEFINITE when severe multifocal evidence (rolling OR strong lateralization OR vert/changing nystagmus); POSSIBLE for milder pictures (could still fit pure paradoxical syndrome). Pass 9 (2026-05-04): when ataxiaType has BOTH `vestibular` AND `cerebellar` set together, defer entirely — that combination is specifically the paradoxical syndrome (flocculonodular lobe single lesion), not multifocal.',
            test: function (s) {
                if (!(vestibularSigns(s) && cerebellarParamSigns(s))) return false;
                // Both ataxiaTypes set together = paradoxical, not multifocal.
                if (hasValue(s, 'ataxiaType', 'vestibular') && hasValue(s, 'ataxiaType', 'cerebellar')) return false;
                var leftBoth  = (s.thoracicLeft  === 'decreased' || s.thoracicLeft  === 'absent')
                             && (s.pelvicLeft    === 'decreased' || s.pelvicLeft    === 'absent');
                var rightBoth = (s.thoracicRight === 'decreased' || s.thoracicRight === 'absent')
                             && (s.pelvicRight   === 'decreased' || s.pelvicRight   === 'absent');
                var severe = hasValue(s, 'ataxiaType', 'cerebellar')
                          || hasValue(s, 'gait', 'rolling L') || hasValue(s, 'gait', 'rolling R')
                          || leftBoth || rightBoth
                          || s.nystagmusR === 'vertical' || s.nystagmusL === 'vertical'
                          || s.nystagmusR === 'direction changing' || s.nystagmusL === 'direction changing';
                return severe ? 'definite' : 'possible';
            }
        },
        {
            name: 'Central vestibular + cerebellar',
            text: 'Vertical or direction-changing nystagmus (unambiguous central vestibular sign) combined with cerebellar signs (head tremor, hypermetria, or cerebellar ataxia). Two distinct CNS regions implicated even without explicit forebrain signs — central vestibular nuclei + cerebellum span multiple regions.',
            test: function (s) {
                var verticalOrChanging = s.nystagmusR === 'vertical' || s.nystagmusL === 'vertical'
                                      || s.nystagmusR === 'direction changing' || s.nystagmusL === 'direction changing';
                return verticalOrChanging && cerebellarParamSigns(s);
            }
        },
        {
            name: 'Forebrain (strong) + brainstem cranial nerve signs',
            text: 'Forebrain signs — STRICT here: seizures or abnormal behaviour only (NOT mentation alone, since obtundation can be brainstem-mediated) — combined with brainstem cranial nerve abnormalities (facial paresis CN VII, gag reflex deficit CN IX/X, swallowing deficit, voice change, or tongue deviation). Two lesion sites required.',
            test: function (s) {
                var strongForebrain = seizures(s) || (!!(s.behavior) && s.behavior !== 'normal');
                var brainstemCN = hasValue(s, 'facialParesis', 'L') || hasValue(s, 'facialParesis', 'R')
                    || s.gagReflex === 'decreased' || s.gagReflex === 'absent'
                    || s.swallowingFunction === 'dysphagia'
                    || s.voiceChanges === 'dysphonia'
                    || hasValue(s, 'tongue', 'deviated to left') || hasValue(s, 'tongue', 'deviated to right');
                return strongForebrain && brainstemCN;
            }
        }
    ];

    return {
        text: 'Multifocal CNS — signs cannot be explained by a single anatomical location.',
        test: function (selected) {
            // Pass 8 (Ivana Q1, 2026-05-04): patterns can return either boolean true
            // (=> DEFINITE) or one of 'definite' / 'probable' / 'possible'. Final tier
            // = highest among matched patterns.
            var matched = [];
            for (var i = 0; i < patterns.length; i++) {
                var r = patterns[i].test(selected);
                if (!r) continue;
                var tier = (r === 'possible' || r === 'probable' || r === 'definite') ? r : 'definite';
                matched.push({ name: patterns[i].name, text: patterns[i].text, tier: tier });
            }
            if (!matched.length) return false;
            var tierRank = { possible: 1, probable: 2, definite: 3 };
            var bestTier = matched.reduce(function (acc, m) {
                return tierRank[m.tier] > tierRank[acc] ? m.tier : acc;
            }, 'possible');
            return {
                match: bestTier,
                location: 'multifocal',
                evidence: matched.map(function (m) { return m.name + ' — ' + m.text; }),
                reasoning: matched.length === 1
                    ? 'Multifocal pattern: ' + matched[0].name + ' (tier: ' + matched[0].tier + ')'
                    : 'Multifocal patterns (' + matched.length + ', best tier: ' + bestTier + '): ' + matched.map(function (m) { return m.name + '/' + m.tier; }).join('; ')
            };
        }
    };
})();

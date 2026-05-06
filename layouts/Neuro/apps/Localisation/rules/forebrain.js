app.rules['forebrain'] = {
                text: 'Localize to the forebrain when behavior is normal or abnormal or consciousnessLevel is altered (alert to stuporous) without brainstem signs. Typical findings include disorientation, compulsive behavior, circling, aggression, or seizures. Gait may be normal or show hemiparesis or circling. Postural reactions can be decreased CONTRALATERAL to the lesion while spinal reflexes remain normal, but they can also be normal. MenaceResponse and nasalSensation are decreased or absent on the CONTRALATERAL side, but they can also be normal, or just one of them is decreased or absent. If menaceResponse is decreased with normal directPlr, cortical blindness is present. Seizures strongly support forebrain localization, but absence of seizures does not exclude forebrain lesion. Deficits localize contralateral to postural and visual abnormalities.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // EXCLUSION: if comatose, this suggests brainstem not forebrain
                    if (selected.consciousnessLevel === 'comatose') {
                        return false;
                    }

                    // EXCLUSION: Caudal medulla signs (CN IX/X/XII) → medulla-caudal lesion, not forebrain
                    const caudalMedullaSigns = selected.voiceChanges || selected.swallowingFunction || selected.gagReflex === 'decreased' || selected.gagReflex === 'absent' || selected.regurgitation === 'present' || hasValue(selected, 'tongue', 'deviated to left') || hasValue(selected, 'tongue', 'deviated to right');
                    if (caudalMedullaSigns) {
                        return false;
                    }

                    const mentationAbnormal = selected.consciousnessLevel === 'somnolent/depressed/obtunded' || selected.consciousnessLevel === 'stuporous';
                    const behaviorAbnormal = selected.behavior && selected.behavior !== 'normal';
                    const seizuresPresent = selected.epilepticSeizures === 'yes';
                    const circlingGait = (hasValue(selected, 'gait', 'circling L') || hasValue(selected, 'gait', 'circling R'));

                    if (mentationAbnormal) {
                        evidence.push(`Mentation abnormal (${selected.consciousnessLevel})`);
                    }

                    if (behaviorAbnormal) {
                        evidence.push(`Behavior abnormal: ${selected.behavior}`);
                    }

                    if (seizuresPresent) {
                        evidence.push('Seizures present');
                    }

                    const spinalReflexesNormal = matches(selected, 'patellarReflexR', ['normal']) && matches(selected, 'patellarReflexL', ['normal']) && matches(selected, 'withdrawalThoracicR', ['normal']) && matches(selected, 'withdrawalThoracicL', ['normal']) && matches(selected, 'withdrawalPelvicR', ['normal']) && matches(selected, 'withdrawalPelvicL', ['normal']);

                    if (spinalReflexesNormal) {
                        evidence.push('Spinal reflexes normal (forebrain intact)');
                    }

                    const leftPosturalWorse = (selected.thoracicLeft === 'decreased' || selected.thoracicLeft === 'absent' || selected.pelvicLeft === 'decreased' || selected.pelvicLeft === 'absent') && (matches(selected, 'thoracicRight', ['normal']) || matches(selected, 'pelvicRight', ['normal']));
                    const rightPosturalWorse = (selected.thoracicRight === 'decreased' || selected.thoracicRight === 'absent' || selected.pelvicRight === 'decreased' || selected.pelvicRight === 'absent') && (matches(selected, 'thoracicLeft', ['normal']) || matches(selected, 'pelvicLeft', ['normal']));
                    const asymmetricPosturalReactions = leftPosturalWorse || rightPosturalWorse;

                    if (leftPosturalWorse) {
                        evidence.push('Asymmetric postural reactions (left side deficit, contralateral to right forebrain lesion)');
                    }

                    if (rightPosturalWorse) {
                        evidence.push('Asymmetric postural reactions (right side deficit, contralateral to left forebrain lesion)');
                    }

                    const leftMenaceDecreased = selected.menaceResponseL === 'decreased' || selected.menaceResponseL === 'absent';
                    const rightMenaceDecreased = selected.menaceResponseR === 'decreased' || selected.menaceResponseR === 'absent';
                    const leftNasalDecreased = selected.nasalSensationL === 'decreased' || selected.nasalSensationL === 'absent';
                    const rightNasalDecreased = selected.nasalSensationR === 'decreased' || selected.nasalSensationR === 'absent';

                    if (leftMenaceDecreased) {
                        evidence.push('Menace response decreased left (contralateral to right forebrain lesion)');
                    }

                    if (rightMenaceDecreased) {
                        evidence.push('Menace response decreased right (contralateral to left forebrain lesion)');
                    }

                    if (leftNasalDecreased) {
                        evidence.push('Nasal sensation decreased left (contralateral to right forebrain lesion)');
                    }

                    if (rightNasalDecreased) {
                        evidence.push('Nasal sensation decreased right (contralateral to left forebrain lesion)');
                    }

                    // Pass 4 (2026-05-04): cortical-blindness pattern now requires PLR
                    // explicitly tested as 'normal' on at least one side (rather than the
                    // previous default-to-true behaviour, which fired forebrain DEFINITE
                    // on bilateral menace deficit + plr-not-tested).
                    const plrExplicitlyNormal = selected.directPlrR === 'normal' && selected.directPlrL === 'normal';
                    const corticalBlindnessPattern = (leftMenaceDecreased || rightMenaceDecreased) && plrExplicitlyNormal;

                    if (corticalBlindnessPattern) {
                        evidence.push('Cortical blindness pattern: menace decreased with normal PLR');
                    }

                    const gaitCompatible = matches(selected, 'gait', ['normal']) || hasValue(selected, 'gait', 'hemiparesis left-sided') || hasValue(selected, 'gait', 'hemiparesis right-sided') || (hasValue(selected, 'gait', 'circling L') || hasValue(selected, 'gait', 'circling R'));

                    if (gaitCompatible && !hasValue(selected, 'gait', 'normal')) {
                        evidence.push(`Gait: ${displayValue(selected, 'gait')}`);
                    }

                    const severeSpinalSigns = hasValue(selected, 'gait', 'tetraparesis') || hasValue(selected, 'gait', 'tetraplegia') || hasValue(selected, 'gait', 'paraparesis') || hasValue(selected, 'gait', 'paraplegia');

                    // EXCLUSION: If severe spinal signs present, defer to spinal rules —
                    // unless strong brain evidence present (seizures or cortical blindness pattern), in which case this is multifocal disease
                    if (severeSpinalSigns) {
                        const bilateralPostural = (selected.thoracicRight === 'decreased' || selected.thoracicRight === 'absent') && (selected.thoracicLeft === 'decreased' || selected.thoracicLeft === 'absent') && (selected.pelvicRight === 'decreased' || selected.pelvicRight === 'absent') && (selected.pelvicLeft === 'decreased' || selected.pelvicLeft === 'absent');
                        const strongBrainEvidence = seizuresPresent || corticalBlindnessPattern;
                        if (bilateralPostural && !strongBrainEvidence) {
                            return false;
                        }
                    }

                    // EXCLUSION: Vestibular ataxia → not forebrain (vestibular-central will match independently)
                    if (hasValue(selected, 'ataxiaType', 'vestibular')) {
                        return false;
                    }
                    // EXCLUSION: Cerebellar ataxia → not forebrain (cerebellum will match independently)
                    if (hasValue(selected, 'ataxiaType', 'cerebellar')) {
                        return false;
                    }
                    // EXCLUSION (Pass 4 G12, 2026-05-04): 4-limb LMN pattern → peripheral.
                    // When patellar reflexes are decreased/absent on both sides AND
                    // withdrawal is decreased/absent on both thoracic limbs (or all 4),
                    // the picture is peripheral, not forebrain.
                    const patellarBothLMN = (selected.patellarReflexR === 'decreased' || selected.patellarReflexR === 'absent')
                                         && (selected.patellarReflexL === 'decreased' || selected.patellarReflexL === 'absent');
                    const withdrawalThorBothLMN = (selected.withdrawalThoracicR === 'decreased' || selected.withdrawalThoracicR === 'absent')
                                               && (selected.withdrawalThoracicL === 'decreased' || selected.withdrawalThoracicL === 'absent');
                    if (patellarBothLMN && withdrawalThorBothLMN) {
                        return false;
                    }
                    // EXCLUSION (Pass 7, 2026-05-04): facial paresis is a CN VII / brainstem
                    // sign — ANY facial paresis (unilateral or bilateral) means the picture
                    // includes a brainstem component. Forebrain defers; multifocal handles.
                    const facialParesisAny = hasValue(selected, 'facialParesis', 'L') || hasValue(selected, 'facialParesis', 'R');
                    if (facialParesisAny) {
                        return false;
                    }

                    // Any contralateral menace or nasal finding (even just one side, even just one modality)
                    const anyContralateralCranialNerve = leftMenaceDecreased || rightMenaceDecreased || leftNasalDecreased || rightNasalDecreased;

                    // DEFINITE: Core forebrain pattern (posturals can be normal — not required)
                    if ((mentationAbnormal || behaviorAbnormal || seizuresPresent) && asymmetricPosturalReactions && spinalReflexesNormal && gaitCompatible) {
                        return {
                            match: 'definite',
                            location: 'forebrain',
                            evidence: evidence,
                            reasoning: 'Classic forebrain pattern: mentation/behavior/seizures with asymmetric postural deficits and normal spinal reflexes'
                        };
                    }

                    // DEFINITE: Cortical blindness pattern (behavior can be normal)
                    if (corticalBlindnessPattern) {
                        return {
                            match: 'definite',
                            location: 'forebrain',
                            evidence: evidence,
                            reasoning: 'Cortical blindness (menace decreased with normal PLR) indicates forebrain visual cortex involvement'
                        };
                    }

                    // DEFINITE (Pass 4, 2026-05-04): mentation/behavior abnormal + same-side
                    // menace AND nasal deficit (strong contralateral CN cluster, no postural
                    // data needed). Restores cases where cortical-blindness-with-default-PLR
                    // path used to fire and now doesn't.
                    if ((mentationAbnormal || behaviorAbnormal)
                        && ((leftMenaceDecreased && leftNasalDecreased) || (rightMenaceDecreased && rightNasalDecreased))) {
                        return {
                            match: 'definite',
                            location: 'forebrain',
                            evidence: evidence,
                            reasoning: 'Mentation/behaviour abnormal with same-side menace and nasal deficit (contralateral CN cluster) confirm forebrain'
                        };
                    }

                    // DEFINITE: CONTRALATERAL consistency (postural + menace/nasal on same side)
                    if (leftPosturalWorse && (leftMenaceDecreased || leftNasalDecreased)) {
                        return {
                            match: 'definite',
                            location: 'forebrain',
                            evidence: evidence,
                            reasoning: 'Contralateral pattern: left-sided deficits indicate right forebrain lesion'
                        };
                    }
                    if (rightPosturalWorse && (rightMenaceDecreased || rightNasalDecreased)) {
                        return {
                            match: 'definite',
                            location: 'forebrain',
                            evidence: evidence,
                            reasoning: 'Contralateral pattern: right-sided deficits indicate left forebrain lesion'
                        };
                    }

                    // DEFINITE: Seizures + any contralateral CN finding (posturals can be normal)
                    if (seizuresPresent && anyContralateralCranialNerve && gaitCompatible) {
                        return {
                            match: 'definite',
                            location: 'forebrain',
                            evidence: evidence,
                            reasoning: 'Seizures with contralateral menace/nasal deficits confirm forebrain localization'
                        };
                    }

                    // DEFINITE: Seizures + mentation/behaviour abnormal — two independent forebrain signs
                    if (seizuresPresent && (mentationAbnormal || behaviorAbnormal) && !severeSpinalSigns) {
                        return {
                            match: 'definite',
                            location: 'forebrain',
                            evidence: evidence,
                            reasoning: 'Seizures combined with abnormal mentation/behaviour — two independent forebrain signs'
                        };
                    }

                    // PROBABLE: Seizures + asymmetric postural + compatible gait
                    if (seizuresPresent && asymmetricPosturalReactions && gaitCompatible) {
                        return {
                            match: 'probable',
                            location: 'forebrain',
                            evidence: evidence,
                            reasoning: 'Seizures with asymmetric postural deficits strongly suggest forebrain, but some parameters not tested'
                        };
                    }

                    // PROBABLE: Mentation/behavior abnormal + any contralateral CN finding (no posturals needed)
                    if ((mentationAbnormal || behaviorAbnormal) && anyContralateralCranialNerve && !severeSpinalSigns) {
                        return {
                            match: 'probable',
                            location: 'forebrain',
                            evidence: evidence,
                            reasoning: 'Mentation/behavior changes with contralateral menace or nasal deficit suggest forebrain'
                        };
                    }

                    // PROBABLE: Seizures alone — strong localising sign for forebrain on their own
                    if (seizuresPresent && !severeSpinalSigns) {
                        return {
                            match: 'probable',
                            location: 'forebrain',
                            evidence: evidence,
                            reasoning: 'Seizures alone strongly suggest forebrain localisation'
                        };
                    }

                    // POSSIBLE: Behavior or mentation abnormalities alone (behavior can be normal for forebrain, but we need at least something to trigger)
                    if ((mentationAbnormal || behaviorAbnormal) && !severeSpinalSigns) {
                        return {
                            match: 'possible',
                            location: 'forebrain',
                            evidence: evidence,
                            reasoning: 'Mentation or behavior changes suggest forebrain, but lack supporting localizing signs'
                        };
                    }

                    // POSSIBLE: Only contralateral CN finding without mentation/behavior/seizures
                    if (anyContralateralCranialNerve && gaitCompatible && !severeSpinalSigns) {
                        return {
                            match: 'possible',
                            location: 'forebrain',
                            evidence: evidence,
                            reasoning: 'Contralateral menace or nasal deficit suggests forebrain, but lacks mentation/behavior/seizure confirmation'
                        };
                    }

                    return false;
                }
            }
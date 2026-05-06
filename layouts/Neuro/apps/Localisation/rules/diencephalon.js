app.rules['diencephalon'] = {
                text: 'Localize to the diencephalon when consciousnessLevel ranges from alert to stuporous with behavioral abnormalities such as dullness, compulsive behavior, circling, or blindness. Gait may be normal or show contralateral hemiparesis. Postural reactions are decreased CONTRALATERAL to the lesion with intact spinal reflexes. MenaceResponse and nasalSensation may be decreased on the contralateral side. Seizures may be present or absent. Endocrine or homeostatic abnormalities involving appetite, thirst, or thermoregulation further support diencephalic involvement. Central vestibular signs may also be present.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // EXCLUSION: Comatose → not diencephalon (midbrain/brainstem-diffuse will match independently if CN signs present)
                    if (selected.consciousnessLevel === 'comatose') {
                        return false;
                    }

                    // EXCLUSION: Caudal medulla signs (CN IX/X/XII) → medulla-caudal lesion, not diencephalon
                    const caudalMedullaSigns = selected.voiceChanges || selected.swallowingFunction || selected.gagReflex === 'decreased' || selected.gagReflex === 'absent' || selected.regurgitation === 'present' || hasValue(selected, 'tongue', 'deviated to left') || hasValue(selected, 'tongue', 'deviated to right');
                    if (caudalMedullaSigns) {
                        return false;
                    }

                    // EXCLUSION (Pass 2, 2026-05-04): forebrain-defining signs → forebrain
                    // matches independently. Diencephalon is much rarer; defer when these
                    // are present so forebrain can fire alone.
                    //   - circling gait (forebrain hallmark)
                    //   - seizures (forebrain hallmark)
                    //   - bilateral menace deficit with normal PLR (cortical-blindness =
                    //     forebrain)
                    if (hasValue(selected, 'gait', 'circling L') || hasValue(selected, 'gait', 'circling R')) {
                        return false;
                    }
                    if (selected.epilepticSeizures === 'yes') {
                        return false;
                    }
                    const bilateralMenaceDeficit = (selected.menaceResponseR === 'decreased' || selected.menaceResponseR === 'absent')
                                                && (selected.menaceResponseL === 'decreased' || selected.menaceResponseL === 'absent');
                    const plrNormalAll = matches(selected, 'directPlrR', ['normal']) && matches(selected, 'directPlrL', ['normal']);
                    if (bilateralMenaceDeficit && plrNormalAll) {
                        return false;
                    }

                    const mentationAbnormal = selected.consciousnessLevel === 'somnolent/depressed/obtunded' || selected.consciousnessLevel === 'stuporous';
                    const behaviorAbnormal = selected.behavior && selected.behavior !== 'normal';
                    const seizuresPresent = selected.epilepticSeizures === 'yes';

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
                        evidence.push('Spinal reflexes normal (diencephalon intact)');
                    }

                    const leftPosturalWorse = (selected.thoracicLeft === 'decreased' || selected.thoracicLeft === 'absent' || selected.pelvicLeft === 'decreased' || selected.pelvicLeft === 'absent') && (matches(selected, 'thoracicRight', ['normal']) || matches(selected, 'pelvicRight', ['normal']));
                    const rightPosturalWorse = (selected.thoracicRight === 'decreased' || selected.thoracicRight === 'absent' || selected.pelvicRight === 'decreased' || selected.pelvicRight === 'absent') && (matches(selected, 'thoracicLeft', ['normal']) || matches(selected, 'pelvicLeft', ['normal']));
                    const asymmetricPosturalReactions = leftPosturalWorse || rightPosturalWorse;

                    if (leftPosturalWorse) {
                        evidence.push('Asymmetric postural reactions (left side deficit, contralateral to right diencephalon lesion)');
                    }

                    if (rightPosturalWorse) {
                        evidence.push('Asymmetric postural reactions (right side deficit, contralateral to left diencephalon lesion)');
                    }

                    const leftMenaceDecreased = selected.menaceResponseL === 'decreased' || selected.menaceResponseL === 'absent';
                    const rightMenaceDecreased = selected.menaceResponseR === 'decreased' || selected.menaceResponseR === 'absent';
                    const visualImpairment = leftMenaceDecreased || rightMenaceDecreased;

                    if (visualImpairment) {
                        evidence.push('Visual impairment (menace response decreased)');
                    }

                    const leftNasalDecreased = selected.nasalSensationL === 'decreased' || selected.nasalSensationL === 'absent';
                    const rightNasalDecreased = selected.nasalSensationR === 'decreased' || selected.nasalSensationR === 'absent';

                    if (leftNasalDecreased || rightNasalDecreased) {
                        evidence.push('Nasal sensation decreased (contralateral pattern)');
                    }

                    const gaitCompatible = matches(selected, 'gait', ['normal']) || hasValue(selected, 'gait', 'hemiparesis left-sided') || hasValue(selected, 'gait', 'hemiparesis right-sided') || (hasValue(selected, 'gait', 'circling L') || hasValue(selected, 'gait', 'circling R'));

                    if (gaitCompatible && !hasValue(selected, 'gait', 'normal')) {
                        evidence.push(`Gait: ${displayValue(selected, 'gait')}`);
                    }

                    const severeSpinalSigns = hasValue(selected, 'gait', 'tetraparesis') || hasValue(selected, 'gait', 'tetraplegia') || hasValue(selected, 'gait', 'paraparesis') || hasValue(selected, 'gait', 'paraplegia');

                    // EXCLUSION: Severe spinal signs with bilateral postural
                    if (severeSpinalSigns) {
                        const bilateralPostural = (selected.thoracicRight === 'decreased' || selected.thoracicRight === 'absent') && (selected.thoracicLeft === 'decreased' || selected.thoracicLeft === 'absent') && (selected.pelvicRight === 'decreased' || selected.pelvicRight === 'absent') && (selected.pelvicLeft === 'decreased' || selected.pelvicLeft === 'absent');
                        if (bilateralPostural) {
                            return false;
                        }
                    }

                    // EXCLUSION: Seizures + asymmetric postural + behavior → not diencephalon (forebrain will match independently)
                    if (seizuresPresent && asymmetricPosturalReactions && behaviorAbnormal) {
                        return false;
                    }

                    // DEFINITE: Core diencephalic pattern
                    if ((mentationAbnormal || behaviorAbnormal) && asymmetricPosturalReactions && spinalReflexesNormal && gaitCompatible) {
                        return {
                            match: 'definite',
                            location: 'diencephalon',
                            evidence: evidence,
                            reasoning: 'Classic diencephalic pattern: mentation/behavior changes with asymmetric postural deficits and normal spinal reflexes'
                        };
                    }

                    // DEFINITE: CONTRALATERAL consistency
                    if (leftPosturalWorse && (leftMenaceDecreased || leftNasalDecreased) && (mentationAbnormal || behaviorAbnormal)) {
                        return {
                            match: 'definite',
                            location: 'diencephalon',
                            evidence: evidence,
                            reasoning: 'Contralateral pattern: left-sided deficits indicate right diencephalon lesion'
                        };
                    }
                    if (rightPosturalWorse && (rightMenaceDecreased || rightNasalDecreased) && (mentationAbnormal || behaviorAbnormal)) {
                        return {
                            match: 'definite',
                            location: 'diencephalon',
                            evidence: evidence,
                            reasoning: 'Contralateral pattern: right-sided deficits indicate left diencephalon lesion'
                        };
                    }

                    // PROBABLE: Behavior + visual + asymmetric postural
                    if (behaviorAbnormal && visualImpairment && asymmetricPosturalReactions && gaitCompatible) {
                        return {
                            match: 'probable',
                            location: 'diencephalon',
                            evidence: evidence,
                            reasoning: 'Behavior changes, visual deficits, and asymmetric postural reactions suggest diencephalon'
                        };
                    }

                    // POSSIBLE: Mentation or behavior abnormalities with asymmetric signs
                    if ((mentationAbnormal || behaviorAbnormal) && asymmetricPosturalReactions) {
                        return {
                            match: 'possible',
                            location: 'diencephalon',
                            evidence: evidence,
                            reasoning: 'Mentation/behavior changes with asymmetric signs, but insufficient data for higher confidence'
                        };
                    }

                    return false;
                }
            }
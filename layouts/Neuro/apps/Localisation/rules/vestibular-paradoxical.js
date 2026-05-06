app.rules['vestibular-paradoxical'] = {
                text: 'Diagnose paradoxical vestibular syndrome when vestibular ataxia is present with a head tilt CONTRALATERAL to the lesion and postural reaction deficits IPSILATERAL to the lesion. This pattern is characteristic of lesions involving the cerebellar flocculonodular lobe or caudal cerebellar peduncle, though lesions in the rostral and medial vestibular nuclei can also cause paradoxical vestibular signs. Ipsilateral menaceResponse deficits with normal directPlr further support cerebellar involvement.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // EXCLUSION (Pass 1 G1, 2026-05-04): forebrain signs (seizures, abnormal
                    // behaviour) → defer to multifocal.
                    if (selected.epilepticSeizures === 'yes') return false;
                    if (selected.behavior && selected.behavior !== 'normal') return false;
                    // EXCLUSION (Pass 1, 2026-05-04): altered mentation with vest signs is
                    // central vestibular territory — defer to vest-central.
                    if (selected.consciousnessLevel && selected.consciousnessLevel !== 'alert') return false;

                    // EXCLUSION (Pass 8, 2026-05-04): vert/changing nystagmus + cerebellar
                    // gait sign → multifocal pattern 7 picture; defer.
                    var vertOrChanging_p = selected.nystagmusR === 'vertical' || selected.nystagmusL === 'vertical'
                                        || selected.nystagmusR === 'direction changing' || selected.nystagmusL === 'direction changing';
                    var cerebellarGait_p = hasValue(selected, 'gait', 'hypermetria L') || hasValue(selected, 'gait', 'hypermetria R')
                                        || hasValue(selected, 'gait', 'head tremor');
                    if (vertOrChanging_p && cerebellarGait_p) return false;

                    const vestibularAtaxia = hasValue(selected, 'ataxiaType', 'vestibular');

                    if (vestibularAtaxia) {
                        evidence.push('Vestibular ataxia present');
                    }

                    const headTilt = hasHeadTilt(selected);

                    if (headTilt) {
                        evidence.push('Head tilt present');
                    }

                    const cerebellarAtaxia = hasValue(selected, 'ataxiaType', 'cerebellar');

                    if (cerebellarAtaxia) {
                        evidence.push('Cerebellar ataxia present');
                    }

                    if (!vestibularAtaxia && !headTilt) {
                        return false;
                    }

                    const leftPosturalWorse = selected.thoracicLeft === 'decreased' || selected.thoracicLeft === 'absent' || selected.pelvicLeft === 'decreased' || selected.pelvicLeft === 'absent';
                    const rightPosturalWorse = selected.thoracicRight === 'decreased' || selected.thoracicRight === 'absent' || selected.pelvicRight === 'decreased' || selected.pelvicRight === 'absent';

                    // Paradoxical REQUIRES head tilt and postural on OPPOSITE sides.
                    // Bilateral postural or ipsilateral postural is not paradoxical.
                    const headTiltL = hasValue(selected, 'headPosture', 'head tilt L');
                    const headTiltR = hasValue(selected, 'headPosture', 'head tilt R');
                    const contralateralPostural = (headTiltL && rightPosturalWorse && !leftPosturalWorse) || (headTiltR && leftPosturalWorse && !rightPosturalWorse);
                    const noPostural = !leftPosturalWorse && !rightPosturalWorse;

                    if (leftPosturalWorse) {
                        evidence.push('Postural deficits left side (ipsilateral to lesion)');
                    }

                    if (rightPosturalWorse) {
                        evidence.push('Postural deficits right side (ipsilateral to lesion)');
                    }

                    const leftMenaceDecreased = selected.menaceResponseL === 'decreased' || selected.menaceResponseL === 'absent';
                    const rightMenaceDecreased = selected.menaceResponseR === 'decreased' || selected.menaceResponseR === 'absent';
                    const menaceAbnormal = leftMenaceDecreased || rightMenaceDecreased;

                    if (menaceAbnormal) {
                        const side = leftMenaceDecreased && rightMenaceDecreased ? 'bilateral' : (leftMenaceDecreased ? 'left' : 'right');
                        evidence.push(`Menace response decreased (${side}, ipsilateral to lesion)`);
                    }

                    const plrNormal = matches(selected, 'directPlrR', ['normal']) && matches(selected, 'directPlrL', ['normal']);
                    const cerebellarMenacePattern = menaceAbnormal && plrNormal;

                    if (cerebellarMenacePattern) {
                        evidence.push('Cerebellar menace pattern: menace decreased with normal PLR (vision intact)');
                    }

                    // DEFINITE: Vestibular + CONTRALATERAL postural + cerebellar menace pattern
                    if ((vestibularAtaxia || headTilt) && contralateralPostural && cerebellarMenacePattern) {
                        return {
                            match: 'definite',
                            location: 'vestibular-paradoxical',
                            evidence: evidence,
                            reasoning: 'Paradoxical vestibular syndrome: head tilt contralateral to postural deficits with cerebellar menace pattern indicate flocculonodular lobe lesion'
                        };
                    }

                    // DEFINITE: Vestibular + cerebellar ataxia together
                    if (vestibularAtaxia && cerebellarAtaxia) {
                        return {
                            match: 'definite',
                            location: 'vestibular-paradoxical',
                            evidence: evidence,
                            reasoning: 'Combined vestibular and cerebellar ataxia indicate paradoxical vestibular syndrome (caudal cerebellar peduncle lesion)'
                        };
                    }

                    // DEFINITE (Pass 1, 2026-05-04): Vestibular signs + cerebellar gait sign
                    // (hypermetria L/R or head tremor) — same logic as vest+cerebellarAtaxia
                    // but catches cases where ataxiaType is not specified.
                    const cerebellarGaitSign = hasValue(selected, 'gait', 'hypermetria L')
                                            || hasValue(selected, 'gait', 'hypermetria R')
                                            || hasValue(selected, 'gait', 'head tremor');
                    if ((vestibularAtaxia || headTilt) && cerebellarGaitSign) {
                        return {
                            match: 'definite',
                            location: 'vestibular-paradoxical',
                            evidence: evidence,
                            reasoning: 'Vestibular signs with cerebellar gait sign (hypermetria or head tremor) indicate paradoxical vestibular syndrome'
                        };
                    }

                    // PROBABLE: Vestibular + CONTRALATERAL postural (no menace pattern yet)
                    if ((vestibularAtaxia || headTilt) && contralateralPostural) {
                        return {
                            match: 'probable',
                            location: 'vestibular-paradoxical',
                            evidence: evidence,
                            reasoning: 'Head tilt contralateral to postural deficits suggests paradoxical vestibular syndrome'
                        };
                    }

                    // PROBABLE: Vestibular + cerebellar menace pattern without any postural data
                    if ((vestibularAtaxia || headTilt) && cerebellarMenacePattern && noPostural) {
                        return {
                            match: 'probable',
                            location: 'vestibular-paradoxical',
                            evidence: evidence,
                            reasoning: 'Vestibular signs with cerebellar menace pattern suggest paradoxical vestibular syndrome'
                        };
                    }

                    return false;
                }
            }
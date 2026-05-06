app.rules['vestibular-central'] = {
                text: 'Diagnose central vestibular disease when vestibular ataxia and head tilt are accompanied by vertical or direction-changing nystagmus, though any type of nystagmus can be associated with central vestibular disease. Chronic cases may not display nystagmus. Ipsilateral postural reaction deficits, cranial nerve abnormalities other than cranial nerve VII (facial), or altered consciousnessLevel further support central involvement but level of consciousness can be normal. Vertical nystagmus is a key feature distinguishing central from peripheral vestibular disease but is not frequently seen. The side of the lesion matches the side of the postural reaction deficits.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // EXCLUSION (Pass 1 G1, 2026-05-04): forebrain signs (seizures, abnormal
                    // behaviour) → defer to multifocal. Mentation is left alone here because
                    // vest-central legitimately fires with altered mentation (path 2 below).
                    if (selected.epilepticSeizures === 'yes') return false;
                    if (selected.behavior && selected.behavior !== 'normal') return false;

                    // EXCLUSION (Pass 8, 2026-05-04): vert/changing nystagmus + cerebellar
                    // gait sign — clear multifocal pattern (central vestibular + cerebellar);
                    // multifocal handles. Pure vest-central wouldn't have cerebellar gait.
                    var vertOrChanging = selected.nystagmusR === 'vertical' || selected.nystagmusL === 'vertical'
                                      || selected.nystagmusR === 'direction changing' || selected.nystagmusL === 'direction changing';
                    var cerebellarGait = hasValue(selected, 'gait', 'hypermetria L') || hasValue(selected, 'gait', 'hypermetria R')
                                      || hasValue(selected, 'gait', 'head tremor');
                    if (vertOrChanging && cerebellarGait) return false;

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

                    const verticalNystagmus = selected.nystagmusR === 'vertical' || selected.nystagmusL === 'vertical';
                    const directionChangingNystagmus = selected.nystagmusR === 'direction changing' || selected.nystagmusL === 'direction changing';

                    if (verticalNystagmus) {
                        evidence.push('Vertical nystagmus (pathognomonic for central vestibular)');
                    }

                    if (directionChangingNystagmus) {
                        evidence.push('Direction-changing nystagmus (central vestibular sign)');
                    }

                    const rotatoryNystagmus = selected.nystagmusR === 'rotatory' || selected.nystagmusL === 'rotatory';

                    if (rotatoryNystagmus) {
                        evidence.push('Rotatory nystagmus present');
                    }

                    const nystagmusPresent = selected.nystagmusR || selected.nystagmusL;

                    if (nystagmusPresent && !verticalNystagmus && !rotatoryNystagmus) {
                        evidence.push(`Nystagmus present: ${selected.nystagmusR || selected.nystagmusL}`);
                    }

                    const mentationAbnormal = selected.consciousnessLevel === 'somnolent/depressed/obtunded' || selected.consciousnessLevel === 'stuporous' || selected.consciousnessLevel === 'comatose';

                    if (mentationAbnormal) {
                        evidence.push(`Mentation abnormal (${selected.consciousnessLevel})`);
                    }

                    const leftPosturalWorse = selected.thoracicLeft === 'decreased' || selected.thoracicLeft === 'absent' || selected.pelvicLeft === 'decreased' || selected.pelvicLeft === 'absent';
                    const rightPosturalWorse = selected.thoracicRight === 'decreased' || selected.thoracicRight === 'absent' || selected.pelvicRight === 'decreased' || selected.pelvicRight === 'absent';
                    const posturalDeficitsPresent = leftPosturalWorse || rightPosturalWorse;

                    // Strong lateralization = BOTH limbs (thoracic + pelvic) on same side — true central evidence.
                    // Single-limb deficit is incidental (per Ivana's doctrine in "+ one pelvic limb" test).
                    const leftBothLimbs = (selected.thoracicLeft === 'decreased' || selected.thoracicLeft === 'absent') && (selected.pelvicLeft === 'decreased' || selected.pelvicLeft === 'absent');
                    const rightBothLimbs = (selected.thoracicRight === 'decreased' || selected.thoracicRight === 'absent') && (selected.pelvicRight === 'decreased' || selected.pelvicRight === 'absent');
                    const strongLateralization = leftBothLimbs || rightBothLimbs;

                    // EXCLUSION (Pass 1, 2026-05-04 / Pass 7 refined 2026-05-04):
                    // contralateral pattern (head tilt one side, both-limbs deficit on the
                    // OTHER side) is paradoxical when nystagmus accompanies it. Pass 7:
                    // exclusion now conditional on ANY nystagmus present — without
                    // nystagmus, vest-central can co-fire as PROBABLE alongside vest-
                    // paradoxical (paradoxical syndrome with no nystagmus is unusual; the
                    // central differential remains worth surfacing).
                    const headTiltL_excl = hasValue(selected, 'headPosture', 'head tilt L');
                    const headTiltR_excl = hasValue(selected, 'headPosture', 'head tilt R');
                    const contralateralPattern = (headTiltL_excl && rightBothLimbs && !leftBothLimbs)
                                              || (headTiltR_excl && leftBothLimbs && !rightBothLimbs);
                    var anyNystagmusForExcl = (selected.nystagmusR && selected.nystagmusR !== 'none')
                                           || (selected.nystagmusL && selected.nystagmusL !== 'none');
                    if (contralateralPattern && anyNystagmusForExcl) return false;

                    if (leftPosturalWorse) {
                        evidence.push('Postural deficits left side (ipsilateral to lesion)');
                    }

                    if (rightPosturalWorse) {
                        evidence.push('Postural deficits right side (ipsilateral to lesion)');
                    }

                    // CN abnormalities OTHER THAN CN VII (facial) — CN VII alone can be peripheral
                    const cn5Abnormal = selected.nasalSensationR === 'decreased' || selected.nasalSensationR === 'absent' || selected.nasalSensationL === 'decreased' || selected.nasalSensationL === 'absent';
                    const cn6Abnormal = selected.positionalStrabismusR === 'present' || selected.positionalStrabismusL === 'present';
                    const otherCNAbnormal = selected.gagReflex === 'decreased' || selected.gagReflex === 'absent' || hasValue(selected, 'tongue', 'deviated to left') || hasValue(selected, 'tongue', 'deviated to right');
                    const cranialNerveAbnormal = cn5Abnormal || cn6Abnormal || otherCNAbnormal;

                    if (cranialNerveAbnormal) {
                        evidence.push('Cranial nerve abnormalities present (excluding CN VII)');
                    }

                    // DEFINITE: Vertical or direction-changing nystagmus is pathognomonic for central
                    if ((vestibularAtaxia || headTilt) && (verticalNystagmus || directionChangingNystagmus)) {
                        return {
                            match: 'definite',
                            location: 'vestibular-central',
                            evidence: evidence,
                            reasoning: 'Vertical or direction-changing nystagmus with vestibular signs is pathognomonic for central vestibular disease'
                        };
                    }

                    // DEFINITE: Vestibular signs + altered mentation
                    if ((vestibularAtaxia || headTilt) && mentationAbnormal) {
                        return {
                            match: 'definite',
                            location: 'vestibular-central',
                            evidence: evidence,
                            reasoning: 'Vestibular signs with altered mentation indicate central vestibular (brainstem) involvement'
                        };
                    }

                    // DEFINITE: Vestibular signs + ipsilateral postural (both limbs same side) + cranial nerve abnormality (other than VII)
                    if ((vestibularAtaxia || headTilt) && strongLateralization && cranialNerveAbnormal) {
                        return {
                            match: 'definite',
                            location: 'vestibular-central',
                            evidence: evidence,
                            reasoning: 'Vestibular signs with postural deficits and cranial nerve involvement indicate central vestibular disease'
                        };
                    }

                    // DEFINITE (Pass 1 G8, 2026-05-04): Vestibular signs + any nystagmus +
                    // strong (ipsilateral both-limbs) lateralization. Peripheral vestibular
                    // excludes lateralization, so any nystagmus combined with same-side
                    // both-limbs deficit is central.
                    if ((vestibularAtaxia || headTilt) && nystagmusPresent && strongLateralization) {
                        return {
                            match: 'definite',
                            location: 'vestibular-central',
                            evidence: evidence,
                            reasoning: 'Vestibular signs with nystagmus and strong (both-limbs same-side) postural deficits indicate central vestibular disease'
                        };
                    }

                    // DEFINITE (Pass 1 G10, 2026-05-04): Combined vestibular + cerebellar
                    // ataxia points to the central vestibular nuclei / cerebellar peduncle
                    // region — peripheral cannot produce both ataxia types simultaneously.
                    if (vestibularAtaxia && cerebellarAtaxia) {
                        return {
                            match: 'definite',
                            location: 'vestibular-central',
                            evidence: evidence,
                            reasoning: 'Combined vestibular and cerebellar ataxia indicate central vestibular disease (vestibular nuclei or cerebellar peduncle)'
                        };
                    }

                    // PROBABLE: Vestibular signs + strong lateralization (both limbs same side)
                    if ((vestibularAtaxia || headTilt) && strongLateralization) {
                        return {
                            match: 'probable',
                            location: 'vestibular-central',
                            evidence: evidence,
                            reasoning: 'Vestibular signs with ipsilateral postural deficits suggest central vestibular disease'
                        };
                    }

                    // PROBABLE: Vestibular signs + cranial nerve abnormalities
                    if ((vestibularAtaxia || headTilt) && cranialNerveAbnormal) {
                        return {
                            match: 'probable',
                            location: 'vestibular-central',
                            evidence: evidence,
                            reasoning: 'Vestibular signs with cranial nerve deficits suggest central vestibular disease'
                        };
                    }

                    // POSSIBLE: Vestibular ataxia or head tilt alone
                    // Pass 8 (2026-05-04): defer when ataxiaType cerebellar is present
                    // alongside head tilt — that's paradoxical territory; vest-central
                    // POSSIBLE differential adds noise.
                    if ((vestibularAtaxia || headTilt) && !cerebellarAtaxia) {
                        return {
                            match: 'possible',
                            location: 'vestibular-central',
                            evidence: evidence,
                            reasoning: 'Vestibular signs present, but insufficient data to distinguish central from peripheral vestibular disease'
                        };
                    }

                    return false;
                }
            }
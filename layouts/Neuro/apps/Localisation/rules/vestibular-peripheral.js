app.rules['vestibular-peripheral'] = {
                text: 'Diagnose peripheral vestibular disease when vestibular ataxia and head tilt are accompanied by horizontal or rotational nystagmus only, though chronic cases may have no nystagmus. Facial nerve paresis or paralysis and/or Horner\'s syndrome (miosis, enophthalmos, third eyelid protrusion, ptosis) are possible. Postural reaction deficits in both pelvic limbs and not lateralized are possible. Should not have ipsi or contralateral postural reaction deficits, changes in the level of consciousness or vertical nystagmus.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    const vestibularAtaxia = hasValue(selected, 'ataxiaType', 'vestibular');
                    const headTilt = hasHeadTilt(selected);

                    if (vestibularAtaxia) {
                        evidence.push('Vestibular ataxia present');
                    }

                    if (headTilt) {
                        evidence.push('Head tilt present');
                    }

                    // Entry requirement: vestibular ataxia or head tilt
                    if (!vestibularAtaxia && !headTilt) {
                        return false;
                    }

                    // EXCLUSION: Vertical or direction-changing nystagmus → central vestibular, not peripheral
                    const verticalNystagmus = selected.nystagmusR === 'vertical' || selected.nystagmusL === 'vertical' || selected.nystagmusR === 'direction changing' || selected.nystagmusL === 'direction changing';
                    if (verticalNystagmus) {
                        return false;
                    }

                    // EXCLUSION: Altered consciousness → central vestibular, not peripheral
                    const mentationAbnormal = selected.consciousnessLevel === 'somnolent/depressed/obtunded' || selected.consciousnessLevel === 'stuporous' || selected.consciousnessLevel === 'comatose';
                    if (mentationAbnormal) {
                        return false;
                    }

                    // EXCLUSION (Pass 1 G1, 2026-05-04): forebrain signs present → defer to multifocal.
                    if (selected.epilepticSeizures === 'yes') return false;
                    if (selected.behavior && selected.behavior !== 'normal') return false;

                    // EXCLUSION (Pass 1, 2026-05-04): cerebellar signs (cerebellar ataxia,
                    // hypermetria, head tremor) are paradoxical territory — peripheral
                    // vestibular doesn't have cerebellar signs.
                    if (hasValue(selected, 'ataxiaType', 'cerebellar')
                        || hasValue(selected, 'gait', 'hypermetria L') || hasValue(selected, 'gait', 'hypermetria R')
                        || hasValue(selected, 'gait', 'head tremor')) {
                        return false;
                    }

                    // Both limbs (thoracic + pelvic) deficit on the same side → central vestibular evidence
                    // (per Ivana: a single-limb deficit is likely incidental, not true lateralization)
                    const leftBothLimbs = (selected.thoracicLeft === 'decreased' || selected.thoracicLeft === 'absent') && (selected.pelvicLeft === 'decreased' || selected.pelvicLeft === 'absent');
                    const rightBothLimbs = (selected.thoracicRight === 'decreased' || selected.thoracicRight === 'absent') && (selected.pelvicRight === 'decreased' || selected.pelvicRight === 'absent');

                    // IPSILATERAL central pattern (head tilt on same side as both-limbs deficit) — central likely, but keep peripheral as safety-net POSSIBLE
                    // (unless vertical/direction-changing nystagmus clearly indicates central — then skip possible)
                    const headTiltL_ipsi = hasValue(selected, 'headPosture', 'head tilt L') && leftBothLimbs;
                    const headTiltR_ipsi = hasValue(selected, 'headPosture', 'head tilt R') && rightBothLimbs;
                    const ipsilateralBothLimbs = headTiltL_ipsi || headTiltR_ipsi;
                    const centralNystagmus = selected.nystagmusR === 'vertical' || selected.nystagmusL === 'vertical' || selected.nystagmusR === 'direction changing' || selected.nystagmusL === 'direction changing';

                    if (leftBothLimbs || rightBothLimbs) {
                        // Pass 1 (2026-05-04): drop the safety-net POSSIBLE when ANY
                        // nystagmus is present — nystagmus + lateralized posturals is
                        // unambiguously central, peripheral isn't a useful differential.
                        if (ipsilateralBothLimbs && !centralNystagmus && !(selected.nystagmusR || selected.nystagmusL)) {
                            return {
                                match: 'possible',
                                location: 'vestibular-peripheral',
                                evidence: ['Ipsilateral both-limbs central pattern — peripheral kept as safety net differential'],
                                reasoning: 'Central vestibular pattern present but peripheral remains a differential if postural assessment is unreliable'
                            };
                        }
                        return false;
                    }

                    // Bilateral pelvic deficits (not lateralized) are OK for peripheral vestibular
                    const bilateralPelvicDeficits = (selected.pelvicRight === 'decreased' || selected.pelvicRight === 'absent') && (selected.pelvicLeft === 'decreased' || selected.pelvicLeft === 'absent');

                    if (bilateralPelvicDeficits) {
                        evidence.push('Bilateral pelvic limb postural deficits (not lateralized, compatible with peripheral vestibular)');
                    }

                    // Nystagmus: horizontal or rotational only
                    const horizontalNystagmus = selected.nystagmusR === 'horizontal' || selected.nystagmusL === 'horizontal';
                    const rotatoryNystagmus = selected.nystagmusR === 'rotatory' || selected.nystagmusL === 'rotatory';
                    const peripheralNystagmus = horizontalNystagmus || rotatoryNystagmus;
                    const nystagmusPresent = selected.nystagmusR || selected.nystagmusL;

                    if (horizontalNystagmus) {
                        evidence.push('Horizontal nystagmus (peripheral pattern)');
                    }

                    if (rotatoryNystagmus) {
                        evidence.push('Rotatory nystagmus (peripheral pattern)');
                    }

                    // CN VII (facial nerve) — compatible with peripheral vestibular
                    const cn7Abnormal = selected.palpebralReflexR === 'decreased' || selected.palpebralReflexR === 'absent' || selected.palpebralReflexL === 'decreased' || selected.palpebralReflexL === 'absent' || (hasValue(selected, 'facialParesis', 'L') || hasValue(selected, 'facialParesis', 'R'));

                    if (cn7Abnormal) {
                        evidence.push('CN VII (facial nerve) abnormality present (compatible with peripheral vestibular)');
                    }

                    // Horner's syndrome — compatible with peripheral vestibular
                    const hornersPresent = selected.hornersSyndromeR === 'present' || selected.hornersSyndromeL === 'present';

                    if (hornersPresent) {
                        const side = selected.hornersSyndromeR === 'present' && selected.hornersSyndromeL === 'present' ? 'bilateral' : (selected.hornersSyndromeR === 'present' ? 'right' : 'left');
                        evidence.push(`Horner's syndrome present (${side}, compatible with peripheral vestibular)`);
                    }

                    // DEFINITE: Vestibular signs + horizontal/rotatory nystagmus + normal consciousness + no lateralized posturals
                    if (peripheralNystagmus) {
                        return {
                            match: 'definite',
                            location: 'vestibular-peripheral',
                            evidence: evidence,
                            reasoning: 'Peripheral vestibular pattern: vestibular signs with horizontal/rotatory nystagmus, normal consciousness, no lateralized postural deficits'
                        };
                    }

                    // DEFINITE (Pass 1 G5, 2026-05-04): No nystagmus (chronic) + CN VII or Horner's
                    // are peripheral-specific signs — bumped from PROBABLE to DEFINITE.
                    if (!nystagmusPresent && (cn7Abnormal || hornersPresent)) {
                        return {
                            match: 'definite',
                            location: 'vestibular-peripheral',
                            evidence: evidence,
                            reasoning: 'Vestibular signs with CN VII or Horner\'s syndrome (peripheral-specific signs) confirm peripheral vestibular disease'
                        };
                    }

                    // POSSIBLE: Vestibular signs without nystagmus and without other supporting data
                    if (!nystagmusPresent) {
                        return {
                            match: 'possible',
                            location: 'vestibular-peripheral',
                            evidence: evidence,
                            reasoning: 'Vestibular signs without nystagmus (chronic case), insufficient data to distinguish central from peripheral'
                        };
                    }

                    return false;
                }
            }
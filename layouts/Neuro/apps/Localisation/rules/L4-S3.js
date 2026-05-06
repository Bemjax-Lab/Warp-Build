app.rules['L4-S3'] = {
                text: 'Localize to L4\u2013S3 when dog or cat has paraparesis or paraplegia, with pelvic limb postural reactions decreased or absent and patellar reflexes, withdrawal reflexes, perineal reflex, and extensor tone are all decreased or absent, indicating LMN pelvic limb signs. A Schiff-Sherrington posture may be seen (noted in lateral recumbency with opisthotonus, increased extensor tone in the thoracic limbs and decreased tone in the pelvic limbs). This pattern reflects damage to the lumbar intumescence. In acute cases, spinal shock from a more cranial lesion may temporarily mimic this pattern, so pain localization and cutaneous trunci reflex testing are essential. Progressive cranial movement of the cutaneous trunci cutoff strongly suggests myelomalacia and warrants urgent warning.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // PAIN OVERRIDE (Pass 3, 2026-05-04): Severe lumbar pain localises to
                    // L4-S3 even without postural/reflex data. Mirrors the pattern in C1-C5
                    // (severe cervical), T3-L3 (severe thoracolumbar), L7-S3 (severe LS).
                    if (selected.painLumbar === 'severe') {
                        return {
                            match: 'definite',
                            location: 'L4-S3',
                            evidence: ['Severe lumbar spinal pain'],
                            reasoning: 'Severe lumbar pain localises to L4-S3'
                        };
                    }

                    // EXCLUSION: Thoracic posturals abnormal → not L4-S3 (C6-T2 will match independently)
                    if (matches(selected, 'thoracicRight', [
                            'decreased',
                            'absent'
                        ]) && matches(selected, 'thoracicLeft', [
                            'decreased',
                            'absent'
                        ])) {
                        return false;
                    }

                    // Core criteria for L4-S3 (LMN pelvic limb signs)
                    const pelvicPosturalReactionsAbnormal = matches(selected, 'pelvicRight', [
                        'decreased',
                        'absent'
                    ]) && matches(selected, 'pelvicLeft', [
                        'decreased',
                        'absent'
                    ]);

                    if (pelvicPosturalReactionsAbnormal) {
                        evidence.push('Pelvic limb postural reactions decreased/absent bilaterally');
                    }

                    const patellarDecreased = matches(selected, 'patellarReflexR', [
                        'decreased',
                        'absent'
                    ]) && matches(selected, 'patellarReflexL', [
                        'decreased',
                        'absent'
                    ]);

                    if (patellarDecreased) {
                        evidence.push('Patellar reflexes decreased/absent bilaterally (LMN sign)');
                    }

                    const pelvicWithdrawalDecreased = matches(selected, 'withdrawalPelvicR', [
                        'decreased',
                        'absent'
                    ]) && matches(selected, 'withdrawalPelvicL', [
                        'decreased',
                        'absent'
                    ]);

                    if (pelvicWithdrawalDecreased) {
                        evidence.push('Pelvic withdrawal reflexes decreased/absent bilaterally (LMN sign)');
                    }

                    const perinealDecreased = matches(selected, 'perinealReflexR', [
                        'decreased',
                        'absent'
                    ]) && matches(selected, 'perinealReflexL', [
                        'decreased',
                        'absent'
                    ]);

                    if (perinealDecreased) {
                        evidence.push('Perineal reflex decreased/absent bilaterally (LMN sign)');
                    }

                    const extensorTonePelvicDecreased = matches(selected, 'extensorTonePelvicR', ['decreased']) && matches(selected, 'extensorTonePelvicL', ['decreased']);

                    if (extensorTonePelvicDecreased) {
                        evidence.push('Pelvic extensor tone decreased bilaterally (LMN sign)');
                    }

                    const lmnCriteria = [
                        patellarDecreased,
                        pelvicWithdrawalDecreased,
                        perinealDecreased,
                        extensorTonePelvicDecreased
                    ];
                    const lmnCount = lmnCriteria.filter(Boolean).length;

                    if (lmnCount > 0) {
                        evidence.push(`${lmnCount}/4 LMN criteria present`);
                    }

                    const inSpinalShock = (selected.onset === 'peracute' || selected.onset === 'acute') && selected.duration !== undefined && selected.duration < 2;

                    if (inSpinalShock) {
                        evidence.push(`Spinal shock possible (${selected.onset} onset, <48h duration)`);
                    }

                    const painSupportsL4S3 = !selected.painLumbosacral || selected.painLumbosacral !== 'none';

                    if (selected.painLumbosacral && selected.painLumbosacral !== 'none') {
                        evidence.push('Lumbosacral spinal pain localization');
                    }

                    // Cutaneous trunci abnormalities
                    if (selected.cutaneusTrunciLevelR !== 'normal' && selected.cutaneusTrunciLevelR) {
                        evidence.push(`Cutaneous trunci cutoff detected (R: ${selected.cutaneusTrunciLevelR})`);
                    }
                    if (selected.cutaneusTrunciLevelL !== 'normal' && selected.cutaneusTrunciLevelL) {
                        evidence.push(`Cutaneous trunci cutoff detected (L: ${selected.cutaneusTrunciLevelL})`);
                    }

                    // EXCLUSION: Spinal shock + UMN signs → not L4-S3 (T3-L3 will match independently)
                    if (inSpinalShock) {
                        if (matches(selected, 'patellarReflexR', [
                                'normal',
                                'increased'
                            ]) && matches(selected, 'patellarReflexL', [
                                'normal',
                                'increased'
                            ]) && matches(selected, 'gait', [
                                'paraparesis',
                                'paraplegia'
                            ])) {
                            return false;
                        }
                    }

                    // EXCLUSION: Thoracolumbar pain + thoracic LMN → not L4-S3 (C6-T2 will match independently)
                    if (selected.painThoracolumbar && selected.painThoracolumbar !== 'none' && pelvicPosturalReactionsAbnormal) {
                        if (selected.withdrawalThoracicR === 'decreased' || selected.withdrawalThoracicR === 'absent' || selected.withdrawalThoracicL === 'decreased' || selected.withdrawalThoracicL === 'absent') {
                            return false;
                        }
                        // EXCLUSION: Thoracolumbar pain + pelvic para → not L4-S3 (T3-L3 will match independently)
                        if (matches(selected, 'gait', [
                                'paraparesis',
                                'paraplegia'
                            ])) {
                            return false;
                        }
                    }

                    // DEFINITE: Core L4-S3 pattern (postural reactions abnormal + ALL 4 LMN signs)
                    if (pelvicPosturalReactionsAbnormal && lmnCount === 4) {
                        return {
                            match: 'definite',
                            location: 'L4-S3',
                            evidence: evidence,
                            reasoning: 'Classic L4-S3 LMN pattern: all 4 LMN criteria present (patellar, withdrawal, perineal, tone all decreased/absent)'
                        };
                    }

                    // DEFINITE: L4-S3 with flaccid tail (strong cauda equina involvement) + 2+ LMN signs
                    if (pelvicPosturalReactionsAbnormal && lmnCount >= 2 && selected.tailPosture === 'flaccid') {
                        return {
                            match: 'definite',
                            location: 'L4-S3',
                            evidence: evidence,
                            reasoning: 'L4-S3 with flaccid tail (cauda equina involvement) and pelvic LMN signs'
                        };
                    }

                    // DEFINITE: Permissive L4-S3 with lumbosacral pain (3+ LMN criteria)
                    if (pelvicPosturalReactionsAbnormal && lmnCount >= 3 && painSupportsL4S3) {
                        return {
                            match: 'definite',
                            location: 'L4-S3',
                            evidence: evidence,
                            reasoning: 'L4-S3 LMN pattern: 3+ LMN criteria with lumbosacral pain localization'
                        };
                    }

                    // PROBABLE: Myelomalacia case with partial LMN pattern
                    if (selected.cutaneusTrunciLevelR !== 'normal' || selected.cutaneusTrunciLevelL !== 'normal') {
                        if (selected.cutaneusTrunciLevelR && selected.cutaneusTrunciLevelR !== 'normal' || selected.cutaneusTrunciLevelL && selected.cutaneusTrunciLevelL !== 'normal') {
                            if (pelvicPosturalReactionsAbnormal && lmnCount >= 2) {
                                return {
                                    match: 'probable',
                                    location: 'L4-S3',
                                    evidence: evidence,
                                    reasoning: 'L4-S3 with cutaneous trunci cutoff and partial LMN signs (possible myelomalacia progression)'
                                };
                            }
                        }
                    }

                    // PROBABLE: Partial LMN pattern (2+ LMN signs with pelvic postural abnormal)
                    // Pass 6 (2026-05-04): also require lumbosacral pain to be EXPLICITLY
                    // present (not just undefined) AND no peripheral-specific posture
                    // (plantigrade pelvic) — otherwise the picture is peripheral, and L4-S3
                    // is just a POSSIBLE differential.
                    var explicitLSPain = selected.painLumbosacral && selected.painLumbosacral !== 'none';
                    var plantigradePelvic = hasValue(selected, 'bodyPosture', 'plantigrade RP') || hasValue(selected, 'bodyPosture', 'plantigrade LP');
                    if (pelvicPosturalReactionsAbnormal && lmnCount >= 2 && explicitLSPain && !plantigradePelvic) {
                        return {
                            match: 'probable',
                            location: 'L4-S3',
                            evidence: evidence,
                            reasoning: 'Partial L4-S3 LMN pattern: 2+ LMN criteria present but not all tested'
                        };
                    }

                    // POSSIBLE: Pelvic postural abnormal + at least 2 LMN signs (tighter than lmnCount >= 1 alone)
                    if (pelvicPosturalReactionsAbnormal && lmnCount >= 2) {
                        return {
                            match: 'possible',
                            location: 'L4-S3',
                            evidence: evidence,
                            reasoning: 'Pelvic postural deficits with partial LMN signs — insufficient data for higher confidence'
                        };
                    }

                    return false;
                }
            }

app.rules['C6-T2'] = {
                text: 'Localize to C6\u2013T2 when postural reactions are decreased or absent in all four limbs, pelvic limb reflexes (patellarReflex, withdrawalPelvic, extensorTonePelvic) are normal or increased indicating UMN signs, but thoracic limb withdrawal reflexes and extensor tone are decreased indicating LMN involvement. This combination of UMN pelvic limbs and LMN thoracic limbs is characteristic of a cervicothoracic intumescence lesion. Gait may show ataxia, tetraparesis, tetraplegia, or hemiparesis. Typical gait is a short strided thoracic limb gait and a long strided pelvic limb gait. If pelvic limb deficits are markedly worse and thoracic limb gait is normal, thoracic limb abnormalities may be incidental and localization should rely on pelvic limb findings. Severe cervical pain outweighs gait and postural reactions. In case of severe cervical pain postural reactions can be normal. These cases sometimes present just with low head carriage or kyphosis.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // PAIN OVERRIDE: Severe cervical pain outweighs gait and postural reactions
                    const severeCervicalPain = selected.painCervical === 'severe';
                    if (severeCervicalPain) {
                        const painEvidence = ['Severe cervical spinal pain'];
                        if (hasValue(selected, 'headPosture', 'low head carriage')) {
                            painEvidence.push('Low head carriage (cervical pain presentation)');
                        }
                        if (hasValue(selected, 'bodyPosture', 'kyphosis')) {
                            painEvidence.push('Kyphosis (cervical/cervicothoracic pain presentation)');
                        }
                        return {
                            match: 'definite',
                            location: 'C6-T2',
                            evidence: painEvidence,
                            reasoning: 'Severe cervical pain overrides gait and postural reaction findings — localizes to C6-T2 even with normal posturals'
                        };
                    }

                    // DEFINITE (Pass 6, 2026-05-04): cervical pain (moderate or worse) +
                    // thoracic mono-limb weakness with ipsilateral thoracic withdrawal
                    // decreased — localised cervicothoracic root lesion. Peripheral
                    // mononeuropathy fires alongside as POSSIBLE differential.
                    var cervicalPainAny = selected.painCervical && selected.painCervical !== 'none';
                    var thoracicMonoLeft  = hasValue(selected, 'gait', 'monoparesis LT') || hasValue(selected, 'gait', 'monoplegia LT')
                                         || hasValue(selected, 'gait', 'lameness LT');
                    var thoracicMonoRight = hasValue(selected, 'gait', 'monoparesis RT') || hasValue(selected, 'gait', 'monoplegia RT')
                                         || hasValue(selected, 'gait', 'lameness RT');
                    var thoracicWithdrawalLDecreased = selected.withdrawalThoracicL === 'decreased' || selected.withdrawalThoracicL === 'absent';
                    var thoracicWithdrawalRDecreased = selected.withdrawalThoracicR === 'decreased' || selected.withdrawalThoracicR === 'absent';
                    if (cervicalPainAny && ((thoracicMonoLeft && thoracicWithdrawalLDecreased) || (thoracicMonoRight && thoracicWithdrawalRDecreased))) {
                        return {
                            match: 'definite',
                            location: 'C6-T2',
                            evidence: ['Cervical pain with ipsilateral thoracic mono-limb weakness and withdrawal decreased (cervicothoracic root lesion)'],
                            reasoning: 'Cervical pain combined with thoracic mono-limb LMN pattern localises to C6-T2 root lesion'
                        };
                    }

                    // EXCLUSION: Paraparesis/paraplegia (pelvic only) → not C6-T2 (T3-L3 will match independently)
                    if (hasValue(selected, 'gait', 'paraparesis') || hasValue(selected, 'gait', 'paraplegia')) {
                        return false;
                    }

                    // Check postural reactions: all four limbs should be decreased or absent
                    const posturalReactionsAbnormal = matches(selected, 'thoracicRight', [
                        'decreased',
                        'absent'
                    ]) && matches(selected, 'thoracicLeft', [
                        'decreased',
                        'absent'
                    ]) && matches(selected, 'pelvicRight', [
                        'decreased',
                        'absent'
                    ]) && matches(selected, 'pelvicLeft', [
                        'decreased',
                        'absent'
                    ]);

                    if (posturalReactionsAbnormal) {
                        evidence.push('Postural reactions decreased/absent in all four limbs');
                    }

                    // Check pelvic limb reflexes (UMN signs)
                    const patellarNormalOrIncreased = matches(selected, 'patellarReflexR', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'patellarReflexL', [
                        'normal',
                        'increased'
                    ]);

                    if (patellarNormalOrIncreased) {
                        evidence.push('Patellar reflexes normal/increased (pelvic UMN sign)');
                    }

                    const pelvicWithdrawalNormalOrIncreased = matches(selected, 'withdrawalPelvicR', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'withdrawalPelvicL', [
                        'normal',
                        'increased'
                    ]);

                    if (pelvicWithdrawalNormalOrIncreased) {
                        evidence.push('Pelvic withdrawal reflexes normal/increased (pelvic UMN sign)');
                    }

                    const pelvicExtensorToneNormalOrIncreased = matches(selected, 'extensorTonePelvicR', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'extensorTonePelvicL', [
                        'normal',
                        'increased'
                    ]);

                    if (pelvicExtensorToneNormalOrIncreased) {
                        evidence.push('Pelvic extensor tone normal/increased (pelvic UMN sign)');
                    }

                    // Check thoracic limb LMN signs
                    const thoracicWithdrawalDecreased = matches(selected, 'withdrawalThoracicR', [
                        'decreased',
                        'absent'
                    ]) && matches(selected, 'withdrawalThoracicL', [
                        'decreased',
                        'absent'
                    ]);

                    if (thoracicWithdrawalDecreased) {
                        evidence.push('Thoracic withdrawal reflexes decreased/absent bilaterally (thoracic LMN sign)');
                    }

                    const thoracicExtensorToneDecreased = matches(selected, 'extensorToneThoracicR', ['decreased']) && matches(selected, 'extensorToneThoracicL', ['decreased']);

                    if (thoracicExtensorToneDecreased) {
                        evidence.push('Thoracic extensor tone decreased bilaterally (thoracic LMN sign)');
                    }

                    const thoracicLMNSigns = thoracicWithdrawalDecreased || thoracicExtensorToneDecreased;

                    if (thoracicLMNSigns) {
                        evidence.push('Neuroanatomic dissociation: pelvic UMN + thoracic LMN pattern');
                    }

                    // Check gait abnormalities
                    const gaitAbnormal = matches(selected, 'gait', [
                        'ataxia',
                        'tetraparesis',
                        'tetraplegia',
                        'hemiparesis left-sided',
                        'hemiparesis right-sided'
                    ]);

                    if (gaitAbnormal) {
                        evidence.push(`Gait abnormality present: ${displayValue(selected, 'gait')}`);
                    }

                    // EXCLUSION: Thoracic limbs show normal reflexes (no LMN signs) → not C6-T2 (C1-C5 will match independently)
                    if (matches(selected, 'withdrawalThoracicR', 'normal') && matches(selected, 'withdrawalThoracicL', 'normal') && matches(selected, 'extensorToneThoracicR', [
                            'normal',
                            'increased'
                        ]) && matches(selected, 'extensorToneThoracicL', [
                            'normal',
                            'increased'
                        ]) && posturalReactionsAbnormal) {
                        return false;
                    }

                    // EXCLUSION: Pelvic limb LMN signs → not C6-T2 (T3-L3 or L4-S3 will match independently)
                    if (selected.patellarReflexR === 'decreased' || selected.patellarReflexR === 'absent' || (selected.patellarReflexL === 'decreased' || selected.patellarReflexL === 'absent') || (selected.withdrawalPelvicR === 'decreased' || selected.withdrawalPelvicR === 'absent') || (selected.withdrawalPelvicL === 'decreased' || selected.withdrawalPelvicL === 'absent')) {
                        return false;
                    }

                    // DEFINITE: Core C6-T2 pattern (neuroanatomic dissociation: UMN pelvic + LMN thoracic)
                    if (posturalReactionsAbnormal && patellarNormalOrIncreased && pelvicWithdrawalNormalOrIncreased && pelvicExtensorToneNormalOrIncreased && thoracicLMNSigns) {
                        return {
                            match: 'definite',
                            location: 'C6-T2',
                            evidence: evidence,
                            reasoning: 'Classic C6-T2 neuroanatomic dissociation: pelvic limbs show UMN signs while thoracic limbs show LMN signs'
                        };
                    }

                    // PROBABLE: Gait abnormal + partial C6-T2 pattern
                    if (gaitAbnormal && posturalReactionsAbnormal && thoracicLMNSigns) {
                        // Check if available pelvic limb data fits UMN pattern
                        let pelvicParams = [
                            [
                                'patellarReflexR',
                                [
                                    'normal',
                                    'increased'
                                ]
                            ],
                            [
                                'patellarReflexL',
                                [
                                    'normal',
                                    'increased'
                                ]
                            ],
                            [
                                'withdrawalPelvicR',
                                [
                                    'normal',
                                    'increased'
                                ]
                            ],
                            [
                                'withdrawalPelvicL',
                                [
                                    'normal',
                                    'increased'
                                ]
                            ],
                            [
                                'extensorTonePelvicR',
                                [
                                    'normal',
                                    'increased'
                                ]
                            ],
                            [
                                'extensorTonePelvicL',
                                [
                                    'normal',
                                    'increased'
                                ]
                            ]
                        ];
                        let partial = pelvicParams.every(([param, vals]) => {
                            if (selected[param] !== undefined) {
                                return matches(selected, param, vals);
                            }
                            return true;
                        });
                        if (partial) {
                            return {
                                match: 'probable',
                                location: 'C6-T2',
                                evidence: evidence,
                                reasoning: 'Gait abnormalities with thoracic LMN signs and partial dissociation pattern (some pelvic parameters not tested)'
                            };
                        }
                    }

                    // POSSIBLE: Tetraparesis with any dissociation signs
                    if (gaitAbnormal && thoracicLMNSigns) {
                        return {
                            match: 'possible',
                            location: 'C6-T2',
                            evidence: evidence,
                            reasoning: 'Gait abnormalities with thoracic LMN signs suggest C6-T2, but insufficient pelvic UMN data for higher confidence'
                        };
                    }

                    return false;
                }
            }
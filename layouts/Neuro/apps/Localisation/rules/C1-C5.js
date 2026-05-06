app.rules['C1-C5'] = {
                text: 'Localize to C1\u2013C5 when postural reactions in all four limbs (thoracicRight, thoracicLeft, pelvicRight, pelvicLeft) are decreased or absent while patellar reflexes are normal or increased and withdrawal reflexes are normal. Extensor tone in both thoracic and pelvic limbs is normal to increased, indicating an UMN lesion affecting all limbs. Gait abnormalities such as ataxia, tetraparesis, tetraplegia, or hemiparesis support a cranial cervical lesion. Gait findings outweigh postural reaction testing. In large-breed dogs, thoracic limb postural reactions may appear normal despite cervical disease; if pelvic limb deficits are clearly more severe and thoracic limb gait is normal, prioritize pelvic limb findings for localization. Severe cervical pain outweighs gait and postural reactions. In case of severe cervical pain postural reactions can be normal. These cases sometimes present just with low head carriage.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // EXCLUSION: Major brain signs (mentation abnormal, seizures, vestibular/head-tilt, CN V/VI deficits)
                    // → multisystem/brain lesion, C1-C5 is not the right localisation here.
                    // Pain override below still applies (pain trumps exclusion).
                    const brainMentationAbnormal = selected.consciousnessLevel === 'somnolent/depressed/obtunded' || selected.consciousnessLevel === 'stuporous' || selected.consciousnessLevel === 'comatose';
                    const seizuresPresent = selected.epilepticSeizures === 'yes';
                    const vestibularSigns = hasValue(selected, 'ataxiaType', 'vestibular') || hasHeadTilt(selected);
                    const cnAbnormal = selected.nasalSensationR === 'decreased' || selected.nasalSensationR === 'absent' || selected.nasalSensationL === 'decreased' || selected.nasalSensationL === 'absent' || selected.positionalStrabismusR === 'present' || selected.positionalStrabismusL === 'present' || selected.gagReflex === 'decreased' || selected.gagReflex === 'absent';
                    const majorBrainSigns = brainMentationAbnormal || seizuresPresent || vestibularSigns || cnAbnormal;

                    // PAIN OVERRIDE: Severe cervical pain outweighs gait and postural reactions
                    const severeCervicalPain = selected.painCervical === 'severe';
                    if (severeCervicalPain) {
                        const painEvidence = ['Severe cervical spinal pain'];
                        if (hasValue(selected, 'headPosture', 'low head carriage')) {
                            painEvidence.push('Low head carriage (cervical pain presentation)');
                        }
                        return {
                            match: 'definite',
                            location: 'C1-C5',
                            evidence: painEvidence,
                            reasoning: 'Severe cervical pain overrides gait and postural reaction findings — localizes to C1-C5 even with normal posturals'
                        };
                    }

                    // EXCLUSION: LMN signs in thoracic limbs → not C1-C5 (C6-T2 will match independently)
                    if (selected.withdrawalThoracicR === 'decreased' || selected.withdrawalThoracicR === 'absent' || selected.withdrawalThoracicL === 'decreased' || selected.withdrawalThoracicL === 'absent') {
                        return false;
                    }
                    // EXCLUSION: Paraparesis/paraplegia (pelvic only) → not C1-C5 (T3-L3 will match independently)
                    if (hasValue(selected, 'gait', 'paraparesis') || hasValue(selected, 'gait', 'paraplegia')) {
                        return false;
                    }
                    // Pelvic-only postural deficits with normal thoracic limbs and non-tetra gait → T3-L3 pattern
                    // T3-L3's own rule requires para gait and can't catch this, so we must produce the result here
                    const pelvicPosturalDecreased = (selected.pelvicRight === 'decreased' || selected.pelvicRight === 'absent') && (selected.pelvicLeft === 'decreased' || selected.pelvicLeft === 'absent');
                    const thoracicPosturalNormal = matches(selected, 'thoracicRight', 'normal') && matches(selected, 'thoracicLeft', 'normal');
                    const gaitNotTetra = !hasValue(selected, 'gait', 'tetraparesis') && !hasValue(selected, 'gait', 'tetraplegia') && !hasValue(selected, 'gait', 'ataxia') && !hasValue(selected, 'gait', 'hemiparesis left-sided') && !hasValue(selected, 'gait', 'hemiparesis right-sided');
                    // T3-L3 redirect requires pelvic withdrawal preserved (UMN pattern) — decreased withdrawal = L4-S3/cauda, not T3-L3
                    const pelvicWithdrawalNotLMN = !(selected.withdrawalPelvicR === 'decreased' || selected.withdrawalPelvicR === 'absent' || selected.withdrawalPelvicL === 'decreased' || selected.withdrawalPelvicL === 'absent');
                    if (pelvicPosturalDecreased && thoracicPosturalNormal && gaitNotTetra && pelvicWithdrawalNotLMN) {
                        const t3l3Evidence = [
                            'Pelvic limb postural reactions decreased/absent bilaterally',
                            'Thoracic limb postural reactions normal',
                        ];
                        if (selected.gait) t3l3Evidence.push('Gait: ' + displayValue(selected, 'gait'));
                        return {
                            match: 'probable',
                            location: 'T3-L3',
                            redirect: 'C1-C5',
                            evidence: t3l3Evidence,
                            reasoning: 'Pelvic-only postural deficits with normal thoracic limbs suggest T3-L3 localization'
                        };
                    }

                    // Core C1-C5 pattern: postural reactions decreased in ALL four limbs + UMN signs (normal/increased reflexes and tone)
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

                    const patellarNormalOrIncreased = matches(selected, 'patellarReflexR', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'patellarReflexL', [
                        'normal',
                        'increased'
                    ]);

                    if (patellarNormalOrIncreased) {
                        evidence.push('Patellar reflexes normal/increased (UMN sign)');
                    }

                    const extensorToneNormalOrIncreased = matches(selected, 'extensorToneThoracicR', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'extensorToneThoracicL', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'extensorTonePelvicR', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'extensorTonePelvicL', [
                        'normal',
                        'increased'
                    ]);

                    if (extensorToneNormalOrIncreased) {
                        evidence.push('Extensor tone normal/increased in all limbs (UMN sign)');
                    }

                    const withdrawalNormal = matches(selected, 'withdrawalThoracicR', 'normal') && matches(selected, 'withdrawalThoracicL', 'normal') && matches(selected, 'withdrawalPelvicR', 'normal') && matches(selected, 'withdrawalPelvicL', 'normal');

                    if (withdrawalNormal) {
                        evidence.push('Withdrawal reflexes normal bilaterally');
                    }

                    // Check gait abnormalities
                    // Ataxia counts only if proprioceptive (vestibular/cerebellar ataxia doesn't localise to cervical spine)
                    const hasAtaxia = hasValue(selected, 'gait', 'ataxia');
                    const ataxiaTypeProprioceptive = !selected.ataxiaType || hasValue(selected, 'ataxiaType', 'proprioceptive');
                    const ataxiaCountsForCervical = hasAtaxia && ataxiaTypeProprioceptive;
                    const gaitAbnormal = ataxiaCountsForCervical || matches(selected, 'gait', [
                        'tetraparesis',
                        'tetraplegia',
                        'hemiparesis left-sided',
                        'hemiparesis right-sided'
                    ]);

                    if (gaitAbnormal) {
                        evidence.push(`Gait abnormality present: ${displayValue(selected, 'gait')}`);
                    }

                    // Pass 3 (2026-05-04): require at least one reflex/tone parameter to be
                    // EXPLICITLY tested as normal/increased — otherwise the matches() default
                    // makes undefined reflexes look like "preserved", firing C1-C5 on tests
                    // where no reflex testing was actually performed.
                    const anyReflexExplicitlyUMN = selected.patellarReflexR === 'normal' || selected.patellarReflexR === 'increased'
                                                || selected.patellarReflexL === 'normal' || selected.patellarReflexL === 'increased'
                                                || selected.extensorToneThoracicR === 'normal' || selected.extensorToneThoracicR === 'increased'
                                                || selected.extensorToneThoracicL === 'normal' || selected.extensorToneThoracicL === 'increased'
                                                || selected.extensorTonePelvicR === 'normal' || selected.extensorTonePelvicR === 'increased'
                                                || selected.extensorTonePelvicL === 'normal' || selected.extensorTonePelvicL === 'increased'
                                                || selected.withdrawalThoracicR === 'normal' || selected.withdrawalThoracicL === 'normal'
                                                || selected.withdrawalPelvicR === 'normal' || selected.withdrawalPelvicL === 'normal';

                    // DEFINITE: Classic UMN pattern = C1-C5 (regardless of gait)
                    // If major brain signs present, cap at POSSIBLE (cord may be affected in multifocal, but not the primary lesion)
                    if (posturalReactionsAbnormal && patellarNormalOrIncreased && extensorToneNormalOrIncreased && withdrawalNormal && anyReflexExplicitlyUMN) {
                        return {
                            match: majorBrainSigns ? 'possible' : 'definite',
                            location: 'C1-C5',
                            evidence: evidence,
                            reasoning: majorBrainSigns
                                ? 'Classic UMN pattern present but major brain signs indicate multisystem/brain lesion — C1-C5 downgraded to possible'
                                : 'Classic UMN pattern: postural reactions abnormal in all 4 limbs with preserved/increased reflexes and tone'
                        };
                    }

                    // DEFINITE (Pass 3, 2026-05-04): Lateralized hemiparesis + ipsilateral
                    // both-limbs postural deficit (cervical hemi-cord pattern). No major
                    // brain signs required (would be excluded anyway).
                    const hemiparesisRight = hasValue(selected, 'gait', 'hemiparesis right-sided');
                    const hemiparesisLeft  = hasValue(selected, 'gait', 'hemiparesis left-sided');
                    const lateralizedRightUMN = (selected.thoracicRight === 'decreased' || selected.thoracicRight === 'absent')
                                             && (selected.pelvicRight   === 'decreased' || selected.pelvicRight   === 'absent');
                    const lateralizedLeftUMN  = (selected.thoracicLeft  === 'decreased' || selected.thoracicLeft  === 'absent')
                                             && (selected.pelvicLeft    === 'decreased' || selected.pelvicLeft    === 'absent');
                    if (((hemiparesisRight && lateralizedRightUMN) || (hemiparesisLeft && lateralizedLeftUMN)) && !majorBrainSigns) {
                        return {
                            match: 'definite',
                            location: 'C1-C5',
                            evidence: [...evidence, 'Lateralized hemiparesis with ipsilateral both-limbs postural deficit (cervical hemi-cord pattern)'],
                            reasoning: 'Hemiparesis with ipsilateral both-limbs postural deficit indicates a cervical hemi-cord (C1-C5) lesion'
                        };
                    }

                    // Large breed exception
                    const largeBreeds = [
                        'Labrador Retriever',
                        'German Shepherd',
                        'Golden Retriever',
                        'Rottweiler',
                        'Boxer'
                    ];

                    // PROBABLE: Large breed exception - thoracic limb postural reactions may appear normal despite cervical myelopathy
                    if (selected.breed && largeBreeds.includes(selected.breed) && gaitAbnormal) {
                        const pelvicPosturalAbnormal = matches(selected, 'pelvicRight', [
                            'decreased',
                            'absent'
                        ]) && matches(selected, 'pelvicLeft', [
                            'decreased',
                            'absent'
                        ]);
                        if (pelvicPosturalAbnormal && patellarNormalOrIncreased && extensorToneNormalOrIncreased && withdrawalNormal) {
                            const largeBreedEvidence = [...evidence];
                            largeBreedEvidence.push(`Large breed (${selected.breed}) - thoracic limb postural reactions may be falsely normal`);
                            largeBreedEvidence.push('Pelvic limb postural reactions abnormal with UMN reflexes');
                            return {
                                match: 'probable',
                                location: 'C1-C5',
                                evidence: largeBreedEvidence,
                                reasoning: 'Large breed exception: pelvic limb deficits with UMN signs, thoracic postural reactions may be unreliable'
                            };
                        }
                    }

                    // PROBABLE: Gait abnormal AND partial UMN pattern present (permissive matching)
                    if (gaitAbnormal && posturalReactionsAbnormal) {
                        // Check if available reflex/tone data fits C1-C5 pattern
                        let allParams = [
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
                                'extensorToneThoracicR',
                                [
                                    'normal',
                                    'increased'
                                ]
                            ],
                            [
                                'extensorToneThoracicL',
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
                            ],
                            [
                                'withdrawalThoracicR',
                                'normal'
                            ],
                            [
                                'withdrawalThoracicL',
                                'normal'
                            ],
                            [
                                'withdrawalPelvicR',
                                'normal'
                            ],
                            [
                                'withdrawalPelvicL',
                                'normal'
                            ]
                        ];
                        let partial = allParams.every(([param, vals]) => {
                            if (selected[param] !== undefined) {
                                return matches(selected, param, vals);
                            }
                            return true;    // If not provided, assume compatible
                        });
                        // Pass 5 (2026-05-04): require at least one reflex/tone param
                        // explicitly tested as UMN. Without that, "partial UMN" is
                        // unsupported speculation — caused C1-C5 PROBABLE on tests that
                        // never tested reflexes (e.g. test 5 medulla-caudal).
                        if (partial && anyReflexExplicitlyUMN) {
                            return {
                                match: 'probable',
                                location: 'C1-C5',
                                evidence: evidence,
                                reasoning: 'Gait abnormalities with postural deficits in all limbs and partial UMN pattern (some parameters not tested)'
                            };
                        }
                    }

                    // POSSIBLE: Gait abnormalities alone suggest C1-C5 as a differential
                    // Pass 3 (2026-05-04): require some EXPLICIT spinal data (postural or
                    // reflex tested) — gait-alone with nothing tested was firing as noise on
                    // tests where the picture is clearly central/cerebellar.
                    const anySpinalParamTested = selected.thoracicRight !== undefined || selected.thoracicLeft !== undefined
                                              || selected.pelvicRight   !== undefined || selected.pelvicLeft   !== undefined
                                              || selected.patellarReflexR !== undefined || selected.patellarReflexL !== undefined
                                              || selected.withdrawalThoracicR !== undefined || selected.withdrawalThoracicL !== undefined
                                              || selected.withdrawalPelvicR   !== undefined || selected.withdrawalPelvicL   !== undefined
                                              || selected.extensorToneThoracicR !== undefined || selected.extensorToneThoracicL !== undefined
                                              || selected.extensorTonePelvicR   !== undefined || selected.extensorTonePelvicL   !== undefined;
                    if (gaitAbnormal && !majorBrainSigns && anySpinalParamTested) {
                        return {
                            match: 'possible',
                            location: 'C1-C5',
                            evidence: evidence,
                            reasoning: 'Gait abnormalities consistent with C1-C5, but insufficient postural/reflex data for higher confidence'
                        };
                    }

                    // POSSIBLE (safety-net): ipsilateral both-limbs pattern (head tilt on same side as both-limbs deficit)
                    // Pass 3 (2026-05-04): blocked when ANY nystagmus is present (was previously
                    // only vertical/direction-changing). Any nystagmus with ipsilateral postural
                    // is central vestibular territory; the C1-C5 differential is too speculative.
                    const leftBothLimbsC1 = (selected.thoracicLeft === 'decreased' || selected.thoracicLeft === 'absent') && (selected.pelvicLeft === 'decreased' || selected.pelvicLeft === 'absent');
                    const rightBothLimbsC1 = (selected.thoracicRight === 'decreased' || selected.thoracicRight === 'absent') && (selected.pelvicRight === 'decreased' || selected.pelvicRight === 'absent');
                    const ipsilateralBothLimbs = (hasValue(selected, 'headPosture', 'head tilt L') && leftBothLimbsC1) || (hasValue(selected, 'headPosture', 'head tilt R') && rightBothLimbsC1);
                    const anyNystagmusPresent = (selected.nystagmusR && selected.nystagmusR !== 'none')
                                             || (selected.nystagmusL && selected.nystagmusL !== 'none');
                    if (ipsilateralBothLimbs && !anyNystagmusPresent) {
                        return {
                            match: 'possible',
                            location: 'C1-C5',
                            evidence: ['Ipsilateral both-limbs pattern — C1-C5 kept as differential (lateralized cervical cord lesion possible)'],
                            reasoning: 'Lateralized both-limbs deficit pattern could also indicate cervical hemi-cord lesion'
                        };
                    }

                    return false;
                }
            }
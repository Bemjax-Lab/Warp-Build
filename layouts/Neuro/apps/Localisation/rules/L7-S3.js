app.rules['L7-S3'] = {
                text: 'Localize to L7\u2013S3 when gait is normal or shows mild paraparesis without proprioceptive ataxia, patellar reflexes are normal or increased, indicating intact L4\u2013L6 segments, but pelvic limb withdrawal reflexes and postural reactions are decreased and lumbosacral spinalPain is present (deep palpation may be required to elicit it). Because the spinal cord ends cranial to this region, lesions cannot cause non-ambulatory paraparesis or paraplegia. Acute trauma may cause transient severe deficits. Findings in this region are frequently incidental and may coexist with other spinal lesions, especially in older dogs. Severe lumbosacral pain outweighs gait and postural reactions.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // PAIN OVERRIDE: Severe lumbosacral pain outweighs gait and postural reactions
                    const severeLumbosacralPain = selected.painLumbosacral === 'severe';
                    if (severeLumbosacralPain) {
                        const painEvidence = ['Severe lumbosacral spinal pain'];
                        return {
                            match: 'definite',
                            location: 'L7-S3',
                            evidence: painEvidence,
                            reasoning: 'Severe lumbosacral pain overrides gait and postural reaction findings — localizes to L7-S3 even with normal posturals'
                        };
                    }

                    // DEFINITE (Pass 3 + Pass 7 tighten 2026-05-04): cauda equina signs cluster.
                    // Pass 7: require sacral-specific anchor (perineal reflex decreased OR
                    // fecal/urinary incontinence) — pelvic withdrawal alone could be L4-S3
                    // (sciatic from L6-S1), not specifically cauda equina.
                    const tailFlaccid = selected.tailPosture === 'flaccid';
                    const perinealDecreased = (selected.perinealReflexR === 'decreased' || selected.perinealReflexR === 'absent')
                                           && (selected.perinealReflexL === 'decreased' || selected.perinealReflexL === 'absent');
                    const incontinence = selected.fecalIncontinence === 'yes' || selected.urinaryIncontinence === 'yes';
                    const pelvicWithdrawalDecreasedExplicit = (selected.withdrawalPelvicR === 'decreased' || selected.withdrawalPelvicR === 'absent')
                                                           && (selected.withdrawalPelvicL === 'decreased' || selected.withdrawalPelvicL === 'absent');
                    const lsPainAny = selected.painLumbosacral && selected.painLumbosacral !== 'none';
                    const sacralAnchor = perinealDecreased || incontinence;
                    const caudaSigns = [tailFlaccid, perinealDecreased, incontinence, pelvicWithdrawalDecreasedExplicit, lsPainAny].filter(Boolean).length;
                    if (sacralAnchor && caudaSigns >= 2) {
                        // Don't fire if paraplegia (T3-L3 territory)
                        if (!hasValue(selected, 'gait', 'paraplegia')) {
                            return {
                                match: 'definite',
                                location: 'L7-S3',
                                evidence: ['Cauda equina signs cluster with sacral anchor (perineal/incontinence) plus ≥1 supporting sign'],
                                reasoning: 'Sacral-specific signs (perineal reflex decreased or fecal/urinary incontinence) plus another cauda equina sign confirm L7-S3 lesion'
                            };
                        }
                    }

                    // EXCLUSION: Patellars decreased/absent → not L7-S3 (L4-S3 will match independently)
                    if (matches(selected, 'patellarReflexR', [
                            'decreased',
                            'absent'
                        ]) || matches(selected, 'patellarReflexL', [
                            'decreased',
                            'absent'
                        ])) {
                        return false;
                    }

                    // EXCLUSION: Thoracic posturals abnormal → not L7-S3 (C6-T2 will match independently)
                    if (matches(selected, 'thoracicRight', [
                            'decreased',
                            'absent'
                        ]) && matches(selected, 'thoracicLeft', [
                            'decreased',
                            'absent'
                        ])) {
                        return false;
                    }
                    // EXCLUSION: Thoracic withdrawal decreased → not L7-S3 (C6-T2 will match independently)
                    if (selected.withdrawalThoracicR === 'decreased' || selected.withdrawalThoracicR === 'absent' || selected.withdrawalThoracicL === 'decreased' || selected.withdrawalThoracicL === 'absent') {
                        return false;
                    }

                    // Core criteria for L7-S3 (cauda equina)
                    const patellarNormalOrIncreased = matches(selected, 'patellarReflexR', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'patellarReflexL', [
                        'normal',
                        'increased'
                    ]);

                    if (patellarNormalOrIncreased) {
                        evidence.push('Patellar reflexes normal/increased (L4-L6 intact)');
                    }

                    const pelvicWithdrawalDecreased = matches(selected, 'withdrawalPelvicR', [
                        'decreased',
                        'absent'
                    ]) && matches(selected, 'withdrawalPelvicL', [
                        'decreased',
                        'absent'
                    ]);

                    if (pelvicWithdrawalDecreased) {
                        evidence.push('Pelvic withdrawal reflexes decreased/absent bilaterally (cauda equina sign)');
                    }

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

                    const lumbosacralPain = selected.painLumbosacral && selected.painLumbosacral !== 'none';

                    if (lumbosacralPain) {
                        evidence.push('Lumbosacral spinal pain localization');
                    }

                    const thoracolumbarPain = selected.painThoracolumbar && selected.painThoracolumbar !== 'none';

                    // EXCLUSION: Thoracolumbar pain + pelvic para → not L7-S3 (T3-L3 will match independently)
                    if (thoracolumbarPain && pelvicPosturalReactionsAbnormal) {
                        if (matches(selected, 'gait', [
                                'paraparesis',
                                'paraplegia'
                            ])) {
                            return false;
                        }
                    }

                    // EXCLUSION: Patellars not normal/increased + para gait → not L7-S3 (T3-L3 will match independently)
                    if (!patellarNormalOrIncreased && matches(selected, 'gait', [
                            'paraparesis',
                            'paraplegia'
                        ])) {
                        return false;
                   }

                    const coreL7S3Pattern = patellarNormalOrIncreased && pelvicWithdrawalDecreased && pelvicPosturalReactionsAbnormal && lumbosacralPain;

                    // DEFINITE: Core L7-S3 pattern with compatible gait
                    if (coreL7S3Pattern) {
                        const chronic = selected.onset === 'chronic';
                        const nonAmbulatory = selected.ambulation === 'non ambulatory';
                        const gaitParaparesis = matches(selected, 'gait', ['paraparesis']);
                        const gaitParaplegia = matches(selected, 'gait', ['paraplegia']);

                        // EXCLUSION: Chronic non-ambulatory para → not L7-S3 (T3-L3 will match independently)
                        if (chronic && (gaitParaparesis || gaitParaplegia || nonAmbulatory)) {
                            return false;
                        }
                        // EXCLUSION: Paraplegia → not L7-S3 (T3-L3 will match independently)
                        if (gaitParaplegia) {
                            return false;
                        }

                        return {
                            match: 'definite',
                            location: 'L7-S3',
                            evidence: evidence,
                            reasoning: 'Classic cauda equina (L7-S3) pattern: intact patellar reflexes with decreased pelvic withdrawal and lumbosacral pain'
                        };
                    }

                    // PROBABLE: 3/4 core criteria met
                    const l7s3Criteria = [
                        patellarNormalOrIncreased,
                        pelvicWithdrawalDecreased,
                        pelvicPosturalReactionsAbnormal,
                        lumbosacralPain
                    ];
                    const l7s3Count = l7s3Criteria.filter(Boolean).length;

                    if (l7s3Count >= 3 && patellarNormalOrIncreased) {
                        const chronic = selected.onset === 'chronic';
                        const gaitParaplegia = matches(selected, 'gait', ['paraplegia']);
                        if (!gaitParaplegia && !chronic) {
                            return {
                                match: 'probable',
                                location: 'L7-S3',
                                evidence: evidence,
                                reasoning: 'Partial cauda equina pattern: 3/4 criteria met (some parameters not tested)'
                            };
                        }
                    }

                    // POSSIBLE: Lumbosacral pain with intact patellar reflexes (require actual selection)
                    if (patellarNormalOrIncreased && lumbosacralPain && (selected.patellarReflexR !== undefined || selected.patellarReflexL !== undefined)) {
                        return {
                            match: 'possible',
                            location: 'L7-S3',
                            evidence: evidence,
                            reasoning: 'Lumbosacral pain with intact patellar reflexes suggests L7-S3 but lacks full confirmation'
                        };
                    }

                    // POSSIBLE (Pass 6, 2026-05-04): pelvic mono-limb with ipsilateral
                    // withdrawal decreased — peripheral mononeuropathy is more likely (sciatic
                    // from L6-S1) but L7-S3 (cauda equina at the same root level) remains
                    // a differential.
                    // Pass 9 (2026-05-04): defer when deepPain is absent on the affected
                    // limb — absent deep pain locks the picture to peripheral nerve / root
                    // avulsion; L7-S3 differential is no longer worth surfacing.
                    var pelvicMono = hasValue(selected, 'gait', 'monoparesis RP') || hasValue(selected, 'gait', 'monoparesis LP')
                                  || hasValue(selected, 'gait', 'monoplegia RP')  || hasValue(selected, 'gait', 'monoplegia LP');
                    var pelvicMonoIpsi = (selected.withdrawalPelvicR === 'decreased' || selected.withdrawalPelvicR === 'absent')
                                      || (selected.withdrawalPelvicL === 'decreased' || selected.withdrawalPelvicL === 'absent');
                    var pelvicDeepPainAbsent = Array.isArray(selected.deepPain)
                        && selected.deepPain.some(function (v) {
                            return v === 'absent RP' || v === 'absent LP';
                        });
                    if (pelvicMono && pelvicMonoIpsi && !pelvicDeepPainAbsent) {
                        return {
                            match: 'possible',
                            location: 'L7-S3',
                            evidence: ['Pelvic mono-limb weakness with withdrawal decreased — L7-S3 (sciatic root) differential'],
                            reasoning: 'Pelvic mono-limb LMN pattern could be peripheral nerve OR L7-S3 root lesion — kept as POSSIBLE differential'
                        };
                    }

                    return false;
                }
            }

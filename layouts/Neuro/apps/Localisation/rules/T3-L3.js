app.rules['T3-L3'] = {
                text: 'Localize to T3\u2013L3 when pelvic limb postural reactions are decreased or absent with paraparesis or paraplegia and proprioceptive ataxia. Posture may show Schiff-Sherrington posture (noted in lateral recumbency with opisthotonus, increased extensor tone in the thoracic limbs and decreased tone in the pelvic limbs). Patellar reflexes and extensor tone are typically normal or increased, consistent with UMN pelvic limb signs. In peracute or acute onset cases, spinal shock may transiently decrease patellar reflexes (briefly), withdrawal reflexes, and extensor tone despite a T3\u2013L3 lesion. In these cases, rely on pain localization, asymmetry of pelvic limb deficits, and the cutaneous trunci reflex cutoff, which should be one to two vertebral segments caudal to the lesion. Cranial migration of the cutaneous trunci cutoff is a red flag for progressive myelomalacia. Severe T3-L3 pain outweighs gait and postural reactions.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // PAIN OVERRIDE: Severe T3-L3 pain outweighs gait and postural reactions
                    const severeT3L3Pain = selected.painThoracolumbar === 'severe';
                    if (severeT3L3Pain) {
                        const painEvidence = ['Severe thoracolumbar spinal pain'];
                        if (hasValue(selected, 'bodyPosture', 'Schiff-Sherrington posture')) {
                            painEvidence.push('Schiff-Sherrington posture present');
                        }
                        return {
                            match: 'definite',
                            location: 'T3-L3',
                            evidence: painEvidence,
                            reasoning: 'Severe T3-L3 pain overrides gait and postural reaction findings — localizes to T3-L3 even with normal posturals'
                        };
                    }

                    // DEFINITE (Pass 3, 2026-05-04): Schiff-Sherrington posture +
                    // paraparesis/paraplegia is pathognomonic for T3-L3 acute lesion
                    // (typically myelomalacia). Other posture/reflex data may be missing.
                    if (hasValue(selected, 'bodyPosture', 'Schiff-Sherrington posture')
                        && (hasValue(selected, 'gait', 'paraparesis') || hasValue(selected, 'gait', 'paraplegia'))) {
                        return {
                            match: 'definite',
                            location: 'T3-L3',
                            evidence: ['Schiff-Sherrington posture with paraparesis/paraplegia'],
                            reasoning: 'Schiff-Sherrington posture with paraparesis/paraplegia is pathognomonic for T3-L3 acute spinal cord lesion'
                        };
                    }

                    // Core criteria for T3-L3
                    // 1. Postural reactions decreased to absent in pelvic limbs
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

                    // 2. Gait abnormalities: paraparesis or paraplegia (indicates pelvic limb involvement)
                    const pelvicGaitAbnormal = matches(selected, 'gait', [
                        'paraparesis',
                        'paraplegia'
                    ]);

                    if (pelvicGaitAbnormal) {
                        evidence.push(`Gait abnormality: ${displayValue(selected, 'gait')} (pelvic limbs only)`);
                    }

                    // 3. Proprioceptive ataxia in pelvic limbs or all four limbs (if ataxia type is specified, it should be proprioceptive)
                    const proprioceptiveAtaxiaPresent = hasValue(selected, 'ataxiaType', 'proprioceptive') && (matches(selected, 'ataxiaDistribution', [
                        'only pelvic limbs',
                        'all four limbs'
                    ]) || !selected.ataxiaDistribution);

                    if (proprioceptiveAtaxiaPresent) {
                        evidence.push('Proprioceptive ataxia present');
                    }

                    // Check if ataxia data conflicts with T3-L3 (cerebellar or vestibular ataxia suggests other locations)
                    // Conflict if ataxia is ONLY non-proprioceptive (cerebellar/vestibular without proprioceptive)
                    const ataxiaConflicts = selected.ataxiaType && !hasValue(selected, 'ataxiaType', 'proprioceptive') && !hasValue(selected, 'ataxiaType', 'none');
                    // 4. Check for classic UMN signs (normal or increased patellar reflexes and extensor tone)
                    const classicUMNSigns = matches(selected, 'patellarReflexR', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'patellarReflexL', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'extensorTonePelvicR', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'extensorTonePelvicL', [
                        'normal',
                        'increased'
                    ]);

                    if (classicUMNSigns) {
                        evidence.push('Pelvic limb reflexes and tone normal/increased (UMN signs)');
                    }

                    // 5. Check if in spinal shock (peracute/acute and <48h duration)
                    const inSpinalShock = (selected.onset === 'peracute' || selected.onset === 'acute') && selected.duration !== undefined && selected.duration < 2;

                    if (inSpinalShock) {
                        evidence.push(`Spinal shock possible (${selected.onset} onset, <48h duration) - LMN-like signs expected temporarily`);
                    }

                    // 6. Pain localization check (should be thoracolumbar for T3-L3)
                    const painLocalizationSuggestsT3L3 = !selected.painThoracolumbar || selected.painThoracolumbar !== 'none';

                    if (selected.painThoracolumbar && selected.painThoracolumbar !== 'none') {
                        evidence.push('Thoracolumbar spinal pain localization');
                    }

                    // Cutaneous trunci abnormalities
                    if (selected.cutaneusTrunciLevelR !== 'normal' && selected.cutaneusTrunciLevelR) {
                        evidence.push(`Cutaneous trunci cutoff detected (R: ${selected.cutaneusTrunciLevelR})`);
                    }
                    if (selected.cutaneusTrunciLevelL !== 'normal' && selected.cutaneusTrunciLevelL) {
                        evidence.push(`Cutaneous trunci cutoff detected (L: ${selected.cutaneusTrunciLevelL})`);
                    }

                    // EXCLUSIONS: Don't suggest T3-L3 if ataxia type conflicts (cerebellar/vestibular suggests brain)
                    if (ataxiaConflicts) {
                        return false;
                    }

                    // EXCLUSION: Thoracic limb postural + withdrawal abnormal → not T3-L3 (C6-T2 will match independently)
                    if (matches(selected, 'thoracicRight', [
                            'decreased',
                            'absent'
                        ]) && matches(selected, 'thoracicLeft', [
                            'decreased',
                            'absent'
                        ]) && (selected.withdrawalThoracicR === 'decreased' || selected.withdrawalThoracicR === 'absent' || selected.withdrawalThoracicL === 'decreased' || selected.withdrawalThoracicL === 'absent')) {
                        return false;
                    }

                    // EXCLUSION: Pelvic LMN signs (not spinal shock) → not T3-L3 (L4-S3 will match independently)
                    if (!inSpinalShock && (selected.patellarReflexR === 'decreased' || selected.patellarReflexR === 'absent' || selected.patellarReflexL === 'decreased' || selected.patellarReflexL === 'absent')) {
                        if (pelvicPosturalReactionsAbnormal && pelvicGaitAbnormal) {
                            return false;
                        }
                    }

                    // EXCLUSION: Pelvic withdrawal decreased/absent (outside spinal shock) → LMN = not T3-L3
                    // Per Ivana: "T3-L3 is not an option with decreased withdrawal and no ataxia"
                    if (!inSpinalShock && (selected.withdrawalPelvicR === 'decreased' || selected.withdrawalPelvicR === 'absent' || selected.withdrawalPelvicL === 'decreased' || selected.withdrawalPelvicL === 'absent')) {
                        return false;
                    }

                    // EXCLUSION: Lumbosacral pain with pelvic signs → not T3-L3 (L4-S3 will match independently)
                    if (selected.painLumbosacral && selected.painLumbosacral !== 'none' && pelvicPosturalReactionsAbnormal && pelvicGaitAbnormal) {
                        return false;
                    }

                    // DEFINITE: Core T3-L3 pattern with classic UMN signs
                    if (pelvicPosturalReactionsAbnormal && pelvicGaitAbnormal && classicUMNSigns && painLocalizationSuggestsT3L3) {
                        return {
                            match: 'definite',
                            location: 'T3-L3',
                            evidence: evidence,
                            reasoning: 'Classic T3-L3 pattern: pelvic limb paraparesis with UMN signs (normal/increased reflexes and tone)'
                        };
                    }

                    // DEFINITE: T3-L3 with spinal shock (may have LMN-like signs acutely)
                    if (pelvicPosturalReactionsAbnormal && pelvicGaitAbnormal && inSpinalShock && painLocalizationSuggestsT3L3) {
                        return {
                            match: 'definite',
                            location: 'T3-L3',
                            evidence: evidence,
                            reasoning: 'T3-L3 with spinal shock: paraparesis in acute/peracute phase may show transient LMN-like reflexes'
                        };
                    }

                    // DEFINITE: Myelomalacia case - cutaneous trunci abnormal
                    if (selected.cutaneusTrunciLevelR !== 'normal' || selected.cutaneusTrunciLevelL !== 'normal') {
                        if (selected.cutaneusTrunciLevelR && selected.cutaneusTrunciLevelR !== 'normal' || selected.cutaneusTrunciLevelL && selected.cutaneusTrunciLevelL !== 'normal') {
                            if (pelvicPosturalReactionsAbnormal && pelvicGaitAbnormal) {
                                return {
                                    match: 'definite',
                                    location: 'T3-L3',
                                    evidence: evidence,
                                    reasoning: 'T3-L3 with cutaneous trunci cutoff indicating spinal cord lesion (possible myelomalacia if progressing)'
                                };
                            }
                        }
                    }

                    // PROBABLE: Pelvic postural abnormal + paraparesis/paraplegia + partial UMN signs
                    if (pelvicPosturalReactionsAbnormal && pelvicGaitAbnormal && painLocalizationSuggestsT3L3) {
                        // Check if any UMN signs are present (not all required)
                        const hasAnyUMNSign = matches(selected, 'patellarReflexR', ['normal', 'increased']) ||
                                            matches(selected, 'patellarReflexL', ['normal', 'increased']) ||
                                            matches(selected, 'extensorTonePelvicR', ['normal', 'increased']) ||
                                            matches(selected, 'extensorTonePelvicL', ['normal', 'increased']);
                        if (hasAnyUMNSign || proprioceptiveAtaxiaPresent) {
                            return {
                                match: 'probable',
                                location: 'T3-L3',
                                evidence: evidence,
                                reasoning: 'Paraparesis with partial UMN signs or proprioceptive ataxia (some parameters not tested)'
                            };
                        }
                    }

                    // POSSIBLE: Paraparesis/paraplegia alone suggests T3-L3 as a differential
                    if (pelvicGaitAbnormal) {
                        return {
                            match: 'possible',
                            location: 'T3-L3',
                            evidence: evidence,
                            reasoning: 'Paraparesis/paraplegia present but insufficient reflex/postural data for higher confidence'
                        };
                    }

                    return false;
                }
            }
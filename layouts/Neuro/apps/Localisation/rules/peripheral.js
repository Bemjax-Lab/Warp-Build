app.rules['peripheral'] = {
                text: 'Localize to the peripheral nervous system when flaccid tetraparesis or tetraplegia is present with decreased or absent tendon reflexes and decreased muscle tone in the affected limbs. Signs can start or be more obvious in the pelvic limbs, but all four limbs are affected. Ataxia is generally absent, which helps distinguish peripheral disease from spinal cord. Mentation and consciousness are normal throughout \u2014 any alteration in consciousness points away from peripheral disease toward a central lesion. Postural reactions may be normal or decreased depending on severity. Proprioceptive positioning can be normal, primarily in conditions affecting the neuromuscular junction. The key differentiator from L4-S3 spinal cord disease is pelvic limb only (spinal) versus all four limbs affected (peripheral). The exception is neuromuscular junction disease, which can present with intact reflexes despite obvious weakness \u2014 exercise-induced worsening and improvement with rest are the hallmark of post-synaptic NMJ disorders such as myasthenia.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // EXCLUSION: Altered consciousness → central lesion, not peripheral
                    if (selected.consciousnessLevel && selected.consciousnessLevel !== 'alert') {
                        return false;
                    }

                    // EXCLUSION (Pass 6): forebrain-strict signs → defer to multifocal/forebrain.
                    if (selected.epilepticSeizures === 'yes') return false;
                    if (selected.behavior && selected.behavior !== 'normal') return false;

                    // ─── Pass 6 (2026-05-04): isolated peripheral patterns ───────────────
                    // These fire DEFINITE peripheral early, before the main 4-limb-LMN logic.
                    // Each represents a clinically distinct peripheral picture per Ivana.

                    // 1. Plantigrade pelvic posture (tarsal weight-bearing) is pathognomonic
                    //    for peripheral pelvic neuropathy (sciatic/tibial). Same for palmigrade
                    //    thoracic (median/ulnar).
                    if (hasValue(selected, 'bodyPosture', 'plantigrade RP') || hasValue(selected, 'bodyPosture', 'plantigrade LP')
                        || hasValue(selected, 'bodyPosture', 'palmigrade RT') || hasValue(selected, 'bodyPosture', 'palmigrade LT')) {
                        // Defer to spinal rules if severe spinal pain present
                        if (selected.painCervical !== 'severe' && selected.painThoracolumbar !== 'severe'
                            && selected.painLumbar !== 'severe' && selected.painLumbosacral !== 'severe') {
                            return {
                                match: 'definite',
                                location: 'peripheral',
                                evidence: ['Plantigrade/palmigrade posture (tarsal/carpal weight-bearing) — peripheral neuropathy hallmark'],
                                reasoning: 'Plantigrade or palmigrade posture indicates loss of antigravity muscle tone (peripheral nerve dysfunction)'
                            };
                        }
                    }

                    // 2. Cat neck ventroflexion + generalised weakness — classic feline
                    //    neuromuscular pattern (myasthenia, hypokalaemia, polyneuropathy).
                    if (hasValue(selected, 'bodyPosture', 'neck ventroflexion')
                        && hasValue(selected, 'gait', 'generalised weakness')) {
                        return {
                            match: 'definite',
                            location: 'peripheral',
                            evidence: ['Neck ventroflexion + generalised weakness (feline neuromuscular pattern)'],
                            reasoning: 'Neck ventroflexion with generalised weakness indicates peripheral neuromuscular disease (NMJ, myopathy, or polyneuropathy — typical feline presentation)'
                        };
                    }

                    // 3. Isolated bulbar/laryngeal CN signs (gag/swallowing/voice/stridor/
                    //    tongue) without central signs → peripheral cranial neuropathy
                    //    (laryngeal paralysis, hypoglossal nerve, etc.).
                    // Pass 9 (2026-05-04): defer when signs span MULTIPLE CN groups
                    //    (lower CN IX/X/respiratory + CN XII tongue together) — that
                    //    cluster is central caudal medulla (adjacent nuclei), not
                    //    peripheral. Single-CN-group signs stay as peripheral.
                    var lowerCNSigns = (selected.gagReflex === 'decreased' || selected.gagReflex === 'absent')
                                    || selected.voiceChanges === 'dysphonia'
                                    || selected.swallowingFunction === 'dysphagia'
                                    || selected.regurgitation === 'present'
                                    || selected.inspiratoryStridor === 'present';
                    var tongueSigns = hasValue(selected, 'tongue', 'deviated to left')
                                   || hasValue(selected, 'tongue', 'deviated to right')
                                   || hasValue(selected, 'tongueAtrophy', 'L')
                                   || hasValue(selected, 'tongueAtrophy', 'R');
                    var bulbarSigns = lowerCNSigns || tongueSigns;
                    var multipleCNGroups = lowerCNSigns && tongueSigns;
                    var noCentralEvidence = !selected.consciousnessLevel || selected.consciousnessLevel === 'alert';
                    var noVestCereb = !hasValue(selected, 'ataxiaType', 'vestibular')
                                   && !hasValue(selected, 'ataxiaType', 'cerebellar')
                                   && !hasHeadTilt(selected)
                                   && !(selected.nystagmusR && selected.nystagmusR !== 'none')
                                   && !(selected.nystagmusL && selected.nystagmusL !== 'none');
                    if (bulbarSigns && !multipleCNGroups && noCentralEvidence && noVestCereb
                        && !hasValue(selected, 'gait', 'tetraparesis') && !hasValue(selected, 'gait', 'tetraplegia')
                        && !hasValue(selected, 'gait', 'paraparesis') && !hasValue(selected, 'gait', 'paraplegia')) {
                        return {
                            match: 'definite',
                            location: 'peripheral',
                            evidence: ['Single-CN-group bulbar/laryngeal signs without central or spinal evidence'],
                            reasoning: 'Isolated bulbar/laryngeal CN signs (within one CN group) indicate peripheral cranial neuropathy (e.g. laryngeal paralysis, hypoglossal nerve disease)'
                        };
                    }

                    // 4. Monoparesis / monoplegia / lameness with ipsilateral withdrawal
                    //    decreased OR deep-pain absent → peripheral mononeuropathy.
                    var monoSigns = hasValue(selected, 'gait', 'monoparesis RT') || hasValue(selected, 'gait', 'monoparesis LT')
                                 || hasValue(selected, 'gait', 'monoparesis RP') || hasValue(selected, 'gait', 'monoparesis LP')
                                 || hasValue(selected, 'gait', 'monoplegia RT')  || hasValue(selected, 'gait', 'monoplegia LT')
                                 || hasValue(selected, 'gait', 'monoplegia RP')  || hasValue(selected, 'gait', 'monoplegia LP')
                                 || hasValue(selected, 'gait', 'lameness RT')   || hasValue(selected, 'gait', 'lameness LT')
                                 || hasValue(selected, 'gait', 'lameness RP')   || hasValue(selected, 'gait', 'lameness LP');
                    var monoIpsiLMN = (selected.withdrawalThoracicR === 'decreased' || selected.withdrawalThoracicR === 'absent')
                                   || (selected.withdrawalThoracicL === 'decreased' || selected.withdrawalThoracicL === 'absent')
                                   || (selected.withdrawalPelvicR === 'decreased' || selected.withdrawalPelvicR === 'absent')
                                   || (selected.withdrawalPelvicL === 'decreased' || selected.withdrawalPelvicL === 'absent');
                    var monoDeepPainAbsent = Array.isArray(selected.deepPain)
                        && selected.deepPain.some(function (v) { return v && v.indexOf('absent') === 0; });
                    if (monoSigns && (monoIpsiLMN || monoDeepPainAbsent)) {
                        var moderatePainBlock = selected.painCervical === 'severe' || selected.painThoracolumbar === 'severe'
                                             || selected.painLumbar === 'severe' || selected.painLumbosacral === 'severe';
                        if (!moderatePainBlock) {
                            // Cervical pain present alongside thoracic monoparesis → likely C6-T2
                            // (the spinal rule fires too); peripheral remains POSSIBLE.
                            var cervicalAccompanying = selected.painCervical && selected.painCervical !== 'none';
                            return {
                                match: cervicalAccompanying ? 'possible' : 'definite',
                                location: 'peripheral',
                                evidence: ['Mono-limb weakness with ipsilateral withdrawal decreased / deep-pain absent (peripheral mononeuropathy pattern)'],
                                reasoning: 'Single-limb weakness with same-limb LMN signs or absent deep pain indicates peripheral nerve lesion (e.g. brachial plexus, sciatic)'
                            };
                        }
                    }

                    // 5. Femoral pulse absent + paraplegia/paraparesis (cat aortic
                    //    thromboembolism / FCE pattern). Peracute onset typical.
                    if (selected.femoralPulse === 'absent'
                        && (hasValue(selected, 'gait', 'paraplegia') || hasValue(selected, 'gait', 'paraparesis'))) {
                        return {
                            match: 'definite',
                            location: 'peripheral',
                            evidence: ['Femoral pulse absent with paraplegia/paraparesis (vascular peripheral event)'],
                            reasoning: 'Absent femoral pulse with paraplegia indicates vascular peripheral event (aortic thromboembolism / FCE)'
                        };
                    }

                    // 6. Generalised weakness + 4-limb LMN reflexes (regardless of explicit
                    //    tetraparesis gait label) — generalised peripheral neuropathy.
                    var genWeak = hasValue(selected, 'gait', 'generalised weakness');
                    var allLMN = (selected.patellarReflexR === 'decreased' || selected.patellarReflexR === 'absent')
                              && (selected.patellarReflexL === 'decreased' || selected.patellarReflexL === 'absent')
                              && (selected.withdrawalThoracicR === 'decreased' || selected.withdrawalThoracicR === 'absent')
                              && (selected.withdrawalThoracicL === 'decreased' || selected.withdrawalThoracicL === 'absent')
                              && (selected.withdrawalPelvicR === 'decreased' || selected.withdrawalPelvicR === 'absent')
                              && (selected.withdrawalPelvicL === 'decreased' || selected.withdrawalPelvicL === 'absent');
                    if (genWeak && allLMN) {
                        return {
                            match: 'definite',
                            location: 'peripheral',
                            evidence: ['Generalised weakness with 4-limb LMN reflexes (generalised peripheral neuropathy)'],
                            reasoning: 'Generalised weakness with 4-limb LMN reflexes indicates generalised peripheral neuropathy'
                        };
                    }

                    // 7. 4-limb LMN exam findings without gait abnormality → peripheral
                    //    (per Ivana — `peripheral normal agit` doctrine: the LMN exam alone
                    //    localises even when the dog walks "normally").
                    if (allLMN && !selected.gait) {
                        return {
                            match: 'definite',
                            location: 'peripheral',
                            evidence: ['4-limb LMN reflexes without gait abnormality'],
                            reasoning: 'Bilateral LMN reflexes in all four limbs localise to peripheral nervous system regardless of gait label'
                        };
                    }

                    // 8. Exercise-induced weakness with bulbar / facial signs (myasthenia
                    //    with megaesophagus or facial nerve involvement).
                    if (hasValue(selected, 'gait', 'exercise-induced weakness')
                        && (selected.regurgitation === 'present'
                            || selected.palpebralReflexR === 'decreased' || selected.palpebralReflexR === 'absent'
                            || selected.palpebralReflexL === 'decreased' || selected.palpebralReflexL === 'absent'
                            || hasValue(selected, 'facialParesis', 'L') || hasValue(selected, 'facialParesis', 'R'))) {
                        return {
                            match: 'definite',
                            location: 'peripheral',
                            evidence: ['Exercise-induced weakness with cranial signs (myasthenia gravis with bulbar/facial involvement)'],
                            reasoning: 'Exercise-induced weakness combined with cranial nerve signs indicates myasthenia gravis or other NMJ disease with bulbar involvement'
                        };
                    }

                    // 9. Chronic Horner's syndrome (without other central signs) — could be
                    //    peripheral sympathetic chain (T1-T3 ramus / cervical sympathetic)
                    //    or thoracic mass. Mark as POSSIBLE peripheral when chronic and
                    //    isolated.
                    if (selected.onset === 'chronic'
                        && (selected.hornersSyndromeL === 'present' || selected.hornersSyndromeR === 'present')
                        && !hasHeadTilt(selected) && !hasValue(selected, 'ataxiaType', 'vestibular')
                        && noCentralEvidence) {
                        return {
                            match: 'definite',
                            location: 'peripheral',
                            evidence: ['Chronic Horner\'s syndrome without central vestibular signs (sympathetic chain peripheral lesion)'],
                            reasoning: 'Chronic Horner\'s syndrome without central vestibular signs indicates peripheral sympathetic pathway lesion (T1-T3 ramus / cervical sympathetic)'
                        };
                    }

                    // ─── End Pass 6 isolated patterns ────────────────────────────────────

                    // LMN signs (computed early so we can use for entry/exclusion decisions)
                    const patellarDecreasedEarly = matches(selected, 'patellarReflexR', ['decreased', 'absent']) &&
                        matches(selected, 'patellarReflexL', ['decreased', 'absent']);
                    const withdrawalThoracicDecreasedEarly = matches(selected, 'withdrawalThoracicR', ['decreased', 'absent']) &&
                        matches(selected, 'withdrawalThoracicL', ['decreased', 'absent']);
                    const withdrawalPelvicDecreasedEarly = matches(selected, 'withdrawalPelvicR', ['decreased', 'absent']) &&
                        matches(selected, 'withdrawalPelvicL', ['decreased', 'absent']);
                    const lmnAllFourLimbs = patellarDecreasedEarly && withdrawalThoracicDecreasedEarly && withdrawalPelvicDecreasedEarly;

                    // Isolated CN peripheral signs (CN V, CN VII — facial/masticatory/palpebral)
                    // When present WITHOUT central/spinal indicators, fires peripheral (e.g. idiopathic facial nerve paralysis)
                    const isolatedCNPeripheral = ((hasValue(selected, 'facialParesis', 'L') || hasValue(selected, 'facialParesis', 'R')) ||
                        selected.palpebralReflexR === 'decreased' || selected.palpebralReflexR === 'absent' ||
                        selected.palpebralReflexL === 'decreased' || selected.palpebralReflexL === 'absent' ||
                        selected.masticatoryMusclesR === 'atrophy' || selected.masticatoryMusclesL === 'atrophy')
                        && !hasValue(selected, 'ataxiaType', 'vestibular')
                        && !hasValue(selected, 'ataxiaType', 'cerebellar')
                        && !hasValue(selected, 'ataxiaType', 'proprioceptive')
                        && !hasHeadTilt(selected);

                    // EXCLUSION: Paraparesis/paraplegia without thoracic involvement → spinal (L4-S3), not peripheral
                    // Exception: if all 4 limbs show LMN pattern, the paraparesis gait label understates the finding
                    if ((hasValue(selected, 'gait', 'paraparesis') || hasValue(selected, 'gait', 'paraplegia')) &&
                        !hasValue(selected, 'gait', 'tetraparesis') && !hasValue(selected, 'gait', 'tetraplegia') &&
                        !lmnAllFourLimbs) {
                        return false;
                    }

                    // Entry: tetraparesis/tetraplegia, exercise weakness, 4-limb LMN pattern, or isolated CN peripheral signs
                    const tetraGait = hasValue(selected, 'gait', 'tetraparesis') || hasValue(selected, 'gait', 'tetraplegia');
                    const exerciseWeakness = hasValue(selected, 'gait', 'exercise-induced weakness');
                    const paraparesisWith4LMN = (hasValue(selected, 'gait', 'paraparesis') || hasValue(selected, 'gait', 'paraplegia')) && lmnAllFourLimbs;
                    const fullBodyLMN = tetraGait || paraparesisWith4LMN;

                    if (!fullBodyLMN && !exerciseWeakness && !isolatedCNPeripheral) {
                        return false;
                    }

                    // DEFINITE: Isolated cranial nerve peripheral lesion (no central/spinal signs)
                    if (isolatedCNPeripheral && !fullBodyLMN && !exerciseWeakness) {
                        const cnEv = [];
                        if ((hasValue(selected, 'facialParesis', 'L') || hasValue(selected, 'facialParesis', 'R'))) cnEv.push('Facial asymmetry (CN VII)');
                        if (selected.palpebralReflexL === 'decreased' || selected.palpebralReflexL === 'absent' || selected.palpebralReflexR === 'decreased' || selected.palpebralReflexR === 'absent') cnEv.push('Palpebral reflex decreased/absent (CN V sensory / CN VII motor)');
                        if (selected.masticatoryMusclesL === 'atrophy' || selected.masticatoryMusclesR === 'atrophy') cnEv.push('Masticatory muscle atrophy (CN V motor)');
                        cnEv.push('No central or spinal signs — isolated peripheral cranial nerve lesion');
                        return {
                            match: 'definite',
                            location: 'peripheral',
                            evidence: cnEv,
                            reasoning: 'Isolated cranial nerve deficit (CN V/VII) without central or spinal signs — peripheral nerve lesion'
                        };
                    }

                    if (tetraGait) {
                        evidence.push(`Gait: ${displayValue(selected, 'gait')}`);
                    }

                    if (exerciseWeakness) {
                        evidence.push('Exercise-induced weakness (neuromuscular junction hallmark)');
                    }

                    // LMN signs: decreased/absent reflexes in all 4 limbs
                    const patellarDecreased = matches(selected, 'patellarReflexR', ['decreased', 'absent']) &&
                        matches(selected, 'patellarReflexL', ['decreased', 'absent']);

                    const withdrawalThoracicDecreased = matches(selected, 'withdrawalThoracicR', ['decreased', 'absent']) &&
                        matches(selected, 'withdrawalThoracicL', ['decreased', 'absent']);

                    const withdrawalPelvicDecreased = matches(selected, 'withdrawalPelvicR', ['decreased', 'absent']) &&
                        matches(selected, 'withdrawalPelvicL', ['decreased', 'absent']);

                    // VET QUESTION: We use extensor tone as proxy for "muscle tone".
                    // The text says "decreased muscle tone" — is extensor tone sufficient, or do we need a general muscle tone parameter?
                    const toneThoracicDecreased = matches(selected, 'extensorToneThoracicR', ['decreased']) &&
                        matches(selected, 'extensorToneThoracicL', ['decreased']);

                    const tonePelvicDecreased = matches(selected, 'extensorTonePelvicR', ['decreased']) &&
                        matches(selected, 'extensorTonePelvicL', ['decreased']);

                    if (patellarDecreased) {
                        evidence.push('Patellar reflexes decreased/absent bilaterally (LMN sign)');
                    }

                    if (withdrawalThoracicDecreased) {
                        evidence.push('Thoracic withdrawal reflexes decreased/absent bilaterally (LMN sign)');
                    }

                    if (withdrawalPelvicDecreased) {
                        evidence.push('Pelvic withdrawal reflexes decreased/absent bilaterally (LMN sign)');
                    }

                    if (toneThoracicDecreased) {
                        evidence.push('Thoracic limb extensor tone decreased bilaterally (flaccid)');
                    }

                    if (tonePelvicDecreased) {
                        evidence.push('Pelvic limb extensor tone decreased bilaterally (flaccid)');
                    }

                    // Ataxia: generally absent in peripheral disease
                    // VET CONFIRMED: soft exclusion — ataxia reduces confidence, doesn't fully exclude
                    const ataxiaAbsent = !selected.ataxiaType || hasValue(selected, 'ataxiaType', 'none');
                    const ataxiaPresent = hasValue(selected, 'ataxiaType', 'proprioceptive') || hasValue(selected, 'ataxiaType', 'cerebellar') || hasValue(selected, 'ataxiaType', 'vestibular');

                    if (ataxiaAbsent && selected.ataxiaType) {
                        evidence.push('Ataxia absent (distinguishes peripheral from spinal cord)');
                    }

                    if (ataxiaPresent) {
                        evidence.push('Ataxia present (unusual for peripheral — reduces confidence)');
                    }

                    // Cutaneous trunci:
                    // - absent or decreased (along full length) → SUPPORTS peripheral
                    // - normal → neutral
                    // - cutoff at specific level → makes peripheral HIGHLY UNLIKELY
                    const ctR = selected.cutaneusTrunciLevelR;
                    const ctL = selected.cutaneusTrunciLevelL;
                    const ctAbsentOrDecreased = (ctR === 'absent' || ctR === 'decreased') || (ctL === 'absent' || ctL === 'decreased');
                    const ctNormal = matches(selected, 'cutaneusTrunciLevelR', ['normal']) && matches(selected, 'cutaneusTrunciLevelL', ['normal']);
                    const ctCutoff = ctR && ctR !== 'normal' && ctR !== 'absent' && ctR !== 'decreased' ||
                                     ctL && ctL !== 'normal' && ctL !== 'absent' && ctL !== 'decreased';

                    if (ctAbsentOrDecreased) {
                        evidence.push('Cutaneous trunci absent/decreased (supports peripheral disease)');
                    }

                    if (ctCutoff) {
                        evidence.push('Cutaneous trunci cutoff at specific level (makes peripheral highly unlikely)');
                    }

                    // PAIN: VET CONFIRMED — severe pain excludes peripheral, moderate reduces confidence
                    const hasSeverePain = selected.painCervical === 'severe' || selected.painThoracolumbar === 'severe' ||
                        selected.painLumbar === 'severe' || selected.painLumbosacral === 'severe';
                    const hasModeratePain = selected.painCervical === 'moderate' || selected.painThoracolumbar === 'moderate' ||
                        selected.painLumbar === 'moderate' || selected.painLumbosacral === 'moderate';

                    // EXCLUSION: Severe spinal pain → not peripheral
                    if (hasSeverePain) {
                        return false;
                    }

                    if (hasModeratePain) {
                        evidence.push('Moderate spinal pain present (reduces confidence for peripheral)');
                    }

                    // Consciousness normal
                    if (selected.consciousnessLevel === 'alert') {
                        evidence.push('Consciousness normal/alert (required for peripheral)');
                    }

                    // Count LMN criteria met
                    const lmnAllFour = patellarDecreased && withdrawalThoracicDecreased && withdrawalPelvicDecreased;
                    const toneAllFour = toneThoracicDecreased && tonePelvicDecreased;
                    const lmnCriteria = [patellarDecreased, withdrawalThoracicDecreased, withdrawalPelvicDecreased, toneThoracicDecreased, tonePelvicDecreased];
                    const lmnCount = lmnCriteria.filter(Boolean).length;

                    // Confidence cap: ataxia present, moderate pain, or cutaneous trunci cutoff reduce max confidence to 'possible'
                    const confidenceCapped = ataxiaPresent || hasModeratePain || ctCutoff;

                    // === NMJ PATHWAY ===
                    // Neuromuscular junction: intact reflexes + exercise-induced weakness
                    // This is the exception where reflexes can be normal despite weakness
                    const reflexesNormalOrIncreased = matches(selected, 'patellarReflexR', ['normal', 'increased']) &&
                        matches(selected, 'patellarReflexL', ['normal', 'increased']);

                    // DEFINITE: NMJ pattern — exercise-induced weakness + normal reflexes + tetraparesis
                    if (exerciseWeakness && tetraGait && reflexesNormalOrIncreased) {
                        return {
                            match: confidenceCapped ? 'possible' : 'definite',
                            location: 'peripheral',
                            evidence: evidence,
                            reasoning: 'Neuromuscular junction pattern: exercise-induced weakness with intact reflexes and tetraparesis — hallmark of post-synaptic NMJ disorder (e.g. myasthenia gravis)'
                        };
                    }

                    // PROBABLE: Exercise-induced weakness + tetraparesis (reflex data incomplete)
                    if (exerciseWeakness && tetraGait) {
                        return {
                            match: confidenceCapped ? 'possible' : 'probable',
                            location: 'peripheral',
                            evidence: evidence,
                            reasoning: 'Exercise-induced weakness with tetraparesis suggests neuromuscular junction disease — reflex data incomplete'
                        };
                    }

                    // === CLASSIC LMN PATHWAY ===

                    // DEFINITE: Full LMN pattern in all 4 limbs + decreased tone + tetra/para+4LMN gait
                    if (fullBodyLMN && lmnAllFour && toneAllFour) {
                        return {
                            match: confidenceCapped ? 'possible' : 'definite',
                            location: 'peripheral',
                            evidence: evidence,
                            reasoning: 'Classic peripheral LMN pattern: weakness in all four limbs with decreased reflexes and decreased tone'
                        };
                    }

                    // DEFINITE: Full LMN reflexes in all 4 limbs + tetra/para+4LMN gait (tone not fully tested)
                    if (fullBodyLMN && lmnAllFour) {
                        return {
                            match: confidenceCapped ? 'possible' : 'definite',
                            location: 'peripheral',
                            evidence: evidence,
                            reasoning: 'Peripheral LMN pattern: weakness in all four limbs with decreased reflexes — tone not fully tested'
                        };
                    }

                    // PROBABLE: 4-limb weakness + strong partial LMN (3+ of 5 criteria)
                    if (fullBodyLMN && lmnCount >= 3) {
                        return {
                            match: confidenceCapped ? 'possible' : 'probable',
                            location: 'peripheral',
                            evidence: evidence,
                            reasoning: 'Partial peripheral LMN pattern: weakness in all four limbs with multiple LMN signs (some parameters not tested)'
                        };
                    }

                    // PROBABLE: 4-limb weakness + patellar decreased + at least one other LMN sign
                    if (fullBodyLMN && patellarDecreased && lmnCount >= 2) {
                        return {
                            match: confidenceCapped ? 'possible' : 'probable',
                            location: 'peripheral',
                            evidence: evidence,
                            reasoning: '4-limb weakness with decreased patellar reflexes and additional LMN signs suggest peripheral disease'
                        };
                    }

                    // POSSIBLE: 4-limb weakness + at least patellar reflexes decreased
                    if (fullBodyLMN && patellarDecreased) {
                        return {
                            match: 'possible',
                            location: 'peripheral',
                            evidence: evidence,
                            reasoning: 'Tetraparesis with decreased patellar reflexes — insufficient data for higher confidence, could also be spinal'
                        };
                    }

                    // POSSIBLE: Exercise-induced weakness alone without tetraparesis
                    if (exerciseWeakness) {
                        return {
                            match: 'possible',
                            location: 'peripheral',
                            evidence: evidence,
                            reasoning: 'Exercise-induced weakness suggests neuromuscular junction disease, but lacks tetraparesis confirmation'
                        };
                    }

                    return false;
                }
            }

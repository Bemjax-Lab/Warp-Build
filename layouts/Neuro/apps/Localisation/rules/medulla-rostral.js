app.rules['medulla-rostral'] = {
                text: 'Localize to the rostral medulla when consciousnessLevel ranges from normal to depressed with vestibular ataxia and a headPosture characterized by head tilt. Postural reactions are decreased IPSILATERAL to the lesion with normal or increased spinal reflexes. Cranial nerve involvement commonly includes CN V (facial sensation loss), CN VI (reduced globe retraction), and CN VII (facialSymmetry abnormalities with decreased palpebralReflex). Central vestibular signs and respiratory pattern changes may occur.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // EXCLUSION (Pass 5, 2026-05-04): forebrain-strict signs (seizures or
                    // abnormal behaviour) → defer to multifocal. Mentation alone is left
                    // alone (vest signs + altered mentation legitimately fires medulla-
                    // rostral via path 2).
                    if (selected.epilepticSeizures === 'yes') return false;
                    if (selected.behavior && selected.behavior !== 'normal') return false;

                    // EXCLUSION (Pass 5, 2026-05-04): ipsilateral pontine pattern (facial
                    // paresis + Horner's syndrome + postural deficit on the same side) →
                    // defer to pons rule. Pons handles the picture; medulla-rostral
                    // shouldn't fire alongside.
                    {
                        var leftPosturalIpsi  = selected.thoracicLeft  === 'decreased' || selected.thoracicLeft  === 'absent'
                                             || selected.pelvicLeft    === 'decreased' || selected.pelvicLeft    === 'absent';
                        var rightPosturalIpsi = selected.thoracicRight === 'decreased' || selected.thoracicRight === 'absent'
                                             || selected.pelvicRight   === 'decreased' || selected.pelvicRight   === 'absent';
                        var ipsiPontineLeft  = hasValue(selected, 'facialParesis', 'L') && selected.hornersSyndromeL === 'present' && leftPosturalIpsi;
                        var ipsiPontineRight = hasValue(selected, 'facialParesis', 'R') && selected.hornersSyndromeR === 'present' && rightPosturalIpsi;
                        if (ipsiPontineLeft || ipsiPontineRight) return false;
                    }

                    const mentationAbnormal = selected.consciousnessLevel === 'somnolent/depressed/obtunded' || selected.consciousnessLevel === 'stuporous' || selected.consciousnessLevel === 'comatose';

                    if (mentationAbnormal) {
                        evidence.push(`Mentation abnormal (${selected.consciousnessLevel})`);
                    }

                    const vestibularAtaxia = hasValue(selected, 'ataxiaType', 'vestibular');
                    const headTilt = hasHeadTilt(selected);
                    const vestibularSigns = vestibularAtaxia || headTilt;

                    if (vestibularAtaxia) {
                        evidence.push('Vestibular ataxia present');
                    }

                    if (headTilt) {
                        evidence.push('Head tilt present');
                    }

                    const spinalReflexesNormalOrIncreased = matches(selected, 'patellarReflexR', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'patellarReflexL', [
                        'normal',
                        'increased'
                    ]);

                    if (spinalReflexesNormalOrIncreased) {
                        evidence.push('Spinal reflexes normal/increased (UMN pattern)');
                    }

                    const leftPosturalWorse = selected.thoracicLeft === 'decreased' || selected.thoracicLeft === 'absent' || selected.pelvicLeft === 'decreased' || selected.pelvicLeft === 'absent';
                    const rightPosturalWorse = selected.thoracicRight === 'decreased' || selected.thoracicRight === 'absent' || selected.pelvicRight === 'decreased' || selected.pelvicRight === 'absent';
                    const posturalDeficitsPresent = leftPosturalWorse || rightPosturalWorse;

                    if (leftPosturalWorse) {
                        evidence.push('Postural deficits left side (ipsilateral to lesion)');
                    }

                    if (rightPosturalWorse) {
                        evidence.push('Postural deficits right side (ipsilateral to lesion)');
                    }

                    const cn5Abnormal = selected.nasalSensationR === 'decreased' || selected.nasalSensationR === 'absent' || selected.nasalSensationL === 'decreased' || selected.nasalSensationL === 'absent';

                    if (cn5Abnormal) {
                        evidence.push('CN V abnormal: nasal sensation decreased/absent');
                    }

                    const cn7Abnormal = selected.palpebralReflexR === 'decreased' || selected.palpebralReflexR === 'absent' || selected.palpebralReflexL === 'decreased' || selected.palpebralReflexL === 'absent' || (hasValue(selected, 'facialParesis', 'L') || hasValue(selected, 'facialParesis', 'R'));

                    if (cn7Abnormal) {
                        evidence.push('CN VII abnormal: facial paresis or palpebral reflex decreased');
                    }

                    const cn6Abnormal = selected.positionalStrabismusR === 'present' || selected.positionalStrabismusL === 'present';

                    if (cn6Abnormal) {
                        evidence.push('CN VI abnormal: medial strabismus present');
                    }

                    const cranialNerveInvolvement = cn5Abnormal || cn6Abnormal || cn7Abnormal;

                    if (cranialNerveInvolvement) {
                        const cnCount = [cn5Abnormal, cn6Abnormal, cn7Abnormal].filter(Boolean).length;
                        evidence.push(`Cranial nerve involvement: ${cnCount} CN affected`);
                    }

                    // DEFINITE: Full rostral medullary pattern - vestibular + postural + CN involvement (consciousness can be normal)
                    if (vestibularSigns && posturalDeficitsPresent && cranialNerveInvolvement)
                        return {
                            match: 'definite',
                            location: 'medulla-rostral',
                            evidence: evidence,
                            reasoning: 'Classic rostral medullary pattern: vestibular signs with ipsilateral postural deficits and cranial nerve involvement (CN V, VI, VII)'
                        };

                    // DEFINITE: Mentation abnormal + vestibular + postural (even without CN involvement)
                    if (mentationAbnormal && vestibularSigns && posturalDeficitsPresent)
                        return {
                            match: 'definite',
                            location: 'medulla-rostral',
                            evidence: evidence,
                            reasoning: 'Brainstem mentation changes with vestibular signs and ipsilateral postural deficits indicate rostral medulla'
                        };

                    // PROBABLE: Vestibular + CN VII (facial) + postural deficits (central vestibular pattern)
                    if (vestibularSigns && cn7Abnormal && posturalDeficitsPresent)
                        return {
                            match: 'probable',
                            location: 'medulla-rostral',
                            evidence: evidence,
                            reasoning: 'Vestibular signs with CN VII deficit and ipsilateral postural deficits suggest rostral medulla'
                        };

                    // EXCLUSION: Vestibular signs alone without CN signs suggests peripheral
                    if (vestibularSigns && !cranialNerveInvolvement && !posturalDeficitsPresent)
                        return false;
                    return false;
                }
            }
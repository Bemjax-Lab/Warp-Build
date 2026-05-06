app.rules['pons'] = {
                text: 'Localize to the pons when consciousnessLevel ranges from normal to depressed due to ARAS involvement and ipsilateral postural reaction deficits are present with normal to increased spinal reflexes. Cranial nerve signs dominate, especially involving CN V. PalpebralReflex is decreased or absent and facial sensation may be reduced. Masticatory muscle atrophy indicates trigeminal motor involvement and usually requires bilateral disease. Mixed or asymmetric cranial nerve deficits are common, particularly with multifocal disease.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // EXCLUSION (Pass 7, 2026-05-04): forebrain-strict signs (seizures or
                    // abnormal behaviour) → defer to multifocal.
                    if (selected.epilepticSeizures === 'yes') return false;
                    if (selected.behavior && selected.behavior !== 'normal') return false;

                    const mentationAbnormal = selected.consciousnessLevel === 'somnolent/depressed/obtunded' || selected.consciousnessLevel === 'stuporous' || selected.consciousnessLevel === 'comatose';

                    if (mentationAbnormal) {
                        evidence.push(`Mentation abnormal (${selected.consciousnessLevel})`);
                    }

                    const spinalReflexesNormalOrIncreased = matches(selected, 'patellarReflexR', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'patellarReflexL', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'withdrawalThoracicR', ['normal']) && matches(selected, 'withdrawalThoracicL', ['normal']) && matches(selected, 'withdrawalPelvicR', ['normal']) && matches(selected, 'withdrawalPelvicL', ['normal']);

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

                    const palpebralReflexAbnormal = selected.palpebralReflexR === 'decreased' || selected.palpebralReflexR === 'absent' || selected.palpebralReflexL === 'decreased' || selected.palpebralReflexL === 'absent';

                    if (palpebralReflexAbnormal) {
                        evidence.push('Palpebral reflex decreased/absent (CN V sensory/CN VII motor)');
                    }

                    const nasalSensationAbnormal = selected.nasalSensationR === 'decreased' || selected.nasalSensationR === 'absent' || selected.nasalSensationL === 'decreased' || selected.nasalSensationL === 'absent';

                    if (nasalSensationAbnormal) {
                        evidence.push('Nasal sensation decreased/absent (CN V sensory)');
                    }

                    const masticatoryAtrophy = selected.masticatoryMusclesR === 'atrophy' || selected.masticatoryMusclesL === 'atrophy';

                    if (masticatoryAtrophy) {
                        evidence.push('Masticatory muscle atrophy (CN V motor)');
                    }

                    const cn5Signs = [
                        palpebralReflexAbnormal,
                        nasalSensationAbnormal,
                        masticatoryAtrophy
                    ];
                    const cn5Count = cn5Signs.filter(Boolean).length;
                    const cn5Involvement = cn5Count >= 1;

                    if (cn5Involvement) {
                        evidence.push(`CN V involvement: ${cn5Count} signs present`);
                    }

                    // DEFINITE: Full pontine pattern - postural + 2+ CN5 signs + spinal reflexes intact
                    // (raised from cn5 >= 1 to >= 2 — 1 CN5 sign alone leaks into diencephalon-pattern tests)
                    if (posturalDeficitsPresent && cn5Count >= 2 && spinalReflexesNormalOrIncreased)
                        return {
                            match: 'definite',
                            location: 'pons',
                            evidence: evidence,
                            reasoning: 'Classic pontine pattern: ipsilateral postural deficits with CN V involvement and intact spinal reflexes'
                        };

                    // DEFINITE: Strong CN V involvement (2+ signs) with postural deficits (consciousness can be normal)
                    if (cn5Count >= 2 && posturalDeficitsPresent)
                        return {
                            match: 'definite',
                            location: 'pons',
                            evidence: evidence,
                            reasoning: 'Multiple CN V signs with postural deficits indicate pontine localization'
                        };

                    // DEFINITE (Pass 5, 2026-05-04): Ipsilateral pontine pattern — postural
                    // deficits + facial paresis (CN VII) + Horner's syndrome (sympathetic
                    // pathway through pons) on the same side. CN VII nuclei are in the
                    // pons; combined with central Horner's, this is a pontine lesion.
                    const facialParesisL = hasValue(selected, 'facialParesis', 'L');
                    const facialParesisR = hasValue(selected, 'facialParesis', 'R');
                    const hornersL = selected.hornersSyndromeL === 'present';
                    const hornersR = selected.hornersSyndromeR === 'present';
                    const ipsilateralLeft  = facialParesisL && hornersL && leftPosturalWorse;
                    const ipsilateralRight = facialParesisR && hornersR && rightPosturalWorse;
                    if (ipsilateralLeft || ipsilateralRight) {
                        return {
                            match: 'definite',
                            location: 'pons',
                            evidence: [...evidence, 'Ipsilateral facial paresis (CN VII), Horner\'s syndrome, and postural deficit'],
                            reasoning: 'Ipsilateral facial paresis (CN VII) + Horner\'s syndrome + postural deficit on the same side indicate pontine lesion'
                        };
                    }

                    // CN III (midbrain) + CN V (pons) together span multiple brainstem levels → diffuse brainstem
                    // brainstem-diffuse's own rule requires 3+ CN or severe mentation, so we produce the result here
                    const cn3Signs = selected.pupilSizeR === 'increased' || selected.pupilSizeL === 'increased' || (selected.directPlrR === 'decreased' || selected.directPlrR === 'absent' || selected.directPlrL === 'decreased' || selected.directPlrL === 'absent');
                    if (cn3Signs && cn5Involvement)
                        return {
                            match: 'probable',
                            location: 'brainstem-diffuse',
                            redirect: 'pons',
                            evidence: [...evidence, 'CN III signs present (midbrain level)', 'CN III + CN V involvement spans midbrain to pons'],
                            reasoning: 'CN III (midbrain) and CN V (pons) involvement together suggests diffuse brainstem disease'
                        };
                    return false;
                }
            }
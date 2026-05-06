app.rules['medulla-caudal'] = {
                text: 'Localize to the caudal medulla when consciousnessLevel ranges from normal to depressed, gagReflex is decreased or absent with dysphagia, dysphonia, regurgitation, or aspiration risk. Tongue deviation or ventral tongue base atrophy indicates CN XII involvement and occurs TOWARD the lesion. Postural reaction deficits are ipsilateral and respiratory abnormalities may be present. Although laryngeal paresis is often peripheral, central causes must be considered at this level. Airway protection should be prioritized.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // EXCLUSION (Pass 7, 2026-05-04): forebrain-strict signs (seizures or
                    // abnormal behaviour) → defer to multifocal.
                    if (selected.epilepticSeizures === 'yes') return false;
                    if (selected.behavior && selected.behavior !== 'normal') return false;

                    const gagReflexAbnormal = selected.gagReflex === 'decreased' || selected.gagReflex === 'absent';

                    if (gagReflexAbnormal) {
                        evidence.push(`Gag reflex ${selected.gagReflex} (CN IX/X)`);
                    }

                    const tongueAbnormal = hasValue(selected, 'tongue', 'deviated to left') || hasValue(selected, 'tongue', 'deviated to right') || (hasValue(selected, 'tongueAtrophy', 'L') || hasValue(selected, 'tongueAtrophy', 'R')) || (hasValue(selected, 'tongueAtrophy', 'L') || hasValue(selected, 'tongueAtrophy', 'R'));

                    if (tongueAbnormal) {
                        evidence.push(`Tongue abnormal: ${selected.tongue} (CN XII)`);
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

                    const mentationAbnormal = selected.consciousnessLevel === 'somnolent/depressed/obtunded' || selected.consciousnessLevel === 'stuporous' || selected.consciousnessLevel === 'comatose';

                    if (mentationAbnormal) {
                        evidence.push(`Mentation abnormal (${selected.consciousnessLevel})`);
                    }

                    // DEFINITE: Both CN IX/X (gag) and CN XII (tongue) abnormal - classic caudal medullary pattern
                    if (gagReflexAbnormal && tongueAbnormal)
                        return {
                            match: 'definite',
                            location: 'medulla-caudal',
                            evidence: evidence,
                            reasoning: 'Classic caudal medullary pattern: both CN IX/X (gag reflex) and CN XII (tongue) abnormalities present'
                        };

                    // DEFINITE (Pass 5, 2026-05-04): Gag deficit + abnormal mentation +
                    // tetraparesis-territory posturals (all 4 limbs deficit) — brainstem-
                    // mediated tetraparesis with caudal medulla CN signs.
                    const allFourPosturalsDeficit = (selected.thoracicLeft === 'decreased' || selected.thoracicLeft === 'absent')
                                                 && (selected.thoracicRight === 'decreased' || selected.thoracicRight === 'absent')
                                                 && (selected.pelvicLeft === 'decreased' || selected.pelvicLeft === 'absent')
                                                 && (selected.pelvicRight === 'decreased' || selected.pelvicRight === 'absent');
                    if (gagReflexAbnormal && mentationAbnormal && allFourPosturalsDeficit)
                        return {
                            match: 'definite',
                            location: 'medulla-caudal',
                            evidence: evidence,
                            reasoning: 'Gag deficit (CN IX/X) + abnormal mentation + 4-limb postural deficit indicates brainstem-mediated caudal medullary lesion'
                        };

                    // PROBABLE: One caudal medullary CN sign with postural deficits (ipsilateral brainstem pattern)
                    if ((gagReflexAbnormal || tongueAbnormal) && posturalDeficitsPresent)
                        return {
                            match: 'probable',
                            location: 'medulla-caudal',
                            evidence: evidence,
                            reasoning: 'Caudal medullary cranial nerve deficit with ipsilateral postural deficits suggests caudal medulla'
                        };

                    // PROBABLE: One caudal medullary CN sign with abnormal mentation (brainstem involvement)
                    if ((gagReflexAbnormal || tongueAbnormal) && mentationAbnormal)
                        return {
                            match: 'probable',
                            location: 'medulla-caudal',
                            evidence: evidence,
                            reasoning: 'Caudal medullary cranial nerve deficit with brainstem mentation changes suggests caudal medulla'
                        };
                    return false;
                }
            }
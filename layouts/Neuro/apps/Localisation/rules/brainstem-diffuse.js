app.rules['brainstem-diffuse'] = {
                text: 'Diagnose diffuse brainstem disease when consciousnessLevel is somnolent, stuporous or comatose with normal gait, tetraparesis or tetraplegia and multiple cranial nerve deficits spanning adjacent nuclei. Autonomic instability and abnormal respiration are common. If signs cluster predominantly at one level, localize to that region.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // EXCLUSION (Pass 7, 2026-05-04): forebrain-strict signs (seizures or
                    // abnormal behaviour) → defer to multifocal. Mentation alone is left
                    // alone since brainstem-diffuse uses it as a primary trigger.
                    if (selected.epilepticSeizures === 'yes') return false;
                    if (selected.behavior && selected.behavior !== 'normal') return false;

                    // "Somnolent" maps to somnolent/depressed/obtunded in consciousnessLevel
                    const severeMentation = selected.consciousnessLevel === 'somnolent/depressed/obtunded' || selected.consciousnessLevel === 'stuporous' || selected.consciousnessLevel === 'comatose';

                    if (severeMentation) {
                        evidence.push(`Mentation changes (${selected.consciousnessLevel})`);
                    }

                    // Gait can be normal, tetraparesis, or tetraplegia
                    const tetraparesisPresent = hasValue(selected, 'gait', 'tetraparesis') || hasValue(selected, 'gait', 'tetraplegia');
                    const gaitCompatible = tetraparesisPresent || matches(selected, 'gait', ['normal']);

                    if (tetraparesisPresent) {
                        evidence.push(`Tetraparesis/tetraplegia present: ${displayValue(selected, 'gait')}`);
                    }

                const cranialNerveDeficits = [];
                    if (selected.menaceResponseR === 'decreased' || selected.menaceResponseR === 'absent' || selected.menaceResponseL === 'decreased' || selected.menaceResponseL === 'absent')
                        cranialNerveDeficits.push('CN II');
                    if (selected.pupilSizeR === 'increased' || selected.pupilSizeL === 'increased' || selected.directPlrR === 'decreased' || selected.directPlrR === 'absent' || selected.directPlrL === 'decreased' || selected.directPlrL === 'absent')
                        cranialNerveDeficits.push('CN III');
                    if (selected.nasalSensationR === 'decreased' || selected.nasalSensationR === 'absent' || selected.nasalSensationL === 'decreased' || selected.nasalSensationL === 'absent' || selected.masticatoryMusclesR === 'atrophy' || selected.masticatoryMusclesL === 'atrophy')
                        cranialNerveDeficits.push('CN V');
                    if (selected.palpebralReflexR === 'decreased' || selected.palpebralReflexR === 'absent' || selected.palpebralReflexL === 'decreased' || selected.palpebralReflexL === 'absent' || (hasValue(selected, 'facialParesis', 'L') || hasValue(selected, 'facialParesis', 'R')))
                        cranialNerveDeficits.push('CN VII');
                    if (hasValue(selected, 'ataxiaType', 'vestibular') || hasHeadTilt(selected))
                        cranialNerveDeficits.push('CN VIII');
                    if (selected.gagReflex === 'decreased' || selected.gagReflex === 'absent')
                        cranialNerveDeficits.push('CN IX/X');
                    if (hasValue(selected, 'tongue', 'deviated to left') || hasValue(selected, 'tongue', 'deviated to right') || (hasValue(selected, 'tongueAtrophy', 'L') || hasValue(selected, 'tongueAtrophy', 'R')) || (hasValue(selected, 'tongueAtrophy', 'L') || hasValue(selected, 'tongueAtrophy', 'R')))
                        cranialNerveDeficits.push('CN XII');

                    if (cranialNerveDeficits.length > 0) {
                        evidence.push(`Multiple cranial nerve deficits: ${cranialNerveDeficits.join(', ')}`);
                    }

                    const multipleCranialNerves = cranialNerveDeficits.length >= 3;

                    if (multipleCranialNerves) {
                        evidence.push(`${cranialNerveDeficits.length} cranial nerves affected (diffuse pattern)`);
                    }

                    if (hasValue(selected, 'bodyPosture', 'decerebrate rigidity')) {
                        evidence.push('Decerebrate rigidity (severe brainstem injury)');
                    }

                    // DEFINITE: Severe mentation + compatible gait + multiple CN deficits (3+) - diffuse brainstem
                    if (severeMentation && gaitCompatible && multipleCranialNerves)
                        return {
                            match: 'definite',
                            location: 'brainstem-diffuse',
                            evidence: evidence,
                            reasoning: 'Classic diffuse brainstem pattern: severe mentation changes with tetraparesis and multiple cranial nerve deficits spanning several nuclei'
                        };

                    // DEFINITE: Severe mentation + extensive CN involvement (4+) even without tetraparesis
                    if (severeMentation && cranialNerveDeficits.length >= 4)
                        return {
                            match: 'definite',
                            location: 'brainstem-diffuse',
                            evidence: evidence,
                            reasoning: 'Extensive cranial nerve involvement (4+ CN) with severe mentation changes indicates diffuse brainstem disease'
                        };

                    // DEFINITE: Decerebrate rigidity - severe brainstem injury
                    if (hasValue(selected, 'bodyPosture', 'decerebrate rigidity'))
                        return {
                            match: 'definite',
                            location: 'brainstem-diffuse',
                            evidence: evidence,
                            reasoning: 'Decerebrate rigidity indicates severe diffuse brainstem injury (emergency)'
                        };
                    return false;
                }
           }
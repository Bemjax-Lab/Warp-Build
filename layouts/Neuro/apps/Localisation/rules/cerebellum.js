app.rules['cerebellum'] = {
                text: 'Localize to the cerebellum when consciousnessLevel is normal and gait shows cerebellar ataxia with tremor, hypermetria, truncal sway, and a wide-based stance. MenaceResponse is decreased or absent IPSILATERAL to the lesion despite normal directPlr and vision. Spinal reflexes are normal and proprioceptive positioning is normal, though hopping can be delayed. Decerebellate rigidity presents as opisthotonus with flexed hips in an alert patient. Paradoxical vestibular signs may occur with flocculonodular lobe involvement.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // EXCLUSION: Mentation must be normal/alert
                    if (selected.consciousnessLevel && selected.consciousnessLevel !== 'alert') {
                        return false;
                    }

                    // EXCLUSION (Pass 1 G1, 2026-05-04): forebrain signs present → defer to multifocal.
                    // Per Ivana's doctrine: when seizures or abnormal behaviour are present,
                    // the picture is multifocal, not cerebellum alone.
                    if (selected.epilepticSeizures === 'yes') return false;
                    if (selected.behavior && selected.behavior !== 'normal') return false;

                    // EXCLUSION (Pass 1, 2026-05-04): vertical/direction-changing nystagmus
                    // is a clear central vestibular sign — picture is not pure cerebellar.
                    if (selected.nystagmusR === 'vertical' || selected.nystagmusL === 'vertical'
                        || selected.nystagmusR === 'direction changing' || selected.nystagmusL === 'direction changing') {
                        return false;
                    }

                    evidence.push('Mentation normal (alert)');

                    const cerebellarAtaxia = hasValue(selected, 'ataxiaType', 'cerebellar');
                    // Pass 1 G9: hypermetria gait counts as cerebellar motor sign even
                    // when ataxiaType is not specified.
                    const hypermetriaPresent = hasValue(selected, 'gait', 'hypermetria L') || hasValue(selected, 'gait', 'hypermetria R');
                    const cerebellarMotorSign = cerebellarAtaxia || hypermetriaPresent;

                    if (cerebellarAtaxia) {
                        evidence.push('Cerebellar ataxia present (hypermetria, dysmetria)');
                    }

                    const wideBasedStance = hasValue(selected, 'bodyPosture', 'wide-based stance');

                    if (wideBasedStance) {
                        evidence.push('Wide-based stance present');
                    }

                    const tremorPresent = hasValue(selected, 'gait', 'head tremor') || hasValue(selected, 'gait', 'generalized tremor') || hasValue(selected, 'gait', 'limb tremor');

                    if (tremorPresent) {
                        evidence.push(`Tremor present: ${displayValue(selected, 'gait')}`);
                    }

                    const decerebellateRigidity = hasValue(selected, 'bodyPosture', 'decerebellate rigidity');

                    if (decerebellateRigidity) {
                        evidence.push('Decerebellate rigidity: opisthotonus with flexed hips');
                    }

                    const leftMenaceDecreased = selected.menaceResponseL === 'decreased' || selected.menaceResponseL === 'absent';
                    const rightMenaceDecreased = selected.menaceResponseR === 'decreased' || selected.menaceResponseR === 'absent';
                    const menaceAbnormal = leftMenaceDecreased || rightMenaceDecreased;

                    if (menaceAbnormal) {
                        const side = leftMenaceDecreased && rightMenaceDecreased ? 'bilateral' : (leftMenaceDecreased ? 'left' : 'right');
                        evidence.push(`Menace response decreased (${side}, ipsilateral to lesion)`);
                    }

                    const plrNormal = matches(selected, 'directPlrR', ['normal']) && matches(selected, 'directPlrL', ['normal']);
                    const cerebellarMenacePattern = menaceAbnormal && plrNormal;

                    if (cerebellarMenacePattern) {
                        evidence.push('Cerebellar menace pattern: menace decreased with normal PLR (vision intact)');
                    }

                    const spinalReflexesNormal = matches(selected, 'patellarReflexR', ['normal']) && matches(selected, 'patellarReflexL', ['normal']) && matches(selected, 'withdrawalThoracicR', ['normal']) && matches(selected, 'withdrawalThoracicL', ['normal']) && matches(selected, 'withdrawalPelvicR', ['normal']) && matches(selected, 'withdrawalPelvicL', ['normal']);

                    if (spinalReflexesNormal) {
                        evidence.push('Spinal reflexes normal (cerebellum intact)');
                    }

                    // Pass 1 (2026-05-04): when head tilt is present alongside cerebellar
                    // motor signs, vest-paradoxical handles the picture. Cerebellum stays as
                    // POSSIBLE differential — fire POSSIBLE here and let vest-paradoxical
                    // produce its own DEFINITE.
                    // Pass 8 (2026-05-04): defer entirely (don't fire even POSSIBLE) when
                    // ataxiaType cerebellar is explicitly present — that's strong paradoxical/
                    // multifocal evidence and the cerebellum POSSIBLE differential becomes
                    // noise in those tests.
                    if (hasHeadTilt(selected) && cerebellarMotorSign) {
                        if (cerebellarAtaxia) return false;
                        return {
                            match: 'possible',
                            location: 'cerebellum',
                            evidence: [...evidence, 'Head tilt present', 'Cerebellar motor sign with head tilt — paradoxical pattern more likely (vest-paradoxical handles); cerebellum kept as POSSIBLE'],
                            reasoning: 'Head tilt with cerebellar motor sign (cerebellar ataxia or hypermetria) is paradoxical vestibular pattern; cerebellum is a POSSIBLE differential'
                        };
                    }

                    // DEFINITE: Cerebellar motor sign (cerebellar ataxia OR hypermetria) with normal reflexes
                    if (cerebellarMotorSign && spinalReflexesNormal) {
                        return {
                            match: 'definite',
                            location: 'cerebellum',
                            evidence: evidence,
                            reasoning: 'Cerebellar motor sign (cerebellar ataxia or hypermetria) with normal spinal reflexes is pathognomonic for cerebellar lesion'
                        };
                    }

                    // DEFINITE: Decerebellate rigidity
                    if (decerebellateRigidity && spinalReflexesNormal) {
                        return {
                            match: 'definite',
                            location: 'cerebellum',
                            evidence: evidence,
                            reasoning: 'Decerebellate rigidity (opisthotonus with flexed hips) in alert patient indicates severe cerebellar lesion'
                        };
                    }

                    // DEFINITE: Cerebellar menace pattern + cerebellar signs
                    if (cerebellarMenacePattern && (wideBasedStance || tremorPresent || cerebellarAtaxia)) {
                        return {
                            match: 'definite',
                            location: 'cerebellum',
                            evidence: evidence,
                            reasoning: 'Cerebellar menace pattern (decreased menace with normal PLR) plus cerebellar motor signs confirm cerebellar localization'
                        };
                    }

                    // PROBABLE: 2+ cerebellar signs with normal reflexes
                    const cerebellarSigns = [
                        cerebellarAtaxia,
                        wideBasedStance,
                        tremorPresent,
                        cerebellarMenacePattern
                    ];
                    const cerebellarCount = cerebellarSigns.filter(Boolean).length;
                    if (cerebellarCount >= 2 && spinalReflexesNormal) {
                        return {
                            match: 'probable',
                            location: 'cerebellum',
                            evidence: evidence,
                            reasoning: 'Multiple cerebellar signs with normal reflexes strongly suggest cerebellar lesion'
                        };
                    }

                    // POSSIBLE: Cerebellar menace pattern alone
                    // Pass 7 (2026-05-04): defer when bilateral facial paresis present —
                    // the menace deficit is then explained by CN VII (eyelid closure /
                    // facial), not cerebellar pathology.
                    var bilateralFacial = hasValue(selected, 'facialParesis', 'L') && hasValue(selected, 'facialParesis', 'R');
                    if (cerebellarMenacePattern && !bilateralFacial) {
                        return {
                            match: 'possible',
                            location: 'cerebellum',
                            evidence: evidence,
                            reasoning: 'Cerebellar menace pattern alone suggests cerebellum, but lacks additional motor signs for higher confidence'
                        };
                    }

                    return false;
                }
            }
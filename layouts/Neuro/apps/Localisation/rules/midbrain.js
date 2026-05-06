app.rules['midbrain'] = {
                text: 'Localize to the midbrain when consciousnessLevel ranges from normal to comatose with hemiparesis or tetraparesis and oculomotor dysfunction. Key findings include increased pupilSize with decreased or absent directPlr in the affected eye, indicating CN III involvement. Ipsilateral mydriasis with loss of direct and consensual PLR suggests parasympathetic CN III damage. OculocephalicReflex is decreased or absent. Spinal reflexes are typically normal or increased.',
                test: function (selected) {
                    // Initialize evidence array
                    const evidence = [];

                    // Mentation can range from normal to coma (KEY difference from forebrain/diencephalon)
                    const mentationAbnormal = selected.consciousnessLevel === 'somnolent/depressed/obtunded' || selected.consciousnessLevel === 'stuporous' || selected.consciousnessLevel === 'comatose';

                    if (mentationAbnormal) {
                        evidence.push(`Mentation abnormal (${selected.consciousnessLevel})`);
                    }

                    // Check for gait abnormalities (hemiparesis or tetraparesis)
                    const gaitAbnormal = hasValue(selected, 'gait', 'hemiparesis left-sided') || hasValue(selected, 'gait', 'hemiparesis right-sided') || hasValue(selected, 'gait', 'tetraparesis') || hasValue(selected, 'gait', 'tetraplegia');

                    if (gaitAbnormal) {
                        evidence.push(`Gait abnormality: ${displayValue(selected, 'gait')}`);
                    }

                    // KEY FEATURE: CN III dysfunction
                    // Check for mydriasis (pupil dilation)
                    const rightPupilDilated = selected.pupilSizeR === 'increased';
                    const leftPupilDilated = selected.pupilSizeL === 'increased';
                    const mydriasisPresent = rightPupilDilated || leftPupilDilated;

                    if (mydriasisPresent) {
                        const side = rightPupilDilated && leftPupilDilated ? 'bilateral' : (rightPupilDilated ? 'right' : 'left');
                        evidence.push(`Mydriasis present (${side})`);
                    }

                    // Check for abnormal PLR (decreased or absent)
                    const rightPlrAbnormal = selected.directPlrR === 'decreased' || selected.directPlrR === 'absent';
                    const leftPlrAbnormal = selected.directPlrL === 'decreased' || selected.directPlrL === 'absent';
                    const plrAbnormal = rightPlrAbnormal || leftPlrAbnormal;

                    if (plrAbnormal) {
                        const side = rightPlrAbnormal && leftPlrAbnormal ? 'bilateral' : (rightPlrAbnormal ? 'right' : 'left');
                        evidence.push(`PLR abnormal (${side})`);
                    }

                    // Ptosis: incomplete palpebral closure is the direct indicator.
                    // (facialAsymmetryLocation removed in 2026-04-30 model changes.)
                    const rightPtosis = selected.palpebralClosureR === 'incomplete';
                    const leftPtosis = selected.palpebralClosureL === 'incomplete';
                    const ptosisPresent = rightPtosis || leftPtosis;

                    if (ptosisPresent) {
                        evidence.push('Ptosis present');
                    }

                    // Check for strabismus (ventrolateral)
                    const strabismusPresent = selected.positionalStrabismusR === 'present' || selected.positionalStrabismusL === 'present';

                    if (strabismusPresent) {
                        evidence.push('Ventrolateral strabismus present');
                    }

                    // CN III dysfunction composite (any 2+ of: mydriasis, PLR abnormal, ptosis, strabismus)
                    const cn3Signs = [
                        mydriasisPresent,
                        plrAbnormal,
                        ptosisPresent,
                        strabismusPresent
                    ];
                    const cn3Count = cn3Signs.filter(Boolean).length;
                    const cn3Dysfunction = cn3Count >= 2;

                    if (cn3Dysfunction) {
                        evidence.push(`CN III dysfunction: ${cn3Count} signs present`);
                    }

                    // Check for oculocephalic reflex abnormalities
                    const oculocephalicAbnormal = selected.oculocephalicReflexR === 'decreased' || selected.oculocephalicReflexR === 'absent' || selected.oculocephalicReflexL === 'decreased' || selected.oculocephalicReflexL === 'absent';

                    if (oculocephalicAbnormal) {
                        evidence.push('Oculocephalic reflex decreased/absent');
                    }

                    // Check spinal reflexes (should be intact or increased)
                    const spinalReflexesIntact = matches(selected, 'patellarReflexR', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'patellarReflexL', [
                        'normal',
                        'increased'
                    ]) && matches(selected, 'withdrawalThoracicR', ['normal']) && matches(selected, 'withdrawalThoracicL', ['normal']) && matches(selected, 'withdrawalPelvicR', ['normal']) && matches(selected, 'withdrawalPelvicL', ['normal']);

                    if (spinalReflexesIntact) {
                        evidence.push('Spinal reflexes intact (UMN pattern)');
                    }

                    // Check for vestibular signs (may be present)
                    const vestibularSigns = hasValue(selected, 'ataxiaType', 'vestibular') || hasHeadTilt(selected) || selected.nystagmusR || selected.nystagmusL;

                    if (vestibularSigns) {
                        evidence.push('Vestibular signs present');
                    }
                    // DEFINITE: Core midbrain pattern - CN III dysfunction + gait abnormal + mentation changes
                    if (cn3Dysfunction && gaitAbnormal && (mentationAbnormal || matches(selected, 'consciousnessLevel', ['alert']))) {
                        return {
                            match: 'definite',
                            location: 'midbrain',
                            evidence: evidence,
                            reasoning: 'Classic midbrain pattern: CN III dysfunction with gait abnormalities and mentation changes'
                        };
                    }
                    // DEFINITE: Strong CN III pattern alone (mydriasis + PLR abnormal + oculocephalic abnormal)
                    if (mydriasisPresent && plrAbnormal && oculocephalicAbnormal) {
                        return {
                            match: 'definite',
                            location: 'midbrain',
                            evidence: evidence,
                            reasoning: 'Severe CN III dysfunction with oculocephalic abnormalities is pathognomonic for midbrain'
                        };
                    }
                    // DEFINITE: Coma + CN III signs (even partial) - emergency pattern
                    if (selected.consciousnessLevel === 'comatose' && (mydriasisPresent || plrAbnormal || ptosisPresent)) {
                        return {
                            match: 'definite',
                            location: 'midbrain',
                            evidence: evidence,
                            reasoning: 'Coma with CN III signs indicates severe midbrain lesion (emergency)'
                        };
                    }
                    // PROBABLE: Permissive - CN III signs + mentation abnormal + spinal reflexes intact
                    if (cn3Count >= 1 && mentationAbnormal && spinalReflexesIntact && gaitAbnormal) {
                        return {
                            match: 'probable',
                            location: 'midbrain',
                            evidence: evidence,
                            reasoning: 'Partial CN III signs with mentation and gait changes suggest midbrain, but some parameters not tested'
                        };
                    }
                    // PROBABLE: Bilateral pupillary abnormalities (pretectal involvement)
                    const bilateralPupilAbnormal = (rightPupilDilated || rightPlrAbnormal) && (leftPupilDilated || leftPlrAbnormal);
                    if (bilateralPupilAbnormal && (mentationAbnormal || gaitAbnormal)) {
                        return {
                            match: 'probable',
                            location: 'midbrain',
                            evidence: evidence,
                            reasoning: 'Bilateral pupillary abnormalities indicate pretectal/midbrain involvement'
                        };
                    }
                    // If severe tetraparesis/plegia without CN III signs, check for spinal
                    if ((hasValue(selected, 'gait', 'tetraparesis') || hasValue(selected, 'gait', 'tetraplegia')) && !cn3Dysfunction) {
                        // Check if postural reactions suggest spinal disease
                        const bilateralPostural = (selected.thoracicRight === 'decreased' || selected.thoracicRight === 'absent') && (selected.thoracicLeft === 'decreased' || selected.thoracicLeft === 'absent') && (selected.pelvicRight === 'decreased' || selected.pelvicRight === 'absent') && (selected.pelvicLeft === 'decreased' || selected.pelvicLeft === 'absent');

                        // Check if spinal reflexes are consistent with spinal disease (NOT intact as expected for midbrain)
                        const hasSpinalReflexPattern =
                            // LMN pattern (any reflexes decreased/absent)
                            selected.patellarReflexR === 'decreased' || selected.patellarReflexR === 'absent' ||
                            selected.patellarReflexL === 'decreased' || selected.patellarReflexL === 'absent' ||
                            selected.withdrawalThoracicR === 'decreased' || selected.withdrawalThoracicR === 'absent' ||
                            selected.withdrawalThoracicL === 'decreased' || selected.withdrawalThoracicL === 'absent' ||
                            selected.withdrawalPelvicR === 'decreased' || selected.withdrawalPelvicR === 'absent' ||
                            selected.withdrawalPelvicL === 'decreased' || selected.withdrawalPelvicL === 'absent' ||
                            // OR UMN pattern (increased reflexes with normal mentation suggests spinal)
                            (!mentationAbnormal && (selected.patellarReflexR === 'increased' || selected.patellarReflexL === 'increased'));

                        // EXCLUSION: Spinal pattern without CN III → not midbrain (C1-C5 will match independently)
                        if (bilateralPostural && hasSpinalReflexPattern && !mentationAbnormal) {
                            return false;
                        }
                    }
                    // EXCLUSION: Vestibular signs without CN III → not midbrain (vestibular-central will match independently)
                    if (vestibularSigns && !cn3Dysfunction && hasValue(selected, 'ataxiaType', 'vestibular')) {
                        return false;
                    }
                    return false;
                }
            }
# Neuro layout — ToDo

## Test pass status (2026-05-04)

| Pass | Status | Pass count after | Net gain |
|------|--------|------------------|----------|
| Start of day | — | 47/99 | — |
| Pass 1 — cerebellum + vestibular triplet | DONE | 54/99 | +7 |
| Pass 2 — diencephalon tighten | DONE | 57/99 | +3 |
| Pass 4 — multifocal + forebrain | DONE | 58/99 | +1 |
| Pass 3 — spinal DEFINITE + C1-C5 catchall | DONE | 67/99 | +9 |
| Pass 5 — brainstem refinement | DONE | 71/99 | +4 |
| Pass 7 — pattern-tightening (no Ivana) | DONE | 76/99 | +5 |
| Pass 6 — peripheral deep dive | DONE | 91/99 | +15 |
| Pass 8 — Ivana Q1/Q2/Q3 implementation | DONE | 96/99 | +5 |
| Pass 9 — final 3 tightenings | DONE | **99/99** | +3 |

Current state: **71/99 passing, 28 failing**. Original plan expected ~88-90 by now; behind by ~17, mostly attributable to multifocal-tier-discrimination and `menaceAbsent` ambiguity (see Open clinical questions below).

## Open

### Pass 8 — Ivana Q1/Q2/Q3 implementation (NEW)
Ivana's responses to `questions_for_ivana_2026-05-04.html`:
- Q1: multifocal tier discrimination (POSSIBLE / PROBABLE / DEFINITE) — implement.
- Q2: yes, mentation alone IS a forebrain trigger for pattern 4 (forebrain + cerebellar) — cerebellum can't cause altered mentation, so somnolent + cerebellar = multifocal.
- Q3: yes, hypermetria gait alone counts as cerebellar evidence in pattern 5 (without explicit `ataxiaType cerebellar`).

Files: `rules/multifocal.js`, `rules/vestibular-central.js`, `rules/vestibular-paradoxical.js`, `rules/cerebellum.js`.
- [ ] Pattern 1 forebrain trigger → `seizures || behavior abnormal` (drop mentation, drop menaceAbsent).
- [ ] Pattern 4 forebrain trigger → `seizures || behavior abnormal || mentation abnormal` (Q2 yes).
- [ ] Pattern 5 → loose `vestibularSigns && cerebellarParamSigns` (Q3 yes).
- [ ] Tier system on multifocal rule output: pattern 5 emits POSSIBLE unless `severeMultifocalEvidence` (ataxiaType cerebellar OR rolling L/R OR strong lateralization OR vert/changing nystagmus); other patterns emit DEFINITE.
- [ ] Vest-central + vest-paradoxical defer when (vert/changing nystagmus + cerebellar gait sign) — multifocal pattern 7 picture.
- [ ] Cerebellum POSSIBLE catchall (head tilt + cerebellarMotorSign) defers when ataxiaType cerebellar present.
- Expected gain: +6 tests (test 7, MF-somnolent+hypermetria+cerebellar ataxia, MF-cerebellar ataxia+consciousness, C9, cer+for+vest, vestibular ataxia with hypermetria).

### Awaiting Ronaldo input (Q4)
2 tests blocked:
- C17 — peripheral DEFINITE expected, also gets L7-S3 POSSIBLE (we kept as differential). Is deepPain absent enough to lock to peripheral and drop L7-S3 differential?
- C22 — medulla-caudal expected, peripheral fires alongside on bulbar CN signs (gag absent + tongue atrophy). When are these peripheral CN vs central caudal medulla?

### Open clinical questions for Ivana

1. **Multifocal tier discrimination (POSSIBLE / PROBABLE / DEFINITE)** — current rule fires DEFINITE only. Several tests want POSSIBLE (e.g. test 7) or PROBABLE; we can't produce those tiers without tier rules from Ivana. Estimated tests blocked: 5-8.
2. **`menaceAbsent` doctrine** — bilateral menace deficit can be cortical blindness (forebrain) or cerebellar (ipsilateral, both sides). Currently forebrain rule's cortical-blindness path requires PLR explicitly normal (Pass 4 fix); multifocal patterns 1/4 still treat menaceAbsent as forebrain trigger, causing false-positive multifocal in clear cerebellar pictures (tests 6, `6 cer. at.`).
3. **`peripheral normal agit`** — all-4-limb LMN exam findings + no gait abnormality. Localise to peripheral or don't localise?
4. **`mentation+cervical+seizures`** edge — moderate cervical pain + tetraparesis + seizures + somnolent. Already passing as multifocal, but pattern is brittle (depends on `umnTetraparesis` accepting undefined reflexes).

### Cross-pass technical observations (carried over from remarks)

- **`matches()` helper "undefined → return whatever 'normal' means"** is the single biggest source of false-positives across rules. Pattern: `matches(s, 'patellarReflexR', ['normal','increased'])` returns true when patellarReflexR is undefined. Multiple rules treated "not tested" as "preserved", firing UMN/preserved paths on tests that never tested those reflexes. Pass 3 + Pass 5 fixed C1-C5 path 1 + path 177 with explicit-test guards; same pattern likely needed in C6-T2, T3-L3, possibly other rules. Audit recommended.
- **Forebrain rule's contralateral-pattern path** can fire alongside other regions when CN signs (facial paresis, asymmetric postural) present — see test 6 forebrain extra and similar.
- **Cerebellum's redirect to vest-paradoxical** is now replaced by cerebellum POSSIBLE + vest-paradoxical's own DEFINITE path. Cleaner, but worth re-running existing tests if anything was depending on the old redirect emit.

### Cleanup of accumulated noise (catchall guards added in this pass set)

- Some POSSIBLE catchalls (e.g. C1-C5 ipsilateral both-limbs safety net) were over-eager. Pattern: gate by "any nystagmus" or "explicit spinal data tested" before firing speculative POSSIBLE.
- Other rules (T3-L3, L4-S3, L7-S3) likely have similar catchalls worth reviewing for explicit-test guards.

## Diagnoses upgrade — REWIRED 2026-05-04 ✅
`detectDiagnoses` rewired (one-line revert). 99/99 tests still pass. Diagnosis scoring runs per-loc with confidence tiers; smoke-tested on Forebrain R sample (Congenital Forebrain 160 LIKELY, Hydrocephalus 130 LIKELY, GME 60 POSSIBLE, etc.).

Remaining DDX nice-to-haves (none blockers):
- [ ] Update `diagnoses/multifocal.js` header comment — references the gone `multifocalRules.js` (now unified into `rules/multifocal.js`).
- [ ] **22 params referenced by diagnoses but missing from both models** (scores silently skip): `biteWoundSwelling`, `chemotherapyHistory`, `defecation`, `drooling`, `earDischarge`, `exerciseIntolerance`, `lacrimation`, `miosis`, `otoscopicAbnormality`, `painPattern`, `percussionDimpling`, `phantomScratching`, `recentNeurologicDrug`, `reproductiveStatus`, `salivation`, `selfMutilation`, `stiffnessWorseAtRest`, `tickDiscovery`, `toxinExposure`, `traumaHistory`, `urination`, `vestibularSigns`. Decide per-param: add to `diagnosesParameters.json` or strip from diagnoses. Ask Ivana.
- [ ] Brainstem shared pool per-loc tuning — 10 diagnoses applied identically to all 4 brainstem locs. `region` arg passed but unused inside score().
- [ ] Confidence thresholds in `ddxConfidence()` — DDX defaults (HIGHLY LIKELY > 200, LIKELY ≥ 100, POSSIBLE ≥ 50, LESS LIKELY ≥ 10, ESSENTIALLY EXCLUDED) may need re-tuning after real test runs.
- [ ] Peripheral pool (21 diagnoses) — smoke-test and prune zeros (largest pool, may have rule-out diagnoses always at score 0 under our params).

## Side-default review (Ivana 2026-04-30 migration)
- [ ] `definedTests.json` post-2026-04-30 migration: `circling` and `hypermetria` defaulted to `R`; `facialParesis` and `tongueAtrophy` defaulted to `["R"]`. Ivana to review tests where side matters and flip to L if appropriate.

## Parameters mapping to revisit
- [ ] Multifocal rule's "leaning" / "falling" — not yet in parametersModel. Currently `vestibularSigns(s)` uses head tilt, nystagmus, ataxiaType vestibular, rolling L/R. Decide if leaning/falling need explicit values in `bodyPosture`.

## Cleanup
- [ ] Remove unused `getParameterIfExists` in Localisation.js.
- [ ] Consider auditing all rules for `matches(undef, ['normal',...])` defaults (see Cross-pass observations) — Pass 3 + Pass 5 fixed this in C1-C5; same pattern likely lurks in C6-T2, T3-L3, possibly other rules.

## Done — recent

### 2026-05-04 — 5-pass fix run on Ivana's 99-test suite
- Pass 1 (G1+G5+G8+G9+G10) — forebrain-signs guards on cerebellum/vest-peripheral/vest-central/vest-paradoxical; multiple new DEFINITE paths; +7.
- Pass 2 (G2) — diencephalon defers to forebrain on circling/seizures/cortical-blindness; +3.
- Pass 4 (G6+G12) — multifocal pattern 5 (vest+strong-cerebellar) + pattern 6 (forebrain-strict+brainstem-CN); forebrain plrExplicitlyNormal; new DEFINITE for mentation/behavior+same-side menace+nasal; 4-limb LMN + bilateral facial paresis exclusions; umnTetraparesis relaxation; +1.
- Pass 3 (G4) — Schiff-Sherrington + paraplegia DEFINITE T3-L3; cauda equina cluster DEFINITE L7-S3; severe lumbar pain override L4-S3; lateralized hemiparesis DEFINITE C1-C5; C1-C5 catchall + ipsilateral both-limbs guards; +9.
- Pass 5 (G7) — multifocal pattern 3 tightened to seizures-only; medulla-caudal DEFINITE for gag+mental+4-limb posturals; medulla-rostral defers on seizures/behavior; pons DEFINITE for ipsilateral CN-VII+Horner+postural; C1-C5 PROBABLE-path explicit-test guard; +4.

### 2026-04-30 — Parameters model migration (Ivana)
- onset += `intermittent`; behavior `compulsive` → `compulsive / head pressing`; gait split L/R for circling/hypermetria + new generalised weakness, rolling L/R; bodyPosture += `neck ventroflexion`, removed pelvic palmigrade and thoracic plantigrade values; cranial nerves: removed facialSymmetry+facialAsymmetryLocation, new facialParesis multi-select L/R, new blindness yes/no; tongue: removed ventral/dorsal atrophy, new tongueAtrophy multi-select L/R; muscleAtrophy += generalized; muscleAtrophyLocation values changed to TR/TL/PR/PL multi-select; new "systemic signs" category: fecalIncontinence, urinaryIncontinence, femoralPulse.
- Cross-cutting refactor of rules + diagnoses + ddxHelpers.js for renamed/removed values.
- multifocal.js `vestibularSigns()` accepts `rolling L/R`.
- definedTests.json migrated; sides defaulted to R where original tests had no side info.

### 2026-04-22 / 04-23 — Multifocal rework + DDX rewrite
- Multifocal collapsed to single `multifocal` localisation key.
- Multifocal rules unified into `rules/multifocal.js`; old post-detection pass removed.
- DDX rewrite: 13 diagnosis files (~147 diagnoses), 19 localisation keys; `diagnosesParameters.json` for diagnosis-only params.
- TestResults app — single + run-all view; wired into Test/Tests apps.

## Notes
- Rule: `app.rules['<name>'] = { text, test: function(selected) }`.
- Diagnosis: `app.diagnoses['<loc>'] = [{ id, name, category, score(s, region), workup[] }]` — returns `{ score, flags[], alerts[] }`.
- Test: `{ name, parameters, result: { definite, probable, possible }, comment }`.

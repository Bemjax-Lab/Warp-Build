# DDX Engine — Summary for Localisation App Integration

This document describes the DDX differential diagnosis engine built in this repo, intended for the team working on the neurological localisation part of the app that will feed patient data into it.

---

## What the Engine Does

The engine takes a flat object of clinical parameters (`selected`) and a neuroanatomical region string (`location`), and returns a ranked list of differential diagnoses with confidence levels and flags.

```js
app.diagnoses.evaluate(selected, location)
// returns: { candidates: [...], alerts: [...] }
```

Each candidate has: `id`, `name`, `category`, `score` (0–250+ pts), `confidence`, `flags`, `workup`.

Confidence tiers:
- `HIGHLY LIKELY` > 200 pts
- `LIKELY` ≥ 100 pts
- `POSSIBLE` ≥ 50 pts
- `LESS LIKELY` ≥ 10 pts
- `ESSENTIALLY EXCLUDED` < 10 pts

---

## Scope: Dogs Only

The engine is built for **canine** neurology only. Cat is accepted as a species value but scoring was not designed for feline conditions. Passing `species: 'cat'` will run dog-logic on a cat — results are not reliable.

---

## Regions (12 total)

The `location` string must be one of these exact values:

| Value | Description |
|---|---|
| `C1-C5` | Cervical — upper (atlas to C5) |
| `C6-T2` | Cervical — lower / cervicothoracic |
| `T3-L3` | Thoracolumbar spinal cord |
| `L4-S3` | Lumbar spinal cord (intumescence) |
| `L7-S3` | Lumbosacral / cauda equina |
| `Forebrain` | Cerebrum, thalamus, hypothalamus |
| `Brainstem` | Midbrain, pons, medulla |
| `Cerebellum` | Cerebellar cortex / white matter |
| `Vestibular` | Peripheral vestibular (CN VIII, inner ear) |
| `CentralVestibular` | Central vestibular (brainstem vestibular nuclei) |
| `ParadoxicalVestibular` | Cerebellar vestibular (flocculonodular lobe) |
| `Peripheral` | LMN / neuromuscular junction / muscle |

**The localisation app is responsible for determining which of these 12 values to pass.** The DDX engine does not localise — it only scores differentials for the region it receives.

---

## Parameter Object — Complete Reference

The `selected` object passed to `evaluate()` must use these **exact parameter names and values**. Names and values are case-sensitive.

### Patient

| Parameter | Type | Values |
|---|---|---|
| `species` | string | `'dog'` \| `'cat'` |
| `age` | number | decimal years (e.g. `0.5`, `5`, `12`) |
| `breed` | string | see breed list below |
| `reproductiveStatus` | string | `'intact'` \| `'neutered'` \| `''` |

### History

| Parameter | Type | Values |
|---|---|---|
| `onset` | string | `'peracute'` \| `'acute'` \| `'chronic'` |
| `duration` | number | days (integer) |
| `progression` | string | `'improving'` \| `'stable'` \| `'worsening'` |
| `traumaHistory` | string | `'yes'` \| `'no'` |
| `toxinExposure` | string | `'yes'` \| `'no'` |
| `recentBreeding` | string | `'yes'` \| `'no'` |
| `recentDrug` | string | `'none'` \| `'metronidazole'` \| `'aminoglycoside'` \| `'cisplatin'` |

> **Note on onset + duration:** The engine internally maps onset/duration to: `peracute` / `acute` / `subacute` (acute + duration 3–14d) / `chronic`. So for acute onset, duration in days matters.

### Gait & Ambulation

| Parameter | Type | Values |
|---|---|---|
| `gait` | string | `'normal'` \| `'ataxia'` \| `'paraparesis'` \| `'paraplegia'` \| `'tetraparesis'` \| `'tetraplegia'` \| `'hemiparesis left-sided'` \| `'hemiparesis right-sided'` \| `'monoparesis RT'` \| `'monoparesis LT'` |
| `ambulation` | string | `'ambulatory'` \| `'non ambulatory'` |
| `asymmetry` | string | `'L worst then R'` \| `'R worse then L'` \| `''` |
| `ataxiaType` | string | `'none'` \| `'cerebellar'` \| `'spinal'` \| `'vestibular'` \| `'general'` |
| `bodyPosture` | string | `'normal'` \| `'decerebrate rigidity'` \| `'plantigrade pelvic'` \| `'plantigrade thoracic'` \| `'kyphosis'` |
| `tailPosture` | string | `'normal'` \| `'flaccid'` |

### Pain

| Parameter | Type | Values |
|---|---|---|
| `spinalPain` | string | `'none'` \| `'cervical'` \| `'thoracolumbar'` \| `'lumbar'` \| `'lumbosacral'` |
| `painGrade` | string | `'mild'` \| `'moderate'` \| `'severe'` |
| `painProgression` | string | `'persistent'` \| `'disappeared within 24/48 h'` \| `''` |
| `painPattern` | string | `'constant'` \| `'intermittent'` \| `'positional'` \| `''` |
| `deepPain` | string | `'preserved'` \| `'absent'` |

### Mentation & Behaviour

| Parameter | Type | Values |
|---|---|---|
| `mentalStatus` | string | `'normal'` \| `'dull'` \| `'obtunded'` \| `'stupor'` \| `'coma'` |
| `behavior` | string | `'normal'` \| `'circling'` |
| `paroxysmalEvents` | string | `'yes'` \| `'no'` |
| `epilepticSeizures` | string | `'yes'` \| `'no'` |

### Neuro Signs

| Parameter | Type | Values |
|---|---|---|
| `nystagmus` | string | `'none'` \| `'horizontal'` \| `'rotary'` \| `'vertical'` \| `'changing'` |
| `headPosture` | string | `'normal'` \| `'head tilt'` \| `'head turn'` \| `'low head carriage'` |
| `headTremor` | string | `'yes'` \| `'no'` |
| `dysmetria` | string | `'yes'` \| `'no'` |
| `phantomScratching` | string | `'yes'` \| `'no'` |
| `hornerSyndrome` | string | `'no'` \| `'unilateral'` |
| `facialSymmetry` | string | `'normal'` \| `'asymmetric'` |
| `gagReflex` | string | `'normal'` \| `'decreased'` \| `'absent'` |
| `menaceResponseL` | string | `'normal'` \| `'absent'` |
| `menaceResponseR` | string | `'normal'` \| `'absent'` |
| `otitis` | string | `'yes'` \| `'no'` |
| `fever` | string | `'yes'` \| `'no'` |

### Spinal Reflexes

| Parameter | Type | Values |
|---|---|---|
| `patellarReflexL` | string | `'normal'` \| `'increased'` \| `'decreased'` \| `'absent'` |
| `patellarReflexR` | string | `'normal'` \| `'increased'` \| `'decreased'` \| `'absent'` |
| `withdrawalPelvicL` | string | `'normal'` \| `'decreased'` \| `'absent'` |
| `withdrawalPelvicR` | string | `'normal'` \| `'decreased'` \| `'absent'` |
| `withdrawalThoracicL` | string | `'normal'` \| `'decreased'` \| `'absent'` |
| `withdrawalThoracicR` | string | `'normal'` \| `'decreased'` \| `'absent'` |
| `perinealReflexL` | string | `'normal'` \| `'decreased'` \| `'absent'` |
| `perinealReflexR` | string | `'normal'` \| `'decreased'` \| `'absent'` |
| `extensorTonePelvicL` | string | `'normal'` \| `'increased'` |
| `extensorTonePelvicR` | string | `'normal'` \| `'increased'` |
| `cutaneusTrunciLevelL` | string | `'normal'` \| `'T2'`–`'T13'` \| `'L1'`–`'L3'` |
| `cutaneusTrunciLevelR` | string | `'normal'` \| `'T2'`–`'T13'` \| `'L1'`–`'L3'` |

### Systemic Signs

| Parameter | Type | Values |
|---|---|---|
| `lethargy` | string | `'yes'` \| `'no'` |
| `anorexia` | string | `'yes'` \| `'no'` |
| `vomiting` | string | `'yes'` \| `'no'` |
| `weightLoss` | string | `'yes'` \| `'no'` |
| `polydipsiaPolyuria` | string | `'yes'` \| `'no'` |
| `regurgitation` | string | `'yes'` \| `'no'` |

---

## Parameters in the Model NOT Yet Used by the Engine

These exist in `parametersModel.json` but are not currently referenced in any scoring function. The localisation app should collect them anyway — they may be used in future scoring updates.

- `consciousnessLevel` — model has this; engine uses `mentalStatus` (same concept, different name — **use `mentalStatus`**)
- `ataxiaDistribution` — all four limbs / only pelvic limbs
- `pupilSizeL` / `pupilSizeR`
- `directPlrL` / `directPlrR` / `consensualPlrL` / `consensualPlrR`
- `oculocephalicReflexL` / `oculocephalicReflexR`
- `nystagmusL` / `nystagmusR` (model splits by eye; engine uses single `nystagmus` field)
- `positionalNystagmusL` / `positionalNystagmusR`
- `positionalStrabismusL` / `positionalStrabismusR`
- `nasalSensationL` / `nasalSensationR`
- `masticatoryMusclesL` / `masticatoryMusclesR`
- `facialAsymmetryLocation`
- `palpebralReflexL` / `palpebralReflexR` / `palpebralClosureL` / `palpebralClosureR`
- `tongue`
- `thoracicRight` / `thoracicLeft` / `pelvicRight` / `pelvicLeft` (postural reactions)
- `patellarPosition`
- `extensorToneThoracicL` / `extensorToneThoracicR`
- `consciousnessDuringEpisodes` / `seizureFrequency` / `clusterOrStatusEpilepticus` / `seizureType`
- `paroxysmalDyskinesia` / `paroxysmalVestibularAtaxia`
- `scoliosis`, `torticollis` — not yet in model or engine (pending)

---

## Parameters Missing from the Model (Used by Engine, Need Adding)

These 7 parameters are used in scoring but not defined in `parametersModel.json`. Ivana needs to add them to the model so the localisation app can include them in its form.

| Parameter | Used for |
|---|---|
| `anorexia` | systemic scoring (general) |
| `hornerSyndrome` | C6-T2 region scoring |
| `lethargy` | systemic scoring, Vestibular |
| `otitis` | Vestibular / CentralVestibular |
| `recentDrug` | Vestibular (ototoxic drugs) |
| `vomiting` | Vestibular, systemic scoring |
| `weightLoss` | systemic scoring (general) |

---

## Important Parameter Name Notes

The model and scoring engine had some name mismatches that have been resolved. These are the **correct names to use** (old names are dead):

| Use this | Not this |
|---|---|
| `menaceResponseL` / `menaceResponseR` | `menaceL` / `menaceR` |
| `headPosture` | `headTilt` |
| `behavior` | `circling` |
| `tailPosture` | `tailTone` |
| `epilepticSeizures` | `seizures` |
| `facialSymmetry` | `facialParesis` |
| `bodyPosture` | `rigidHyperextension` |
| `mentalStatus` | `consciousnessLevel` |

---

## Breed List (Engine-Recognised)

These breeds have specific predisposition logic. Any breed not in this list is treated as `mixed/unknown` — which is fine, the engine still scores based on other parameters.

Airedale Terrier, American Eskimo Dog, Australian Shepherd, Basset Hound, Beagle, Belgian Malinois, Bernese Mountain Dog, Bichon Frise, Border Collie, Boston Terrier, Boxer, Bulldog, Cardigan Welsh Corgi, Cavalier King Charles Spaniel, Chesapeake Bay Retriever, Chihuahua, Cocker Spaniel, Dachshund, Dalmatian, Doberman Pinscher, French Bulldog, German Shepherd, Golden Retriever, Great Dane, Irish Setter, Irish Wolfhound, Keeshond, Kerry Blue Terrier, Labrador Retriever, Leonberger, Lhasa Apso, Maltese, Mastiff, Miniature Pinscher, Miniature Poodle, Miniature Schnauzer, Newfoundland, Nova Scotia Duck Tolling Retriever, Papillon, Pekingese, Pembroke Welsh Corgi, Pomeranian, Pug, Rhodesian Ridgeback, Rottweiler, Saint Bernard, Shetland Sheepdog, Shih Tzu, Siberian Husky, Soft Coated Wheaten Terrier, Standard Poodle, Toy Poodle, Vizsla, Weimaraner, Wire Fox Terrier, Yorkshire Terrier

---

## Disease Count by Region

| Region | Diseases |
|---|---|
| C1-C5 | 12 |
| C6-T2 | 7 |
| T3-L3 | 11 |
| L4-S3 | ~8 |
| L7-S3 | ~5 |
| Forebrain | 7 |
| Brainstem | ~5 |
| Cerebellum | 8 |
| Vestibular (Peripheral) | 4 |
| CentralVestibular | 8 |
| ParadoxicalVestibular | 7 |
| Peripheral (LMN/NMJ/Muscle) | 8 |
| **Total** | **~90** |

---

## How to Call the Engine

```js
const selected = {
  species: 'dog',
  age: 5,
  breed: 'Labrador Retriever',
  reproductiveStatus: 'neutered',
  onset: 'acute',
  duration: 2,
  progression: 'worsening',
  gait: 'paraparesis',
  ambulation: 'ambulatory',
  spinalPain: 'thoracolumbar',
  painGrade: 'moderate',
  // ... all other collected params
};

const location = 'T3-L3'; // from localisation engine

const result = app.diagnoses.evaluate(selected, location);
// result.candidates — sorted array of differentials
// result.alerts — critical/urgent/info alerts
```

Missing parameters default to `undefined` — the engine handles missing values gracefully (most checks are `=== 'yes'` or specific string matches, so `undefined` simply doesn't trigger them).

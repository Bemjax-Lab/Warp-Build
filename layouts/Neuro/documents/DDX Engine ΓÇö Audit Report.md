# DDX Engine — Full Audit Report
*Comparison of engine source code against knowledge base reference files*
*Date: April 2026*

---

## HOW TO READ THIS DOCUMENT

Each region was compared against its knowledge base reference file. Findings are grouped as:
- **Missing diseases** — in KB but not in engine
- **Scoring issues** — disease present but logic wrong
- **Extra diseases** — in engine but not in KB (usually legitimate additions)

At the end there is a **consolidated priority list** for decision-making.

---

## CROSS-CUTTING ISSUES
*These appear across multiple regions and need a policy decision before individual fixes.*

| Issue | Regions affected |
|---|---|
| SRMA missing | C6-T2, T3-L3 (present only in C1-C5) |
| Spinal cord hemorrhage missing | C1-C5, C6-T2, T3-L3, L4-S3 |
| Rickettsia / Brazilian Spotted Fever inconsistent | Missing from most regions; provisional only in T3-L3 |
| Ehrlichia missing | C1-C5, C6-T2, L4-S3, L7-S3, Forebrain |
| GME missing from spinal regions | C6-T2, T3-L3, L4-S3 |
| CDV missing from Cerebellum | Only present in Brainstem |
| Protozoal (Toxo/Neospora) inconsistent | In ParadoxicalVestibular but not main Cerebellum |
| Head trauma missing from Brainstem | Exists in Vestibular but not Brainstem |

---

## C1-C5

### Missing diseases
- Spinal cord hemorrhage (vascular emergency; requires coagulation workup)
- Rickettsia rickettsii (Brazilian Spotted Fever) — mimics SRMA exactly; giving corticosteroids instead of doxycycline can be fatal
- Ehrlichia canis meningomyelitis
- GME — cervical localization
- Toxoplasma / Neospora cervical myelitis
- Canine Distemper (CDV) — cervical involvement
- Leishmaniasis — cervical (relevant in Brazil and Mediterranean)

### Scoring issues
- **CLM/SM**: normal gait (pain-only) was scoring too high (D=25 → fixed to D=10); acute onset in non-CKCS now penalized ×0.4
- **SAD (Arachnoid Diverticulum)**: no breed penalty for non-large breeds → French Bulldog was scoring inappropriately high; fixed with ×0.3 for non-large/non-Rottweiler
- **SRMA**: no age penalty for dogs >4y → fixed with ×0.25 for age >4
- **Meningomyelitis**: pain-only presentation (no gait deficit) scored zero in D category; added D=15 for normal gait

### Note
FCEM and ANNPE are intentionally kept as one entry — clinically indistinguishable before imaging. The distinction is an MRI diagnosis.

---

## C6-T2

### Missing diseases
- SRMA — same critical gap as C1-C5 (young dog, severe pain, fever, minimal deficits)
- Spinal cord hemorrhage
- Rickettsia, Ehrlichia
- GME — cervicothoracic localization
- Arachnoid diverticulum
- Meningioma and primary spinal cord tumor as separate entries (currently lumped into Meningomyelitis)
- Vertebral tumor / lymphoma

### Scoring issues
- No issues identified beyond the missing diseases above

---

## T3-L3

### Missing diseases
- SRMA
- Spinal cord hemorrhage
- Ehrlichia
- GME
- Necrotizing myelitis (Pug, French Bulldog, Chihuahua, Yorkshire Terrier)

### Scoring issues
- **DM**: engine awards points from age 5+; KB says DM is rare before 7-8y
- **DM**: pain should near-absolutely exclude DM (KB: "PAIN EXCLUDES DM" — in capitals); engine only penalizes ×0.2; should be ×0.05 or lower
- **T2-T10 subregion alert**: engine correctly flags that IVDD is uncommon between T2-T10 due to intercapital ligament — good addition not in KB

---

## L4-S3

### Missing diseases
- SRMA (less common at this level but still relevant)
- Spinal cord hemorrhage
- Ehrlichia, GME

### Critical safety gap
- **Progressive Myelomalacia (PMM) alert is missing** — A dog with acute IVDD + absent deep pain + ascending cutaneous trunci cutoff level needs an urgent alert. KB explicitly flags PMM as requiring immediate euthanasia discussion. Engine has no mechanism for this at L4-S3.

### Scoring issues
- None identified beyond the above

---

## L7-S3

### Missing diseases — CRITICAL
- **IVDD Type I and II at L7-S1 are completely missing** — A Dachshund with acute lumbosacral disc extrusion has nothing to score against. L7-S1 is a real IVDD location (less common than thoracolumbar but not rare). This is the most significant gap in this region.
- **Polyradiculoneuritis (Coonhound paralysis)** — ascending LMN weakness, vaccine or raccoon contact history; prognosis completely different from cauda equina compression (most recover without surgery)
- Rickettsia, Ehrlichia (rank 2-3 in Brazil)

### Scoring issues
- **DLSS**: correctly ranked highest; pain-only ambulatory presentation correctly scores highest — good
- **Discospondylitis at L7-S1**: engine correctly flags this as the most common discospondylitis site — good
- **Non-ambulatory cauda equina**: correctly flagged as atypical and redirected to L4-S3 — good

---

## FOREBRAIN

### Missing diseases
**Vascular:**
- Intracranial hemorrhage (distinct from ischemic stroke; hemangiosarcoma is most common cause in dogs; requires coagulation workup)

**Infectious (14 missing):**
- Rickettsia rickettsii — critical safety issue (see C1-C5 note)
- Ehrlichia canis encephalitis
- CDV encephalitis — myoclonus is pathognomonic, completely absent from engine
- Bacterial meningoencephalitis
- Fungal encephalitis (Cryptococcus, Aspergillus, Histoplasma)
- Toxoplasma / Neospora encephalitis
- Leptospirosis — neurological involvement
- Leishmaniasis — CNS involvement
- Chagas disease — acute phase meningoencephalitis
- Rabies

**Metabolic (missing entirely):**
- **Hepatic encephalopathy** — KB ranks this 1-2 for young dogs with portosystemic shunts; post-prandial worsening is pathognomonic; completely absent from engine
- **Hypoglycemia** — KB states: "ALWAYS MEASURE BLOOD GLUCOSE IN ANY DOG WITH EPISODIC NEUROLOGICAL SIGNS BEFORE ADVANCED DIAGNOSTICS"
- Hypertensive encephalopathy — KB states: "BLOOD PRESSURE MUST BE MEASURED IN EVERY DOG WITH ACUTE FOREBRAIN SIGNS"
- Uremic encephalopathy
- Electrolyte disturbances (hyponatremia, hypocalcemia)

**Traumatic:**
- Traumatic brain injury

**Neoplastic:**
- Glioma and Meningioma as separate entries (currently combined) — different breed predispositions, different MRI appearance, different prognosis
- Metastatic brain tumor (hemangiosarcoma most common in dogs)
- Pituitary macroadenoma

**Developmental:**
- Lissencephaly / cortical dysplasia

### Scoring issues
- **CDS (Cognitive Dysfunction Syndrome)**:
  - Engine allows scoring from age 7+; KB explicitly states "DO NOT diagnose in dogs under 10 years"
  - Seizures penalized only ×0.4; KB states "CDS DOES NOT CAUSE SEIZURES" — should be near-absolute exclusion (×0.05)
  - Focal neurological deficits (asymmetric postural reactions, menace deficit) should exclude CDS but engine does not check for these
  - KB calls CDS "the most overdiagnosed condition in veterinary neurology" — engine's current scoring facilitates overdiagnosis
- **Forebrain tumor**: Glioma (Boxer, French Bulldog, Boston Terrier) and Meningioma (Golden, Labrador, dolichocephalic breeds) have distinct breed predispositions; combined entry cannot differentiate
- **GME**: Pug and West Highland White Terrier missing from breed list; Beagle and Cocker Spaniel in engine not listed in KB
- **Idiopathic epilepsy**: Abnormal interictal neurological examination should near-exclude idiopathic epilepsy; engine has no hard exclusion for this

---

## BRAINSTEM

### Missing diseases
- **Head trauma** — if a patient has trauma history, engine has no trauma-specific disease; user would have to score inappropriately against stroke or tumor
- **Regional stroke specificity** — engine has one generic "Ischemic Stroke — Brainstem" but KB differentiates four distinct presentations:
  - Midbrain: fixed mydriasis, absent PLR ipsilateral
  - Pons: CN V deficits (decreased palpebral reflex, facial sensation)
  - Rostral medulla: central vestibular signs + CN V/VI/VII
  - Caudal medulla: dysphagia, absent gag reflex, tongue deviation — completely absent from engine
- Extraaxial tumors — meningioma at cerebellopontine angle and foramen magnum (surgically resectable; different prognosis from intraparenchymal glioma)
- Listeria meningoencephalitis (specific risk factors: farm, raw food; asymmetric CN IX/X/XII)

### Scoring issues
- Thiamine deficiency is in engine but not in KB — it's a legitimate real disease, KB omission rather than engine error
- Generic stroke cannot differentiate localization within brainstem based on cranial nerve signs

---

## CEREBELLUM

### Missing diseases
- **Cerebellar hemorrhage** — distinct from ischemic stroke; requires coagulation profile, platelet count; completely absent
- **Necrotizing encephalitis (NME/NLE) with cerebellar involvement** — Pug, French Bulldog, Chihuahua, Yorkshire Terrier; rapid progression, poor prognosis
- **Fungal meningoencephalitis** — requires antifungal treatment; absent
- **CDV — cerebellar** — myoclonus is pathognomonic for CDV; currently only in Brainstem.js
- **Protozoal (Neospora/Toxo)** — only in ParadoxicalVestibular.js, not main Cerebellum.js

### Scoring issues
- **CCA breed list discrepancy**: Engine has Kerry Blue Terrier, Border Collie, Miniature Poodle; KB has Airedale Terrier, Coton de Tulear, American Staffordshire Terrier. Overlap: Beagle, Gordon Setter, Rough Collie, Labrador Retriever
- **Cerebellar stroke**: missing Greyhound and CKCS from breed predispositions
- **White Dog Shaker Syndrome**: in engine but not in KB — legitimate addition, not an error

---

## VESTIBULAR (Peripheral)

### Missing diseases
- Middle ear / petrous temporal bone malignancy (ceruminous gland adenocarcinoma, SCC, OSA) — important in older dogs with chronic progressive peripheral vestibular signs + facial nerve palsy

### Scoring issues
- **Otitis media-interna**: CN VII palsy scored without checking laterality — ipsilateral facial palsy supports otitis, contralateral argues against it; engine rewards both equally
- **Idiopathic vestibular**: 72-hour improvement is a key diagnostic feature per KB; not scoreable in current model
- **Ototoxicity**: chlorhexidine ear cleaning (with ruptured tympanic membrane) missing as ototoxic trigger — engine only checks aminoglycosides and cisplatin

---

## CENTRAL VESTIBULAR

### Missing diseases
- Cerebellar hypoplasia
- Cerebellar abiotrophy (progressive, breed-specific)
- Dandy-Walker-like malformation

### Scoring issues (all fixed in recent session)
- Metronidazole toxicity: diazepam protocol corrected (0.43 mg/kg q8h × 3 days; Evans et al. 2003)
- Temporal scoring corrected (subacute highest, not peracute)
- cv-toxic entry added for central vestibular localization

---

## PARADOXICAL VESTIBULAR

### Missing diseases
- Dandy-Walker-like malformation

### Notes
- KB groups paradoxical vestibular under cerebellum; engine separates it as distinct region — this is a design decision, not an error
- CDV and Neospora are in ParadoxicalVestibular.js but not main Cerebellum.js — should be in both

---

## PERIPHERAL

*Most incomplete region in the engine — 8 diseases in engine vs 30+ in KB*

### Missing diseases

**Focal neuropathies (trauma):**
- Brachial plexus avulsion — peracute unilateral thoracic limb monoplegia; loss of superficial pain = grave prognosis; self-mutilation risk
- Radial nerve injury — knuckling, loss of elbow/carpal extension
- Sciatic nerve injury — dropped hock, withdrawal reflex decreased; patellar reflex INTACT (differentiates from femoral)
- Femoral nerve injury — ABSENT patellar reflex; rapid quadriceps atrophy
- Peroneal nerve injury — loss of hock flexion, paw knuckling

**Tumors:**
- Peripheral nerve sheath tumor (PNST) — "root signature" (chronic progressive monoparesis with atrophy in one limb)

**Cranial nerve / focal:**
- Idiopathic facial nerve paralysis (Cocker Spaniel, Corgi, Boxer predisposed)
- Idiopathic trigeminal neuropathy — acute bilateral dropped jaw, cannot close mouth; excellent prognosis (2-4 weeks recovery)
- Laryngeal paralysis / GOLPP — older Labrador, inspiratory stridor, voice change, exercise intolerance

**Inflammatory:**
- Masticatory muscle myositis (MMM) — trismus, 2M antibody diagnostic; German Shepherd, Golden, Labrador predisposed
- CIDP (Chronic Inflammatory Demyelinating Polyradiculoneuropathy)
- Protozoal polyradiculoneuritis (Neospora — young dogs, pelvic limb rigidity)
- Infectious polymyositis

**Motor neuron disease:**
- Hereditary motor neuronopathy — fasciculations are pathognomonic; NO sensory deficits; Brittany Spaniel, Rottweiler, Boxer; completely missing from engine

**NMJ:**
- Congenital myasthenia gravis (separate from acquired; negative AChR antibody; Springer Spaniel, Smooth Fox Terrier)

**Myopathies (all missing):**
- Muscular dystrophy (Golden Retriever males; markedly elevated CK)
- Hereditary myopathy (Labrador centronuclear myopathy, Bouvier)
- Myotonia — stiffness worse at rest, improves with exercise; percussion dimpling pathognomonic
- Hyperadrenocorticism myopathy — CK normal or mildly elevated
- Hypothyroid myopathy
- Paraneoplastic myopathy and polyneuropathy
- Hypoglycemic neuropathy (insulinoma — chronic recurrent hypoglycemia)

**Toxic:**
- Organophosphate / carbamate toxicity — intermediate syndrome (respiratory weakness 1-4 days post-exposure)
- Vincristine neuropathy

### Scoring issues in existing diseases
- **APR (polyradiculoneuritis)**: engine states painless; KB says hyperesthesia is common EARLY — clinically important for early presentations
- **Botulism**: autonomic signs (mydriasis, decreased PLR) are the key differentiator from APR per KB; not scored in engine at all
- **Polymyositis**: muscle pain on palpation is "the key feature" per KB; not scored in engine at all
- **MG**: megaesophagus prevalence stated as 40% in engine; KB says 85-90% for generalized form; fatigability not explicitly scored
- **Tick paralysis**: tick discovery should be an explicit scoring criterion per KB; currently only mentioned in workup
- **Diabetic neuropathy**: breed predispositions listed are for diabetes, not for diabetic neuropathy — any breed with diabetes can develop this
- **Inherited polyneuropathy**: German Shepherd missing from breed list; Cavalier and Great Dane added by engine but not in KB

---

## CONSOLIDATED PRIORITY LIST

### TIER 1 — Safety-critical
*Wrong management based on engine output could directly harm the patient*

1. **Rickettsia warning on SRMA** — corticosteroids before doxycycline can be fatal (C1-C5, C6-T2, T3-L3, Forebrain)
2. **Progressive Myelomalacia alert at L4-S3** — ascending cutaneous trunci cutoff needs urgent euthanasia discussion
3. **CDS scoring too permissive** — allows diagnosis before age 10; seizures insufficiently penalized; focal deficits don't exclude it
4. **Hepatic encephalopathy missing from Forebrain** — rank 1-2 for young dogs with portosystemic shunts
5. **Hypoglycemia missing from Forebrain** — KB says measure glucose before any advanced diagnostics in episodic presentations

### TIER 2 — High clinical impact
*Common presentations with no or wrong DDX entry*

6. **IVDD at L7-S3 missing** — Dachshund with acute L7-S1 extrusion has nothing to score against
7. **Polyradiculoneuritis at L7-S3 missing** — distinct prognosis from cauda equina compression
8. **SRMA at C6-T2 and T3-L3** — young dog with severe pain, fever, minimal deficits goes unranked
9. **Head trauma in Brainstem** — no trauma disease available if patient has known trauma history
10. **Idiopathic trigeminal neuropathy** — acute dropped jaw, excellent prognosis; common presentation completely absent
11. **Idiopathic facial paralysis** — common, distinct from otitis-associated
12. **Cerebellar hemorrhage** — distinct from stroke; requires coagulation workup
13. **DM pain exclusion** — should be near-absolute; currently only ×0.2 penalty
14. **Botulism — autonomic signs** — mydriasis/decreased PLR is the differentiator from APR; not scored

### TIER 3 — Moderate impact
*Missing diseases, less common or specific to certain populations*

15. Spinal cord hemorrhage across spinal regions
16. Peripheral focal neuropathies (brachial, radial, sciatic, femoral, peroneal)
17. Laryngeal paralysis / GOLPP
18. Glioma vs Meningioma split in Forebrain
19. Brainstem caudal medullary diseases (absent gag, tongue deviation, dysphagia)
20. Extraaxial brainstem tumors (meningioma — surgically resectable)
21. CDV in Cerebellum (myoclonus)
22. Necrotizing myelitis at T3-L3 (Pug, French Bulldog)
23. GME at spinal regions
24. Polymyositis — muscle pain scoring
25. MG — megaesophagus prevalence correction, fatigability scoring
26. Forebrain tumor breed predisposition split

### TIER 4 — Low priority / supplementary
*Rare, regional, or minor scoring refinements*

27. Rickettsia/Ehrlichia/Leishmania for non-Brazil/non-endemic regions
28. Dandy-Walker malformation
29. Storage diseases (lysosomal)
30. CCA breed list corrections
31. Cerebellar stroke — add Greyhound and CKCS breed predispositions
32. Diabetic neuropathy — breed predisposition clarification
33. Inherited polyneuropathy breed list corrections
34. Tick paralysis — add tick discovery as explicit scoring criterion
35. Hereditary motor neuronopathy
36. Congenital MG
37. Myopathies (dystrophy, myotonia, hyperadrenocorticism, hypothyroid)

---

## QUESTIONS FOR COLLEAGUE DISCUSSION

1. **Rickettsia/Brazil-specific diseases** — Is our user base predominantly in Brazil or are we building a global tool? This changes whether Rickettsia should be Tier 1 or Tier 4.

2. **Peripheral region scope** — The peripheral region currently covers polyneuropathies and NMJ diseases. Should it also cover focal neuropathies (brachial, radial, sciatic) and myopathies? That is a significantly different clinical presentation requiring different parameters.

3. **Brainstem regional specificity** — Should we keep one "Brainstem Stroke" entry or split into four regional entries (midbrain, pons, rostral medulla, caudal medulla)? Splitting requires the app to collect CN-specific findings (PLR, gag reflex, tongue) which it currently does not score.

4. **Forebrain metabolic diseases** — Hepatic encephalopathy and hypoglycemia require blood glucose and liver function data. Are these in scope before imaging, or should they be handled as pre-neurological workup outside the app?

5. **CDS scoring** — How strictly do we want to implement the KB's "do not diagnose under 10 years" rule? Should seizures hard-exclude CDS?

6. **GME vs IMME** — We already merged GME/NME/NLE into one IMME entry in Central Vestibular. Should we do the same in Forebrain and spinal regions for consistency?

---

*Report generated from automated comparison of engine source files against knowledge base reference documents.*
*Engine version: April 2026. Knowledge base: neuroApp-knowledge base/DDX/*

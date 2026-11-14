# Startup Buildathon India 2026 — Application Draft for Stimulx

Apply at: https://hack2skill.com/event/startupbuildathon2026/registration
(needs a Hack2skill login; the form itself is behind that login, so the headings
below follow what the programme says it asks for: idea, solution, architecture,
pitch deck, plus the five judging criteria.)

Anything in [SQUARE BRACKETS] is something only you know. Do not submit with
brackets left in. Nothing below claims users, pilots or revenue, because the
repository shows none. Add real ones if you have them.

---

## 1. One-line pitch (under 150 characters)

Stimulx: an AI research copilot that lets Indian behavioural scientists design,
run and analyse studies in 22 languages, without code.

## 2. Problem

Running a behavioural or mental-health study in India takes months before a
single participant is tested:

- Experiment software (Gorilla, Qualtrics, Inquisit) is priced in USD/GBP per
  seat or per participant, out of reach for most Indian departments and
  student researchers.
- Those tools host data abroad, which complicates ethics approval under the
  DPDP Act 2023 and ICMR 2017 guidelines.
- Free tools (PsychoPy, jsPsych) need programming skills most psychology
  scholars do not have.
- Validated scales and consent forms rarely exist in the participant's own
  language, so studies default to English-speaking urban samples and the
  resulting science does not represent India.
- Ethics (IEC) paperwork, grant budgets and data cleaning are done by hand.

## 3. Solution

Stimulx is one workspace for the whole research lifecycle: idea → grant →
ethics → design → recruitment → experiment → analysis → manuscript.

**What exists today (working front-end prototype, ~16,000 lines of
TypeScript, in this repo):**

- Visual experiment tree builder (consent → questionnaire → task → branch →
  debrief)
- No-code task builder with spreadsheet-driven trials, and a participant
  runner with reaction-time capture
- Questionnaire builder with auto-scored clinical scales (PHQ-9, GAD-7,
  DASS-21, WHO-DAS 2.0, PSS-10)
- IEC/ethics application builder, grant budget calculator, pre-registration
  studio, stepped-care RCT studio
- Data hub with long-format CSV, R script and APA table export

**What we will build at the Buildathon (the new AI product): Stimulx Copilot**

1. **Describe-to-experiment.** A researcher types or speaks "a Tamil–English
   Stroop with 96 trials and a PHQ-9 beforehand"; Gemini returns a complete
   experiment tree, trial spreadsheet and scoring rules in Stimulx's existing
   JSON schema, ready to run.
2. **Indic translation with back-translation check.** Gemini translates
   consent forms and scale items into Indian languages, back-translates, and
   flags items whose meaning drifted, for a human expert to approve. This is
   the slowest manual step in cross-cultural research.
3. **Ethics drafting.** Gemini drafts the IEC application and participant
   information sheet from the study design, grounded in ICMR 2017 and DPDP
   2023 text.
4. **Voice administration.** Gemini Live reads questionnaires aloud and
   records spoken answers, so participants with low literacy can take part.
5. **Analysis explainer.** Gemini turns the cleaned dataset into a plain
   language results summary and a draft Methods section.

Clinical scoring stays deterministic code, never a model output; every
AI-drafted document is reviewed by the researcher before use.

## 4. Use of Google AI and Google Cloud

| Need | Google product |
|---|---|
| Experiment generation, ethics and methods drafting (structured JSON output) | Gemini via Vertex AI |
| Translation and back-translation of scales and consent | Gemini |
| Spoken questionnaires for low-literacy participants | Gemini Live |
| On-device / offline option for sensitive clinical data | Gemma |
| Prototyping prompts and schemas | Google AI Studio |
| App hosting | Cloud Run, Mumbai region (asia-south1) |
| Study and response data, India residency | Cloud SQL (PostgreSQL) or Firestore, asia-south1 |
| Auth | Firebase Authentication |
| Stimuli and exports | Cloud Storage, asia-south1 |

## 5. Technical architecture

```
Researcher browser (Next.js 15, TypeScript, Tailwind)
        │
        ▼
Cloud Run API (asia-south1) ── Firebase Auth
        │
        ├── Vertex AI: Gemini  → experiment JSON, translations, ethics drafts
        ├── Gemini Live        → voice questionnaire sessions
        ├── Cloud SQL          → studies, trees, tokenised participant IDs
        │                        (identity kept in a separate table from responses)
        └── Cloud Storage      → stimuli, exports

Participant browser / phone → static runner → trial data → Cloud Run → Cloud SQL
```

Current state, stated plainly: the prototype is a static front end that stores
data in the browser. There is no backend, database or AI call yet. The
Buildathon is where the Google Cloud backend and the Gemini features get built.

## 6. Market and business model

- **Users:** psychology, cognitive science, psychiatry, public health and
  behavioural economics researchers and students at Indian universities and
  hospitals; later, other low- and middle-income countries with the same
  cost and language barriers.
- **Free tier:** students and unfunded academic studies.
- **Paid:** institutional licences for departments and hospitals; per-study
  pricing for funded grants (budgetable under DST/ICSSR/ICMR); commercial
  plans for market research, UX research, ed-tech and clinical research
  organisations; paid participant recruitment through the opt-in pool.
- **Reach:** direct to labs through pilot partnerships and research-methods
  courses; each published study that cites the platform brings the next lab.
- [Market size: add a figure only if you have a source for it.]
- [Traction: number of labs/people who have seen or tested it, any letters
  of interest, waitlist size. Leave out if none.]

## 7. Founder profile

[Your name], [role/qualification, e.g. psychologist; years and setting of
practice or research].

[Two or three sentences in your own words: the study or moment where you hit
this problem yourself, and why you built the prototype instead of waiting for
someone else to.]

[Team: solo, or names and roles of co-founders. A technical co-founder is not
required by the programme.]

[City you will attend on 20–21 Nov: Ahmedabad / Bengaluru / Chennai / Delhi /
Hyderabad / Jaipur / Kochi / Kolkata / Mumbai / Pune]

## 8. Links

- Code: https://github.com/aravindhvisu/stimulx
- Demo: https://stimulx.in  [confirm it is live and loads without the preview code]
- Pitch deck: [link]

---

## Pitch deck outline (10 slides)

1. Title: Stimulx, one-line pitch, your name
2. Problem: months of setup, foreign pricing, English-only science
3. Who feels it: the Indian PhD scholar / clinician-researcher
4. Solution: one workspace, idea to manuscript (screenshot of the tree builder)
5. The AI product: Stimulx Copilot, the five Gemini features
6. Demo: describe-to-experiment, before and after
7. Architecture: the diagram above, Google AI and Cloud called out
8. Market and business model
9. Founder and why you
10. What two days at the Buildathon will produce, and the ask

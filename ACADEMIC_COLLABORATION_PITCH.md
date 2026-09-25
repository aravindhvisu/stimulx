# Stimulx.in — Academic Collaboration & Lab Pilot Proposal
### Open Indian Behavioural Science & Experimental Psychology Platform

---

## 📌 Executive Summary
**Stimulx** (`stimulx.in`) is an open, cloud-native experimental research platform engineered specifically for behavioural scientists, experimental psychologists, cognitive neuroscientists, and mental health researchers in India. 

Modeled on international gold standards like **Gorilla Experiment Builder** (`gorilla.sc`) and **Qualtrics**, Stimulx eliminates the high cost barriers ($1,500–$5,000/year subscriptions in foreign currency) while solving critical India-specific challenges:
1. **Data Sovereignty & Ethics**: Full compliance with the **Digital Personal Data Protection (DPDP) Act 2023** and **ICMR 2017 Guidelines for Biomedical & Health Research**.
2. **Sub-Millisecond Timing Precision**: High-precision reaction time execution using browser microsecond timestamping (`performance.now()`).
3. **Native Multilingual Stimuli**: Seamless support for 22 Scheduled Indian languages across visual tasks and clinical survey batteries.
4. **No-Code Experiment Engineering**: Drag-and-drop Visual Experiment Trees, Display/Zone Task Builders, and dynamic spreadsheet-driven trial designs.

---

## 🎯 What Problems Does Stimulx Solve for Your Lab?

| Current Challenge in Indian Labs | How Stimulx Solves It |
|---|---|
| **Prohibitive Software Licenses**: Gorilla.sc & Qualtrics charge thousands of USD/GBP per year, draining scarce departmental research budgets. | **100% Free / Subsidized for Indian Academia**: Zero per-participant fees for academic and student researchers. |
| **Data Hosting Compliance**: Western tools host data in US/EU cloud zones, creating ethics and legal hurdles under DPDP 2023 for Indian patient and student data. | **Indian Data Residency**: Compliant with DPDP Act 2023, zero-PII tokenized participant IDs, and ICMR ethical micro-consent. |
| **Steep Coding Learning Curves**: New PhD and Master's scholars spend months learning Python (PsychoPy) or JavaScript (jsPsych) just to set up simple paradigms. | **Visual Task & Flow Builder**: Researchers build complex Stroop, Flanker, N-Back, and Survey protocols in minutes without writing code. |
| **Data Cleaning Bottlenecks**: Formatting raw trials into publication-ready statistical structures takes weeks of manual scripting. | **One-Click Tidy Exports**: Instantly exports Gorilla-standard Long Format CSV, R syntax scripts, SPSS `.sav`, and jamovi schemas. |

---

## 🔬 Core Platform Architecture

### 1. Visual Experiment Tree Canvas
- Node-based flow orchestration: **Consent ➔ Questionnaires ➔ Task 1 ➔ Task 2 ➔ Branching Logic / Randomizer ➔ Debrief**.
- Automatic participant token generation (`?run=token_xyz`) for anonymous, ethics-compliant participant distribution.

### 2. Gorilla-Standard Task Builder
- Multi-zone displays: Fixation cross, target text/images, response buttons, feedback timers.
- Dynamic spreadsheet binding: Define conditions, stimuli, and correct answers using spreadsheet variables (`$$cue`, `$$target`, `$$correct_key`).

### 3. Pre-Validated Cognitive Paradigm Library
- Pre-built, peer-reviewed paradigms ready to clone:
  - **Stroop Color-Word Task** (Multilingual Indic and English)
  - **Eriksen Flanker Task** (Congruent vs. Incongruent inhibitory control)
  - **2-Back Working Memory Task** (Continuous visual memory update)
  - **Posner Spatial Cueing** (Exogenous vs. Endogenous attentional orienting)
  - **Affective Priming Task** (Emotional valence congruency)

### 4. Psychometric & Clinical Questionnaire Builder
- Likert scales, continuous visual sliders, and multi-choice matrices.
- Integrated standard screening instruments: **PHQ-9** (Depression), **GAD-7** (Anxiety), **WHO-DAS 2.0** (Disability), and **DASS-21**.
- Real-time automated scoring rules and sum score computations.

### 5. Institutional Ethics & Grant Suite
- Auto-drafts ICMR-aligned Institutional Ethics Committee (IEC) documentation.
- Built-in **DST-SERB & ICSSR Grant Budget Calculator** and pre-registration hash generation (AsPredicted / OSF standard).

---

## 🤝 Proposed Collaboration Models

We invite you to partner with us under one of the following flexible engagement models:

### Model 1: Pilot Lab & Beta Testing Partner (Zero Financial Commitment)
- **What We Provide**: Free, unrestricted access for your entire lab, PhD scholars, and students to build and run experiments. Dedicated technical assistance to digitize your existing lab paradigms.
- **What We Seek**: Qualitative feedback from your team on usability, timing validation benchmarks, and feature requirements.
- **Recognition**: Co-authorship / technical acknowledgments in resultant publications and prominent institutional listing on the Stimulx platform.

### Model 2: Academic Advisor / Scientific Advisory Board
- **Role**: Guide the scientific roadmap of the platform (e.g., psychometric validation, precision benchmarking, clinical battery curation).
- **Time Commitment**: 1–2 hours per month for advisory feedback and roadmap review.

### Model 3: Joint Research & Innovation Grants
- Partner on competitive funding calls:
  - **DST-SERB / ANRF** (Science and Engineering Research Board / Anusandhan National Research Foundation)
  - **ICSSR** (Indian Council of Social Science Research)
  - **BIRAC BIG / SPARSH** (Biotechnology Industry Research Assistance Council)
  - **DST NIDHI-TBI / EIR** (National Initiative for Developing and Harnessing Innovations)
- Structure: Your lab acts as the **Host Academic Institution / Primary Investigator (PI)**, and Stimulx acts as the **Technological / Platform Development Partner**.

---

## 💻 Live Demonstration

- **Private Lab Preview**: [https://stimulx.in?preview=stimulx2026](https://stimulx.in?preview=stimulx2026)
- **Source Code (Open Source)**: [https://github.com/aravindhvisu/stimulx](https://github.com/aravindhvisu/stimulx)
- **Founder / Lead Developer**: Aravindh Visu (`aravindhvisu@gmail.com`)
- **Institution / Base**: India

---
*Stimulx is dedicated to democratizing scientific research infrastructure across Indian universities, hospitals, and cognitive research institutions.*

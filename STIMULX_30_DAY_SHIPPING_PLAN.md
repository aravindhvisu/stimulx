# Stimulx.in — 30-Day Product & Engineering Launch Plan
**Target Ship Date: 30 Days from Kickoff**  
**Product**: Stimulx.in (Open Indian Behavioural Science Infrastructure)  
**Domain**: `stimulx.in` (Unregistered / Available)  
**Hosting & Legal**: Hosted in Mumbai (AWS `ap-south-1` / Supabase Mumbai) for DPDP Act 2023 & ICMR 2017 Compliance  

---

## 1. Executive Summary & Product Scope

**Stimulx** transforms the prototype into a production-grade, end-to-end behavioural science platform tailored for Indian researchers, institutions (NIMHANS, SCARF, TISS, Delhi University), students, and lived-experience participants.

The product covers the entire 9-stage research lifecycle:
1. **Stage 0 — Brainstorm & Gaps**: Concept mapping, open-access literature references, feasibility estimator.
2. **Stage 1 — Ethics & IEC**: ICMR-compliant IEC application builder, 22-language consent generator, DPDP 2023 data isolation, automated committee PDF export.
3. **Stage 2 — Design & Methods**: Quantitative, Qualitative, and Mixed-methods protocols with an integrated 120+ clinical/psychometric scale library (PHQ-9, GAD-7, WHO-DAS 2.0, DASS-21).
4. **Stage 3 — Ethics-First Recruitment**: Rights-first campaign copy generators (WhatsApp, Instagram), mandatory debrief flows with crisis helplines (iCall, NIMHANS, Vandrevala), compensation tracking (UPI / vouchers).
5. **Stage 4 — Experiment Engine**: Browser-based cognitive experiment runner powered by `jsPsych` with microsecond-precision RT measurement, bilingual Hindi/English/Tamil stimuli, mobile touch + keyboard simulation.
6. **Stage 5 — Indian Participant Pool**: Opt-in pool registry, privacy-preserving demographic filtering (linguistic background, states), in-platform messaging strictly confined to active study windows.
7. **Stage 6 — Analysis Studio**: Automated RT cleaning, outliers removal, ANOVA/t-test summary statistics, export to R script, SPSS `.sav`, jamovi, and formatted APA tables.
8. **Stage 7 — Collaborative Writing & Review**: In-app manuscript editor with peer and community feedback threads (researchers + lived-experience reviewers).
9. **Stage 8 — Publish & Disseminate**: Indian journal matcher (IJPM, Psychological Studies) with APC waiver guides and APA 7th / LaTeX export.
10. **Community & Service Users Hub**: Open courses, scale translation tasks, and lived-experience co-researcher workflows.

---

## 2. Technical Architecture

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend Framework** | **Next.js 14+ (App Router, TypeScript)** | High performance, server-side rendering for open library/courses, API routes for backend endpoints. |
| **Styling & UI** | **Tailwind CSS + Radix UI / Shadcn UI + Lucide Icons** | Matches the DM Sans/DM Mono aesthetic of the design prototype while delivering accessible, responsive UI primitives. |
| **Experiment Runtime** | **`@jspsych/core` + jsPsych Plugins** | Industry gold standard for timing precision in web experiments. No custom flaky timer code. |
| **Backend & Database** | **Supabase (PostgreSQL 15, Row-Level Security, Auth, Storage)** | Hosted in India (AWS Mumbai region) for DPDP 2023 data residency. Built-in auth, realtime subscriptions, and role-based policies. |
| **Data Encryption & Privacy** | **AES-GCM 256 for PII + Pseudonymization Keys** | Participant contact details isolated from research datasets. |
| **Document Generation** | **`@react-pdf/renderer` & `docx`** | Client/server generation of NIMHANS-formatted IEC PDF applications and APA 7th `.docx` manuscripts. |
| **Hosting & CI/CD** | **Vercel / AWS Amplify (Mumbai) + GitHub Actions** | Zero-downtime deployments, preview branches, automated linting and testing. |

---

## 3. 30-Day Day-by-Day Implementation Roadmap

### Phase 1: Foundation, Ethics & Design (Days 1 – 10)
* **Day 1: Project Initialization & Domain Setup**
  * Acquire `stimulx.in` on registrar.
  * Initialize Next.js project with TypeScript, Tailwind CSS, ESLint, Prettier.
  * Setup GitHub repository, Supabase Mumbai project, and Vercel staging deployment.
* **Day 2: Authentication & Role-Based Access Control**
  * Roles: `Researcher`, `Participant`, `Service User`, `Admin/Reviewer`.
  * Email OTP / Magic Link passwordless authentication.
  * DPDP 2023 Consent prompt at registration.
* **Day 3: Stage 0 — Brainstorming & Research Gaps DB**
  * Supabase tables: `ideas`, `literature_refs`, `research_gaps`.
  * Interactive Idea Board with tag filters (Cognitive, Clinical, Qualitative).
  * Feasibility calculator tool.
* **Day 4–5: Stage 1 — Ethics & IEC Builder**
  * ICMR 2017 compliant form sections.
  * PDF generator for Institutional Ethics Committees (NIMHANS, SCARF, TISS formats).
  * 22 Indian language consent template repository.
* **Day 6–8: Stage 2 — Study Protocol & Scale Library**
  * Study configuration: Quantitative (Within/Between/Mixed), Qualitative (Thematic, IPA), Mixed.
  * Standardized Scale Engine: PHQ-9, GAD-7, WHO-DAS 2.0, PSS-10, DASS-21 with auto-scoring and clinical cutoff flags.
* **Day 9–10: Data Privacy Pipeline (DPDP 2023)**
  * Separation of Participant Identifiable Information (PII) and Response Data.
  * Audit logging for all researcher actions.
  * 30-day withdrawal and data deletion trigger.

### Phase 2: Experiment Engine & Participant Management (Days 11 – 20)
* **Day 11–13: Stage 4 — jsPsych Integration & Experiment Runner**
  * Embed jsPsych timeline into Next.js canvas.
  * Pre-built paradigms: Multilingual Stroop (Hindi/English/Tamil), Implicit Association Test (IAT), Flanker.
  * Mobile touch response support (onscreen buttons) + physical keyboard listener.
  * Full-screen lock, blur detection, latency compensation.
* **Day 14–15: Experiment Preview & Simulation Mode**
  * Researcher "Dry Run" simulator (Mobile viewport vs Desktop).
  * Synthetic participant generator for testing data pipelines.
* **Day 16–18: Stage 3 & 5 — Participant Pool & Recruitment Gateway**
  * Opt-in participant directory with language fluency and location metadata.
  * Filter & invite engine: match criteria without exposing email/phone to researchers.
  * Auto-generated outreach cards (WhatsApp copy, Instagram PNG generator).
* **Day 19–20: Debrief Screen & Participant Safety**
  * Mandatory debrief screen with mental health helpline integration (iCall, Vandrevala, NIMHANS).
  * Participant compensation dispatcher (UPI intent / Amazon voucher voucher code redemption).

### Phase 3: Analysis, Collaborative Writing & Community (Days 21 – 26)
* **Day 21–22: Stage 6 — Analysis Studio**
  * In-browser data parser (CSV / JSON export).
  * RT filtering (trimming <200ms or >2.5 SD).
  * Auto-generated descriptives & basic inferential stats (paired t-test, repeated ANOVA).
  * One-click download of clean dataset, R Markdown script, SPSS `.sav`, and jamovi file.
* **Day 23–24: Stage 7 & 8 — Writing, Review & Publishing**
  * Rich-text manuscript editor (Abstract, Methods auto-fill, Results).
  * Inline comment threads for invited peer reviewers and lived-experience reviewers.
  * APA 7th `.docx` and LaTeX exporter.
  * Indian journal directory with APC waiver guidelines.
* **Day 25–26: Community Hub & Service User Modules**
  * Free open learning modules (Research Methods 101, ICMR Ethics, Stats).
  * Community discussion forum with language tags.
  * Open translation tasks for psychological scales.

### Phase 4: Hardening, Compliance, Testing & Launch (Days 27 – 30)
* **Day 27: Security, Privacy & Performance Audit**
  * Penetration test & Row-Level Security verification.
  * Ensure zero IP address storage; verify pseudonymization key segregation.
  * Lighthouse score optimization (>90 mobile performance).
* **Day 28: Cross-Browser & Multi-Device Testing**
  * Low-end Android devices (Chrome, JioPhone browsers).
  * iOS Safari & desktop browsers.
  * Verify RTL / Indic font rendering (Devanagari, Tamil, Telugu, Kannada).
* **Day 29: Production Staging & Final Dress Rehearsal**
  * End-to-end trial run: Idea -> IEC approval -> jsPsych Stroop study live -> 50 participant test runs -> Analysis export.
  * DNS cutover: configure `stimulx.in` records pointing to Vercel/AWS.
* **Day 30: Public Launch**
  * Announcement to Indian research networks (NIMHANS alumni, SCARF, TISS psychology mailing lists).
  * Open registration for researchers and participants.

---

## 4. Key Deliverables & Milestones
1. **Week 1 Milestone**: Functional IEC ethics application generator + Scale library with auto-scoring.
2. **Week 2 Milestone**: Fully operational Stroop experiment running via jsPsych with sub-millisecond precision.
3. **Week 3 Milestone**: End-to-end participant recruitment loop (invite -> consent -> experiment -> debrief -> voucher).
4. **Week 4 Milestone**: Analysis export + community review + public launch on `stimulx.in`.

---

## 5. Instructions to Store on Google Drive
* To sync this plan to your Google Drive:
  1. If you use **Google Drive for Desktop**, move or copy `STIMULX_30_DAY_SHIPPING_PLAN.md` into your local `My Drive` directory.
  2. Or open [Google Drive](https://drive.google.com), click **New > File upload**, and select:  
     `/Users/aravindhvisu/.gemini/antigravity/scratch/stimulx/STIMULX_30_DAY_SHIPPING_PLAN.md`
  3. Google Docs will automatically convert it to a styled document upon opening.

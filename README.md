# Stimulx.sc (அறிவு / Stimulx)
### Open Indian Behavioural Science Research Infrastructure

[![Status: In Development](https://img.shields.io/badge/status-30--day--shipping-orange.svg)](#)
[![Compliance](https://img.shields.io/badge/compliance-ICMR%202017%20%7C%20DPDP%202023-emerald.svg)](#)
[![Region](https://img.shields.io/badge/data%20residency-India%20(Mumbai)-blue.svg)](#)
[![Domain](https://img.shields.io/badge/domain-stimulx.sc-purple.svg)](#)

Stimulx is an open-source, non-profit digital research infrastructure built for Indian psychologists, neuroscientists, students, and lived-experience participants. Built for institutions such as **NIMHANS**, **SCARF**, **TISS**, **Delhi University**, and every researcher across India.

---

## 🌟 The 9-Stage Research Lifecycle

1. **Stage 0: Brainstorm & Research Gaps**  
   From curiosity to research question. Explore community-curated research gaps in Indian psychology, link ideas to open-access literature (PubMed, PsyArXiv), and run feasibility checks.
2. **Stage 1: Ethics & IEC Builder**  
   ICMR 2017 & IEC-aligned application generator with auto-formatting for NIMHANS, SCARF, and TISS committees. Generates 22 Indian language consent forms and strictly enforces DPDP Act 2023 compliance.
3. **Stage 2: Design & Methodology**  
   Support for Quantitative (within/between/mixed), Qualitative (thematic analysis, IPA), and Mixed Methods. Integrated 120+ clinical scale library (PHQ-9, GAD-7, WHO-DAS 2.0, DASS-21, PSS-10) with automatic clinical scoring.
4. **Stage 3: Ethics-First Recruitment**  
   Generates participant-rights-first campaign material (WhatsApp in Indic languages, Instagram cards). Enforces mandatory debrief screens with crisis helpline numbers (iCall, NIMHANS, Vandrevala Foundation) and compensation management.
5. **Stage 4: Experiment Engine (jsPsych)**  
   Microsecond-accurate browser cognitive tasks (Multilingual Stroop in Hindi/English/Tamil, IAT, Flanker). Mobile touch controls + desktop keyboard listener with real simulation mode.
6. **Stage 5: Indian Participant Pool**  
   Opt-in community pool representing 22 states and 18 languages. Researchers contact participants strictly via the platform during active study windows. No raw contact details are ever exposed.
7. **Stage 6: Analysis Studio**  
   Descriptive metrics, reaction-time outlier trimming, and inferential comparisons. 1-click export to R script (`analysis.R`), SPSS (`.sav`), jamovi, and formatted APA 7th tables.
8. **Stage 7: Collaborative Writing & Review**  
   In-app manuscript drafting with auto-filled Methods and Ethics sections. Peer review threads including lived-experience service users.
9. **Stage 8: Publish & Disseminate**  
   Indian journal recommendation engine (IJPM, Psychological Studies) with APC waiver guidance and APA 7th / LaTeX manuscript exporter.
10. **Community & Service Users Hub**  
    Free open courses (Research Methods, ICMR Ethics, Statistics in Indian languages), discussion forum, open scale translation tasks, and lived-experience co-researcher workflows.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Design System
- **Icons**: [Lucide React](https://lucide.dev/)
- **Experiment Engine**: [jsPsych](https://www.jspsych.org/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL 15 hosted in AWS Mumbai `ap-south-1`)
- **Compliance**: Digital Personal Data Protection (DPDP) Act 2023 & ICMR 2017 Guidelines

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or yarn

### 2. Installation
```bash
# Clone repository
git clone https://github.com/<your-username>/stimulx.git
cd stimulx

# Install dependencies
npm install

# Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 Linking to GitHub

To push this repository to your GitHub account:

```bash
# 1. Create a new repository on GitHub (e.g. named 'stimulx')
# 2. Add your remote
git remote add origin https://github.com/<your-username>/stimulx.git

# 3. Rename branch to main (if not already)
git branch -M main

# 4. Push code
git push -u origin main
```

---

## 📅 30-Day Launch Roadmap

See [`STIMULX_30_DAY_SHIPPING_PLAN.md`](./STIMULX_30_DAY_SHIPPING_PLAN.md) for the complete day-by-day sprint plan.

---

## ⚖️ License & Ethics

Built under an open non-profit research license. Dedicated to advancing open, culturally representative behavioural science across India.

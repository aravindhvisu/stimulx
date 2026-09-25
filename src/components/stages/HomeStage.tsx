'use client';

import React, { useState } from 'react';
import { StageId, UserPersona } from '@/types';
import { useStimulxStore } from '@/lib/store';
import {
  GraduationCap,
  FlaskConical,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe2,
  ChevronRight,
  FileSpreadsheet,
  Brain,
  Activity,
  Layers,
  Scale,
  Compass,
  FileCheck2,
  Stethoscope,
} from 'lucide-react';

interface HomeStageProps {
  onNavigate: (stage: StageId) => void;
  onOpenAuth?: () => void;
}

export function HomeStage({ onNavigate, onOpenAuth }: HomeStageProps) {
  const { setActivePersona, activePersona } = useStimulxStore();
  const [selectedPersonaTab, setSelectedPersonaTab] = useState<UserPersona>('student');

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#040814] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION: Scientific, Truth-Seeking, Taking India Forward */}
      {/* ------------------------------------------------------------- */}
      <div className="relative border-b border-white/10 overflow-hidden bg-gradient-to-b from-[#070e24] via-[#050b1a] to-[#040814]">
        {/* Subtle grid pattern & scientific ambient glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 pt-16 pb-14 relative z-10">
          {/* Motto Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>सत्यमेव जयते नानृतम् &bull; Truth Alone Triumphs Through Empirical Science</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15] mb-5">
            Scientific. Truth-Seeking.<br />
            <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">
              Taking Indian Behavioural Science Forward.
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-3xl leading-relaxed font-normal mb-8">
            Stimulx is India’s open, cloud-native research infrastructure for experimental psychology, cognitive neuroscience, and public mental health. Designed to liberate Indian research departments from expensive foreign currency software, foreign cloud compliance risks, and reproducibility barriers.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              onClick={() => onNavigate('care_rct')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-xl shadow-orange-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Stethoscope className="w-4 h-4" />
              Explore Models of Care & RCT Studio
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('builder')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 hover:border-cyan-500/40 text-slate-200 font-semibold text-sm transition-all"
            >
              <Brain className="w-4 h-4 text-cyan-400" />
              Open Gorilla Task Builder
            </button>
          </div>

          {/* Sovereign Standards Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-10 mt-8 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>DPDP Act 2023 & ICMR 2017 Certified</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Sub-millisecond Precision (performance.now)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Globe2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>22 Scheduled Indic Languages</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Award className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>$0 / Free for Indian Academia</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. PERSONA IMPACT SHOWCASE: Real Problems & Concrete Solutions */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-6 py-14 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
            Tailored For Academic Reality
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
            How Stimulx Solves Real-World Bottlenecks
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-2">
            Select your academic role to see how the platform replaces months of administrative drag with reproducible science.
          </p>

          {/* Persona Switcher Tabs */}
          <div className="inline-flex items-center bg-[#0a1226] p-1.5 rounded-2xl border border-white/10 mt-6 shadow-inner">
            <button
              onClick={() => {
                setSelectedPersonaTab('student');
                setActivePersona('student');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedPersonaTab === 'student'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student (UG / Master's)
            </button>

            <button
              onClick={() => {
                setSelectedPersonaTab('postdoc');
                setActivePersona('postdoc');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedPersonaTab === 'postdoc'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              Postdoc & Early-Career Fellow
            </button>

            <button
              onClick={() => {
                setSelectedPersonaTab('scientist');
                setActivePersona('scientist');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedPersonaTab === 'scientist'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              Principal Investigator / Scientist
            </button>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* A. STUDENT SHOWCASE */}
        {/* --------------------------------------------------------- */}
        {selectedPersonaTab === 'student' && (
          <div className="bg-[#0b1329] rounded-3xl border border-emerald-500/30 p-6 md:p-8 shadow-2xl animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
                🎓
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  The Master's & Undergraduate Student Researcher
                </h3>
                <p className="text-xs text-emerald-400 font-medium">
                  Dissertation Submission &bull; No Software Budget &bull; Zero Coding Barrier
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem Statement */}
              <div className="p-5 rounded-2xl bg-[#070b18] border border-red-500/20 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  The Painful Reality Before Stimulx
                </div>
                <blockquote className="text-xs text-slate-300 italic leading-relaxed">
                  "I have exactly 4 months to finish my MSc Psychology dissertation. My thesis guide instructed me to run a Stroop and Flanker cognitive task. But our department doesn't have a $2,500 Gorilla or Qualtrics subscription, and I don't know Python or JavaScript to code 500 lines of PsychoPy from scratch. I was stuck hand-calculating reaction times on paper."
                </blockquote>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-white/5">
                  Result: Compromised thesis methodology, delayed viva exams, and low student morale.
                </div>
              </div>

              {/* Stimulx Solution */}
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  How Stimulx Solves It in Minutes
                </div>
                <ul className="text-xs text-slate-200 space-y-2.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">1.</span>
                    <span><b>Visual Experiment Flow</b>: Drag and drop <i>Consent ➔ Questionnaire ➔ Cognitive Task ➔ Debrief</i> without a single line of code.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">2.</span>
                    <span><b>Pre-Built Paradigm Library</b>: Clone validated Stroop, Flanker, Posner Cueing, or 2-Back tasks with one click.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">3.</span>
                    <span><b>Instant Tidy Export</b>: Exports clean, formatted Long-Format CSVs, R scripts, and SPSS <code>.sav</code> ready to paste into dissertation tables.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('builder')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
                  >
                    Open Student Experiment Studio
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* B. POSTDOC SHOWCASE */}
        {/* --------------------------------------------------------- */}
        {selectedPersonaTab === 'postdoc' && (
          <div className="bg-[#0b1329] rounded-3xl border border-purple-500/30 p-6 md:p-8 shadow-2xl animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xl">
                🔬
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  The Postdoctoral & Early-Career Fellow
                </h3>
                <p className="text-xs text-purple-400 font-medium">
                  Grant Writing (DST-SERB / ICSSR) &bull; Multi-State Ethics &bull; Cryptographic Pre-Registration
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem Statement */}
              <div className="p-5 rounded-2xl bg-[#070b18] border border-red-500/20 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  The Painful Reality Before Stimulx
                </div>
                <blockquote className="text-xs text-slate-300 italic leading-relaxed">
                  "I am preparing an ICSSR / DST-SERB Early Career Grant proposal. Top journals now reject studies without formal pre-registration, and our institutional ethics committee (IEC) requires multi-lingual consent compliant with the new DPDP Act 2023. Preparing all these regulatory protocols by hand takes 6 months of bureaucracy before a single participant is recruited."
                </blockquote>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-white/5">
                  Result: Slower publication velocity, grant submission deadlines missed, and replication vulnerabilities.
                </div>
              </div>

              {/* Stimulx Solution */}
              <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  How Stimulx Solves It in Minutes
                </div>
                <ul className="text-xs text-slate-200 space-y-2.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">1.</span>
                    <span><b>Cryptographic Pre-Registration</b>: Generates SHA-256 hashed, immutable pre-registration certificates (AsPredicted / OSF standard) before data collection begins.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">2.</span>
                    <span><b>Automated Ethics & Consent</b>: Auto-generates ICMR 2017 application dossiers and DPDP 2023 micro-consent in 22 regional Indian languages.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">3.</span>
                    <span><b>Grant Budget Calculator</b>: Built-in SERB / ICSSR manpower and equipment costing models aligned with Government of India scales.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('ethics')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all"
                  >
                    Launch Postdoc Ethics & Grant Suite
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* C. SCIENTIST / PI SHOWCASE */}
        {/* --------------------------------------------------------- */}
        {selectedPersonaTab === 'scientist' && (
          <div className="bg-[#0b1329] rounded-3xl border border-amber-500/30 p-6 md:p-8 shadow-2xl animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl">
                🏛️
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  The Principal Investigator & Senior Scientist
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  Models of Care &bull; Pragmatic RCTs &bull; National Replication Consortium &bull; Data Sovereignty
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem Statement */}
              <div className="p-5 rounded-2xl bg-[#070b18] border border-red-500/20 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  The Painful Reality Before Stimulx
                </div>
                <blockquote className="text-xs text-slate-300 italic leading-relaxed">
                  "Our lab runs multi-centre clinical trials adapting stepped care for depression in Indian district hospitals. Western software like Gorilla/Qualtrics charges thousands of dollars and stores patient data on US/EU cloud servers, violating Indian data residency laws. Furthermore, adapting international care models (like UK IAPT or US CoCM) into task-sharing lay-worker models required building custom databases from scratch."
                </blockquote>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-white/5">
                  Result: Huge recurring grant overheads, legal data compliance vulnerabilities, and fragmented trial registries.
                </div>
              </div>

              {/* Stimulx Solution */}
              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  How Stimulx Solves It in Minutes
                </div>
                <ul className="text-xs text-slate-200 space-y-2.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">1.</span>
                    <span><b>Models of Care & Adaptive RCT Studio</b>: Benchmark global models (Sangath HAP, NHS IAPT, CoCM, Friendship Bench), iterate stepped-care delivery, and auto-generate <b>CONSORT 2010 flow diagrams</b>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">2.</span>
                    <span><b>CTRI Trial Exporter</b>: 1-click clinical trial registration export formatted for the Clinical Trials Registry - India (CTRI) & ClinicalTrials.gov.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">3.</span>
                    <span><b>100% Indian Data Sovereignty</b>: Built for Mumbai/Indian residency, zero-PII cryptographic participant tokens, and audit-ready ethics logs.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('care_rct')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md transition-all"
                  >
                    Open Models of Care & RCT Studio
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. SCIENTIFIC ARCHITECTURE MATRIX                             */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-6 pb-16 w-full">
        <div className="p-6 md:p-8 rounded-3xl bg-[#080e20] border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              Explore the Full Research Operating System
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Stimulx integrates the complete scientific lifecycle: Grant Budgeters, ICMR Ethics, Gorilla-standard Task Builder, Participant Runner, Tidy Data Hub, and Manuscript Drafts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('builder')}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
            >
              Enter Experiment Studio
            </button>
            <button
              onClick={() => onNavigate('care_rct')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold rounded-xl transition-all"
            >
              Care Models & RCTs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

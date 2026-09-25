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
  Zap,
  Globe2,
  Brain,
  Stethoscope,
  Layers,
  FileCheck2,
} from 'lucide-react';

interface HomeStageProps {
  onNavigate: (stage: StageId) => void;
  onOpenAuth?: () => void;
}

export function HomeStage({ onNavigate }: HomeStageProps) {
  const { setActivePersona, activePersona } = useStimulxStore();
  const [selectedPersonaTab, setSelectedPersonaTab] = useState<UserPersona>('student');

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#12111A] text-white font-sans selection:bg-[#D7263D]/30 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION: Scientific, Truth-Seeking, Taking India Forward */}
      {/* Following StimulX Draft Brand Guidelines:                     */}
      {/* Surface: #12111A (Ink)                                        */}
      {/* Headings: Poppins SemiBold/Bold                               */}
      {/* Accent: #D7263D (Stimulus Red)                                */}
      {/* ------------------------------------------------------------- */}
      <div className="relative border-b border-white/10 overflow-hidden bg-[#12111A]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 pt-16 pb-14 relative z-10 text-center md:text-left">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#8B8A99] text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7263D]" />
            <span>StimulX &bull; Behavioural Research Infrastructure for India</span>
          </div>

          {/* Main Wordmark & Headline */}
          <h1 className="text-4xl md:text-6xl font-poppins font-bold text-white tracking-tight leading-[1.12] mb-5">
            Scientific. Truth-seeking.<br />
            Taking Indian research forward.
          </h1>

          <p className="text-base md:text-lg text-[#B9B8C6] max-w-2xl leading-relaxed font-normal mb-8 font-sans">
            A non-profit behavioural research platform built as infrastructure for the Indian psychology and neuroscience research community — covering the full research lifecycle from ideation through ethics review, data collection, analysis, and publication.
          </p>

          {/* Primary Call to Actions */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-1">
            <button
              onClick={() => onNavigate('care_rct')}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#D7263D] hover:bg-[#A81C2E] text-white font-poppins font-semibold text-sm transition-all shadow-md active:scale-[0.98]"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Models of Care & RCT Studio</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('builder')}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1E1D29] hover:bg-white/10 border border-white/15 text-white font-poppins font-semibold text-sm transition-all"
            >
              <Brain className="w-4 h-4 text-[#8B8A99]" />
              <span>Task & Experiment Studio</span>
            </button>
          </div>

          {/* Sovereign Standards Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-10 mt-10 border-t border-white/10 text-xs text-[#8B8A99]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#D7263D] shrink-0" />
              <span>Sub-millisecond Precision</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>22 Scheduled Indic Languages</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>$0 / Free for Indian Academia</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. PERSONA IMPACT SHOWCASE: Real Problems & Concrete Solutions */}
      {/* (No stage lists; concrete real-world vignettes)               */}
      {/* Surface: #1E1D29 (Ink 2) Cards                                */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-5xl mx-auto px-6 py-14 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#D7263D] mb-2 font-poppins">
            Academic Problem-Solving
          </div>
          <h2 className="text-2xl md:text-3xl font-poppins font-semibold text-white tracking-tight">
            How StimulX Solves Real Research Bottlenecks
          </h2>
          <p className="text-xs md:text-sm text-[#8B8A99] mt-2">
            Select your academic role to see how the platform replaces fragmented tools with reproducible science.
          </p>

          {/* Persona Switcher Tabs */}
          <div className="inline-flex items-center bg-[#1E1D29] p-1.5 rounded-xl border border-white/10 mt-6">
            <button
              onClick={() => {
                setSelectedPersonaTab('student');
                setActivePersona('student');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-poppins transition-all ${
                selectedPersonaTab === 'student'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-[#8B8A99] hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Student (UG / Master's)
            </button>

            <button
              onClick={() => {
                setSelectedPersonaTab('postdoc');
                setActivePersona('postdoc');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-poppins transition-all ${
                selectedPersonaTab === 'postdoc'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-[#8B8A99] hover:text-white'
              }`}
            >
              <FlaskConical className="w-4 h-4 text-purple-400" />
              Postdoc & Early-Career Fellow
            </button>

            <button
              onClick={() => {
                setSelectedPersonaTab('scientist');
                setActivePersona('scientist');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-poppins transition-all ${
                selectedPersonaTab === 'scientist'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-[#8B8A99] hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 text-[#D7263D]" />
              Principal Investigator / Scientist
            </button>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* A. STUDENT SHOWCASE */}
        {/* --------------------------------------------------------- */}
        {selectedPersonaTab === 'student' && (
          <div className="bg-[#1E1D29] rounded-2xl border border-white/10 p-6 md:p-8 shadow-xl animate-in fade-in duration-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg">
                🎓
              </div>
              <div>
                <h3 className="text-base font-poppins font-bold text-white">
                  The Master's & Undergraduate Student Researcher
                </h3>
                <p className="text-xs text-[#8B8A99]">
                  Dissertation Submission &bull; No Software Budget &bull; Zero Coding Barrier
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem */}
              <div className="p-5 rounded-xl bg-[#12111A] border border-white/5 space-y-3">
                <div className="text-xs font-bold text-[#D7263D] uppercase tracking-wider font-poppins">
                  The Reality Before StimulX
                </div>
                <blockquote className="text-xs text-[#B9B8C6] italic leading-relaxed">
                  "I have 4 months to finish my MSc Psychology dissertation. My thesis guide instructed me to run a Stroop and Flanker cognitive task. But our department doesn't have a $2,500 Gorilla or Qualtrics subscription, and I don't know Python to code 500 lines of PsychoPy. I was stuck hand-calculating reaction times on paper."
                </blockquote>
                <div className="text-[11px] text-[#6B6A75] pt-2 border-t border-white/5">
                  Result: Compromised thesis methodology, delayed viva exams, and high student frustration.
                </div>
              </div>

              {/* Solution */}
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-poppins flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  How StimulX Solves It
                </div>
                <ul className="text-xs text-slate-200 space-y-2.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">&bull;</span>
                    <span><b>Visual Experiment Flow</b>: Drag and drop <i>Consent ➔ Questionnaire ➔ Task ➔ Debrief</i> with zero code.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">&bull;</span>
                    <span><b>Pre-Built Paradigm Library</b>: Clone validated Stroop, Flanker, Posner Cueing, or 2-Back tasks with one click.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">&bull;</span>
                    <span><b>Instant Tidy Export</b>: Exports formatted Long-Format CSVs, R scripts, and SPSS <code>.sav</code> ready to paste into dissertation tables.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('builder')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-poppins font-semibold shadow-sm transition-all"
                  >
                    Open Student Task Studio
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
          <div className="bg-[#1E1D29] rounded-2xl border border-white/10 p-6 md:p-8 shadow-xl animate-in fade-in duration-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg">
                🔬
              </div>
              <div>
                <h3 className="text-base font-poppins font-bold text-white">
                  The Postdoctoral & Early-Career Fellow
                </h3>
                <p className="text-xs text-[#8B8A99]">
                  Grant Writing (DST-SERB / ICSSR) &bull; Multi-State Ethics &bull; Cryptographic Pre-Registration
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem */}
              <div className="p-5 rounded-xl bg-[#12111A] border border-white/5 space-y-3">
                <div className="text-xs font-bold text-[#D7263D] uppercase tracking-wider font-poppins">
                  The Reality Before StimulX
                </div>
                <blockquote className="text-xs text-[#B9B8C6] italic leading-relaxed">
                  "I am preparing a DST-SERB Early Career Grant proposal. Top journals now reject studies without formal pre-registration, and our institutional ethics committee (IEC) requires multi-lingual consent compliant with the new DPDP Act 2023. Preparing all these regulatory protocols by hand takes 6 months of bureaucracy."
                </blockquote>
                <div className="text-[11px] text-[#6B6A75] pt-2 border-t border-white/5">
                  Result: Slower publication velocity, grant submission deadlines missed, and replication vulnerabilities.
                </div>
              </div>

              {/* Solution */}
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="text-xs font-bold text-purple-400 uppercase tracking-wider font-poppins flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  How StimulX Solves It
                </div>
                <ul className="text-xs text-slate-200 space-y-2.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">&bull;</span>
                    <span><b>Cryptographic Pre-Registration</b>: Generates SHA-256 hashed, immutable pre-registration certificates (AsPredicted / OSF standard).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">&bull;</span>
                    <span><b>Automated Ethics & Consent</b>: Auto-generates ICMR 2017 application dossiers and DPDP 2023 micro-consent in 22 regional Indian languages.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">&bull;</span>
                    <span><b>Grant Budget Calculator</b>: Built-in SERB / ICSSR manpower and equipment costing models aligned with Government of India scales.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('ethics')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-poppins font-semibold shadow-sm transition-all"
                  >
                    Open Postdoc Ethics & Grant Suite
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
          <div className="bg-[#1E1D29] rounded-2xl border border-white/10 p-6 md:p-8 shadow-xl animate-in fade-in duration-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-[#D7263D]/10 text-[#D7263D] flex items-center justify-center font-bold text-lg">
                🏛️
              </div>
              <div>
                <h3 className="text-base font-poppins font-bold text-white">
                  The Principal Investigator & Senior Scientist
                </h3>
                <p className="text-xs text-[#8B8A99]">
                  Models of Care &bull; Pragmatic RCTs &bull; National Replication Consortium &bull; Data Sovereignty
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem */}
              <div className="p-5 rounded-xl bg-[#12111A] border border-white/5 space-y-3">
                <div className="text-xs font-bold text-[#D7263D] uppercase tracking-wider font-poppins">
                  The Reality Before StimulX
                </div>
                <blockquote className="text-xs text-[#B9B8C6] italic leading-relaxed">
                  "Our lab runs multi-centre clinical trials adapting stepped care for depression in Indian district hospitals. Western software like Gorilla/Qualtrics charges thousands of dollars and stores patient data on US/EU cloud servers, violating Indian data residency laws. Furthermore, adapting international care models into task-sharing lay-worker models required building custom databases from scratch."
                </blockquote>
                <div className="text-[11px] text-[#6B6A75] pt-2 border-t border-white/5">
                  Result: Recurring grant overheads, legal data compliance vulnerabilities, and fragmented trial registries.
                </div>
              </div>

              {/* Solution */}
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="text-xs font-bold text-[#D7263D] uppercase tracking-wider font-poppins flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D7263D]" />
                  How StimulX Solves It
                </div>
                <ul className="text-xs text-slate-200 space-y-2.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D7263D] font-bold">&bull;</span>
                    <span><b>Models of Care & Adaptive RCT Studio</b>: Benchmark global models (Sangath HAP, NHS IAPT, CoCM, Friendship Bench), iterate stepped-care delivery, and auto-generate <b>CONSORT 2010 flow diagrams</b>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D7263D] font-bold">&bull;</span>
                    <span><b>CTRI Trial Exporter</b>: 1-click clinical trial registration export formatted for the Clinical Trials Registry - India (CTRI) & ClinicalTrials.gov.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D7263D] font-bold">&bull;</span>
                    <span><b>100% Indian Data Sovereignty</b>: Built for Mumbai/Indian residency, zero-PII cryptographic participant tokens, and audit-ready ethics logs.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('care_rct')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#D7263D] hover:bg-[#A81C2E] text-white text-xs font-poppins font-semibold shadow-sm transition-all"
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
      {/* 3. PLATFORM OVERVIEW BANNER                                   */}
      {/* Surface: #1E1D29                                              */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-5xl mx-auto px-6 pb-16 w-full">
        <div className="p-6 md:p-8 rounded-2xl bg-[#1E1D29] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h3 className="text-base font-poppins font-bold text-white">
              Ready to design or pilot an experiment?
            </h3>
            <p className="text-xs text-[#8B8A99] max-w-xl leading-relaxed">
              StimulX integrates the complete scientific lifecycle: Grant Budgeters, ICMR Ethics, Gorilla-standard Task Builder, Participant Runner, Tidy Data Hub, and Models of Care.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('builder')}
              className="px-4 py-2.5 bg-[#D7263D] hover:bg-[#A81C2E] text-white text-xs font-poppins font-semibold rounded-lg shadow-sm transition-all"
            >
              Enter Task Studio
            </button>
            <button
              onClick={() => onNavigate('care_rct')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-poppins font-medium rounded-lg transition-all"
            >
              Care Models & RCTs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

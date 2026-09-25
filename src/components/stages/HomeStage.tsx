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
  ChevronRight,
  Sparkles,
  Layers,
} from 'lucide-react';

interface HomeStageProps {
  onNavigate: (stage: StageId) => void;
  onOpenAuth?: () => void;
}

export function HomeStage({ onNavigate }: HomeStageProps) {
  const { setActivePersona, activePersona } = useStimulxStore();
  const [selectedPersonaTab, setSelectedPersonaTab] = useState<UserPersona>('student');

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-white text-slate-900 font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION: Plain White, Minimal, Truth-Seeking          */}
      {/* Typography: Poppins (Headings), Inter (Body)                 */}
      {/* Accent: Rich Purple (#7C3AED / #6D28D9)                      */}
      {/* ------------------------------------------------------------- */}
      <div className="border-b border-slate-100 bg-white py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            <span>Open Behavioural & Cognitive Science Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-poppins font-bold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Scientific. Truth-seeking.<br />
            <span className="text-[#7C3AED]">Taking Indian research forward.</span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal mb-8">
            An open digital research infrastructure for behavioural scientists, psychologists, and cognitive researchers in India. From experimental design to ethics compliance, clinical trial modeling, and reproducible data analysis.
          </p>

          {/* Clean Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => onNavigate('builder')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-poppins font-semibold text-sm transition-all shadow-sm active:scale-[0.98]"
            >
              <Brain className="w-4 h-4" />
              <span>Launch Experiment Studio</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('care_rct')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-poppins font-semibold text-sm transition-all"
            >
              <Stethoscope className="w-4 h-4 text-purple-600" />
              <span>Models of Care & RCT Studio</span>
            </button>
          </div>

          {/* Trust & Compliance Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 mt-12 border-t border-slate-100 text-xs text-slate-500 font-medium">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>Sub-millisecond Timing Precision</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Globe2 className="w-4 h-4 text-purple-600" />
              <span>22 Scheduled Indic Languages</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span>Non-Profit & Open Infrastructure</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. ABSTRACT PROBLEM-SOLVING SHOWCASE (NO COMPETITOR NAMES)    */}
      {/* Plain White Cards with Crisp Borders                          */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-5xl mx-auto px-6 py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-purple-600 mb-2 font-poppins">
            Empowering Every Career Stage
          </div>
          <h2 className="text-2xl md:text-3xl font-poppins font-bold text-slate-900 tracking-tight">
            Designed to Solve Real Empirical Challenges
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-2">
            Explore how StimulX eliminates technical and administrative bottlenecks across academic roles.
          </p>

          {/* Persona Switcher Tabs */}
          <div className="inline-flex items-center bg-slate-100 p-1.5 rounded-xl mt-6 border border-slate-200">
            <button
              onClick={() => {
                setSelectedPersonaTab('student');
                setActivePersona('student');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-poppins transition-all ${
                selectedPersonaTab === 'student'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>Student Researchers</span>
            </button>

            <button
              onClick={() => {
                setSelectedPersonaTab('postdoc');
                setActivePersona('postdoc');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-poppins transition-all ${
                selectedPersonaTab === 'postdoc'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FlaskConical className="w-4 h-4 text-purple-600" />
              <span>Postdoctoral Scholars</span>
            </button>

            <button
              onClick={() => {
                setSelectedPersonaTab('scientist');
                setActivePersona('scientist');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-poppins transition-all ${
                selectedPersonaTab === 'scientist'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-purple-600" />
              <span>Principal Investigators</span>
            </button>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* A. STUDENT SHOWCASE (Abstract, Competitor-Free)           */}
        {/* --------------------------------------------------------- */}
        {selectedPersonaTab === 'student' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg">
                🎓
              </div>
              <div>
                <h3 className="text-base font-poppins font-bold text-slate-900">
                  Student & Postgraduate Researchers
                </h3>
                <p className="text-xs text-slate-500">
                  Rigorous Study Design &bull; Rapid Execution &bull; Zero Technical Barrier
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem (Abstract) */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider font-poppins">
                  The Empirical Challenge
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Postgraduate and undergraduate scholars often face demanding academic timelines with limited access to expensive institutional software licenses. Setting up reaction-time paradigms and standardized surveys traditionally required steep coding prerequisites, causing delays in empirical data collection and thesis submissions.
                </p>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200">
                  Impact: Strained research timelines and barriers to publishing early-career empirical work.
                </div>
              </div>

              {/* Solution (Abstract) */}
              <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-3">
                <div className="text-xs font-bold text-purple-700 uppercase tracking-wider font-poppins flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  How StimulX Empowers You
                </div>
                <ul className="text-xs text-slate-700 space-y-2.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">&bull;</span>
                    <span><b>Visual Experiment Flow</b>: Assemble complete protocols (participant consent, structured questionnaires, and visual tasks) via an intuitive visual canvas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">&bull;</span>
                    <span><b>Pre-Validated Paradigm Suite</b>: Instant access to standard cognitive paradigms (Stroop, Flanker, Working Memory, Attentional Orienting).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">&bull;</span>
                    <span><b>Automated Statistical Exports</b>: Export clean, standardized trial-level data and syntax scripts directly formatted for statistical packages.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('builder')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-poppins font-semibold shadow-sm transition-all"
                  >
                    Open Experiment Studio
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* B. POSTDOC SHOWCASE (Abstract, Competitor-Free)           */}
        {/* --------------------------------------------------------- */}
        {selectedPersonaTab === 'postdoc' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg">
                🔬
              </div>
              <div>
                <h3 className="text-base font-poppins font-bold text-slate-900">
                  Postdoctoral & Early-Career Fellows
                </h3>
                <p className="text-xs text-slate-500">
                  Grant Preparation &bull; Statutory Ethics Clearance &bull; Open Science Standards
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem (Abstract) */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider font-poppins">
                  The Empirical Challenge
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Navigating national grant applications and institutional ethics committee requirements across multilingual participant cohorts can involve months of bureaucratic friction. Modern international journals also increasingly require immutable pre-registration before recruitment begins to prevent publication bias and selective reporting.
                </p>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200">
                  Impact: Prolonged protocol clearance windows and delayed independent grant submissions.
                </div>
              </div>

              {/* Solution (Abstract) */}
              <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-3">
                <div className="text-xs font-bold text-purple-700 uppercase tracking-wider font-poppins flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  How StimulX Empowers You
                </div>
                <ul className="text-xs text-slate-700 space-y-2.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">&bull;</span>
                    <span><b>Cryptographic Pre-Registration</b>: Generate SHA-256 hashed, immutable pre-registration certificates conforming to international open science standards.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">&bull;</span>
                    <span><b>Multilingual Statutory Consent</b>: Auto-format ethical review applications aligned with national bioethics guidelines and digital personal data protection in 22 languages.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">&bull;</span>
                    <span><b>Grant Proposal Calculator</b>: Integrated costing and manpower budget estimators calibrated to official agency funding tiers.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('ethics')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-poppins font-semibold shadow-sm transition-all"
                  >
                    Open Ethics & Grants Suite
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* C. SCIENTIST SHOWCASE (Abstract, Competitor-Free)         */}
        {/* --------------------------------------------------------- */}
        {selectedPersonaTab === 'scientist' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg">
                🏛️
              </div>
              <div>
                <h3 className="text-base font-poppins font-bold text-slate-900">
                  Principal Investigators & Laboratory Directors
                </h3>
                <p className="text-xs text-slate-500">
                  Care Models &bull; Pragmatic RCTs &bull; National Replication &bull; Sovereign Data
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem (Abstract) */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider font-poppins">
                  The Empirical Challenge
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Coordinating multi-centre clinical and behavioural trials involves significant infrastructural overhead. Deploying stepped models of care in community healthcare facilities often requires custom databases, while hosting sensitive patient data on overseas cloud servers presents severe data sovereignty and compliance vulnerabilities under national privacy laws.
                </p>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200">
                  Impact: High recurring overheads, regulatory audit exposure, and non-standardized multi-site trial reporting.
                </div>
              </div>

              {/* Solution (Abstract) */}
              <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-3">
                <div className="text-xs font-bold text-purple-700 uppercase tracking-wider font-poppins flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  How StimulX Empowers You
                </div>
                <ul className="text-xs text-slate-700 space-y-2.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">&bull;</span>
                    <span><b>Models of Care & Adaptive RCT Studio</b>: Benchmark evidence-based care architectures, iterate stepped-care tiers for regional clinics, and generate publication-standard <b>CONSORT 2010 flow diagrams</b>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">&bull;</span>
                    <span><b>Clinical Trial Registry Exporter</b>: 1-click dossier export formatted for national and international clinical trial registries.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">&bull;</span>
                    <span><b>Sovereign Data Architecture</b>: Strict domestic data residency with cryptographic tokenized IDs and audit-ready governance trails.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('care_rct')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-poppins font-semibold shadow-sm transition-all"
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
      {/* 3. PLATFORM ARCHITECTURE BANNER (Plain White)                 */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-5xl mx-auto px-6 pb-16 w-full">
        <div className="p-6 md:p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-base font-poppins font-bold text-slate-900">
              Ready to design or pilot an experiment?
            </h3>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              StimulX unifies the complete empirical research lifecycle: statutory ethics documentation, visual task building, millisecond runtime execution, tidy data export, and clinical care trial modeling.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('builder')}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-poppins font-semibold rounded-lg shadow-sm transition-all"
            >
              Enter Experiment Studio
            </button>
            <button
              onClick={() => onNavigate('care_rct')}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-poppins font-medium rounded-lg transition-all"
            >
              Care Models & RCTs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

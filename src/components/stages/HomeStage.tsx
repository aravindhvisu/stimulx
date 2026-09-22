"use client";

import React from "react";
import { StageId } from "@/types";
import {
  Lightbulb,
  ShieldCheck,
  LayoutGrid,
  Users,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
  Globe2,
} from "lucide-react";

interface HomeStageProps {
  onNavigate: (stage: StageId) => void;
}

export function HomeStage({ onNavigate }: HomeStageProps) {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#1a1633] text-white">
      {/* Hero Section */}
      <div className="relative px-8 md:px-12 pt-12 pb-8 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(232,133,43,0.08)_1.5px,transparent_1.5px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-4xl relative z-10">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#e8852b] mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8852b] animate-pulse" />
            stimulx.sc — Open Indian Behavioural Science
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-semibold leading-tight text-white mb-4">
            From a spark of curiosity <br />
            to <em className="text-[#f9a94e] not-italic">published science</em> — <br />
            one open platform.
          </h1>

          <p className="text-[14px] text-white/60 max-w-2xl leading-relaxed font-light mb-6">
            A non-profit research infrastructure for Indian psychologists, neuroscientists,
            students, and service users. Built for NIMHANS, SCARF, TISS, Delhi University — and every researcher who comes after.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[11px] px-3 py-1 rounded-full bg-[#e8852b]/15 border border-[#e8852b]/30 text-[#f9a94e] font-medium flex items-center gap-1">
              ✦ Non-profit · stimulx.sc
            </span>
            <span className="text-[11px] px-3 py-1 rounded-full border border-white/10 text-white/60">
              22 Indian languages
            </span>
            <span className="text-[11px] px-3 py-1 rounded-full border border-white/10 text-white/60">
              IEC / ICMR 2017 Ethics
            </span>
            <span className="text-[11px] px-3 py-1 rounded-full border border-white/10 text-white/60">
              DPDP Act 2023 Compliant
            </span>
            <span className="text-[11px] px-3 py-1 rounded-full border border-white/10 text-white/60">
              India (Mumbai) Hosted
            </span>
          </div>
        </div>
      </div>

      {/* Lifecycle Cards Grid */}
      <div className="px-8 md:px-12 py-8 max-w-7xl w-full mx-auto">
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">
          Research Lifecycle Navigation
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Stage 0 */}
          <div
            onClick={() => onNavigate("brainstorm")}
            className="group bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#e8852b]/40 rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="text-[10px] font-mono text-[#e8852b]/80 mb-2">STAGE 0</div>
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center mb-3">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="text-[13px] font-semibold text-white mb-1 group-hover:text-[#f9a94e] transition-colors">
                Brainstorm
              </h3>
              <p className="text-[11px] text-white/40 leading-relaxed">
                Curiosity → research questions, gaps & feasibility checks.
              </p>
            </div>
            <div className="mt-4 flex items-center text-[11px] text-[#e8852b] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Launch stage <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>

          {/* Stage 1 */}
          <div
            onClick={() => onNavigate("ethics")}
            className="group bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-blue-400/40 rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="text-[10px] font-mono text-blue-400 mb-2">STAGE 1</div>
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-[13px] font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
                Ethics & IEC
              </h3>
              <p className="text-[11px] text-white/40 leading-relaxed">
                ICMR application · 22 language consent · DPDP compliance.
              </p>
            </div>
            <div className="mt-4 flex items-center text-[11px] text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Open IEC builder <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>

          {/* Stage 2 */}
          <div
            onClick={() => onNavigate("design")}
            className="group bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="text-[10px] font-mono text-amber-400 mb-2">STAGE 2</div>
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <h3 className="text-[13px] font-semibold text-white mb-1 group-hover:text-amber-300 transition-colors">
                Design & Methods
              </h3>
              <p className="text-[11px] text-white/40 leading-relaxed">
                Quant + Qual protocols · 120+ clinical scale library.
              </p>
            </div>
            <div className="mt-4 flex items-center text-[11px] text-amber-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Design protocol <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>

          {/* Stage 3 */}
          <div
            onClick={() => onNavigate("recruit")}
            className="group bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/40 rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="text-[10px] font-mono text-emerald-400 mb-2">STAGE 3</div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-[13px] font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                Recruitment
              </h3>
              <p className="text-[11px] text-white/40 leading-relaxed">
                Rights-first outreach · Indic WhatsApp messages · Debrief.
              </p>
            </div>
            <div className="mt-4 flex items-center text-[11px] text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Generate assets <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>

          {/* Community */}
          <div
            onClick={() => onNavigate("community")}
            className="group bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="text-[10px] font-mono text-purple-300 mb-2">COMMUNITY</div>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-[13px] font-semibold text-purple-200 mb-1">
                Community Hub
              </h3>
              <p className="text-[11px] text-purple-200/60 leading-relaxed">
                Open courses, peer review & lived-experience contributions.
              </p>
            </div>
            <div className="mt-4 flex items-center text-[11px] text-purple-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Enter hub <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

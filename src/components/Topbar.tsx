"use client";

import React from "react";
import { StageId } from "@/types";
import { Check, ChevronRight, BookmarkCheck, ArrowRight } from "lucide-react";

interface TopbarProps {
  currentStage: StageId;
  completedStages: Set<StageId>;
  onNavigate: (stage: StageId) => void;
  onAdvance: () => void;
  onSave: () => void;
}

const STAGES: { id: StageId; label: string; num: string }[] = [
  { id: "home", label: "Home", num: "⌂" },
  { id: "brainstorm", label: "Brainstorm", num: "0" },
  { id: "ethics", label: "Ethics", num: "1" },
  { id: "design", label: "Design", num: "2" },
  { id: "recruit", label: "Recruitment", num: "3" },
  { id: "builder", label: "Experiment", num: "4" },
  { id: "pool", label: "Participant Pool", num: "5" },
  { id: "analysis", label: "Analysis", num: "6" },
  { id: "writing", label: "Write & Review", num: "7" },
  { id: "publish", label: "Publish", num: "8" },
];

export function Topbar({
  currentStage,
  completedStages,
  onNavigate,
  onAdvance,
  onSave,
}: TopbarProps) {
  return (
    <header className="h-[52px] shrink-0 bg-[#1a1633] flex items-center px-3.5 border-b border-white/10 z-50 select-none">
      {/* Logo */}
      <div
        className="flex items-center gap-2 text-[15px] font-semibold text-white pr-4 border-r border-white/10 mr-2 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => onNavigate("home")}
      >
        <div className="w-[26px] height-[26px] bg-[#e8852b] rounded-lg flex items-center justify-center p-1.5 shadow-sm">
          <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
            <circle cx="7" cy="7" r="2.5" fill="#fff" />
            <circle cx="7" cy="2" r="1.2" fill="rgba(255,255,255,.6)" />
            <circle cx="7" cy="12" r="1.2" fill="rgba(255,255,255,.6)" />
            <circle cx="2" cy="7" r="1.2" fill="rgba(255,255,255,.6)" />
            <circle cx="12" cy="7" r="1.2" fill="rgba(255,255,255,.6)" />
          </svg>
        </div>
        <span>Stimulx</span>
        <span className="text-[11px] opacity-45 font-mono">.sc</span>
      </div>

      <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 mr-2">
        Non-profit
      </div>

      {/* Breadcrumb Steps */}
      <nav className="flex items-center gap-1 flex-1 overflow-x-auto py-1 px-2 no-scrollbar">
        {STAGES.map((s, idx) => {
          const isActive = currentStage === s.id;
          const isDone = completedStages.has(s.id);

          return (
            <React.Fragment key={s.id}>
              {idx > 0 && <ChevronRight className="w-3 h-3 text-white/20 shrink-0" />}
              <button
                type="button"
                onClick={() => onNavigate(s.id)}
                className={`flex items-center gap-1.5 h-[34px] px-2.5 rounded-md text-[11px] font-medium transition-all shrink-0 ${
                  isActive
                    ? "bg-white/10 text-white font-semibold"
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 transition-colors ${
                    isDone
                      ? "bg-emerald-500 text-white"
                      : isActive
                      ? "bg-[#e8852b] text-white"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {isDone ? <Check className="w-2.5 h-2.5" /> : s.num}
                </div>
                <span>{s.label}</span>
              </button>
            </React.Fragment>
          );
        })}

        {/* Community Tab */}
        <button
          type="button"
          onClick={() => onNavigate("community")}
          className={`flex items-center gap-1.5 h-[34px] px-3 ml-2 rounded-md text-[11px] font-medium border transition-all shrink-0 ${
            currentStage === "community"
              ? "bg-purple-500/20 border-purple-500/40 text-purple-200"
              : "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/80"
          }`}
        >
          <span className="text-purple-400 font-bold">✦</span>
          <span>Community</span>
        </button>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 ml-2">
        <button
          type="button"
          onClick={onSave}
          className="h-[30px] px-3 rounded-md border border-white/15 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 text-[12px] font-medium flex items-center gap-1.5 transition-colors"
        >
          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Saved</span>
        </button>
        <button
          type="button"
          onClick={onAdvance}
          className="h-[30px] px-3.5 rounded-md bg-[#e8852b] hover:bg-[#f9a94e] text-white text-[12px] font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <span>Next stage</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}

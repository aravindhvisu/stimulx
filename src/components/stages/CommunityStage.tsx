"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  MessageCircle,
  Hammer,
  Heart,
  User,
  Award,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface CommunityStageProps {
  onToast: (msg: string) => void;
}

export function CommunityStage({ onToast }: CommunityStageProps) {
  const [activeTab, setActiveTab] = useState<"learn" | "share" | "build" | "service">("learn");

  return (
    <div className="flex-1 flex overflow-hidden bg-[#f5f3ef]">
      {/* Left Sidebar */}
      <aside className="w-[218px] shrink-0 bg-white border-r border-[#1a1633]/10 flex flex-col overflow-y-auto">
        <div className="px-3.5 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#a09ec0]">
          Community Hub
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("learn")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "learn"
              ? "bg-purple-50 border-purple-600 text-purple-700 font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 shrink-0" />
          <span>Learn</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("share")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "share"
              ? "bg-purple-50 border-purple-600 text-purple-700 font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Share & Discuss</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("build")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "build"
              ? "bg-purple-50 border-purple-600 text-purple-700 font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <Hammer className="w-3.5 h-3.5 shrink-0" />
          <span>Build Together</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("service")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "service"
              ? "bg-purple-50 border-purple-600 text-purple-700 font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <Heart className="w-3.5 h-3.5 shrink-0" />
          <span>Service Users</span>
        </button>
      </aside>

      {/* Center Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">
        <header>
          <div className="text-[10px] font-bold uppercase tracking-widest text-purple-700 mb-1">
            Community Infrastructure
          </div>
          <h2 className="text-xl font-bold text-[#1a1633]">Open Indian Behavioural Science Commons</h2>
          <p className="text-[13px] text-[#6b6890] mt-1">
            Free lifelong learning · Peer discussion · Multilingual scale translation · Patient & public involvement
          </p>
        </header>

        {activeTab === "learn" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div
                onClick={() => onToast("Research Methods 101 course launched")}
                className="bg-white border border-[#1a1633]/10 rounded-xl p-4 cursor-pointer hover:border-purple-300 transition-all space-y-2"
              >
                <div className="text-2xl">🎓</div>
                <h4 className="text-[13px] font-bold text-[#1a1633]">Research Methods 101</h4>
                <p className="text-[11px] text-[#6b6890] leading-relaxed">
                  For students and early career researchers. Experimental and observational design fundamentals.
                </p>
                <div className="flex gap-1.5 pt-1">
                  <span className="text-[9px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Hindi</span>
                  <span className="text-[9px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Tamil</span>
                  <span className="text-[9px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">English</span>
                </div>
              </div>

              <div
                onClick={() => onToast("ICMR Ethics Certification course launched")}
                className="bg-white border border-[#1a1633]/10 rounded-xl p-4 cursor-pointer hover:border-blue-300 transition-all space-y-2"
              >
                <div className="text-2xl">🛡️</div>
                <h4 className="text-[13px] font-bold text-[#1a1633]">Ethics in Indian Science</h4>
                <p className="text-[11px] text-[#6b6890] leading-relaxed">
                  ICMR 2017 standards, DPDP Act 2023 compliance, vulnerable populations, and IEC application preparation.
                </p>
                <div className="flex gap-1.5 pt-1">
                  <span className="text-[9px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">All 22 Languages</span>
                </div>
              </div>

              <div
                onClick={() => onToast("Indian Psychology Statistics course launched")}
                className="bg-white border border-[#1a1633]/10 rounded-xl p-4 cursor-pointer hover:border-emerald-300 transition-all space-y-2"
              >
                <div className="text-2xl">📊</div>
                <h4 className="text-[13px] font-bold text-[#1a1633]">Statistics for Behavioural Sciences</h4>
                <p className="text-[11px] text-[#6b6890] leading-relaxed">
                  ANOVA, linear mixed models, psychometric reliability, and effect size calculation with Indian datasets.
                </p>
                <div className="flex gap-1.5 pt-1">
                  <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">R & jamovi</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "share" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-[13px] font-semibold text-[#1a1633]">Active Research Discussions</h3>
              <button
                type="button"
                onClick={() => onToast("Compose discussion topic modal opened")}
                className="h-[28px] px-3 bg-[#e8852b] hover:bg-[#f9a94e] text-white text-[11px] font-semibold rounded"
              >
                + Start Discussion
              </button>
            </div>

            <div className="space-y-2.5">
              <div
                onClick={() => onToast("Discussion thread opened")}
                className="p-3 bg-[#f5f3ef] border border-[#1a1633]/10 rounded-lg hover:border-purple-300 cursor-pointer transition-colors"
              >
                <div className="flex justify-between">
                  <h4 className="text-[12px] font-bold text-[#1a1633]">
                    How do I choose between within-subjects and between-subjects for my Stroop study?
                  </h4>
                  <span className="text-[9px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Methods
                  </span>
                </div>
                <div className="text-[11px] text-[#6b6890] mt-1">
                  Posted by Meena S. (MSc student, Madras University) · 7 replies
                </div>
              </div>

              <div
                onClick={() => onToast("Discussion thread opened")}
                className="p-3 bg-[#f5f3ef] border border-[#1a1633]/10 rounded-lg hover:border-purple-300 cursor-pointer transition-colors"
              >
                <div className="flex justify-between">
                  <h4 className="text-[12px] font-bold text-[#1a1633]">
                    What it felt like to be a participant — and why I joined the Stimulx pool
                  </h4>
                  <span className="text-[9px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                    Lived Experience
                  </span>
                </div>
                <div className="text-[11px] text-[#6b6890] mt-1">
                  Posted by Ravi K. (Service User, Chennai) · 18 replies
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "build" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-3">
            <h3 className="text-[13px] font-semibold text-[#1a1633]">Open Collaborative Tasks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                onClick={() => onToast("Task claimed: Kannada GAD-7 translation ✓")}
                className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-lg cursor-pointer hover:border-purple-400"
              >
                <span className="text-[9px] font-bold uppercase bg-purple-200 text-purple-900 px-2 py-0.5 rounded">
                  Translation Open
                </span>
                <h4 className="text-[12px] font-bold text-purple-950 mt-1.5">
                  Translate GAD-7 Anxiety Scale to Kannada
                </h4>
                <p className="text-[11px] text-[#6b6890] mt-1">
                  Requires bilingual Kannada/English psychology student or faculty for back-translation.
                </p>
              </div>

              <div
                onClick={() => onToast("Task claimed: Tamil Word Norms Database ✓")}
                className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg cursor-pointer hover:border-blue-400"
              >
                <span className="text-[9px] font-bold uppercase bg-blue-200 text-blue-900 px-2 py-0.5 rounded">
                  Stimulus Norms
                </span>
                <h4 className="text-[12px] font-bold text-blue-950 mt-1.5">
                  Build Tamil Word Frequency Norms (500 Words)
                </h4>
                <p className="text-[11px] text-[#6b6890] mt-1">
                  Curating valence, arousal, and length-matched cognitive word lists for memory experiments.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "service" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-6 space-y-4">
            <div className="bg-[#1a1633] text-white p-5 rounded-xl">
              <blockquote className="font-serif italic text-base leading-relaxed text-white/90">
                "Your experience of living with mental health challenges is knowledge. Stimulx is a place where that knowledge shapes research — not just as data points, but as human insight."
              </blockquote>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#e8852b] mt-3">
                Stimulx Founding Charter
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div
                onClick={() => onToast("Peer researcher training program loaded")}
                className="p-3.5 bg-teal-50 border border-teal-200 rounded-lg cursor-pointer"
              >
                <h4 className="text-[12px] font-bold text-teal-900">
                  Peer Researcher Training
                </h4>
                <p className="text-[11px] text-teal-800 mt-1">
                  Free 4-module certification enabling individuals with lived experience to co-design studies and review consent language.
                </p>
              </div>

              <div
                onClick={() => onToast("Consent language feedback portal opened")}
                className="p-3.5 bg-purple-50 border border-purple-200 rounded-lg cursor-pointer"
              >
                <h4 className="text-[12px] font-bold text-purple-900">
                  Consent Language Review
                </h4>
                <p className="text-[11px] text-purple-800 mt-1">
                  Ensure our consent forms are respectful, free of psychiatric jargon, and truly empowering for participants.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Right Rail */}
      <aside className="w-[268px] shrink-0 bg-white border-l border-[#1a1633]/10 p-4 space-y-4 overflow-y-auto">
        <div>
          <div className="text-[13px] font-semibold text-[#1a1633]">Community Stats</div>
          <div className="text-[11px] text-[#a09ec0] mb-3">Live verified contributors</div>

          <div className="space-y-2">
            <div className="bg-purple-50 border border-purple-200/60 p-2.5 rounded-lg">
              <div className="text-xl font-bold font-mono text-purple-700">842</div>
              <div className="text-[10px] uppercase font-bold text-purple-900/60">
                Registered Researchers
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200/60 p-2.5 rounded-lg">
              <div className="text-xl font-bold font-mono text-emerald-700">4,820</div>
              <div className="text-[10px] uppercase font-bold text-emerald-900/60">
                Pool Participants
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200/60 p-2.5 rounded-lg">
              <div className="text-xl font-bold font-mono text-blue-700">38</div>
              <div className="text-[10px] uppercase font-bold text-blue-900/60">
                Active Research Studies
              </div>
            </div>
            <div className="bg-teal-50 border border-teal-200/60 p-2.5 rounded-lg">
              <div className="text-xl font-bold font-mono text-teal-700">214</div>
              <div className="text-[10px] uppercase font-bold text-teal-900/60">
                Service User Co-Researchers
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-[#1a1633]/10">
          <div className="text-[11px] font-bold uppercase text-[#a09ec0] mb-2">
            Partner Institutions
          </div>
          <div className="text-[11px] text-[#6b6890] space-y-1.5">
            <div className="flex justify-between">
              <span>NIMHANS Bengaluru</span>
              <span className="font-mono font-bold">128</span>
            </div>
            <div className="flex justify-between">
              <span>TISS Mumbai</span>
              <span className="font-mono font-bold">94</span>
            </div>
            <div className="flex justify-between">
              <span>SCARF Chennai</span>
              <span className="font-mono font-bold">67</span>
            </div>
            <div className="flex justify-between">
              <span>Delhi University</span>
              <span className="font-mono font-bold">58</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

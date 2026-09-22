"use client";

import React, { useState } from "react";
import { IdeaItem, StageId } from "@/types";
import {
  Lightbulb,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Plus,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

interface BrainstormStageProps {
  onAdvance: () => void;
  onToast: (msg: string) => void;
}

export function BrainstormStage({ onAdvance, onToast }: BrainstormStageProps) {
  const [activeTab, setActiveTab] = useState<"ideas" | "journals" | "gaps" | "feasibility">("ideas");
  const [ideas, setIdeas] = useState<IdeaItem[]>([
    {
      id: "1",
      title: "Stroop in Hindi-English bilinguals",
      description:
        "Does language dominance modulate Stroop interference in Hindi-English code-switchers?",
      tags: ["Cognitive", "Bilingualism"],
      papersCount: 3,
      gapIdentified: true,
      status: "ready",
    },
    {
      id: "2",
      title: "Stigma in rural Tamil Nadu",
      description:
        "How does mental health stigma differ between urban Chennai and rural Tirunelveli populations?",
      tags: ["Stigma", "Mixed methods"],
      papersCount: 5,
      gapIdentified: true,
      status: "draft",
    },
    {
      id: "3",
      title: "Caregiver burden — schizophrenia",
      description:
        "Lived experience of family caregivers of people with schizophrenia in South India — qualitative exploration.",
      tags: ["Qualitative", "SCARF relevant"],
      papersCount: 2,
      gapIdentified: true,
      status: "draft",
    },
  ]);

  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>("1");

  const handleAddIdea = () => {
    if (!newIdeaTitle.trim()) return;
    const newIdea: IdeaItem = {
      id: Date.now().toString(),
      title: newIdeaTitle,
      description: "Custom hypothesis created by researcher on Stimulx.",
      tags: ["Custom", "New Idea"],
      papersCount: 0,
      gapIdentified: false,
      status: "draft",
    };
    setIdeas([newIdea, ...ideas]);
    setSelectedIdeaId(newIdea.id);
    setNewIdeaTitle("");
    onToast("New idea board created ✓");
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#f5f3ef]">
      {/* Left Sidebar */}
      <aside className="w-[218px] shrink-0 bg-white border-r border-[#1a1633]/10 flex flex-col overflow-y-auto">
        <div className="px-3.5 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#a09ec0]">
          Workspace
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("ideas")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "ideas"
              ? "bg-[#e8852b]/10 border-[#e8852b] text-[#e8852b] font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 shrink-0" />
          <span>Idea Board</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("journals")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "journals"
              ? "bg-[#e8852b]/10 border-[#e8852b] text-[#e8852b] font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 shrink-0" />
          <span>Open Journals</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("gaps")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "gaps"
              ? "bg-[#e8852b]/10 border-[#e8852b] text-[#e8852b] font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Research Gaps</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("feasibility")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "feasibility"
              ? "bg-[#e8852b]/10 border-[#e8852b] text-[#e8852b] font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 shrink-0" />
          <span>Feasibility Check</span>
        </button>
      </aside>

      {/* Center Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <header className="mb-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#e8852b] mb-1">
            Stage 0 — Brainstorm
          </div>
          <h2 className="text-xl font-bold text-[#1a1633]">From Curiosity to Research Question</h2>
          <p className="text-[13px] text-[#6b6890] mt-1">
            Capture ideas · Link to Indian literature · Identify national gaps · Verify feasibility
          </p>
        </header>

        {activeTab === "ideas" && (
          <div className="space-y-4">
            {/* Quick Add Bar */}
            <div className="bg-white border border-[#1a1633]/10 rounded-xl p-3 flex gap-2">
              <input
                type="text"
                placeholder="Enter a new research question (e.g. Cognitive bias in multilingual elders)..."
                value={newIdeaTitle}
                onChange={(e) => setNewIdeaTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddIdea()}
                className="flex-1 bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg px-3 py-1.5 text-[13px] text-[#1a1633] outline-none focus:border-[#e8852b] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={handleAddIdea}
                className="h-[32px] px-3.5 bg-[#e8852b] hover:bg-[#f9a94e] text-white text-[12px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add idea</span>
              </button>
            </div>

            {/* Ideas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {ideas.map((idea) => {
                const isSelected = selectedIdeaId === idea.id;
                return (
                  <div
                    key={idea.id}
                    onClick={() => {
                      setSelectedIdeaId(idea.id);
                      onToast(`Idea selected: ${idea.title}`);
                    }}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#fef3e8] border-[#e8852b]/40 ring-2 ring-[#e8852b]/20"
                        : "bg-white border-[#1a1633]/10 hover:border-[#1a1633]/20"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#e8852b] mb-1.5">
                      <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{idea.title}</span>
                    </div>
                    <p className="text-[11px] text-[#2e2a50] leading-relaxed line-clamp-2">
                      {idea.description}
                    </p>
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {idea.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[#e8852b]/10 text-[#e8852b]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="text-[10px] text-[#a09ec0] mt-3 pt-2 border-t border-[#1a1633]/5 flex justify-between items-center">
                      <span>{idea.papersCount} linked papers</span>
                      <span className="text-emerald-600 font-medium">
                        {idea.gapIdentified ? "Gap confirmed ✓" : "Exploring"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Concept Map Visualizer */}
            <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5">
              <div className="text-[13px] font-semibold text-[#1a1633] mb-1">
                Concept Map — Stroop Bilingualism
              </div>
              <div className="text-[11px] text-[#a09ec0] mb-4">
                Dynamic mental model mapped to Indian linguistic demographics
              </div>

              <div className="bg-[#f5f3ef] rounded-xl p-6 flex flex-wrap gap-2.5 items-center justify-center min-h-[110px]">
                <span className="bg-[#1a1633] text-white px-3.5 py-1.5 rounded-full text-[12px] font-semibold shadow-sm">
                  Stroop Effect
                </span>
                <span className="text-[#a09ec0] font-mono">↔</span>
                <span
                  onClick={() => onToast("Bilingualism literature filtered")}
                  className="bg-blue-100 text-blue-700 px-3.5 py-1.5 rounded-full text-[12px] font-medium cursor-pointer hover:bg-blue-200 transition-colors"
                >
                  Bilingualism
                </span>
                <span className="text-[#a09ec0] font-mono">↔</span>
                <span
                  onClick={() => onToast("Code-switching neural dynamics loaded")}
                  className="bg-purple-100 text-purple-700 px-3.5 py-1.5 rounded-full text-[12px] font-medium cursor-pointer hover:bg-purple-200 transition-colors"
                >
                  Code-switching
                </span>
                <span className="text-[#a09ec0] font-mono">↔</span>
                <span
                  onClick={() => onToast("Indian Languages cognitive norm DB")}
                  className="bg-[#e8852b]/15 text-[#e8852b] px-3.5 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer hover:bg-[#e8852b]/25 transition-colors"
                >
                  Indian Languages (Devanagari/Dravidian)
                </span>
                <span className="text-[#a09ec0] font-mono">↔</span>
                <span
                  onClick={() => onToast("Executive control literature")}
                  className="bg-teal-100 text-teal-700 px-3.5 py-1.5 rounded-full text-[12px] font-medium cursor-pointer hover:bg-teal-200 transition-colors"
                >
                  Cognitive Control
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "journals" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-[13px] font-semibold text-[#1a1633]">
                  Open Access Literature — India Relevant
                </h3>
                <p className="text-[11px] text-[#a09ec0]">
                  Queried across PubMed Central, PsyArXiv, and Indian Journal of Psychological Medicine
                </p>
              </div>
              <button
                type="button"
                onClick={() => onToast("Connected to OpenDOAR & PubMed")}
                className="h-[28px] px-3 bg-[#1a1633] text-white text-[11px] font-medium rounded-md hover:bg-[#e8852b] transition-colors"
              >
                Search all (PubMed)
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="bg-[#f5f3ef] border border-[#1a1633]/10 rounded-lg p-3.5 hover:border-[#e8852b]/30 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-[12px] font-semibold text-[#1a1633]">
                    Stroop interference in Hindi: Normative data from 200 Indian adults
                  </h4>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                    Open Access
                  </span>
                </div>
                <p className="text-[11px] text-[#6b6890] mt-1">
                  Kar, B.R. et al. (2022) · Indian Journal of Psychological Medicine · NIMHANS cohort
                </p>
                <div className="flex gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={() => onToast("Linked to Stroop Idea ✓")}
                    className="h-[24px] px-2.5 bg-white border border-[#1a1633]/15 text-[11px] font-medium rounded text-[#1a1633] hover:bg-[#f5f3ef]"
                  >
                    Link to idea
                  </button>
                  <button
                    type="button"
                    onClick={() => onToast("Opening PDF preview...")}
                    className="h-[24px] px-2.5 bg-white border border-[#1a1633]/15 text-[11px] font-medium rounded text-[#1a1633] hover:bg-[#f5f3ef]"
                  >
                    Read PDF
                  </button>
                </div>
              </div>

              <div className="bg-[#f5f3ef] border border-[#1a1633]/10 rounded-lg p-3.5 hover:border-[#e8852b]/30 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-[12px] font-semibold text-[#1a1633]">
                    Caregiver burden and family functioning in schizophrenia: South Indian context
                  </h4>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                    Preprint (PsyArXiv)
                  </span>
                </div>
                <p className="text-[11px] text-[#6b6890] mt-1">
                  Thara, R. & Padmavati, R. (2023) · SCARF Chennai cohort
                </p>
                <div className="flex gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={() => onToast("Linked to Caregiver idea ✓")}
                    className="h-[24px] px-2.5 bg-white border border-[#1a1633]/15 text-[11px] font-medium rounded text-[#1a1633] hover:bg-[#f5f3ef]"
                  >
                    Link to idea
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "gaps" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-3">
            <div className="text-[13px] font-semibold text-[#1a1633]">
              Known Research Gaps in Indian Behavioural Science
            </div>
            <div className="text-[11px] text-[#a09ec0] mb-2">
              Community-curated priority gaps identified by Indian researchers & institutions
            </div>

            <div className="space-y-2.5">
              <div className="bg-purple-50/70 border border-purple-200 rounded-lg p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  High Priority Gap
                </span>
                <h4 className="text-[12px] font-semibold text-purple-950 mt-1.5">
                  No normative Stroop data for Dravidian language speakers
                </h4>
                <p className="text-[11px] text-[#2e2a50] mt-1">
                  Tamil, Telugu, Kannada, and Malayalam populations are severely underrepresented in cognitive normative databases (200M+ native speakers).
                </p>
                <button
                  type="button"
                  onClick={() => onToast("Gap linked to Stroop project on Stimulx!")}
                  className="mt-2.5 h-[26px] px-3 bg-[#e8852b] text-white text-[11px] font-semibold rounded hover:bg-[#f9a94e] transition-colors"
                >
                  Claim & Link to my project
                </button>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Methodology Gap
                </span>
                <h4 className="text-[12px] font-semibold text-emerald-950 mt-1.5">
                  Service user co-production in Indian mental health research
                </h4>
                <p className="text-[11px] text-[#2e2a50] mt-1">
                  Over 95% of psychiatric and psychological research in India is strictly clinician/researcher led, with near-zero patient & public involvement (PPI).
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "feasibility" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-[13px] font-semibold text-[#1a1633]">
                Project Feasibility Estimator
              </h3>
              <p className="text-[11px] text-[#a09ec0]">
                Pre-flight check before submitting IEC applications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                  Target Pool Availability
                </div>
                <select className="w-full bg-white border border-emerald-300 rounded p-1.5 text-[12px] text-emerald-950 outline-none">
                  <option>Yes — 247 verified participants on stimulx.in</option>
                  <option>Partial — requires external university recruitment</option>
                  <option>Rare clinical population</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1">
                  Ethics Complexity
                </div>
                <select className="w-full bg-white border border-blue-300 rounded p-1.5 text-[12px] text-blue-950 outline-none">
                  <option>Low — observational / non-clinical adult cognitive task</option>
                  <option>Medium — sensitive questionnaire / minor deception</option>
                  <option>High — vulnerable / psychiatric clinical cohort</option>
                </select>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-300/60 rounded-lg p-3.5 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-[12px] font-semibold text-emerald-900">
                  Feasibility Assessment: Highly Feasible on Stimulx
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                  Sufficient pool capacity (247 matching bilinguals) · Low ethics risk rating · Free hosting on Stimulx infrastructure · Estimated 30 days to complete recruitment.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Right Rail */}
      <aside className="w-[268px] shrink-0 bg-white border-l border-[#1a1633]/10 p-4 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="text-[13px] font-semibold text-[#1a1633]">Selected Hypothesis</div>
          <div className="text-[11px] text-[#a09ec0] mb-3">Active research thread</div>

          <div className="bg-[#e8852b]/10 border border-[#e8852b]/30 rounded-lg p-3">
            <div className="text-[12px] font-semibold text-[#e8852b]">
              Stroop — Hindi bilinguals
            </div>
            <div className="text-[10px] text-[#6b6890] mt-1">
              3 papers · Gap confirmed · Feasibility ✓
            </div>
            <span className="inline-block mt-2 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              Ready for Stage 1
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onAdvance}
          className="w-full h-[36px] bg-[#1a1633] hover:bg-[#e8852b] text-white text-[12px] font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors mt-6 shadow-sm"
        >
          <span>Move to Stage 1 (Ethics)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </aside>
    </div>
  );
}

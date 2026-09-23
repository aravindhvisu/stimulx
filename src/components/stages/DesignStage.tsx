"use client";

import React, { useState } from "react";
import {
  BarChart3,
  MessageSquare,
  GitFork,
  BookMarked,
  Layers,
  ArrowRight,
  Check,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { ScaleMarketplaceModal } from "@/components/scales/ScaleMarketplaceModal";

interface DesignStageProps {
  onAdvance: () => void;
  onToast: (msg: string) => void;
}

export function DesignStage({ onAdvance, onToast }: DesignStageProps) {
  const [method, setMethod] = useState<"quant" | "qual" | "mixed">("quant");
  const [designType, setDesignType] = useState("Within-subjects (repeated measures)");
  const [groupsCount, setGroupsCount] = useState("2");
  const [selectedScales, setSelectedScales] = useState<string[]>(["phq9"]);
  const [showMarketplace, setShowMarketplace] = useState(false);

  const toggleScale = (id: string, name: string) => {
    if (selectedScales.includes(id)) {
      setSelectedScales(selectedScales.filter((s) => s !== id));
      onToast(`Removed ${name} from protocol`);
    } else {
      setSelectedScales([...selectedScales, id]);
      onToast(`Added ${name} to protocol ✓`);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#f5f3ef]">
      <ScaleMarketplaceModal
        isOpen={showMarketplace}
        onClose={() => setShowMarketplace(false)}
        onToast={onToast}
      />
      {/* Left Sidebar */}
      <aside className="w-[218px] shrink-0 bg-white border-r border-[#1a1633]/10 flex flex-col overflow-y-auto">
        <div className="px-3.5 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#a09ec0]">
          Study Design
        </div>

        <button
          type="button"
          className="flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 bg-[#e8852b]/10 border-[#e8852b] text-[#e8852b] font-semibold"
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span>Protocol & Measures</span>
        </button>

        <button
          type="button"
          onClick={() => setShowMarketplace(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 border-transparent text-[#e8852b] hover:bg-[#e8852b]/10"
        >
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
          <span>Scale Marketplace</span>
        </button>

        <button
          type="button"
          onClick={() => setShowMarketplace(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 border-transparent text-[#6b6890] hover:bg-[#f5f3ef]"
        >
          <BookMarked className="w-3.5 h-3.5 shrink-0" />
          <span>Scale Library (120+)</span>
        </button>

        <button
          type="button"
          onClick={() => onToast("G*Power statistical analysis loaded")}
          className="flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 border-transparent text-[#6b6890] hover:bg-[#f5f3ef]"
        >
          <BarChart3 className="w-3.5 h-3.5 shrink-0" />
          <span>Power Analysis (G*Power)</span>
        </button>
      </aside>

      {/* Center Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">
        <header>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#e8852b] mb-1">
            Stage 2 — Design & Methods
          </div>
          <h2 className="text-xl font-bold text-[#1a1633]">Methodology, Protocols & Scale Library</h2>
          <p className="text-[13px] text-[#6b6890] mt-1">
            Support for Quantitative, Qualitative & Mixed Methods · Clinical scales validated in Indian languages
          </p>
        </header>

        {/* Methodology Selector */}
        <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5">
          <div className="text-[13px] font-semibold text-[#1a1633] mb-3">Methodology Archetype</div>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setMethod("quant");
                onToast("Method set to Quantitative");
              }}
              className={`p-3.5 rounded-xl border text-center transition-all ${
                method === "quant"
                  ? "bg-blue-50 border-blue-500 text-blue-900 shadow-sm ring-1 ring-blue-500"
                  : "bg-[#f5f3ef] border-transparent text-[#6b6890] hover:bg-white"
              }`}
            >
              <div className="text-xl mb-1">📊</div>
              <div className="text-[12px] font-bold">Quantitative</div>
              <div className="text-[10px] opacity-75">Experiments, surveys, RT tasks</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setMethod("qual");
                onToast("Method set to Qualitative");
              }}
              className={`p-3.5 rounded-xl border text-center transition-all ${
                method === "qual"
                  ? "bg-teal-50 border-teal-500 text-teal-900 shadow-sm ring-1 ring-teal-500"
                  : "bg-[#f5f3ef] border-transparent text-[#6b6890] hover:bg-white"
              }`}
            >
              <div className="text-xl mb-1">💬</div>
              <div className="text-[12px] font-bold">Qualitative</div>
              <div className="text-[10px] opacity-75">Interviews, thematic analysis, IPA</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setMethod("mixed");
                onToast("Method set to Mixed Methods");
              }}
              className={`p-3.5 rounded-xl border text-center transition-all ${
                method === "mixed"
                  ? "bg-purple-50 border-purple-500 text-purple-900 shadow-sm ring-1 ring-purple-500"
                  : "bg-[#f5f3ef] border-transparent text-[#6b6890] hover:bg-white"
              }`}
            >
              <div className="text-xl mb-1">🔀</div>
              <div className="text-[12px] font-bold">Mixed Methods</div>
              <div className="text-[10px] opacity-75">Sequential explanatory, embedded</div>
            </button>
          </div>

          {/* Conditional Design Controls */}
          {method === "quant" && (
            <div className="mt-4 pt-4 border-t border-[#1a1633]/10 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#a09ec0] mb-1">
                    Design Structure
                  </label>
                  <select
                    value={designType}
                    onChange={(e) => setDesignType(e.target.value)}
                    className="w-full bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg p-2 text-[12px] outline-none"
                  >
                    <option>Within-subjects (repeated measures)</option>
                    <option>Between-subjects</option>
                    <option>Mixed 2x2 Factorial</option>
                    <option>Cross-sectional Cohort</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#a09ec0] mb-1">
                    Primary Dependent Variable (DV)
                  </label>
                  <select className="w-full bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg p-2 text-[12px] outline-none">
                    <option>Reaction time (milliseconds)</option>
                    <option>Accuracy (% correct)</option>
                    <option>Composite Incongruence Cost (ms)</option>
                    <option>Psychometric Scale Score</option>
                  </select>
                </div>
              </div>

              {/* Group List */}
              <div className="space-y-2 mt-2">
                <div className="text-[11px] font-bold uppercase text-[#a09ec0]">
                  Experimental Conditions
                </div>
                <div className="flex items-center gap-2 bg-blue-50/70 border border-blue-200 rounded-lg p-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    A
                  </span>
                  <input
                    defaultValue="Stroop — Hindi stimuli (40 trials)"
                    className="flex-1 bg-transparent text-[12px] font-medium text-blue-950 outline-none"
                  />
                  <span className="text-[11px] text-blue-700 font-mono">Devanagari</span>
                </div>

                <div className="flex items-center gap-2 bg-[#e8852b]/10 border border-[#e8852b]/30 rounded-lg p-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#e8852b] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    B
                  </span>
                  <input
                    defaultValue="Stroop — English stimuli (40 trials)"
                    className="flex-1 bg-transparent text-[12px] font-medium text-[#2e2a50] outline-none"
                  />
                  <span className="text-[11px] text-[#e8852b] font-mono">Latin</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scale Library */}
        <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-[13px] font-semibold text-[#1a1633]">
                Standardized Psychometric Scales
              </h3>
              <p className="text-[11px] text-[#a09ec0]">
                Pre-licensed for non-profit academic research · ICD-11 aligned scoring
              </p>
            </div>
            <button
              type="button"
              onClick={() => onToast("Contribute translation portal opened")}
              className="text-[12px] text-[#e8852b] font-semibold hover:underline"
            >
              + Contribute Translation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                id: "phq9",
                name: "PHQ-9",
                type: "Depression (Pfizer free)",
                lang: "10 Indian languages",
                tag: "Free · Unrestricted",
              },
              {
                id: "gad7",
                name: "GAD-7",
                type: "Anxiety Screen",
                lang: "7 Indian languages",
                tag: "Free · Unrestricted",
              },
              {
                id: "whodas",
                name: "WHO-DAS 2.0",
                type: "Disability Assessment",
                lang: "Hindi + EN validated",
                tag: "ICD-11 ✦",
              },
              {
                id: "dass21",
                name: "DASS-21",
                type: "Depression/Anxiety/Stress",
                lang: "Hindi, Tamil, Telugu",
                tag: "Non-commercial",
              },
              {
                id: "pss10",
                name: "PSS-10",
                type: "Perceived Stress Scale",
                lang: "India validated",
                tag: "Free",
              },
            ].map((s) => {
              const isSelected = selectedScales.includes(s.id);
              return (
                <div
                  key={s.id}
                  onClick={() => toggleScale(s.id, s.name)}
                  className={`border rounded-xl p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200"
                      : "bg-[#f5f3ef] border-[#1a1633]/10 hover:border-[#e8852b]/40"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[13px] font-bold text-[#1a1633]">{s.name}</span>
                    <span className="text-[9px] font-bold bg-white px-2 py-0.5 rounded border border-[#1a1633]/10 text-emerald-800">
                      {s.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6b6890] mt-1">{s.type}</p>
                  <div className="text-[10px] text-[#a09ec0] mt-2 flex items-center justify-between">
                    <span>{s.lang}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Right Rail */}
      <aside className="w-[268px] shrink-0 bg-white border-l border-[#1a1633]/10 p-4 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="text-[13px] font-semibold text-[#1a1633]">Pre-registration</div>
          <div className="text-[11px] text-[#a09ec0] mb-3">Open Science Framework (OSF)</div>

          <div className="space-y-2.5 text-[12px] text-[#2e2a50]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[#e8852b]" />
              <span>Register on AsPredicted.org</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[#e8852b]" />
              <span>OSF Registries DOI Minting</span>
            </label>
          </div>

          <button
            type="button"
            onClick={() => onToast("OSF Pre-registration draft created ✓")}
            className="w-full h-[32px] mt-4 border border-[#1a1633]/20 hover:bg-[#f5f3ef] text-[11px] font-semibold rounded-lg transition-colors"
          >
            Generate Pre-reg Draft
          </button>
        </div>

        <button
          type="button"
          onClick={onAdvance}
          className="w-full h-[36px] bg-[#e8852b] hover:bg-[#d0731f] text-white text-[12px] font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm mt-6"
        >
          <span>Proceed to Experiment Studio (Stage 4)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </aside>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  BarChart2,
  FileCode,
  Download,
  Copy,
  Table,
  Check,
  ArrowRight,
  TrendingDown,
} from "lucide-react";

interface AnalysisStageProps {
  onAdvance: () => void;
  onToast: (msg: string) => void;
}

export function AnalysisStage({ onAdvance, onToast }: AnalysisStageProps) {
  const [copiedAPA, setCopiedAPA] = useState(false);

  const handleDownloadR = () => {
    const rScript = `# Stimulx.in Auto-generated R Script
# Multilingual Stroop Effect Analysis (Hindi vs English)

library(tidyverse)
library(ez)

data <- read_csv("stimulx_stroop_clean_data.csv")

# Descriptive statistics
summary_stats <- data %>%
  group_by(language, congruency) %>%
  summarise(
    mean_rt = mean(reaction_time),
    sd_rt = sd(reaction_time),
    accuracy = mean(correct)
  )

print(summary_stats)

# Repeated Measures ANOVA
anova_model <- ezANOVA(
  data = data,
  dv = reaction_time,
  wid = participant_id,
  within = .(language, congruency),
  detailed = TRUE
)

print(anova_model)
`;
    const blob = new Blob([rScript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stimulx_analysis.R";
    a.click();
    URL.revokeObjectURL(url);
    onToast("R script + raw CSV downloaded ✓");
  };

  const handleCopyAPA = () => {
    const apaTable = `Table 1
Mean Reaction Times (ms) and Interference Effects in Hindi and English Bilinguals (N = 178)
-----------------------------------------------------------------------------------------
Condition          Congruent M (SD)      Incongruent M (SD)      Interference Effect (Δ)
-----------------------------------------------------------------------------------------
Hindi              451 (68)              523 (74)                +72ms***
English            478 (71)              549 (80)                +71ms***
-----------------------------------------------------------------------------------------
Note. ***p < .001, F(1, 177) = 84.3, ηp² = .32. Generated via Stimulx.in.`;

    navigator.clipboard?.writeText(apaTable);
    setCopiedAPA(true);
    setTimeout(() => setCopiedAPA(false), 2000);
    onToast("APA 7th formatted table copied to clipboard ✓");
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f5f3ef] space-y-5">
      <header>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#e8852b] mb-1">
          Stage 6 — Analysis Studio
        </div>
        <h2 className="text-xl font-bold text-[#1a1633]">Statistical Analysis & Open Science Exports</h2>
        <p className="text-[13px] text-[#6b6890] mt-1">
          Automated reaction time trimming (<200ms / >2.5 SD) · Repeated measures ANOVA · Export to R, SPSS, jamovi
        </p>
      </header>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-[#1a1633]/10 p-3.5 rounded-xl">
          <div className="text-2xl font-bold font-mono text-emerald-600">499ms</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#a09ec0] mt-1">
            Mean Reaction Time
          </div>
        </div>
        <div className="bg-white border border-[#1a1633]/10 p-3.5 rounded-xl">
          <div className="text-2xl font-bold font-mono text-[#1a1633]">91.4%</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#a09ec0] mt-1">
            Overall Accuracy
          </div>
        </div>
        <div className="bg-white border border-[#1a1633]/10 p-3.5 rounded-xl">
          <div className="text-2xl font-bold font-mono text-[#1a1633]">178</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#a09ec0] mt-1">
            Clean Sample (N)
          </div>
        </div>
        <div className="bg-white border border-[#1a1633]/10 p-3.5 rounded-xl">
          <div className="text-2xl font-bold font-mono text-amber-600">4.8%</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#a09ec0] mt-1">
            Outliers Excluded
          </div>
        </div>
      </div>

      {/* Stroop Effect Visual Comparison */}
      <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#1a1633]/10">
          <h3 className="text-[13px] font-semibold text-[#1a1633]">
            Cross-Linguistic Stroop Interference: Hindi vs English
          </h3>
          <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
            p &lt; .001 Significant
          </span>
        </div>

        <div className="space-y-3.5">
          {/* Hindi Congruent */}
          <div>
            <div className="flex justify-between text-[12px] mb-1">
              <span className="text-[#6b6890] font-medium">Hindi — Congruent</span>
              <span className="font-mono font-bold text-[#1a1633]">451ms</span>
            </div>
            <div className="w-full bg-[#f5f3ef] h-3 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: "55%" }} />
            </div>
          </div>

          {/* Hindi Incongruent */}
          <div>
            <div className="flex justify-between text-[12px] mb-1">
              <span className="text-[#6b6890] font-medium">Hindi — Incongruent</span>
              <span className="font-mono font-bold text-[#1a1633]">523ms (+72ms)</span>
            </div>
            <div className="w-full bg-[#f5f3ef] h-3 rounded-full overflow-hidden">
              <div className="bg-indigo-400 h-full rounded-full transition-all" style={{ width: "64%" }} />
            </div>
          </div>

          {/* English Congruent */}
          <div>
            <div className="flex justify-between text-[12px] mb-1">
              <span className="text-[#6b6890] font-medium">English — Congruent</span>
              <span className="font-mono font-bold text-[#1a1633]">478ms</span>
            </div>
            <div className="w-full bg-[#f5f3ef] h-3 rounded-full overflow-hidden">
              <div className="bg-[#e8852b] h-full rounded-full transition-all" style={{ width: "58%" }} />
            </div>
          </div>

          {/* English Incongruent */}
          <div>
            <div className="flex justify-between text-[12px] mb-1">
              <span className="text-[#6b6890] font-medium">English — Incongruent</span>
              <span className="font-mono font-bold text-[#1a1633]">549ms (+71ms)</span>
            </div>
            <div className="w-full bg-[#f5f3ef] h-3 rounded-full overflow-hidden">
              <div className="bg-[#f9a94e] h-full rounded-full transition-all" style={{ width: "67%" }} />
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-[12px] text-emerald-900 leading-relaxed">
          <strong>Key Finding:</strong> Significant Stroop effect observed across both languages (Hindi Δ = 72ms, English Δ = 71ms), F(1, 177) = 84.3, p &lt; .001, ηp² = .32. Language dominance did not modulate the magnitude of interference.
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-3">
        <h3 className="text-[13px] font-semibold text-[#1a1633]">
          Export to Statistical Environments
        </h3>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleDownloadR}
            className="h-[34px] px-4 bg-[#1a1633] hover:bg-[#e8852b] text-white text-[12px] font-semibold rounded-lg flex items-center gap-2 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>R Script + Raw CSV</span>
          </button>

          <button
            type="button"
            onClick={() => onToast("SPSS (.sav) dataset generated and downloaded ✓")}
            className="h-[34px] px-4 bg-white border border-[#1a1633]/20 hover:bg-[#f5f3ef] text-[#1a1633] text-[12px] font-semibold rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>SPSS (.sav)</span>
          </button>

          <button
            type="button"
            onClick={() => onToast("jamovi dataset downloaded ✓")}
            className="h-[34px] px-4 bg-white border border-[#1a1633]/20 hover:bg-[#f5f3ef] text-[#1a1633] text-[12px] font-semibold rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>jamovi file</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAPA}
            className="h-[34px] px-4 bg-white border border-[#1a1633]/20 hover:bg-[#f5f3ef] text-[#1a1633] text-[12px] font-semibold rounded-lg flex items-center gap-2 transition-colors"
          >
            {copiedAPA ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Table className="w-3.5 h-3.5" />}
            <span>{copiedAPA ? "Copied APA Table!" : "Copy APA 7th Table"}</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onAdvance}
          className="h-[36px] px-5 bg-[#e8852b] hover:bg-[#f9a94e] text-white text-[12px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <span>Draft Manuscript & Review (Stage 7)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { BookOpen, Download, FileText, ExternalLink, CheckCircle2 } from "lucide-react";

interface PublishStageProps {
  onAdvance: () => void;
  onToast: (msg: string) => void;
}

export function PublishStage({ onAdvance, onToast }: PublishStageProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-4xl mx-auto space-y-5 bg-[#f5f3ef]">
      <header>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#e8852b] mb-1">
          Stage 8 — Publish & Disseminate
        </div>
        <h2 className="text-xl font-bold text-[#1a1633]">Journal Matcher & Manuscript Export</h2>
        <p className="text-[13px] text-[#6b6890] mt-1">
          Automated APA 7th formatting · APC fee waiver guidance · Open Access Indian behavioural science journals
        </p>
      </header>

      {/* Recommended Journals */}
      <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-4">
        <h3 className="text-[13px] font-semibold text-[#1a1633]">
          Matched Indian Psychology Journals
        </h3>

        <div className="space-y-3">
          <div className="p-4 bg-[#f5f3ef] border border-[#1a1633]/10 rounded-xl hover:border-[#e8852b]/40 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-[13px] font-bold text-[#1a1633]">
                  Indian Journal of Psychological Medicine (IJPM)
                </h4>
                <div className="text-[11px] text-[#6b6890] mt-0.5">
                  SAGE Publications · ICMR endorsed · Impact Factor: 2.1
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded">
                ₹0 APC (Fee Waiver for India)
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => onToast("IJPM manuscript submission package prepared ✓")}
                className="h-[28px] px-3 bg-[#e8852b] hover:bg-[#f9a94e] text-white text-[11px] font-semibold rounded transition-colors"
              >
                Prepare Submission Package
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#f5f3ef] border border-[#1a1633]/10 rounded-xl hover:border-[#e8852b]/40 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-[13px] font-bold text-[#1a1633]">
                  Psychological Studies
                </h4>
                <div className="text-[11px] text-[#6b6890] mt-0.5">
                  Springer · National Academy of Psychology (NAOP) India · Impact Factor: 1.4
                </div>
              </div>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded">
                Peer Reviewed
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => onToast("Author guidelines for Psychological Studies loaded ✓")}
                className="h-[28px] px-3 bg-white border border-[#1a1633]/20 hover:bg-[#f5f3ef] text-[#1a1633] text-[11px] font-semibold rounded transition-colors"
              >
                View Guidelines
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manuscript Export */}
      <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-3">
        <h3 className="text-[13px] font-semibold text-[#1a1633]">
          Download Formatted Manuscript Package
        </h3>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => onToast("APA 7th (.docx) manuscript downloaded ✓")}
            className="h-[34px] px-4 bg-[#1a1633] hover:bg-[#e8852b] text-white text-[12px] font-semibold rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>APA 7th (.docx)</span>
          </button>

          <button
            type="button"
            onClick={() => onToast("LaTeX source package (.zip) downloaded ✓")}
            className="h-[34px] px-4 bg-white border border-[#1a1633]/20 hover:bg-[#f5f3ef] text-[#1a1633] text-[12px] font-semibold rounded-lg flex items-center gap-2 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>LaTeX Source (.tex)</span>
          </button>

          <button
            type="button"
            onClick={() => onToast("Publication ready PDF downloaded ✓")}
            className="h-[34px] px-4 bg-white border border-[#1a1633]/20 hover:bg-[#f5f3ef] text-[#1a1633] text-[12px] font-semibold rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Printable PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}

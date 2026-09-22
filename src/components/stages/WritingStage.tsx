"use client";

import React, { useState } from "react";
import {
  FileEdit,
  Sparkles,
  MessageSquare,
  UserCheck,
  Check,
  ArrowRight,
  Send,
} from "lucide-react";

interface WritingStageProps {
  onAdvance: () => void;
  onToast: (msg: string) => void;
}

export function WritingStage({ onAdvance, onToast }: WritingStageProps) {
  const [abstract, setAbstract] = useState(
    "The Stroop colour-word interference task has been extensively investigated in Western monolingual populations, yet normative data for Hindi-speaking bilingual adults in India remains scarce. This study administered a computerized Stroop task in Hindi and English to 178 bilingual adults across India via Stimulx.in. Participants demonstrated robust Stroop interference in both languages (Hindi: 72ms, English: 71ms), with no significant difference between conditions, indicating symmetrical cognitive control costs."
  );

  const [methods, setMethods] = useState(
    "Participants (N = 178; Mage = 24.3) were recruited via the Stimulx.in pan-India participant pool. Ethics approval was obtained from the Institutional Ethics Committee (Ref: IEC/NIMHANS/2025/041). All participants provided voluntary digital informed consent in Hindi or English in strict compliance with ICMR 2017 and DPDP 2023 regulations."
  );

  const [comments, setComments] = useState([
    {
      id: "c1",
      author: "Dr Sunita Rao",
      role: "NIMHANS",
      text: "Good abstract. Were participants screened for Hindi reading proficiency or was it based on self-reported dominance?",
      time: "2h ago",
    },
    {
      id: "c2",
      author: "Ravi K.",
      role: "Service User / Lived Experience Reviewer",
      text: "The consent was very easy to understand on mobile. Appreciated the clear explanation that we could stop at any time.",
      time: "1d ago",
    },
  ]);

  const [replyText, setReplyText] = useState("");

  const handleAutoFill = () => {
    onToast("Methods & Ethics sections auto-populated from Stages 1–4 ✓");
  };

  const handleSendComment = () => {
    if (!replyText.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now().toString(),
        author: "You (Researcher)",
        role: "Author",
        text: replyText,
        time: "Just now",
      },
    ]);
    setReplyText("");
    onToast("Comment posted to review thread ✓");
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#f5f3ef]">
      {/* Editor Center */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-4xl mx-auto space-y-5">
        <header>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#e8852b] mb-1">
            Stage 7 — Write & Community Review
          </div>
          <h2 className="text-xl font-bold text-[#1a1633]">Manuscript Studio & Open Peer Review</h2>
          <p className="text-[13px] text-[#6b6890] mt-1">
            Collaborative drafting with integrated feedback from university researchers and lived-experience reviewers
          </p>
        </header>

        {/* Paper Title */}
        <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase text-[#a09ec0] mb-1">Working Title</div>
            <input
              type="text"
              defaultValue="Multilingual Stroop Interference in Hindi and English: A Cross-Linguistic Comparison in Indian Adults"
              className="w-full text-lg font-bold text-[#1a1633] outline-none border-b border-[#1a1633]/10 pb-1.5 focus:border-[#e8852b]"
            />
          </div>

          {/* Abstract Section */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[12px] font-bold uppercase text-[#1a1633]">Abstract</span>
              <button
                type="button"
                onClick={() => onToast("AI revision draft generated ✓")}
                className="text-[11px] text-[#e8852b] font-semibold flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                <span>Refine with Research AI</span>
              </button>
            </div>
            <textarea
              rows={5}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="w-full bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg p-3 text-[13px] text-[#2e2a50] leading-relaxed outline-none focus:bg-white focus:border-[#e8852b]"
            />
          </div>

          {/* Methods Section */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[12px] font-bold uppercase text-[#1a1633]">Methods</span>
              <button
                type="button"
                onClick={handleAutoFill}
                className="text-[11px] text-[#1a1633] font-semibold bg-[#f5f3ef] hover:bg-[#e8852b] hover:text-white px-2.5 py-1 rounded transition-colors"
              >
                Auto-fill from Protocol
              </button>
            </div>
            <textarea
              rows={5}
              value={methods}
              onChange={(e) => setMethods(e.target.value)}
              className="w-full bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg p-3 text-[13px] text-[#2e2a50] leading-relaxed outline-none focus:bg-white focus:border-[#e8852b]"
            />
          </div>
        </div>
      </main>

      {/* Right Peer Review Rail */}
      <aside className="w-[300px] shrink-0 bg-white border-l border-[#1a1633]/10 p-4 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[13px] font-semibold text-[#1a1633]">Community Reviewers</span>
            <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
              Open Peer Review
            </span>
          </div>

          {/* Comments Feed */}
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="p-3 bg-[#f5f3ef] border border-[#1a1633]/10 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#1a1633]">{c.author}</span>
                  <span className="text-[9px] text-[#a09ec0]">{c.time}</span>
                </div>
                <div className="text-[9px] font-mono text-[#e8852b]">{c.role}</div>
                <p className="text-[11px] text-[#2e2a50] leading-snug">{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div className="pt-4 border-t border-[#1a1633]/10 space-y-3">
          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="Reply to reviewer..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
              className="flex-1 bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg px-2.5 py-1.5 text-[11px] outline-none"
            />
            <button
              type="button"
              onClick={handleSendComment}
              className="h-[30px] px-2.5 bg-[#e8852b] hover:bg-[#f9a94e] text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={onAdvance}
            className="w-full h-[36px] bg-[#1a1633] hover:bg-[#e8852b] text-white text-[12px] font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Proceed to Publish (Stage 8)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </div>
  );
}

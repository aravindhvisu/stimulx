"use client";

import React, { useState } from "react";
import {
  Share2,
  Copy,
  Download,
  PhoneCall,
  Check,
  ArrowRight,
  ShieldAlert,
  HeartHandshake,
} from "lucide-react";

interface RecruitmentStageProps {
  onAdvance: () => void;
  onToast: (msg: string) => void;
}

export function RecruitmentStage({ onAdvance, onToast }: RecruitmentStageProps) {
  const [waLanguage, setWaLanguage] = useState<"hi" | "ta" | "te" | "kn">("hi");

  const waMessages = {
    hi: `📣 Research Study — stimulx.sc (Non-profit)\n\nआपकी भागीदारी पूरी तरह स्वैच्छिक है। आप किसी भी समय बिना कारण बताए हट सकते हैं।\n\n🔒 आपका डेटा भारत में सुरक्षित रहेगा। आपकी contact details किसी के साथ share नहीं होंगी।\n\n💰 Compensation: ₹100 Amazon voucher\n⏱ Time: ~8 minutes\n📱 Online — from anywhere\n\n👇 https://stimulx.sc/s/stroop-2025`,
    ta: `📣 ஆய்வுக் கல்வி — stimulx.sc (இலாப நோக்கற்ற)\n\nஉங்கள் பங்கேற்பு முற்றிலும் தன்னார்வமானது. நீங்கள் எந்த நேரத்திலும் வெளியேறலாம்.\n\n🔒 உங்கள் தரவு இந்தியாவில் மட்டுமே பாதுகாக்கப்படும். உங்களின் தொடர்பு விவரங்கள் பகிரப்படாது.\n\n💰 ஊக்கத்தொகை: ₹100 பரிசு கூப்பன்\n⏱ நேரம்: ~8 நிமிடங்கள்\n📱 ஆன்லைனில் பங்கேற்கலாம்\n\n👇 https://stimulx.sc/s/stroop-2025`,
    te: `📣 పరిశోధనా అధ్యయనం — stimulx.sc (లాభాపేక్ష లేనిది)\n\nమీ భాగస్వామ్యం పూర్తిగా స్వచ్ఛందమైనది. మీరు ఎప్పుడైనా విరమించుకోవచ్చు.\n\n🔒 మీ డేటా భారతదేశంలోనే భద్రంగా ఉంటుంది.\n\n💰 గౌరవ భృతి: ₹100 వోచర్\n⏱ సమయం: ~8 నిమిషాలు\n\n👇 https://stimulx.sc/s/stroop-2025`,
    kn: `📣 ಸಂಶೋಧನಾ ಯೋಜನೆ — stimulx.sc (ಲಾಭರಹಿತ)\n\nನಿಮ್ಮ ಭಾಗವಹಿಸುವಿಕೆ ಸಂಪೂರ್ಣವಾಗಿ ಐಚ್ಛಿಕವಾಗಿದೆ. ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ನೀವು ಹಿಂದೆ ಸರಿಯಬಹುದು.\n\n🔒 ನಿಮ್ಮ ಡೇಟಾ ಭಾರತದಲ್ಲಿಯೇ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆ.\n\n💰 ಸಂಭಾವನೆ: ₹100 ವೋಚರ್\n⏱ ಸಮಯ: ~8 ನಿಮಿಷ\n\n👇 https://stimulx.sc/s/stroop-2025`,
  };

  const handleCopyWA = () => {
    navigator.clipboard?.writeText(waMessages[waLanguage]);
    onToast("WhatsApp invitation copied to clipboard ✓");
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f5f3ef] space-y-5">
      <header>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#e8852b] mb-1">
          Stage 3 — Recruitment
        </div>
        <h2 className="text-xl font-bold text-[#1a1633]">Ethics-First Recruitment Engine</h2>
        <p className="text-[13px] text-[#6b6890] mt-1">
          Every participant outreach begins with rights, data safety, and voluntary withdrawal guarantees
        </p>
      </header>

      {/* Principles Banner */}
      <div className="bg-[#1a1633] text-white rounded-xl p-5 border border-white/10">
        <div className="text-[12px] font-bold text-[#f9a94e] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" />
          Stimulx Core Recruitment Directives
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-white/70">
          <div>
            ✦ <strong>Zero Direct Contact:</strong> Participant phone numbers and emails are never shared with researchers. All communication stays inside the Stimulx platform.
          </div>
          <div>
            ✦ <strong>Study-Window Locking:</strong> Participants can only be invited while a study is actively approved and live. No unauthorized cold outreach.
          </div>
          <div>
            ✦ <strong>Upfront Clarity:</strong> Invitations mandate study duration, tasks involved, compensation details, and instant withdrawal mechanism.
          </div>
          <div>
            ✦ <strong>Crisis Helpline Support:</strong> Debrief screen must feature iCall (9152987821), Vandrevala Foundation, and NIMHANS helplines.
          </div>
        </div>
      </div>

      {/* Recruitment Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: WhatsApp Copy Generator */}
        <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[13px] font-semibold text-[#1a1633]">
                WhatsApp Outreach Template
              </h3>
              <p className="text-[11px] text-[#a09ec0]">
                Pre-formatted for rapid mobile sharing with Indic scripts
              </p>
            </div>
            <div className="flex gap-1">
              {(["hi", "ta", "te", "kn"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setWaLanguage(lang)}
                  className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                    waLanguage === lang
                      ? "bg-[#e8852b] text-white"
                      : "bg-[#f5f3ef] text-[#6b6890] hover:bg-white"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#f5f3ef] border border-[#1a1633]/10 rounded-lg p-3 text-[12px] text-[#2e2a50] whitespace-pre-line leading-relaxed font-sans">
            {waMessages[waLanguage]}
          </div>

          <button
            type="button"
            onClick={handleCopyWA}
            className="w-full h-[32px] bg-[#e8852b] hover:bg-[#f9a94e] text-white text-[12px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy WhatsApp Invite</span>
          </button>
        </div>

        {/* Right: Social & Instagram Poster */}
        <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-[13px] font-semibold text-[#1a1633]">
              Social Awareness Card
            </h3>
            <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
              Instagram / LinkedIn
            </span>
          </div>

          <div className="bg-[#1a1633] text-white rounded-lg p-5 border border-white/10 space-y-2">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#e8852b]">
              Be part of Indian Science
            </div>
            <div className="text-base font-semibold leading-snug">
              Shape the future of Indian cognitive & mental health research.
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Join the Stimulx community pool. Participate in studies in your native language, from home. Your data remains in India. Always.
            </p>
            <div className="text-[11px] text-[#f9a94e] font-mono pt-1">
              stimulx.sc/pool
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToast("Instagram graphic downloaded (PNG) ✓")}
            className="w-full h-[32px] border border-[#1a1633]/20 hover:bg-[#f5f3ef] text-[#1a1633] text-[12px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Poster Graphic (PNG)</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onAdvance}
          className="h-[36px] px-5 bg-[#e8852b] hover:bg-[#f9a94e] text-white text-[12px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <span>Open Experiment Runner (Stage 4)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  Languages,
  Lock,
  UserCheck,
  CheckCircle2,
  Download,
  AlertCircle,
} from "lucide-react";

interface EthicsStageProps {
  onAdvance: () => void;
  onToast: (msg: string) => void;
}

export function EthicsStage({ onAdvance, onToast }: EthicsStageProps) {
  const [activeTab, setActiveTab] = useState<"info" | "rights" | "consent" | "privacy" | "pi">("info");

  const [title, setTitle] = useState(
    "Multilingual Stroop interference in Hindi and English: A cross-linguistic comparison in Indian adults"
  );
  const [institution, setInstitution] = useState("NIMHANS, Bengaluru");
  const [targetN, setTargetN] = useState("150");
  const [compensation, setCompensation] = useState("₹100 Amazon voucher");

  const [withdrawalAllowed, setWithdrawalAllowed] = useState(true);
  const [anonymousAllowed, setAnonymousAllowed] = useState(true);
  const [debriefMandatory, setDebriefMandatory] = useState(true);
  const [helplineMandatory, setHelplineMandatory] = useState(true);

  const handleExportPDF = () => {
    onToast("IEC PDF generated — formatted for NIMHANS/ICMR committee ✓");
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#f5f3ef]">
      {/* Left Sidebar */}
      <aside className="w-[218px] shrink-0 bg-white border-r border-[#1a1633]/10 flex flex-col overflow-y-auto">
        <div className="px-3.5 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#a09ec0]">
          IEC Application
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "info"
              ? "bg-[#e8852b]/10 border-[#e8852b] text-[#e8852b] font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>Study Information</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rights")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "rights"
              ? "bg-[#e8852b]/10 border-[#e8852b] text-[#e8852b] font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Participant Rights</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("consent")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "consent"
              ? "bg-[#e8852b]/10 border-[#e8852b] text-[#e8852b] font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <Languages className="w-3.5 h-3.5 shrink-0" />
          <span>Consent Forms (22L)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("privacy")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "privacy"
              ? "bg-[#e8852b]/10 border-[#e8852b] text-[#e8852b] font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>Data Privacy (DPDP)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pi")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "pi"
              ? "bg-[#e8852b]/10 border-[#e8852b] text-[#e8852b] font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 shrink-0" />
          <span>PI Declaration</span>
        </button>
      </aside>

      {/* Center Form */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <header className="mb-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#e8852b] mb-1">
            Stage 1 — Ethics & IEC
          </div>
          <h2 className="text-xl font-bold text-[#1a1633]">Institutional Ethics Committee Framework</h2>
          <p className="text-[13px] text-[#6b6890] mt-1">
            ICMR 2017 Guidelines compliant · DPDP Act 2023 audited · Auto-formatted for NIMHANS, SCARF, and TISS committees
          </p>
        </header>

        {activeTab === "info" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#1a1633]/10">
              <span className="text-[13px] font-semibold text-[#1a1633]">Study Details</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                In Progress
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#a09ec0] mb-1">
                Study Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg px-3 py-2 text-[13px] text-[#1a1633] outline-none focus:border-[#e8852b] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#a09ec0] mb-1">
                  Institution
                </label>
                <select
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg px-3 py-2 text-[13px] text-[#1a1633] outline-none focus:border-[#e8852b] focus:bg-white"
                >
                  <option>NIMHANS, Bengaluru</option>
                  <option>SCARF, Chennai</option>
                  <option>TISS, Mumbai</option>
                  <option>Delhi University</option>
                  <option>Other / Independent</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#a09ec0] mb-1">
                  Study Type
                </label>
                <select className="w-full bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg px-3 py-2 text-[13px] text-[#1a1633] outline-none focus:border-[#e8852b] focus:bg-white">
                  <option>Observational Behavioural Task</option>
                  <option>Experimental Randomized Control</option>
                  <option>Qualitative Interview Study</option>
                  <option>Mixed Methods</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#a09ec0] mb-1">
                  Target Sample Size (N)
                </label>
                <input
                  type="number"
                  value={targetN}
                  onChange={(e) => setTargetN(e.target.value)}
                  className="w-full bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg px-3 py-2 text-[13px] text-[#1a1633] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#a09ec0] mb-1">
                  Age Range
                </label>
                <input
                  type="text"
                  defaultValue="18–45 years"
                  className="w-full bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg px-3 py-2 text-[13px] text-[#1a1633] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#a09ec0] mb-1">
                  Compensation
                </label>
                <select
                  value={compensation}
                  onChange={(e) => setCompensation(e.target.value)}
                  className="w-full bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg px-3 py-2 text-[13px] text-[#1a1633] outline-none"
                >
                  <option>₹100 Amazon voucher</option>
                  <option>₹50 Direct UPI</option>
                  <option>Course credit (SONA)</option>
                  <option>Altruistic / Volunteer</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "rights" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#1a1633]/10">
              <span className="text-[13px] font-semibold text-[#1a1633]">
                ICMR Participant Rights Protection
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                ICMR 2017 Certified
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-2.5 bg-[#f5f3ef] rounded-lg cursor-pointer">
                <div>
                  <div className="text-[12px] font-semibold text-[#1a1633]">
                    Unconditional Right to Withdraw
                  </div>
                  <div className="text-[11px] text-[#6b6890]">
                    Participants may withdraw anytime without penalty or loss of benefits.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={withdrawalAllowed}
                  onChange={(e) => setWithdrawalAllowed(e.target.checked)}
                  className="w-4 h-4 accent-[#e8852b]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-[#f5f3ef] rounded-lg cursor-pointer">
                <div>
                  <div className="text-[12px] font-semibold text-[#1a1633]">
                    Pseudonymized & Anonymous Option
                  </div>
                  <div className="text-[11px] text-[#6b6890]">
                    Participant IDs are separated from demographic identity via secure salt-hashing.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={anonymousAllowed}
                  onChange={(e) => setAnonymousAllowed(e.target.checked)}
                  className="w-4 h-4 accent-[#e8852b]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-[#f5f3ef] rounded-lg cursor-pointer">
                <div>
                  <div className="text-[12px] font-semibold text-[#1a1633]">
                    Mandatory Debrief Screen
                  </div>
                  <div className="text-[11px] text-[#6b6890]">
                    Required by Stimulx for all psychological and cognitive studies.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={debriefMandatory}
                  onChange={(e) => setDebriefMandatory(e.target.checked)}
                  className="w-4 h-4 accent-[#e8852b]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-[#f5f3ef] rounded-lg cursor-pointer">
                <div>
                  <div className="text-[12px] font-semibold text-[#1a1633]">
                    Indian Crisis Helplines on Exit
                  </div>
                  <div className="text-[11px] text-[#6b6890]">
                    Auto-displays iCall (9152987821), NIMHANS (080-46110007), and Vandrevala Foundation.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={helplineMandatory}
                  onChange={(e) => setHelplineMandatory(e.target.checked)}
                  className="w-4 h-4 accent-[#e8852b]"
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === "consent" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-[13px] font-semibold text-[#1a1633]">
                  Consent Forms — 22 Official Indian Languages
                </h3>
                <p className="text-[11px] text-[#a09ec0]">
                  ICMR standardized wording translated and validated by native clinical psychologists
                </p>
              </div>
              <button
                type="button"
                onClick={() => onToast("Generating all 22 official language translations...")}
                className="h-[28px] px-3 bg-[#e8852b] text-white text-[11px] font-semibold rounded hover:bg-[#f9a94e]"
              >
                + Auto-generate all 22
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                onClick={() => onToast("Hindi ICMR consent form opened")}
                className="p-3.5 bg-[#f5f3ef] border border-[#1a1633]/10 rounded-lg cursor-pointer hover:border-[#e8852b]/40"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-semibold text-[#1a1633]">Consent — Hindi (हिन्दी)</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Approved ✓
                  </span>
                </div>
                <p className="text-[11px] text-[#6b6890] mt-1">
                  ICMR adult behavioural template. Includes revocation clause.
                </p>
              </div>

              <div
                onClick={() => onToast("Tamil ICMR consent form opened")}
                className="p-3.5 bg-[#f5f3ef] border border-[#1a1633]/10 rounded-lg cursor-pointer hover:border-[#e8852b]/40"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-semibold text-[#1a1633]">Consent — Tamil (தமிழ்)</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    Review Pending
                  </span>
                </div>
                <p className="text-[11px] text-[#6b6890] mt-1">
                  SCARF clinical template alignment.
                </p>
              </div>

              <div
                onClick={() => onToast("Telugu consent draft opened")}
                className="p-3.5 bg-[#f5f3ef] border border-[#1a1633]/10 rounded-lg cursor-pointer hover:border-[#e8852b]/40"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-semibold text-[#1a1633]">Consent — Telugu (తెలుగు)</span>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Draft
                  </span>
                </div>
                <p className="text-[11px] text-[#6b6890] mt-1">
                  Auto-translated draft from English master form.
                </p>
              </div>

              <div
                onClick={() => onToast("Kannada consent draft opened")}
                className="p-3.5 bg-[#f5f3ef] border border-[#1a1633]/10 rounded-lg cursor-pointer hover:border-[#e8852b]/40"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-semibold text-[#1a1633]">Consent — Kannada (ಕನ್ನಡ)</span>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Draft
                  </span>
                </div>
                <p className="text-[11px] text-[#6b6890] mt-1">
                  NIMHANS regional language standardization.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#1a1633]/10">
              <span className="text-[13px] font-semibold text-[#1a1633]">
                Digital Personal Data Protection (DPDP) Act 2023
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                DPDP Verified
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[12px] text-blue-900 leading-relaxed">
              <strong>Mumbai Data Residency:</strong> All experiment responses, consent timestamps, and participant IDs are hosted exclusively on Stimulx servers in Mumbai, India. No data leaves national borders.
            </div>

            <div className="space-y-2 pt-2 text-[12px] text-[#2e2a50]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>IP addresses are never captured or logged.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Phone/email contact info is never visible to researchers.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Automated purge after 5 years per ICMR record retention standards.</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pi" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-4">
            <h3 className="text-[13px] font-semibold text-[#1a1633]">Principal Investigator Declaration</h3>
            <textarea
              readOnly
              rows={4}
              value="I hereby declare that this research will be conducted in strict compliance with the ICMR National Ethical Guidelines for Biomedical and Health Research Involving Human Participants (2017), the Declaration of Helsinki, and the DPDP Act 2023. No unauthorized re-identification of participants will be attempted."
              className="w-full bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg p-3 text-[12px] text-[#2e2a50] outline-none font-mono"
            />
            <button
              type="button"
              onClick={handleExportPDF}
              className="h-[34px] px-4 bg-[#1a1633] hover:bg-[#e8852b] text-white text-[12px] font-semibold rounded-lg flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Generate Official IEC PDF</span>
            </button>
          </div>
        )}
      </main>

      {/* Right Rail */}
      <aside className="w-[268px] shrink-0 bg-white border-l border-[#1a1633]/10 p-4 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="text-[13px] font-semibold text-[#1a1633]">IEC Checklist</div>
          <div className="text-[11px] text-[#a09ec0] mb-3">5 of 7 sections complete</div>

          <div className="w-full bg-[#f5f3ef] h-1.5 rounded-full overflow-hidden mb-4">
            <div className="bg-[#e8852b] h-full w-[71%] transition-all" />
          </div>

          <div className="space-y-2 text-[12px]">
            <div className="text-emerald-700 flex items-center gap-1.5">
              <span>✓</span> Study Information
            </div>
            <div className="text-emerald-700 flex items-center gap-1.5">
              <span>✓</span> Participant Rights
            </div>
            <div className="text-amber-700 flex items-center gap-1.5">
              <span>◑</span> Consent Forms (2 reviewed)
            </div>
            <div className="text-emerald-700 flex items-center gap-1.5">
              <span>✓</span> Data Privacy (DPDP)
            </div>
            <div className="text-emerald-700 flex items-center gap-1.5">
              <span>✓</span> Helpline Safeguard
            </div>
            <div className="text-[#a09ec0] flex items-center gap-1.5">
              <span>○</span> PI Signature
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleExportPDF}
            className="w-full h-[34px] border border-[#1a1633]/20 hover:bg-[#f5f3ef] text-[#1a1633] text-[12px] font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export IEC Package</span>
          </button>
          <button
            type="button"
            onClick={onAdvance}
            className="w-full h-[36px] bg-[#e8852b] hover:bg-[#f9a94e] text-white text-[12px] font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Advance to Design (Stage 2)</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

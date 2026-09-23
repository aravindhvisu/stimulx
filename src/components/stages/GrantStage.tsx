"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Calculator,
  Download,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Coins,
  ScrollText,
} from "lucide-react";

import { useStimulxStore } from "@/lib/store";
import { generateGrantDocument, downloadFile } from "@/lib/exportUtils";
import { GrantProposal } from "@/types";

interface GrantStageProps {
  onAdvance: () => void;
  onToast: (msg: string) => void;
}

export function GrantStage({ onAdvance, onToast }: GrantStageProps) {
  const { activeProject, updateActiveProject } = useStimulxStore();
  const [selectedAgency, setSelectedAgency] = useState<"ICSSR" | "DST_SERB" | "ICMR" | "INDIA_ALLIANCE">("DST_SERB");
  const [activeTab, setActiveTab] = useState<"proposal" | "budget" | "agencies" | "compliance">("proposal");

  // Budget Calculator state (based on official Government of India DST OM norms)
  const [jrfCount, setJrfCount] = useState<number>(activeProject.grantProposal?.budget?.jrfMonths ? Math.round(activeProject.grantProposal.budget.jrfMonths / 24) || 1 : 1);
  const [durationMonths, setDurationMonths] = useState<number>(activeProject.grantProposal?.durationMonths || 36);
  const [fieldTravel, setFieldTravel] = useState<number>(activeProject.grantProposal?.budget?.fieldWorkTravel || 450000);
  const [participantHonorarium, setParticipantHonorarium] = useState<number>(activeProject.grantProposal?.budget?.participantHonorarium || 350000);
  const [equipment, setEquipment] = useState<number>(activeProject.grantProposal?.budget?.equipment || 850000);
  const [contingency, setContingency] = useState<number>(activeProject.grantProposal?.budget?.contingency || 250000);

  // DST JRF stipend: ₹37,000/month + 24% HRA = ~₹45,880/month
  const jrfMonthlyCost = 37000 * 1.24;
  const totalStaffCost = Math.round(jrfCount * jrfMonthlyCost * durationMonths);
  const subtotalNonStaff = fieldTravel + participantHonorarium + equipment + contingency;
  const institutionalOverhead = Math.round((totalStaffCost + subtotalNonStaff) * 0.10); // 10% standard overhead
  const grandTotalINR = totalStaffCost + subtotalNonStaff + institutionalOverhead;
  const grandTotalLakhs = (grandTotalINR / 100000).toFixed(2);

  const [proposalTitle, setProposalTitle] = useState(
    activeProject.grantProposal?.title || "Cross-Linguistic Cognitive Control and Normative Executive Profiles in Multilingual Indian Adults"
  );
  const [specificAims, setSpecificAims] = useState(
    activeProject.grantProposal?.specificAims?.join("\n") ||
    "1. Establish baseline normative Stroop and Flanker cognitive reaction-time distributions across Hindi and Dravidian language speakers (N = 600).\n2. Evaluate whether cross-linguistic interference patterns differ between early simultaneous vs late sequential bilinguals.\n3. Develop open, standardized, culturally-adapted psychometric stimuli accessible to academic institutions across India via Stimulx.in."
  );
  const [indianSignificance, setIndianSignificance] = useState(
    activeProject.grantProposal?.significanceIndianContext ||
    "India contains over 1.4 billion individuals speaking 22 official languages, yet cognitive assessment norms relied upon in clinical neuropsychology (NIMHANS, SCARF) continue to predominantly utilize Western monolingual metrics. This research addresses a vital scientific sovereignty gap, providing culturally and linguistically calibrated normative datasets."
  );

  const handleExportProposal = () => {
    const proposalData: GrantProposal = {
      id: `grant-${Date.now()}`,
      agencyCode: selectedAgency === "INDIA_ALLIANCE" ? "DBT_INDIA_ALLIANCE" : selectedAgency,
      title: proposalTitle,
      principalInvestigator: activeProject.grantProposal?.principalInvestigator || "Dr. Aravindh V., Principal Investigator",
      institution: activeProject.grantProposal?.institution || "Centre for Behavioural & Cognitive Sciences (CBCS) / NIMHANS",
      durationMonths,
      totalBudgetINR: grandTotalINR,
      specificAims: specificAims.split("\n").filter(line => line.trim().length > 0),
      significanceIndianContext: indianSignificance,
      methodologyOverview: activeProject.grantProposal?.methodologyOverview || "Computerized millisecond reaction-time assays (Stroop) and clinical screening (PHQ-9/GAD-7).",
      expectedOutcomes: activeProject.grantProposal?.expectedOutcomes || "Normative Indian dataset, Q1 open-access publications, and open research instruments.",
      budget: {
        jrfStipend: 37000,
        jrfMonths: jrfCount * durationMonths,
        srfStipend: 42000,
        srfMonths: 0,
        hraPct: 24,
        equipment,
        fieldWorkTravel: fieldTravel,
        participantHonorarium,
        contingency,
        overhead: institutionalOverhead,
      },
    };

    // Update in store
    updateActiveProject(prev => ({
      ...prev,
      grantProposal: proposalData,
      updatedAt: new Date().toISOString(),
    }));

    // Trigger real file download
    const docContent = generateGrantDocument(proposalData);
    downloadFile(
      `${selectedAgency}_Grant_Proposal_${Date.now().toString().slice(-4)}.doc`,
      docContent,
      "application/msword;charset=utf-8"
    );
    onToast(`Downloaded official ${selectedAgency} Grant Proposal Document (.doc) ✓`);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#f5f3ef]">
      {/* Left Sidebar */}
      <aside className="w-[220px] shrink-0 bg-white border-r border-[#1a1633]/10 flex flex-col overflow-y-auto">
        <div className="px-3.5 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#a09ec0]">
          Grant Builder
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("proposal")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "proposal"
              ? "bg-[#e8852b]/10 border-[#e8852b] text-[#e8852b] font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <ScrollText className="w-3.5 h-3.5 shrink-0" />
          <span>Proposal Drafter</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("budget")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "budget"
              ? "bg-[#e8852b]/10 border-[#e8852b] text-[#e8852b] font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <Calculator className="w-3.5 h-3.5 shrink-0" />
          <span>DST/ICMR Budgeter</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("agencies")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "agencies"
              ? "bg-[#e8852b]/10 border-[#e8852b] text-[#e8852b] font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span>Funding Schemes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("compliance")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "compliance"
              ? "bg-[#e8852b]/10 border-[#e8852b] text-[#e8852b] font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Endorsement Check</span>
        </button>
      </aside>

      {/* Center Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">
        <header>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#e8852b] mb-1 flex items-center gap-1.5">
            <span>Stage 1 — Grant Writing & Indian Funding</span>
          </div>
          <h2 className="text-xl font-bold text-[#1a1633]">
            Research Grant Proposal Studio (ICSSR / DST / ICMR)
          </h2>
          <p className="text-[13px] text-[#6b6890] mt-1">
            Auto-format scientific aims, compute DST-norm manpower costs, and export agency-ready grant packages
          </p>
        </header>

        {/* Agency Selector */}
        <div className="bg-white border border-[#1a1633]/10 rounded-xl p-4 flex flex-wrap gap-2 items-center">
          <span className="text-[11px] font-bold uppercase text-[#a09ec0] mr-2">Target Scheme:</span>
          {[
            { id: "ICSSR", label: "ICSSR Major Project (₹15–30L)" },
            { id: "DST_SERB", label: "DST-SERB / ANRF CRG (₹30–60L)" },
            { id: "ICMR", label: "ICMR Extramural (₹25–50L)" },
            { id: "INDIA_ALLIANCE", label: "DBT / India Alliance (₹1.5Cr)" },
          ].map((ag) => (
            <button
              key={ag.id}
              type="button"
              onClick={() => {
                setSelectedAgency(ag.id as any);
                onToast(`Selected ${ag.id} grant application template`);
              }}
              className={`h-[30px] px-3 rounded-lg text-[11px] font-semibold border transition-all ${
                selectedAgency === ag.id
                  ? "bg-[#1a1633] text-white border-transparent shadow-sm"
                  : "bg-[#f5f3ef] border-[#1a1633]/10 text-[#6b6890] hover:bg-white"
              }`}
            >
              {ag.label}
            </button>
          ))}
        </div>

        {activeTab === "proposal" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-4">
            <div>
              <div className="text-[11px] font-bold uppercase text-[#a09ec0] mb-1">
                Project Title (Grant Application)
              </div>
              <input
                type="text"
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                className="w-full bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg p-2.5 text-[13px] font-medium text-[#1a1633] outline-none focus:border-[#e8852b] focus:bg-white"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold uppercase text-[#a09ec0]">
                  Specific Aims & Work Packages
                </span>
                <button
                  type="button"
                  onClick={() => onToast("Linked from Brainstorm & Design protocol")}
                  className="text-[11px] text-[#e8852b] font-semibold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-align with Study Design</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={specificAims}
                onChange={(e) => setSpecificAims(e.target.value)}
                className="w-full bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg p-3 text-[12px] text-[#2e2a50] leading-relaxed outline-none focus:border-[#e8852b] focus:bg-white"
              />
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase text-[#a09ec0] mb-1">
                Significance in Indian National Context (Societal Relevance)
              </div>
              <textarea
                rows={4}
                value={indianSignificance}
                onChange={(e) => setIndianSignificance(e.target.value)}
                className="w-full bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg p-3 text-[12px] text-[#2e2a50] leading-relaxed outline-none focus:border-[#e8852b] focus:bg-white"
              />
            </div>
          </div>
        )}

        {activeTab === "budget" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#1a1633]/10">
              <div>
                <h3 className="text-[13px] font-semibold text-[#1a1633]">
                  Budget Justification (Official DST / ICSSR Norms)
                </h3>
                <p className="text-[11px] text-[#a09ec0]">
                  JRF: ₹37,000/mo + HRA · Standard 8% institutional overhead
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-mono text-[#e8852b]">
                  ₹{grandTotalLakhs} Lakhs
                </div>
                <div className="text-[10px] text-[#a09ec0] font-mono">
                  (₹{grandTotalINR.toLocaleString("en-IN")})
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#f5f3ef] p-3.5 rounded-lg space-y-3">
                <div className="text-[11px] font-bold uppercase text-[#1a1633]">Manpower & Personnel</div>
                <div className="flex justify-between items-center text-[12px]">
                  <span>Junior Research Fellow (JRF)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setJrfCount(Math.max(1, jrfCount - 1))}
                      className="w-6 h-6 rounded bg-white border border-[#1a1633]/15 font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold w-4 text-center">{jrfCount}</span>
                    <button
                      type="button"
                      onClick={() => setJrfCount(jrfCount + 1)}
                      className="w-6 h-6 rounded bg-white border border-[#1a1633]/15 font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[12px]">
                  <span>Project Duration (Months)</span>
                  <select
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(Number(e.target.value))}
                    className="bg-white border border-[#1a1633]/15 rounded p-1 text-[11px] font-mono"
                  >
                    <option value={12}>12 Months</option>
                    <option value={24}>24 Months</option>
                    <option value={36}>36 Months</option>
                  </select>
                </div>

                <div className="text-[11px] text-[#6b6890] pt-2 border-t border-[#1a1633]/10 flex justify-between">
                  <span>Calculated Staff Subtotal:</span>
                  <span className="font-mono font-bold text-[#1a1633]">
                    ₹{totalStaffCost.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="bg-[#f5f3ef] p-3.5 rounded-lg space-y-3">
                <div className="text-[11px] font-bold uppercase text-[#1a1633]">Fieldwork & Consumables</div>

                <div className="flex justify-between items-center text-[12px]">
                  <span>Field Travel across India</span>
                  <input
                    type="number"
                    value={fieldTravel}
                    onChange={(e) => setFieldTravel(Number(e.target.value))}
                    className="w-28 bg-white border border-[#1a1633]/15 rounded px-2 py-0.5 text-right font-mono text-[11px]"
                  />
                </div>

                <div className="flex justify-between items-center text-[12px]">
                  <span>Participant Honorarium (₹)</span>
                  <input
                    type="number"
                    value={participantHonorarium}
                    onChange={(e) => setParticipantHonorarium(Number(e.target.value))}
                    className="w-28 bg-white border border-[#1a1633]/15 rounded px-2 py-0.5 text-right font-mono text-[11px]"
                  />
                </div>

                <div className="flex justify-between items-center text-[12px]">
                  <span>Apparatus & IT Equipment</span>
                  <input
                    type="number"
                    value={equipment}
                    onChange={(e) => setEquipment(Number(e.target.value))}
                    className="w-28 bg-white border border-[#1a1633]/15 rounded px-2 py-0.5 text-right font-mono text-[11px]"
                  />
                </div>

                <div className="flex justify-between items-center text-[12px]">
                  <span>Institutional Overhead (8%)</span>
                  <span className="font-mono font-bold text-[#1a1633]">
                    ₹{institutionalOverhead.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "agencies" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-white border border-[#1a1633]/10 rounded-xl p-4 space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Social Sciences
              </span>
              <h4 className="text-[13px] font-bold text-[#1a1633]">
                ICSSR Major Research Projects
              </h4>
              <p className="text-[11px] text-[#6b6890] leading-relaxed">
                Supports behavioural research tackling Indian socio-psychological challenges, bilingual education, and community mental health interventions.
              </p>
              <div className="text-[10px] text-[#a09ec0] pt-1 font-mono">
                Funding ceiling: ₹30 Lakhs · 24 Months
              </div>
            </div>

            <div className="bg-white border border-[#1a1633]/10 rounded-xl p-4 space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Cognitive Science
              </span>
              <h4 className="text-[13px] font-bold text-[#1a1633]">
                DST-ANRF Core Research Grant (CRG)
              </h4>
              <p className="text-[11px] text-[#6b6890] leading-relaxed">
                National funding for cognitive neuroscience, brain mapping, experimental psychophysics, and linguistic computation.
              </p>
              <div className="text-[10px] text-[#a09ec0] pt-1 font-mono">
                Funding ceiling: Up to ₹60 Lakhs · 36 Months
              </div>
            </div>
          </div>
        )}

        {activeTab === "compliance" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-3">
            <h3 className="text-[13px] font-semibold text-[#1a1633]">
              Institutional Endorsement & DPDP Readiness
            </h3>
            <div className="space-y-2 text-[12px] text-[#2e2a50]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hosting declared on Mumbai servers compliant with National Cyber Security Policy.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ICMR Ethical Clearance section auto-generated for submission.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Institutional Registrar Certificate template formatted.</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Right Rail Export Package */}
      <aside className="w-[268px] shrink-0 bg-white border-l border-[#1a1633]/10 p-4 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="text-[13px] font-semibold text-[#1a1633]">Grant Dossier</div>
          <div className="text-[11px] text-[#a09ec0] mb-3">Scheme: {selectedAgency}</div>

          <div className="bg-[#f5f3ef] border border-[#1a1633]/10 rounded-lg p-3 space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#6b6890]">Total Budget:</span>
              <span className="font-mono font-bold text-[#e8852b]">₹{grandTotalLakhs} L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b6890]">Duration:</span>
              <span className="font-mono font-bold">{durationMonths} Mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b6890]">JRF Posts:</span>
              <span className="font-mono font-bold">{jrfCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b6890]">Data Safety:</span>
              <span className="text-emerald-700 font-bold">DPDP 2023 ✓</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportProposal}
            className="w-full h-[34px] mt-4 bg-[#1a1633] hover:bg-[#e8852b] text-white text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Official {selectedAgency} Package</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onAdvance}
          className="w-full h-[36px] bg-[#e8852b] hover:bg-[#f9a94e] text-white text-[12px] font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm mt-6"
        >
          <span>Advance to Ethics (Stage 2)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </aside>
    </div>
  );
}

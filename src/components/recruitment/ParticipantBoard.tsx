'use client';

import React, { useState } from 'react';
import { useStimulxStore } from '@/lib/store';
import { RecruitmentListing } from '@/types';
import {
  Users,
  Plus,
  Coins,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface ParticipantBoardProps {
  onToast: (msg: string) => void;
  onLaunchStudy: (studyId: string) => void;
}

export function ParticipantBoard({ onToast, onLaunchStudy }: ParticipantBoardProps) {
  const { recruitmentListings, addRecruitmentListing, activeProject } = useStimulxStore();
  const [showPostModal, setShowPostModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [targetDemographics, setTargetDemographics] = useState('Adults aged 18-35 (Bilingual Hindi/Tamil/English)');
  const [compensationINR, setCompensationINR] = useState(250);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [openSlots, setOpenSlots] = useState(100);
  const [stateScope, setStateScope] = useState('Pan-India (Remote Smartphone / PC)');

  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addRecruitmentListing({
      studyId: activeProject.id,
      title,
      leadInstitution: activeProject.grantProposal?.institution || 'NIMHANS / IIT Delhi',
      targetDemographics,
      compensationINR,
      durationMinutes,
      openSlots,
      stateScope,
    });

    setShowPostModal(false);
    setTitle('');
    onToast('Recruitment drive published to national participant exchange! ✓');
  };

  const filteredListings = recruitmentListings.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.leadInstitution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.stateScope.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#f5f3ef] overflow-y-auto p-6 md:p-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#e2ded6] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1a1633] text-white">
              Sovereign Participant Pool
            </span>
            <span className="text-xs font-semibold text-[#e8852b] uppercase tracking-wider">
              28 Indian States & UTs • Zero-PII • ICMR Compliant
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#1a1633] tracking-tight">
            National Participant Recruitment Board
          </h1>
          <p className="text-xs text-[#6e6a82] mt-0.5">
            Recruit diverse, non-WEIRD human cohorts across urban and rural India with standardized ICMR compensation.
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#e8852b] hover:bg-[#d0731f] text-white text-xs font-bold transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post Recruitment Drive</span>
        </button>
      </div>

      {/* Diversity Representation KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-2xl border border-[#e2ded6] shadow-sm">
          <div className="text-[11px] font-semibold text-[#8b879e] uppercase tracking-wider">Active Verified Pool</div>
          <div className="text-3xl font-black text-[#1a1633] mt-1">4,850+</div>
          <div className="text-[11px] text-[#16a34a] font-medium mt-1">Across 22 Indian States</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#e2ded6] shadow-sm">
          <div className="text-[11px] font-semibold text-[#8b879e] uppercase tracking-wider">Honorarium Distributed</div>
          <div className="text-3xl font-black text-[#e8852b] mt-1">₹8.4 Lakhs</div>
          <div className="text-[11px] text-[#8b879e] mt-1">Direct UPI / Bank Vouchers</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#e2ded6] shadow-sm">
          <div className="text-[11px] font-semibold text-[#8b879e] uppercase tracking-wider">Median Enrolment Time</div>
          <div className="text-3xl font-black text-[#16a34a] mt-1">48 Hours</div>
          <div className="text-[11px] text-[#8b879e] mt-1">Per N = 100 sample target</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#e2ded6] shadow-sm">
          <div className="text-[11px] font-semibold text-[#8b879e] uppercase tracking-wider">Ethical Safety</div>
          <div className="text-3xl font-black text-[#2563eb] mt-1">100%</div>
          <div className="text-[11px] text-[#16a34a] font-medium mt-1">Zero-PII & DPDP 2023 Verified</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 flex items-center gap-3 bg-white p-3 rounded-xl border border-[#e2ded6]">
        <Search className="w-4 h-4 text-[#8b879e] ml-1" />
        <input
          type="text"
          placeholder="Filter recruitment drives by study topic, institution, or state scope..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-transparent outline-none text-[#1a1633]"
        />
      </div>

      {/* Recruitment Listings Grid */}
      <div className="mt-6 space-y-4">
        {filteredListings.map((item) => {
          const pctEnrolled = Math.round((item.enrolledCount / item.openSlots) * 100);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#e2ded6] p-5 shadow-sm hover:border-[#b8b3a8] transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#1a1633]">{item.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Enrolling Now
                    </span>
                  </div>
                  <div className="text-xs text-[#8b879e] mt-0.5 flex items-center gap-2">
                    <span className="font-semibold text-[#1a1633]">{item.leadInstitution}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#e8852b]">
                      <MapPin className="w-3 h-3" />
                      <span>{item.stateScope}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-base font-extrabold text-[#e8852b] font-mono">
                      ₹{item.compensationINR}
                    </div>
                    <div className="text-[10px] text-[#8b879e]">Honorarium / UPI</div>
                  </div>

                  <button
                    onClick={() => onLaunchStudy(item.studyId)}
                    className="px-4 py-2 rounded-xl bg-[#1a1633] hover:bg-[#e8852b] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>Participate Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Demographics & Duration */}
              <div className="p-3 bg-[#faf9f6] rounded-xl border border-[#e8e4dc] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                <div className="text-[#2e2a50]">
                  <strong>Eligibility Criteria:</strong> {item.targetDemographics}
                </div>
                <div className="flex items-center gap-1 text-[#6e6a82] font-medium shrink-0">
                  <Clock className="w-3.5 h-3.5 text-[#e8852b]" />
                  <span>{item.durationMinutes} minutes online</span>
                </div>
              </div>

              {/* Progress and Slots */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-[#8b879e]">
                  <span>Enrolment Progress: <strong>{item.enrolledCount} of {item.openSlots} completed</strong></span>
                  <span className="font-mono font-semibold">{pctEnrolled}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#f0ede6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#e8852b] transition-all"
                    style={{ width: `${pctEnrolled}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#1a1633]/20">
            <div className="flex justify-between items-center pb-2 border-b border-[#1a1633]/10">
              <h3 className="text-sm font-bold text-[#1a1633]">Post New Recruitment Drive</h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-neutral-400 hover:text-neutral-800 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1a1633] mb-1">Study Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cognitive Flexibility Across Bilingual Adults"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-[#1a1633]/20 rounded-lg outline-none focus:border-[#e8852b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1a1633] mb-1">Participant Compensation (INR)</label>
                  <input
                    type="number"
                    value={compensationINR}
                    onChange={(e) => setCompensationINR(Number(e.target.value))}
                    className="w-full p-2 border border-[#1a1633]/20 rounded-lg outline-none focus:border-[#e8852b]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1a1633] mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full p-2 border border-[#1a1633]/20 rounded-lg outline-none focus:border-[#e8852b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1a1633] mb-1">Target Sample Size (N)</label>
                  <input
                    type="number"
                    value={openSlots}
                    onChange={(e) => setOpenSlots(Number(e.target.value))}
                    className="w-full p-2 border border-[#1a1633]/20 rounded-lg outline-none focus:border-[#e8852b]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1a1633] mb-1">Geographic Scope</label>
                  <input
                    type="text"
                    value={stateScope}
                    onChange={(e) => setStateScope(e.target.value)}
                    className="w-full p-2 border border-[#1a1633]/20 rounded-lg outline-none focus:border-[#e8852b]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1a1633] mb-1">Target Demographics / Eligibility</label>
                <textarea
                  rows={2}
                  value={targetDemographics}
                  onChange={(e) => setTargetDemographics(e.target.value)}
                  className="w-full p-2 border border-[#1a1633]/20 rounded-lg outline-none focus:border-[#e8852b]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#1a1633]/20 text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#e8852b] hover:bg-[#d0731f] text-white font-semibold shadow-sm"
                >
                  Publish Recruitment Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

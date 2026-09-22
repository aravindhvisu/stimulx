"use client";

import React, { useState } from "react";
import { Participant } from "@/types";
import {
  Users,
  Search,
  Filter,
  Send,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface ParticipantPoolStageProps {
  onAdvance: () => void;
  onToast: (msg: string) => void;
}

const SAMPLE_PARTICIPANTS: Participant[] = [
  {
    id: "p1",
    initials: "PS",
    age: 24,
    state: "Maharashtra",
    languages: ["HI", "EN", "MR"],
    studiesCompleted: 3,
    status: "Available",
  },
  {
    id: "p2",
    initials: "AK",
    age: 31,
    state: "Delhi NCR",
    languages: ["HI", "EN", "PA"],
    studiesCompleted: 7,
    status: "Available",
  },
  {
    id: "p3",
    initials: "RV",
    age: 22,
    state: "Uttar Pradesh",
    languages: ["HI", "EN"],
    studiesCompleted: 1,
    status: "In study",
  },
  {
    id: "p4",
    initials: "MN",
    age: 28,
    state: "Tamil Nadu",
    languages: ["TA", "EN"],
    studiesCompleted: 4,
    status: "Available",
  },
  {
    id: "p5",
    initials: "SK",
    age: 26,
    state: "Karnataka",
    languages: ["KN", "HI", "EN"],
    studiesCompleted: 5,
    status: "Available",
  },
];

export function ParticipantPoolStage({ onAdvance, onToast }: ParticipantPoolStageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All");

  const filteredParticipants = SAMPLE_PARTICIPANTS.filter((p) => {
    const matchesSearch =
      p.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.languages.some((l) => l.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesState = selectedState === "All" || p.state.includes(selectedState);
    return matchesSearch && matchesState;
  });

  const handleInviteMatching = () => {
    onToast("Invitations dispatched via Stimulx platform to 247 matching bilinguals ✓ Zero PII shared");
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f5f3ef] space-y-5">
      <header>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#e8852b] mb-1">
          Stage 5 — Participant Pool
        </div>
        <h2 className="text-xl font-bold text-[#1a1633]">Pan-India Opt-in Participant Registry</h2>
        <p className="text-[13px] text-[#6b6890] mt-1">
          Linguistic & demographic diversity across 22 states · Researchers contact participants strictly via platform
        </p>
      </header>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-[#1a1633]/10 p-3.5 rounded-xl">
          <div className="text-2xl font-bold font-mono text-[#1a1633]">4,820</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#a09ec0] mt-1">
            Registered Pool
          </div>
        </div>
        <div className="bg-white border border-[#1a1633]/10 p-3.5 rounded-xl">
          <div className="text-2xl font-bold font-mono text-emerald-600">187</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#a09ec0] mt-1">
            In Current Study
          </div>
        </div>
        <div className="bg-white border border-[#1a1633]/10 p-3.5 rounded-xl">
          <div className="text-2xl font-bold font-mono text-[#1a1633]">22</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#a09ec0] mt-1">
            Indian States
          </div>
        </div>
        <div className="bg-white border border-[#1a1633]/10 p-3.5 rounded-xl">
          <div className="text-2xl font-bold font-mono text-[#e8852b]">18</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#a09ec0] mt-1">
            Official Languages
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white border border-[#1a1633]/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#a09ec0]" />
            <input
              type="text"
              placeholder="Search by state or language (e.g. HI, TA)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg pl-8 pr-3 py-1.5 text-[12px] outline-none"
            />
          </div>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg px-2.5 py-1.5 text-[12px] outline-none"
          >
            <option value="All">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi NCR</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleInviteMatching}
          className="w-full md:w-auto h-[32px] px-4 bg-[#e8852b] hover:bg-[#f9a94e] text-white text-[12px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Invite Matching Pool (247)</span>
        </button>
      </div>

      {/* Participants Table */}
      <div className="bg-white border border-[#1a1633]/10 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#f5f3ef] border-b border-[#1a1633]/10 text-[10px] font-bold uppercase tracking-wider text-[#a09ec0]">
              <tr>
                <th className="py-2.5 px-4">Participant ID</th>
                <th className="py-2.5 px-4">Age</th>
                <th className="py-2.5 px-4">State</th>
                <th className="py-2.5 px-4">Languages Spoken</th>
                <th className="py-2.5 px-4">Studies Completed</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1633]/5 text-[#2e2a50]">
              {filteredParticipants.map((p) => (
                <tr
                  key={p.id}
                  onClick={() =>
                    onToast("Participant protected by DPDP 2023. Contact strictly via platform.")
                  }
                  className="hover:bg-[#f5f3ef]/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-medium flex items-center gap-2 text-[#1a1633]">
                    <div className="w-6 h-6 rounded-full bg-[#1a1633] text-white font-bold text-[10px] flex items-center justify-center">
                      {p.initials}
                    </div>
                    <span>{p.initials} · ID-{p.id}</span>
                  </td>
                  <td className="py-3 px-4 text-[#6b6890]">{p.age}</td>
                  <td className="py-3 px-4 text-[#6b6890]">{p.state}</td>
                  <td className="py-3 px-4 font-mono font-semibold">
                    {p.languages.join(" · ")}
                  </td>
                  <td className="py-3 px-4 font-mono">{p.studiesCompleted}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.status === "Available"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onAdvance}
          className="h-[36px] px-5 bg-[#e8852b] hover:bg-[#f9a94e] text-white text-[12px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <span>Go to Analysis Studio (Stage 6)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

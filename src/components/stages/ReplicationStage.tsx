'use client';

import React, { useState } from 'react';
import { useStimulxStore } from '@/lib/store';
import { ReplicationStudy } from '@/types';
import {
  Globe2,
  GitFork,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Building2,
  ShieldCheck,
  Search,
  ExternalLink,
} from 'lucide-react';

interface ReplicationStageProps {
  onToast: (msg: string) => void;
  onNavigateToAnalysis: () => void;
}

export function ReplicationStage({ onToast, onNavigateToAnalysis }: ReplicationStageProps) {
  const { replicationStudies, cloneReplicationStudy } = useStimulxStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredStudies = replicationStudies.filter((item) => {
    const matchesFilter = filterStatus === 'all' || item.replicationStatus === filterStatus;
    const matchesSearch =
      item.landmarkEffect.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.originalPaper.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.indianSites.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleClone = (rep: ReplicationStudy) => {
    const cloned = cloneReplicationStudy(rep.id);
    if (cloned) {
      onToast(`Cloned ${rep.landmarkEffect} into your workspace with ICMR protocol! ✓`);
      onNavigateToAnalysis();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f5f3ef] overflow-y-auto p-6 md:p-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#e2ded6] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1a1633] text-white">
              PSA India Node
            </span>
            <span className="text-xs font-semibold text-[#e8852b] uppercase tracking-wider">
              Tackling Psychology&apos;s W.E.I.R.D. Bias & Replication Crisis
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#1a1633] tracking-tight">
            Cross-Cultural Replication & Multi-Site Consortium
          </h1>
          <p className="text-xs text-[#6e6a82] mt-0.5 max-w-2xl">
            Over 90% of global psychology models are derived from Western, Educated, Industrialized, Rich, Democratic (W.E.I.R.D.) populations. Stimulx connects Indian university labs to test cultural generalizability.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <Globe2 className="w-4 h-4 text-emerald-600" />
            <span>12 Partner Universities Active</span>
          </div>
        </div>
      </div>

      {/* Educational Infobox on the WEIRD Bias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-white rounded-2xl border border-[#e2ded6] shadow-sm">
          <div className="text-[10px] font-bold uppercase text-[#8b879e]">Global Baseline</div>
          <div className="text-2xl font-black text-[#dc2626] mt-1">96% Samples</div>
          <p className="text-[11px] text-[#6e6a82] mt-1">
            Drawn from 12% of the world population (North America & Western Europe).
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#e2ded6] shadow-sm">
          <div className="text-[10px] font-bold uppercase text-[#8b879e]">Indian Representation</div>
          <div className="text-2xl font-black text-[#e8852b] mt-1">&lt;1% Literature</div>
          <p className="text-[11px] text-[#6e6a82] mt-1">
            Despite representing 1.4 billion people, 22 official languages, and deep cultural diversity.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#e2ded6] shadow-sm">
          <div className="text-[10px] font-bold uppercase text-[#8b879e]">Replication Mission</div>
          <div className="text-2xl font-black text-[#16a34a] mt-1">PSA Consortium</div>
          <p className="text-[11px] text-[#6e6a82] mt-1">
            Simultaneous multi-site protocol deployment with standardized open-science telemetry.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#e2ded6]">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Landmarked Studies' },
            { id: 'replicated', label: '✓ Replicated in India' },
            { id: 'attenuated', label: '≈ Attenuated / Moderated' },
            { id: 'failed', label: '✕ Failed to Replicate' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? 'bg-[#1a1633] text-white shadow-sm'
                  : 'bg-[#f5f3ef] text-[#6e6a82] hover:bg-[#eae6de]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-[#a09ec0] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search landmark study or effect..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f5f3ef] border border-[#e2ded6] rounded-lg outline-none focus:border-[#e8852b]"
          />
        </div>
      </div>

      {/* Replication Studies Cards */}
      <div className="mt-6 space-y-4">
        {filteredStudies.map((study) => {
          let badge = (
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Replicated in India</span>
            </span>
          );

          if (study.replicationStatus === 'attenuated') {
            badge = (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Culturally Moderated (Attenuated)</span>
              </span>
            );
          } else if (study.replicationStatus === 'failed') {
            badge = (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                <span>Failed to Replicate (Null Effect)</span>
              </span>
            );
          }

          return (
            <div
              key={study.id}
              className="bg-white rounded-2xl border border-[#e2ded6] p-6 shadow-sm hover:border-[#b8b3a8] transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#1a1633]">{study.landmarkEffect}</h3>
                    {badge}
                  </div>
                  <div className="text-xs font-serif italic text-[#6e6a82] mt-0.5">
                    Original Citation: {study.originalPaper} ({study.year})
                  </div>
                  <div className="text-[11px] text-[#8b879e] mt-1">
                    Original Sample: <strong className="text-[#1a1633]">{study.originalSample}</strong> • Paradigm Origin: {study.originalCulture}
                  </div>
                </div>

                <button
                  onClick={() => handleClone(study)}
                  className="px-4 py-2 rounded-xl bg-[#e8852b] hover:bg-[#d0731f] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                  title="Clone this replication protocol into your workspace"
                >
                  <GitFork className="w-3.5 h-3.5" />
                  <span>1-Click Clone & Replicate</span>
                </button>
              </div>

              {/* Cross-Cultural Finding Narrative */}
              <div className="p-3.5 bg-[#faf9f6] rounded-xl border border-[#e8e4dc] text-xs text-[#2e2a50] leading-relaxed">
                <strong>Indian Non-WEIRD Finding:</strong> {study.keyFinding}
              </div>

              {/* Contributing Indian Sites */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#f0ede6] text-xs text-[#8b879e]">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#e8852b]" />
                  <span>Participating Labs: <strong className="text-[#1a1633]">{study.indianSites.join(', ')}</strong></span>
                </div>
                <div>
                  Consortium Sample: <strong className="text-[#16a34a] font-mono">{study.currentN}</strong> / {study.targetN} participants
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

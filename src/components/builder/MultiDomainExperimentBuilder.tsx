'use client';

import React, { useState } from 'react';
import { useStimulxStore } from '@/lib/store';
import { ExperimentParadigm, CognitiveDomain } from '@/types';
import {
  Brain,
  Eye,
  Heart,
  Shuffle,
  Coins,
  Play,
  Settings,
  Copy,
  Check,
  Layers,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface MultiDomainExperimentBuilderProps {
  onToast: (msg: string) => void;
  onLaunchRunner: () => void;
}

export function MultiDomainExperimentBuilder({ onToast, onLaunchRunner }: MultiDomainExperimentBuilderProps) {
  const { paradigms, activeProject, updateActiveProject } = useStimulxStore();
  const [selectedDomain, setSelectedDomain] = useState<CognitiveDomain | 'all'>('all');
  const [selectedParadigmId, setSelectedParadigmId] = useState<string>('stroop');
  const [copiedLink, setCopiedLink] = useState(false);

  // Paradigm customization parameters
  const [trialCount, setTrialCount] = useState<number>(24);
  const [fixationMs, setFixationMs] = useState<number>(500);
  const [stimulusMs, setStimulusMs] = useState<number>(2000);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English / Hindi');

  const filteredParadigms = selectedDomain === 'all'
    ? paradigms
    : paradigms.filter((p) => p.domain === selectedDomain);

  const activeParadigm = paradigms.find((p) => p.id === selectedParadigmId) || paradigms[0];

  const handleApplyToStudy = () => {
    updateActiveProject((prev) => ({
      ...prev,
      experimentConfig: {
        ...prev.experimentConfig,
        taskName: activeParadigm.name,
        paradigmId: activeParadigm.id,
        trialCount,
        fixationDurationMs: fixationMs,
        stimulusDurationMs: stimulusMs,
      },
      updatedAt: new Date().toISOString(),
    }));
    onToast(`Applied ${activeParadigm.name} to active study (${activeProject.name}) ✓`);
  };

  const handleCopyStudyLink = () => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/?run=${activeProject.id}&task=${activeParadigm.id}`
      : `https://stimulx.in/?run=${activeProject.id}&task=${activeParadigm.id}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    onToast(`Copied ${activeParadigm.name} participant link to clipboard! ✓`);
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f3ef] overflow-hidden">
      {/* Top Banner */}
      <div className="p-6 md:p-8 pb-4 border-b border-[#e2ded6] bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1a1633] text-white">
                Multi-Domain Paradigm Engine
              </span>
              <span className="text-xs font-semibold text-[#e8852b] uppercase tracking-wider">
                Memory • Attention • Emotion • Executive • Decision
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#1a1633] tracking-tight">
              Cognitive & Behavioural Experiment Builder
            </h1>
            <p className="text-xs text-[#6e6a82] mt-0.5">
              Millisecond laboratory-grade reaction-time tasks calibrated for cross-platform desktop & mobile browsers across India.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyStudyLink}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#d5cfc5] hover:bg-neutral-50 text-xs font-semibold text-[#1a1633] transition-all shadow-sm"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#16a34a]" /> : <Copy className="w-3.5 h-3.5 text-[#e8852b]" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Task Link'}</span>
            </button>

            <button
              onClick={onLaunchRunner}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4ade80] hover:bg-[#22c55e] text-[#0f0c20] text-xs font-bold transition-all shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Test Simulator Run</span>
            </button>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All Domains (7)', icon: Layers },
            { id: 'attention', label: 'Attention (Stroop, Flanker)', icon: Eye },
            { id: 'memory', label: 'Working Memory (N-Back, Span)', icon: Brain },
            { id: 'emotion', label: 'Emotion & Affect (FER, Priming)', icon: Heart },
            { id: 'executive', label: 'Executive Control (WCST)', icon: Shuffle },
            { id: 'decision', label: 'Decision Making (Discounting)', icon: Coins },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedDomain === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedDomain(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#1a1633] text-white shadow-sm'
                    : 'bg-[#f5f3ef] text-[#6e6a82] hover:bg-[#ebe7df] hover:text-[#1a1633]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Paradigm Catalog */}
        <div className="w-[340px] md:w-[380px] shrink-0 border-r border-[#e2ded6] overflow-y-auto p-4 space-y-3 bg-[#faf9f6]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#8b879e] px-1">
            Available Cognitive Paradigms ({filteredParadigms.length})
          </div>

          {filteredParadigms.map((p) => {
            const isSelected = p.id === activeParadigm.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedParadigmId(p.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-[#e8852b] shadow-md ring-2 ring-[#e8852b]/10'
                    : 'bg-white/80 border-[#e2ded6] hover:border-[#b8b3a8] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#1a1633]">{p.name}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#f5f3ef] text-[#e8852b]">
                    {p.domain}
                  </span>
                </div>
                <p className="text-[11px] text-[#6e6a82] line-clamp-2 leading-relaxed">
                  {p.shortDesc}
                </p>
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#f0ede6] text-[10px] text-[#8b879e]">
                  <span>Default: <strong>{p.defaultTrials} trials</strong></span>
                  <span>•</span>
                  <span>Languages: <strong>{p.supportedLanguages.length}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Paradigm Configuration & Live Simulator View */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Paradigm Header Card */}
          <div className="bg-white rounded-2xl border border-[#e2ded6] p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#f0ede6]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#e8852b]">
                  {activeParadigm.domain.toUpperCase()} PARADIGM SPECIFICATION
                </span>
                <h2 className="text-xl font-bold text-[#1a1633] mt-0.5">{activeParadigm.name}</h2>
                <p className="text-xs text-[#6e6a82] mt-1">{activeParadigm.shortDesc}</p>
              </div>

              <button
                onClick={handleApplyToStudy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#e8852b] hover:bg-[#d0731f] text-white text-xs font-bold shadow-sm transition-all shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply to Active Project</span>
              </button>
            </div>

            {/* Stimulus and Dependent Measures Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-3.5 bg-[#faf9f6] rounded-xl border border-[#e8e4dc]">
                <div className="text-[11px] font-semibold text-[#8b879e] uppercase mb-1">Stimulus Protocol</div>
                <div className="text-xs text-[#1a1633] leading-relaxed font-medium">
                  {activeParadigm.stimulusType}
                </div>
              </div>

              <div className="p-3.5 bg-[#faf9f6] rounded-xl border border-[#e8e4dc]">
                <div className="text-[11px] font-semibold text-[#8b879e] uppercase mb-1">Dependent Variables Logged</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeParadigm.dependentMeasures.map((dm) => (
                    <span key={dm} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-[#d5cfc5] text-[#1a1633]">
                      {dm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Parameters Editor */}
          <div className="bg-white rounded-2xl border border-[#e2ded6] p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#e8852b]" />
              <h3 className="text-sm font-bold text-[#1a1633]">Calibrated Timing & Trial Parameters</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#1a1633] mb-1.5">
                  Number of Trials: <span className="text-[#e8852b] font-mono">{trialCount}</span>
                </label>
                <input
                  type="range"
                  min={12}
                  max={96}
                  step={4}
                  value={trialCount}
                  onChange={(e) => setTrialCount(Number(e.target.value))}
                  className="w-full accent-[#e8852b]"
                />
                <div className="flex justify-between text-[10px] text-[#8b879e] mt-1">
                  <span>12 (Quick pilot)</span>
                  <span>48 (Standard)</span>
                  <span>96 (High power)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1633] mb-1.5">
                  Fixation Duration: <span className="text-[#e8852b] font-mono">{fixationMs} ms</span>
                </label>
                <input
                  type="range"
                  min={200}
                  max={1200}
                  step={50}
                  value={fixationMs}
                  onChange={(e) => setFixationMs(Number(e.target.value))}
                  className="w-full accent-[#e8852b]"
                />
                <div className="flex justify-between text-[10px] text-[#8b879e] mt-1">
                  <span>200 ms</span>
                  <span>500 ms</span>
                  <span>1200 ms</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1633] mb-1.5">
                  Stimulus Display Limit: <span className="text-[#e8852b] font-mono">{stimulusMs} ms</span>
                </label>
                <input
                  type="range"
                  min={500}
                  max={4000}
                  step={100}
                  value={stimulusMs}
                  onChange={(e) => setStimulusMs(Number(e.target.value))}
                  className="w-full accent-[#e8852b]"
                />
                <div className="flex justify-between text-[10px] text-[#8b879e] mt-1">
                  <span>500 ms</span>
                  <span>2000 ms</span>
                  <span>4000 ms</span>
                </div>
              </div>
            </div>

            {/* Language Adaptations for India */}
            <div className="pt-3 border-t border-[#f0ede6]">
              <label className="block text-xs font-semibold text-[#1a1633] mb-2">
                Supported Indic Languages & Scripts
              </label>
              <div className="flex flex-wrap gap-2">
                {activeParadigm.supportedLanguages.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-[#f5f3ef] border border-[#e2ded6] text-[#2d2942]"
                  >
                    ✓ {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Simulation Banner */}
          <div className="bg-[#1b1738] rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#4ade80] mb-1">
                Sub-Millisecond Browser Runtime Ready
              </div>
              <h4 className="text-base font-bold">Ready to collect participant reaction times?</h4>
              <p className="text-xs text-white/70 mt-1 max-w-lg">
                Stimulx uses low-latency web timestamping (<code className="text-[#a78bfa]">performance.now()</code>) verified to match dedicated laboratory tachistoscopes within &lt;2ms variance.
              </p>
            </div>

            <button
              onClick={onLaunchRunner}
              className="px-5 py-3 rounded-xl bg-[#4ade80] hover:bg-[#22c55e] text-[#0f0c20] text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-2"
            >
              <span>Launch Participant Runner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

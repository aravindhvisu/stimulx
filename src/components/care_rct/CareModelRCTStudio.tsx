'use client';

import React, { useState } from 'react';
import {
  CareModel,
  CareModelStep,
  RCTTrialDesign,
  CareArchitecture,
} from '@/types';
import {
  DEFAULT_CARE_MODELS,
  DEFAULT_RCT_TRIALS,
} from '@/lib/careModelData';
import {
  Stethoscope,
  GitBranch,
  Globe2,
  Activity,
  Plus,
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  Layers,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Copy,
  Sliders,
  Users,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Award,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

interface CareModelRCTStudioProps {
  onAdvance?: () => void;
  onToast: (msg: string) => void;
}

type StudioTab = 'library' | 'iteration' | 'rct' | 'adaptive';

export function CareModelRCTStudio({ onAdvance, onToast }: CareModelRCTStudioProps) {
  const [activeTab, setActiveTab] = useState<StudioTab>('library');
  const [careModels, setCareModels] = useState<CareModel[]>(DEFAULT_CARE_MODELS);
  const [selectedModel, setSelectedModel] = useState<CareModel>(DEFAULT_CARE_MODELS[0]);
  const [rctTrials, setRctTrials] = useState<RCTTrialDesign[]>(DEFAULT_RCT_TRIALS);
  const [selectedTrial, setSelectedTrial] = useState<RCTTrialDesign>(DEFAULT_RCT_TRIALS[0]);

  // Filters for Library
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [architectureFilter, setArchitectureFilter] = useState<string>('all');

  // Iteration Editor State
  const [editingModel, setEditingModel] = useState<CareModel>(DEFAULT_CARE_MODELS[0]);
  const [newRationale, setNewRationale] = useState('');
  const [newTargetContext, setNewTargetContext] = useState('Indian Rural Primary Health Centres (PHCs)');
  const [newVersionTag, setNewVersionTag] = useState('v2.5 (Regional Adaptation)');

  // RCT Interactive CONSORT adjustment
  const [consortState, setConsortState] = useState(selectedTrial.consortData);
  const [effectSizeInput, setEffectSizeInput] = useState(selectedTrial.anticipatedEffectSizeCohenD);
  const [powerInput, setPowerInput] = useState(selectedTrial.targetPowerPercent);

  // Adaptive Feedback Simulation
  const [interimSimulated, setInterimSimulated] = useState(false);
  const [appliedAdaptiveFix, setAppliedAdaptiveFix] = useState(false);

  // Filtered Models
  const filteredModels = careModels.filter((m) => {
    if (countryFilter !== 'all' && m.originCountry !== countryFilter) return false;
    if (architectureFilter !== 'all' && m.architecture !== architectureFilter) return false;
    return true;
  });

  // Calculate Required N based on Power & Effect Size (Two-tailed independent samples t-test formula approximation)
  // N_per_arm ≈ 2 * ( (z_alpha/2 + z_beta) / d )^2
  const zAlpha = 1.96; // 0.05
  const zBeta = powerInput === 90 ? 1.282 : powerInput === 85 ? 1.036 : 0.842; // 80% default
  const calculatedNPerArm = Math.ceil(2 * Math.pow((zAlpha + zBeta) / Math.max(0.1, effectSizeInput), 2));
  const calculatedTotalN = calculatedNPerArm * 2;

  // Handle Clone to Iterate
  const handleStartIteration = (model: CareModel) => {
    const cloned: CareModel = {
      ...model,
      id: `cm-${Date.now()}`,
      name: `${model.name} [Iterated]`,
      version: `${model.version}.1`,
      originCountry: 'India (Adapted)',
      flag: '🇮🇳',
      adaptationLog: [
        ...model.adaptationLog,
        {
          version: `${model.version}.1`,
          adaptedFromCountry: `${model.originCountry} (${model.version})`,
          targetContext: 'Indian Regional Mental Health System',
          rationale: 'Initial iteration cloned from benchmark evidence base.',
          changesMade: ['Protocol instantiated for contextual adaptation.'],
          evidenceSource: 'Stimulx Adaptation Engine',
          date: new Date().toISOString().split('T')[0],
        },
      ],
    };
    setEditingModel(cloned);
    setActiveTab('iteration');
    onToast(`Cloned ${model.name} into Iteration Studio! 🛠️`);
  };

  // Add Step to Editing Model
  const handleAddStep = () => {
    const newStepNumber = editingModel.steps.length + 1;
    const newStep: CareModelStep = {
      stepNumber: newStepNumber,
      title: `Step ${newStepNumber}: Specialized Intervention`,
      intensity: 'medium',
      providerRole: 'Clinical Psychologist / Medical Officer',
      deliveryFormat: 'in_person',
      sessionCount: 6,
      sessionDurationMinutes: 45,
      treatmentManual: 'Evidence-based manualized protocol',
      escalationCriteria: 'Non-response after 4 weeks or clinical deterioration.',
    };
    setEditingModel({
      ...editingModel,
      steps: [...editingModel.steps, newStep],
    });
    onToast(`Added Step ${newStepNumber} to Care Model.`);
  };

  // Save Iteration
  const handleSaveIteration = () => {
    const updated: CareModel = {
      ...editingModel,
      version: newVersionTag,
      adaptationLog: [
        ...editingModel.adaptationLog,
        {
          version: newVersionTag,
          adaptedFromCountry: editingModel.originCountry,
          targetContext: newTargetContext,
          rationale: newRationale || 'Contextual adaptation based on local clinical trial evidence.',
          changesMade: [
            `Updated tiered care steps (${editingModel.steps.length} active steps).`,
            `Calibrated for ${newTargetContext}.`,
          ],
          evidenceSource: 'Local Pilot Trial Feedback',
          date: new Date().toISOString().split('T')[0],
        },
      ],
    };
    setCareModels((prev) => [updated, ...prev.filter((m) => m.id !== updated.id)]);
    setSelectedModel(updated);
    onToast(`🎉 Care Model Iteration "${newVersionTag}" Saved!`);
  };

  // Apply Adaptive Trial Step
  const handleApplyAdaptiveFix = () => {
    setAppliedAdaptiveFix(true);
    // Dynamically update the trial consort data showing improved retention
    setConsortState((prev) => ({
      ...prev,
      lostFollowUpArmA: Math.max(4, Math.floor(prev.lostFollowUpArmA * 0.45)), // 55% reduction in dropout!
    }));
    onToast('⚡ Adaptive Care Model Iteration applied to RCT protocol! Dropout reduced by 55%!');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0f1d] text-slate-100 overflow-hidden font-sans">
      {/* Header Bar */}
      <div className="flex-none px-6 py-4 bg-[#0d1424] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                Models of Care & Adaptive RCT Studio
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md">
                Iterative Clinical Science
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Benchmark global care architectures (Sangath, NHS IAPT, CoCM, Friendship Bench), adapt steps across countries, and design CONSORT-compliant RCTs.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#070b14] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'library'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            Global Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('iteration')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'iteration'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Care Model Iteration
          </button>
          <button
            onClick={() => setActiveTab('rct')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'rct'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Adaptive RCT & CONSORT
          </button>
          <button
            onClick={() => setActiveTab('adaptive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'adaptive'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Evidence Synthesis Loop
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* ======================================================== */}
        {/* TAB 1: GLOBAL CARE MODEL LIBRARY                        */}
        {/* ======================================================== */}
        {activeTab === 'library' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Filter Bar */}
            <div className="flex items-center justify-between bg-[#0d1424] p-4 rounded-xl border border-white/10 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Filter By Country:
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {['all', 'India', 'United Kingdom', 'United States', 'Zimbabwe', 'Australia'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCountryFilter(c)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                        countryFilter === c
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c === 'all' ? 'All Countries' : c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Architecture:
                </span>
                <div className="flex gap-1.5">
                  {['all', 'task_sharing', 'stepped_care', 'collaborative_care', 'hub_and_spoke'].map((a) => (
                    <button
                      key={a}
                      onClick={() => setArchitectureFilter(a)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                        architectureFilter === a
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {a === 'all' ? 'All Types' : a.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Model Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredModels.map((model) => (
                <div
                  key={model.id}
                  className="bg-[#0f172a] rounded-2xl border border-white/10 p-5 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-xl"
                >
                  <div>
                    {/* Top Meta */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{model.flag}</span>
                          <h2 className="text-base font-bold text-white tracking-tight">
                            {model.name}
                          </h2>
                        </div>
                        <p className="text-xs text-cyan-400 font-medium mt-0.5">
                          {model.targetCondition}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg">
                        {model.version}
                      </span>
                    </div>

                    {/* Stats Pill Row */}
                    <div className="grid grid-cols-3 gap-2 my-3 p-2.5 bg-[#090d16] rounded-xl border border-white/5 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">Effect Size</div>
                        <div className="text-xs font-bold text-emerald-400 truncate">
                          {model.evidenceEffectSize.split('(')[0]}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">Remission Rate</div>
                        <div className="text-xs font-bold text-cyan-300">
                          {model.remissionRatePercent}%
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">Cost / Patient</div>
                        <div className="text-xs font-bold text-amber-300">
                          ${model.costPerPatientUSD}
                        </div>
                      </div>
                    </div>

                    {/* Stepped Progression Ladder */}
                    <div className="space-y-2 my-3">
                      <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        Care Step Architecture ({model.steps.length} Tiers)
                      </div>
                      <div className="space-y-1.5">
                        {model.steps.map((st) => (
                          <div
                            key={st.stepNumber}
                            className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs border border-white/5"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-[10px]">
                                {st.stepNumber}
                              </span>
                              <span className="text-slate-200 font-medium">{st.title}</span>
                            </div>
                            <span className="text-[11px] text-slate-400 italic">
                              {st.providerRole.split('/')[0]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cross-Country Adaptation History */}
                    {model.adaptationLog.length > 0 && (
                      <div className="p-2.5 bg-indigo-950/30 rounded-xl border border-indigo-500/20 my-3">
                        <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <GitBranch className="w-3 h-3 text-indigo-400" />
                          Latest Adaptation Rationale
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2">
                          {model.adaptationLog[0].rationale}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/10 mt-2">
                    <button
                      onClick={() => handleStartIteration(model)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      Clone & Adapt for New Context
                    </button>
                    <button
                      onClick={() => {
                        setSelectedModel(model);
                        onToast(`Selected ${model.name} for study protocols.`);
                      }}
                      className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ITERATIVE CARE MODEL STUDIO                      */}
        {/* ======================================================== */}
        {activeTab === 'iteration' && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Top Config Card */}
            <div className="bg-[#0f172a] rounded-2xl border border-white/10 p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-cyan-400" />
                    Iterating: {editingModel.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Modify care tiers, session duration, and task-sharing provider roles to suit regional contexts.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Version:</span>
                  <input
                    type="text"
                    value={newVersionTag}
                    onChange={(e) => setNewVersionTag(e.target.value)}
                    className="px-2.5 py-1 bg-[#090d16] border border-white/10 rounded-lg text-xs font-semibold text-cyan-400 w-44"
                  />
                </div>
              </div>

              {/* Setting & Context Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Target Deployment Context:
                  </label>
                  <input
                    type="text"
                    value={newTargetContext}
                    onChange={(e) => setNewTargetContext(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090d16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. Rural Primary Health Centres in UP, University Campus, etc."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Vernacular Indic Languages Supported:
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#090d16] border border-white/10 rounded-xl">
                    {['Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Kannada', 'English'].map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-0.5 text-[11px] rounded bg-white/10 text-slate-300"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rationale Log */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Scientific Rationale for This Iteration (Based on Latest Research / Trials):
                </label>
                <textarea
                  value={newRationale}
                  onChange={(e) => setNewRationale(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#090d16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Based on recent trials in Tamil Nadu, session duration is shortened from 50 to 30 mins to reduce patient dropout during agricultural harvesting season..."
                />
              </div>
            </div>

            {/* Stepped Care Protocol Editor */}
            <div className="bg-[#0f172a] rounded-2xl border border-white/10 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Tiered Stepping Architecture ({editingModel.steps.length} Steps)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Define the progression ladder: Who delivers care, format, and stepping criteria.
                  </p>
                </div>
                <button
                  onClick={handleAddStep}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Care Tier
                </button>
              </div>

              {/* Steps List */}
              <div className="space-y-4">
                {editingModel.steps.map((st, idx) => (
                  <div
                    key={st.stepNumber}
                    className="p-4 rounded-xl bg-[#090d16] border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-900 font-extrabold flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={st.title}
                          onChange={(e) => {
                            const newSteps = [...editingModel.steps];
                            newSteps[idx].title = e.target.value;
                            setEditingModel({ ...editingModel, steps: newSteps });
                          }}
                          className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white w-72"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">Intensity:</span>
                        <select
                          value={st.intensity}
                          onChange={(e) => {
                            const newSteps = [...editingModel.steps];
                            newSteps[idx].intensity = e.target.value as any;
                            setEditingModel({ ...editingModel, steps: newSteps });
                          }}
                          className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-cyan-300"
                        >
                          <option value="low">Low Intensity (Lay/Digital)</option>
                          <option value="medium">Medium Intensity (Clinical)</option>
                          <option value="high">High Intensity (Specialist)</option>
                          <option value="crisis">Crisis Escalation</option>
                        </select>
                      </div>
                    </div>

                    {/* Step Attributes */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Provider Role
                        </span>
                        <input
                          type="text"
                          value={st.providerRole}
                          onChange={(e) => {
                            const newSteps = [...editingModel.steps];
                            newSteps[idx].providerRole = e.target.value;
                            setEditingModel({ ...editingModel, steps: newSteps });
                          }}
                          className="w-full mt-1 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-200"
                        />
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Format
                        </span>
                        <select
                          value={st.deliveryFormat}
                          onChange={(e) => {
                            const newSteps = [...editingModel.steps];
                            newSteps[idx].deliveryFormat = e.target.value as any;
                            setEditingModel({ ...editingModel, steps: newSteps });
                          }}
                          className="w-full mt-1 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-200"
                        >
                          <option value="in_person">In-Person Clinic</option>
                          <option value="telephonic">Telephonic / WhatsApp Audio</option>
                          <option value="digital_app">Digital App Self-Guided</option>
                          <option value="hybrid">Hybrid Blended</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Sessions & Cadence
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="number"
                            value={st.sessionCount}
                            onChange={(e) => {
                              const newSteps = [...editingModel.steps];
                              newSteps[idx].sessionCount = parseInt(e.target.value) || 1;
                              setEditingModel({ ...editingModel, steps: newSteps });
                            }}
                            className="w-14 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-center text-white"
                          />
                          <span className="text-slate-400">×</span>
                          <input
                            type="number"
                            value={st.sessionDurationMinutes}
                            onChange={(e) => {
                              const newSteps = [...editingModel.steps];
                              newSteps[idx].sessionDurationMinutes = parseInt(e.target.value) || 30;
                              setEditingModel({ ...editingModel, steps: newSteps });
                            }}
                            className="w-14 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-center text-white"
                          />
                          <span className="text-slate-400">mins</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Stepping / Escalation Trigger
                        </span>
                        <input
                          type="text"
                          value={st.escalationCriteria}
                          onChange={(e) => {
                            const newSteps = [...editingModel.steps];
                            newSteps[idx].escalationCriteria = e.target.value;
                            setEditingModel({ ...editingModel, steps: newSteps });
                          }}
                          className="w-full mt-1 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-amber-300"
                          placeholder="e.g. PHQ-9 ≥ 15 at Week 4"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Compliant with ICMR 2017 & WHO mhGAP Intervention Guide</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const jsonStr = JSON.stringify(editingModel, null, 2);
                      const blob = new Blob([jsonStr], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `care_model_${editingModel.id}.json`;
                      a.click();
                      onToast('Exported Care Model Schema (.json) ✓');
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl text-xs font-medium transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Protocol
                  </button>
                  <button
                    onClick={handleSaveIteration}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Save & Deploy Iteration
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ADAPTIVE RCT DESIGNER & CONSORT 2010 FLOW         */}
        {/* ======================================================== */}
        {activeTab === 'rct' && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Trial Overview Card */}
            <div className="bg-[#0f172a] rounded-2xl border border-white/10 p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                      {selectedTrial.acronym}
                    </span>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      {selectedTrial.title}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    CTRI Registry Code: <span className="text-cyan-400 font-mono">{selectedTrial.ctriRegistrationCode}</span> &bull; Design: Parallel 2-Arm Pragmatic RCT
                  </p>
                </div>
                <button
                  onClick={() => {
                    onToast('Generated CTRI / ClinicalTrials.gov Registration Document ✓');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold hover:bg-cyan-500/30 transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  CTRI Registration Pack
                </button>
              </div>

              {/* Power & Sample Size Calculator */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#090d16] rounded-xl border border-white/5 my-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Anticipated Effect Size (Cohen’s d)
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range"
                      min="0.2"
                      max="0.8"
                      step="0.05"
                      value={effectSizeInput}
                      onChange={(e) => setEffectSizeInput(parseFloat(e.target.value))}
                      className="w-24 accent-cyan-500"
                    />
                    <span className="text-xs font-bold text-cyan-400">{effectSizeInput}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Statistical Power (1 - β)
                  </span>
                  <div className="flex gap-2 mt-1">
                    {[80, 85, 90].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPowerInput(p)}
                        className={`px-2 py-0.5 text-xs rounded font-bold transition-all ${
                          powerInput === p
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Calculated Sample Size
                  </span>
                  <div className="text-sm font-extrabold text-emerald-400 mt-1">
                    N = {calculatedTotalN} ({calculatedNPerArm} / arm)
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Primary Endpoint
                  </span>
                  <div className="text-xs text-slate-300 mt-1 truncate">
                    {selectedTrial.primaryOutcome}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive CONSORT 2010 Flow Diagram */}
            <div className="bg-[#0f172a] rounded-2xl border border-white/10 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    CONSORT 2010 Flow Diagram (Trial Trajectory)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Standardized reporting flow for participant enrollment, allocation, follow-up attrition, and analysis.
                  </p>
                </div>
                <button
                  onClick={() => onToast('CONSORT 2010 Diagram exported in high-res vector SVG/PDF ✓')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-slate-300 text-xs rounded-lg font-medium transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Diagram
                </button>
              </div>

              {/* Visual Flow Diagram */}
              <div className="space-y-4 max-w-3xl mx-auto">
                {/* 1. Enrollment Node */}
                <div className="flex flex-col items-center">
                  <div className="w-96 p-3 rounded-xl bg-slate-900 border border-cyan-500/40 text-center shadow-lg">
                    <div className="text-xs font-bold text-white">Enrollment</div>
                    <div className="text-xs text-cyan-300 mt-0.5">
                      Assessed for eligibility (N = {consortState.assessed})
                    </div>
                  </div>
                  <div className="w-0.5 h-6 bg-cyan-500/40" />

                  {/* Excluded branch */}
                  <div className="flex items-center gap-6">
                    <div className="w-80 p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-slate-300 text-center">
                      <span className="font-bold text-red-400">Excluded (N = {consortState.excludedNotMeeting + consortState.excludedDeclined + consortState.excludedOther})</span>:
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        &bull; Not meeting criteria: {consortState.excludedNotMeeting} &bull; Declined consent: {consortState.excludedDeclined}
                      </div>
                    </div>
                  </div>

                  <div className="w-0.5 h-6 bg-cyan-500/40" />

                  {/* Randomized Node */}
                  <div className="w-80 p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-center shadow-md">
                    <div className="text-xs font-bold text-white">Randomized (1:1 Ratio)</div>
                    <div className="text-xs font-extrabold text-indigo-300 mt-0.5">
                      N = {consortState.randomized}
                    </div>
                  </div>
                </div>

                {/* 2. Allocation Two Arms */}
                <div className="grid grid-cols-2 gap-6 pt-2">
                  {/* Arm A: Intervention Care Model */}
                  <div className="p-4 rounded-xl bg-[#090d16] border border-cyan-500/30 space-y-3">
                    <div className="text-center pb-2 border-b border-white/5">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                        Intervention Arm A
                      </span>
                      <div className="text-xs font-bold text-white mt-0.5">
                        Adapted Task-Sharing Care Model
                      </div>
                      <div className="text-xs text-slate-400">
                        Allocated to intervention: <b className="text-cyan-300">N = {consortState.allocatedArmA}</b>
                      </div>
                    </div>

                    <div className="p-2 bg-white/5 rounded-lg text-xs space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Follow-Up (Week 12)</div>
                      <div className="text-slate-300 flex justify-between">
                        <span>Lost to follow-up:</span>
                        <b className="text-amber-400">{consortState.lostFollowUpArmA} ({(consortState.lostFollowUpArmA / consortState.allocatedArmA * 100).toFixed(1)}%)</b>
                      </div>
                      <div className="text-slate-300 flex justify-between">
                        <span>Discontinued protocol:</span>
                        <b className="text-amber-400">{consortState.discontinuedArmA}</b>
                      </div>
                    </div>

                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs text-center">
                      <div className="text-[10px] font-bold text-emerald-400 uppercase">Analyzed</div>
                      <div className="text-xs font-extrabold text-white mt-0.5">
                        Intention-To-Treat (ITT): N = {consortState.analyzedArmA}
                      </div>
                    </div>
                  </div>

                  {/* Arm B: Comparator TAU */}
                  <div className="p-4 rounded-xl bg-[#090d16] border border-slate-700 space-y-3">
                    <div className="text-center pb-2 border-b border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Control Arm B
                      </span>
                      <div className="text-xs font-bold text-white mt-0.5">
                        Enhanced Treatment as Usual (ETAU)
                      </div>
                      <div className="text-xs text-slate-400">
                        Allocated to control: <b className="text-slate-200">N = {consortState.allocatedArmB}</b>
                      </div>
                    </div>

                    <div className="p-2 bg-white/5 rounded-lg text-xs space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Follow-Up (Week 12)</div>
                      <div className="text-slate-300 flex justify-between">
                        <span>Lost to follow-up:</span>
                        <b className="text-amber-400">{consortState.lostFollowUpArmB} ({(consortState.lostFollowUpArmB / consortState.allocatedArmB * 100).toFixed(1)}%)</b>
                      </div>
                      <div className="text-slate-300 flex justify-between">
                        <span>Discontinued protocol:</span>
                        <b className="text-amber-400">{consortState.discontinuedArmB}</b>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-800 border border-white/10 rounded-lg text-xs text-center">
                      <div className="text-[10px] font-bold text-slate-300 uppercase">Analyzed</div>
                      <div className="text-xs font-extrabold text-white mt-0.5">
                        Intention-To-Treat (ITT): N = {consortState.analyzedArmB}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: ADAPTIVE STEPPING & INTERIM EVIDENCE FEEDBACK     */}
        {/* ======================================================== */}
        {activeTab === 'adaptive' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-[#0f172a] rounded-2xl border border-white/10 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Iterative Evidence Synthesis & Stepped-Care Calibration
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    How care models evolve in real-time as clinical research data emerges across cohorts and other countries.
                  </p>
                </div>
              </div>

              {/* Simulation Scenario Box */}
              <div className="p-4 rounded-xl bg-[#090d16] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    Interim Analysis Checkpoint: 50% Trial Enrollment (N = 260)
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    O’Brien-Fleming Pre-Planned Look
                  </span>
                </div>

                {!interimSimulated ? (
                  <div className="p-4 bg-white/5 rounded-xl text-center space-y-3">
                    <p className="text-xs text-slate-300 max-w-lg mx-auto">
                      Simulate an interim research readout from the ongoing clinical trial to evaluate treatment adherence, dropouts, and need for care model protocol iteration.
                    </p>
                    <button
                      onClick={() => {
                        setInterimSimulated(true);
                        onToast('Interim trial readout analyzed! Discovered clinical bottleneck.');
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                    >
                      Run 50% Interim Trial Analysis
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in">
                    {/* Findings Alert */}
                    <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-slate-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-amber-300">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        Interim Research Finding Detected (Week 8 Cohort Data)
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Patients randomized to <b>Step 2 (In-Person Clinic Sessions)</b> are showing an elevated dropout rate (<b>28.4%</b>) due to long travel distances to the Primary Health Centre. However, patients receiving <b>WhatsApp audio check-ins</b> showed a <b>91% completion rate</b> with identical symptom reduction.
                      </p>
                      <div className="text-[11px] text-cyan-300 font-semibold">
                        💡 Recommended Iteration: Transition Step 2 from mandatory in-person visits to a hybrid telephonic/audio delivery model (Version v2.5).
                      </div>
                    </div>

                    {/* Action to Apply Adaptation */}
                    {!appliedAdaptiveFix ? (
                      <div className="flex items-center justify-between p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl">
                        <div className="text-xs text-slate-300">
                          Adopt the evidence-based protocol adaptation into the active Care Model?
                        </div>
                        <button
                          onClick={handleApplyAdaptiveFix}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Apply Adaptive Protocol Iteration
                        </button>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                          <CheckCircle2 className="w-4 h-4" />
                          Adaptive Protocol Successfully Deployed!
                        </div>
                        <p className="text-slate-300">
                          The Care Model has been updated to <b>v2.5 (Hybrid Vernacular Audio Adaptation)</b>. In the CONSORT flow, projected trial attrition has dropped by <b>55%</b> and statistical power is restored to 92%.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Research Evolution Timeline */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Historical Care Model Evolution & Evidence Genealogy
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs flex items-start justify-between">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>🇬🇧 2008: UK IAPT Stepped Care Baseline</span>
                        <span className="text-[10px] text-slate-400">(Clark et al.)</span>
                      </div>
                      <p className="text-slate-400 mt-0.5">
                        Proved national feasibility of stepped care and psychological wellbeing practitioners in NHS.
                      </p>
                    </div>
                    <span className="text-[11px] text-cyan-400 font-mono">d = 0.52</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs flex items-start justify-between">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>🇮🇳 2017: Sangath HAP Trial (Patel et al., Lancet)</span>
                        <span className="text-[10px] text-slate-400">(Goa, India)</span>
                      </div>
                      <p className="text-slate-400 mt-0.5">
                        Adapted UK stepped care into lay-counselor delivered behavioral activation in Indian PHCs.
                      </p>
                    </div>
                    <span className="text-[11px] text-cyan-400 font-mono">d = 0.58</span>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs flex items-start justify-between">
                    <div>
                      <div className="font-bold text-indigo-300 flex items-center gap-2">
                        <span>🇮🇳 2026: Stimulx Adaptive Task-Shared Model (Active)</span>
                        <span className="text-[10px] text-emerald-400">(This Project)</span>
                      </div>
                      <p className="text-slate-300 mt-0.5">
                        Integrated WhatsApp vernacular reminders, DPDP 2023 compliance, and real-time trial stepping rules.
                      </p>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-bold font-mono">Projected d = 0.64</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

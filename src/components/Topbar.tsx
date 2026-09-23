'use client';

import React, { useState } from 'react';
import { StageId, UserPersona } from '@/types';
import {
  Check,
  ChevronRight,
  BookmarkCheck,
  ArrowRight,
  FolderKanban,
  Plus,
  Share2,
  PlayCircle,
  Globe2,
  Users,
  Code2,
  BookOpen,
  FileCheck2,
  GraduationCap,
} from 'lucide-react';
import { useStimulxStore } from '@/lib/store';

interface TopbarProps {
  currentStage: StageId;
  completedStages: Set<StageId>;
  onNavigate: (stage: StageId) => void;
  onAdvance: () => void;
  onSave: () => void;
  onOpenRunner: () => void;
  onOpenScaleMarketplace: () => void;
  onOpenApiPlayground: () => void;
}

const STAGES: { id: StageId; label: string; num: string }[] = [
  { id: 'home', label: 'Home', num: '⌂' },
  { id: 'brainstorm', label: 'Brainstorm', num: '0' },
  { id: 'grants', label: 'Grants', num: '1' },
  { id: 'ethics', label: 'Ethics', num: '2' },
  { id: 'design', label: 'Design', num: '3' },
  { id: 'builder', label: 'Experiment Studio', num: '4' },
  { id: 'recruit', label: 'Recruit', num: '5' },
  { id: 'pool', label: 'Data Hub', num: '6' },
  { id: 'analysis', label: 'Analysis', num: '7' },
  { id: 'writing', label: 'Manuscript', num: '8' },
  { id: 'publish', label: 'Publish', num: '9' },
];

const PERSONA_CONFIG: Record<
  UserPersona,
  { label: string; icon: string; badgeColor: string; description: string }
> = {
  student: {
    label: 'Student',
    icon: '🎓',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Guided study templates, free open scales & mentor matching',
  },
  phd: {
    label: 'PhD Scholar',
    icon: '🔬',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    description: 'Pre-registration, multi-domain experiment builder, thesis data export',
  },
  postdoc: {
    label: 'Postdoc',
    icon: '📑',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description: 'Grant discovery, DST budgeters, co-author finders, peer review',
  },
  scientist: {
    label: 'Scientist / PI',
    icon: '🏛️',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Lab profiles, multi-site replication consortium, PSA India Node',
  },
};

export function Topbar({
  currentStage,
  completedStages,
  onNavigate,
  onAdvance,
  onSave,
  onOpenRunner,
  onOpenScaleMarketplace,
  onOpenApiPlayground,
}: TopbarProps) {
  const {
    projects,
    activeProject,
    activePersona,
    setActivePersona,
    setActiveProject,
    createProject,
  } = useStimulxStore();

  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newStudyName, setNewStudyName] = useState('');
  const [newStudyHypothesis, setNewStudyHypothesis] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudyName.trim()) return;
    createProject(newStudyName, newStudyHypothesis || 'Hypothesis under formulation.');
    setShowNewModal(false);
    setNewStudyName('');
    setNewStudyHypothesis('');
  };

  const handleCopyLink = () => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/?run=${activeProject.id}`
        : `https://stimulx.in/?run=${activeProject.id}`;
    navigator.clipboard?.writeText(url);
    onSave();
  };

  return (
    <header className="h-[52px] shrink-0 bg-[#1a1633] flex items-center px-3.5 border-b border-white/10 z-50 select-none">
      {/* Brand & Project Switcher */}
      <div className="flex items-center gap-2 pr-3 border-r border-white/10 mr-2 shrink-0">
        <div
          className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onNavigate('home')}
        >
          <div className="w-[26px] h-[26px] bg-[#e8852b] rounded-lg flex items-center justify-center p-1.5 shadow-sm">
            <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
              <circle cx="7" cy="7" r="2.5" fill="#fff" />
              <circle cx="7" cy="2" r="1.2" fill="rgba(255,255,255,.6)" />
              <circle cx="7" cy="12" r="1.2" fill="rgba(255,255,255,.6)" />
              <circle cx="2" cy="7" r="1.2" fill="rgba(255,255,255,.6)" />
              <circle cx="12" cy="7" r="1.2" fill="rgba(255,255,255,.6)" />
            </svg>
          </div>
          <span className="text-[14px] font-bold text-white tracking-tight">Stimulx</span>
          <span className="text-[11px] text-[#f9a94e] font-mono font-bold">.in</span>
        </div>

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProjectMenu(!showProjectMenu)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white/90 text-[11px] px-2.5 py-1 rounded-lg border border-white/15 transition-all max-w-[150px]"
            title="Switch or create research study"
          >
            <FolderKanban className="w-3 h-3 text-[#e8852b] shrink-0" />
            <span className="truncate font-medium">{activeProject?.name || 'Default Study'}</span>
          </button>

          {showProjectMenu && (
            <div className="absolute left-0 top-9 w-64 bg-[#1b1738] border border-white/15 rounded-xl shadow-2xl p-2 z-50 text-xs">
              <div className="text-[10px] uppercase font-bold text-white/40 px-2 py-1">
                Your Studies ({projects.length})
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProject(p.id);
                      setShowProjectMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg truncate transition-colors flex items-center justify-between ${
                      p.id === activeProject.id
                        ? 'bg-[#e8852b] text-white font-bold'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">N={p.sessions?.length || 0}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-white/10 mt-2 pt-2">
                <button
                  onClick={() => {
                    setShowProjectMenu(false);
                    setShowNewModal(true);
                  }}
                  className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[#4ade80] hover:bg-white/10 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Create New Study</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4-Tier Persona Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
              PERSONA_CONFIG[activePersona].badgeColor
            }`}
            title="Switch academic career level profile"
          >
            <span>{PERSONA_CONFIG[activePersona].icon}</span>
            <span>{PERSONA_CONFIG[activePersona].label}</span>
          </button>

          {showPersonaMenu && (
            <div className="absolute left-0 top-9 w-60 bg-[#1b1738] border border-white/15 rounded-xl shadow-2xl p-2 z-50 text-xs">
              <div className="text-[10px] uppercase font-bold text-white/40 px-2 py-1">
                Select Academic Persona
              </div>
              <div className="space-y-1">
                {(Object.keys(PERSONA_CONFIG) as UserPersona[]).map((pKey) => {
                  const pConf = PERSONA_CONFIG[pKey];
                  const isSelected = activePersona === pKey;
                  return (
                    <button
                      key={pKey}
                      onClick={() => {
                        setActivePersona(pKey);
                        setShowPersonaMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2 ${
                        isSelected ? 'bg-white/15 text-white font-bold' : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-base">{pConf.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-white">{pConf.label}</div>
                        <div className="text-[10px] text-white/60 leading-tight">{pConf.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Study Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#1b1738] border border-white/20 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-base font-bold">Create New Behavioural Research Study</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Study Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cognitive Fatigue in Healthcare Workers"
                  value={newStudyName}
                  onChange={(e) => setNewStudyName(e.target.value)}
                  className="w-full bg-[#120e29] border border-white/20 rounded-lg p-2.5 text-white outline-none focus:border-[#e8852b]"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Core Hypothesis</label>
                <textarea
                  rows={3}
                  placeholder="State the primary experimental hypothesis..."
                  value={newStudyHypothesis}
                  onChange={(e) => setNewStudyHypothesis(e.target.value)}
                  className="w-full bg-[#120e29] border border-white/20 rounded-lg p-2.5 text-white outline-none focus:border-[#e8852b]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-white/20 text-white/70 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#e8852b] hover:bg-[#d0731f] text-white font-semibold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Breadcrumb Steps */}
      <nav className="flex items-center gap-1 flex-1 overflow-x-auto py-1 px-2 no-scrollbar">
        {STAGES.map((s, idx) => {
          const isActive = currentStage === s.id;
          const isDone = completedStages.has(s.id);

          return (
            <React.Fragment key={s.id}>
              {idx > 0 && <ChevronRight className="w-3 h-3 text-white/20 shrink-0" />}
              <button
                type="button"
                onClick={() => onNavigate(s.id)}
                className={`flex items-center gap-1.5 h-[32px] px-2 rounded-md text-[11px] font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 transition-colors ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isActive
                      ? 'bg-[#e8852b] text-white'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {isDone ? <Check className="w-2.5 h-2.5" /> : s.num}
                </div>
                <span>{s.label}</span>
              </button>
            </React.Fragment>
          );
        })}

        {/* Operating System Specialized Hubs */}
        <div className="flex items-center gap-1 ml-2 pl-2 border-l border-white/10">
          <button
            type="button"
            onClick={() => onNavigate('replication')}
            className={`flex items-center gap-1 h-[30px] px-2.5 rounded-md text-[11px] font-semibold border transition-all shrink-0 ${
              currentStage === 'replication'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
            }`}
            title="PSA India Node: Solve WEIRD Bias with Cross-Cultural Replication"
          >
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>PSA Replication</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('recruitment_board')}
            className={`flex items-center gap-1 h-[30px] px-2.5 rounded-md text-[11px] font-semibold border transition-all shrink-0 ${
              currentStage === 'recruitment_board'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
            }`}
            title="National Participant Recruitment Board (28 States)"
          >
            <Users className="w-3.5 h-3.5 text-[#e8852b]" />
            <span>Recruit Board</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('prereg')}
            className={`flex items-center gap-1 h-[30px] px-2.5 rounded-md text-[11px] font-semibold border transition-all shrink-0 ${
              currentStage === 'prereg'
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                : 'border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
            }`}
            title="AsPredicted / OSF Pre-Registration Studio"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Pre-Reg</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('community')}
            className={`flex items-center gap-1 h-[30px] px-2.5 rounded-md text-[11px] font-semibold border transition-all shrink-0 ${
              currentStage === 'community'
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-200'
                : 'border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="text-purple-400 font-bold">✦</span>
            <span>CollabRadar</span>
          </button>
        </div>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 ml-2">
        <button
          type="button"
          onClick={onOpenScaleMarketplace}
          className="h-[30px] px-2.5 rounded-md border border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 text-[11px] font-medium flex items-center gap-1 transition-colors"
          title="Open Instruments & Psychometrics Marketplace"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#e8852b]" />
          <span className="hidden xl:inline">Scales</span>
        </button>

        <button
          type="button"
          onClick={onOpenApiPlayground}
          className="h-[30px] px-2.5 rounded-md border border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 text-[11px] font-medium flex items-center gap-1 transition-colors"
          title="REST API & Data Pipeline"
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xl:inline">API</span>
        </button>

        <button
          type="button"
          onClick={onOpenRunner}
          className="h-[30px] px-2.5 rounded-md bg-[#4ade80]/15 border border-[#4ade80]/30 hover:bg-[#4ade80]/25 text-[#4ade80] text-[11px] font-semibold flex items-center gap-1 transition-colors"
          title="Run participant study test session"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Participant View</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="h-[30px] px-2.5 rounded-md border border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 text-[11px] font-medium flex items-center gap-1 transition-colors"
          title="Copy shareable participant URL"
        >
          <Share2 className="w-3.5 h-3.5 text-[#e8852b]" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          className="h-[30px] px-2.5 rounded-md border border-white/15 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 text-[11px] font-medium flex items-center gap-1 transition-colors"
        >
          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Saved</span>
        </button>

        <button
          type="button"
          onClick={onAdvance}
          className="h-[30px] px-3 rounded-md bg-[#e8852b] hover:bg-[#d0731f] text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm transition-colors"
        >
          <span>Next</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </header>
  );
}

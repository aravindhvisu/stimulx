'use client';

import React, { useState } from 'react';
import { StageId, UserPersona } from '@/types';
import {
  Check,
  ChevronRight,
  FolderKanban,
  Plus,
  Share2,
  PlayCircle,
  Globe2,
  Users,
  BookOpen,
  FileCheck2,
  GraduationCap,
  LogOut,
  User,
  ArrowRight,
  Sparkles,
  Stethoscope,
  Brain,
  ShieldCheck,
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

const STUDY_STAGES: { id: StageId; label: string; num: string }[] = [
  { id: 'brainstorm', label: 'Brainstorm', num: '0' },
  { id: 'grants', label: 'Grants', num: '1' },
  { id: 'ethics', label: 'Ethics', num: '2' },
  { id: 'design', label: 'Design', num: '3' },
  { id: 'care_rct', label: 'Care & RCT', num: '🔬' },
  { id: 'builder', label: 'Task Studio', num: '4' },
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
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Guided study templates, free open scales & mentor matching',
  },
  phd: {
    label: 'PhD Scholar',
    icon: '🔬',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    description: 'Pre-registration, multi-domain experiment builder, thesis data export',
  },
  postdoc: {
    label: 'Postdoc',
    icon: '📑',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    description: 'Grant discovery, DST budgeters, co-author finders, peer review',
  },
  scientist: {
    label: 'Scientist / PI',
    icon: '🏛️',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
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
    currentUser,
    logout,
    setActivePersona,
    setActiveProject,
    createProject,
  } = useStimulxStore();

  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  const isStudyWorkflowStage = currentStage !== 'home';

  return (
    <div className="flex flex-col shrink-0 z-40 select-none">
      {/* ============================================================ */}
      {/* 1. PRIMARY EXECUTIVE NAVIGATION BAR (56px)                   */}
      {/* Following StimulX Draft Brand Guidelines:                     */}
      {/* Wordmark only (Stimul in white, X in #D7263D, Poppins font)  */}
      {/* Surface: #12111A (Ink)                                        */}
      {/* ============================================================ */}
      <header className="h-14 bg-[#12111A] border-b border-[#E4E4E9]/10 px-5 flex items-center justify-between text-white font-sans">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-4 shrink-0">
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer flex items-baseline gap-0.5 hover:opacity-95 transition-opacity"
            title="StimulX — Behavioural Research Infrastructure for India"
          >
            <span className="font-poppins font-bold text-xl tracking-tight text-white">
              Stimul<span className="text-[#D7263D]">X</span>
            </span>
          </div>

          <div className="w-[1px] h-4 bg-white/10 hidden sm:block" />

          <span className="text-[11px] text-[#8B8A99] font-medium tracking-wide uppercase hidden md:inline">
            Research Infrastructure
          </span>
        </div>

        {/* Center: The 4 Primary Visitor Pillars (Clean, Spacious, Uncluttered) */}
        <nav className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentStage === 'home'
                ? 'bg-white/10 text-white font-semibold shadow-sm'
                : 'text-[#8B8A99] hover:text-white hover:bg-white/5'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => onNavigate('builder')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentStage === 'builder' || currentStage === 'design'
                ? 'bg-white/10 text-white font-semibold shadow-sm'
                : 'text-[#8B8A99] hover:text-white hover:bg-white/5'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            <span>Study Studio</span>
          </button>

          <button
            onClick={() => onNavigate('care_rct')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentStage === 'care_rct'
                ? 'bg-white/10 text-white font-semibold shadow-sm'
                : 'text-[#8B8A99] hover:text-white hover:bg-white/5'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-[#D7263D]" />
            <span>Models of Care & RCT</span>
          </button>

          <button
            onClick={() => onNavigate('ethics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentStage === 'ethics' || currentStage === 'grants'
                ? 'bg-white/10 text-white font-semibold shadow-sm'
                : 'text-[#8B8A99] hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ethics & Grants</span>
          </button>
        </nav>

        {/* Right: Actions, Persona, and Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Active Study Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowProjectMenu(!showProjectMenu)}
              className="flex items-center gap-1.5 bg-[#1E1D29] hover:bg-white/10 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-white/10 transition-all max-w-[140px]"
              title="Active Research Study"
            >
              <FolderKanban className="w-3.5 h-3.5 text-[#D7263D] shrink-0" />
              <span className="truncate font-medium">{activeProject?.name || 'Default Study'}</span>
            </button>

            {showProjectMenu && (
              <div className="absolute right-0 top-9 w-64 bg-[#1E1D29] border border-white/15 rounded-xl shadow-2xl p-2 z-50 text-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                  Active Studies ({projects.length})
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
                          ? 'bg-[#D7263D] text-white font-bold'
                          : 'text-slate-300 hover:bg-white/10'
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
                    className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-emerald-400 hover:bg-white/10 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Study</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Participant Runner Trigger */}
          <button
            onClick={onOpenRunner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all"
            title="Launch live participant experiment execution"
          >
            <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Participant View</span>
          </button>

          {/* Academic Persona Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                PERSONA_CONFIG[activePersona].badgeColor
              }`}
              title="Current Academic Persona"
            >
              <span>{PERSONA_CONFIG[activePersona].icon}</span>
              <span className="hidden md:inline">{PERSONA_CONFIG[activePersona].label}</span>
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 top-9 w-60 bg-[#1E1D29] border border-white/15 rounded-xl shadow-2xl p-2 z-50 text-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                  Switch Persona
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
                          isSelected ? 'bg-white/15 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-base">{pConf.icon}</span>
                        <div>
                          <div className="text-xs font-semibold text-white">{pConf.label}</div>
                          <div className="text-[10px] text-slate-400 leading-tight">{pConf.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-full bg-slate-800 border border-white/15 flex items-center justify-center text-xs font-bold text-white hover:border-[#D7263D] transition-colors"
              title={currentUser?.email || 'User Account'}
            >
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-10 w-64 bg-[#1E1D29] border border-white/15 rounded-xl shadow-2xl p-3 z-50 text-xs text-white">
                <div className="font-bold text-sm truncate">{currentUser?.name || 'Researcher'}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{currentUser?.email || 'researcher@stimulx.in'}</div>
                <div className="text-[10px] text-emerald-400 mt-1">DPDP 2023 &bull; Verified Research Node</div>

                <div className="border-t border-white/10 mt-3 pt-2">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. SECONDARY STUDY WORKFLOW SUB-BAR (40px)                   */}
      {/* Breathable, spacious breadcrumb flow ONLY shown in study view */}
      {/* Surface: #1E1D29 (Ink 2)                                      */}
      {/* ============================================================ */}
      {isStudyWorkflowStage && (
        <div className="h-10 bg-[#1E1D29] border-b border-[#E4E4E9]/10 px-5 flex items-center justify-between overflow-x-auto no-scrollbar text-xs">
          {/* Breadcrumb Steps */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
              Study Protocol:
            </span>
            {STUDY_STAGES.map((s, idx) => {
              const isActive = currentStage === s.id;
              const isDone = completedStages.has(s.id);

              return (
                <React.Fragment key={s.id}>
                  {idx > 0 && <span className="text-white/20 mx-1 shrink-0">&rsaquo;</span>}
                  <button
                    type="button"
                    onClick={() => onNavigate(s.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 ${
                      isActive
                        ? 'bg-white/15 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isActive
                          ? 'bg-[#D7263D] text-white'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {isDone ? <Check className="w-2 h-2" /> : s.num}
                    </span>
                    <span>{s.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* Right Sub-Bar Controls: Advance Next Stage */}
          <div className="flex items-center gap-2 pl-4 shrink-0">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-medium transition-colors"
              title="Copy anonymous participant link"
            >
              <Share2 className="w-3 h-3" />
              <span>Share</span>
            </button>

            <button
              onClick={onAdvance}
              className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#D7263D] hover:bg-[#A81C2E] text-white text-[11px] font-bold transition-all shadow-sm"
              title="Advance to next research stage"
            >
              <span>Next</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Modal: Create New Study */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E1D29] border border-white/20 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-[#D7263D]" />
              Create New Research Study
            </h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Study Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bilingual Cognitive Flexibility in Indian Youth"
                  value={newStudyName}
                  onChange={(e) => setNewStudyName(e.target.value)}
                  className="w-full bg-[#12111A] border border-white/20 rounded-lg p-2.5 text-white outline-none focus:border-[#D7263D]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Hypothesis</label>
                <textarea
                  rows={3}
                  placeholder="State the core experimental hypothesis or research question..."
                  value={newStudyHypothesis}
                  onChange={(e) => setNewStudyHypothesis(e.target.value)}
                  className="w-full bg-[#12111A] border border-white/20 rounded-lg p-2.5 text-white outline-none focus:border-[#D7263D]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-white/20 text-slate-400 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#D7263D] hover:bg-[#A81C2E] text-white font-bold"
                >
                  Create Study
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

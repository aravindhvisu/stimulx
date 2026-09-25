'use client';

import React, { useState } from 'react';
import { StageId, UserPersona } from '@/types';
import {
  FolderKanban,
  Plus,
  PlayCircle,
  Brain,
  Stethoscope,
  ShieldCheck,
  LogOut,
  ChevronDown,
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

const PERSONA_CONFIG: Record<
  UserPersona,
  { label: string; icon: string; badgeColor: string; description: string }
> = {
  student: {
    label: 'Student',
    icon: '🎓',
    badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
    description: 'Guided study templates, free open scales & mentor matching',
  },
  phd: {
    label: 'PhD Scholar',
    icon: '🔬',
    badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
    description: 'Pre-registration, multi-domain experiment builder, thesis data export',
  },
  postdoc: {
    label: 'Postdoc',
    icon: '📑',
    badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
    description: 'Grant discovery, DST budgeters, co-author finders, peer review',
  },
  scientist: {
    label: 'Scientist / PI',
    icon: '🏛️',
    badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
    description: 'Lab profiles, multi-site replication consortium, PSA India Node',
  },
};

export function Topbar({
  currentStage,
  onNavigate,
  onOpenRunner,
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

  return (
    <div className="flex flex-col shrink-0 z-40 select-none">
      {/* ============================================================ */}
      {/* SINGLE SLIM TOPBAR (56px) — PLAIN WHITE WITH PURPLE ACCENT   */}
      {/* NO STACKED ROWS. CLEAN, SPACIOUS, UNCLUTTERED.               */}
      {/* ============================================================ */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between text-slate-800 font-sans shadow-sm">
        {/* Left: Pure Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer flex items-baseline gap-0.5 hover:opacity-90 transition-opacity"
            title="StimulX — Behavioural Research Infrastructure"
          >
            <span className="font-poppins font-bold text-xl tracking-tight text-slate-900">
              Stimul<span className="text-[#7C3AED]">X</span>
            </span>
          </div>

          <div className="w-[1px] h-4 bg-slate-200 hidden sm:block" />

          <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase hidden md:inline font-sans">
            Research Infrastructure
          </span>
        </div>

        {/* Center: Clean 4 Navigation Pillars (Spacious, Minimalist) */}
        <nav className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentStage === 'home'
                ? 'bg-purple-50 text-purple-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => onNavigate('builder')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentStage === 'builder' || currentStage === 'design' || currentStage === 'pool'
                ? 'bg-purple-50 text-purple-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-purple-600" />
            <span>Experiment Studio</span>
          </button>

          <button
            onClick={() => onNavigate('care_rct')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentStage === 'care_rct'
                ? 'bg-purple-50 text-purple-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
            <span>Models of Care & RCT</span>
          </button>

          <button
            onClick={() => onNavigate('ethics')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentStage === 'ethics' || currentStage === 'grants'
                ? 'bg-purple-50 text-purple-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Ethics & Grants</span>
          </button>
        </nav>

        {/* Right: Actions, Persona, and Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Active Study Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowProjectMenu(!showProjectMenu)}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all max-w-[150px]"
              title="Switch Research Study"
            >
              <FolderKanban className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="truncate font-medium">{activeProject?.name || 'Default Study'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showProjectMenu && (
              <div className="absolute right-0 top-9 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-xs">
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
                          ? 'bg-purple-50 text-purple-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">N={p.sessions?.length || 0}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 mt-2 pt-2">
                  <button
                    onClick={() => {
                      setShowProjectMenu(false);
                      setShowNewModal(true);
                    }}
                    className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-purple-700 hover:bg-purple-50 font-semibold"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 text-purple-700 bg-purple-50/70 hover:bg-purple-100 text-xs font-semibold transition-all shadow-sm"
            title="Launch participant trial execution preview"
          >
            <PlayCircle className="w-3.5 h-3.5 text-purple-600" />
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
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 top-9 w-60 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-xs">
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
                          isSelected ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-base">{pConf.icon}</span>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{pConf.label}</div>
                          <div className="text-[10px] text-slate-500 leading-tight">{pConf.description}</div>
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
              className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-xs font-bold text-purple-700 hover:bg-purple-200 transition-colors"
              title={currentUser?.email || 'User Account'}
            >
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-10 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs text-slate-800">
                <div className="font-bold text-sm truncate text-slate-900">{currentUser?.name || 'Researcher'}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{currentUser?.email || 'researcher@stimulx.in'}</div>
                <div className="text-[10px] text-purple-700 font-semibold mt-1">DPDP 2023 &bull; Verified Research Node</div>

                <div className="border-t border-slate-100 mt-3 pt-2">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Modal: Create New Study */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-900">
              <FolderKanban className="w-5 h-5 text-purple-600" />
              Create New Research Study
            </h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Study Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bilingual Cognitive Flexibility in Indian Youth"
                  value={newStudyName}
                  onChange={(e) => setNewStudyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Primary Hypothesis</label>
                <textarea
                  rows={3}
                  placeholder="State the core experimental hypothesis or research question..."
                  value={newStudyHypothesis}
                  onChange={(e) => setNewStudyHypothesis(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold"
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

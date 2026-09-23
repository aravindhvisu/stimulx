'use client';

import React, { useState } from 'react';
import { StageId } from '@/types';
import { Check, ChevronRight, BookmarkCheck, ArrowRight, FolderKanban, Plus, Share2, PlayCircle } from 'lucide-react';
import { useStimulxStore } from '@/lib/store';

interface TopbarProps {
  currentStage: StageId;
  completedStages: Set<StageId>;
  onNavigate: (stage: StageId) => void;
  onAdvance: () => void;
  onSave: () => void;
  onOpenRunner: () => void;
}

const STAGES: { id: StageId; label: string; num: string }[] = [
  { id: 'home', label: 'Home', num: '⌂' },
  { id: 'brainstorm', label: 'Brainstorm', num: '0' },
  { id: 'grants', label: 'Grants', num: '1' },
  { id: 'ethics', label: 'Ethics', num: '2' },
  { id: 'design', label: 'Design', num: '3' },
  { id: 'recruit', label: 'Recruit', num: '4' },
  { id: 'builder', label: 'Experiment', num: '5' },
  { id: 'pool', label: 'Pool', num: '6' },
  { id: 'analysis', label: 'Analysis', num: '7' },
  { id: 'writing', label: 'Manuscript', num: '8' },
  { id: 'publish', label: 'Publish', num: '9' },
];

export function Topbar({
  currentStage,
  completedStages,
  onNavigate,
  onAdvance,
  onSave,
  onOpenRunner,
}: TopbarProps) {
  const { projects, activeProject, setActiveProject, createProject } = useStimulxStore();
  const [showProjectMenu, setShowProjectMenu] = useState(false);
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
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/?run=${activeProject.id}`
      : `https://stimulx.in/?run=${activeProject.id}`;
    navigator.clipboard?.writeText(url);
    onSave(); // Trigger toast
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
        <div className="relative ml-2">
          <button
            onClick={() => setShowProjectMenu(!showProjectMenu)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white/90 text-[11px] px-2.5 py-1 rounded-lg border border-white/15 transition-all max-w-[170px]"
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

        {/* Community Tab */}
        <button
          type="button"
          onClick={() => onNavigate('community')}
          className={`flex items-center gap-1.5 h-[32px] px-2.5 ml-1 rounded-md text-[11px] font-medium border transition-all shrink-0 ${
            currentStage === 'community'
              ? 'bg-purple-500/20 border-purple-500/40 text-purple-200 font-semibold'
              : 'border-white/10 text-white/50 hover:bg-white/5 hover:text-white/80'
          }`}
        >
          <span className="text-purple-400 font-bold">✦</span>
          <span>CollabRadar</span>
        </button>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {/* Participant Link Quick Trigger */}
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
          <span className="hidden sm:inline">Share Link</span>
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

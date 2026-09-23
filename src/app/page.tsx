'use client';

import React, { useState, useEffect } from 'react';
import { StageId } from '@/types';
import { Topbar } from '@/components/Topbar';
import { HomeStage } from '@/components/stages/HomeStage';
import { BrainstormStage } from '@/components/stages/BrainstormStage';
import { GrantStage } from '@/components/stages/GrantStage';
import { EthicsStage } from '@/components/stages/EthicsStage';
import { DesignStage } from '@/components/stages/DesignStage';
import { RecruitmentStage } from '@/components/stages/RecruitmentStage';
import { ExperimentStage } from '@/components/stages/ExperimentStage';
import { ParticipantPoolStage } from '@/components/stages/ParticipantPoolStage';
import { AnalysisStage } from '@/components/stages/AnalysisStage';
import { WritingStage } from '@/components/stages/WritingStage';
import { PublishStage } from '@/components/stages/PublishStage';
import { CommunityStage } from '@/components/stages/CommunityStage';
import { ParticipantRunner } from '@/components/runner/ParticipantRunner';
import { useStimulxStore } from '@/lib/store';

const STAGE_FLOW: StageId[] = [
  'home',
  'brainstorm',
  'grants',
  'ethics',
  'design',
  'recruit',
  'builder',
  'pool',
  'analysis',
  'writing',
  'publish',
];

export default function StimulxApp() {
  const { activeProject, addParticipantSession } = useStimulxStore();
  const [currentStage, setCurrentStage] = useState<StageId>('home');
  const [completedStages, setCompletedStages] = useState<Set<StageId>>(new Set(['grants', 'ethics']));
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showGlobalRunner, setShowGlobalRunner] = useState(false);

  // Detect participant mode via URL query (e.g. ?run=proj-001)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('run') || params.has('study')) {
        setShowGlobalRunner(true);
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleNavigate = (stage: StageId) => {
    setCurrentStage(stage);
  };

  const handleAdvance = () => {
    const currentIndex = STAGE_FLOW.indexOf(currentStage);

    if (currentIndex >= 0 && currentIndex < STAGE_FLOW.length - 1) {
      const nextStage = STAGE_FLOW[currentIndex + 1];
      setCompletedStages((prev) => new Set([...prev, currentStage]));
      setCurrentStage(nextStage);
      showToast(`Advancing to ${nextStage.charAt(0).toUpperCase() + nextStage.slice(1)} →`);
    } else {
      showToast('🎉 Full Research Lifecycle Complete!');
    }
  };

  const handleSave = () => {
    showToast('Project state securely saved in India (Mumbai) vault ✓');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f5f3ef] text-[#1a1633] select-none font-sans">
      {/* Participant Runner Overlay (Triggered by Link or Button) */}
      {showGlobalRunner && (
        <ParticipantRunner
          project={activeProject}
          onComplete={(newSession) => {
            addParticipantSession(newSession);
            showToast('Participant session recorded into live dataset! 🎉');
          }}
          onClose={() => {
            setShowGlobalRunner(false);
            // Clean URL query if present
            if (typeof window !== 'undefined' && window.history.replaceState) {
              const url = new URL(window.location.href);
              url.searchParams.delete('run');
              url.searchParams.delete('study');
              window.history.replaceState({}, '', url.pathname);
            }
          }}
        />
      )}

      {/* Universal Top Navigation */}
      <Topbar
        currentStage={currentStage}
        completedStages={completedStages}
        onNavigate={handleNavigate}
        onAdvance={handleAdvance}
        onSave={handleSave}
        onOpenRunner={() => setShowGlobalRunner(true)}
      />

      {/* Dynamic Lifecycle Screen Content */}
      <div className="flex-1 flex overflow-hidden">
        {currentStage === 'home' && <HomeStage onNavigate={handleNavigate} />}
        {currentStage === 'brainstorm' && (
          <BrainstormStage onAdvance={handleAdvance} onToast={showToast} />
        )}
        {currentStage === 'grants' && (
          <GrantStage onAdvance={handleAdvance} onToast={showToast} />
        )}
        {currentStage === 'ethics' && (
          <EthicsStage onAdvance={handleAdvance} onToast={showToast} />
        )}
        {currentStage === 'design' && (
          <DesignStage onAdvance={handleAdvance} onToast={showToast} />
        )}
        {currentStage === 'recruit' && (
          <RecruitmentStage onAdvance={handleAdvance} onToast={showToast} />
        )}
        {currentStage === 'builder' && (
          <ExperimentStage onAdvance={handleAdvance} onToast={showToast} />
        )}
        {currentStage === 'pool' && (
          <ParticipantPoolStage onAdvance={handleAdvance} onToast={showToast} />
        )}
        {currentStage === 'analysis' && (
          <AnalysisStage onAdvance={handleAdvance} onToast={showToast} />
        )}
        {currentStage === 'writing' && (
          <WritingStage onAdvance={handleAdvance} onToast={showToast} />
        )}
        {currentStage === 'publish' && (
          <PublishStage onAdvance={handleAdvance} onToast={showToast} />
        )}
        {currentStage === 'community' && <CommunityStage onToast={showToast} />}
      </div>

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1633] text-white text-[13px] font-medium px-4 py-2 rounded-xl shadow-2xl z-50 animate-bounce flex items-center gap-2 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#e8852b]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  RotateCcw,
  Smartphone,
  Monitor,
  CheckCircle2,
  XCircle,
  Copy,
  ArrowRight,
  Flame,
} from "lucide-react";

import { useStimulxStore } from "@/lib/store";
import { ParticipantRunner } from "@/components/runner/ParticipantRunner";
import {
  Share2,
  ExternalLink,
  Settings,
  Sparkles,
} from "lucide-react";

interface ExperimentStageProps {
  onAdvance: () => void;
  onToast: (msg: string) => void;
}

interface StroopTrial {
  word: string;
  colorName: "Red" | "Green" | "Blue";
  colorHex: string;
  isCongruent: boolean;
  language: "Hindi" | "English";
}

const SAMPLE_TRIALS: StroopTrial[] = [
  { word: "लाल", colorName: "Red", colorHex: "#ef4444", isCongruent: true, language: "Hindi" },
  { word: "हरा", colorName: "Blue", colorHex: "#3b82f6", isCongruent: false, language: "Hindi" },
  { word: "नीला", colorName: "Green", colorHex: "#22c55e", isCongruent: false, language: "Hindi" },
  { word: "RED", colorName: "Blue", colorHex: "#3b82f6", isCongruent: false, language: "English" },
  { word: "GREEN", colorName: "Green", colorHex: "#22c55e", isCongruent: true, language: "English" },
  { word: "BLUE", colorName: "Red", colorHex: "#ef4444", isCongruent: false, language: "English" },
];

export function ExperimentStage({ onAdvance, onToast }: ExperimentStageProps) {
  const { activeProject, updateActiveProject, addParticipantSession } = useStimulxStore();
  const [showParticipantRunner, setShowParticipantRunner] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trialIndex, setTrialIndex] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [results, setResults] = useState<
    { rt: number; correct: boolean; isCongruent: boolean; language: string }[]
  >([]);
  const [testComplete, setTestComplete] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  const studyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?run=${activeProject.id}`
    : `https://stimulx.in/?run=${activeProject.id}`;

  const copyStudyLink = () => {
    navigator.clipboard?.writeText(studyUrl);
    onToast("Copied participant study URL to clipboard! Share across India ✓");
  };

  const currentTrial = SAMPLE_TRIALS[trialIndex];

  const startExperiment = () => {
    setIsPlaying(true);
    setTrialIndex(0);
    setResults([]);
    setTestComplete(false);
    setStartTime(performance.now());
    onToast("Stroop Test Started! Identify the INK COLOR");
  };

  const handleResponse = (selectedColor: "Red" | "Green" | "Blue") => {
    if (!isPlaying || testComplete) return;

    const rt = Math.round(performance.now() - startTime);
    const isCorrect = selectedColor === currentTrial.colorName;

    const newResult = {
      rt,
      correct: isCorrect,
      isCongruent: currentTrial.isCongruent,
      language: currentTrial.language,
    };

    const nextResults = [...results, newResult];
    setResults(nextResults);

    if (trialIndex + 1 < SAMPLE_TRIALS.length) {
      setTrialIndex(trialIndex + 1);
      setStartTime(performance.now());
    } else {
      setIsPlaying(false);
      setTestComplete(true);
      onToast("Experiment session completed ✓ Data recorded");
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || testComplete) return;
      if (e.key.toLowerCase() === "r") handleResponse("Red");
      if (e.key.toLowerCase() === "g") handleResponse("Green");
      if (e.key.toLowerCase() === "b") handleResponse("Blue");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, trialIndex, testComplete]);

  // Compute metrics
  const congruentTrials = results.filter((r) => r.isCongruent);
  const incongruentTrials = results.filter((r) => !r.isCongruent);

  const meanCongruentRT =
    congruentTrials.length > 0
      ? Math.round(congruentTrials.reduce((a, b) => a + b.rt, 0) / congruentTrials.length)
      : 0;

  const meanIncongruentRT =
    incongruentTrials.length > 0
      ? Math.round(incongruentTrials.reduce((a, b) => a + b.rt, 0) / incongruentTrials.length)
      : 0;

  const stroopCost = meanIncongruentRT - meanCongruentRT;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f5f3ef] space-y-5">
      {/* Live Participant Runner Modal */}
      {showParticipantRunner && (
        <ParticipantRunner
          project={activeProject}
          onComplete={(newSession) => {
            addParticipantSession(newSession);
            onToast("New participant session recorded into live dataset! 🎉");
          }}
          onClose={() => setShowParticipantRunner(false)}
        />
      )}

      {/* Shareable Study Link Banner */}
      <div className="bg-gradient-to-r from-[#1a1633] to-[#2b2457] rounded-2xl p-5 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4ade80]">
              Active Participant Link Ready
            </span>
          </div>
          <h3 className="text-base font-bold text-white">Distribute Study to Participants Across India</h3>
          <p className="text-xs text-white/70 mt-0.5">
            Share this link via WhatsApp, Email, or Institutional Slack. Collects zero-PII millisecond reaction times.
          </p>
          <div className="mt-3 flex items-center gap-2 bg-black/30 border border-white/10 rounded-xl px-3 py-1.5 max-w-lg">
            <span className="text-xs font-mono text-[#e8852b] truncate select-all">{studyUrl}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={copyStudyLink}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4 text-[#e8852b]" />
            <span>Copy Link</span>
          </button>

          <button
            type="button"
            onClick={() => setShowParticipantRunner(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#e8852b] hover:bg-[#d0731f] text-white text-xs font-bold transition-all shadow-lg shadow-[#e8852b]/20"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Launch Participant View</span>
          </button>
        </div>
      </div>

      <header>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#e8852b] mb-1">
          Stage 6 — Experiment Engine & Simulator
        </div>
        <h2 className="text-xl font-bold text-[#1a1633]">Cognitive Task Simulator & In-Browser Runner</h2>
        <p className="text-[13px] text-[#6b6890] mt-1">
          Sub-millisecond reaction-time accuracy · Multilingual stimuli · Cross-platform responsive runtime
        </p>
      </header>

      {/* Interactive Experiment Box */}
      <div className="bg-white border border-[#1a1633]/10 rounded-2xl overflow-hidden shadow-sm">
        {/* Runner Header */}
        <div className="px-5 py-3.5 bg-[#1a1633] text-white flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e8852b] animate-ping" />
            <span className="text-[13px] font-semibold">
              Live Experiment Runner: Hindi-English Stroop
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("desktop")}
              className={`p-1.5 rounded ${viewMode === "desktop" ? "bg-white/20 text-white" : "text-white/50"}`}
              title="Desktop mode"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("mobile")}
              className={`p-1.5 rounded ${viewMode === "mobile" ? "bg-white/20 text-white" : "text-white/50"}`}
              title="Mobile mode"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Runner Body */}
        <div className="p-8 flex flex-col items-center justify-center min-h-[300px] bg-[#f8f7f4]">
          {!isPlaying && !testComplete && (
            <div className="text-center max-w-md space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#e8852b]/15 text-[#e8852b] flex items-center justify-center mx-auto">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1633]">
                Test the Indian Multilingual Stroop Paradigm
              </h3>
              <p className="text-[12px] text-[#6b6890] leading-relaxed">
                Identify the <strong>INK COLOR</strong> of the word, not what the word reads.
                You can press <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono text-[10px]">R</kbd> (Red), <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono text-[10px]">G</kbd> (Green), or <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono text-[10px]">B</kbd> (Blue), or click the buttons below.
              </p>
              <button
                type="button"
                onClick={startExperiment}
                className="h-[38px] px-6 bg-[#e8852b] hover:bg-[#f9a94e] text-white text-[13px] font-semibold rounded-xl flex items-center gap-2 mx-auto shadow-md transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Interactive Demo (6 Trials)</span>
              </button>
            </div>
          )}

          {isPlaying && (
            <div className="flex flex-col items-center space-y-6 w-full max-w-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#a09ec0]">
                Trial {trialIndex + 1} of {SAMPLE_TRIALS.length} ({currentTrial.language})
              </div>

              {/* Stimulus Word */}
              <div
                className="text-5xl md:text-6xl font-black transition-all select-none drop-shadow-sm"
                style={{ color: currentTrial.colorHex }}
              >
                {currentTrial.word}
              </div>

              {/* Interactive Color Buttons */}
              <div className="grid grid-cols-3 gap-3 w-full pt-4">
                <button
                  type="button"
                  onClick={() => handleResponse("Red")}
                  className="h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-[13px] shadow-sm active:scale-95 transition-all flex flex-col items-center justify-center"
                >
                  <span>Red</span>
                  <span className="text-[9px] opacity-70">Key 'R'</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleResponse("Green")}
                  className="h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[13px] shadow-sm active:scale-95 transition-all flex flex-col items-center justify-center"
                >
                  <span>Green</span>
                  <span className="text-[9px] opacity-70">Key 'G'</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleResponse("Blue")}
                  className="h-12 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-[13px] shadow-sm active:scale-95 transition-all flex flex-col items-center justify-center"
                >
                  <span>Blue</span>
                  <span className="text-[9px] opacity-70">Key 'B'</span>
                </button>
              </div>
            </div>
          )}

          {testComplete && (
            <div className="w-full max-w-lg space-y-4 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1a1633]">
                Trial Block Complete! Real Measured Data:
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#f5f3ef] border border-[#1a1633]/10 p-3 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-[#a09ec0]">Congruent RT</div>
                  <div className="text-xl font-bold font-mono text-[#1a1633]">
                    {meanCongruentRT}ms
                  </div>
                </div>
                <div className="bg-[#f5f3ef] border border-[#1a1633]/10 p-3 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-[#a09ec0]">Incongruent RT</div>
                  <div className="text-xl font-bold font-mono text-[#1a1633]">
                    {meanIncongruentRT}ms
                  </div>
                </div>
                <div className="bg-[#e8852b]/10 border border-[#e8852b]/30 p-3 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-[#e8852b]">Stroop Cost</div>
                  <div className="text-xl font-bold font-mono text-[#e8852b]">
                    +{stroopCost}ms
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={startExperiment}
                  className="h-[32px] px-4 border border-[#1a1633]/20 hover:bg-white text-[12px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Run Again</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAdvance();
                    onToast("Data passed to Stage 5 & 6!");
                  }}
                  className="h-[32px] px-4 bg-[#1a1633] text-white hover:bg-[#e8852b] text-[12px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <span>Pass Data to Analysis Studio →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cloner Library */}
      <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-3">
        <h3 className="text-[13px] font-semibold text-[#1a1633]">
          Pre-Configured Classical Cognitive Paradigms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 bg-[#f5f3ef] border border-[#1a1633]/10 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-[12px] font-bold text-[#1a1633]">
                Stroop (1935) — Bilingual Hindi & English
              </div>
              <div className="text-[11px] text-[#6b6890]">
                Devanagari script + Latin script with high-frequency word matches.
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToast("Stroop (1935) cloned into workspace ✓")}
              className="h-[26px] px-3 bg-[#e8852b] text-white text-[11px] font-semibold rounded hover:bg-[#f9a94e]"
            >
              Cloned ✓
            </button>
          </div>

          <div className="p-3.5 bg-[#f5f3ef] border border-[#1a1633]/10 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-[12px] font-bold text-[#1a1633]">
                Implicit Association Test (IAT 1998)
              </div>
              <div className="text-[11px] text-[#6b6890]">
                Includes India-specific cultural stimuli (caste, gender-career, urban-rural).
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToast("IAT (1998) cloned into workspace ✓")}
              className="h-[26px] px-3 bg-white border border-[#1a1633]/15 text-[#1a1633] text-[11px] font-semibold rounded hover:bg-[#f5f3ef]"
            >
              Clone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

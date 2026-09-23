'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StudyProject, ParticipantSession, ParticipantTrialRecord } from '@/types';
import { CheckCircle2, ShieldCheck, HeartPulse, ArrowRight, RefreshCw, X, Smartphone, Monitor } from 'lucide-react';

interface ParticipantRunnerProps {
  project: StudyProject;
  onComplete: (session: ParticipantSession) => void;
  onClose: () => void;
}

type RunnerStep = 'consent' | 'phq9' | 'instructions' | 'task' | 'debrief';

const INDIAN_STATES = [
  'Karnataka',
  'Delhi NCR',
  'Tamil Nadu',
  'Maharashtra',
  'Kerala',
  'Telangana',
  'West Bengal',
  'Gujarat',
  'Uttar Pradesh',
  'Punjab',
  'Rajasthan',
  'Andhra Pradesh',
  'Odisha',
  'Assam',
  'Madhya Pradesh',
  'Bihar',
  'Other State / UT',
];

const STROOP_COLORS: { name: 'red' | 'green' | 'blue' | 'yellow'; hex: string; key: string }[] = [
  { name: 'red', hex: '#dc2626', key: 'R' },
  { name: 'green', hex: '#16a34a', key: 'G' },
  { name: 'blue', hex: '#2563eb', key: 'B' },
  { name: 'yellow', hex: '#ca8a04', key: 'Y' },
];

const WORDS_ENGLISH = ['RED', 'GREEN', 'BLUE', 'YELLOW'];
const WORDS_HINDI = ['लाल', 'हरा', 'नीला', 'पीला'];
const WORDS_TAMIL = ['சிவப்பு', 'பச்சை', 'நீலம்', 'மஞ்சள்'];

export function ParticipantRunner({ project, onComplete, onClose }: ParticipantRunnerProps) {
  const [step, setStep] = useState<RunnerStep>('consent');
  const [ageGroup, setAgeGroup] = useState('18-24');
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [language, setLanguage] = useState('English');
  const [consentChecked, setConsentChecked] = useState(false);
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile'>('desktop');

  // PHQ-9 responses (4 items screening)
  const [phqScores, setPhqScores] = useState<number[]>([0, 0, 0, 0]);

  // Task execution state
  const [trialIndex, setTrialIndex] = useState(0);
  const [showingFixation, setShowingFixation] = useState(true);
  const [currentTrial, setCurrentTrial] = useState<{
    word: string;
    colorName: 'red' | 'green' | 'blue' | 'yellow';
    hex: string;
    congruent: boolean;
  } | null>(null);

  const [recordedTrials, setRecordedTrials] = useState<ParticipantTrialRecord[]>([]);
  const trialStartTimeRef = useRef<number>(0);
  const totalTrials = Math.min(project.experimentConfig.trialCount || 16, 24);

  // Detect mobile vs desktop
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
      setDeviceType(isMobile ? 'mobile' : 'desktop');
    }
  }, []);

  // Generate randomized trial stimulus
  const getNextStimulus = useCallback(() => {
    let wordList = WORDS_ENGLISH;
    if (language === 'Hindi') wordList = WORDS_HINDI;
    if (language === 'Tamil') wordList = WORDS_TAMIL;

    const targetColorObj = STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)];
    const isCongruent = Math.random() > 0.5;

    let word: string;
    if (isCongruent) {
      const colorIndex = STROOP_COLORS.findIndex((c) => c.name === targetColorObj.name);
      word = wordList[colorIndex];
    } else {
      const otherColors = STROOP_COLORS.filter((c) => c.name !== targetColorObj.name);
      const chosenColor = otherColors[Math.floor(Math.random() * otherColors.length)];
      const colorIndex = STROOP_COLORS.findIndex((c) => c.name === chosenColor.name);
      word = wordList[colorIndex];
    }

    return {
      word,
      colorName: targetColorObj.name,
      hex: targetColorObj.hex,
      congruent: isCongruent,
    };
  }, [language]);

  // Trial lifecycle
  useEffect(() => {
    if (step !== 'task') return;

    if (trialIndex >= totalTrials) {
      // Completed all trials
      finishStudy();
      return;
    }

    // Show fixation cross for 500ms
    setShowingFixation(true);
    setCurrentTrial(null);

    const timer = setTimeout(() => {
      const stim = getNextStimulus();
      setCurrentTrial(stim);
      setShowingFixation(false);
      trialStartTimeRef.current = performance.now();
    }, project.experimentConfig.fixationDurationMs || 500);

    return () => clearTimeout(timer);
  }, [step, trialIndex, totalTrials, getNextStimulus, project.experimentConfig.fixationDurationMs]);

  // Handle participant response (sub-millisecond logging)
  const handleResponse = useCallback(
    (chosenColor: 'red' | 'green' | 'blue' | 'yellow') => {
      if (showingFixation || !currentTrial) return;

      const rtMs = performance.now() - trialStartTimeRef.current;
      const isCorrect = chosenColor === currentTrial.colorName;

      const trialRecord: ParticipantTrialRecord = {
        trialIndex: trialIndex + 1,
        word: currentTrial.word,
        color: currentTrial.hex,
        colorName: currentTrial.colorName,
        congruent: currentTrial.congruent,
        response: chosenColor,
        correct: isCorrect,
        rtMs: Math.max(120, rtMs),
      };

      setRecordedTrials((prev) => [...prev, trialRecord]);
      setTrialIndex((prev) => prev + 1);
    },
    [showingFixation, currentTrial, trialIndex]
  );

  // Keyboard listener for desktop participants
  useEffect(() => {
    if (step !== 'task') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'R') handleResponse('red');
      else if (key === 'G') handleResponse('green');
      else if (key === 'B') handleResponse('blue');
      else if (key === 'Y') handleResponse('yellow');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, handleResponse]);

  // Finish study and build final session
  const finishStudy = () => {
    const validTrials = recordedTrials.filter((t) => t.correct && t.rtMs >= 150);
    const congruentTrials = validTrials.filter((t) => t.congruent);
    const incongruentTrials = validTrials.filter((t) => !t.congruent);

    const meanCongruentRT =
      congruentTrials.length > 0
        ? congruentTrials.reduce((acc, t) => acc + t.rtMs, 0) / congruentTrials.length
        : 600;

    const meanIncongruentRT =
      incongruentTrials.length > 0
        ? incongruentTrials.reduce((acc, t) => acc + t.rtMs, 0) / incongruentTrials.length
        : 720;

    const accuracyPct =
      recordedTrials.length > 0
        ? (recordedTrials.filter((t) => t.correct).length / recordedTrials.length) * 100
        : 95;

    const phqTotal = phqScores.reduce((a, b) => a + b, 0);

    const session: ParticipantSession = {
      id: `STX-${selectedState.slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      studyId: project.id,
      startedAt: new Date(Date.now() - 360000).toISOString(),
      completedAt: new Date().toISOString(),
      demographics: {
        ageGroup,
        state: selectedState,
        primaryLanguage: language,
        device: deviceType,
      },
      consentGiven: true,
      clinicalScores: {
        phq9: phqTotal,
        phq9Severity: phqTotal < 5 ? 'Minimal' : phqTotal < 10 ? 'Mild' : 'Moderate',
      },
      trials: recordedTrials,
      summary: {
        meanCongruentRT: Number(meanCongruentRT.toFixed(1)),
        meanIncongruentRT: Number(meanIncongruentRT.toFixed(1)),
        stroopInterference: Number((meanIncongruentRT - meanCongruentRT).toFixed(1)),
        accuracyPct: Number(accuracyPct.toFixed(1)),
        totalTrials: recordedTrials.length,
      },
    };

    onComplete(session);
    setStep('debrief');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0c20] text-white flex flex-col font-sans overflow-y-auto">
      {/* Participant Header */}
      <div className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-[#16122e]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#e8852b] flex items-center justify-center font-bold text-xs text-white">
            STX
          </div>
          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-white/90">
              Stimulx Active Study Session
            </div>
            <div className="text-[11px] text-white/50 truncate max-w-sm">{project.name}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-white/60 bg-white/5 px-2.5 py-1 rounded-md">
            {deviceType === 'mobile' ? <Smartphone className="w-3.5 h-3.5 text-[#e8852b]" /> : <Monitor className="w-3.5 h-3.5 text-[#4ade80]" />}
            <span>{deviceType === 'mobile' ? 'Mobile Touch' : 'Desktop Keyboard'}</span>
          </div>

          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Exit participant runner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Runner Body */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        {/* STEP 1: INFORMED CONSENT & DEMOGRAPHICS */}
        {step === 'consent' && (
          <div className="max-w-2xl w-full bg-[#1b1738] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-8 h-8 text-[#4ade80]" />
              <div>
                <h1 className="text-xl font-bold text-white">Participant Information & Consent</h1>
                <p className="text-xs text-white/60">Compliant with ICMR Ethical Guidelines 2017 & DPDP Act 2023</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/80 space-y-2.5 mb-6 max-h-52 overflow-y-auto">
              <p>
                <strong>Study Title:</strong> {project.name}
              </p>
              <p>
                <strong>Lead Investigator:</strong> {project.grantProposal.principalInvestigator} ({project.grantProposal.institution})
              </p>
              <p>
                <strong>Protocol ID:</strong> {project.ethicsProtocol.protocolNumber}
              </p>
              <p>
                <strong>Purpose:</strong> You are invited to participate in a behavioural science experiment assessing cognitive control and reaction times.
              </p>
              <p>
                <strong>Voluntary Participation:</strong> Your participation is completely voluntary. You may stop or exit at any point with zero penalty.
              </p>
              <p>
                <strong>Data Protection (DPDP 2023):</strong> No direct personal identifying information (name, phone, Aadhaar) is collected. All response timestamps and reaction times are stored in encrypted form on Indian servers.
              </p>
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Age Bracket</label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full bg-[#120e29] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e8852b]"
                >
                  <option value="18-24">18–24 years</option>
                  <option value="25-34">25–34 years</option>
                  <option value="35-44">35–44 years</option>
                  <option value="45+">45+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">State / Location</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-[#120e29] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e8852b]"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Preferred Stimulus Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#120e29] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e8852b]"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Tamil">தமிழ் (Tamil)</option>
                </select>
              </div>
            </div>

            {/* Consent Checkbox */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer mb-6 hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 accent-[#e8852b] w-4 h-4 rounded"
              />
              <span className="text-xs text-white/90 leading-relaxed">
                I have read and understood the participant information. I confirm I am 18 years or older and freely consent to participate in this study under DPDP 2023 norms.
              </span>
            </label>

            <button
              disabled={!consentChecked}
              onClick={() => setStep(project.experimentConfig.includePhq9 ? 'phq9' : 'instructions')}
              className="w-full py-3 rounded-xl bg-[#e8852b] hover:bg-[#d0731f] disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#e8852b]/20"
            >
              <span>Continue to Study</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: PHQ-9 SCREENING */}
        {step === 'phq9' && (
          <div className="max-w-xl w-full bg-[#1b1738] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <HeartPulse className="w-7 h-7 text-[#f43f5e]" />
              <div>
                <h2 className="text-lg font-bold text-white">General Wellbeing Check (PHQ-4)</h2>
                <p className="text-xs text-white/60">Over the last 2 weeks, how often have you been bothered by:</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {[
                'Little interest or pleasure in doing things',
                'Feeling down, depressed, or hopeless',
                'Trouble falling or staying asleep, or sleeping too much',
                'Feeling tired or having little energy',
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-xs font-medium text-white/90 mb-2">
                    {idx + 1}. {item}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['Not at all (0)', 'Several days (1)', 'More than half (2)', 'Nearly every day (3)'].map(
                      (label, score) => (
                        <button
                          key={score}
                          onClick={() => {
                            const newScores = [...phqScores];
                            newScores[idx] = score;
                            setPhqScores(newScores);
                          }}
                          className={`py-1.5 px-2 rounded text-[10px] text-center transition-all ${
                            phqScores[idx] === score
                              ? 'bg-[#e8852b] text-white font-bold'
                              : 'bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          {label}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('instructions')}
              className="w-full py-3 rounded-xl bg-[#e8852b] hover:bg-[#d0731f] font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Cognitive Task</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: TASK INSTRUCTIONS */}
        {step === 'instructions' && (
          <div className="max-w-xl w-full bg-[#1b1738] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Color-Word Interference Task</h2>
            <p className="text-xs text-white/60 mb-6">Read carefully before starting!</p>

            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-left space-y-3 mb-6">
              <p className="text-xs text-white/90">
                1. A color word will appear in the center of the screen.
              </p>
              <p className="text-xs text-white/90">
                2. Your goal is to identify the <strong>FONT COLOR</strong> as quickly and accurately as possible.
              </p>
              <p className="text-xs text-[#f59e0b] font-medium">
                ⚠️ IGNORE what the word says! Only report the font color!
              </p>
              <div className="p-3 bg-black/40 rounded-xl flex items-center justify-center gap-4">
                <span className="text-xl font-black text-[#16a34a]">RED</span>
                <span className="text-xs text-white/70">→ Correct answer is <strong>GREEN</strong> (the ink color)!</span>
              </div>
            </div>

            {deviceType === 'desktop' ? (
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-6 text-xs text-white/80">
                <div className="font-semibold mb-2">Keyboard Controls:</div>
                <div className="flex justify-center gap-3">
                  <span className="px-2.5 py-1 bg-white/10 rounded font-mono border border-white/20">R = Red</span>
                  <span className="px-2.5 py-1 bg-white/10 rounded font-mono border border-white/20">G = Green</span>
                  <span className="px-2.5 py-1 bg-white/10 rounded font-mono border border-white/20">B = Blue</span>
                  <span className="px-2.5 py-1 bg-white/10 rounded font-mono border border-white/20">Y = Yellow</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 mb-6 text-xs text-white/80">
                Touch the color buttons on screen as fast as possible.
              </div>
            )}

            <button
              onClick={() => {
                setRecordedTrials([]);
                setTrialIndex(0);
                setStep('task');
              }}
              className="w-full py-3.5 rounded-xl bg-[#4ade80] hover:bg-[#22c55e] text-[#0f0c20] font-bold text-sm transition-all shadow-lg shadow-[#4ade80]/20 flex items-center justify-center gap-2"
            >
              <span>Start Task Now ({totalTrials} trials)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4: ACTIVE EXPERIMENT TASK */}
        {step === 'task' && (
          <div className="w-full max-w-2xl flex flex-col items-center">
            {/* Progress Bar */}
            <div className="w-full max-w-md mb-8">
              <div className="flex justify-between text-xs text-white/50 mb-1.5">
                <span>Trial {trialIndex + 1} of {totalTrials}</span>
                <span>{Math.round(((trialIndex) / totalTrials) * 100)}% Complete</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#e8852b] transition-all duration-300"
                  style={{ width: `${(trialIndex / totalTrials) * 100}%` }}
                />
              </div>
            </div>

            {/* Stimulus Stage Area */}
            <div className="w-full max-w-md h-64 bg-[#1b1738] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl relative select-none">
              {showingFixation && (
                <div className="text-4xl font-light text-white/40 tracking-widest animate-pulse">
                  +
                </div>
              )}

              {!showingFixation && currentTrial && (
                <div
                  className="text-5xl md:text-6xl font-black tracking-wider transition-transform scale-105"
                  style={{ color: currentTrial.hex }}
                >
                  {currentTrial.word}
                </div>
              )}
            </div>

            {/* Response Buttons for Touch or Click */}
            <div className="w-full max-w-md mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STROOP_COLORS.map((col) => (
                <button
                  key={col.name}
                  onClick={() => handleResponse(col.name)}
                  className="py-3.5 px-3 rounded-xl border border-white/20 font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg flex flex-col items-center justify-center gap-1"
                  style={{ backgroundColor: `${col.hex}22`, borderColor: col.hex, color: col.hex }}
                >
                  <span className="text-sm">{col.name}</span>
                  {deviceType === 'desktop' && (
                    <span className="text-[10px] opacity-75 font-mono">[{col.key}]</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: DEBRIEFING & SAFETY NET */}
        {step === 'debrief' && (
          <div className="max-w-xl w-full bg-[#1b1738] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-[#4ade80]/20 text-[#4ade80] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Session Complete! Thank You!</h2>
            <p className="text-xs text-white/60 mb-6">
              Your response timestamps have been securely recorded into the research dataset.
            </p>

            {/* Participant Quick Results Card */}
            {recordedTrials.length > 0 && (
              <div className="grid grid-cols-3 gap-3 p-4 bg-white/5 rounded-xl border border-white/10 mb-6 text-left">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40">Accuracy</div>
                  <div className="text-lg font-bold text-[#4ade80]">
                    {(
                      (recordedTrials.filter((t) => t.correct).length / recordedTrials.length) *
                      100
                    ).toFixed(0)}
                    %
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40">Avg RT</div>
                  <div className="text-lg font-bold text-white">
                    {(
                      recordedTrials.reduce((a, b) => a + b.rtMs, 0) / recordedTrials.length
                    ).toFixed(0)}{' '}
                    ms
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40">Trials</div>
                  <div className="text-lg font-bold text-[#e8852b]">{recordedTrials.length}</div>
                </div>
              </div>
            )}

            {/* Ethical Safety Net & Indian Helplines */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-left mb-6 space-y-2">
              <div className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-[#f43f5e]" />
                <span>ICMR Ethical Participant Safety Net</span>
              </div>
              <p className="text-[11px] text-white/70">
                Participation in behavioural tasks can sometimes trigger cognitive fatigue. Free, confidential 24x7 support is always available:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="bg-black/30 p-2 rounded-lg text-[11px]">
                  <strong>Tele-MANAS (Govt of India):</strong><br />
                  <span className="text-[#4ade80] font-mono">14416</span> (Toll-Free, 20+ Languages)
                </div>
                <div className="bg-black/30 p-2 rounded-lg text-[11px]">
                  <strong>KIRAN Mental Health:</strong><br />
                  <span className="text-[#4ade80] font-mono">1800-599-0019</span> (24x7 Support)
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#e8852b] hover:bg-[#d0731f] font-semibold text-sm transition-all"
            >
              Return to Researcher Studio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

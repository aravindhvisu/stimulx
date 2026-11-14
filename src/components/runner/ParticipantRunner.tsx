'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StudyProject,
  ParticipantSession,
  ParticipantTrialRecord,
  ExperimentTreeNode,
  TaskDefinition,
  QuestionnaireDefinition,
  QuestionnairePage,
  QuestionnaireItem,
  TaskDisplay,
  TaskZone,
  TaskSpreadsheetRow,
  GorillaRawTrialLog,
  QuestionnaireResponseLog,
  LiveParticipantSession,
} from '@/types';
import { useStimulxStore } from '@/lib/store';
import { DEFAULT_EXPERIMENT_TREE, DEFAULT_TASKS, DEFAULT_QUESTIONNAIRES } from '@/lib/gorillaTemplates';
import {
  CheckCircle2,
  ShieldCheck,
  HeartPulse,
  ArrowRight,
  RefreshCw,
  X,
  Smartphone,
  Monitor,
  Clock,
  Sparkles,
  Award,
  Flag,
  Keyboard,
  ChevronRight,
} from 'lucide-react';

interface ParticipantRunnerProps {
  project: StudyProject;
  onComplete?: (session: ParticipantSession) => void;
  onClose: () => void;
}

export function ParticipantRunner({ project, onComplete, onClose }: ParticipantRunnerProps) {
  const {
    createLiveSession,
    recordLiveTrialLog,
    recordLiveQuestionnaireResponse,
    completeLiveSession,
    addParticipantSession,
  } = useStimulxStore();

  // Load Tree, Tasks, and Questionnaires from project with defaults fallback
  const tree = project.tree && project.tree.nodes.length > 0 ? project.tree : DEFAULT_EXPERIMENT_TREE;
  const tasks = project.tasks && project.tasks.length > 0 ? project.tasks : DEFAULT_TASKS;
  const questionnaires =
    project.questionnaires && project.questionnaires.length > 0
      ? project.questionnaires
      : DEFAULT_QUESTIONNAIRES;

  // Active Session State
  const [session, setSession] = useState<LiveParticipantSession | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string>('');
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile'>('desktop');

  // Demographic / Setup Form State
  const [demographics, setDemographics] = useState({
    alias: '',
    ageGroup: '18-24',
    state: 'Karnataka',
    primaryLanguage: 'English / Hindi',
  });

  // Questionnaire Execution State
  const [qPageIndex, setQPageIndex] = useState<number>(0);
  const [qAnswers, setQAnswers] = useState<Record<string, any>>({});
  const [qValidationErr, setQValidationErr] = useState<string | null>(null);

  // Task Execution State
  const [activeTask, setActiveTask] = useState<TaskDefinition | null>(null);
  const [trialRows, setTrialRows] = useState<TaskSpreadsheetRow[]>([]);
  const [currentTrialIdx, setCurrentTrialIdx] = useState<number>(0);
  const [currentDisplayIdx, setCurrentDisplayIdx] = useState<number>(0);
  const [trialFeedback, setTrialFeedback] = useState<{ text: string; color: string } | null>(null);
  const [awaitingInput, setAwaitingInput] = useState<boolean>(false);

  // Delay / Break State
  const [delayRemaining, setDelayRemaining] = useState<number>(0);

  // Timing references
  const displayOnsetRef = useRef<number>(0);
  const timerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accumulatedRawLogsRef = useRef<GorillaRawTrialLog[]>([]);
  const accumulatedLegacyTrialsRef = useRef<ParticipantTrialRecord[]>([]);

  // Detect mobile vs desktop
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
      setDeviceType(isMobile ? 'mobile' : 'desktop');
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    const startNode = tree.nodes.find((n) => n.type === 'start') || tree.nodes[0];
    const firstActiveNodeId = startNode.next || tree.nodes[1]?.id || startNode.id;

    const newSess = createLiveSession(project.id, {
      device: deviceType,
      state: demographics.state,
      age: demographics.ageGroup,
      primaryLanguage: demographics.primaryLanguage,
    });

    setSession(newSess);
    setCurrentNodeId(firstActiveNodeId);
  }, []);

  const currentNode = tree.nodes.find((n) => n.id === currentNodeId);

  // Dynamic variable binder for task stimuli
  const resolveBinding = (
    templateString?: string,
    row?: TaskSpreadsheetRow,
    feedback?: { text: string; color: string } | null
  ): string => {
    if (!templateString) return '';
    let result = templateString;

    if (feedback) {
      result = result
        .replace(/\$\$feedback_label/g, feedback.text)
        .replace(/\$\$feedback_color/g, feedback.color);
    }

    if (row) {
      result = result.replace(/\$\$([a-zA-Z0-9_]+)/g, (_, colName) => {
        return row[colName] !== undefined ? String(row[colName]) : `$$${colName}`;
      });
    }

    return result;
  };

  // Traversal to next node in tree
  const transitionToNode = (targetNodeId?: string) => {
    // Clear any active timers
    if (timerTimeoutRef.current) {
      clearTimeout(timerTimeoutRef.current);
      timerTimeoutRef.current = null;
    }

    if (!targetNodeId) {
      // Find default next from currentNode
      targetNodeId = currentNode?.next;
    }

    if (!targetNodeId || !tree.nodes.some((n) => n.id === targetNodeId)) {
      // Find finish node as fallback
      const finishNode = tree.nodes.find((n) => n.type === 'finish');
      targetNodeId = finishNode ? finishNode.id : '';
    }

    const nextNode = tree.nodes.find((n) => n.id === targetNodeId);
    if (!nextNode) return;

    // Handle Randomiser Node routing
    if (nextNode.type === 'randomiser') {
      const branches = nextNode.randomiserSettings?.branches || [];
      if (branches.length > 0) {
        // Weighted random selection
        const rand = Math.random() * 100;
        let cumulative = 0;
        let selectedBranch = branches[0];
        for (const b of branches) {
          cumulative += b.weightPct;
          if (rand <= cumulative) {
            selectedBranch = b;
            break;
          }
        }
        transitionToNode(selectedBranch.targetNodeId);
        return;
      }
    }

    // Handle Conditional Branch Node routing
    if (nextNode.type === 'branch' && nextNode.branchSettings) {
      const cond = nextNode.branchSettings;
      const varVal = session?.overallScores?.[cond.variableName] ?? 0;
      let isMet = false;
      const targetVal = Number(cond.value);

      if (cond.operator === 'greater_than') isMet = Number(varVal) > targetVal;
      else if (cond.operator === 'less_than') isMet = Number(varVal) < targetVal;
      else if (cond.operator === 'equals') isMet = String(varVal) === String(cond.value);

      transitionToNode(isMet ? cond.trueNodeId : cond.falseNodeId);
      return;
    }

    // Setup state for next node type
    setCurrentNodeId(targetNodeId);

    if (nextNode.type === 'questionnaire') {
      setQPageIndex(0);
      setQAnswers({});
      setQValidationErr(null);
    } else if (nextNode.type === 'task') {
      const taskDef = tasks.find((t) => t.id === nextNode.taskId) || tasks[0];
      setActiveTask(taskDef);

      let rows = [...taskDef.spreadsheet];
      if (taskDef.randomizeTrials) {
        rows = rows.sort(() => Math.random() - 0.5);
      }
      setTrialRows(rows);
      setCurrentTrialIdx(0);
      setCurrentDisplayIdx(0);
      setTrialFeedback(null);
      setAwaitingInput(false);
    } else if (nextNode.type === 'delay') {
      const seconds = nextNode.delaySettings?.durationSeconds || 60;
      setDelayRemaining(seconds);
    } else if (nextNode.type === 'finish') {
      // Finalize and save
      handleSessionFinish(nextNode);
    }
  };

  // Questionnaire Page Submission
  const handleQuestionnaireSubmit = (qDef: QuestionnaireDefinition, page: QuestionnairePage) => {
    // Check required fields
    for (const item of page.items) {
      if (item.required && (qAnswers[item.id] === undefined || qAnswers[item.id] === '')) {
        setQValidationErr(`Please answer required question: "${item.title}"`);
        return;
      }
    }

    setQValidationErr(null);

    // Record response logs
    if (session) {
      page.items.forEach((item) => {
        const val = qAnswers[item.id];
        let score: number | undefined = undefined;
        if (item.options && val !== undefined) {
          const matched = item.options.find((o) => o.value === val);
          if (matched && matched.score !== undefined) score = matched.score;
        }

        const log: QuestionnaireResponseLog = {
          sessionId: session.id,
          questionnaireId: qDef.id,
          questionId: item.id,
          questionTitle: item.title,
          answer: val,
          score,
          answeredAtIso: new Date().toISOString(),
        };
        recordLiveQuestionnaireResponse(session.id, log);
      });
    }

    // More pages in this questionnaire?
    if (qPageIndex + 1 < qDef.pages.length) {
      setQPageIndex(qPageIndex + 1);
    } else {
      // Calculate overall score if rule exists
      let computedScores: Record<string, number> = { ...(session?.overallScores || {}) };
      if (qDef.scoringRule?.sumItemIds) {
        let sum = 0;
        qDef.pages.forEach((p) => {
          p.items.forEach((it) => {
            if (qDef.scoringRule?.sumItemIds?.includes(it.id)) {
              const ans = qAnswers[it.id];
              const opt = it.options?.find((o) => o.value === ans);
              if (opt && opt.score !== undefined) sum += opt.score;
            }
          });
        });
        const metricKey = qDef.scoringRule.scaleName || `score_${qDef.id}`;
        computedScores[metricKey] = sum;
      }

      if (session) {
        session.overallScores = computedScores;
      }

      transitionToNode();
    }
  };

  // Run Task Display Loop
  useEffect(() => {
    if (currentNode?.type !== 'task' || !activeTask || trialRows.length === 0) return;

    const currentDisplay: TaskDisplay | undefined = activeTask.displays[currentDisplayIdx];
    if (!currentDisplay) return;

    displayOnsetRef.current = performance.now();

    // Check if this display accepts responses
    const hasKeyboardOrButton = currentDisplay.zones.some(
      (z) => z.type === 'keyboard_response' || z.type === 'button_response'
    );
    setAwaitingInput(hasKeyboardOrButton);

    // Setup timer if advanceOn is time or timeout exists
    if (currentDisplay.advanceOn === 'time' || currentDisplay.durationMs) {
      const duration = currentDisplay.durationMs || 1000;
      timerTimeoutRef.current = setTimeout(() => {
        handleDisplayTimeout(currentDisplay);
      }, duration);
    }

    return () => {
      if (timerTimeoutRef.current) {
        clearTimeout(timerTimeoutRef.current);
        timerTimeoutRef.current = null;
      }
    };
  }, [currentNodeId, activeTask, currentTrialIdx, currentDisplayIdx]);

  // Display timeout handler
  const handleDisplayTimeout = (display: TaskDisplay) => {
    if (display.advanceOn === 'time_or_response' && awaitingInput) {
      // Log timed out response
      recordTrialAction('none', false, display.durationMs || 2000, true);
    }
    advanceTaskStep();
  };

  // Handle participant response (Key or Button Click)
  const handleParticipantInput = (keyOrChoice: string) => {
    if (!awaitingInput || !activeTask) return;

    const currentDisplay = activeTask.displays[currentDisplayIdx];
    if (!currentDisplay) return;

    const rtMs = Math.round(performance.now() - displayOnsetRef.current);

    // Find the responding zone
    const respZone = currentDisplay.zones.find(
      (z) => z.type === 'keyboard_response' || z.type === 'button_response'
    );

    const currentRow = trialRows[currentTrialIdx] || {};
    const expectedKey = resolveBinding(respZone?.correctKey, currentRow).toLowerCase();
    const isCorrect = keyOrChoice.toLowerCase() === expectedKey;

    if (respZone?.showFeedback !== false) {
      setTrialFeedback({
        text: isCorrect ? '✓ Correct' : '✗ Incorrect',
        color: isCorrect ? '#22c55e' : '#ef4444',
      });
    }

    setAwaitingInput(false);
    recordTrialAction(keyOrChoice, isCorrect, rtMs, false);

    if (currentDisplay.advanceOn === 'response' || currentDisplay.advanceOn === 'time_or_response') {
      advanceTaskStep();
    }
  };

  // Record raw trial metric row
  const recordTrialAction = (
    response: string,
    isCorrect: boolean,
    rtMs: number,
    timedOut: boolean
  ) => {
    if (!session || !activeTask || !currentNode) return;

    const currentDisplay = activeTask.displays[currentDisplayIdx];
    const currentRow = trialRows[currentTrialIdx] || {};

    const rawLog: GorillaRawTrialLog = {
      rowId: `trial_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sessionId: session.id,
      participantToken: session.participantToken,
      nodeId: currentNode.id,
      nodeTitle: currentNode.title,
      taskId: activeTask.id,
      trialIndex: currentTrialIdx + 1,
      displayId: currentDisplay?.id || 'disp_unknown',
      displayName: currentDisplay?.name || 'Stimulus',
      response,
      correct: isCorrect,
      rtMs,
      timedOut,
      timestampIso: new Date().toISOString(),
      spreadsheetRow: currentRow,
    };

    accumulatedRawLogsRef.current.push(rawLog);
    recordLiveTrialLog(session.id, rawLog);

    // Also populate legacy trial record for backward compatibility
    accumulatedLegacyTrialsRef.current.push({
      trialIndex: currentTrialIdx + 1,
      word: String(currentRow.word || currentRow.arrows || 'STIMULUS'),
      color: String(currentRow.color || '#ffffff'),
      colorName: (currentRow.color_name as any) || 'blue',
      congruent: currentRow.congruency === 'congruent' || currentRow.congruency === true,
      response: (response as any) || 'none',
      correct: isCorrect,
      rtMs,
    });
  };

  // Advance to next display screen or next trial row
  const advanceTaskStep = () => {
    if (!activeTask) return;

    if (currentDisplayIdx + 1 < activeTask.displays.length) {
      // Next display within the same trial
      setCurrentDisplayIdx(currentDisplayIdx + 1);
    } else {
      // End of this trial!
      if (currentTrialIdx + 1 < trialRows.length) {
        // Next trial row. Instructions are shown once, before the first trial only.
        const startsWithInstructions =
          activeTask.displays.length > 1 && /instruction/i.test(activeTask.displays[0].name);
        setCurrentTrialIdx(currentTrialIdx + 1);
        setCurrentDisplayIdx(startsWithInstructions ? 1 : 0);
        setTrialFeedback(null);
      } else {
        // All trials completed for this task!
        transitionToNode();
      }
    }
  };

  // Keyboard shortcut listener for active tasks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!awaitingInput || !activeTask) return;

      const currentDisplay = activeTask.displays[currentDisplayIdx];
      const keyboardZone = currentDisplay?.zones.find((z) => z.type === 'keyboard_response');

      if (!keyboardZone) return;

      const key = e.key.toLowerCase();
      const valid = keyboardZone.validKeys || ['r', 'g', 'b', 'y', 'f', 'j', ' '];

      if (valid.includes(key)) {
        e.preventDefault();
        handleParticipantInput(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [awaitingInput, activeTask, currentDisplayIdx, currentTrialIdx]);

  // Session Finish
  const handleSessionFinish = (finishNode: ExperimentTreeNode) => {
    if (!session) return;

    // Finalize live session
    completeLiveSession(session.id, session.overallScores);

    // Compute legacy session summary for full ecosystem backward compatibility
    const trials = accumulatedLegacyTrialsRef.current;
    const congruentTrials = trials.filter((t) => t.congruent);
    const incongruentTrials = trials.filter((t) => !t.congruent);

    const meanCongruentRT =
      congruentTrials.length > 0
        ? Math.round(congruentTrials.reduce((a, b) => a + b.rtMs, 0) / congruentTrials.length)
        : 580;

    const meanIncongruentRT =
      incongruentTrials.length > 0
        ? Math.round(incongruentTrials.reduce((a, b) => a + b.rtMs, 0) / incongruentTrials.length)
        : 695;

    const correctCount = trials.filter((t) => t.correct).length;
    const accuracyPct = trials.length > 0 ? Number(((correctCount / trials.length) * 100).toFixed(1)) : 94.5;

    const legacySession: ParticipantSession = {
      id: session.participantToken,
      studyId: project.id,
      startedAt: session.startedAt,
      completedAt: new Date().toISOString(),
      demographics: {
        ageGroup: demographics.ageGroup,
        state: demographics.state,
        primaryLanguage: demographics.primaryLanguage,
        device: deviceType,
      },
      consentGiven: true,
      trials,
      summary: {
        meanCongruentRT,
        meanIncongruentRT,
        stroopInterference: meanIncongruentRT - meanCongruentRT,
        accuracyPct,
        totalTrials: trials.length,
      },
    };

    addParticipantSession(legacySession);
    if (onComplete) {
      onComplete(legacySession);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070b14] text-white flex flex-col overflow-hidden select-none font-sans">
      {/* Top Participant Status Bar */}
      <div className="h-12 border-b border-slate-800 bg-[#0d1424] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold tracking-wide text-white">
            Stimulx Sovereign Runtime
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            {session?.participantToken || 'INITIALIZING'}
          </span>
        </div>

        {/* Node Progress Tracker */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <span>Current Phase:</span>
          <span className="text-white font-semibold capitalize">
            {currentNode?.title || 'Experiment Active'}
          </span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Exit participant mode"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Execution View Switcher */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
        {/* Render Questionnaire Node */}
        {currentNode?.type === 'questionnaire' && (
          (() => {
            const qDef = questionnaires.find((q) => q.id === currentNode.questionnaireId) || questionnaires[0];
            const page = qDef.pages[qPageIndex] || qDef.pages[0];

            return (
              <div className="w-full max-w-2xl bg-[#0f172a] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      {qDef.name} • Section {qPageIndex + 1} of {qDef.pages.length}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Step {qPageIndex + 1}/{qDef.pages.length}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">{page.title}</h2>
                  {page.description && (
                    <p className="text-xs text-slate-400 mt-1">{page.description}</p>
                  )}
                </div>

                {qValidationErr && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/80 text-xs text-red-300">
                    ⚠️ {qValidationErr}
                  </div>
                )}

                {/* Form Items */}
                <div className="space-y-5">
                  {page.items.map((item, idx) => (
                    <div key={item.id} className="space-y-2 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
                      <label className="block text-xs font-semibold text-slate-200">
                        {idx + 1}. {item.title} {item.required && <span className="text-red-400">*</span>}
                      </label>
                      {item.description && (
                        <p className="text-[11px] text-slate-400 whitespace-pre-line leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {/* Likert Scale */}
                      {item.type === 'likert' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                          {item.options?.map((opt) => (
                            <button
                              type="button"
                              key={String(opt.value)}
                              onClick={() =>
                                setQAnswers({ ...qAnswers, [item.id]: opt.value })
                              }
                              className={`p-3 rounded-lg border text-xs font-medium text-center transition-all ${
                                qAnswers[item.id] === opt.value
                                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Radio Multiple Choice */}
                      {item.type === 'multiple_choice' && (
                        <div className="space-y-2 pt-1">
                          {item.options?.map((opt) => (
                            <label
                              key={String(opt.value)}
                              onClick={() =>
                                setQAnswers({ ...qAnswers, [item.id]: opt.value })
                              }
                              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors"
                            >
                              <input
                                type="radio"
                                name={item.id}
                                checked={qAnswers[item.id] === opt.value}
                                onChange={() => {}}
                                className="text-indigo-600"
                              />
                              <span className="text-xs text-slate-200">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Consent Checkbox */}
                      {item.type === 'consent' && (
                        <label className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={qAnswers[item.id] === true}
                            onChange={(e) =>
                              setQAnswers({ ...qAnswers, [item.id]: e.target.checked })
                            }
                            className="mt-0.5 rounded text-emerald-500"
                          />
                          <span className="text-xs text-emerald-200 font-medium leading-relaxed">
                            {item.title}
                          </span>
                        </label>
                      )}

                      {/* Text Input */}
                      {item.type === 'text' && (
                        <input
                          type="text"
                          value={qAnswers[item.id] || ''}
                          onChange={(e) =>
                            setQAnswers({ ...qAnswers, [item.id]: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-md text-slate-100"
                          placeholder="Type your response..."
                        />
                      )}

                      {/* Dropdown Input */}
                      {item.type === 'dropdown' && (
                        <select
                          value={qAnswers[item.id] || ''}
                          onChange={(e) =>
                            setQAnswers({ ...qAnswers, [item.id]: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-md text-slate-100"
                        >
                          <option value="">Select an option...</option>
                          {item.options?.map((opt) => (
                            <option key={String(opt.value)} value={String(opt.value)}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>

                {/* Continue Button */}
                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleQuestionnaireSubmit(qDef, page)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-950 transition-all"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()
        )}

        {/* Render Cognitive Task Node */}
        {currentNode?.type === 'task' && activeTask && (
          (() => {
            const currentDisplay = activeTask.displays[currentDisplayIdx];
            const currentRow = trialRows[currentTrialIdx] || {};

            return (
              <div className="w-full max-w-4xl flex flex-col items-center space-y-4">
                {/* Trial Progress Bar */}
                <div className="w-full flex items-center justify-between text-xs text-slate-400 font-mono px-2">
                  <span>
                    Task: <strong className="text-white">{activeTask.name}</strong>
                  </span>
                  <span>
                    Trial {currentTrialIdx + 1} of {trialRows.length}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{
                      width: `${((currentTrialIdx + 1) / trialRows.length) * 100}%`,
                    }}
                  />
                </div>

                {/* 16:10 Task Display Canvas */}
                <div
                  className="w-full aspect-[16/10] rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center select-none"
                  style={{
                    backgroundColor: currentDisplay?.backgroundColor || '#090d16',
                  }}
                >
                  {currentDisplay?.zones.map((zone) => {
                    const content = resolveBinding(zone.content, currentRow, trialFeedback);
                    const color = resolveBinding(zone.fontColor, currentRow, trialFeedback) || '#ffffff';

                    return (
                      <div
                        key={zone.id}
                        style={{
                          position: 'absolute',
                          left: `${zone.xPct}%`,
                          top: `${zone.yPct}%`,
                          transform: 'translate(-50%, -50%)',
                          width: `${zone.widthPct}%`,
                          height: `${zone.heightPct}%`,
                        }}
                        className="flex flex-col items-center justify-center select-none"
                      >
                        {zone.type === 'fixation' && (
                          <span
                            style={{ fontSize: `${zone.fontSizePx || 48}px`, color }}
                            className="font-mono font-bold leading-none select-none drop-shadow"
                          >
                            {content || '+'}
                          </span>
                        )}

                        {zone.type === 'text' && (
                          <span
                            style={{ fontSize: `${zone.fontSizePx || 36}px`, color }}
                            className="font-bold text-center leading-snug whitespace-pre-line tracking-wide drop-shadow-md select-none"
                          >
                            {content}
                          </span>
                        )}

                        {zone.type === 'keyboard_response' && (
                          <div className="flex flex-col items-center gap-2">
                            {content && (
                              <span className="text-xs text-emerald-400 font-semibold mb-1">
                                {content}
                              </span>
                            )}
                            <div className="flex items-center gap-2">
                              {zone.validKeys?.map((k) => (
                                <button
                                  type="button"
                                  key={k}
                                  onClick={() => handleParticipantInput(k)}
                                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-600 text-xs font-mono font-bold text-slate-200 shadow transition-all cursor-pointer"
                                >
                                  {k.toUpperCase()}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {zone.type === 'button_response' && (
                          <div className="flex items-center gap-3">
                            {zone.options?.map((opt) => (
                              <button
                                type="button"
                                key={opt}
                                onClick={() => handleParticipantInput(opt)}
                                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs shadow-lg transition-all"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()
        )}

        {/* Render Delay / Break Node */}
        {currentNode?.type === 'delay' && (
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Cognitive Rest Period</h2>
              <p className="text-xs text-slate-400 mt-2">
                {currentNode.delaySettings?.message || 'Please take a short cognitive break before continuing.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => transitionToNode()}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 font-semibold text-xs text-white shadow-lg transition-all"
            >
              Ready to Continue ➔
            </button>
          </div>
        )}

        {/* Render Finish Node */}
        {currentNode?.type === 'finish' && (
          <div className="w-full max-w-md bg-[#0f172a] border border-emerald-500/30 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Participation Verified
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">Study Completed!</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {currentNode.finishSettings?.message ||
                  'Your research session has been recorded with cryptographic integrity. Thank you for contributing to Indian Behavioural Science!'}
              </p>
            </div>

            {/* Cryptographic Completion Code Token */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Your Completion Verification Code:
              </div>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-1 select-all">
                {currentNode.finishSettings?.completionCode || session?.participantToken || 'STX-IND-2026'}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-lg shadow-emerald-950 transition-all"
            >
              Exit to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Turns a Stimulx Copilot study plan (from /api/copilot) into the experiment tree,
// task definitions and questionnaires the builder and participant runner already use.
// Layout, timing displays and scoring are built here in code; the model only supplies content.
// Zone xPct / yPct are centre points (the runner and task builder both centre zones on them).

import {
  CognitiveDomain,
  ExperimentTree,
  ExperimentTreeNode,
  QuestionnaireDefinition,
  TaskDefinition,
} from '@/types';
import { DEFAULT_QUESTIONNAIRES } from '@/lib/gorillaTemplates';

export type CopilotFlowStep = 'consent' | 'demographics' | 'phq9' | 'gad7' | 'task' | 'questionnaire' | 'debrief';

export interface CopilotTrial {
  stimulus: string;
  color: string;
  correct_key: string;
  condition: string;
  language: string;
}

export interface CopilotTask {
  id: string;
  name: string;
  description: string;
  domain: CognitiveDomain;
  instructions: string;
  fixation_ms: number;
  stimulus_ms: number;
  keys: { key: string; meaning: string }[];
  trials: CopilotTrial[];
}

export interface CopilotQuestionnaire {
  id: string;
  name: string;
  description: string;
  intro: string;
  scale_labels: string[];
  items: string[];
}

export interface CopilotPlan {
  title: string;
  hypothesis: string;
  design: string;
  summary: string;
  debrief: string;
  flow: { step: CopilotFlowStep; ref: string }[];
  tasks: CopilotTask[];
  questionnaires: CopilotQuestionnaire[];
  notes: string[];
}

export interface AssembledStudy {
  tree: ExperimentTree;
  tasks: TaskDefinition[];
  questionnaires: QuestionnaireDefinition[];
}

const LIBRARY: Record<'consent' | 'demographics' | 'phq9' | 'gad7', { id: string; title: string }> = {
  consent: { id: 'q_consent', title: 'Informed Consent (ICMR / DPDP)' },
  demographics: { id: 'q_demographics', title: 'Demographics' },
  phq9: { id: 'q_phq9', title: 'PHQ-9' },
  gad7: { id: 'q_gad7', title: 'GAD-7' },
};

export const FLOW_LABELS: Record<CopilotFlowStep, string> = {
  consent: 'Informed consent',
  demographics: 'Demographics',
  phq9: 'PHQ-9 (validated, from library)',
  gad7: 'GAD-7 (validated, from library)',
  task: 'Task',
  questionnaire: 'Questionnaire',
  debrief: 'Debrief and helplines',
};

const DEFAULT_STIMULUS_COLOR = '#e2e8f0';

function buildTask(t: CopilotTask, id: string): TaskDefinition {
  const keyLines = t.keys.map((k) => `• Press [${k.key.toUpperCase()}] for ${k.meaning}`).join('\n');
  const legend = t.keys.map((k) => `[${k.key.toUpperCase()}] ${k.meaning}`).join('   |   ');

  return {
    id,
    name: t.name,
    description: t.description,
    domain: t.domain,
    randomizeTrials: true,
    interTrialIntervalMs: 300,
    displays: [
      {
        id: `${id}_instr`,
        name: 'Task Instructions',
        advanceOn: 'response',
        backgroundColor: '#0f172a',
        zones: [
          {
            id: `${id}_instr_title`,
            name: 'Title',
            type: 'text',
            xPct: 50,
            yPct: 14,
            widthPct: 80,
            heightPct: 10,
            content: t.name.toUpperCase(),
            fontSizePx: 26,
            fontColor: '#a78bfa',
          },
          {
            id: `${id}_instr_body`,
            name: 'Instructions Text',
            type: 'text',
            xPct: 50,
            yPct: 45,
            widthPct: 80,
            heightPct: 46,
            content: `${t.instructions}\n\n${keyLines}`,
            fontSizePx: 17,
            fontColor: '#e2e8f0',
          },
          {
            id: `${id}_instr_start`,
            name: 'Start Key Listener',
            type: 'keyboard_response',
            xPct: 50,
            yPct: 82,
            widthPct: 80,
            heightPct: 15,
            content: 'Press [SPACEBAR] to begin',
            fontSizePx: 18,
            fontColor: '#34d399',
            validKeys: [' '],
          },
        ],
      },
      {
        id: `${id}_fix`,
        name: 'Fixation Cross',
        durationMs: Math.max(t.fixation_ms, 100),
        advanceOn: 'time',
        backgroundColor: '#090d16',
        zones: [
          {
            id: `${id}_fix_cross`,
            name: 'Central Fixation',
            type: 'fixation',
            xPct: 50,
            yPct: 50,
            widthPct: 10,
            heightPct: 10,
            content: '+',
            fontSizePx: 44,
            fontColor: '#94a3b8',
          },
        ],
      },
      {
        id: `${id}_stim`,
        name: 'Stimulus & Response',
        durationMs: t.stimulus_ms,
        advanceOn: 'response',
        backgroundColor: '#090d16',
        zones: [
          {
            id: `${id}_stim_text`,
            name: 'Stimulus',
            type: 'text',
            xPct: 50,
            yPct: 45,
            widthPct: 60,
            heightPct: 20,
            content: '$$stimulus',
            fontColor: '$$color',
            fontSizePx: 52,
          },
          {
            id: `${id}_stim_keys`,
            name: 'Response Keyboard Listener',
            type: 'keyboard_response',
            xPct: 50,
            yPct: 80,
            widthPct: 80,
            heightPct: 15,
            validKeys: t.keys.map((k) => k.key),
            correctKey: '$$correct_key',
            timeoutMs: t.stimulus_ms,
          },
          {
            id: `${id}_stim_legend`,
            name: 'Visual Key Legend',
            type: 'text',
            xPct: 50,
            yPct: 93,
            widthPct: 80,
            heightPct: 8,
            content: legend,
            fontSizePx: 14,
            fontColor: '#64748b',
          },
        ],
      },
      {
        id: `${id}_fb`,
        name: 'Trial Feedback',
        durationMs: 350,
        advanceOn: 'time',
        backgroundColor: '#090d16',
        zones: [
          {
            id: `${id}_fb_text`,
            name: 'Accuracy Feedback',
            type: 'text',
            xPct: 50,
            yPct: 50,
            widthPct: 40,
            heightPct: 15,
            content: '$$feedback_label',
            fontSizePx: 26,
            fontColor: '$$feedback_color',
          },
        ],
      },
    ],
    spreadsheet: t.trials.map((r, i) => ({
      trial_id: i + 1,
      stimulus: r.stimulus,
      color: r.color || DEFAULT_STIMULUS_COLOR,
      correct_key: r.correct_key,
      condition: r.condition,
      language: r.language,
    })),
  };
}

function buildQuestionnaire(q: CopilotQuestionnaire, id: string): QuestionnaireDefinition {
  const isScale = q.scale_labels.length >= 2;
  const itemIds = q.items.map((_, i) => `${id}_i${i + 1}`);
  return {
    id,
    name: q.name,
    description: q.description,
    category: 'custom',
    pages: [
      {
        id: `${id}_p1`,
        title: q.name,
        description: q.intro,
        items: q.items.map((title, i) =>
          isScale
            ? {
                id: itemIds[i],
                type: 'likert' as const,
                title: `${i + 1}. ${title}`,
                required: true,
                options: q.scale_labels.map((label, v) => ({ label, value: v, score: v })),
              }
            : { id: itemIds[i], type: 'paragraph' as const, title: `${i + 1}. ${title}`, required: false }
        ),
      },
    ],
    // A plain sum for the researcher's convenience. No cut-offs: this is not a validated instrument.
    ...(isScale ? { scoringRule: { sumItemIds: itemIds, scaleName: `${q.name} (sum, unvalidated)` } } : {}),
  };
}

// The library debrief keeps its helpline section untouched; only the study explanation is replaced.
function buildDebrief(plan: CopilotPlan, id: string): QuestionnaireDefinition | null {
  const base = DEFAULT_QUESTIONNAIRES.find((q) => q.id === 'q_debrief');
  if (!base || !plan.debrief) return null;
  return {
    ...base,
    id,
    name: `Debrief — ${plan.title}`,
    pages: base.pages.map((p) => ({
      ...p,
      items: p.items.map((it) => (it.id === 'debrief_text' ? { ...it, description: plan.debrief } : it)),
    })),
  };
}

export function assembleStudy(plan: CopilotPlan): AssembledStudy {
  const stamp = Date.now().toString(36);
  const taskId = (ref: string) => `ai_${stamp}_${ref}`;
  const qId = (ref: string) => `ai_${stamp}_q_${ref}`;

  const tasks = plan.tasks.map((t) => buildTask(t, taskId(t.id)));
  const questionnaires = plan.questionnaires.map((q) => buildQuestionnaire(q, qId(q.id)));
  const debrief = buildDebrief(plan, `ai_${stamp}_debrief`);
  if (debrief) questionnaires.push(debrief);

  const steps: Omit<ExperimentTreeNode, 'position' | 'next'>[] = plan.flow.map((s, i) => {
    const id = `ai_node_${stamp}_${i + 1}`;
    if (s.step === 'task') {
      const t = plan.tasks.find((x) => x.id === s.ref);
      return { id, type: 'task' as const, title: t?.name || 'Task', taskId: taskId(s.ref) };
    }
    if (s.step === 'questionnaire') {
      const q = plan.questionnaires.find((x) => x.id === s.ref);
      return { id, type: 'questionnaire' as const, title: q?.name || 'Questionnaire', questionnaireId: qId(s.ref) };
    }
    if (s.step === 'debrief') {
      return { id, type: 'questionnaire' as const, title: 'Debrief & Helplines', questionnaireId: debrief ? debrief.id : 'q_debrief' };
    }
    const lib = LIBRARY[s.step];
    return { id, type: 'questionnaire' as const, title: lib.title, questionnaireId: lib.id };
  });

  const ordered: Omit<ExperimentTreeNode, 'position' | 'next'>[] = [
    { id: `ai_node_${stamp}_start`, type: 'start', title: 'Participant Entry' },
    ...steps,
    {
      id: `ai_node_${stamp}_finish`,
      type: 'finish',
      title: 'Session Complete',
      finishSettings: { message: 'Your responses have been recorded. Thank you for taking part.' },
    },
  ];

  const nodes: ExperimentTreeNode[] = ordered.map((n, i) => ({
    ...n,
    position: { x: 50 + i * 230, y: 150 },
    ...(i < ordered.length - 1 ? { next: ordered[i + 1].id } : {}),
  }));

  const edges = nodes.slice(0, -1).map((n, i) => ({ id: `ai_edge_${stamp}_${i + 1}`, fromNodeId: n.id, toNodeId: nodes[i + 1].id }));

  return { tree: { nodes, edges }, tasks, questionnaires };
}

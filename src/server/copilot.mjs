// Stimulx Copilot — server-side Gemini call.
// Runs unchanged on Cloud Run (server.mjs) and on the Cloudflare Worker (src/worker.js).
// The API key never reaches the browser.

const DEFAULT_MODEL = 'gemini-3.8-flash';
const DEFAULT_BASE = 'https://generativelanguage.googleapis.com';
const MAX_PROMPT_CHARS = 2000;
const MAX_TASKS = 4;
const MAX_TRIALS = 200;
const MAX_QUESTIONNAIRES = 4;
const MAX_ITEMS = 60;

const FLOW_STEPS = ['consent', 'demographics', 'phq9', 'gad7', 'task', 'questionnaire', 'debrief'];
const DOMAINS = ['attention', 'memory', 'emotion', 'executive', 'decision'];

const str = { type: 'string' };
const int = { type: 'integer' };

export const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    title: str,
    hypothesis: str,
    design: str,
    summary: str,
    debrief: str,
    flow: {
      type: 'array',
      items: {
        type: 'object',
        properties: { step: { type: 'string', enum: FLOW_STEPS }, ref: str },
        required: ['step', 'ref'],
      },
    },
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: str,
          name: str,
          description: str,
          domain: { type: 'string', enum: DOMAINS },
          instructions: str,
          fixation_ms: int,
          stimulus_ms: int,
          keys: {
            type: 'array',
            items: {
              type: 'object',
              properties: { key: str, meaning: str },
              required: ['key', 'meaning'],
            },
          },
          trials: {
            type: 'array',
            items: {
              type: 'object',
              properties: { stimulus: str, color: str, correct_key: str, condition: str, language: str },
              required: ['stimulus', 'color', 'correct_key', 'condition', 'language'],
            },
          },
        },
        required: ['id', 'name', 'description', 'domain', 'instructions', 'fixation_ms', 'stimulus_ms', 'keys', 'trials'],
      },
    },
    questionnaires: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: str,
          name: str,
          description: str,
          intro: str,
          scale_labels: { type: 'array', items: str },
          items: { type: 'array', items: str },
        },
        required: ['id', 'name', 'description', 'intro', 'scale_labels', 'items'],
      },
    },
    notes: { type: 'array', items: str },
  },
  required: ['title', 'hypothesis', 'design', 'summary', 'debrief', 'flow', 'tasks', 'questionnaires', 'notes'],
};

function buildPrompt(description) {
  return `You are the study-design assistant inside Stimulx, a platform Indian behavioural scientists use to build browser experiments. Turn the researcher's description into one complete, runnable study plan as JSON.

How the platform runs a plan:
- "flow" is the ordered list of steps a participant goes through. Allowed steps: consent, demographics, phq9, gad7, task, questionnaire, debrief.
- For step "task", "ref" is the id of an entry in "tasks". For step "questionnaire", "ref" is the id of an entry in "questionnaires". For every other step, "ref" is "".
- The platform already holds the informed-consent form, a demographics form, and the validated PHQ-9 and GAD-7. Include them only as flow steps. Never write out or reword PHQ-9 or GAD-7 items, and never put any published clinical scale into "questionnaires".
- Start the flow with consent and end it with debrief.

Tasks (reaction-time paradigms):
- Each trial shows a fixation cross for fixation_ms, then one text stimulus for up to stimulus_ms, and the participant presses one key.
- "keys" lists every response key: a single lowercase letter and what it means.
- "trials" must list every trial explicitly. Each trial has: stimulus (the exact text shown, written in the script of its language, e.g. Tamil in Tamil script), color (a hex colour such as #ef4444 for the text, or "" for the default), correct_key (one of the keys), condition (e.g. congruent / incongruent), and language.
- Balance conditions and correct keys evenly. Use the trial count the researcher asked for; if none is given, use 24. Never exceed ${MAX_TRIALS}.
- "instructions" is what the participant reads before starting, in plain language, and must state the key mapping.

Questionnaires (only for new, study-specific questions):
- "items" are the question texts. "scale_labels" are the response options shared by all items, ordered low to high (e.g. Strongly disagree ... Strongly agree). Use [] for open-text answers.

Also provide:
- title, a one-sentence testable hypothesis, design (e.g. "2 x 2 within-subjects"), and a two-sentence summary for the researcher.
- debrief: a short plain-language explanation of the study's purpose for participants.
- notes: assumptions you made, and anything a human expert must check before data collection (for example, translated stimuli need a native-speaker check; word frequency or length matching).

Write participant-facing text in the language the researcher asks for; default to English. Return only the JSON object.

Researcher's description:
"""
${description}
"""`;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

// The Interactions API returns the model's text inside nested output/step content.
// Collect every text part and use the last one that parses as a JSON object.
function extractPlanJson(data) {
  const texts = [];
  if (typeof data?.output_text === 'string') texts.push(data.output_text);
  const walk = (v, depth) => {
    if (v == null || depth > 8) return;
    if (Array.isArray(v)) {
      v.forEach((x) => walk(x, depth + 1));
      return;
    }
    if (typeof v !== 'object') return;
    if (typeof v.text === 'string' && v.type !== 'thought') texts.push(v.text);
    for (const k of ['outputs', 'output', 'steps', 'content', 'parts']) walk(v[k], depth + 1);
  };
  walk(data, 0);
  for (let i = texts.length - 1; i >= 0; i--) {
    const cleaned = texts[i].trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
    try {
      const parsed = JSON.parse(cleaned);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

const text = (v, max = 4000) => (typeof v === 'string' ? v.slice(0, max) : '');
const clampInt = (v, lo, hi, fallback) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback;
};
const slug = (v, fallback) => text(v, 60).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || fallback;

// Never trust model output: coerce types, cap sizes, drop anything that cannot run.
export function sanitisePlan(raw) {
  const problems = [];

  const tasks = (Array.isArray(raw.tasks) ? raw.tasks : []).slice(0, MAX_TASKS).map((t, i) => {
    const keys = (Array.isArray(t?.keys) ? t.keys : [])
      .map((k) => ({ key: text(k?.key, 8).trim().toLowerCase().slice(0, 1), meaning: text(k?.meaning, 80) }))
      .filter((k) => /^[a-z0-9]$/.test(k.key));
    const valid = new Set(keys.map((k) => k.key));
    const allTrials = Array.isArray(t?.trials) ? t.trials : [];
    const trials = allTrials
      .slice(0, MAX_TRIALS)
      .map((r) => ({
        stimulus: text(r?.stimulus, 200),
        color: /^#[0-9a-fA-F]{6}$/.test(text(r?.color, 9).trim()) ? text(r.color, 9).trim() : '',
        correct_key: text(r?.correct_key, 8).trim().toLowerCase().slice(0, 1),
        condition: text(r?.condition, 60),
        language: text(r?.language, 40),
      }))
      .filter((r) => r.stimulus && valid.has(r.correct_key));
    if (trials.length < Math.min(allTrials.length, MAX_TRIALS)) {
      problems.push(`${allTrials.length - trials.length} trial(s) in "${text(t?.name, 80)}" were dropped because they had no stimulus or an unknown response key.`);
    }
    return {
      id: slug(t?.id, `task_${i + 1}`),
      name: text(t?.name, 120) || `Task ${i + 1}`,
      description: text(t?.description, 600),
      domain: DOMAINS.includes(t?.domain) ? t.domain : 'attention',
      instructions: text(t?.instructions, 1500),
      fixation_ms: clampInt(t?.fixation_ms, 0, 5000, 500),
      stimulus_ms: clampInt(t?.stimulus_ms, 200, 20000, 2500),
      keys,
      trials,
    };
  }).filter((t) => t.keys.length >= 2 && t.trials.length > 0);

  const questionnaires = (Array.isArray(raw.questionnaires) ? raw.questionnaires : [])
    .slice(0, MAX_QUESTIONNAIRES)
    .map((q, i) => ({
      id: slug(q?.id, `questionnaire_${i + 1}`),
      name: text(q?.name, 120) || `Questionnaire ${i + 1}`,
      description: text(q?.description, 600),
      intro: text(q?.intro, 800),
      scale_labels: (Array.isArray(q?.scale_labels) ? q.scale_labels : []).map((s) => text(s, 80)).filter(Boolean).slice(0, 11),
      items: (Array.isArray(q?.items) ? q.items : []).map((s) => text(s, 400)).filter(Boolean).slice(0, MAX_ITEMS),
    }))
    .filter((q) => q.items.length > 0);

  const taskIds = new Set(tasks.map((t) => t.id));
  const qIds = new Set(questionnaires.map((q) => q.id));
  let flow = (Array.isArray(raw.flow) ? raw.flow : [])
    .map((s) => ({ step: text(s?.step, 20), ref: slug(s?.ref, '') }))
    .filter((s) => FLOW_STEPS.includes(s.step))
    .filter((s) => (s.step === 'task' ? taskIds.has(s.ref) : s.step === 'questionnaire' ? qIds.has(s.ref) : true))
    .map((s) => (s.step === 'task' || s.step === 'questionnaire' ? s : { step: s.step, ref: '' }));

  // Anything the model defined but forgot to place still runs.
  for (const t of tasks) if (!flow.some((s) => s.step === 'task' && s.ref === t.id)) flow.push({ step: 'task', ref: t.id });
  for (const q of questionnaires) if (!flow.some((s) => s.step === 'questionnaire' && s.ref === q.id)) flow.push({ step: 'questionnaire', ref: q.id });

  // Ethics is enforced in code, not left to the model: consent first, debrief last, exactly once each.
  flow = flow.filter((s) => s.step !== 'consent' && s.step !== 'debrief');
  flow = [{ step: 'consent', ref: '' }, ...flow, { step: 'debrief', ref: '' }];

  if (flow.length === 2) return { plan: null, problems: ['The model returned no runnable task or questionnaire.'] };

  return {
    plan: {
      title: text(raw.title, 160) || 'Untitled study',
      hypothesis: text(raw.hypothesis, 600),
      design: text(raw.design, 200),
      summary: text(raw.summary, 1000),
      debrief: text(raw.debrief, 1500),
      flow,
      tasks,
      questionnaires,
      notes: [...(Array.isArray(raw.notes) ? raw.notes : []).map((n) => text(n, 400)).filter(Boolean).slice(0, 12), ...problems],
    },
    problems,
  };
}

async function callGemini({ apiKey, base, model, prompt, withSchema }) {
  const body = { model, input: prompt };
  body.response_format = withSchema
    ? { type: 'text', mime_type: 'application/json', schema: PLAN_SCHEMA }
    : { type: 'text', mime_type: 'application/json' };
  const res = await fetch(`${base}/v1beta/interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify(body),
  });
  const raw = await res.text();
  let data = null;
  try {
    data = JSON.parse(raw);
  } catch {
    // leave data null
  }
  return { ok: res.ok, status: res.status, data, raw };
}

export async function handleCopilot(request, env = {}) {
  const apiKey = env.GEMINI_API_KEY;
  const model = env.GEMINI_MODEL || DEFAULT_MODEL;
  const base = (env.GEMINI_API_BASE || DEFAULT_BASE).replace(/\/+$/, '');

  if (request.method === 'GET') return json({ configured: Boolean(apiKey), model });
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  if (!apiKey) {
    return json({ error: 'Gemini is not configured on this server. Set GEMINI_API_KEY and restart.', code: 'not_configured' }, 503);
  }

  let description = '';
  try {
    const body = await request.json();
    description = typeof body?.description === 'string' ? body.description.trim() : '';
  } catch {
    return json({ error: 'Request body must be JSON.' }, 400);
  }
  if (description.length < 10) return json({ error: 'Describe the study in at least a sentence.' }, 400);
  if (description.length > MAX_PROMPT_CHARS) return json({ error: `Keep the description under ${MAX_PROMPT_CHARS} characters.` }, 400);

  const prompt = buildPrompt(description);
  let result;
  try {
    result = await callGemini({ apiKey, base, model, prompt, withSchema: true });
    // A 400 here usually means the schema was rejected as too complex; the prompt alone still asks for JSON.
    if (result.status === 400) result = await callGemini({ apiKey, base, model, prompt, withSchema: false });
  } catch (err) {
    return json({ error: `Could not reach Gemini: ${err?.message || err}`, code: 'network' }, 502);
  }

  if (!result.ok) {
    const message = result.data?.error?.message || result.raw.slice(0, 300) || `HTTP ${result.status}`;
    return json({ error: `Gemini returned an error (${result.status}): ${message}`, code: 'upstream' }, 502);
  }

  const rawPlan = extractPlanJson(result.data);
  if (!rawPlan) return json({ error: 'Gemini replied, but not with a study plan. Try rephrasing the description.', code: 'bad_output' }, 502);

  const { plan, problems } = sanitisePlan(rawPlan);
  if (!plan) return json({ error: problems[0], code: 'bad_output' }, 502);

  return json({ plan, model });
}

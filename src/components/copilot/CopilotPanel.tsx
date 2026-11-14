"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Loader2, AlertTriangle, ArrowRight, Play, ShieldCheck, RotateCcw } from "lucide-react";
import { useStimulxStore } from "@/lib/store";
import { DEFAULT_QUESTIONNAIRES, DEFAULT_TASKS } from "@/lib/gorillaTemplates";
import { assembleStudy, CopilotPlan, FLOW_LABELS } from "@/lib/copilotAssemble";

interface CopilotPanelProps {
  onToast: (msg: string) => void;
  onLoaded: () => void;
  onPreview: () => void;
}

const EXAMPLES = [
  "A Tamil–English Stroop task with 24 trials for bilingual college students, with PHQ-9 before the task.",
  "A Hindi emotional word categorisation task: participants press F for positive words and J for negative words, 32 trials, followed by GAD-7.",
  "An Eriksen flanker task with arrow stimuli, 40 trials, plus a short 6-item questionnaire on smartphone use rated never to always.",
];

type Status = { configured: boolean; model: string } | null;

export function CopilotPanel({ onToast, onLoaded, onPreview }: CopilotPanelProps) {
  const { updateActiveProject } = useStimulxStore();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<CopilotPlan | null>(null);
  const [model, setModel] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [loadedIntoProject, setLoadedIntoProject] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/copilot")
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => {
        if (!cancelled && s && typeof s.configured === "boolean") setStatus(s);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const generate = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setPlan(null);
    setLoadedIntoProject(false);
    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.plan) {
        setError(data?.error || `The Copilot service did not respond (HTTP ${res.status}).`);
        return;
      }
      setPlan(data.plan as CopilotPlan);
      setModel(data.model || "");
    } catch {
      setError("Could not reach the Copilot service. Check that the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const loadIntoProject = () => {
    if (!plan) return;
    const study = assembleStudy(plan);
    updateActiveProject((prev) => ({
      ...prev,
      name: plan.title,
      hypothesis: plan.hypothesis || prev.hypothesis,
      tree: study.tree,
      tasks: [...study.tasks, ...(prev.tasks || DEFAULT_TASKS)],
      questionnaires: [...study.questionnaires, ...(prev.questionnaires || DEFAULT_QUESTIONNAIRES)],
      updatedAt: new Date().toISOString(),
    }));
    setLoadedIntoProject(true);
    onToast("Study loaded into the flow canvas ✓");
  };

  const totalTrials = plan ? plan.tasks.reduce((n, t) => n + t.trials.length, 0) : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 select-text">
      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h1 className="text-lg font-bold text-slate-900">Stimulx Copilot</h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              Powered by Gemini
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Describe your study in plain words. Copilot drafts the full participant flow, the trial list and any
            new questions, ready to run and edit.
          </p>
        </div>

        {status && !status.configured && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              Gemini is not connected on this server yet. Set <code className="font-mono">GEMINI_API_KEY</code> and
              restart to enable generation.
            </span>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <label htmlFor="copilot-description" className="text-xs font-semibold text-slate-700">
            Describe your study
          </label>
          <textarea
            id="copilot-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="e.g. A Tamil–English Stroop task with 24 trials for bilingual college students, with PHQ-9 before the task."
            className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setDescription(ex)}
                className="text-left text-xs text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-800 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-slate-500">{description.length}/2000</span>
            <button
              type="button"
              onClick={generate}
              disabled={loading || description.trim().length < 10}
              className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{loading ? "Designing your study…" : "Generate study"}</span>
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {plan && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{plan.title}</h2>
                  {plan.design && <p className="text-xs font-semibold text-purple-700 mt-0.5">{plan.design}</p>}
                </div>
                <span className="shrink-0 text-[11px] text-slate-500">
                  AI draft{model ? ` · ${model}` : ""} · review before use
                </span>
              </div>
              {plan.summary && <p className="text-sm text-slate-700">{plan.summary}</p>}
              {plan.hypothesis && (
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Hypothesis: </span>
                  {plan.hypothesis}
                </p>
              )}

              <div>
                <h3 className="text-xs font-semibold text-slate-700 mb-2">Participant flow</h3>
                <ol className="flex flex-wrap items-center gap-1.5">
                  {plan.flow.map((s, i) => {
                    const name =
                      s.step === "task"
                        ? plan.tasks.find((t) => t.id === s.ref)?.name
                        : s.step === "questionnaire"
                        ? plan.questionnaires.find((q) => q.id === s.ref)?.name
                        : FLOW_LABELS[s.step];
                    return (
                      <li key={`${s.step}-${i}`} className="flex items-center gap-1.5">
                        <span className="text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-800">
                          {i + 1}. {name || FLOW_LABELS[s.step]}
                        </span>
                        {i < plan.flow.length - 1 && <ArrowRight className="w-3 h-3 text-slate-400" />}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {plan.tasks.map((t) => (
              <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-900">{t.name}</h3>
                  <span className="text-xs text-slate-500 shrink-0">
                    {t.trials.length} trials · fixation {t.fixation_ms} ms · stimulus {t.stimulus_ms} ms
                  </span>
                </div>
                {t.description && <p className="text-sm text-slate-600">{t.description}</p>}
                <div className="flex flex-wrap gap-1.5">
                  {t.keys.map((k) => (
                    <span key={k.key} className="text-xs rounded-md bg-slate-100 px-2 py-1 text-slate-700">
                      <kbd className="font-mono font-bold">{k.key.toUpperCase()}</kbd> = {k.meaning}
                    </span>
                  ))}
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="text-left font-semibold px-3 py-2">#</th>
                        <th className="text-left font-semibold px-3 py-2">Stimulus</th>
                        <th className="text-left font-semibold px-3 py-2">Condition</th>
                        <th className="text-left font-semibold px-3 py-2">Language</th>
                        <th className="text-left font-semibold px-3 py-2">Correct key</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.trials.slice(0, 8).map((r, i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="px-3 py-1.5 text-slate-500">{i + 1}</td>
                          <td className="px-3 py-1.5">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                              {r.color && (
                                <span
                                  aria-hidden
                                  className="inline-block w-2.5 h-2.5 rounded-full border border-slate-300"
                                  style={{ backgroundColor: r.color }}
                                />
                              )}
                              {r.stimulus}
                            </span>
                          </td>
                          <td className="px-3 py-1.5 text-slate-700">{r.condition}</td>
                          <td className="px-3 py-1.5 text-slate-700">{r.language}</td>
                          <td className="px-3 py-1.5 font-mono text-slate-700">{r.correct_key.toUpperCase()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {t.trials.length > 8 && (
                  <p className="text-[11px] text-slate-500">Showing 8 of {t.trials.length} trials. The full list opens in the task spreadsheet.</p>
                )}
              </div>
            ))}

            {plan.questionnaires.map((q) => (
              <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-900">{q.name}</h3>
                  <span className="text-xs text-slate-500 shrink-0">{q.items.length} items · new, not validated</span>
                </div>
                {q.scale_labels.length > 0 && (
                  <p className="text-xs text-slate-600">Response scale: {q.scale_labels.join(" · ")}</p>
                )}
                <ol className="list-decimal pl-5 text-sm text-slate-700 space-y-0.5">
                  {q.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ol>
              </div>
            ))}

            {plan.notes.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-2">
                <h3 className="text-sm font-bold text-amber-900">Check before collecting data</h3>
                <ul className="list-disc pl-5 text-sm text-amber-900 space-y-0.5">
                  {plan.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-start gap-2 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Consent comes first and the debrief with helplines comes last in every generated study. PHQ-9 and
                GAD-7 come from the built-in library and are scored by fixed rules, never by the model.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pb-6">
              {!loadedIntoProject ? (
                <button
                  type="button"
                  onClick={loadIntoProject}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
                >
                  <span>Use this study ({totalTrials} trials)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onPreview}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
                  >
                    <Play className="w-4 h-4" />
                    <span>Run as participant</span>
                  </button>
                  <button
                    type="button"
                    onClick={onLoaded}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    <span>Open in flow canvas</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={generate}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

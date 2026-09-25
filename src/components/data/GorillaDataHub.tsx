'use client';

import React, { useState } from 'react';
import {
  Users,
  Download,
  Share2,
  ExternalLink,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Smartphone,
  Monitor,
  Copy,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Search,
  Filter,
  X,
  Play,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { StudyProject, LiveParticipantSession, GorillaRawTrialLog } from '@/types';
import { useStimulxStore } from '@/lib/store';
import {
  downloadFile,
  generateGorillaLongFormatCSV,
  generateQuestionnaireResponsesCSV,
  generateParticipantSummaryCSV,
  generateRScript,
  generateSPSSSyntax,
} from '@/lib/exportUtils';

interface GorillaDataHubProps {
  onToast: (msg: string) => void;
  onLaunchRunner?: () => void;
}

export function GorillaDataHub({ onToast, onLaunchRunner }: GorillaDataHubProps) {
  const {
    activeProject,
    simulateParticipants,
    deleteParticipantSession,
    deleteLiveSession,
  } = useStimulxStore();

  const [selectedSessionForInspection, setSelectedSessionForInspection] = useState<any | null>(null);
  const [filterState, setFilterState] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [generatedTokens, setGeneratedTokens] = useState<string[]>([]);

  const studyUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/?run=${activeProject.id}`
      : `https://stimulx.in/?run=${activeProject.id}`;

  const copyLink = (url: string) => {
    navigator.clipboard?.writeText(url);
    onToast('Copied link to clipboard ✓');
  };

  const handleGenerateNewTokenLink = () => {
    const newToken = `PT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedTokens([newToken, ...generatedTokens]);
    const tokenUrl = `${studyUrl}&token=${newToken}`;
    navigator.clipboard?.writeText(tokenUrl);
    onToast(`Generated token ${newToken} and copied participant link! ✓`);
  };

  // Combine liveSessions and legacy sessions
  const liveSessions = activeProject.liveSessions || [];
  const legacySessions = activeProject.sessions || [];

  const totalSessionsCount = liveSessions.length + legacySessions.length;
  const targetN = activeProject.targetSampleSize || 100;
  const progressPct = Math.min(100, Math.round((totalSessionsCount / targetN) * 100));

  // Downloads
  const handleExportGorillaRawCsv = () => {
    const csv = generateGorillaLongFormatCSV(liveSessions, legacySessions);
    downloadFile(`${activeProject.id}_raw_trials.csv`, csv, 'text/csv;charset=utf-8');
    onToast('Downloaded tidy long-format raw CSV ✓');
  };

  const handleExportQuestionnairesCsv = () => {
    const csv = generateQuestionnaireResponsesCSV(liveSessions);
    downloadFile(`${activeProject.id}_questionnaire_responses.csv`, csv, 'text/csv;charset=utf-8');
    onToast('Downloaded questionnaire response CSV ✓');
  };

  const handleExportSummaryCsv = () => {
    const csv = generateParticipantSummaryCSV(liveSessions, legacySessions);
    downloadFile(`${activeProject.id}_participants_summary.csv`, csv, 'text/csv;charset=utf-8');
    onToast('Downloaded participant summary CSV ✓');
  };

  const handleExportR = () => {
    const r = generateRScript(activeProject.name, `${activeProject.id}_raw_trials.csv`);
    downloadFile(`${activeProject.id}_analysis.R`, r, 'text/plain;charset=utf-8');
    onToast('Downloaded reproducible R script (tidyverse / lme4) ✓');
  };

  const handleExportSPSS = () => {
    const spss = generateSPSSSyntax(`${activeProject.id}_raw_trials.csv`);
    downloadFile(`${activeProject.id}_analysis.sps`, spss, 'text/plain;charset=utf-8');
    onToast('Downloaded SPSS syntax (.sps) ✓');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white text-slate-900 overflow-y-auto p-6 md:p-8 space-y-6">
      {/* Session Inspection Modal */}
      {selectedSessionForInspection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] text-white border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Participant Session Inspector
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Token: {selectedSessionForInspection.participantToken || selectedSessionForInspection.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSessionForInspection(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Demographics & Summary Pills */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">State / Cohort</div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    {selectedSessionForInspection.demographics?.state || 'Unknown'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Device Mode</div>
                  <div className="text-xs font-bold text-white mt-0.5 capitalize">
                    {selectedSessionForInspection.demographics?.device || 'desktop'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Trials Logged</div>
                  <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                    {selectedSessionForInspection.rawTrialLogs?.length ||
                      selectedSessionForInspection.trials?.length ||
                      0}{' '}
                    trials
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Status</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5 capitalize">
                    {selectedSessionForInspection.status || 'completed'}
                  </div>
                </div>
              </div>

              {/* Raw Trials Event Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Trial-by-Trial Event Log (Tidy Long Format)
                </h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 sticky top-0">
                      <tr>
                        <th className="py-2 px-3">#</th>
                        <th className="py-2 px-3">Display</th>
                        <th className="py-2 px-3">Response</th>
                        <th className="py-2 px-3">Correct</th>
                        <th className="py-2 px-3">RT (ms)</th>
                        <th className="py-2 px-3">Spreadsheet Attributes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {(
                        selectedSessionForInspection.rawTrialLogs ||
                        selectedSessionForInspection.trials ||
                        []
                      ).map((t: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-900/50">
                          <td className="py-1.5 px-3 text-slate-500">{t.trialIndex || idx + 1}</td>
                          <td className="py-1.5 px-3 text-slate-300">{t.displayName || 'Stimulus'}</td>
                          <td className="py-1.5 px-3 text-purple-400">{t.response || 'none'}</td>
                          <td className="py-1.5 px-3">
                            {t.correct ? (
                              <span className="text-emerald-400 font-bold">1 (True)</span>
                            ) : (
                              <span className="text-red-400 font-bold">0 (False)</span>
                            )}
                          </td>
                          <td className="py-1.5 px-3 text-slate-200">{(t.rtMs || t.rt || 0).toFixed(1)}</td>
                          <td className="py-1.5 px-3 text-slate-400 truncate max-w-xs">
                            {t.spreadsheetRow
                              ? Object.entries(t.spreadsheetRow)
                                  .map(([k, v]) => `${k}:${v}`)
                                  .join(', ')
                              : `word:${t.word}, color:${t.colorName}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-purple-600 mb-1">
            Data Collection & Participant Engine
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Research Data Hub & Deployment Center
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Generate participant recruitment tokens · Inspect raw trial event streams · Export tidy research data
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => simulateParticipants(5)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Simulate +5 Cohorts
          </button>

          {onLaunchRunner && (
            <button
              onClick={onLaunchRunner}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#e8852b] hover:bg-[#d0731f] text-white text-xs font-bold transition-all shadow-md shadow-[#e8852b]/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Launch Live Runner
            </button>
          )}
        </div>
      </div>

      {/* Recruitment & Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Sample Target Progress */}
        <div className="bg-white rounded-2xl p-5 border border-[#1a1633]/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b6890]">
              Recruitment Progress
            </span>
            <span className="text-xs font-mono font-bold text-[#e8852b]">
              {totalSessionsCount} / {targetN} (N)
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#f5f3ef] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#e8852b] transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#6b6890]">
            <span>{progressPct}% Completed</span>
            <span>{Math.max(0, targetN - totalSessionsCount)} slots open</span>
          </div>
        </div>

        {/* Public Share Link Card */}
        <div className="bg-white rounded-2xl p-5 border border-[#1a1633]/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b6890]">
              Public Participant Link
            </span>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Live & Active
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#f5f3ef] p-2 rounded-xl border border-[#1a1633]/10">
            <span className="text-xs font-mono text-[#1a1633] truncate flex-1 select-all">
              {studyUrl}
            </span>
            <button
              onClick={() => copyLink(studyUrl)}
              className="p-1 rounded hover:bg-white text-[#e8852b]"
              title="Copy study URL"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-[#6b6890]">
            Distribute via WhatsApp, SMS, or university mailing lists.
          </p>
        </div>

        {/* Tokenized Link Generator */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Tokenized Recruitment
            </span>
            <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Tidy Standard
            </span>
          </div>

          <button
            onClick={handleGenerateNewTokenLink}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Generate Unique Participant Token
          </button>

          <p className="text-[11px] text-slate-500">
            Creates a cryptographic single-use link for paid subject pools.
          </p>
        </div>
      </div>

      {/* Export Toolbar */}
      <div className="bg-white border border-slate-200 text-slate-900 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
            Raw Data Export Center
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Download Tidy Research Datasets
          </h3>
          <p className="text-xs text-slate-500">
            Export microsecond reaction times, trial spreadsheets, and questionnaire logs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportGorillaRawCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Tidy Raw CSV
          </button>
          <button
            onClick={handleExportQuestionnairesCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            Questionnaires CSV
          </button>
          <button
            onClick={handleExportSummaryCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
          >
            <Users className="w-3.5 h-3.5" />
            Summary CSV
          </button>
          <button
            onClick={handleExportR}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
          >
            R Script (.R)
          </button>
          <button
            onClick={handleExportSPSS}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
          >
            SPSS (.sps)
          </button>
        </div>
      </div>

      {/* Recorded Participant Sessions Table */}
      <div className="bg-white rounded-2xl border border-[#1a1633]/10 shadow-sm overflow-hidden space-y-0">
        <div className="p-4 border-b border-[#1a1633]/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#e8852b]" />
            <h3 className="text-sm font-bold text-[#1a1633]">
              Recorded Participant Sessions ({totalSessionsCount})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search token / state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 text-xs bg-[#f5f3ef] border border-[#1a1633]/15 rounded-lg focus:outline-none focus:border-[#e8852b]"
            />
          </div>
        </div>

        {totalSessionsCount === 0 ? (
          <div className="p-12 text-center text-[#6b6890] space-y-3">
            <Users className="w-8 h-8 mx-auto text-[#6b6890]/50" />
            <div className="text-sm font-semibold">No participant sessions recorded yet</div>
            <p className="text-xs max-w-sm mx-auto">
              Share your participant link or click "Simulate +5 Cohorts" to test data collection.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f5f3ef] text-[#6b6890] uppercase font-bold text-[10px] tracking-wider border-b border-[#1a1633]/10">
                  <th className="py-3 px-4">Participant Token</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Cohort State</th>
                  <th className="py-3 px-4">Device</th>
                  <th className="py-3 px-4">Trials / Accuracy</th>
                  <th className="py-3 px-4">Mean RT</th>
                  <th className="py-3 px-4">Scores</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1633]/10 font-medium">
                {/* Live Sessions */}
                {liveSessions.map((s) => {
                  const trials = s.rawTrialLogs || [];
                  const correct = trials.filter((t) => t.correct).length;
                  const acc = trials.length > 0 ? (correct / trials.length) * 100 : 0;
                  const meanRt = trials.length > 0 ? trials.reduce((a, b) => a + b.rtMs, 0) / trials.length : 0;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#1a1633]">
                        {s.participantToken}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            s.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#1a1633]">
                        {s.demographics?.state || 'Karnataka'}
                      </td>
                      <td className="py-3 px-4 text-[#6b6890] capitalize">
                        {s.demographics?.device || 'desktop'}
                      </td>
                      <td className="py-3 px-4">
                        {trials.length} trials ({acc.toFixed(0)}%)
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold">
                        {meanRt.toFixed(0)} ms
                      </td>
                      <td className="py-3 px-4 text-[#6b6890] font-mono text-[11px]">
                        {s.overallScores
                          ? Object.entries(s.overallScores)
                              .map(([k, v]) => `${k}:${v}`)
                              .join(', ') || 'N/A'
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedSessionForInspection(s)}
                            className="p-1 rounded hover:bg-slate-200 text-[#1a1633]"
                            title="Inspect trial events"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteLiveSession(s.id)}
                            className="p-1 rounded hover:bg-red-50 text-red-500"
                            title="Delete session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Legacy Sessions */}
                {legacySessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1a1633]">{s.id}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        completed
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#1a1633]">{s.demographics.state}</td>
                    <td className="py-3 px-4 text-[#6b6890] capitalize">
                      {s.demographics.device}
                    </td>
                    <td className="py-3 px-4">
                      {s.summary.totalTrials} trials ({s.summary.accuracyPct.toFixed(0)}%)
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      {s.summary.meanCongruentRT.toFixed(0)} ms
                    </td>
                    <td className="py-3 px-4 text-[#6b6890] font-mono text-[11px]">
                      {s.clinicalScores?.phq9 !== undefined
                        ? `PHQ-9=${s.clinicalScores.phq9}`
                        : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedSessionForInspection(s)}
                          className="p-1 rounded hover:bg-slate-200 text-[#1a1633]"
                          title="Inspect trial events"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteParticipantSession(s.id)}
                          className="p-1 rounded hover:bg-red-50 text-red-500"
                          title="Delete session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

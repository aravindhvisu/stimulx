'use client';

import React, { useState } from 'react';
import { Globe, Copy, RefreshCw, Lock, Unlock, UploadCloud, AlertTriangle, KeyRound, Trash2 } from 'lucide-react';
import { useStimulxStore } from '@/lib/store';
import {
  StudyApiError,
  definitionHash,
  deletePublishedStudy,
  fetchSessions,
  participantLink,
  publishProblems,
  publishStudy,
  republishStudy,
  setStudyStatus,
} from '@/lib/studyApi';
import { LiveParticipantSession, PublishedStudyInfo } from '@/types';

interface PublishStudyPanelProps {
  onToast: (msg: string) => void;
}

// Publish the active study to the Stimulx server, share its participant link,
// and pull the responses participants submitted back into this workspace.
export function PublishStudyPanel({ onToast }: PublishStudyPanelProps) {
  const { activeProject, updateActiveProject } = useStimulxStore();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  const published = activeProject.published;
  const problems = publishProblems(activeProject);
  const hasUnpublishedChanges = !!published && published.contentHash !== definitionHash(activeProject);
  const remoteCount = (activeProject.liveSessions || []).filter((s) => s.source === 'remote').length;

  const savePublished = (info: PublishedStudyInfo | undefined) =>
    updateActiveProject((prev) => ({ ...prev, published: info, updatedAt: new Date().toISOString() }));

  const run = async (label: string, action: () => Promise<void>) => {
    setBusy(label);
    setError(null);
    try {
      await action();
    } catch (e) {
      const err = e as StudyApiError;
      setError(
        err.code === 'not_configured'
          ? 'Study hosting is not set up on this server yet, so studies cannot be published from here. See "Study hosting" in the README.'
          : err.status === 404
            ? 'This study no longer exists on the server.'
            : err.message || 'Something went wrong.'
      );
    } finally {
      setBusy(null);
    }
  };

  const handlePublish = () =>
    run('publish', async () => {
      const info = await publishStudy(activeProject);
      savePublished(info);
      onToast('Study published. Share the participant link.');
    });

  const handleRepublish = () =>
    run('republish', async () => {
      if (!published) return;
      savePublished(await republishStudy(activeProject, published));
      onToast('Published study updated. New participants get this version.');
    });

  const handleToggle = () =>
    run('status', async () => {
      if (!published) return;
      const next = await setStudyStatus(published, published.status === 'open' ? 'closed' : 'open');
      savePublished(next);
      onToast(next.status === 'open' ? 'Study reopened for responses.' : 'Study closed. The link no longer accepts responses.');
    });

  const handleSync = () =>
    run('sync', async () => {
      if (!published) return;
      const remote = await fetchSessions(published);
      let added = 0;
      updateActiveProject((prev) => {
        const known = new Set((prev.liveSessions || []).map((s) => s.id));
        const fresh: LiveParticipantSession[] = remote.filter((s) => !known.has(s.id));
        added = fresh.length;
        return {
          ...prev,
          liveSessions: [...fresh.reverse(), ...(prev.liveSessions || [])],
          published: prev.published ? { ...prev.published, lastSyncAt: new Date().toISOString() } : prev.published,
          updatedAt: new Date().toISOString(),
        };
      });
      onToast(added > 0 ? `${added} new response${added === 1 ? '' : 's'} downloaded.` : 'No new responses yet.');
    });

  const handleDelete = () => {
    if (!published) return;
    const ok = window.confirm(
      'Delete this study from the server?\n\nThe participant link stops working and every response stored on the server is erased. Responses already downloaded to this browser are kept.'
    );
    if (!ok) return;
    void run('delete', async () => {
      await deletePublishedStudy(published);
      savePublished(undefined);
      onToast('Study and its server-side responses deleted.');
    });
  };

  const copy = (text: string, msg: string) => {
    navigator.clipboard?.writeText(text);
    onToast(msg);
  };

  const link = published ? participantLink(published.id) : '';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Collect responses online</h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
              {published
                ? 'Anyone with the participant link can take this study on their own phone or computer. Their responses are stored on the Stimulx server until you download them here.'
                : 'Publish this study to get a link participants can open on their own phone or computer. Nothing is shared until you publish.'}
            </p>
          </div>
        </div>
        {published && (
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              published.status === 'open'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {published.status === 'open' ? 'Open for responses' : 'Closed'} · v{published.version}
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2" role="alert">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!published && (
        <>
          {problems.length > 0 && (
            <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <div className="font-bold mb-1">Fix these before publishing:</div>
              <ul className="list-disc pl-4 space-y-0.5">
                {problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={handlePublish}
            disabled={!!busy || problems.length > 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-xs font-bold"
          >
            <UploadCloud className="w-4 h-4" />
            {busy === 'publish' ? 'Publishing…' : 'Publish study'}
          </button>
        </>
      )}

      {published && (
        <>
          <div>
            <label htmlFor="participant-link" className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Participant link
            </label>
            <div className="flex gap-2 mt-1">
              <input
                id="participant-link"
                readOnly
                value={link}
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 min-w-0 text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 select-all"
              />
              <button
                onClick={() => copy(link, 'Participant link copied.')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>
          </div>

          {hasUnpublishedChanges && (
            <div className="flex items-center justify-between gap-3 flex-wrap text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <span>
                You changed this study after publishing. Participants still get the published version (v{published.version}).
                {problems.length > 0 && ` Fix first: ${problems.join(' ')}`}
              </span>
              <button
                onClick={handleRepublish}
                disabled={!!busy || problems.length > 0}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold"
              >
                {busy === 'republish' ? 'Updating…' : 'Publish changes'}
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSync}
              disabled={!!busy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-xs font-bold"
            >
              <RefreshCw className={`w-4 h-4 ${busy === 'sync' ? 'animate-spin' : ''}`} />
              {busy === 'sync' ? 'Checking…' : 'Download new responses'}
            </button>
            <button
              onClick={handleToggle}
              disabled={!!busy}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-xs font-bold text-slate-700"
            >
              {published.status === 'open' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              {published.status === 'open' ? 'Close study' : 'Reopen study'}
            </button>
            <button
              onClick={() => setShowKey((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
            >
              <KeyRound className="w-3.5 h-3.5" /> Researcher key
            </button>
            <button
              onClick={handleDelete}
              disabled={!!busy}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 disabled:opacity-50 text-xs font-bold text-red-700"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete from server
            </button>
          </div>

          <p className="text-xs text-slate-500">
            {remoteCount} online response{remoteCount === 1 ? '' : 's'} downloaded to this browser.
            {published.lastSyncAt ? ` Last checked ${new Date(published.lastSyncAt).toLocaleString()}.` : ' Not checked yet.'}
          </p>

          {showKey && (
            <div className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <p className="text-slate-700">
                This key is the only way to download this study&apos;s responses, and it is stored only in this browser. Save a copy
                somewhere safe: if this browser&apos;s data is cleared, the responses on the server cannot be reached without it.
                Anyone who has the key can read the responses, so do not share it.
              </p>
              <div className="flex gap-2">
                <code className="flex-1 min-w-0 break-all font-mono bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-800">
                  {published.ownerKey}
                </code>
                <button
                  onClick={() => copy(published.ownerKey, 'Researcher key copied. Keep it private.')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white font-bold text-slate-700"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

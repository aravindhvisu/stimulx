'use client';

import React, { useEffect, useState } from 'react';
import { ParticipantRunner } from '@/components/runner/ParticipantRunner';
import { PublicStudy, StudyApiError, fetchPublicStudy, submitSession } from '@/lib/studyApi';
import { StudyProject } from '@/types';

type LoadState =
  | { kind: 'loading' }
  | { kind: 'ready'; study: PublicStudy }
  | { kind: 'closed'; title: string }
  | { kind: 'error'; message: string };

function Notice({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#070b14] text-white p-6">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-xl font-bold">{title}</h1>
        {children && <p className="text-sm text-slate-300 leading-relaxed">{children}</p>}
      </div>
    </div>
  );
}

// What a participant sees when they open a study link (/?study=<id>).
// The study comes from the server; nothing here reads or writes a researcher workspace.
export function PublicStudyRunner({ studyId }: { studyId: string }) {
  const [state, setState] = useState<LoadState>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    fetchPublicStudy(studyId)
      .then((study) => {
        if (cancelled) return;
        if (study.status !== 'open' || !study.definition) setState({ kind: 'closed', title: study.title });
        else setState({ kind: 'ready', study });
      })
      .catch((e: StudyApiError) => {
        if (cancelled) return;
        setState({
          kind: 'error',
          message:
            e.status === 404
              ? 'This study link is not valid. Please check the link you were sent, or ask the researcher for a new one.'
              : e.message,
        });
      });
    return () => {
      cancelled = true;
    };
  }, [studyId]);

  if (state.kind === 'loading') return <Notice title="Loading study…" />;
  if (state.kind === 'closed') {
    return <Notice title="This study is closed">“{state.title}” is no longer accepting responses. Thank you for your interest.</Notice>;
  }
  if (state.kind === 'error') return <Notice title="We could not open this study">{state.message}</Notice>;

  const { study } = state;
  const def = study.definition!;
  // The runner only reads the flow, tasks and questionnaires from the project it is given.
  const project = {
    id: study.id,
    name: study.title,
    tree: def.tree,
    tasks: def.tasks,
    questionnaires: def.questionnaires,
    sessions: [],
    liveSessions: [],
  } as unknown as StudyProject;

  return (
    <ParticipantRunner
      project={project}
      onClose={() => {}}
      remote={{ onSubmit: (session) => submitSession(study.id, study.version, session) }}
    />
  );
}

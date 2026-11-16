// Client for the study hosting API (src/server/studies.mjs).

import {
  ExperimentTree,
  LiveParticipantSession,
  PublishedStudyInfo,
  QuestionnaireDefinition,
  StudyProject,
  TaskDefinition,
} from '@/types';

export interface StudyDefinition {
  tree: ExperimentTree;
  tasks: TaskDefinition[];
  questionnaires: QuestionnaireDefinition[];
}

export interface PublicStudy {
  id: string;
  title: string;
  status: 'open' | 'closed';
  version: number;
  definition?: StudyDefinition;
}

export class StudyApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
  } catch {
    throw new StudyApiError('Could not reach the Stimulx server. Check your internet connection.', 0);
  }
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // Not JSON: a static host with no API answers with an HTML page.
  }
  if (!res.ok || !data) {
    throw new StudyApiError(
      data?.error || 'Study hosting is not available on this server.',
      res.status,
      data?.code || (!data ? 'not_configured' : undefined)
    );
  }
  return data as T;
}

const auth = (ownerKey: string) => ({ Authorization: `Bearer ${ownerKey}` });

// Only what the flow actually uses is published, not the whole task and questionnaire library.
export function definitionForProject(project: StudyProject): StudyDefinition {
  const tree = project.tree || { nodes: [], edges: [] };
  const taskIds = new Set(tree.nodes.map((n) => n.taskId).filter(Boolean));
  const questionnaireIds = new Set(tree.nodes.map((n) => n.questionnaireId).filter(Boolean));
  return {
    tree,
    tasks: (project.tasks || []).filter((t) => taskIds.has(t.id)),
    questionnaires: (project.questionnaires || []).filter((q) => questionnaireIds.has(q.id)),
  };
}

export function definitionHash(project: StudyProject): string {
  const text = JSON.stringify(definitionForProject(project));
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return `${text.length}:${h >>> 0}`;
}

// Reasons a flow cannot be run by a participant, in plain words. Empty means publishable.
export function publishProblems(project: StudyProject): string[] {
  const def = definitionForProject(project);
  const problems: string[] = [];
  const nodes = def.tree.nodes;
  if (!nodes.some((n) => n.type === 'start')) problems.push('The flow has no start step.');
  if (!nodes.some((n) => n.type === 'finish')) problems.push('The flow has no finish step.');
  for (const n of nodes) {
    if (n.type === 'task' && !def.tasks.some((t) => t.id === n.taskId)) problems.push(`"${n.title}" points to a task that no longer exists.`);
    if (n.type === 'questionnaire' && !def.questionnaires.some((q) => q.id === n.questionnaireId)) {
      problems.push(`"${n.title}" points to a questionnaire that no longer exists.`);
    }
  }
  for (const t of def.tasks) {
    if (!t.spreadsheet || t.spreadsheet.length === 0) problems.push(`Task "${t.name}" has no trials.`);
  }
  return problems;
}

export function participantLink(studyId: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://stimulx.in';
  return `${origin}/?study=${studyId}`;
}

export async function publishStudy(project: StudyProject): Promise<PublishedStudyInfo> {
  const r = await call<{ id: string; ownerKey: string; version: number; publishedAt: string }>('/api/studies', {
    method: 'POST',
    body: JSON.stringify({ title: project.name, definition: definitionForProject(project) }),
  });
  return { id: r.id, ownerKey: r.ownerKey, version: r.version, status: 'open', publishedAt: r.publishedAt, contentHash: definitionHash(project) };
}

export async function republishStudy(project: StudyProject, published: PublishedStudyInfo): Promise<PublishedStudyInfo> {
  const r = await call<{ version: number; status: 'open' | 'closed'; updatedAt: string }>(`/api/studies/${published.id}`, {
    method: 'PUT',
    headers: auth(published.ownerKey),
    body: JSON.stringify({ title: project.name, definition: definitionForProject(project) }),
  });
  return { ...published, version: r.version, status: r.status, updatedAt: r.updatedAt, contentHash: definitionHash(project) };
}

export async function setStudyStatus(published: PublishedStudyInfo, status: 'open' | 'closed'): Promise<PublishedStudyInfo> {
  const r = await call<{ status: 'open' | 'closed'; updatedAt: string }>(`/api/studies/${published.id}`, {
    method: 'PUT',
    headers: auth(published.ownerKey),
    body: JSON.stringify({ status }),
  });
  return { ...published, status: r.status, updatedAt: r.updatedAt };
}

export async function deletePublishedStudy(published: PublishedStudyInfo): Promise<void> {
  await call(`/api/studies/${published.id}`, { method: 'DELETE', headers: auth(published.ownerKey) });
}

export async function fetchPublicStudy(studyId: string): Promise<PublicStudy> {
  return call<PublicStudy>(`/api/studies/${encodeURIComponent(studyId)}`);
}

export async function submitSession(studyId: string, studyVersion: number, session: LiveParticipantSession): Promise<void> {
  await call(`/api/studies/${encodeURIComponent(studyId)}/sessions`, {
    method: 'POST',
    body: JSON.stringify({ studyVersion, session }),
  });
}

export async function fetchSessions(published: PublishedStudyInfo): Promise<LiveParticipantSession[]> {
  const r = await call<{ sessions: LiveParticipantSession[] }>(`/api/studies/${published.id}/sessions`, {
    headers: auth(published.ownerKey),
  });
  return r.sessions.map((s) => ({ ...s, source: 'remote' as const }));
}

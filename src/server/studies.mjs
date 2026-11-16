// Stimulx study hosting API: publish a study, let participants on any device take it,
// and return their sessions to the researcher who published it.
//
// Runs unchanged on the Cloudflare Worker (D1) and on the Node server (node:sqlite).
// `db` is a small adapter: run(sql, params), first(sql, params), all(sql, params), exec(sql).
//
//   POST   /api/studies                 publish            -> { id, ownerKey, version }
//   GET    /api/studies/:id             public definition (participants)
//   PUT    /api/studies/:id             republish / open / close        (owner key)
//   DELETE /api/studies/:id             delete study and its sessions   (owner key)
//   POST   /api/studies/:id/sessions    participant submits a completed session
//   GET    /api/studies/:id/sessions    all sessions                    (owner key)
//
// The owner key is shown once at publish time and only its SHA-256 hash is stored.

const MAX_DEFINITION_BYTES = 1_500_000;
const MAX_SESSION_BYTES = 1_000_000;
const MAX_SESSIONS_PER_STUDY = 20_000;
const ID_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS studies (
    id TEXT PRIMARY KEY,
    owner_hash TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    version INTEGER NOT NULL DEFAULT 1,
    definition TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS study_sessions (
    study_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    study_version INTEGER NOT NULL,
    received_at TEXT NOT NULL,
    data TEXT NOT NULL,
    PRIMARY KEY (study_id, session_id)
  )`,
];

const schemaReady = new WeakSet();

async function ensureSchema(db) {
  if (schemaReady.has(db)) return;
  for (const sql of SCHEMA) await db.run(sql.replace(/\s+/g, ' '), []);
  schemaReady.add(db);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function randomId(length) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let out = '';
  for (const b of bytes) out += ID_ALPHABET[b % ID_ALPHABET.length];
  return out;
}

function randomKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return 'stx_' + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

function sameString(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function isOwner(request, study) {
  const header = request.headers.get('authorization') || '';
  const key = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!key) return false;
  return sameString(await sha256Hex(key), study.owner_hash);
}

async function readJson(request, maxBytes) {
  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxBytes) return { error: 'too_large' };
  try {
    return { value: JSON.parse(text) };
  } catch {
    return { error: 'bad_json' };
  }
}

// A definition must at least be a tree the runner can walk.
function checkDefinition(def) {
  if (!def || typeof def !== 'object') return 'Study definition is missing.';
  const nodes = def.tree && Array.isArray(def.tree.nodes) ? def.tree.nodes : null;
  if (!nodes || nodes.length < 2) return 'The study flow is empty.';
  if (!nodes.some((n) => n && n.type === 'start')) return 'The study flow has no start node.';
  if (!nodes.some((n) => n && n.type === 'finish')) return 'The study flow has no finish node.';
  if (!Array.isArray(def.tasks) || !Array.isArray(def.questionnaires)) return 'Tasks or questionnaires are missing.';
  return null;
}

function cleanTitle(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 200) || 'Untitled study';
}

async function publish(request, db) {
  const body = await readJson(request, MAX_DEFINITION_BYTES);
  if (body.error === 'too_large') return json({ error: 'This study is too large to publish.' }, 413);
  if (body.error) return json({ error: 'Request body is not valid JSON.' }, 400);
  const problem = checkDefinition(body.value.definition);
  if (problem) return json({ error: problem }, 400);

  const id = randomId(10);
  const ownerKey = randomKey();
  const now = new Date().toISOString();
  await db.run(
    'INSERT INTO studies (id, owner_hash, title, status, version, definition, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, await sha256Hex(ownerKey), cleanTitle(body.value.title), 'open', 1, JSON.stringify(body.value.definition), now, now]
  );
  return json({ id, ownerKey, version: 1, status: 'open', publishedAt: now }, 201);
}

async function update(request, db, study) {
  const body = await readJson(request, MAX_DEFINITION_BYTES);
  if (body.error === 'too_large') return json({ error: 'This study is too large to publish.' }, 413);
  if (body.error) return json({ error: 'Request body is not valid JSON.' }, 400);
  const { definition, title, status } = body.value;

  let version = study.version;
  let definitionText = study.definition;
  if (definition !== undefined) {
    const problem = checkDefinition(definition);
    if (problem) return json({ error: problem }, 400);
    definitionText = JSON.stringify(definition);
    version += 1;
  }
  if (status !== undefined && status !== 'open' && status !== 'closed') {
    return json({ error: 'Status must be "open" or "closed".' }, 400);
  }
  const now = new Date().toISOString();
  const nextStatus = status || study.status;
  const nextTitle = title !== undefined ? cleanTitle(title) : study.title;
  await db.run('UPDATE studies SET title = ?, status = ?, version = ?, definition = ?, updated_at = ? WHERE id = ?', [
    nextTitle,
    nextStatus,
    version,
    definitionText,
    now,
    study.id,
  ]);
  return json({ id: study.id, version, status: nextStatus, title: nextTitle, updatedAt: now });
}

async function submitSession(request, db, study) {
  if (study.status !== 'open') return json({ error: 'This study is closed and is not accepting responses.' }, 403);
  const body = await readJson(request, MAX_SESSION_BYTES);
  if (body.error === 'too_large') return json({ error: 'Session data is too large.' }, 413);
  if (body.error) return json({ error: 'Request body is not valid JSON.' }, 400);

  const session = body.value.session;
  if (!session || typeof session !== 'object' || typeof session.id !== 'string' || !/^[\w-]{6,80}$/.test(session.id)) {
    return json({ error: 'Session data is missing or malformed.' }, 400);
  }
  if (!Array.isArray(session.rawTrialLogs) || !Array.isArray(session.questionnaireLogs)) {
    return json({ error: 'Session data is missing or malformed.' }, 400);
  }

  const count = await db.first('SELECT COUNT(*) AS n FROM study_sessions WHERE study_id = ?', [study.id]);
  if (count && Number(count.n) >= MAX_SESSIONS_PER_STUDY) {
    return json({ error: 'This study has reached its response limit.' }, 403);
  }

  const receivedAt = new Date().toISOString();
  const version = Number.isInteger(body.value.studyVersion) ? body.value.studyVersion : study.version;
  // The first copy of a session wins, so a retried upload is harmless and nobody can overwrite another session.
  await db.run(
    'INSERT OR IGNORE INTO study_sessions (study_id, session_id, study_version, received_at, data) VALUES (?, ?, ?, ?, ?)',
    [study.id, session.id, version, receivedAt, JSON.stringify({ ...session, studyId: study.id })]
  );
  return json({ ok: true, receivedAt }, 201);
}

async function listSessions(db, study) {
  const rows = await db.all(
    'SELECT study_version, received_at, data FROM study_sessions WHERE study_id = ? ORDER BY received_at ASC',
    [study.id]
  );
  const sessions = [];
  for (const row of rows) {
    try {
      sessions.push({ ...JSON.parse(row.data), studyVersion: row.study_version, receivedAt: row.received_at });
    } catch {
      // A row that does not parse is skipped rather than failing the whole download.
    }
  }
  return json({ id: study.id, version: study.version, status: study.status, count: sessions.length, sessions });
}

export async function handleStudies(request, db) {
  if (!db) {
    return json({ error: 'Study hosting is not set up on this server yet (no database attached).', code: 'not_configured' }, 503);
  }
  await ensureSchema(db);

  const parts = new URL(request.url).pathname.replace(/\/+$/, '').split('/').slice(3); // after /api/studies
  const method = request.method;

  if (parts.length === 0) {
    if (method === 'POST') return publish(request, db);
    if (method === 'GET') return json({ configured: true });
    return json({ error: 'Method not allowed.' }, 405);
  }

  const id = parts[0];
  if (!/^[a-z0-9]{6,20}$/.test(id)) return json({ error: 'Study not found.' }, 404);
  const study = await db.first('SELECT * FROM studies WHERE id = ?', [id]);
  if (!study) return json({ error: 'Study not found.' }, 404);

  if (parts.length === 1) {
    if (method === 'GET') {
      if (study.status !== 'open') return json({ id, title: study.title, status: study.status, version: study.version });
      return json({ id, title: study.title, status: study.status, version: study.version, definition: JSON.parse(study.definition) });
    }
    if (method !== 'PUT' && method !== 'DELETE') return json({ error: 'Method not allowed.' }, 405);
    if (!(await isOwner(request, study))) return json({ error: 'The researcher key for this study is missing or wrong.' }, 401);
    if (method === 'PUT') return update(request, db, study);
    await db.run('DELETE FROM study_sessions WHERE study_id = ?', [id]);
    await db.run('DELETE FROM studies WHERE id = ?', [id]);
    return json({ ok: true });
  }

  if (parts.length === 2 && parts[1] === 'sessions') {
    if (method === 'POST') return submitSession(request, db, study);
    if (method === 'GET') {
      if (!(await isOwner(request, study))) return json({ error: 'The researcher key for this study is missing or wrong.' }, 401);
      return listSessions(db, study);
    }
    return json({ error: 'Method not allowed.' }, 405);
  }

  return json({ error: 'Not found.' }, 404);
}

// Adapter for a Cloudflare D1 binding.
const d1Adapters = new WeakMap();
export function d1Database(binding) {
  if (!binding) return null;
  if (!d1Adapters.has(binding)) {
    d1Adapters.set(binding, {
      run: (sql, params) => binding.prepare(sql).bind(...params).run(),
      first: (sql, params) => binding.prepare(sql).bind(...params).first(),
      all: async (sql, params) => (await binding.prepare(sql).bind(...params).all()).results || [],
    });
  }
  return d1Adapters.get(binding);
}

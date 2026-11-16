import type { Env } from './telemetry';
import { checkRateLimit } from './ratelimit';

export type GuestBadgeRole = 'Recruiter' | 'Fellow Developer' | 'Trainer' | 'Guest';

export interface GuestbookEntry {
  id: string;
  name: string;
  org?: string;
  badgeRole: GuestBadgeRole;
  avatar: string;
  stamp: string;
  message: string;
  createdAt: string;
}

export type ReactionKind = 'impressive' | 'cool' | 'arch';

export type ProjectReactionCounts = Record<ReactionKind, number>;

export type ProjectReactionsMap = Record<string, ProjectReactionCounts>;

const GUESTBOOK_KV_KEY = 'guestbook_entries_v1';
const REACTIONS_KV_KEY = 'project_reactions_v1';
const MAX_GUESTBOOK_ENTRIES = 50;

const ALLOWED_ROLES: GuestBadgeRole[] = ['Recruiter', 'Fellow Developer', 'Trainer', 'Guest'];

const BLOCKED_TERMS = ['http://', 'https://', '<script', 'casino', 'slot', 'gacor', 'judi', 'viagra', 'crypto airdrop'];

export const SEED_GUESTBOOK_ENTRIES: GuestbookEntry[] = [
  {
    id: 'seed-1',
    name: 'Sarah K.',
    org: 'Cloud & AI Talent Acquisition',
    badgeRole: 'Recruiter',
    avatar: '⚡',
    stamp: '💼 Recruiter Visited',
    message: 'Loved the interactive town concept and live system architecture cards. Super memorable portfolio!',
    createdAt: '2026-11-14T09:30:00.000Z',
  },
  {
    id: 'seed-2',
    name: 'Dr. Hendra R.',
    org: 'ITENAS Informatics Mentor',
    badgeRole: 'Fellow Developer',
    avatar: '🧬',
    stamp: '🚀 10/10 Engineering',
    message: '99.56% thesis benchmark plus TensorRT FP16 edge vision pipeline — solid engineering rigor.',
    createdAt: '2026-11-12T14:20:00.000Z',
  },
  {
    id: 'seed-3',
    name: 'Rafi P.',
    org: 'Backend Guild',
    badgeRole: 'Fellow Developer',
    avatar: '🔥',
    stamp: '💡 Great Architecture',
    message: 'FoodLink Kafka outbox + Redis mutex lock deep dive in Dev Center is genuinely insightful.',
    createdAt: '2026-11-10T18:45:00.000Z',
  },
  {
    id: 'seed-4',
    name: 'Nadia W.',
    org: 'Kanto Explorer',
    badgeRole: 'Trainer',
    avatar: '🌙',
    stamp: '🌟 Awesome Portfolio!',
    message: 'Found Digi-Sanctuary and took a PokéSnap with Lunala at sunset! GG on the pixel art.',
    createdAt: '2026-11-08T11:10:00.000Z',
  },
];

export const SEED_PROJECT_REACTIONS: ProjectReactionsMap = {
  aeroscan: { impressive: 18, cool: 14, arch: 11 },
  foodlink: { impressive: 15, cool: 11, arch: 16 },
  thesis: { impressive: 14, cool: 9, arch: 12 },
  'omr-grader': { impressive: 9, cool: 10, arch: 7 },
  foodrescue: { impressive: 11, cool: 8, arch: 9 },
  inception: { impressive: 8, cool: 7, arch: 6 },
  'rc-tank': { impressive: 12, cool: 15, arch: 8 },
};

// In-memory fallback for local wrangler dev without KV bound
let memoryGuestbook: GuestbookEntry[] | null = null;
let memoryReactions: ProjectReactionsMap | null = null;

function sanitizeText(raw: unknown, maxLen: number): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function containsBlockedContent(text: string): boolean {
  const lower = text.toLowerCase();
  return BLOCKED_TERMS.some((term) => lower.includes(term));
}

function cloneSeedReactions(): ProjectReactionsMap {
  const out: ProjectReactionsMap = {};
  for (const [k, v] of Object.entries(SEED_PROJECT_REACTIONS)) {
    out[k] = { ...v };
  }
  return out;
}

async function readGuestbook(env: Env): Promise<{ entries: GuestbookEntry[]; source: 'kv' | 'memory' }> {
  if (env.STATS_KV) {
    try {
      const stored = await env.STATS_KV.get<GuestbookEntry[]>(GUESTBOOK_KV_KEY, 'json');
      if (Array.isArray(stored) && stored.length > 0) {
        return { entries: stored, source: 'kv' };
      }
      return { entries: [...SEED_GUESTBOOK_ENTRIES], source: 'kv' };
    } catch {
      // fall through to memory
    }
  }
  if (!memoryGuestbook) {
    memoryGuestbook = [...SEED_GUESTBOOK_ENTRIES];
  }
  return { entries: memoryGuestbook, source: 'memory' };
}

async function writeGuestbook(env: Env, entries: GuestbookEntry[]): Promise<void> {
  const capped = entries.slice(0, MAX_GUESTBOOK_ENTRIES);
  memoryGuestbook = capped;
  if (env.STATS_KV) {
    try {
      await env.STATS_KV.put(GUESTBOOK_KV_KEY, JSON.stringify(capped));
    } catch {
      // keep memory fallback on transient KV failure
    }
  }
}

async function readReactions(env: Env): Promise<{ counts: ProjectReactionsMap; source: 'kv' | 'memory' }> {
  if (env.STATS_KV) {
    try {
      const stored = await env.STATS_KV.get<ProjectReactionsMap>(REACTIONS_KV_KEY, 'json');
      if (stored && typeof stored === 'object') {
        return { counts: { ...cloneSeedReactions(), ...stored }, source: 'kv' };
      }
      return { counts: cloneSeedReactions(), source: 'kv' };
    } catch {
      // fall through
    }
  }
  if (!memoryReactions) {
    memoryReactions = cloneSeedReactions();
  }
  return { counts: memoryReactions, source: 'memory' };
}

async function writeReactions(env: Env, counts: ProjectReactionsMap): Promise<void> {
  memoryReactions = counts;
  if (env.STATS_KV) {
    try {
      await env.STATS_KV.put(REACTIONS_KV_KEY, JSON.stringify(counts));
    } catch {
      // ignore transient error
    }
  }
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export async function handleGuestbook(request: Request, env: Env, clientIP: string): Promise<Response> {
  if (request.method === 'GET') {
    const { entries, source } = await readGuestbook(env);
    return jsonResponse({ entries, source });
  }

  if (request.method === 'POST') {
    if (!checkRateLimit(`gb:${clientIP}`, 5, 60000)) {
      return jsonResponse({ error: 'Rate limit reached. Please wait a minute before signing again.' }, 429);
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return jsonResponse({ error: 'Invalid JSON payload.' }, 400);
    }

    const name = sanitizeText(body.name, 36) || 'Trainer Guest';
    const org = sanitizeText(body.org, 44);
    const message = sanitizeText(body.message, 160);
    const stamp = sanitizeText(body.stamp, 36) || '🌟 Awesome Portfolio!';
    const avatar = sanitizeText(body.avatar, 8) || '🧢';
    const rawRole = sanitizeText(body.badgeRole, 24) as GuestBadgeRole;
    const badgeRole: GuestBadgeRole = ALLOWED_ROLES.includes(rawRole) ? rawRole : 'Guest';

    if (!message || message.length < 2) {
      return jsonResponse({ error: 'Message must be between 2 and 160 characters.' }, 400);
    }

    if (containsBlockedContent(`${name} ${org} ${message}`)) {
      return jsonResponse({ error: 'Message flagged by anti-spam filter (links/scripts not allowed).' }, 400);
    }

    const entry: GuestbookEntry = {
      id: `gb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      org: org || undefined,
      badgeRole,
      avatar,
      stamp,
      message,
      createdAt: new Date().toISOString(),
    };

    const { entries, source } = await readGuestbook(env);
    const updated = [entry, ...entries].slice(0, MAX_GUESTBOOK_ENTRIES);
    await writeGuestbook(env, updated);

    return jsonResponse({ entry, entries: updated, source }, 201);
  }

  return jsonResponse({ error: 'Method Not Allowed' }, 405);
}

export async function handleReactions(request: Request, env: Env, clientIP: string): Promise<Response> {
  if (request.method === 'GET') {
    const { counts, source } = await readReactions(env);
    return jsonResponse({ counts, source });
  }

  if (request.method === 'POST') {
    if (!checkRateLimit(`rx:${clientIP}`, 20, 60000)) {
      return jsonResponse({ error: 'Too many reaction clicks. Slow down briefly!' }, 429);
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return jsonResponse({ error: 'Invalid JSON payload.' }, 400);
    }

    const projectId = sanitizeText(body.projectId, 32).toLowerCase();
    const kind = sanitizeText(body.kind, 16) as ReactionKind;
    const delta = body.delta === -1 ? -1 : 1;

    if (!projectId || !/^[a-z0-9-]+$/.test(projectId)) {
      return jsonResponse({ error: 'Invalid projectId.' }, 400);
    }
    if (kind !== 'impressive' && kind !== 'cool' && kind !== 'arch') {
      return jsonResponse({ error: 'Invalid reaction kind.' }, 400);
    }

    const { counts, source } = await readReactions(env);
    const current = counts[projectId] ? { ...counts[projectId] } : { impressive: 0, cool: 0, arch: 0 };
    current[kind] = Math.max(0, (current[kind] || 0) + delta);
    const nextCounts: ProjectReactionsMap = { ...counts, [projectId]: current };
    await writeReactions(env, nextCounts);

    return jsonResponse({ projectId, counts: nextCounts, source });
  }

  return jsonResponse({ error: 'Method Not Allowed' }, 405);
}

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

export const GUESTBOOK_STORAGE_KEY = 'reception_guestbook_entries';
export const REACTIONS_STORAGE_KEY = 'town_project_reactions_v1';
export const MY_REACTIONS_STORAGE_KEY = 'town_my_project_reactions_v1';
export const GHOST_ENABLED_STORAGE_KEY = 'town_ghost_trainers_enabled';

export const GUESTBOOK_AVATARS = [
  { icon: '⚡', label: 'Pikachu' },
  { icon: '🥊', label: 'Lucario' },
  { icon: '🔥', label: 'Charizard' },
  { icon: '🌙', label: 'Lunala' },
  { icon: '🧬', label: 'Agumon / Digi' },
  { icon: '🛰️', label: 'Deoxys' },
  { icon: '🌸', label: 'Gardevoir' },
  { icon: '🧢', label: 'Trainer' },
];

export const GUESTBOOK_STAMPS = [
  '🌟 Awesome Portfolio!',
  '💼 Recruiter Visited',
  '🚀 10/10 Engineering',
  '💡 Great Architecture',
  '☕ Let\'s Connect',
];

export const REACTION_META: { kind: ReactionKind; emoji: string; label: string }[] = [
  { kind: 'impressive', emoji: '🚀', label: 'Impressive' },
  { kind: 'cool', emoji: '🔥', label: 'Cool Tech' },
  { kind: 'arch', emoji: '💡', label: 'Great Architecture' },
];

export const SEED_GUESTBOOK: GuestbookEntry[] = [
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

export const SEED_REACTIONS: ProjectReactionsMap = {
  aeroscan: { impressive: 18, cool: 14, arch: 11 },
  foodlink: { impressive: 15, cool: 11, arch: 16 },
  thesis: { impressive: 14, cool: 9, arch: 12 },
  'omr-grader': { impressive: 9, cool: 10, arch: 7 },
  foodrescue: { impressive: 11, cool: 8, arch: 9 },
  inception: { impressive: 8, cool: 7, arch: 6 },
  'rc-tank': { impressive: 12, cool: 15, arch: 8 },
};

function normalizeEntry(raw: any): GuestbookEntry {
  const role: GuestBadgeRole =
    raw?.badgeRole === 'Recruiter' ||
    raw?.badgeRole === 'Fellow Developer' ||
    raw?.badgeRole === 'Trainer' ||
    raw?.badgeRole === 'Guest'
      ? raw.badgeRole
      : raw?.role && String(raw.role).toLowerCase().includes('recruit')
        ? 'Recruiter'
        : 'Guest';
  return {
    id: String(raw?.id || `local-${Math.random().toString(36).slice(2, 8)}`),
    name: String(raw?.name || 'Trainer Guest').slice(0, 36),
    org: raw?.org ? String(raw.org).slice(0, 44) : raw?.role ? String(raw.role).slice(0, 44) : undefined,
    badgeRole: role,
    avatar: String(raw?.avatar || '🧢'),
    stamp: String(raw?.stamp || '🌟 Awesome Portfolio!'),
    message: String(raw?.message || ''),
    createdAt: String(raw?.createdAt || new Date().toISOString()),
  };
}

export function getLocalGuestbookEntries(): GuestbookEntry[] {
  if (typeof window === 'undefined') return [...SEED_GUESTBOOK];
  try {
    const raw = localStorage.getItem(GUESTBOOK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeEntry);
      }
    }
  } catch {
    // ignore corrupted local storage
  }
  return [...SEED_GUESTBOOK];
}

function saveLocalGuestbookEntries(entries: GuestbookEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(entries.slice(0, 50)));
  } catch {
    // ignore storage quota errors
  }
}

export async function fetchGuestbookEntries(): Promise<{ entries: GuestbookEntry[]; online: boolean }> {
  const local = getLocalGuestbookEntries();
  if (typeof window === 'undefined') return { entries: local, online: false };

  try {
    const ctrl = new AbortController();
    const t = window.setTimeout(() => ctrl.abort(), 2200);
    const res = await fetch('/api/guestbook', { signal: ctrl.signal });
    window.clearTimeout(t);

    if (res.ok) {
      const data = (await res.json()) as { entries?: any[] };
      if (Array.isArray(data.entries) && data.entries.length > 0) {
        const remote = data.entries.map(normalizeEntry);
        saveLocalGuestbookEntries(remote);
        return { entries: remote, online: true };
      }
    }
  } catch {
    // offline or static Astro preview
  }
  return { entries: local, online: false };
}

export async function submitGuestbookEntry(input: {
  name: string;
  org?: string;
  badgeRole: GuestBadgeRole;
  avatar: string;
  stamp: string;
  message: string;
}): Promise<{ entry: GuestbookEntry; entries: GuestbookEntry[]; syncedRemote: boolean; error?: string }> {
  const localEntry: GuestbookEntry = {
    id: `gb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: input.name.trim().slice(0, 36) || 'Trainer Guest',
    org: input.org?.trim().slice(0, 44) || undefined,
    badgeRole: input.badgeRole,
    avatar: input.avatar || '🧢',
    stamp: input.stamp || '🌟 Awesome Portfolio!',
    message: input.message.trim().slice(0, 160),
    createdAt: new Date().toISOString(),
  };

  if (localEntry.message.length < 2) {
    return {
      entry: localEntry,
      entries: getLocalGuestbookEntries(),
      syncedRemote: false,
      error: 'Message must be at least 2 characters.',
    };
  }

  let syncedRemote = false;
  let updatedEntries: GuestbookEntry[] | null = null;
  let finalEntry = localEntry;

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (res.ok) {
        const data = (await res.json()) as { entry?: any; entries?: any[] };
        if (data.entry) finalEntry = normalizeEntry(data.entry);
        if (Array.isArray(data.entries)) {
          updatedEntries = data.entries.map(normalizeEntry);
          syncedRemote = true;
        }
      } else if (res.status === 400 || res.status === 429) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        return {
          entry: localEntry,
          entries: getLocalGuestbookEntries(),
          syncedRemote: false,
          error: errData.error || 'Unable to post entry right now.',
        };
      }
    } catch {
      // static preview / offline -> save locally cleanly
    }
  }

  if (!updatedEntries) {
    updatedEntries = [finalEntry, ...getLocalGuestbookEntries()].slice(0, 50);
  }
  saveLocalGuestbookEntries(updatedEntries);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('town:guestbook-updated', {
        detail: { entries: updatedEntries, newEntry: finalEntry },
      })
    );
  }

  return { entry: finalEntry, entries: updatedEntries, syncedRemote };
}

export function getLocalProjectReactions(): ProjectReactionsMap {
  const base: ProjectReactionsMap = {};
  for (const [k, v] of Object.entries(SEED_REACTIONS)) base[k] = { ...v };
  if (typeof window === 'undefined') return base;
  try {
    const raw = localStorage.getItem(REACTIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        for (const [pid, counts] of Object.entries(parsed as Record<string, any>)) {
          base[pid] = {
            impressive: Number(counts?.impressive ?? base[pid]?.impressive ?? 0),
            cool: Number(counts?.cool ?? base[pid]?.cool ?? 0),
            arch: Number(counts?.arch ?? base[pid]?.arch ?? 0),
          };
        }
      }
    }
  } catch {
    // ignore
  }
  return base;
}

export function getMyVotedReactions(): Record<string, Partial<Record<ReactionKind, boolean>>> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(MY_REACTIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalReactions(counts: ProjectReactionsMap, voted: Record<string, Partial<Record<ReactionKind, boolean>>>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REACTIONS_STORAGE_KEY, JSON.stringify(counts));
    localStorage.setItem(MY_REACTIONS_STORAGE_KEY, JSON.stringify(voted));
  } catch {
    // ignore
  }
}

export async function fetchProjectReactions(): Promise<ProjectReactionsMap> {
  const local = getLocalProjectReactions();
  if (typeof window === 'undefined') return local;
  try {
    const ctrl = new AbortController();
    const t = window.setTimeout(() => ctrl.abort(), 2000);
    const res = await fetch('/api/reactions', { signal: ctrl.signal });
    window.clearTimeout(t);
    if (res.ok) {
      const data = (await res.json()) as { counts?: ProjectReactionsMap };
      if (data.counts) {
        const merged = { ...local, ...data.counts };
        localStorage.setItem(REACTIONS_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch {
    // static mode
  }
  return local;
}

export async function toggleProjectReaction(
  projectId: string,
  kind: ReactionKind
): Promise<{ counts: ProjectReactionsMap; voted: Record<string, Partial<Record<ReactionKind, boolean>>>; active: boolean }> {
  const counts = getLocalProjectReactions();
  const voted = getMyVotedReactions();
  const currentProject = counts[projectId] || { impressive: 0, cool: 0, arch: 0 };
  const wasActive = !!voted[projectId]?.[kind];
  const delta = wasActive ? -1 : 1;

  counts[projectId] = {
    ...currentProject,
    [kind]: Math.max(0, (currentProject[kind] || 0) + delta),
  };
  voted[projectId] = { ...(voted[projectId] || {}), [kind]: !wasActive };
  saveLocalReactions(counts, voted);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('town:reactions-updated', { detail: { projectId, counts, voted } })
    );
    try {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, kind, delta }),
      });
      if (res.ok) {
        const data = (await res.json()) as { counts?: ProjectReactionsMap };
        if (data.counts) {
          saveLocalReactions(data.counts, voted);
          window.dispatchEvent(
            new CustomEvent('town:reactions-updated', { detail: { projectId, counts: data.counts, voted } })
          );
          return { counts: data.counts, voted, active: !wasActive };
        }
      }
    } catch {
      // keep optimistic local state
    }
  }

  return { counts, voted, active: !wasActive };
}

export function formatRelativeGuestTime(iso: string): string {
  const ts = Date.parse(iso);
  if (Number.isNaN(ts)) return iso;
  const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  const days = Math.floor(diffSec / 86400);
  if (days < 30) return `${days}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function paintBarButtons(
  bar: HTMLElement,
  projectId: string,
  counts: ProjectReactionsMap,
  voted: Record<string, Partial<Record<ReactionKind, boolean>>>
) {
  const projCounts = counts[projectId] || { impressive: 0, cool: 0, arch: 0 };
  const projVoted = voted[projectId] || {};
  bar.querySelectorAll<HTMLButtonElement>('[data-reaction-kind]').forEach((btn) => {
    const kind = btn.dataset.reactionKind as ReactionKind;
    const isActive = !!projVoted[kind];
    btn.classList.toggle('is-reacted', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
    const countSpan = btn.querySelector('.kudos-btn__count');
    if (countSpan) countSpan.textContent = String(projCounts[kind] ?? 0);
  });
}

/**
 * Hydrate live Kudos / Reaction counters inside Dev Center project cards
 * and Mission Debrief panels without duplicating DOM markup.
 */
export async function mountProjectReactionBars(onReact?: (active: boolean) => void) {
  if (typeof document === 'undefined') return;

  const targets: { host: HTMLElement; projectId: string; insertBefore?: Element | null }[] = [];

  document.querySelectorAll<HTMLElement>('.launch[data-launch-id]').forEach((card) => {
    const projectId = card.dataset.launchId;
    const body = card.querySelector<HTMLElement>('.launch__body');
    if (!projectId || !body || body.querySelector('.project-kudos-bar')) return;
    targets.push({ host: body, projectId, insertBefore: body.querySelector('.launch__links') });
  });

  document.querySelectorAll<HTMLElement>('[data-debrief-panel]').forEach((panel) => {
    const projectId = panel.dataset.debriefPanel;
    if (!projectId || panel.querySelector('.project-kudos-bar')) return;
    targets.push({ host: panel, projectId, insertBefore: panel.querySelector('.debrief-footer') });
  });

  const initialCounts = getLocalProjectReactions();
  const initialVoted = getMyVotedReactions();

  for (const { host, projectId, insertBefore } of targets) {
    const bar = document.createElement('div');
    bar.className = 'project-kudos-bar';
    bar.dataset.kudosProject = projectId;
    bar.innerHTML = REACTION_META.map(
      (r) => `
        <button type="button" class="kudos-btn" data-reaction-kind="${r.kind}" title="${escapeHtml(r.label)}" aria-pressed="false">
          <span class="kudos-btn__emoji">${r.emoji}</span>
          <span class="kudos-btn__label">${escapeHtml(r.label)}</span>
          <span class="kudos-btn__count">0</span>
        </button>`
    ).join('');

    bar.querySelectorAll<HTMLButtonElement>('[data-reaction-kind]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const kind = btn.dataset.reactionKind as ReactionKind;
        const result = await toggleProjectReaction(projectId, kind);
        onReact?.(result.active);
      });
    });

    paintBarButtons(bar, projectId, initialCounts, initialVoted);
    if (insertBefore && insertBefore.parentElement === host) {
      host.insertBefore(bar, insertBefore);
    } else {
      host.appendChild(bar);
    }
  }

  const syncAll = (counts: ProjectReactionsMap, voted: Record<string, Partial<Record<ReactionKind, boolean>>>) => {
    document.querySelectorAll<HTMLElement>('.project-kudos-bar[data-kudos-project]').forEach((bar) => {
      const pid = bar.dataset.kudosProject;
      if (pid) paintBarButtons(bar, pid, counts, voted);
    });
  };

  if (!(window as any).__townReactionsWired) {
    (window as any).__townReactionsWired = true;
    window.addEventListener('town:reactions-updated', (e: Event) => {
      const detail = (e as CustomEvent<{ counts?: ProjectReactionsMap; voted?: any }>).detail;
      if (detail?.counts) {
        syncAll(detail.counts, detail.voted || getMyVotedReactions());
      }
    });
  }

  const liveCounts = await fetchProjectReactions();
  syncAll(liveCounts, getMyVotedReactions());
}

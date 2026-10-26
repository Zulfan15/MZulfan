/**
 * Build-time profile loader.
 * Reads src/data/profile.yaml, validates it with Zod and derives everything the
 * UI needs (timeline, skill frequency for the Stack Radar, featured lists…).
 * Import ONLY from server code (Astro frontmatter / build scripts).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { ProfileSchema, type Mission, type Profile } from './schema';

export type { Profile, Mission, Critter, Social } from './schema';

const PROFILE_PATH = resolve(process.cwd(), 'src/data/profile.yaml');

function loadProfile(): Profile {
  const raw = parse(readFileSync(PROFILE_PATH, 'utf8'));
  const result = ProfileSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`\n✖ profile.yaml failed validation:\n${issues}\n`);
  }
  return result.data;
}

export const profile: Profile = loadProfile();

/* ───────────────────────── Dates ───────────────────────── */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function fmtMonth(ym: string | null): string {
  if (!ym) return 'Present';
  const [y, m] = ym.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

export function fmtRange(start: string, end: string | null): string {
  return `${fmtMonth(start)} – ${fmtMonth(end)}`;
}

/* ───────────────────────── Missions ───────────────────────── */

const byStartDesc = (a: { start: string }, b: { start: string }) => b.start.localeCompare(a.start);

export const missions: Mission[] = [...profile.missions].sort(byStartDesc);
export const launches = missions.filter((m) => m.type === 'launch');
export const crewAssignments = missions.filter((m) => m.type === 'crew_assignment');
export const featured = launches.filter((m) => m.featured);
export const researchMissions = launches.filter((m) => m.research);
export const activeMissions = missions.filter((m) => m.end === null);

/* ───────────────────────── Timeline ───────────────────────── */

export type TimelineKind = 'launch' | 'crew_assignment' | 'training' | 'commendation';

export interface TimelineEntry {
  id: string;
  kind: TimelineKind;
  title: string;
  org: string;
  /** sort key YYYY-MM */
  date: string;
  range: string;
  active: boolean;
  summary: string;
  results: string[];
  tags: string[];
  links: { demo?: string; code?: string; paper?: string };
}

export const KIND_META: Record<TimelineKind, { label: string; icon: string; plural: string }> = {
  launch: { label: 'Launch', plural: 'Launches', icon: '🚀' },
  crew_assignment: { label: 'Crew Assignment', plural: 'Crew Assignments', icon: '🛰️' },
  training: { label: 'Training', plural: 'Training', icon: '🎓' },
  commendation: { label: 'Commendation', plural: 'Commendations', icon: '🏅' },
};

export const timeline: TimelineEntry[] = [
  ...missions.map<TimelineEntry>((m) => ({
    id: m.id,
    kind: m.type,
    title: m.title,
    org: m.org,
    date: m.start,
    range: fmtRange(m.start, m.end),
    active: m.end === null,
    summary: m.summary,
    results: m.results,
    tags: m.payload,
    links: m.links,
  })),
  ...profile.education.map<TimelineEntry>((e, i) => ({
    id: `edu-${i}`,
    kind: 'training',
    title: e.degree,
    org: e.school,
    date: e.start,
    range: fmtRange(e.start, e.end),
    active: e.end === null,
    summary: e.gpa ? `GPA ${e.gpa} · ${e.location}` : e.location,
    results: e.highlights,
    tags: [],
    links: {},
  })),
  ...profile.honors.map<TimelineEntry>((h, i) => ({
    id: `honor-${i}`,
    kind: 'commendation',
    title: h.title,
    org: h.issuer,
    date: h.date,
    range: fmtMonth(h.date),
    active: false,
    summary: h.note ?? '',
    results: [],
    tags: [],
    links: {},
  })),
].sort((a, b) => b.date.localeCompare(a.date));

/* ───────────────────────── Skill frequency (Stack Radar) ───────────────────────── */

export type Ring = 'core' | 'goto' | 'regular' | 'once' | 'bench';

export const RING_META: Record<Ring, { label: string; hint: string }> = {
  core: { label: 'Core', hint: 'used in 4+ missions' },
  goto: { label: 'Go-to', hint: 'used in 3 missions' },
  regular: { label: 'Regular', hint: 'used in 2 missions' },
  once: { label: 'Flown once', hint: 'used in 1 mission' },
  bench: { label: 'On the bench', hint: 'known, not yet flown in a listed mission' },
};

export interface SkillStat {
  name: string;
  category: string;
  quadrant: number;
  count: number;
  ring: Ring;
  missions: { id: string; title: string; type: Mission['type']; year: string }[];
}

function ringFor(count: number): Ring {
  if (count >= 4) return 'core';
  if (count === 3) return 'goto';
  if (count === 2) return 'regular';
  if (count === 1) return 'once';
  return 'bench';
}

function computeSkills(p: Profile): SkillStat[] {
  const categoryOf = new Map<string, number>();
  p.stack.forEach((cat, q) => cat.items.forEach((item) => categoryOf.set(item.toLowerCase(), q)));

  const stats = new Map<string, SkillStat>();
  const ensure = (name: string): SkillStat => {
    const key = name.toLowerCase();
    let s = stats.get(key);
    if (!s) {
      let q = categoryOf.get(key);
      if (q === undefined) {
        console.warn(`[profile] payload tag "${name}" is not listed in stack — placing it in "${p.stack[3].category}".`);
        q = 3;
      }
      s = { name, category: p.stack[q].category, quadrant: q, count: 0, ring: 'bench', missions: [] };
      stats.set(key, s);
    }
    return s;
  };

  p.stack.forEach((cat) => cat.items.forEach(ensure));
  for (const m of missions) {
    for (const tag of new Set(m.payload)) {
      const s = ensure(tag);
      s.count += 1;
      s.missions.push({ id: m.id, title: m.title, type: m.type, year: m.start.slice(0, 4) });
    }
  }
  for (const s of stats.values()) s.ring = ringFor(s.count);
  return [...stats.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export const skills: SkillStat[] = computeSkills(profile);
export const skillFrequency: Record<string, number> = Object.fromEntries(skills.map((s) => [s.name, s.count]));
export const topSkills = skills.filter((s) => s.count > 0).slice(0, 8);

/* ───────────────────────── Places (routes ↔ buildings) ───────────────────────── */

export interface Place {
  id: string;
  route: string;
  name: string;
  icon: string;
  blurb: string;
}

export const places: Place[] = [
  { id: 'town', route: '/', name: 'Town Square', icon: '🏡', blurb: 'The notice board — TL;DR, featured builds and toolbelt.' },
  { id: 'about', route: '/about', name: 'Home', icon: '🏠', blurb: 'Who I am, education, honors and how to reach me.' },
  { id: 'dev', route: '/dev', name: 'Dev Center', icon: '💻', blurb: 'Mission timeline, stack radar and live telemetry.' },
  { id: 'lab', route: '/lab', name: 'Research Lab', icon: '🔬', blurb: 'Thesis, computer vision research and what is next.' },
  { id: 'arcade', route: '/arcade', name: 'Arcade', icon: '🕹️', blurb: 'Play Kalah against my Alpha-Beta bot.' },
  { id: 'twin', route: '/twin', name: 'Digital Twin', icon: '💬', blurb: 'Ask my AI twin anything about me.' },
  { id: 'reception', route: '/reception', name: 'Front Desk', icon: '🎧', blurb: 'Mira at the Dev Center desk tells you about me.' },
];

export const placeById = (id: string): Place => places.find((p) => p.id === id) ?? places[0];

import { drawCharacter, TILE_SIZE } from './sprites';
import type { CharacterPalette, Dir } from './types';
import type { GuestBadgeRole, GuestbookEntry } from '../lib/socialClient';

export interface GhostTrainerNpc {
  id: string;
  name: string;
  badgeRole: GuestBadgeRole;
  org?: string;
  avatar: string;
  stamp: string;
  message: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  dir: Dir;
  isMoving: boolean;
  moveProgress: number;
  pauseTicks: number;
  waypoints: { x: number; y: number }[];
  waypointIdx: number;
  palette: CharacterPalette;
}

const GHOST_PALETTES: CharacterPalette[] = [
  {
    skin: '#f6d5b8',
    hair: '#334155',
    shirt: '#2563eb',
    pants: '#1e293b',
    shoes: '#0f172a',
    cap: '#38bdf8',
    accent: '#bae6fd',
    holo: true,
  },
  {
    skin: '#eac19e',
    hair: '#1e1b4b',
    shirt: '#10b981',
    pants: '#064e3b',
    shoes: '#0f172a',
    cap: '#6ee7b7',
    accent: '#fde047',
    holo: true,
  },
  {
    skin: '#fde0c2',
    hair: '#4c1d95',
    shirt: '#a855f7',
    pants: '#3b0764',
    shoes: '#0f172a',
    cap: '#e9d5ff',
    accent: '#f472b6',
    holo: true,
  },
  {
    skin: '#f3cfb3',
    hair: '#7c2d12',
    shirt: '#f59e0b',
    pants: '#451a03',
    shoes: '#1e293b',
    cap: '#fef08a',
    accent: '#fb7185',
    holo: true,
  },
  {
    skin: '#f6d5b8',
    hair: '#0f766e',
    shirt: '#ec4899',
    pants: '#312e81',
    shoes: '#0f172a',
    cap: '#fda4af',
    accent: '#38bdf8',
    holo: true,
  },
];

// Gentle plaza patrol routes around Fountain Plaza (center ~27..30, 29..32) & Spawn Courtyard
const PLAZA_LANES: { x: number; y: number }[][] = [
  [
    { x: 25, y: 27 },
    { x: 32, y: 27 },
    { x: 32, y: 28 },
    { x: 25, y: 28 },
  ],
  [
    { x: 32, y: 34 },
    { x: 25, y: 34 },
    { x: 25, y: 33 },
    { x: 32, y: 33 },
  ],
  [
    { x: 24, y: 29 },
    { x: 24, y: 33 },
    { x: 25, y: 33 },
    { x: 25, y: 29 },
  ],
  [
    { x: 33, y: 33 },
    { x: 33, y: 29 },
    { x: 32, y: 29 },
    { x: 32, y: 33 },
  ],
  [
    { x: 20, y: 29 },
    { x: 23, y: 29 },
    { x: 23, y: 31 },
    { x: 20, y: 31 },
  ],
];

export function buildGhostTrainers(entries: GuestbookEntry[]): GhostTrainerNpc[] {
  return entries.slice(0, 5).map((entry, idx) => {
    const waypoints = PLAZA_LANES[idx % PLAZA_LANES.length];
    const start = waypoints[0];
    return {
      id: entry.id,
      name: entry.name,
      badgeRole: entry.badgeRole,
      org: entry.org,
      avatar: entry.avatar,
      stamp: entry.stamp,
      message: entry.message,
      x: start.x,
      y: start.y,
      targetX: start.x,
      targetY: start.y,
      dir: 'down',
      isMoving: false,
      moveProgress: 0,
      pauseTicks: 20 + idx * 17,
      waypoints,
      waypointIdx: 1 % waypoints.length,
      palette: GHOST_PALETTES[idx % GHOST_PALETTES.length],
    };
  });
}

export function updateGhostTrainers(
  ghosts: GhostTrainerNpc[],
  dt: number,
  canStep: (x: number, y: number) => boolean
) {
  for (const g of ghosts) {
    if (g.isMoving) {
      g.moveProgress += dt * 0.042;
      if (g.moveProgress >= 1) {
        g.x = g.targetX;
        g.y = g.targetY;
        g.isMoving = false;
        g.moveProgress = 0;
        g.pauseTicks = 28 + Math.floor(Math.random() * 48);
      }
      continue;
    }

    if (g.pauseTicks > 0) {
      g.pauseTicks -= dt;
      continue;
    }

    const goal = g.waypoints[g.waypointIdx];
    if (!goal) continue;
    if (g.x === goal.x && g.y === goal.y) {
      g.waypointIdx = (g.waypointIdx + 1) % g.waypoints.length;
      g.pauseTicks = 45;
      continue;
    }

    const dx = Math.sign(goal.x - g.x);
    const dy = Math.sign(goal.y - g.y);
    const stepX = dx !== 0 ? g.x + dx : g.x;
    const stepY = dx !== 0 ? g.y : g.y + dy;

    if (dx > 0) g.dir = 'right';
    else if (dx < 0) g.dir = 'left';
    else if (dy > 0) g.dir = 'down';
    else if (dy < 0) g.dir = 'up';

    if (canStep(stepX, stepY)) {
      g.targetX = stepX;
      g.targetY = stepY;
      g.isMoving = true;
      g.moveProgress = 0;
    } else if (dx !== 0 && dy !== 0 && canStep(g.x, g.y + dy)) {
      g.dir = dy > 0 ? 'down' : 'up';
      g.targetX = g.x;
      g.targetY = g.y + dy;
      g.isMoving = true;
      g.moveProgress = 0;
    } else {
      g.waypointIdx = (g.waypointIdx + 1) % g.waypoints.length;
      g.pauseTicks = 30;
    }
  }
}

export function renderGhostTrainers(ctx: CanvasRenderingContext2D, ghosts: GhostTrainerNpc[], tick: number) {
  for (let i = 0; i < ghosts.length; i++) {
    const g = ghosts[i];
    const interpX = g.isMoving ? g.x + (g.targetX - g.x) * g.moveProgress : g.x;
    const interpY = g.isMoving ? g.y + (g.targetY - g.y) * g.moveProgress : g.y;
    const px = interpX * TILE_SIZE;
    const py = interpY * TILE_SIZE;
    const stepFrame = g.isMoving ? Math.floor(g.moveProgress * 4) : 0;

    ctx.save();
    // Subtle spectral shadow ring
    const pulse = 0.28 + Math.sin(tick * 0.08 + i) * 0.08;
    ctx.fillStyle = `rgba(56, 189, 248, ${pulse})`;
    ctx.beginPath();
    ctx.ellipse(px + 8, py + 14.5, 6.5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Holographic trainer sprite
    drawCharacter(ctx, g.palette, g.dir, stepFrame, px, py, 1);

    // Mini floating ghost nameplate
    const tag = `${g.avatar} ${g.name.split(' ')[0]}`.slice(0, 12);
    ctx.font = 'bold 5.5px monospace';
    ctx.textAlign = 'center';
    const w = Math.max(24, ctx.measureText(tag).width + 6);
    const bob = Math.sin(tick * 0.06 + i * 1.4) * 0.8;
    const tx = px + 8;
    const ty = py - 5 + bob;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.fillRect(tx - w / 2, ty - 5, w, 7);
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.75)';
    ctx.lineWidth = 0.6;
    ctx.strokeRect(tx - w / 2, ty - 5, w, 7);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillText(tag, tx, ty + 0.5);
    ctx.restore();
  }
}

export function findGhostAtTile(ghosts: GhostTrainerNpc[], tx: number, ty: number): GhostTrainerNpc | null {
  return (
    ghosts.find((g) => {
      const gx = g.isMoving ? g.targetX : g.x;
      const gy = g.isMoving ? g.targetY : g.y;
      return (g.x === tx && g.y === ty) || (gx === tx && gy === ty);
    }) || null
  );
}

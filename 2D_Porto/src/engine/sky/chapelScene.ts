import type { PokemonPMDAnimator } from '../pokemonPMDAnimator';
import {
  SKY_INTERIOR_COLS,
  SKY_INTERIOR_ROWS,
  SKY_INTERIOR_SPAWN,
  type SkyInteriorProp,
} from '../skyInteriorShared';
import {
  buildSkyBackgroundCanvas,
  createStandardSkyCollision,
  drawSkyCloudWindowDrift,
  drawSkyCrystalCenterpiece,
  drawSkyGuardians,
  drawSkyLantern,
  renderSkyWaves,
  type SkyGuardianPlacement,
} from './skySceneBase';
import { TILE_SIZE } from '../sprites';

export const CHAPEL_COLS = SKY_INTERIOR_COLS;
export const CHAPEL_ROWS = SKY_INTERIOR_ROWS;
export const CHAPEL_SPAWN = SKY_INTERIOR_SPAWN;
export const CHAPEL_COLLISION = createStandardSkyCollision(false);

export const CHAPEL_PROPS: SkyInteriorProp[] = [
  {
    id: 'arceus',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:chapel:arceus' },
    label: '✨ Arceus · Light Sovereign',
    style: 'sky-chapel',
    labelLift: 1.3,
    scrollTarget: 'chapel-trial',
    hint: 'Arceus stands at Avalon’s radiant altar! Chime all 3 Sapphire Sky-Bell Hymns below to claim the Plume of Radiance.',
  },
  {
    id: 'radiant-altar',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 1,
    target: { type: 'event', name: 'sky:chapel:altar' },
    label: '⛪ Radiant Sapphire Altar',
    style: 'sky-chapel',
    labelLift: 0.95,
    scrollTarget: 'chapel-trial',
    hint: 'Sanctuary chancel carved in white timber & lapis lazuli overlooking the twin southern cloud waterfalls.',
  },
  {
    id: 'honors-scroll',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:chapel:honors' },
    label: '🏅 Scroll of Honors & Ethics',
    style: 'sky-chapel',
    labelLift: 0.55,
    scrollTarget: 'chapel-honors',
    hint: 'ITENAS Informatics Engineering (GPA 3.49 / 4.00), Huawei HCIA-Security V4.0, and IDEA FEST 3 Bronze Medal.',
  },
  {
    id: 'sapphire-belfry',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:chapel:belfry' },
    label: '🔔 Sapphire Chime Belfry',
    style: 'sky-chapel',
    labelLift: 0.55,
    scrollTarget: 'chapel-trial',
    hint: 'Three tuned sky-bells vibrating at C5, E5 & G5 to sanctify the final Celestial Plume.',
  },
  {
    id: 'seraphimon',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:chapel:seraphimon' },
    label: '🕊️ Seraphimon',
    style: 'sky-chapel',
    labelLift: 1.05,
    scrollTarget: 'chapel-honors',
    hint: 'Guardian of Seven Heavens — celebrates security discipline, academic rigor & clean architecture.',
  },
  {
    id: 'sakuyamon',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:chapel:sakuyamon' },
    label: '🦊 Sakuyamon · Invocation Sage',
    style: 'sky-chapel',
    labelLift: 1.05,
    scrollTarget: 'chapel-contact',
    hint: 'Opens direct channels for collaboration — GitHub, LinkedIn, Email & full-stack AI engineering roles.',
  },
  {
    id: 'bell-resonance-font',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:chapel:font' },
    label: '💧 Crystal Resonance Font',
    style: 'sky-chapel',
    labelLift: 1.0,
    scrollTarget: 'chapel-trial',
    hint: 'Once 6 / 6 Plumes harmonize here, return to the Grand Sky Plaza Azure Crystal!',
  },
  {
    id: 'vow-lectern',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:chapel:lectern' },
    label: '✉️ Open Collaboration Lectern',
    style: 'sky-chapel',
    labelLift: 0.5,
    scrollTarget: 'chapel-contact',
    hint: 'Current status, open roles, and verified contact channels for Zulfan.',
  },
  {
    id: 'plume-sanctuary',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:chapel:sanctuary' },
    label: '🪶 Six Plumes Shrine',
    style: 'sky-chapel',
    labelLift: 0.5,
    scrollTarget: 'chapel-plumes-ledger',
    hint: 'Inspect your full progress toward awakening Sky Castle Avalon’s Azure Crystal.',
  },
  {
    id: 'exit',
    kind: 'exit',
    x: 7,
    y: 11,
    w: 1,
    h: 1,
    target: { type: 'place', id: 'sky-castle' },
    label: 'Exit',
    style: 'sky-chapel',
    hideLabel: true,
  },
];

const GUARDIANS: SkyGuardianPlacement[] = [
  { kind: 'pmd', id: 'arceus', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.88, fallbackColor: '#fef08a' },
  { kind: 'digimon', id: 'seraphimon', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.8, fallbackColor: '#60a5fa' },
  { kind: 'digimon', id: 'sakuyamon', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.8, fallbackColor: '#facc15' },
];

let bgCache: HTMLCanvasElement | null = null;

function drawStationDetails(ctx: CanvasRenderingContext2D, tick: number): void {
  const pulse = Math.sin(tick * 0.1) > 0;

  // North Radiant Sapphire Altar (6..8, 1)
  const ax = 6 * TILE_SIZE + 6;
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(ax, 5, 36, 17);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(ax + 6, 7, 24, 12);
  ctx.fillStyle = pulse ? '#fef08a' : '#facc15';
  ctx.fillRect(ax + 16, 8, 4, 10);
  ctx.fillRect(ax + 13, 11, 10, 3);

  // NW Scroll of Honors (1..2, 3..4)
  const hx = 1 * TILE_SIZE + 5;
  const hy = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(hx, hy, 22, 20);
  ctx.fillStyle = '#fef9c3';
  ctx.fillRect(hx + 3, hy + 3, 16, 14);
  ctx.fillStyle = '#eab308';
  ctx.fillRect(hx + 6, hy + 5, 10, 3);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(hx + 5, hy + 11, 12, 2);

  // NE Sapphire Chime Belfry (12..13, 3..4)
  const bx = 12 * TILE_SIZE + 5;
  const by = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#172554';
  ctx.fillRect(bx, by, 22, 20);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(bx + 4, by + 4, 4, 9);
  ctx.fillRect(bx + 10, by + 3, 4, 11);
  ctx.fillRect(bx + 15, by + 5, 4, 8);

  // SW Open Collaboration Lectern (1..2, 8..9)
  const lx = 1 * TILE_SIZE + 6;
  const ly = 8 * TILE_SIZE + 6;
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(lx, ly, 20, 18);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(lx + 3, ly + 4, 14, 10);
  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(lx + 5, ly + 7, 10, 2);
  ctx.fillRect(lx + 5, ly + 11, 7, 2);

  // SE Six Plumes Shrine (12..13, 8..9)
  const sx = 12 * TILE_SIZE + 6;
  const sy = 8 * TILE_SIZE + 6;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(sx, sy, 20, 18);
  ctx.fillStyle = pulse ? '#93c5fd' : '#fde047';
  ctx.fillRect(sx + 8, sy + 4, 4, 10);
  ctx.fillRect(sx + 4, sy + 7, 12, 4);
}

export function renderChapelScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!bgCache) {
    bgCache = buildSkyBackgroundCanvas({
      floorA: '#f8fafc',
      floorB: '#e0f2fe',
      pitA: '#eff6ff',
      pitB: '#dbeafe',
      wallBg: '#172554',
      wallBrick: '#1e3a8a',
      trimGold: '#fde047',
      trimAccent: '#60a5fa',
      bannerColor: '#2563eb',
      carpetColor: '#1d4ed8',
      pedestalOuter: '#172554',
      pedestalInner: '#2563eb',
      lanternColor: '#93c5fd',
      windowSkyTop: '#60a5fa',
      windowCloudBottom: '#f8fafc',
    });
  }

  ctx.drawImage(bgCache, 0, 0);
  drawSkyCloudWindowDrift(ctx, tick);
  drawStationDetails(ctx, tick);

  for (const [lx, ly] of [
    [4, 3],
    [10, 3],
    [4, 9],
    [10, 9],
  ]) {
    drawSkyLantern(ctx, lx, ly, tick, '#93c5fd');
  }

  drawSkyCrystalCenterpiece(ctx, tick, '#60a5fa');
  drawSkyGuardians(ctx, GUARDIANS, tick, pmdAnimator);
  renderSkyWaves(ctx, 'sky-chapel');
}

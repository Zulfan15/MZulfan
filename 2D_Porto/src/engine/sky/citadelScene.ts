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

export const CITADEL_COLS = SKY_INTERIOR_COLS;
export const CITADEL_ROWS = SKY_INTERIOR_ROWS;
export const CITADEL_SPAWN = SKY_INTERIOR_SPAWN;
export const CITADEL_COLLISION = createStandardSkyCollision(false);

export const CITADEL_PROPS: SkyInteriorProp[] = [
  {
    id: 'rayquaza',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:citadel:rayquaza' },
    label: '🐉 Rayquaza · Sky Sovereign',
    style: 'sky-citadel',
    labelLift: 1.3,
    scrollTarget: 'citadel-trial',
    hint: 'Rayquaza guards the upper stratosphere of Avalon! Synchronize all 3 Flagship System Architecture Pillars to earn the Plume of Sovereignty.',
  },
  {
    id: 'sky-throne',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 1,
    target: { type: 'event', name: 'sky:citadel:throne' },
    label: '👑 Marble Sky Throne',
    style: 'sky-citadel',
    labelLift: 0.95,
    scrollTarget: 'citadel-architecture',
    hint: 'White Marble Sovereign Seat crowned in sapphire & gold — executive command over Edge CV, Distributed Platforms & Digital Twin AI.',
  },
  {
    id: 'arch-blueprint',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:citadel:blueprint' },
    label: '📐 System Blueprint Table',
    style: 'sky-citadel',
    labelLift: 0.55,
    scrollTarget: 'citadel-architecture',
    hint: 'Drafting table mapping AeroScan TensorRT pipelines, FoodLink PostgreSQL+PostGIS+Kafka transactions, and Astro static edges.',
  },
  {
    id: 'twin-console',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:citadel:twin' },
    label: '🤖 Digital Twin Nexus',
    style: 'sky-citadel',
    labelLift: 0.55,
    scrollTarget: 'citadel-profile',
    hint: 'Single-Source-of-Truth profile.yaml telemetry terminal powering this entire interactive world and its Cloudflare Worker AI Twin.',
  },
  {
    id: 'imp_paladin',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:citadel:imp_paladin' },
    label: '⚔️ Imperialdramon PM',
    style: 'sky-citadel',
    labelLift: 1.05,
    scrollTarget: 'citadel-architecture',
    hint: 'Founder & Sovereign Knight of the Sky Citadel — verifies end-to-end engineering rigor from PyTorch CUDA kernels to Kubernetes rollout probes.',
  },
  {
    id: 'valkyrimon',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:citadel:valkyrimon' },
    label: '🦅 Valkyrimon',
    style: 'sky-citadel',
    labelLift: 1.05,
    scrollTarget: 'citadel-trial',
    hint: 'Winged Sentinel of Sapphire Skies — oversees architectural clarity, clean modular design, and multi-map latency guarantees.',
  },
  {
    id: 'firmament-orb',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:citadel:orb' },
    label: '💎 Firmament Control Orb',
    style: 'sky-citadel',
    labelLift: 1.0,
    scrollTarget: 'citadel-trial',
    hint: 'Levitating Azure Prism — align the 3 Sovereign Architecture Pillars below to awaken the Plume of Sovereignty!',
  },
  {
    id: 'flagship-ledger',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:citadel:ledger' },
    label: '📜 Flagship Systems Roster',
    style: 'sky-citadel',
    labelLift: 0.5,
    scrollTarget: 'citadel-architecture',
    hint: 'Verified royal records covering AeroScan (>500 FPS), FoodLink (32/32 tests), and Automated OMR Bulk Grading.',
  },
  {
    id: 'envoy-banner',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:citadel:envoy' },
    label: '☁️ Archipelago Sky Chart',
    style: 'sky-citadel',
    labelLift: 0.5,
    scrollTarget: 'citadel-plumes-ledger',
    hint: 'Charts all 6 Celestial Sanctums floating across Sky Castle Archipelago from the Marble Keep down to the Timber Inn.',
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
    style: 'sky-citadel',
    hideLabel: true,
  },
];

const GUARDIANS: SkyGuardianPlacement[] = [
  { kind: 'pmd', id: 'rayquaza', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.9, fallbackColor: '#10b981' },
  { kind: 'digimon', id: 'imp_paladin', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.8, fallbackColor: '#f8fafc' },
  { kind: 'digimon', id: 'valkyrimon', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.8, fallbackColor: '#38bdf8' },
];

let bgCache: HTMLCanvasElement | null = null;

function drawStationDetails(ctx: CanvasRenderingContext2D, tick: number): void {
  const pulse = Math.sin(tick * 0.1) > 0;

  // North Marble Sky Throne crest (6..8, 1)
  const tx = 6 * TILE_SIZE + 8;
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(tx, 5, 32, 17);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(tx + 4, 7, 24, 12);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(tx + 12, 8, 8, 9);
  ctx.fillStyle = pulse ? '#fef08a' : '#38bdf8';
  ctx.fillRect(tx + 15, 10, 2, 4);

  // NW Blueprint Table (1..2, 3..4)
  const bx = 1 * TILE_SIZE + 5;
  const by = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#0c4a6e';
  ctx.fillRect(bx, by, 22, 20);
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 1;
  ctx.strokeRect(bx + 0.5, by + 0.5, 21, 19);
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(bx + 4, by + 5, 14, 2);
  ctx.fillRect(bx + 4, by + 10, 10, 2);
  ctx.fillRect(bx + 4, by + 15, 13, 2);

  // NE Digital Twin Nexus (12..13, 3..4)
  const nx = 12 * TILE_SIZE + 5;
  const ny = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(nx, ny, 22, 20);
  ctx.fillStyle = pulse ? '#38bdf8' : '#a855f7';
  ctx.fillRect(nx + 4, ny + 4, 14, 10);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(nx + 6, ny + 16, 10, 2);

  // SW Flagship Ledger (1..2, 8..9)
  const lx = 1 * TILE_SIZE + 6;
  const ly = 8 * TILE_SIZE + 6;
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(lx, ly, 20, 18);
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(lx + 3, ly + 3, 14, 3);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(lx + 3, ly + 9, 12, 2);
  ctx.fillRect(lx + 3, ly + 13, 10, 2);

  // SE Archipelago Chart (12..13, 8..9)
  const cx = 12 * TILE_SIZE + 5;
  const cy = 8 * TILE_SIZE + 5;
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(cx, cy, 22, 20);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(cx + 9, cy + 3, 4, 4);
  ctx.fillRect(cx + 8, cy + 9, 6, 4);
  ctx.fillRect(cx + 3, cy + 7, 3, 3);
  ctx.fillRect(cx + 16, cy + 7, 3, 3);
  ctx.fillRect(cx + 4, cy + 14, 3, 3);
  ctx.fillRect(cx + 15, cy + 14, 3, 3);
}

export function renderCitadelScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!bgCache) {
    bgCache = buildSkyBackgroundCanvas({
      floorA: '#f1f5f9',
      floorB: '#e2e8f0',
      pitA: '#dbeafe',
      pitB: '#eff6ff',
      wallBg: '#1e3a5f',
      wallBrick: '#334155',
      trimGold: '#facc15',
      trimAccent: '#0284c7',
      bannerColor: '#b91c1c',
      carpetColor: '#b91c1c',
      pedestalOuter: '#0f2942',
      pedestalInner: '#1e40af',
      lanternColor: '#38bdf8',
      windowSkyTop: '#38bdf8',
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
    drawSkyLantern(ctx, lx, ly, tick, '#38bdf8');
  }

  drawSkyCrystalCenterpiece(ctx, tick, '#38bdf8');
  drawSkyGuardians(ctx, GUARDIANS, tick, pmdAnimator);
  renderSkyWaves(ctx, 'sky-citadel');
}

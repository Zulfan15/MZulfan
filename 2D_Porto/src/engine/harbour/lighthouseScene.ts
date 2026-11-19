import type { PokemonPMDAnimator } from '../pokemonPMDAnimator';
import {
  HARBOUR_INTERIOR_COLS,
  HARBOUR_INTERIOR_ROWS,
  HARBOUR_INTERIOR_SPAWN,
  type HarbourInteriorProp,
} from '../harbourInteriorShared';
import {
  buildHarbourBackgroundCanvas,
  createStandardHarbourCollision,
  drawHarbourCompassCenterpiece,
  drawHarbourGuardians,
  drawHarbourLantern,
  drawHarbourSeaWindowShimmer,
  renderHarbourWaves,
  type HarbourGuardianPlacement,
} from './harbourSceneBase';
import { TILE_SIZE } from '../sprites';

export const LIGHTHOUSE_COLS = HARBOUR_INTERIOR_COLS;
export const LIGHTHOUSE_ROWS = HARBOUR_INTERIOR_ROWS;
export const LIGHTHOUSE_SPAWN = HARBOUR_INTERIOR_SPAWN;
export const LIGHTHOUSE_COLLISION = createStandardHarbourCollision(false);

export const LIGHTHOUSE_PROPS: HarbourInteriorProp[] = [
  {
    id: 'kyogre',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:lighthouse:kyogre' },
    label: '🌊 Kyogre · Tide Keeper',
    style: 'harbour-beacon',
    labelLift: 1.3,
    scrollTarget: 'lh-beacon-trial',
    hint: 'Kyogre commands the deep horizon! Calibrate all 4 Brass Fresnel Mirrors to lock the Lighthouse beam and claim the Seal of the Beacon.',
  },
  {
    id: 'fresnel-lens',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 1,
    target: { type: 'event', name: 'harbour:lighthouse:lens' },
    label: '💡 Royal Fresnel Prism',
    style: 'harbour-beacon',
    labelLift: 0.95,
    scrollTarget: 'lh-beacon-trial',
    hint: 'Royal Glass Fresnel Lens Array — magnifies coastal lantern light into a piercing golden beam guiding ships across Avalon Bay.',
  },
  {
    id: 'edge-radar',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:lighthouse:radar' },
    label: '🛰️ Edge Telemetry Chart',
    style: 'harbour-beacon',
    labelLift: 0.55,
    scrollTarget: 'lh-telemetry-section',
    hint: 'Edge AI & Cloud Telemetry Desk — inspect AeroScan ~1.8ms TensorRT FP16 inference and Astro + Cloudflare Workers architecture.',
  },
  {
    id: 'astrolabe-desk',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:lighthouse:astrolabe' },
    label: '🧭 Brass Astrolabe',
    style: 'harbour-beacon',
    labelLift: 0.55,
    scrollTarget: 'lh-telemetry-section',
    hint: 'Brass Admiralty Astrolabe — charts Kubernetes HPA probes, Redis distributed locks, and HCIA-Security perimeter defenses.',
  },
  {
    id: 'palkia',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:lighthouse:palkia' },
    label: '🌌 Palkia',
    style: 'harbour-beacon',
    labelLift: 1.05,
    scrollTarget: 'lh-telemetry-section',
    hint: 'Palkia folds distance at the network edge — connecting Cloudflare Workers, Astro static routes, and sub-2ms TensorRT frames.',
  },
  {
    id: 'azulongmon',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:lighthouse:azulongmon' },
    label: '🐉 Azulongmon',
    style: 'harbour-beacon',
    labelLift: 1.05,
    scrollTarget: 'lh-beacon-trial',
    hint: 'Azulongmon unleashes sapphire lightning to clear harbour fog! Align the 4 mirrors below to synchronize its beacon charge.',
  },
  {
    id: 'beacon-prism',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:lighthouse:prism' },
    label: '✨ Beacon Mirror Dial',
    style: 'harbour-beacon',
    labelLift: 1.0,
    scrollTarget: 'lh-beacon-trial',
    hint: 'Central Beacon Mirror Dial — adjust all four coastal prism stations to 0° True Harbor North!',
  },
  {
    id: 'signal-bell',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:lighthouse:bell' },
    label: '🔔 Fog Signal Bell',
    style: 'harbour-beacon',
    labelLift: 0.5,
    scrollTarget: 'lh-beacon-trial',
    hint: 'Cast Bronze Fog Bell — rings out across the shoals alongside the rotating lighthouse beam.',
  },
  {
    id: 'spiral-stairs',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:lighthouse:stairs' },
    label: '🪜 Lantern Gallery Stairs',
    style: 'harbour-beacon',
    labelLift: 0.5,
    scrollTarget: 'lh-seals-ledger',
    hint: 'Curved limestone staircase leading down to the Northwest Coastal Bluff and Royal Customs Quay.',
  },
  {
    id: 'exit',
    kind: 'exit',
    x: 7,
    y: 11,
    w: 1,
    h: 1,
    target: { type: 'place', id: 'harbour' },
    label: 'Exit',
    style: 'harbour-beacon',
    hideLabel: true,
  },
];

const GUARDIANS: HarbourGuardianPlacement[] = [
  { kind: 'pmd', id: 'kyogre', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.88, fallbackColor: '#0284c7' },
  { kind: 'pmd', id: 'palkia', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.84, fallbackColor: '#a855f7' },
  { kind: 'digimon', id: 'azulongmon', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.8, fallbackColor: '#38bdf8' },
];

let bgCache: HTMLCanvasElement | null = null;

function drawStationDetails(ctx: CanvasRenderingContext2D, tick: number): void {
  const blink = Math.sin(tick * 0.12) > 0;

  // North Fresnel Lens glowing prism fixture (6..8, 1)
  const fx = 6 * TILE_SIZE + 8;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(fx, 8, 32, 14);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(fx + 4, 10, 24, 10);
  ctx.fillStyle = blink ? '#fef9c3' : '#f59e0b';
  ctx.fillRect(fx + 10, 12, 12, 6);

  // NW Edge Telemetry radar screen (1..2, 3..4)
  const rx = 1 * TILE_SIZE + 5;
  const ry = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#082f49';
  ctx.fillRect(rx, ry, 22, 20);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.strokeRect(rx + 0.5, ry + 0.5, 21, 19);
  ctx.fillStyle = blink ? '#34d399' : '#38bdf8';
  ctx.fillRect(rx + 4, ry + 5, 14, 2);
  ctx.fillRect(rx + 6, ry + 11, 10, 2);
  ctx.fillRect(rx + 9, ry + 15, 4, 2);

  // NE Brass Astrolabe rings (12..13, 3..4)
  const ax = 13 * TILE_SIZE;
  const ay = 4 * TILE_SIZE;
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(ax, ay, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(ax, ay, 4, 0, Math.PI * 2);
  ctx.stroke();

  // SW Fog Signal Bell (1..2, 8..9)
  const bx = 2 * TILE_SIZE;
  const by = 9 * TILE_SIZE;
  ctx.fillStyle = '#d97706';
  ctx.fillRect(bx - 5, by - 7, 10, 9);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(bx - 6, by + 2, 12, 2);

  // SE Spiral Turret Steps (12..13, 8..9)
  const sx = 12 * TILE_SIZE + 4;
  const sy = 8 * TILE_SIZE + 5;
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#94a3b8' : '#cbd5e1';
    ctx.fillRect(sx + i * 2, sy + i * 5, 22 - i * 3, 4);
  }
}

export function renderLighthouseScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!bgCache) {
    bgCache = buildHarbourBackgroundCanvas({
      floorA: '#dad6cb',
      floorB: '#cbc5b6',
      pitA: '#0d263e',
      pitB: '#123352',
      wallBg: '#1e293b',
      wallBrick: '#334155',
      trimBrass: '#f59e0b',
      trimAccent: '#0284c7',
      bannerColor: '#0369a1',
      carpetColor: '#0c4a6e',
      lanternColor: '#fde047',
      windowSkyTop: '#7dd3fc',
      windowSeaBottom: '#0369a1',
    });
  }

  ctx.drawImage(bgCache, 0, 0);
  drawHarbourSeaWindowShimmer(ctx, tick);
  drawStationDetails(ctx, tick);

  // Dual sweeping Fresnel lighthouse beams across the central octagonal pit
  ctx.save();
  const sweepAngle = tick * 0.025;
  ctx.translate(7.5 * TILE_SIZE, 6.5 * TILE_SIZE);
  ctx.rotate(sweepAngle);
  ctx.fillStyle = 'rgba(253, 224, 71, 0.16)';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 58, -0.24, 0.24);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 58, Math.PI - 0.24, Math.PI + 0.24);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  drawHarbourLantern(ctx, 4, 3, tick, '#fde047');
  drawHarbourLantern(ctx, 10, 3, tick, '#fde047');
  drawHarbourLantern(ctx, 4, 9, tick, '#38bdf8');
  drawHarbourLantern(ctx, 10, 9, tick, '#38bdf8');
  drawHarbourCompassCenterpiece(ctx, tick, '#fde047');
  drawHarbourGuardians(ctx, GUARDIANS, tick, pmdAnimator);
  renderHarbourWaves(ctx, 'harbour-lighthouse');
}

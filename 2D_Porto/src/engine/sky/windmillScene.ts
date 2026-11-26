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

export const WINDMILL_COLS = SKY_INTERIOR_COLS;
export const WINDMILL_ROWS = SKY_INTERIOR_ROWS;
export const WINDMILL_SPAWN = SKY_INTERIOR_SPAWN;
export const WINDMILL_COLLISION = createStandardSkyCollision(false);

export const WINDMILL_PROPS: SkyInteriorProp[] = [
  {
    id: 'latios',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:windmill:latios' },
    label: '💙 Latios · Jet Navigator',
    style: 'sky-windmill',
    labelLift: 1.3,
    scrollTarget: 'windmill-trial',
    hint: 'Latios rides stratospheric currents faster than light! Calibrate the 4 Turbine Blades to <2 ms TensorRT inference to claim the Plume of Gale.',
  },
  {
    id: 'wind-shaft',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 1,
    target: { type: 'event', name: 'sky:windmill:shaft' },
    label: '🌬️ Oak Rotor Drive Shaft',
    style: 'sky-windmill',
    labelLift: 0.95,
    scrollTarget: 'windmill-aeroscan',
    hint: 'Massive wind-driven timber axle converting high-altitude gusts into steady TensorRT FP16 compute power.',
  },
  {
    id: 'aeroscan-radar',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:windmill:radar' },
    label: '🛩️ AeroScan Vision Scope',
    style: 'sky-windmill',
    labelLift: 0.55,
    scrollTarget: 'windmill-aeroscan',
    hint: 'Custom YOLOv11s trained across 15 military aircraft classes reaching up to 87.9% mAP@50 with Streamlit command audits.',
  },
  {
    id: 'tensorrt-bench',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:windmill:bench' },
    label: '⚡ ONNX → TensorRT 10 Rig',
    style: 'sky-windmill',
    labelLift: 0.55,
    scrollTarget: 'windmill-aeroscan',
    hint: 'Compiles PyTorch 2.6 weights via ONNX into a compact 22.1 MB TensorRT 10 FP16 engine delivering ~1.8 ms/frame (>500 FPS) on RTX 4060.',
  },
  {
    id: 'vortexdramon',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:windmill:vortexdramon' },
    label: '🌪️ Vortexdramon',
    style: 'sky-windmill',
    labelLift: 1.05,
    scrollTarget: 'windmill-aeroscan',
    hint: 'Vortexdramon channels jetstream aerodynamics — keeping AeroScan real-time webcam & aerial video ingestion zero-stutter.',
  },
  {
    id: 'varodurumon',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:windmill:varodurumon' },
    label: '🕊️ Varodurumon',
    style: 'sky-windmill',
    labelLift: 1.05,
    scrollTarget: 'windmill-trial',
    hint: 'Guardian Bird of Six Wings — inspects every bounding box prediction from 12 GB of curated PASCAL VOC aerial imagery.',
  },
  {
    id: 'turbine-dial',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:windmill:dial' },
    label: '⚙️ Wind-Pitch Calibration Dial',
    style: 'sky-windmill',
    labelLift: 1.0,
    scrollTarget: 'windmill-trial',
    hint: 'Central Wind-Pitch Dial — lock all 4 turbine blades below to tune AeroScan throughput!',
  },
  {
    id: 'dataset-crates',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:windmill:crates' },
    label: '📦 12 GB PASCAL VOC Crates',
    style: 'sky-windmill',
    labelLift: 0.5,
    scrollTarget: 'windmill-aeroscan',
    hint: 'Validated ETL pipeline output: ~8,400 curated aerial imagery samples split deterministically (80 / 15 / 5).',
  },
  {
    id: 'anemometer',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:windmill:anemometer' },
    label: '💨 Jetstream Gauge Array',
    style: 'sky-windmill',
    labelLift: 0.5,
    scrollTarget: 'windmill-trial',
    hint: 'Brass anemometer tracking live mill RPM alongside TensorRT batch throughput.',
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
    style: 'sky-windmill',
    hideLabel: true,
  },
];

const GUARDIANS: SkyGuardianPlacement[] = [
  { kind: 'pmd', id: 'latios', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.88, fallbackColor: '#38bdf8' },
  { kind: 'digimon', id: 'vortexdramon', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.8, fallbackColor: '#22c55e' },
  { kind: 'digimon', id: 'varodurumon', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.8, fallbackColor: '#f8fafc' },
];

let bgCache: HTMLCanvasElement | null = null;

function drawStationDetails(ctx: CanvasRenderingContext2D, tick: number): void {
  const spin = Math.floor(tick / 10) % 2;

  // North Rotating Wooden Rotor Shaft (6..8, 1)
  const sx = 6 * TILE_SIZE + 8;
  ctx.fillStyle = '#451a03';
  ctx.fillRect(sx, 7, 32, 13);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(sx + 4, 11, 24, 5);
  ctx.fillStyle = '#fde68a';
  if (spin === 0) {
    ctx.fillRect(sx + 14, 6, 4, 15);
    ctx.fillRect(sx + 9, 12, 14, 3);
  } else {
    ctx.fillRect(sx + 10, 8, 4, 11);
    ctx.fillRect(sx + 18, 8, 4, 11);
  }

  // NW AeroScan Radar Scope (1..2, 3..4)
  const rx = 1 * TILE_SIZE + 5;
  const ry = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#052e16';
  ctx.fillRect(rx, ry, 22, 20);
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 1;
  ctx.strokeRect(rx + 0.5, ry + 0.5, 21, 19);
  ctx.fillStyle = spin === 0 ? '#4ade80' : '#facc15';
  ctx.fillRect(rx + 4, ry + 6, 6, 4);
  ctx.fillRect(rx + 12, ry + 11, 6, 4);

  // NE TensorRT Bench (12..13, 3..4)
  const bx = 12 * TILE_SIZE + 5;
  const by = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(bx, by, 22, 20);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(bx + 3, by + 5, 16, 4);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(bx + 3, by + 11, 12, 4);

  // SW Dataset Crates (1..2, 8..9)
  const cx = 1 * TILE_SIZE + 5;
  const cy = 8 * TILE_SIZE + 5;
  ctx.fillStyle = '#92400e';
  ctx.fillRect(cx, cy, 22, 20);
  ctx.strokeStyle = '#fcd34d';
  ctx.strokeRect(cx + 1.5, cy + 1.5, 19, 17);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(cx + 4, cy + 8, 14, 3);

  // SE Jetstream Gauge (12..13, 8..9)
  const ax = 12 * TILE_SIZE + 16;
  const ay = 8 * TILE_SIZE + 15;
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(ax, ay, 7, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(ax - 1, spin === 0 ? ay - 5 : ay, 2, 5);
}

export function renderWindmillScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!bgCache) {
    bgCache = buildSkyBackgroundCanvas({
      floorA: '#78350f',
      floorB: '#6b2f0e',
      pitA: '#1e3a5f',
      pitB: '#0f2942',
      wallBg: '#451a03',
      wallBrick: '#92400e',
      trimGold: '#fbbf24',
      trimAccent: '#0284c7',
      bannerColor: '#0369a1',
      carpetColor: '#0284c7',
      pedestalOuter: '#451a03',
      pedestalInner: '#78350f',
      isWoodDeck: true,
      lanternColor: '#fbbf24',
      windowSkyTop: '#7dd3fc',
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
    drawSkyLantern(ctx, lx, ly, tick, '#fbbf24');
  }

  drawSkyCrystalCenterpiece(ctx, tick, '#fbbf24');
  drawSkyGuardians(ctx, GUARDIANS, tick, pmdAnimator);
  renderSkyWaves(ctx, 'sky-windmill');
}

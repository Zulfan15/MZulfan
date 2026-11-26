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

export const OBSERVATORY_COLS = SKY_INTERIOR_COLS;
export const OBSERVATORY_ROWS = SKY_INTERIOR_ROWS;
export const OBSERVATORY_SPAWN = SKY_INTERIOR_SPAWN;
export const OBSERVATORY_COLLISION = createStandardSkyCollision(false);

export const OBSERVATORY_PROPS: SkyInteriorProp[] = [
  {
    id: 'deoxys',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:observatory:deoxys' },
    label: '🧬 Deoxys · Astral Researcher',
    style: 'sky-observatory',
    labelLift: 1.3,
    scrollTarget: 'observatory-trial',
    hint: 'Deoxys decodes cosmic anomalies! Focus all 4 Amethyst Research Lenses to 0° below to claim the Plume of Starlight.',
  },
  {
    id: 'brass-telescope',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 1,
    target: { type: 'event', name: 'sky:observatory:telescope' },
    label: '🔭 Brushed-Gold Sky Telescope',
    style: 'sky-observatory',
    labelLift: 0.95,
    scrollTarget: 'observatory-research',
    hint: 'Twin-lens observatory dome scanning hybrid NLP trigrams, transfer-learning medical features, and OMR bubble alignment.',
  },
  {
    id: 'nlp-lens-desk',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:observatory:nlp' },
    label: '🔬 Hybrid NLP Prism Desk',
    style: 'sky-observatory',
    labelLift: 0.55,
    scrollTarget: 'observatory-research',
    hint: 'Thesis pipeline pairing 1,000 TF-IDF character trigrams with 9 statistical obfuscation signals (99.56% F1).',
  },
  {
    id: 'amethyst-array',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:observatory:amethyst' },
    label: '🔮 Resonant Amethyst Array',
    style: 'sky-observatory',
    labelLift: 0.55,
    scrollTarget: 'observatory-trial',
    hint: 'Rotate the 4 spectral amethyst prisms below until all star-lenses lock into 0° focus.',
  },
  {
    id: 'gracenovamon',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:observatory:gracenovamon' },
    label: '🌌 GraceNovamon',
    style: 'sky-observatory',
    labelLift: 1.05,
    scrollTarget: 'observatory-research',
    hint: 'Galaxy-scale fusion guardian verifying reproducible 10-fold stratified cross-validation & SMOTE calibration.',
  },
  {
    id: 'amaterasumon',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:observatory:amaterasumon' },
    label: '☀️ Amaterasumon',
    style: 'sky-observatory',
    labelLift: 1.05,
    scrollTarget: 'observatory-papers',
    hint: 'Illuminates dark corners of noisy datasets — from obfuscated Indonesian gambling spam to clinical skin lesions.',
  },
  {
    id: 'orrery-core',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:observatory:orrery' },
    label: '🪐 Astral Orrery Core',
    style: 'sky-observatory',
    labelLift: 1.0,
    scrollTarget: 'observatory-trial',
    hint: 'Central celestial gyroscope linking experimental hypotheses to measurable validation results.',
  },
  {
    id: 'cv-plates',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:observatory:plates' },
    label: '📊 Experiment Star-Plates',
    style: 'sky-observatory',
    labelLift: 0.5,
    scrollTarget: 'observatory-papers',
    hint: 'InceptionV3 skin-cancer transfer learning & FastAPI/OpenCV automated OMR grading benchmarks.',
  },
  {
    id: 'star-almanac',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:observatory:almanac' },
    label: '📜 Astral Plume Almanac',
    style: 'sky-observatory',
    labelLift: 0.5,
    scrollTarget: 'observatory-plumes-ledger',
    hint: 'Inspect all 6 Celestial Plumes required to awaken the Azure Sky Crystal.',
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
    style: 'sky-observatory',
    hideLabel: true,
  },
];

const GUARDIANS: SkyGuardianPlacement[] = [
  { kind: 'pmd', id: 'deoxys', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.88, fallbackColor: '#a855f7' },
  { kind: 'digimon', id: 'gracenovamon', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.8, fallbackColor: '#c084fc' },
  { kind: 'digimon', id: 'amaterasumon', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.8, fallbackColor: '#fbbf24' },
];

let bgCache: HTMLCanvasElement | null = null;

function drawStationDetails(ctx: CanvasRenderingContext2D, tick: number): void {
  const pulse = Math.sin(tick * 0.11) > 0;

  // North Brushed-Gold Sky Telescope (6..8, 1)
  const tx = 6 * TILE_SIZE + 6;
  ctx.fillStyle = '#312e81';
  ctx.fillRect(tx, 4, 36, 18);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(tx + 6, 8, 24, 7);
  ctx.fillStyle = pulse ? '#e879f9' : '#38bdf8';
  ctx.fillRect(tx + 24, 7, 6, 9);

  // NW Hybrid NLP Prism Desk (1..2, 3..4)
  const nx = 1 * TILE_SIZE + 5;
  const ny = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(nx, ny, 22, 20);
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(nx + 4, ny + 4, 14, 10);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(nx + 6, ny + 7, 10, 3);

  // NE Resonant Amethyst Array (12..13, 3..4)
  const ax = 12 * TILE_SIZE + 5;
  const ay = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#312e81';
  ctx.fillRect(ax, ay, 22, 20);
  ctx.fillStyle = pulse ? '#c084fc' : '#9333ea';
  ctx.fillRect(ax + 5, ay + 4, 4, 12);
  ctx.fillRect(ax + 12, ay + 3, 5, 13);

  // SW Experiment Star-Plates (1..2, 8..9)
  const sx = 1 * TILE_SIZE + 6;
  const sy = 8 * TILE_SIZE + 6;
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(sx, sy, 20, 18);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(sx + 3, sy + 3, 14, 2);
  ctx.fillStyle = '#c4b5fd';
  ctx.fillRect(sx + 3, sy + 8, 10, 2);
  ctx.fillRect(sx + 3, sy + 12, 13, 2);

  // SE Astral Almanac (12..13, 8..9)
  const bx = 12 * TILE_SIZE + 6;
  const by = 8 * TILE_SIZE + 6;
  ctx.fillStyle = '#4c1d95';
  ctx.fillRect(bx, by, 20, 18);
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(bx + 3, by + 3, 14, 12);
  ctx.fillStyle = '#7c3aed';
  ctx.fillRect(bx + 9, by + 3, 2, 12);
}

export function renderObservatoryScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!bgCache) {
    bgCache = buildSkyBackgroundCanvas({
      floorA: '#ede9fe',
      floorB: '#ddd6fe',
      pitA: '#f3e8ff',
      pitB: '#e9d5ff',
      wallBg: '#1e1b4b',
      wallBrick: '#312e81',
      trimGold: '#fbbf24',
      trimAccent: '#a855f7',
      bannerColor: '#6d28d9',
      carpetColor: '#581c87',
      pedestalOuter: '#1e1b4b',
      pedestalInner: '#5b21b6',
      lanternColor: '#c084fc',
      windowSkyTop: '#312e81',
      windowCloudBottom: '#e9d5ff',
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
    drawSkyLantern(ctx, lx, ly, tick, '#c084fc');
  }

  drawSkyCrystalCenterpiece(ctx, tick, '#c084fc');
  drawSkyGuardians(ctx, GUARDIANS, tick, pmdAnimator);
  renderSkyWaves(ctx, 'sky-observatory');
}

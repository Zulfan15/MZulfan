import type { DigimonCatalogEntry } from './digimonCatalog';

export type MountPosture = 'saddle' | 'shoulder' | 'pillion' | 'aura-platform';

export interface DirectionalOffset {
  dx: number;
  dy: number;
}

export interface MountRigSpec {
  posture: MountPosture;
  down: DirectionalOffset;
  up: DirectionalOffset;
  right: DirectionalOffset;
  left?: DirectionalOffset;
  seatShadowRx?: number;
  seatShadowRy?: number;
  auraColor?: string;
}

/**
 * Calibrated per-species saddle, shoulder, pillion & aura-platform offsets
 * relative to `(coreX, coreY)` (`drawX + 8`, `drawY + 16`), derived from
 * real PMD sprite frame bounds so riders sit cleanly on anatomy instead of overlapping faces.
 */
export const POKEMON_MOUNT_RIGS: Record<string, MountRigSpec> = {
  // ── 1. Flying / Jet / Winged Dragon Saddles ─────────────────────────
  latios:     { posture: 'saddle', down: { dx: 0, dy: -22 }, right: { dx: -3, dy: -24 }, up: { dx: 0, dy: -23 }, seatShadowRx: 5 },
  latias:     { posture: 'saddle', down: { dx: 0, dy: -20 }, right: { dx: -3, dy: -22 }, up: { dx: 0, dy: -22 }, seatShadowRx: 5 },
  rayquaza:   { posture: 'saddle', down: { dx: 0, dy: -24 }, right: { dx: -4, dy: -24 }, up: { dx: 0, dy: -22 }, seatShadowRx: 5 },
  charizard:  { posture: 'saddle', down: { dx: 0, dy: -24 }, right: { dx: -5, dy: -23 }, up: { dx: 0, dy: -24 }, seatShadowRx: 5 },
  lugia:      { posture: 'saddle', down: { dx: 0, dy: -23 }, right: { dx: -5, dy: -21 }, up: { dx: 0, dy: -23 }, seatShadowRx: 5.5 },
  lunala:     { posture: 'saddle', down: { dx: 0, dy: -22 }, right: { dx: -3, dy: -22 }, up: { dx: 0, dy: -22 }, seatShadowRx: 5 },
  reshiram:   { posture: 'saddle', down: { dx: 0, dy: -22 }, right: { dx: -5, dy: -19 }, up: { dx: 0, dy: -21 }, seatShadowRx: 5 },
  zekrom:     { posture: 'saddle', down: { dx: 0, dy: -23 }, right: { dx: -5, dy: -21 }, up: { dx: 0, dy: -22 }, seatShadowRx: 5 },
  giratina:   { posture: 'saddle', down: { dx: 0, dy: -22 }, right: { dx: -6, dy: -22 }, up: { dx: 0, dy: -23 }, seatShadowRx: 5.5 },
  kyurem:     { posture: 'saddle', down: { dx: 0, dy: -22 }, right: { dx: -4, dy: -22 }, up: { dx: 0, dy: -22 }, seatShadowRx: 5 },
  salamence:  { posture: 'saddle', down: { dx: 0, dy: -18 }, right: { dx: -3, dy: -19 }, up: { dx: 0, dy: -18 }, seatShadowRx: 5 },
  eternatus:  { posture: 'saddle', down: { dx: 0, dy: -25 }, right: { dx: -5, dy: -24 }, up: { dx: 0, dy: -25 }, seatShadowRx: 5 },
  necrozma:   { posture: 'saddle', down: { dx: 0, dy: -25 }, right: { dx: -3, dy: -24 }, up: { dx: 0, dy: -25 }, seatShadowRx: 5 },
  garchomp:   { posture: 'saddle', down: { dx: 0, dy: -24 }, right: { dx: -4, dy: -23 }, up: { dx: 0, dy: -24 }, seatShadowRx: 5 },

  // ── 2. Quadruped / Land / Surf Saddles ──────────────────────────────
  arceus:      { posture: 'saddle', down: { dx: 0, dy: -24 }, right: { dx: -5, dy: -22 }, up: { dx: 0, dy: -24 }, seatShadowRx: 5 },
  dialga:      { posture: 'saddle', down: { dx: 0, dy: -24 }, right: { dx: -4, dy: -24 }, up: { dx: 0, dy: -25 }, seatShadowRx: 5.5 },
  palkia:      { posture: 'saddle', down: { dx: 0, dy: -23 }, right: { dx: -4, dy: -21 }, up: { dx: 0, dy: -24 }, seatShadowRx: 5 },
  solgaleo:    { posture: 'saddle', down: { dx: 0, dy: -22 }, right: { dx: -4, dy: -20 }, up: { dx: 0, dy: -21 }, seatShadowRx: 5.5 },
  koraidon:    { posture: 'saddle', down: { dx: 0, dy: -24 }, right: { dx: -6, dy: -22 }, up: { dx: 0, dy: -23 }, seatShadowRx: 5 },
  gougingfire: { posture: 'saddle', down: { dx: 0, dy: -21 }, right: { dx: -6, dy: -20 }, up: { dx: 0, dy: -22 }, seatShadowRx: 5.5 },
  greattusk:   { posture: 'saddle', down: { dx: 0, dy: -19 }, right: { dx: -4, dy: -19 }, up: { dx: 0, dy: -19 }, seatShadowRx: 5.5 },
  samurott:    { posture: 'saddle', down: { dx: 0, dy: -18 }, right: { dx: -3, dy: -17 }, up: { dx: 0, dy: -18 }, seatShadowRx: 5 },
  archaludon:  { posture: 'saddle', down: { dx: 0, dy: -21 }, right: { dx: -4, dy: -20 }, up: { dx: 0, dy: -21 }, seatShadowRx: 5 },
  groudon:     { posture: 'saddle', down: { dx: 0, dy: -20 }, right: { dx: -4, dy: -20 }, up: { dx: 0, dy: -21 }, seatShadowRx: 5.5 },
  kyogre:      { posture: 'saddle', down: { dx: 0, dy: -17 }, right: { dx: -4, dy: -17 }, up: { dx: 0, dy: -17 }, seatShadowRx: 5.5 },
  gyarados:    { posture: 'saddle', down: { dx: 0, dy: -24 }, right: { dx: -5, dy: -23 }, up: { dx: 0, dy: -25 }, seatShadowRx: 5 },

  // ── 3. Giant Bipedal Shoulder Perches ───────────────────────────────
  regigigas: { posture: 'shoulder', down: { dx: 8, dy: -29 }, up: { dx: -8, dy: -29 }, right: { dx: -3, dy: -29 }, seatShadowRx: 4.5 },
  tyranitar: { posture: 'shoulder', down: { dx: 7, dy: -28 }, up: { dx: -7, dy: -28 }, right: { dx: -4, dy: -28 }, seatShadowRx: 4.5 },
  urshifu:   { posture: 'shoulder', down: { dx: 6, dy: -28 }, up: { dx: -6, dy: -28 }, right: { dx: -3, dy: -29 }, seatShadowRx: 4.5 },
  snorlax:   { posture: 'shoulder', down: { dx: 0, dy: -24 }, up: { dx: 0, dy: -24 }, right: { dx: -2, dy: -25 }, seatShadowRx: 5 },

  // ── 4. Psychic / Agile Partner Aura Platforms ───────────────────────
  mewtwo:    { posture: 'aura-platform', auraColor: '#c084fc', down: { dx: 11, dy: -16 }, up: { dx: -11, dy: -16 }, right: { dx: -13, dy: -15 } },
  gardevoir: { posture: 'aura-platform', auraColor: '#34d399', down: { dx: 10, dy: -14 }, up: { dx: -10, dy: -14 }, right: { dx: -12, dy: -14 } },
  celebi:    { posture: 'aura-platform', auraColor: '#4ade80', down: { dx: 9, dy: -14 },  up: { dx: -9, dy: -14 },  right: { dx: -11, dy: -14 } },
  darkrai:   { posture: 'aura-platform', auraColor: '#a855f7', down: { dx: 11, dy: -16 }, up: { dx: -11, dy: -16 }, right: { dx: -13, dy: -16 } },
  lucario:   { posture: 'aura-platform', auraColor: '#38bdf8', down: { dx: 10, dy: -14 }, up: { dx: -10, dy: -14 }, right: { dx: -12, dy: -14 } },
  empoleon:  { posture: 'aura-platform', auraColor: '#38bdf8', down: { dx: 10, dy: -14 }, up: { dx: -10, dy: -14 }, right: { dx: -12, dy: -14 } },
  deoxys:    { posture: 'aura-platform', auraColor: '#f97316', down: { dx: 11, dy: -16 }, up: { dx: -11, dy: -16 }, right: { dx: -13, dy: -15 } },
  xurkitree: { posture: 'aura-platform', auraColor: '#facc15', down: { dx: 11, dy: -16 }, up: { dx: -11, dy: -16 }, right: { dx: -13, dy: -15 } },
  pheromosa: { posture: 'aura-platform', auraColor: '#f472b6', down: { dx: 11, dy: -16 }, up: { dx: -11, dy: -16 }, right: { dx: -13, dy: -15 } },
};

const PILLION_DIGIMON_IDS = new Set([
  'shogun_alphamon',
  'beelzemon',
  'titamon_skullbaluchimon',
  'sakuyamon_x',
  'fiery_biker_warrior',
]);

const SADDLE_DIGIMON_IDS = new Set([
  'fivedramon',
  'gammamon',
  'azulongmon',
  'baihumon',
  'zhuqiaomon',
  'metalseadramon',
  'imp_dragon',
  'examon_x',
  'fanglongmon_rm',
  'fenriloogamon_tm',
  'heavymetaldramon',
  'malgadramon',
  'megidramon_x',
  'machinedramon',
  'granlocomon',
  'plesiomon',
  'phoenixmon',
  'varodurumon',
  'crossmon',
  'chronomon_dm',
]);

const AURA_DIGIMON_IDS = new Set<string>([]);

const DEFAULT_FALLBACK_RIG: MountRigSpec = {
  posture: 'saddle',
  down: { dx: 0, dy: -21 },
  right: { dx: -4, dy: -20 },
  up: { dx: 0, dy: -20 },
  seatShadowRx: 5,
};

/**
 * Resolves the tailored rider posture and directional seat offsets for any Pokémon or Digimon mount.
 */
export function resolveMountRig(
  mountId: string,
  digiMount?: DigimonCatalogEntry
): MountRigSpec {
  const fid = mountId.toLowerCase();

  if (digiMount) {
    // Mirrors TownEngine.drawDigimonOverworldSprite height calculation at heightScale=1.24 (footY = coreY + 3)
    const targetH = Math.max(18, Math.round((digiMount.overworldTargetHeight || 34) * 1.24));

    if (fid === 'gammamon') {
      return {
        posture: 'saddle',
        down: { dx: 0, dy: Math.round(3 - targetH * 0.48) },
        up: { dx: 0, dy: Math.round(3 - targetH * 0.48) },
        right: { dx: -6, dy: Math.round(3 - targetH * 0.46) },
        seatShadowRx: 5.5,
      };
    }

    if (PILLION_DIGIMON_IDS.has(fid)) {
      return {
        posture: 'pillion',
        down: { dx: 0, dy: Math.round(3 - targetH * 0.84) },
        up: { dx: 0, dy: Math.round(3 - targetH * 0.56) },
        right: { dx: -7, dy: Math.round(3 - targetH * 0.63) },
        seatShadowRx: 4.5,
      };
    }

    if (SADDLE_DIGIMON_IDS.has(fid)) {
      const saddleY = Math.round(3 - targetH * 0.62);
      return {
        posture: 'saddle',
        down: { dx: 0, dy: saddleY },
        up: { dx: 0, dy: saddleY - 1 },
        right: { dx: -4, dy: saddleY },
        seatShadowRx: 5,
      };
    }

    if (AURA_DIGIMON_IDS.has(fid)) {
      return {
        posture: 'aura-platform',
        auraColor: '#38bdf8',
        down: { dx: 10, dy: -14 },
        up: { dx: -10, dy: -14 },
        right: { dx: -12, dy: -14 },
      };
    }

    // Default for all humanoid/knight Digimon (Holloknightmon, Jesmon X, Gaspiritamon, WarGreymon, etc.):
    // perch neatly on the upper shoulder just beside the helm.
    const shoulderY = Math.round(3 - targetH * 0.73);
    return {
      posture: 'shoulder',
      down: { dx: 7, dy: shoulderY },
      up: { dx: -7, dy: shoulderY },
      right: { dx: -3, dy: shoulderY - 1 },
      seatShadowRx: 4.2,
    };
  }

  return POKEMON_MOUNT_RIGS[fid] ?? DEFAULT_FALLBACK_RIG;
}

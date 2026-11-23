import type { DigimonCatalogEntry, OverworldPoseMap } from '../../../engine/digimonCatalog';
import type { SlicedDigimonSprites } from '../../../engine/digiSpriteLoader';
import { loadMastenamon } from '../mastenamon.loader';
import { MASTENAMON_META } from '../mastenamon.meta';

/**
 * Layout inside `adaptMastenamonForPortfolio().overworld`:
 * - [0..7]   : idle (`S, SW, W, NW, N, NE, E, SE`) from `idle.png`
 * - [8..39]  : walk (`S(8..11), SW(12..15), W(16..19), NW(20..23), N(24..27), NE(28..31), E(32..35), SE(36..39)`) from `walk-cycle.png`
 * - [40..47] : battle (`0..7`) from `battle.png`
 */
export const MASTENAMON_PORTFOLIO_POSE_MAP: OverworldPoseMap = {
  back: [24, 25, 26, 27],
  front: [8, 9, 10, 11],
  side: [16, 17, 18, 19],
  west: [16, 17, 18, 19],
  east: [32, 33, 34, 35],
  idle: {
    front: [0],
    west: [2],
    back: [4],
    east: [6],
  },
  action: [44, 45, 41, 43],
  nativeFacing: 'left',
};

export const MASTENAMON_PORTFOLIO_ENTRY: DigimonCatalogEntry = {
  ...MASTENAMON_META,
  spriteSheetUrl: '/assets/characters/mastenamon/mastenamon.jpg',
  overworldPoseMap: MASTENAMON_PORTFOLIO_POSE_MAP,
};

/** Loads `mastenamon` via the standalone character module and adapts it to `SlicedDigimonSprites`. */
export async function adaptMastenamonForPortfolio(): Promise<SlicedDigimonSprites | null> {
  try {
    const set = await loadMastenamon();
    const idle = set.groups.idle ?? [];
    const walk = set.groups.walk ?? [];
    const battle = set.groups.battle ?? [];
    const hd = set.groups.hd ?? [];

    // Portfolio DigiDex showcases South & South-East HD portraits on Battle Idle,
    // and golden Holy Desire (battle[4]) + cyan Chaos Degradation (battle[5]) on Signature Attack.
    const largeIdle = [hd[0], hd[7]].filter(Boolean);
    const largeAttack = [battle[4], battle[5], battle[1], battle[3]].filter(Boolean);
    const overworld = [...idle, ...walk, ...battle];

    return {
      id: MASTENAMON_META.id,
      icon: set.icon,
      iconDataUrl: set.iconDataUrl,
      largeIdle: largeIdle.length > 0 ? largeIdle : overworld.slice(0, 1),
      largeAttack: largeAttack.length > 0 ? largeAttack : battle.slice(0, 2),
      overworld,
      loadedAt: set.loadedAt,
    };
  } catch {
    return null;
  }
}

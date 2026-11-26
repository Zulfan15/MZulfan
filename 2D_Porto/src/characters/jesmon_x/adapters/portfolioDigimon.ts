import type { DigimonCatalogEntry, OverworldPoseMap } from '../../../engine/digimonCatalog';
import type { DigimonLoadTier, SlicedDigimonSprites } from '../../../engine/digiSpriteLoader';
import { loadJesmonX } from '../jesmon_x.loader';
import { JESMON_X_META } from '../jesmon_x.meta';

/**
 * Layout inside `adaptJesmonXForPortfolio().overworld`:
 * - [0..31]  : idle (`S(0..3), SW(4..7), W(8..11), NW(12..15), N(16..19), NE(20..23), E(24..27), SE(28..31)`) from `idle.jpg`
 * - [32..63] : walk (`S(32..35) .. SE(60..63)`) from `walk-cycle.jpg`
 * - [64..71] : Tekken Seibai energy slashes (`0..7`) from `battle.jpg`
 */
export const JESMON_X_PORTFOLIO_POSE_MAP: OverworldPoseMap = {
  back: [48, 49, 50, 51],
  front: [32, 33, 34, 35],
  side: [40, 41, 42, 43],
  west: [40, 41, 42, 43],
  east: [56, 57, 58, 59],
  idle: {
    front: [0, 1, 2, 3],
    west: [8, 9, 10, 11],
    back: [16, 17, 18, 19],
    east: [24, 25, 26, 27],
  },
  action: [64, 66, 67, 65],
  nativeFacing: 'left',
};

export const JESMON_X_PORTFOLIO_ENTRY: DigimonCatalogEntry = {
  ...JESMON_X_META,
  spriteSheetUrl: '/assets/characters/jesmon_x/jesmon-x.webp',
  overworldPoseMap: JESMON_X_PORTFOLIO_POSE_MAP,
};

/** Loads `jesmon_x` via the standalone character module and adapts it to `SlicedDigimonSprites`. */
export async function adaptJesmonXForPortfolio(
  tier: DigimonLoadTier = 'full'
): Promise<SlicedDigimonSprites | null> {
  try {
    const set = await loadJesmonX(undefined, tier);
    const idle = set.groups.idle ?? [];
    const walk = set.groups.walk ?? [];
    const battle = set.groups.battle ?? [];
    const battleLarge = set.groups.battleLarge ?? battle;
    const dsIdle = set.groups.dsIdle ?? [];
    const hd = set.groups.hd ?? [];

    // DigiDex Battle Idle uses the 3-frame animated DS idle (`jesmon-x-ds.webp`),
    // and Signature Attack unleashes the cyan blade draw (B0) into twin crimson-gold Tekken Seibai burst (B2/B3).
    const largeIdle = dsIdle.length > 0 ? dsIdle : hd.slice(0, 1);
    const largeAttack =
      battleLarge.length >= 4
        ? [battleLarge[0], battleLarge[2], battleLarge[3], battleLarge[1]]
        : battleLarge.slice(0, 4);
    const overworld = [...idle, ...walk, ...battle];

    return {
      id: JESMON_X_META.id,
      tier,
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

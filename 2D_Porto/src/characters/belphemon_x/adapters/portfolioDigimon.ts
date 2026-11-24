import type { DigimonCatalogEntry, OverworldPoseMap } from '../../../engine/digimonCatalog';
import type { DigimonLoadTier, SlicedDigimonSprites } from '../../../engine/digiSpriteLoader';
import { loadBelphemonX } from '../belphemon_x.loader';
import { BELPHEMON_X_META } from '../belphemon_x.meta';

/**
 * Layout inside `adaptBelphemonXForPortfolio().overworld`:
 * - [0..31]  : idle (`S(0..3), SW(4..7), W(8..11), NW(12..15), N(16..19), NE(20..23), E(24..27), SE(28..31)`) from `idle.jpg`
 * - [32..63] : walk (`S(32..35) .. SE(60..63)`) from `walk-cycle-v2.jpg`
 * - [64..75] : sequential 4-frame Seventh Full Cluster claw combos (`SW/Front(64..67), W(68..71), E(72..75)`) from `battle.jpg`
 */
export const BELPHEMON_X_PORTFOLIO_POSE_MAP: OverworldPoseMap = {
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
  action: [64, 65, 66, 67],
  nativeFacing: 'left',
};

export const BELPHEMON_X_PORTFOLIO_ENTRY: DigimonCatalogEntry = {
  ...BELPHEMON_X_META,
  spriteSheetUrl: '/assets/characters/belphemon_x/belphemon-x.webp',
  overworldPoseMap: BELPHEMON_X_PORTFOLIO_POSE_MAP,
};

/** Loads `belphemon_x` via the standalone character module and adapts it to `SlicedDigimonSprites`. */
export async function adaptBelphemonXForPortfolio(
  tier: DigimonLoadTier = 'full'
): Promise<SlicedDigimonSprites | null> {
  try {
    const set = await loadBelphemonX(undefined, tier);
    const idle = set.groups.idle ?? [];
    const idleLarge = set.groups.idleLarge ?? [];
    const walk = set.groups.walk ?? [];
    const battle = set.groups.battle ?? [];
    const battleLarge = set.groups.battleLarge ?? battle;
    const hd = set.groups.hd ?? [];

    // DigiDex Battle Idle plays South idle frames from `idle.jpg`,
    // while Signature Attack unleashes the blazing Seventh Full Cluster claw combo from `battle.jpg`.
    const largeIdle = idleLarge.length >= 4 ? idleLarge.slice(0, 4) : hd.slice(0, 1);
    const largeAttack = battleLarge.slice(0, 4);
    const overworld = [...idle, ...walk, ...battle];

    return {
      id: BELPHEMON_X_META.id,
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

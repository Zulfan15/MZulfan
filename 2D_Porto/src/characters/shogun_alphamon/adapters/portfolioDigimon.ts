import type { DigimonCatalogEntry, OverworldPoseMap } from '../../../engine/digimonCatalog';
import type { SlicedDigimonSprites } from '../../../engine/digiSpriteLoader';
import { loadShogunAlphamon } from '../shogun_alphamon.loader';
import { SHOGUN_ALPHAMON_META } from '../shogun_alphamon.meta';

/**
 * Layout inside `adaptShogunAlphamonForPortfolio().overworld`:
 * - [0..31]  : idle (`S(0..3), SW(4..7), W(8..11), NW(12..15), N(16..19), NE(20..23), E(24..27), SE(28..31)`) from `idle.png`
 * - [32..63] : gallop walk (`S(32..35), SW(36..39), W(40..43), NW(44..47), N(48..51), NE(52..55), E(56..59), SE(60..63)`) from `walk-cycle.png`
 * - [64..71] : fiery naginata slash poses (`0..7`) from `battle.png`
 */
export const SHOGUN_ALPHAMON_PORTFOLIO_POSE_MAP: OverworldPoseMap = {
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
  action: [65, 66, 67, 68],
  nativeFacing: 'left',
};

export const SHOGUN_ALPHAMON_PORTFOLIO_ENTRY: DigimonCatalogEntry = {
  ...SHOGUN_ALPHAMON_META,
  spriteSheetUrl: '/assets/characters/shogun_alphamon/shogun-alphamon.png',
  overworldPoseMap: SHOGUN_ALPHAMON_PORTFOLIO_POSE_MAP,
};

/** Loads `shogun_alphamon` via the standalone character module and adapts it to `SlicedDigimonSprites`. */
export async function adaptShogunAlphamonForPortfolio(): Promise<SlicedDigimonSprites | null> {
  try {
    const set = await loadShogunAlphamon();
    const idle = set.groups.idle ?? [];
    const idleLarge = set.groups.idleLarge ?? idle;
    const walk = set.groups.walk ?? [];
    const battle = set.groups.battle ?? [];
    const battleLarge = set.groups.battleLarge ?? battle;
    const hd = set.groups.hd ?? [];

    // DigiDex Battle Idle animates South idle frames from `idle.png` (fallback to HD portrait),
    // and Signature Attack unleashes the crimson naginata crescent slashes from `battle.png`.
    const largeIdle =
      idleLarge.length >= 4 ? idleLarge.slice(0, 4) : hd.slice(0, 2);
    const largeAttack = battleLarge.slice(0, 4);
    const overworld = [...idle, ...walk, ...battle];

    return {
      id: SHOGUN_ALPHAMON_META.id,
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

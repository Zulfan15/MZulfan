import type { DigimonCatalogEntry, OverworldPoseMap } from '../../../engine/digimonCatalog';
import type { DigimonLoadTier, SlicedDigimonSprites } from '../../../engine/digiSpriteLoader';
import { loadVamdramon } from '../vamdramon.loader';
import { VAMDRAMON_META } from '../vamdramon.meta';

/**
 * Future-proof layout inside `adaptVamdramonForPortfolio().overworld`:
 * - [0..31]  : idle (`S(0..3), SW(4..7), W(8..11), NW(12..15), N(16..19), NE(20..23), E(24..27), SE(28..31)`)
 * - [32..63] : walk (`S(32..35), SW(36..39), W(40..43), NW(44..47), N(48..51), NE(52..55), E(56..59), SE(60..63)`)
 * - [64..71] : battle (`0..7`)
 */
export const VAMDRAMON_PORTFOLIO_POSE_MAP: OverworldPoseMap = {
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

export const VAMDRAMON_PORTFOLIO_ENTRY: DigimonCatalogEntry = {
  ...VAMDRAMON_META,
  spriteSheetUrl: '/assets/characters/vamdramon/vamdramon.webp',
  overworldPoseMap: VAMDRAMON_PORTFOLIO_POSE_MAP,
};

export async function adaptVamdramonForPortfolio(
  tier: DigimonLoadTier = 'full'
): Promise<SlicedDigimonSprites | null> {
  try {
    const set = await loadVamdramon(undefined, tier);
    const idle = set.groups.idle ?? [];
    const walk = set.groups.walk ?? [];
    const battle = set.groups.battle ?? [];
    const battleLarge = set.groups.battleLarge ?? battle;
    const hd = set.groups.hd ?? [];

    const largeIdle = [hd[0], hd[7]].filter(Boolean);
    const largeAttack = battleLarge.slice(0, 4);
    const overworld = [...idle, ...walk, ...battle];

    return {
      id: VAMDRAMON_META.id,
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

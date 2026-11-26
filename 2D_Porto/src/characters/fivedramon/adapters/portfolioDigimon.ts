import type { DigimonCatalogEntry, OverworldPoseMap } from '../../../engine/digimonCatalog';
import type { DigimonLoadTier, SlicedDigimonSprites } from '../../../engine/digiSpriteLoader';
import { loadFivedramon } from '../fivedramon.loader';
import { FIVEDRAMON_META } from '../fivedramon.meta';

/**
 * Layout inside `adaptFivedramonForPortfolio().overworld`:
 * - [0..7]   : idle (`S, SW, W, NW, N, NE, E, SE`) from `idle.png`
 * - [8..39]  : walk (`S(8..11), SW(12..15), W(16..19), NW(20..23), N(24..27), NE(28..31), E(32..35), SE(36..39)`) from `walk-cycle.png`
 * - [40..47] : elemental breath & Grand Cross Breaker battle frames (`0..7`) from `battle.png`
 */
export const FIVEDRAMON_PORTFOLIO_POSE_MAP: OverworldPoseMap = {
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
  action: [46, 42, 47, 45],
  nativeFacing: 'left',
};

export const FIVEDRAMON_PORTFOLIO_ENTRY: DigimonCatalogEntry = {
  ...FIVEDRAMON_META,
  spriteSheetUrl: '/assets/characters/fivedramon/fivedramon.webp',
  overworldPoseMap: FIVEDRAMON_PORTFOLIO_POSE_MAP,
};

/** Loads `fivedramon` via the standalone character module and adapts it to `SlicedDigimonSprites`. */
export async function adaptFivedramonForPortfolio(
  tier: DigimonLoadTier = 'full'
): Promise<SlicedDigimonSprites | null> {
  try {
    const set = await loadFivedramon(undefined, tier);
    const idle = set.groups.idle ?? [];
    const walk = set.groups.walk ?? [];
    const battle = set.groups.battle ?? [];
    const hd = set.groups.hd ?? [];

    // DigiDex Battle Idle showcases the crisp South HD portrait with smooth floating bob,
    // while Signature Attack unleashes Five-Element Aura Charge (B6) into Twin Elemental Breath (B2).
    const largeIdle = [hd[0]].filter(Boolean);
    const largeAttack = [battle[6], battle[2], battle[7], battle[5]].filter(Boolean);
    const overworld = [...idle, ...walk, ...battle];

    return {
      id: FIVEDRAMON_META.id,
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

import type { DigimonCatalogEntry, OverworldPoseMap } from '../../../engine/digimonCatalog';
import type { DigimonLoadTier, SlicedDigimonSprites } from '../../../engine/digiSpriteLoader';
import { loadPlusiamon } from '../plusiamon.loader';
import { PLUSIAMON_META } from '../plusiamon.meta';

/**
 * Layout inside `adaptPlusiamonForPortfolio().overworld`:
 * - [0..7]   : idle (`S, SW, W, NW, N, NE, E, SE`) from `idle.png`
 * - [8..39]  : walk (`S(8..11), SW(12..15), W(16..19), NW(20..23), N(24..27), NE(28..31), E(32..35), SE(36..39)`) from `walk-cycle.jpg`
 * - [40..47] : battle attack blasts (`0..7`) from `battle.png`
 */
export const PLUSIAMON_PORTFOLIO_POSE_MAP: OverworldPoseMap = {
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
  action: [40, 41, 42, 44],
  nativeFacing: 'left',
};

export const PLUSIAMON_PORTFOLIO_ENTRY: DigimonCatalogEntry = {
  ...PLUSIAMON_META,
  spriteSheetUrl: '/assets/characters/plusiamon/plusiamon.webp',
  overworldPoseMap: PLUSIAMON_PORTFOLIO_POSE_MAP,
};

/** Loads `plusiamon` via the standalone character module and adapts it to `SlicedDigimonSprites`. */
export async function adaptPlusiamonForPortfolio(
  tier: DigimonLoadTier = 'full'
): Promise<SlicedDigimonSprites | null> {
  try {
    const set = await loadPlusiamon(undefined, tier);
    const idle = set.groups.idle ?? [];
    const walk = set.groups.walk ?? [];
    const battle = set.groups.battle ?? [];
    const battleLarge = set.groups.battleLarge ?? battle;
    const dsIdle = set.groups.dsIdle ?? [];
    const hd = set.groups.hd ?? [];

    // DigiDex Battle Idle uses the 3-frame animated DS idle (`plusiamon-ds.png`),
    // while Signature Attack blasts dual cyan plasma + thruster flame (`battle.png`).
    const largeIdle = dsIdle.length > 0 ? dsIdle : hd.slice(0, 1);
    const largeAttack = battleLarge.slice(0, 4);
    const overworld = [...idle, ...walk, ...battle];

    return {
      id: PLUSIAMON_META.id,
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

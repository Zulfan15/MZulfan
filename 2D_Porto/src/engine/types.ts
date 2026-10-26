/** Shared engine types — zero dependencies. */

export type Dir = 'up' | 'down' | 'left' | 'right';

export interface Vec {
  x: number;
  y: number;
}

export const DIRS: Record<Dir, Vec> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

/** Ground tile ids (stored in a Uint8Array). */
export const Tile = {
  GRASS: 0,
  PATH: 1,
  TALL: 2,
  WATER: 3,
  TREE: 4,
  FLOWER: 5,
  FENCE: 6,
  SAND: 7,
  PLAZA: 8,
} as const;
export type TileId = (typeof Tile)[keyof typeof Tile];

export const BLOCKING: ReadonlySet<number> = new Set([Tile.WATER, Tile.TREE, Tile.FENCE]);

export type Action =
  | { kind: 'navigate'; route: string; prompt?: string }
  | { kind: 'refill' }
  | { kind: 'open'; target: 'map' | 'dex' };

/** Anything the player can talk to / read. */
export interface Interactable {
  id: string;
  name: string;
  lines: string[];
  action?: Action;
}

export interface CharacterPalette {
  skin: string;
  hair: string;
  shirt: string;
  pants: string;
  shoes: string;
  cap?: string;
  accent?: string;
  /** render semi-transparent with a scanline flicker (hologram). */
  holo?: boolean;
}

export interface Npc extends Interactable, Vec {
  dir: Dir;
  palette: CharacterPalette;
}

export interface Sign extends Interactable, Vec {
  style: 'board' | 'post' | 'mailbox';
}

export interface Building {
  id: string;
  name: string;
  route: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** absolute door tiles (bottom row of the building). */
  doors: Vec[];
  roof: string;
  roofDark: string;
  wall: string;
  sign: string;
}

export interface Spawn extends Vec {
  dir: Dir;
}

export interface TownMap {
  w: number;
  h: number;
  ground: Uint8Array;
  /** 0 walkable, 1 blocked. Includes buildings, NPCs and signs. */
  collision: Uint8Array;
  buildings: Building[];
  npcs: Npc[];
  signs: Sign[];
  /** door tile index → route */
  doors: Map<number, string>;
  spawns: Record<string, Spawn>;
}

/** Data injected from profile.yaml at build time. */
export interface TownData {
  name: string;
  shortName: string;
  tagline: string;
  now: string;
  openTo: string;
  email: string;
  featured: string[];
  toolbelt: string[];
  places: { id: string; route: string; name: string; icon: string; blurb: string }[];
}

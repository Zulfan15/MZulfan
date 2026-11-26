/**
 * Shared, engine-agnostic types for standalone sprite characters.
 * Nothing in `src/characters/_shared` may import from `src/engine` so these
 * modules can be copied into another project unchanged.
 */

/** Sprite-sheet direction order used by every 8-direction asset in this project. */
export const DIRECTIONS_8 = ['S', 'SW', 'W', 'NW', 'N', 'NE', 'E', 'SE'] as const;

export type Direction8 = (typeof DIRECTIONS_8)[number];
export type Cardinal = 'N' | 'S' | 'E' | 'W';
export type CharacterLoadMode = 'overworld' | 'full';

/** Cardinal directions rendered in top-down 4-way overworld views. */
export const CARDINAL_DIRECTIONS: ReadonlySet<Direction8> = new Set(['S', 'W', 'N', 'E']);

/** Pixel rectangle inside a source sheet. */
export interface FrameRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * A cleaned, trimmed frame. Structurally identical to the engine's
 * `ProcessedSpriteFrame`, so frames can be handed to the engine without conversion.
 */
export interface CharacterFrame {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

/**
 * - `flat-green`: lossless pixel-art sheet on a solid green backdrop (+ darker green ground shadow).
 * - `border-green`: border-connected green flood keyer for characters that also have emerald-green anatomy (e.g. Fivedramon's green head).
 * - `border-green-despill`: border/pocket green flood keyer + edge despill for haloed glows alongside protected interior green accents.
 * - `lossy-green`: JPG/upscaled sheet on a bright green-screen with compression noise.
 * - `lossy-green-warm`: JPG/WebP sheet on green-screen that protects warm yellow/cream/gold details (`r > b + 4`) from green bleed while keying cool/neutral green backdrops and pockets.
 * - `lossy-teal`: teal-green grid sheets (`Ragnaloardmon` idle/walk/battle) where blue channel is close to green.
 * - `ds-teal-mint`: dual dark-teal outer + mint-green inner box JPG sheets (classic DS rips).
 */
export type ChromaMode =
  | 'flat-green'
  | 'border-green'
  | 'border-green-despill'
  | 'lossy-green'
  | 'lossy-green-warm'
  | 'lossy-teal'
  | 'ds-teal-mint';

export interface SliceOptions {
  chroma: ChromaMode;
  /**
   * `uniform`: every frame in the group shares one crop box, so frame sizes never jump
   *            while animating (engine scales by frame height).
   * `tight`:   each frame is trimmed to its own content.
   */
  trim: 'uniform' | 'tight';
  /**
   * Remove fragments that touch the cell border but are not part of the main body
   * (overlapping wings from a neighbouring pose, cut label text, etc.).
   */
  isolateMainBody?: boolean;
  /** Transparent padding (px) kept around the trimmed result. Default 1. */
  padding?: number;
}

/** Animation that has one strip of frames per direction (idle, walk). */
export interface DirectionalClip {
  group: string;
  framesPerDirection: number;
  fps: number;
}

/** Non-directional one-shot or looping animation (attacks, guard, etc.). */
export interface ActionClip {
  group: string;
  frames: number[];
  fps: number;
  loop: boolean;
}

/** All cleaned frames of a character, grouped by purpose. */
export interface CharacterSpriteSet {
  id: string;
  /** Direction order used by directional groups (frame index = dirIndex * framesPerDirection + step). */
  directionOrder: readonly Direction8[];
  groups: Record<string, CharacterFrame[]>;
  icon: CharacterFrame | null;
  iconDataUrl: string | null;
  loadedAt: number;
}

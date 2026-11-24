# Karatiamon — Standalone Character Module

Engine-agnostic 8-directional character bundle (`S, SW, W, NW, N, NE, E, SE`) slicing all 4 normalized sprite sheets from `/assets/characters/karatiamon/`.

## Quick Start

```ts
import { loadKaratiamon, createKaratiamonAnimator } from './characters/karatiamon';

const sprites = await loadKaratiamon('/assets/characters/karatiamon');
const animator = createKaratiamonAnimator(sprites);
animator.play('violetHexBlade');
```

## Included Sheets
- `idle.png` — 4x8 grid (4-step weapon-consistent idle per direction)
- `walk-cycle.png` — 4x8 grid (4-step weapon-consistent walk per direction)
- `battle.png` — 4x8 sequential Violet Hex Blade slash combos (`Front`, `W`, `E`)
- `karatiamon.png` — Icon, 8 HD portraits, and 8 mini thumbs
- Chroma keying uses `border-green` on all 4 sheets to preserve neon-green feet and forearm fur accents.

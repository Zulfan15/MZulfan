# Belphemon (X Antibody) — Standalone Character Module

Engine-agnostic 8-directional character bundle (`S, SW, W, NW, N, NE, E, SE`) slicing all 4 normalized sprite sheets from `/assets/characters/belphemon_x/`.

## Quick Start

```ts
import { loadBelphemonX, createBelphemonXAnimator } from './characters/belphemon_x';

const sprites = await loadBelphemonX('/assets/characters/belphemon_x');
const animator = createBelphemonXAnimator(sprites);
animator.play('seventhFullCluster');
```

## Included Sheets
- `idle.jpg` — 8x4 variable-column grid (4-step idle per direction)
- `walk-cycle.jpg` — 8x4 variable-column grid (4-step striding walk per direction)
- `battle.jpg` — 8x4 sequential magenta-crimson claw combos (`SW/Front`, `W`, `E`)
- `belphemon-x.jpg` — Icon, 7 HD portraits (`SE` mirrored cleanly from `SW`), and 8 mini thumbs

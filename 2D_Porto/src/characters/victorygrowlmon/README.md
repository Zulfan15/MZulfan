# VictoryGrowlmon Character Module

Modular, engine-agnostic 8-directional character built from all 4 source assets (`idle.png`, `walk-cycle.png`, `battle.png`, `victorygrowlmon.png`).

## Portability

Only `adapters/portfolioDigimon.ts` knows about `2D_Porto`. To use VictoryGrowlmon in another HTML5 Canvas / TypeScript app, copy:

1. `src/characters/_shared/`
2. `src/characters/victorygrowlmon/` (without `adapters/`)
3. `public/assets/characters/victorygrowlmon/`

Then import from `src/characters/victorygrowlmon`:

```ts
import {
  loadVictoryGrowlmon,
  createVictoryGrowlmonAnimator,
  directionFromVector,
} from './characters/victorygrowlmon';

const sprites = await loadVictoryGrowlmon('/assets/characters/victorygrowlmon');
const animator = createVictoryGrowlmonAnimator(sprites);

animator.setDirection(directionFromVector(vx, vy, animator.getDirection()));
animator.setMoving(vx !== 0 || vy !== 0);
animator.update(dt);
animator.draw(ctx, x, footY, { height: 48 });

animator.playAction('dramonVictorySlash');
```

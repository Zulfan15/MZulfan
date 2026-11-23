# Holloknightmon Character Module

Modular, engine-agnostic 8-directional character built from all 4 source assets (`idle.jpg`, `walk-cycle.jpg`, `battle.jpg`, `holloknightmon.jpg`).

## Portability

Only `adapters/portfolioDigimon.ts` knows about `2D_Porto`. To use Holloknightmon in another HTML5 Canvas / TypeScript app, copy:

1. `src/characters/_shared/`
2. `src/characters/holloknightmon/` (without `adapters/`)
3. `public/assets/characters/holloknightmon/`

Then import from `src/characters/holloknightmon`:

```ts
import {
  loadHolloknightmon,
  createHolloknightmonAnimator,
  directionFromVector,
} from './characters/holloknightmon';

const sprites = await loadHolloknightmon('/assets/characters/holloknightmon');
const animator = createHolloknightmonAnimator(sprites);

animator.setDirection(directionFromVector(vx, vy, animator.getDirection()));
animator.setMoving(vx !== 0 || vy !== 0);
animator.update(dt);
animator.draw(ctx, x, footY, { height: 48 });

animator.playAction('radianceDecree');
```

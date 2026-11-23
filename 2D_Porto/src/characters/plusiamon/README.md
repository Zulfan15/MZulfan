# Plusiamon Character Module

Modular, engine-agnostic 8-directional character built from all 5 source assets (`idle.png`, `walk-cycle.png`, `battle.png`, `plusiamon.jpg`, `plusiamon-ds.png`).

## Portability

Only `adapters/portfolioDigimon.ts` knows about `2D_Porto`. To use Plusiamon in another HTML5 Canvas / TypeScript app, copy:

1. `src/characters/_shared/`
2. `src/characters/plusiamon/` (without `adapters/`)
3. `public/assets/characters/plusiamon/`

Then import from `src/characters/plusiamon`:

```ts
import {
  loadPlusiamon,
  createPlusiamonAnimator,
  directionFromVector,
} from './characters/plusiamon';

const sprites = await loadPlusiamon('/assets/characters/plusiamon');
const animator = createPlusiamonAnimator(sprites);

animator.setDirection(directionFromVector(vx, vy, animator.getDirection()));
animator.setMoving(vx !== 0 || vy !== 0);
animator.update(dt);
animator.draw(ctx, x, footY, { height: 48 });

animator.playAction('plasmaCannon');
```

# Shogun Alphamon Character Module

Modular, engine-agnostic 8-directional character built from all 4 source assets (`idle.png`, `walk-cycle.png`, `battle.png`, `shogun-alphamon.png`).

## Portability

Only `adapters/portfolioDigimon.ts` knows about `2D_Porto`. To use Shogun Alphamon in another HTML5 Canvas / TypeScript app, copy:

1. `src/characters/_shared/`
2. `src/characters/shogun_alphamon/` (without `adapters/`)
3. `public/assets/characters/shogun_alphamon/`

Then import from `src/characters/shogun_alphamon`:

```ts
import {
  loadShogunAlphamon,
  createShogunAlphamonAnimator,
  directionFromVector,
} from './characters/shogun_alphamon';

const sprites = await loadShogunAlphamon('/assets/characters/shogun_alphamon');
const animator = createShogunAlphamonAnimator(sprites);

animator.setDirection(directionFromVector(vx, vy, animator.getDirection()));
animator.setMoving(vx !== 0 || vy !== 0);
animator.update(dt);
animator.draw(ctx, x, footY, { height: 48 });

animator.playAction('naginataSweep');
```

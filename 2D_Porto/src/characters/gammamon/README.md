# Gammamon Character Module

Modular, engine-agnostic 8-directional character built from all 4 source assets (`idle.jpg`, `walk-cycle.jpg`, `battle.jpg`, `gammamon.jpg`).

## Portability

Only `adapters/portfolioDigimon.ts` knows about `2D_Porto`. To use Gammamon in another HTML5 Canvas / TypeScript app, copy:

1. `src/characters/_shared/`
2. `src/characters/gammamon/` (without `adapters/`)
3. `public/assets/characters/gammamon/`

Then import from `src/characters/gammamon`:

```ts
import {
  loadGammamon,
  createGammamonAnimator,
  directionFromVector,
} from './characters/gammamon';

const sprites = await loadGammamon('/assets/characters/gammamon');
const animator = createGammamonAnimator(sprites);

animator.setDirection(directionFromVector(vx, vy, animator.getDirection()));
animator.setMoving(vx !== 0 || vy !== 0);
animator.update(dt);
animator.draw(ctx, x, footY, { height: 48 });

animator.playAction('steamStackCannon');
```

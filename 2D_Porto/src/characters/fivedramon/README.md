# Fivedramon Character Module

Modular, engine-agnostic 8-directional character built from all 4 source assets (`idle.png`, `walk-cycle.png`, `battle.png`, `fivedramon.jpg`).

## Portability

Only `adapters/portfolioDigimon.ts` knows about `2D_Porto`. To use Fivedramon in another HTML5 Canvas / TypeScript app, copy:

1. `src/characters/_shared/`
2. `src/characters/fivedramon/` (without `adapters/`)
3. `public/assets/characters/fivedramon/`

Then import from `src/characters/fivedramon`:

```ts
import {
  loadFivedramon,
  createFivedramonAnimator,
  directionFromVector,
} from './characters/fivedramon';

const sprites = await loadFivedramon('/assets/characters/fivedramon');
const animator = createFivedramonAnimator(sprites);

animator.setDirection(directionFromVector(vx, vy, animator.getDirection()));
animator.setMoving(vx !== 0 || vy !== 0);
animator.update(dt);
animator.draw(ctx, x, footY, { height: 48 });

animator.playAction('grandCrossBreaker');
```

# Mazagamon Character Module

Modular, engine-agnostic 8-directional character built from all 4 source assets (`idle.png`, `walk-cycle.jpg`, `battle.jpg`, `mazagamon.jpg`).

## Portability

Only `adapters/portfolioDigimon.ts` knows about `2D_Porto`. To use Mazagamon in another HTML5 Canvas / TypeScript app, copy:

1. `src/characters/_shared/`
2. `src/characters/mazagamon/` (without `adapters/`)
3. `public/assets/characters/mazagamon/`

Then import from `src/characters/mazagamon`:

```ts
import {
  loadMazagamon,
  createMazagamonAnimator,
  directionFromVector,
} from './characters/mazagamon';

const sprites = await loadMazagamon('/assets/characters/mazagamon');
const animator = createMazagamonAnimator(sprites);

animator.setDirection(directionFromVector(vx, vy, animator.getDirection()));
animator.setMoving(vx !== 0 || vy !== 0);
animator.update(dt);
animator.draw(ctx, x, footY, { height: 48 });

animator.playAction('abyssalOverload');
```

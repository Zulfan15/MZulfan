# Ragnaloardmon Character Module

Modular, engine-agnostic 8-directional character built from all 5 source assets (`idle.png`, `walk-cycle.jpg`, `battle.jpg`, `ragnaloardmon.jpg`, `ragnaloardmon-ds.jpg`).

## Portability

Only `adapters/portfolioDigimon.ts` knows about `2D_Porto`. To use Ragnaloardmon in another HTML5 Canvas / TypeScript app, copy:

1. `src/characters/_shared/`
2. `src/characters/ragnaloardmon/` (without `adapters/`)
3. `public/assets/characters/ragnaloardmon/`

Then import from `src/characters/ragnaloardmon`:

```ts
import {
  loadRagnaloardmon,
  createRagnaloardmonAnimator,
  directionFromVector,
} from './characters/ragnaloardmon';

const sprites = await loadRagnaloardmon('/assets/characters/ragnaloardmon');
const animator = createRagnaloardmonAnimator(sprites);

animator.setDirection(directionFromVector(vx, vy, animator.getDirection()));
animator.setMoving(vx !== 0 || vy !== 0);
animator.update(dt);
animator.draw(ctx, x, footY, { height: 48 });

animator.playAction('directSmasher');
```

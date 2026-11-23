# Gaspiritamon Character Module

Modular, engine-agnostic 8-directional character built from all 3 source assets (`walk-cycle.jpg`, `battle.jpg`, `gaspiritamon.jpg`).

## Portability

Only `adapters/portfolioDigimon.ts` knows about `2D_Porto`. To use Gaspiritamon in another HTML5 Canvas / TypeScript app, copy:

1. `src/characters/_shared/`
2. `src/characters/gaspiritamon/` (without `adapters/`)
3. `public/assets/characters/gaspiritamon/`

Then import from `src/characters/gaspiritamon`:

```ts
import {
  loadGaspiritamon,
  createGaspiritamonAnimator,
  directionFromVector,
} from './characters/gaspiritamon';

const sprites = await loadGaspiritamon('/assets/characters/gaspiritamon');
const animator = createGaspiritamonAnimator(sprites);

animator.setDirection(directionFromVector(vx, vy, animator.getDirection()));
animator.setMoving(vx !== 0 || vy !== 0);
animator.update(dt);
animator.draw(ctx, x, footY, { height: 48 });

animator.playAction('fenrirMaelstrom');
```

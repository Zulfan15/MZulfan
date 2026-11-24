# Sakuyamon (X Antibody) Character Module

Modular, engine-agnostic 8-directional character built from all 4 source assets (`idle.png`, `walk-cycle.png`, `battle.png`, `sakuyamon-x.jpg`).

## Portability

Only `adapters/portfolioDigimon.ts` knows about `2D_Porto`. To use Sakuyamon (X Antibody) in another HTML5 Canvas / TypeScript app, copy:

1. `src/characters/_shared/`
2. `src/characters/sakuyamon_x/` (without `adapters/`)
3. `public/assets/characters/sakuyamon_x/`

Then import from `src/characters/sakuyamon_x`:

```ts
import {
  loadSakuyamonX,
  createSakuyamonXAnimator,
  directionFromVector,
} from './characters/sakuyamon_x';

const sprites = await loadSakuyamonX('/assets/characters/sakuyamon_x');
const animator = createSakuyamonXAnimator(sprites);

animator.setDirection(directionFromVector(vx, vy, animator.getDirection()));
animator.setMoving(vx !== 0 || vy !== 0);
animator.update(dt);
animator.draw(ctx, x, footY, { height: 48 });

animator.playAction('izunaAmaterasu');
```

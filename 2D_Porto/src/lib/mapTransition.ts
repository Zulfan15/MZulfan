import { ROUTE_PLACE_NAMES } from './placesRegistry';

export { ROUTE_PLACE_NAMES };
export const TRANSITION_STORAGE_KEY = 'town:map_transition';

let isTransitioning = false;

export function normalizeRoutePath(route: string): string {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const url = new URL(route, origin);
    let p = url.pathname.toLowerCase();
    if (p.length > 1 && p.endsWith('/')) {
      p = p.slice(0, -1);
    }
    return p || '/';
  } catch {
    return '/';
  }
}

export function getPlaceNameForRoute(route: string): string {
  const path = normalizeRoutePath(route);
  if (ROUTE_PLACE_NAMES[path]) {
    return ROUTE_PLACE_NAMES[path];
  }
  const seg = path.split('/').filter(Boolean).pop() || 'Town Square';
  return seg
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function resetMapTransitionLock(): void {
  isTransitioning = false;
}

export function navigateWithMapTransition(route: string, customLabel?: string): void {
  if (typeof window === 'undefined') return;
  if (isTransitioning) return;

  let url: URL;
  try {
    url = new URL(route, window.location.origin);
  } catch {
    window.location.href = route;
    return;
  }

  if (
    (url.protocol !== 'http:' && url.protocol !== 'https:') ||
    url.origin !== window.location.origin ||
    (url.pathname === window.location.pathname && url.search === window.location.search && url.hash)
  ) {
    window.location.href = route;
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.location.href = route;
    return;
  }

  isTransitioning = true;
  const label = (customLabel || getPlaceNameForRoute(url.pathname)).trim();

  try {
    sessionStorage.setItem(
      TRANSITION_STORAGE_KEY,
      JSON.stringify({ label, ts: Date.now() })
    );
  } catch {
    // ignore storage errors
  }

  const overlay = document.getElementById('map-transition-overlay') as HTMLElement | null;
  const labelEl = document.getElementById('map-transition-label') as HTMLElement | null;

  if (!overlay || !labelEl) {
    window.location.href = route;
    return;
  }

  labelEl.textContent = '';
  overlay.hidden = false;
  document.documentElement.dataset.mapTransition = 'leave';

  window.setTimeout(() => {
    window.location.href = route;
  }, 290);
}

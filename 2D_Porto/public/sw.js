// Lightweight PWA Service Worker for Zulfan's Town — Sprite Sheets & Static Assets Instant Cache
const CACHE_NAME = 'zulfan-town-pwa-v1';

const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/og/town.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  const isImmutableAsset =
    url.pathname.startsWith('/_astro/') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/sprites/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/og/') ||
    url.pathname.startsWith('/wasm/');

  if (isImmutableAsset) {
    // Cache-First for Pokemon/Digimon sprite sheets & compiled Astro JS/CSS chunks
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Network-First with cache fallback for HTML routes
  if (req.headers.get('accept')?.includes('text/html') || req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('/')))
    );
  }
});

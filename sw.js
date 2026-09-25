/* Service worker — makes the protocol usable offline.
   App shell + Leaflet are cached on install; map tiles and routes are cached as they are fetched,
   so a phone that has opened the app once keeps its shelters, map and last routes without signal. */
const SHELL_CACHE = 'lkp-shell-v41';
const TILE_CACHE = 'lkp-tiles-v1';
const ROUTE_CACHE = 'lkp-routes-v1';
const SHELL = [
  './', './index.html', './styles.css', './app.js', './data.js', './mds.js', './pois.js', './i18n.js', './profile.js', './about.html', './tallinn-logo.svg', './pinge-logo.png', './concrete-bg.jpg', './concrete-bg-phone.jpg', './manifest.json', './icon.svg',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(cache =>
      Promise.allSettled(SHELL.map(url => cache.add(url).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => ![SHELL_CACHE, TILE_CACHE, ROUTE_CACHE].includes(k)).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = req.url;

  if (url.includes('tile.openstreetmap.org') || url.includes('basemaps.cartocdn.com')) {
    event.respondWith(cacheFirst(req, TILE_CACHE));
  } else if (url.includes('router.project-osrm.org') || url.includes('routing.openstreetmap.de')) {
    event.respondWith(networkFirst(req, ROUTE_CACHE));
  } else {
    // App shell and CDN libraries: network-first so updates show immediately, cache when offline.
    event.respondWith(shellFirst(req));
  }
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
  } catch (e) {
    return new Response('', { status: 504, statusText: 'offline' });
  }
}

/* Shell: try network, else the cached copy (ignoring ?query), else index.html for navigations */
async function shellFirst(req) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    // Always revalidate with the server. A navigate-mode Request cannot be re-fetched with
    // options, so page loads are rebuilt from the URL; other requests keep their mode.
    const res = req.mode === 'navigate'
      ? await fetch(new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' }))
      : await fetch(req, { cache: 'no-cache' });
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
  } catch (e) {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === 'navigate') {
      const index = await cache.match('./index.html') || await cache.match('./');
      if (index) return index;
    }
    return new Response('<!doctype html><title>Offline</title><p style="font-family:sans-serif;padding:24px">You are offline and this page is not cached yet.</p>', { status: 503, headers: { 'Content-Type': 'text/html' } });
  }
}

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
  } catch (e) {
    const hit = await cache.match(req);
    return hit || new Response(JSON.stringify({ code: 'Offline' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  }
}

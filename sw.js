const CACHE = 'mfw2026-v7';
const ASSETS = [
  '/flexwork2026/',
  '/flexwork2026/index.html',
  '/flexwork2026/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(response => {
        return caches.open(CACHE).then(cache => {
          cache.put(e.request, response.clone());
          return response;
        });
      }).catch(() => cached);
    })
  );
});

const CACHE = 'gj-weekly-league-v24';
const ASSETS = ['./', './index.html', './styles.css?v=5', './config.js?v=4', './london-clock.js?v=1', './app.js?v=23', './reset-password.html', './reset.js?v=2', './manifest.webmanifest?v=4', './icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([self.clients.claim(), caches.keys().then(keys =>
    Promise.all(keys.filter(key => key.startsWith('gj-weekly-league-') && key !== CACHE).map(key => caches.delete(key)))
  )]));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => event.request.mode === 'navigate' ? caches.match('./index.html') : Response.error());
  }));
});

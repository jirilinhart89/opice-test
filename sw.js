// V1.3: aktualizace encyklopedie bez nutnosti měnit JavaScript.
const CACHE = 'pt37-static-v13';
const ASSETS = [
  './', './index.html', './style.css', './app.js', './encyklopedie.txt',
  './pozadi-hradcany.webp', './manifest.webmanifest', './logo-praga.webp',
  './icons/cesky-lev.png', './icons/icon-192.png', './icons/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('pt37-static-') && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/encyklopedie.txt')) {
    // Online aktualizace obsahu, offline používání poslední uložené verze.
    event.respondWith(
      fetch(event.request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)));
        }
        return response;
      }).catch(async () => {
        const cached = await caches.match(event.request);
        return cached || Response.error();
      })
    );
    return;
  }
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request)));
});

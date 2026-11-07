const CACHE_NAME = 'pereskaz5-v28';
const ASSETS = [
  './',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Модели и CDN-библиотеки не кэшируем в SW — Transformers.js кэширует сам
  if (e.request.url.includes('huggingface.co') ||
      e.request.url.includes('cdn.jsdelivr.net') ||
      e.request.url.includes('unpkg.com') ||
      e.request.url.includes('esm.sh') ||
      e.request.url.includes('esm.run') ||
      e.request.url.includes('mlc-ai') ||
      e.request.url.includes('mlc.ai')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

const CACHE = 'sinal-verde-v3-2026-08';
const ESSENCIAIS = [
  './', './index.html', './admin.html',
  './manifest.webmanifest', './icons/icon-192.png',
  './icons/icon-512.png', './icons/favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ESSENCIAIS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.endsWith('.supabase.co')) return;
  if (url.pathname.endsWith('/config.js')) {
    event.respondWith(fetch(req, { cache: 'no-store' }));
    return;
  }

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => {
        const copia = res.clone();
        caches.open(CACHE).then(c => c.put(req, copia));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (url.origin === self.location.origin && res.ok) {
        const copia = res.clone();
        caches.open(CACHE).then(c => c.put(req, copia));
      }
      return res;
    }))
  );
});

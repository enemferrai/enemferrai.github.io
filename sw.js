// Meu ENEM — funciona offline
const CACHE = 'meu-enem-1.5.0';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))));
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('meu-enem-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    if (req.mode === 'navigate') { e.respondWith(caches.match('index.html').then(r => r || fetch(req))); return; }
    e.respondWith(caches.match(req).then(r => r || fetch(req)));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.open('meu-enem-fonts').then(c => c.match(req).then(r => r || fetch(req).then(res => { c.put(req, res.clone()); return res; }).catch(() => r))));
  }
});

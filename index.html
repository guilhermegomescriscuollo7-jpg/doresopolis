// Service Worker — App Doresópolis
// Estratégia: network-first com fallback para cache (não cacheia respostas de
// outras origens, como Firebase e Open-Meteo, para não atrapalhar dados em tempo real).

const CACHE = 'dores-v1';
const ASSETS = [
  './',
  './index.html',
  './saude.html',
  './educacao.html',
  './tributos.html',
  './obras.html',
  './transporte.html',
  './solicitacoes.html',
  './seguranca-infantil.html',
  './politica-privacidade.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // addAll falha por inteiro se um arquivo faltar; cada put individual é mais tolerante
      Promise.all(ASSETS.map((url) =>
        fetch(url).then((res) => { if (res.ok) return cache.put(url, res); }).catch(() => {})
      ))
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        // Só cacheia respostas OK da mesma origem
        if (res && res.status === 200 && new URL(req.url).origin === self.location.origin) {
          const copia = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copia));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((cacheada) => cacheada || caches.match('./index.html'))
      )
  );
});

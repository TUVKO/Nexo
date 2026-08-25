// Minimal service worker — required by Chrome/Android for the app to be "installable".
// Caches the app shell so the install prompt is available; not a full offline strategy.

const CACHE_NAME = 'nexohub19-shell-v1';
const SHELL_FILES = [
  './index.html'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first so users always get the latest platform data/logic;
  // falls back to cache only if offline.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

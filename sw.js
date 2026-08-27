const CACHE_VERSION = 'beijing-expense-v3';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const APP_SHELL = ['./manifest.webmanifest'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== STATIC_CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isNavigation =
    req.mode === 'navigate' ||
    req.destination === 'document' ||
    url.pathname.endsWith('/index.html');

  if (isNavigation) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(response => {
          const copy = response.clone();
          caches.open(STATIC_CACHE).then(cache =>
            cache.put('./index.html', copy)
          );
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req).then(response => {
        if (
          !response ||
          response.status !== 200 ||
          response.type === 'opaque'
        ) {
          return response;
        }

        const copy = response.clone();
        caches.open(STATIC_CACHE).then(cache =>
          cache.put(req, copy)
        );

        return response;
      });
    })
  );
});
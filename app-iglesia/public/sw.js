const CACHE_NAME = 'iasd-hualqui-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.png',
  '/apple-icon.png',
  '/globals.css',
];

// Instalación e intercepción de recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Limpieza de cachés viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Estrategia Network-First con Fallback a Caché (Compatible con Firefox/Brave)
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones de la API y de Auth para no romper las solicitudes en vivo
  if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Guardar copia fresca en caché
        if (response.status === 200) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((res) => res || caches.match('/')))
  );
});
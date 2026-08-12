const CACHE_NAME = 'iasd-hualqui-v4';

// Archivos estáticos necesarios para abrir la app completamente offline
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.png',
  '/apple-icon.png',
  '/globals.css',
];

// 1. Instalar y precargar todo el cascarón de la app
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Precargando assets estáticos...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Limpiar cachés antiguas
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

// 3. Responder desde la caché si no hay internet (Stale-While-Revalidate)
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones de API de mutación o autenticación
  if (event.request.method !== 'GET' || event.request.url.includes('/api/auth/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Petición de red en segundo plano para actualizar la caché
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      // Si el archivo está en caché (offline), devolverlo al instante.
      // Si no, esperar la red. Si la red falla y es navegación, entregar el inicio '/'
      return (
        cachedResponse ||
        fetchPromise.catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        })
      );
    })
  );
});
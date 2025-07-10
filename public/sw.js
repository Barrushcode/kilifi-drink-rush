const CACHE_NAME = 'barrush-v1';
const urlsToCache = [
  '/',
  '/products',
  '/cart',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/lovable-uploads/160b10ea-fcd2-472b-93ce-fbc961e9af66.png',
  '/lovable-uploads/817c7ccd-c1cf-4844-8188-1b0d231cd0b9.png'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch resources
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Update service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
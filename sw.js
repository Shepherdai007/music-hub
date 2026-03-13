const CACHE_NAME = "music-hub-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/icon-192.png",
  "/icon-512.png",
  "/worship.jpg",
  "/manifest.json"
];

// Install Service Worker and cache all assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching app assets...");
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate Service Worker and clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: serve cached files when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // return from cache
        }
        return fetch(event.request) // fetch from network
          .then((networkResponse) => {
            // Optionally cache new requests
            return caches.open(CACHE_NAME).then((cache) => {
              if (event.request.method === "GET" && event.request.url.startsWith("http")) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            });
          })
          .catch(() => {
            // Fallback offline page or image if needed
            if (event.request.destination === "document") {
              return caches.match("/index.html");
            }
          });
      })
  );
});

// sw.js

const CACHE_NAME = "music-hub-cache-v1";
const urlsToCache = [
  "/index.html",
  "/icon-192.png",
  "/icon-512.png",
  "/worship.jpg",
  "/manifest.json"
];

// Install service worker and cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch files from cache first
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Push Notification listener
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.text() : "New music release is live!";
  const options = {
    body: data,
    icon: "/icon-192.png",
    badge: "/icon-192.png"
  };
  event.waitUntil(
    self.registration.showNotification("King Emmanuel Music Hub", options)
  );
});

// Optional: Notification click behavior
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/") // Opens your PWA homepage
  );
});

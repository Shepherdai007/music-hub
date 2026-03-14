// sw.js - Service Worker for Push Notifications & Offline Support

const CACHE_NAME = "king-emmanuel-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/icon-192.png",
    "/worship.jpg"
];

// Install Event - cache essential files
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
        .then(() => self.skipWaiting())
    );
});

// Activate Event - cleanup old caches
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            )
        )
    );
});

// Fetch Event - serve cached files if offline
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});

// Listen for push messages
self.addEventListener("push", event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "🔥 New Release!";
    const options = {
        body: data.body || "Click to listen on Spotify",
        icon: data.icon || "icon-192.png",
        data: {
            url: data.url || "https://open.spotify.com/track/2DNRbANkDj0U7SMMBE0geg"
        }
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event
self.addEventListener("notificationclick", event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window" }).then(clientList => {
            for (const client of clientList) {
                if (client.url === event.notification.data.url && "focus" in client)
                    return client.focus();
            }
            if (clients.openWindow) return clients.openWindow(event.notification.data.url);
        })
    );
});

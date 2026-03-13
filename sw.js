// sw.js

self.addEventListener("install", (event) => {
    console.log("Service Worker installed.");
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activated.");
});

// Listen for push messages
self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : { title: "New Release!", body: "Check out the latest song by King Emmanuel!", url: "/" };
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "icon-192.png",
            badge: "icon-192.png",
            data: { url: data.url }
        })
    );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url));
});

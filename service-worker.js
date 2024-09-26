const CACHE_NAME = "jm-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/content.md",
  "/manifest.json",
];

self.addEventListener("push", function (event) {
  console.log("Push event received:", event);
  try {
    const data = event.data.json();
    console.log("Push event payload:", data);
    const options = {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png"
    };
    if (Notification.permission === "granted") {
      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } else {
      console.warn("Notification permission not granted");
    }
  } catch (e) {
    console.error("Push event data is not valid JSON:", e);
  }
});

self.addEventListener("sync", function (event) {
  if (event.tag === "sync-tag") {
    console.log("Sync event received with tag:", event.tag);
    console.log("Periodic sync event received with tag:", event.tag);
    event.waitUntil(syncData());
  }
});

self.addEventListener("periodicsync", function (event) {
  if (event.tag === "periodic-sync-tag") {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Implement your background sync logic here
  console.log("Syncing data...");
  // Add your sync logic here
}

// Install the service worker
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Service Worker installed and cache opened");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch resources
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      console.log("Fetch event for:", event.request.url);
      return response || fetch(event.request);
    })
  );
});

// Fetch resources
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

// Update the service worker
self.addEventListener("activate", function (event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

const cacheName = "wavealert-drill-v1";
const files = ["/", "/alerts/", "/map/", "/workspace/", "/emergency/", "/shelters/", "/disasters/", "/resources/", "/style.css", "/index.js", "/workflow.js", "/messages.js"];
self.addEventListener("install", event => event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(files))));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("wavealert-drill-") && key !== cacheName).map(key => caches.delete(key))))));
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  const path = event.request.mode === "navigate" ? url.pathname.replace(/\/?$/, "/") : url.pathname;
  if (!files.includes(path)) return;
  event.respondWith(fetch(event.request).catch(() => caches.open(cacheName).then(cache => cache.match(path)).then(response => response || Response.error())));
});

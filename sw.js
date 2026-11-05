/* Service Worker de Campus Consulta
 * Estrategias:
 *  - Instalación: precarga (cache) de los recursos esenciales.
 *  - Archivos estáticos: "cache first" (primero caché, si no hay, red).
 *  - Navegación (HTML): "network first" con respaldo en caché y página offline.
 * Para publicar cambios, incrementa la versión de CACHE.
 */
const VERSION = "v1";
const CACHE = `campus-consulta-${VERSION}`;

const RECURSOS_ESENCIALES = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/data.js",
  "./js/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png"
];

// 1) INSTALL: guarda los recursos esenciales
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(RECURSOS_ESENCIALES))
  );
});

// 2) ACTIVATE: borra cachés de versiones anteriores
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(claves => Promise.all(claves.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 3) FETCH: responde desde caché o red
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  // Páginas HTML: red primero, caché como respaldo
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copia = res.clone();
          caches.open(CACHE).then(c => c.put(req, copia));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match("./index.html")).then(r => r || caches.match("./offline.html")))
    );
    return;
  }

  // Estáticos: caché primero
  event.respondWith(
    caches.match(req).then(enCache => {
      if (enCache) return enCache;
      return fetch(req).then(res => {
        if (res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
        return res;
      });
    })
  );
});

// Permite activar la nueva versión cuando el usuario toca "Actualizar"
self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

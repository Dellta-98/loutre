
const CACHE = "loutre-v8";
const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./conversations.js",
  "./manifest.json",
  "./icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith("loutre-") && key !== CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const fichiersDynamiques = [
    "app.js",
    "index.html",
    "style.css"
  ];

  const fichier = url.pathname.split("/").pop();

  if (fichiersDynamiques.includes(fichier)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cacheUrl = new URL(url);
      cacheUrl.search = "";
      cacheUrl.hash = "";

      try {
        const response = await fetch(event.request, {
          cache: "no-store"
        });

        if (response.ok) {
          await cache.put(cacheUrl.href, response.clone());
        }

        return response;
      } catch (error) {
        const saved = await cache.match(cacheUrl.href);

        if (saved) return saved;

        return new Response("Loutre est temporairement hors ligne.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }
    })());
  } else {
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request)
      )
    );
  }
});





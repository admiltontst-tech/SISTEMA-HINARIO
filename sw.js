/* Hinário — service worker: guarda o app no aparelho para funcionar sem internet.
   Ao publicar uma nova versão, aumente o número abaixo. */
const VERSAO = "hinario-v10";
const ARQUIVOS = [
  "/", "/index.html", "/manifest.webmanifest",
  "/icons/icon-192.png", "/icons/icon-512.png", "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png", "/icons/favicon-48.png",
  "/config.js", "/vendor/supabase.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Responde do cache na hora (offline) e atualiza em segundo plano quando houver internet. */
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const url = new URL(req.url);
  /* busca de vídeo: sempre na rede, nunca do cache */
  if (url.pathname.startsWith("/api/")) return;
  /* config.js: busca a versão nova primeiro, para mudanças valerem logo */
  if (url.pathname === "/config.js") {
    e.respondWith(
      fetch(req).then((resp) => {
        if (resp && resp.ok) { const copia = resp.clone(); caches.open(VERSAO).then((c) => c.put(req, copia)); }
        return resp;
      }).catch(() => caches.match(req))
    );
    return;
  }
  const chave = req.mode === "navigate" ? "/index.html" : req;
  e.respondWith(
    caches.open(VERSAO).then(async (cache) => {
      const salvo = await cache.match(chave);
      const rede = fetch(req).then((resp) => {
        if (resp && resp.ok) cache.put(chave, resp.clone());
        return resp;
      }).catch(() => null);
      return salvo || (await rede) || new Response("Sem conexão", { status: 503 });
    })
  );
});

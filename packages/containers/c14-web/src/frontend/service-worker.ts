import { clientsClaim, skipWaiting } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing/registerRoute";
import { NetworkFirst } from "workbox-strategies";

declare var __webpack_hash__: string;

skipWaiting();
clientsClaim();

// Precache all staitc resources
precacheAndRoute((self as any).__WB_MANIFEST);
precacheAndRoute([
    { url: "icon-512.png", revision: __webpack_hash__ },
    { url: "icon-192.png", revision: __webpack_hash__ },
    { url: "favicon.ico", revision: __webpack_hash__ },
    { url: "manifest.json", revision: __webpack_hash__ },
]);

// Cache index.html page - network first strategy
registerRoute(
    "/",
    new NetworkFirst({
      networkTimeoutSeconds: 2,
      cacheName: "app-index",
    }),
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    (self as any).skipWaiting();
  }
});

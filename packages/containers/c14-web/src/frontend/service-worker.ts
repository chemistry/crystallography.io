import { clientsClaim, skipWaiting } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import {ExpirationPlugin} from "workbox-expiration";
import { registerRoute } from 'workbox-routing';
import Dexie from 'dexie';
import { CacheFirst, StaleWhileRevalidate, NetworkOnly } from "workbox-strategies";

declare var __webpack_hash__: string;

self.__WB_DISABLE_DEV_LOGS = true;

skipWaiting();
clientsClaim();

// Precache all static resources
precacheAndRoute((self as any).__WB_MANIFEST);
precacheAndRoute([
    { url: "icon-512.png", revision: __webpack_hash__ },
    { url: "icon-192.png", revision: __webpack_hash__ },
    { url: "favicon.ico", revision: __webpack_hash__ },
    { url: "manifest.json", revision: __webpack_hash__ },
]);

// Caching Images for 30 days
registerRoute(
    ({request}) => request.destination === 'image',
    new CacheFirst({
      cacheName: 'images',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        })
      ],
    })
);

// Cache CSS and JavaScript Files
registerRoute(
    ({request}) => request.destination === 'script' ||  request.destination === 'style',
    new StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
);

// ---------- Add Offline page support
const CACHE_NAME = 'offline-html';
const FALLBACK_HTML_URL = '/offline';

// Precache default fallback page - offline.
self.addEventListener('install', async (event) => {
    (event as any).waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.add(FALLBACK_HTML_URL))
    );
});

const networkOnly = new NetworkOnly();
registerRoute(
    ({request}) => request.destination === 'document',
    async (params: any) => {
        try {
            // Attempt a network request.
            return await networkOnly.handle(params);
        } catch (error) {
            // If it fails, return the cached HTML.
            return caches.match(FALLBACK_HTML_URL, {
                cacheName: CACHE_NAME,
            });
        }
    }
);

let db: Dexie = null;
// IndexedDB - offline support
self.addEventListener('install', async (event: any) => {
    event.waitUntil((()=> {
        db = new Dexie("data");
        db.version(1).stores({
            collections: "++name,updated,meta",
            catalog: "++id,structures"
        });
        return db.open();
    })());
});

registerRoute(
    new RegExp('.+/api/v1/.+'),
    ({ url, event }) => {
        return fetch(event.request).then((data)=> {
            return data;
        });
    }
);

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        (self as any).skipWaiting();
    }
});

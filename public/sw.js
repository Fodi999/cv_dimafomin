/**
 * Service Worker - PWA 2025 Model
 * 
 * 🎯 Goals:
 * ✅ Offline fallback
 * ✅ Fast loading
 * ❌ NO API caching (JWT safety)
 * ❌ NO auth breaking
 */

const CACHE_VERSION = 'chefos-v1';
const RUNTIME_CACHE = 'chefos-runtime-v1';

// Essential resources to cache on install
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Install event - cache essentials
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => console.error('[SW] Install failed:', err))
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_VERSION && name !== RUNTIME_CACHE)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - network first, cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip non-HTTP protocols
  if (!url.protocol.startsWith('http')) return;

  // ❌ NEVER cache API (JWT auth!)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // ❌ NEVER cache auth endpoints
  if (url.pathname.includes('/auth/') || url.pathname.includes('/login')) {
    return;
  }

  // Network first strategy (with cache fallback)
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(request).then((cached) => {
          return cached || new Response(
            '<!DOCTYPE html><html><body><h1>Offline</h1><p>No internet connection</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      })
  );
});

// Handle skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

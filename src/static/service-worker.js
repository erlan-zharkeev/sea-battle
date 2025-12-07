const CACHE_NAME = 'sea-battle-static-v-2'
const APP_SHELL = ['./', './index.html', './favicon.ico', './site.webmanifest']
const sw = globalThis

sw.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      await cache.addAll(APP_SHELL)
    })()
  )
  sw.skipWaiting()
})

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    })()
  )
  sw.clients.claim()
})

sw.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const isSameOrigin = new URL(request.url).origin === sw.location.origin

  event.respondWith(
    (async () => {
      const cached = await caches.match(request)
      if (cached) return cached

      try {
        const response = await fetch(request)
        if (isSameOrigin && response.ok) {
          const responseClone = response.clone()
          const cache = await caches.open(CACHE_NAME)
          cache.put(request, responseClone)
        }
        return response
      } catch {
        if (request.mode === 'navigate') {
          const fallback = await caches.match('./index.html')
          if (fallback) return fallback
        }
      }
    })()
  )
})

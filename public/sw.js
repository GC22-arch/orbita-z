// Service Worker de Orbita Z: solo hace que la app sea instalable.
// CRÍTICO: sin handler de fetch (rompe iOS Safari en modo app). Los datos siempre vienen de la red.

const CACHE_NAME = 'orbita-z-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  )
})

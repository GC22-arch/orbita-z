'use client'

import { useEffect } from 'react'

/** Registra el service worker. Debe quedar en el layout o la app deja de ser instalable. */
export function PwaRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    // window.location.origin evita redirecciones (iOS rechaza un 307 al registrar)
    navigator.serviceWorker
      .register(`${window.location.origin}/sw.js`, { scope: '/' })
      .catch((err) => console.error('[PWA] No se pudo registrar:', err))
  }, [])

  return null
}

import type { MetadataRoute } from 'next'

/** Datos para instalar Orbita Z como app en el celular o la compu */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Orbita Z',
    short_name: 'Orbita Z',
    description: 'Tus clientes, siempre a mano',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f4f5fb',
    theme_color: '#7c5cff',
    lang: 'es',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}

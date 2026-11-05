import type { Metadata, Viewport } from 'next'
import { AuroraBackground } from '@/shared/components/aurora-background'
import { InstallPrompt } from '@/shared/components/install-prompt'
import { PwaRegister } from '@/shared/components/pwa-register'
import { SETTINGS_STORAGE_KEY } from '@/shared/constants/storage'
import './globals.css'

export const metadata: Metadata = {
  title: 'Orbita Z',
  description: 'Tus clientes en un solo lugar',
  applicationName: 'Orbita Z',
  appleWebApp: { capable: true, title: 'Orbita Z', statusBarStyle: 'default' },
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f5fb' },
    { media: '(prefers-color-scheme: dark)', color: '#070914' },
  ],
}

// Las fuentes se cargan desde el navegador: si no hay conexión, se usa la del sistema sin bloquear nada
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap'

// Aplica el tema antes de pintar para que no haya parpadeo
const themeScript = `(function(){try{var s=JSON.parse(localStorage.getItem('${SETTINGS_STORAGE_KEY}')||'{}').state||{};var t=s.theme||'light';if(t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-accent="violeta" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS_URL} />
      </head>
      <body>
        <AuroraBackground />
        {children}
        <PwaRegister />
        <InstallPrompt />
      </body>
    </html>
  )
}

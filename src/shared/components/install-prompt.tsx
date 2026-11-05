'use client'

import { Download, Share, SquarePlus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { IconButton, Modal } from './ui'

/** Evento de Chrome/Edge/Android para instalar la app (no está en los tipos de TypeScript) */
interface InstallEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'orbita-z-install-dismissed'

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent)

function wasDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Botón flotante "Instalar app".
 * Android y compu: abre el instalador del navegador. iPhone: muestra los pasos de "Agregar a inicio".
 */
export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null)
  const [ios, setIos] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    if (isStandalone() || wasDismissed()) return
    setIos(isIos())
    setHidden(!isIos())

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as InstallEvent)
      setHidden(false)
    }
    const onInstalled = () => setHidden(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (hidden) return null

  const install = async () => {
    if (!installEvent) return setHelpOpen(true)
    await installEvent.prompt()
    const { outcome } = await installEvent.userChoice
    if (outcome === 'accepted') setHidden(true)
    setInstallEvent(null)
  }

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // Sin almacenamiento: se oculta solo por esta vez
    }
    setHidden(true)
  }

  return (
    <>
      <div className="glass-strong fixed bottom-5 right-5 z-40 flex animate-rise items-center gap-1 rounded-full py-1.5 pl-2 pr-1">
        <button
          type="button"
          onClick={install}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-accent px-4 text-sm font-semibold text-white shadow-glow transition active:scale-95"
        >
          <Download size={16} /> Instalar app
        </button>
        <IconButton label="Ocultar" onClick={dismiss} className="h-9 w-9 text-muted">
          <X size={16} />
        </IconButton>
      </div>
      <Modal open={helpOpen} title="Instalar Orbita Z" subtitle="Queda como una app en tu pantalla de inicio" onClose={() => setHelpOpen(false)}>
        {ios ? (
          <ol className="space-y-3 pb-2 text-sm">
            <li className="flex items-center gap-3">
              <Share size={20} className="shrink-0 text-accent" /> Tocá el botón <b>Compartir</b> de Safari (abajo).
            </li>
            <li className="flex items-center gap-3">
              <SquarePlus size={20} className="shrink-0 text-accent" /> Elegí <b>Agregar a inicio</b> y después <b>Agregar</b>.
            </li>
          </ol>
        ) : (
          <p className="pb-2 text-sm">
            Abrí el menú del navegador (<b>⋮</b>) y elegí <b>Instalar app</b> o <b>Agregar a la pantalla principal</b>.
          </p>
        )}
      </Modal>
    </>
  )
}

'use client'

import { CloudUpload, TriangleAlert, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, IconButton } from '@/shared/components/ui'
import { clearLocalClients, readLocalClients } from '../lib/local-backup'
import { useClients } from '../store/clients-store'
import type { Client } from '../types/client'

/** Aviso de error al guardar o cargar */
export function ErrorBanner() {
  const error = useClients((s) => s.error)
  const clearError = useClients((s) => s.clearError)
  if (!error) return null
  return (
    <div role="alert" className="mb-4 flex animate-rise items-center gap-3 rounded-3xl bg-bad/10 px-4 py-3 text-sm font-medium text-bad">
      <TriangleAlert size={18} className="shrink-0" />
      <span className="flex-1">{error}</span>
      <IconButton label="Cerrar aviso" onClick={clearError} className="h-8 w-8 text-bad">
        <X size={16} />
      </IconButton>
    </div>
  )
}

/** Ofrece subir a la cuenta los clientes que quedaron guardados en este navegador */
export function LocalImportBanner() {
  const importMany = useClients((s) => s.importMany)
  const [pending, setPending] = useState<Client[]>([])
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => setPending(readLocalClients()), [])

  if (pending.length === 0) return null

  const upload = async () => {
    setBusy(true)
    setFailed(false)
    try {
      await importMany(pending)
      clearLocalClients()
      setPending([])
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="glass mb-4 flex animate-rise flex-wrap items-center gap-3 rounded-3xl p-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
        <CloudUpload size={22} />
      </div>
      <div className="min-w-[12rem] flex-1">
        <p className="font-semibold">Tenés {pending.length} clientes guardados en este navegador</p>
        <p className="text-sm text-muted">{failed ? 'No se pudieron subir. Probá de nuevo.' : 'Pasalos a tu cuenta para no perderlos.'}</p>
      </div>
      <div className="flex gap-2">
        {/* Solo oculta el aviso: los datos del navegador no se borran hasta subirlos */}
        <Button variant="ghost" size="sm" onClick={() => setPending([])} disabled={busy}>
          Ahora no
        </Button>
        <Button size="sm" onClick={upload} disabled={busy}>
          {busy ? 'Subiendo…' : 'Pasar a mi cuenta'}
        </Button>
      </div>
    </div>
  )
}

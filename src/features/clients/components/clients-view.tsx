'use client'

import { Loader2, Search, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ProfileBanner } from '@/features/profile/components/profile-banner'
import { ProfileForm } from '@/features/profile/components/profile-form'
import { useProfile } from '@/features/profile/store/profile-store'
import { Button, Card, EmptyState, Modal, cn } from '@/shared/components/ui'
import { byFollowUp, followUpState } from '../lib/follow-up'
import { useClients } from '../store/clients-store'
import type { Client, ClientStatus } from '../types/client'
import { ClientCard } from './client-card'
import { ClientDetail } from './client-detail'
import { ClientForm } from './client-form'
import { ClientsHeader } from './clients-header'
import { ErrorBanner, LocalImportBanner } from './sync-banners'

type Filter = 'todos' | 'seguimiento' | ClientStatus

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'seguimiento', label: 'Para contactar' },
  { id: 'activo', label: 'Activos' },
  { id: 'potencial', label: 'Potenciales' },
  { id: 'inactivo', label: 'Inactivos' },
]

type Panel = { mode: 'new' } | { mode: 'view' | 'edit'; id: string } | null

const needsContact = (c: Client) => ['hoy', 'atrasado'].includes(followUpState(c))

function matches(c: Client, query: string, filter: Filter): boolean {
  if (filter === 'seguimiento' && !needsContact(c)) return false
  if (filter !== 'todos' && filter !== 'seguimiento' && c.status !== filter) return false
  if (!query) return true
  const haystack = [c.name, c.company, c.email, c.phone, ...c.tags].join(' ').toLowerCase()
  return haystack.includes(query.toLowerCase())
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <Card className="animate-rise p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className={cn('mt-1 font-display text-3xl font-bold', tone)}>{value}</p>
    </Card>
  )
}

export function ClientsView() {
  const { clients, status, load, add, update, loadDemo } = useClients()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('todos')
  const [panel, setPanel] = useState<Panel>(null)
  const [loadingDemo, setLoadingDemo] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const loadProfile = useProfile((s) => s.load)

  useEffect(() => {
    void load()
    void loadProfile()
  }, [load, loadProfile])

  const showDemo = async () => {
    setLoadingDemo(true)
    try {
      await loadDemo()
    } catch {
      useClients.setState({ error: 'No se pudieron cargar los ejemplos. Probá de nuevo.' })
    } finally {
      setLoadingDemo(false)
    }
  }

  const visible = useMemo(
    () => clients.filter((c) => matches(c, query.trim(), filter)).sort(byFollowUp),
    [clients, query, filter],
  )
  const toContact = clients.filter(needsContact).length
  const active = clients.filter((c) => c.status === 'activo').length
  const current = panel && panel.mode !== 'new' ? clients.find((c) => c.id === panel.id) : undefined
  const close = () => setPanel(null)

  const loading = status === 'idle' || status === 'loading'

  return (
    <main className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:pt-10">
      <ClientsHeader onNew={() => setPanel({ mode: 'new' })} onProfile={() => setProfileOpen(true)} />
      <ErrorBanner />
      <ProfileBanner onOpen={() => setProfileOpen(true)} />
      {!loading && <LocalImportBanner />}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-muted">
          <Loader2 size={20} className="animate-spin" /> Cargando tus clientes…
        </div>
      ) : status === 'error' && clients.length === 0 ? (
        <Card className="animate-rise text-center">
          <p className="mb-4 text-muted">No pudimos traer tus clientes.</p>
          <Button variant="soft" onClick={() => void load()}>Reintentar</Button>
        </Card>
      ) : clients.length === 0 ? (
        <Card className="animate-rise">
          <EmptyState
            icon={<Users size={30} />}
            title="Todavía no cargaste clientes"
            text="Agregá el primero o mirá cómo funciona con algunos ejemplos."
            action={
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <Button onClick={() => setPanel({ mode: 'new' })}>Agregar cliente</Button>
                <Button variant="soft" onClick={showDemo} disabled={loadingDemo}>
                  {loadingDemo ? 'Cargando…' : 'Ver ejemplos'}
                </Button>
              </div>
            }
          />
        </Card>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-3 gap-3">
            <Stat label="Clientes" value={clients.length} />
            <Stat label="Activos" value={active} tone="text-ok" />
            <Stat label="Para hoy" value={toContact} tone={toContact > 0 ? 'text-warn' : undefined} />
          </div>
          <div className="relative mb-3">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre, empresa, etiqueta…" className="field glass pl-11" />
          </div>
          <div className="scroll-thin mb-4 flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  'h-9 shrink-0 rounded-full px-4 text-sm font-semibold transition',
                  filter === f.id ? 'bg-gradient-accent text-white shadow-glow' : 'glass text-muted hover:text-ink',
                )}
              >
                {f.label}
                {f.id === 'seguimiento' && toContact > 0 && ` (${toContact})`}
              </button>
            ))}
          </div>
          <ul className="space-y-2.5">
            {visible.map((c) => (
              <ClientCard key={c.id} client={c} onOpen={() => setPanel({ mode: 'view', id: c.id })} />
            ))}
          </ul>
          {visible.length === 0 && <p className="py-10 text-center text-sm text-muted">No hay clientes que coincidan.</p>}
        </>
      )}

      <Modal open={profileOpen} title="Mi perfil" onClose={() => setProfileOpen(false)}>
        <ProfileForm onDone={() => setProfileOpen(false)} />
      </Modal>
      <Modal open={panel?.mode === 'new'} title="Nuevo cliente" onClose={close}>
        <ClientForm onCancel={close} onSubmit={(input) => setPanel({ mode: 'view', id: add(input) })} />
      </Modal>
      {current && (
        <Modal open={panel?.mode === 'view'} title={current.name} onClose={close}>
          <ClientDetail client={current} onEdit={() => setPanel({ mode: 'edit', id: current.id })} onDeleted={close} />
        </Modal>
      )}
      {current && (
        <Modal open={panel?.mode === 'edit'} title="Editar cliente" onClose={close}>
          <ClientForm
            initial={current}
            onCancel={() => setPanel({ mode: 'view', id: current.id })}
            onSubmit={(input) => {
              update(current.id, input)
              setPanel({ mode: 'view', id: current.id })
            }}
          />
        </Modal>
      )}
    </main>
  )
}

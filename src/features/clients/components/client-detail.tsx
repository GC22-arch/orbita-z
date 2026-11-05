'use client'

import { Building2, CalendarCheck, Mail, Pencil, Phone, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { clientMessages } from '@/features/profile/lib/messages'
import { useProfile } from '@/features/profile/store/profile-store'
import { ContactButtons } from '@/shared/components/contact-buttons'
import { Avatar, Badge, Button, IconButton } from '@/shared/components/ui'
import { formatDay, todayISO } from '@/shared/lib/format'
import { FOLLOW_UP_TONES, STATUS_META, followUpLabel, followUpState } from '../lib/follow-up'
import { useClients } from '../store/clients-store'
import type { Client } from '../types/client'

const QUICK_FOLLOW_UPS = [
  { label: 'Mañana', days: 1 },
  { label: 'En 1 semana', days: 7 },
  { label: 'En 1 mes', days: 30 },
]

interface ClientDetailProps {
  client: Client
  onEdit: () => void
  onDeleted: () => void
}

export function ClientDetail({ client, onEdit, onDeleted }: ClientDetailProps) {
  const { update, remove, addNote, removeNote, markContacted } = useClients()
  const [note, setNote] = useState('')
  const profile = useProfile((s) => s.profile)
  const status = STATUS_META[client.status]

  const saveNote = () => {
    if (!note.trim()) return
    addNote(client.id, note.trim())
    setNote('')
  }

  const handleDelete = () => {
    if (!window.confirm(`¿Borrar a ${client.name}? No se puede deshacer.`)) return
    remove(client.id)
    onDeleted()
  }

  return (
    <div className="space-y-5 pb-2">
      <div className="flex items-center gap-4">
        <Avatar name={client.name} size="lg" />
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap gap-1.5">
            <Badge tone={status.tone}>{status.label}</Badge>
            {client.tags.map((t) => (
              <Badge key={t}>#{t}</Badge>
            ))}
          </div>
          {client.company && (
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <Building2 size={14} /> {client.company}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5 text-sm text-muted">
        {client.phone && <p className="flex items-center gap-2"><Phone size={14} /> {client.phone}</p>}
        {client.email && <p className="flex items-center gap-2"><Mail size={14} /> {client.email}</p>}
        <p>Último contacto: <span className="font-semibold text-ink">{client.lastContact ? formatDay(client.lastContact) : 'nunca'}</span></p>
      </div>

      <ContactButtons
        phone={client.phone}
        email={client.email}
        {...clientMessages(client.name, profile)}
        onContact={() => update(client.id, { lastContact: todayISO() })}
      />

      <section className="rounded-3xl bg-ink/[0.04] p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="font-display font-semibold">Seguimiento</h3>
          <Badge tone={FOLLOW_UP_TONES[followUpState(client)]}>{followUpLabel(client)}</Badge>
        </div>
        <p className="mb-3 text-sm text-muted">Marcar como contactado hoy y volver a contactar:</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_FOLLOW_UPS.map(({ label, days }) => (
            <Button key={days} variant="soft" size="sm" icon={<CalendarCheck size={15} />} onClick={() => markContacted(client.id, todayISO(days))}>
              {label}
            </Button>
          ))}
          <input
            type="date"
            aria-label="Elegir fecha de seguimiento"
            value={client.nextFollowUp ?? ''}
            onChange={(e) => update(client.id, { nextFollowUp: e.target.value || undefined })}
            className="field h-9 w-auto rounded-2xl py-0 text-sm"
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-display font-semibold">Notas</h3>
        <div className="flex gap-2">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveNote()}
            placeholder="¿Qué hablaron?"
            className="field"
          />
          <Button onClick={saveNote}>Anotar</Button>
        </div>
        <ul className="mt-3 space-y-2">
          {client.notes.map((n) => (
            <li key={n.id} className="flex animate-rise items-start gap-2 rounded-2xl bg-ink/[0.04] p-3 text-sm">
              <div className="flex-1">
                <p className="whitespace-pre-wrap">{n.text}</p>
                <p className="mt-1 text-xs text-muted">{formatDay(n.createdAt.slice(0, 10))}</p>
              </div>
              <IconButton label="Borrar nota" onClick={() => removeNote(client.id, n.id)} className="-m-2 h-9 w-9 text-muted hover:text-bad">
                <X size={16} />
              </IconButton>
            </li>
          ))}
          {client.notes.length === 0 && <li className="text-sm text-muted">Todavía no hay notas.</li>}
        </ul>
      </section>

      <div className="flex gap-2 border-t border-line/60 pt-4">
        <Button variant="ghost" icon={<Pencil size={16} />} onClick={onEdit} className="flex-1">
          Editar
        </Button>
        <Button variant="danger" icon={<Trash2 size={16} />} onClick={handleDelete} className="flex-1">
          Borrar
        </Button>
      </div>
    </div>
  )
}

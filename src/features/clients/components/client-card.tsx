'use client'

import { clientMessages } from '@/features/profile/lib/messages'
import { useProfile } from '@/features/profile/store/profile-store'
import { ContactButtons } from '@/shared/components/contact-buttons'
import { Avatar, Badge } from '@/shared/components/ui'
import { todayISO } from '@/shared/lib/format'
import { FOLLOW_UP_TONES, STATUS_META, followUpLabel, followUpState } from '../lib/follow-up'
import { useClients } from '../store/clients-store'
import type { Client } from '../types/client'

export function ClientCard({ client, onOpen }: { client: Client; onOpen: () => void }) {
  const update = useClients((s) => s.update)
  const profile = useProfile((s) => s.profile)
  const status = STATUS_META[client.status]
  const messages = clientMessages(client.name, profile)

  return (
    <li className="glass flex animate-rise items-center gap-3 rounded-3xl p-3 transition hover:-translate-y-0.5">
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <Avatar name={client.name} />
        <span className="min-w-0">
          <span className="block truncate font-semibold">{client.name}</span>
          <span className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge tone={status.tone}>{status.label}</Badge>
            <Badge tone={FOLLOW_UP_TONES[followUpState(client)]}>{followUpLabel(client)}</Badge>
            {client.company && <span className="truncate text-xs text-muted">{client.company}</span>}
          </span>
        </span>
      </button>
      <ContactButtons
        compact
        phone={client.phone}
        email={client.email}
        {...messages}
        onContact={() => update(client.id, { lastContact: todayISO() })}
      />
    </li>
  )
}

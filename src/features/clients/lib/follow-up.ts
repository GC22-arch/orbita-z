import type { Tone } from '@/shared/components/ui'
import { formatDay, todayISO } from '@/shared/lib/format'
import type { Client, ClientStatus } from '../types/client'

export type FollowUpState = 'atrasado' | 'hoy' | 'proximo' | 'ninguno'

export function followUpState(client: Client): FollowUpState {
  if (!client.nextFollowUp) return 'ninguno'
  const today = todayISO()
  if (client.nextFollowUp < today) return 'atrasado'
  if (client.nextFollowUp === today) return 'hoy'
  return 'proximo'
}

export function followUpLabel(client: Client): string {
  const state = followUpState(client)
  if (state === 'hoy') return 'Contactar hoy'
  if (state === 'atrasado') return `Atrasado (${formatDay(client.nextFollowUp!)})`
  if (state === 'proximo') return `Seguimiento ${formatDay(client.nextFollowUp!)}`
  return 'Sin seguimiento'
}

export const FOLLOW_UP_TONES: Record<FollowUpState, Tone> = {
  atrasado: 'bad',
  hoy: 'warn',
  proximo: 'accent',
  ninguno: 'neutral',
}

export const STATUS_META: Record<ClientStatus, { label: string; tone: Tone }> = {
  activo: { label: 'Activo', tone: 'ok' },
  potencial: { label: 'Potencial', tone: 'accent' },
  inactivo: { label: 'Inactivo', tone: 'neutral' },
}

/** Ordena: primero atrasados, luego hoy, luego próximos por fecha, al final sin seguimiento */
export function byFollowUp(a: Client, b: Client): number {
  const fa = a.nextFollowUp ?? '9999'
  const fb = b.nextFollowUp ?? '9999'
  return fa === fb ? a.name.localeCompare(b.name) : fa.localeCompare(fb)
}

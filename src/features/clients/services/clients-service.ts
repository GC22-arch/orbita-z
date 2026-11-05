import { createClient } from '@/lib/supabase/client'
import type { Client, ClientStatus, Note } from '../types/client'

const TABLE = 'oz_clients'

interface ClientRow {
  id: string
  name: string
  phone: string
  email: string
  company: string
  status: ClientStatus
  tags: string[]
  last_contact: string | null
  next_follow_up: string | null
  notes: Note[]
  created_at: string
}

const toClient = (r: ClientRow): Client => ({
  id: r.id,
  name: r.name,
  phone: r.phone,
  email: r.email,
  company: r.company,
  status: r.status,
  tags: r.tags,
  lastContact: r.last_contact ?? undefined,
  nextFollowUp: r.next_follow_up ?? undefined,
  notes: r.notes,
  createdAt: r.created_at,
})

/** Convierte un cambio parcial al formato de la tabla (undefined en fechas = borrar la fecha) */
function toRow(patch: Partial<Client>): Partial<ClientRow> {
  const row: Partial<ClientRow> = {}
  if ('name' in patch) row.name = patch.name
  if ('phone' in patch) row.phone = patch.phone
  if ('email' in patch) row.email = patch.email
  if ('company' in patch) row.company = patch.company
  if ('status' in patch) row.status = patch.status
  if ('tags' in patch) row.tags = patch.tags
  if ('notes' in patch) row.notes = patch.notes
  if ('lastContact' in patch) row.last_contact = patch.lastContact ?? null
  if ('nextFollowUp' in patch) row.next_follow_up = patch.nextFollowUp ?? null
  if ('id' in patch) row.id = patch.id
  if ('createdAt' in patch) row.created_at = patch.createdAt
  return row
}

const db = () => createClient().from(TABLE)

export async function fetchClients(): Promise<Client[]> {
  const { data, error } = await db().select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data as ClientRow[]).map(toClient)
}

export async function insertClients(clients: Client[]): Promise<void> {
  const { error } = await db().insert(clients.map(toRow))
  if (error) throw error
}

export async function updateClient(id: string, patch: Partial<Client>): Promise<void> {
  const { error } = await db().update(toRow(patch)).eq('id', id)
  if (error) throw error
}

export async function deleteClient(id: string): Promise<void> {
  const { error } = await db().delete().eq('id', id)
  if (error) throw error
}

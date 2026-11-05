'use client'

import { create } from 'zustand'
import { todayISO, uid } from '@/shared/lib/format'
import { demoClients } from '../lib/demo-clients'
import * as service from '../services/clients-service'
import type { Client, ClientInput } from '../types/client'

/**
 * Los clientes viven en Supabase (tabla oz_clients, cada usuario ve solo los suyos).
 * Los cambios se muestran al instante y se guardan en segundo plano; si fallan, se recarga la lista.
 */
interface ClientsState {
  clients: Client[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  error: string | null
  load: () => Promise<void>
  add: (input: ClientInput) => string
  update: (id: string, patch: Partial<Client>) => void
  remove: (id: string) => void
  addNote: (id: string, text: string) => void
  removeNote: (id: string, noteId: string) => void
  /** Registra el contacto de hoy y, si se indica, agenda el próximo seguimiento */
  markContacted: (id: string, nextFollowUp?: string) => void
  /** Sube varios clientes de una vez (ejemplos o datos guardados en el navegador) */
  importMany: (clients: Client[]) => Promise<void>
  loadDemo: () => Promise<void>
  clearError: () => void
}

const SAVE_ERROR = 'No se pudo guardar el último cambio. Revisá tu conexión.'

export const useClients = create<ClientsState>()((set, get) => {
  /** Ejecuta el guardado; si falla, avisa y vuelve a traer los datos reales */
  const sync = (job: Promise<void>) =>
    job.catch(() => {
      set({ error: SAVE_ERROR })
      void get().load()
    })

  const patchLocal = (id: string, fn: (c: Client) => Client) => {
    const next = get().clients.map((c) => (c.id === id ? fn(c) : c))
    set({ clients: next })
    return next.find((c) => c.id === id)
  }

  return {
    clients: [],
    status: 'idle',
    error: null,
    load: async () => {
      if (get().status === 'idle') set({ status: 'loading' })
      try {
        set({ clients: await service.fetchClients(), status: 'ready' })
      } catch {
        set({ status: 'error', error: 'No se pudieron cargar tus clientes. Revisá tu conexión.' })
      }
    },
    add: (input) => {
      const client: Client = { ...input, id: crypto.randomUUID(), notes: [], createdAt: new Date().toISOString() }
      set({ clients: [client, ...get().clients] })
      void sync(service.insertClients([client]))
      return client.id
    },
    update: (id, patch) => {
      patchLocal(id, (c) => ({ ...c, ...patch }))
      void sync(service.updateClient(id, patch))
    },
    remove: (id) => {
      set({ clients: get().clients.filter((c) => c.id !== id) })
      void sync(service.deleteClient(id))
    },
    addNote: (id, text) => {
      const updated = patchLocal(id, (c) => ({
        ...c,
        notes: [{ id: uid(), text, createdAt: new Date().toISOString() }, ...c.notes],
      }))
      if (updated) void sync(service.updateClient(id, { notes: updated.notes }))
    },
    removeNote: (id, noteId) => {
      const updated = patchLocal(id, (c) => ({ ...c, notes: c.notes.filter((n) => n.id !== noteId) }))
      if (updated) void sync(service.updateClient(id, { notes: updated.notes }))
    },
    markContacted: (id, nextFollowUp) => get().update(id, { lastContact: todayISO(), nextFollowUp }),
    importMany: async (clients) => {
      await service.insertClients(clients)
      await get().load()
    },
    loadDemo: () => get().importMany(demoClients()),
    clearError: () => set({ error: null }),
  }
})

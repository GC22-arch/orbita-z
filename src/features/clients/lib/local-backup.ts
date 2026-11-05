import { CLIENTS_STORAGE_KEY } from '@/shared/constants/storage'
import type { Client } from '../types/client'

/**
 * Antes del login los clientes se guardaban en el navegador.
 * Esto los lee para ofrecer pasarlos a la cuenta, y los borra una vez subidos.
 */
export function readLocalClients(): Client[] {
  try {
    const raw = localStorage.getItem(CLIENTS_STORAGE_KEY)
    const clients = raw ? (JSON.parse(raw) as { state?: { clients?: Client[] } }).state?.clients : undefined
    // Los ids viejos no son UUID: se generan nuevos al subirlos
    return Array.isArray(clients) ? clients.map((c) => ({ ...c, id: crypto.randomUUID() })) : []
  } catch {
    return []
  }
}

export function clearLocalClients(): void {
  try {
    localStorage.removeItem(CLIENTS_STORAGE_KEY)
  } catch {
    // Sin acceso al almacenamiento: no hay nada que borrar
  }
}

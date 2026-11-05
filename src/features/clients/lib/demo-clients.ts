import { todayISO, uid } from '@/shared/lib/format'
import type { Client } from '../types/client'

const newId = () => crypto.randomUUID()
const now = () => new Date().toISOString()

/** Clientes de ejemplo para probar la app sin cargar nada */
export function demoClients(): Client[] {
  return [
    {
      id: newId(), name: 'Laura Méndez', phone: '+54 9 11 5555 1234', email: 'laura@estudiomendez.com',
      company: 'Estudio Méndez', status: 'activo', tags: ['contabilidad'], lastContact: todayISO(-14),
      nextFollowUp: todayISO(), createdAt: now(),
      notes: [{ id: uid(), text: 'Quiere renovar el servicio anual. Llamar para pasar precio.', createdAt: now() }],
    },
    {
      id: newId(), name: 'Martín Ruiz', phone: '+54 9 351 555 9876', email: 'martin.ruiz@gmail.com',
      company: '', status: 'potencial', tags: ['referido'], nextFollowUp: todayISO(-3), createdAt: now(),
      notes: [{ id: uid(), text: 'Lo recomendó Laura. Le interesa una cotización.', createdAt: now() }],
    },
    {
      id: newId(), name: 'Sofía Herrera', phone: '+52 55 5555 4321', email: 'sofia@herreradeco.mx',
      company: 'Herrera Deco', status: 'activo', tags: ['vip'], lastContact: todayISO(-2),
      nextFollowUp: todayISO(5), createdAt: now(), notes: [],
    },
    {
      id: newId(), name: 'Diego Fernández', phone: '+54 9 223 555 0000', email: '',
      company: 'Taller DF', status: 'inactivo', tags: [], lastContact: todayISO(-120), createdAt: now(), notes: [],
    },
  ]
}

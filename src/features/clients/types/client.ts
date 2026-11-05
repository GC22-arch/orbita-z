export type ClientStatus = 'activo' | 'potencial' | 'inactivo'

export interface Note {
  id: string
  text: string
  createdAt: string
}

export interface Client {
  id: string
  name: string
  phone: string
  email: string
  company: string
  status: ClientStatus
  tags: string[]
  /** Fechas en formato YYYY-MM-DD */
  lastContact?: string
  nextFollowUp?: string
  notes: Note[]
  createdAt: string
}

export type ClientInput = Pick<Client, 'name' | 'phone' | 'email' | 'company' | 'status' | 'tags' | 'nextFollowUp'>

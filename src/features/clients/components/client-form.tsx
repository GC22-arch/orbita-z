'use client'

import { useState, type FormEvent } from 'react'
import { Button, Field, Segmented } from '@/shared/components/ui'
import { clientSchema, type ClientFormValues } from '../lib/validation'
import type { Client, ClientInput, ClientStatus } from '../types/client'

interface ClientFormProps {
  initial?: Client
  onSubmit: (input: ClientInput) => void
  onCancel: () => void
}

const STATUS_OPTIONS: { value: ClientStatus; label: string }[] = [
  { value: 'potencial', label: 'Potencial' },
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
]

function toValues(c?: Client): ClientFormValues {
  return {
    name: c?.name ?? '',
    phone: c?.phone ?? '',
    email: c?.email ?? '',
    company: c?.company ?? '',
    status: c?.status ?? 'potencial',
    tags: c?.tags.join(', ') ?? '',
    nextFollowUp: c?.nextFollowUp ?? '',
  }
}

export function ClientForm({ initial, onSubmit, onCancel }: ClientFormProps) {
  const [values, setValues] = useState<ClientFormValues>(() => toValues(initial))
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormValues, string>>>({})
  const set = (key: keyof ClientFormValues) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const parsed = clientSchema.safeParse(values)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]])))
      return
    }
    onSubmit(parsed.data)
  }

  const error = (key: keyof ClientFormValues) =>
    errors[key] && <span className="mt-1 block text-sm font-medium text-bad">{errors[key]}</span>

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-2" noValidate>
      <Field label="Nombre *">
        <input className="field" value={values.name} onChange={set('name')} autoFocus placeholder="Ej: Laura Méndez" />
        {error('name')}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="WhatsApp / teléfono" hint={errors.phone ? undefined : 'Con o sin código de país'}>
          <input className="field" value={values.phone} onChange={set('phone')} inputMode="tel" placeholder="11 5555 1234" />
          {error('phone')}
        </Field>
        <Field label="Mail">
          <input className="field" value={values.email} onChange={set('email')} inputMode="email" placeholder="nombre@mail.com" />
          {error('email')}
        </Field>
      </div>
      <Field label="Empresa">
        <input className="field" value={values.company} onChange={set('company')} placeholder="Opcional" />
      </Field>
      <Field label="Estado">
        <Segmented
          value={values.status}
          options={STATUS_OPTIONS}
          onChange={(status) => setValues((v) => ({ ...v, status }))}
          className="flex w-full [&>button]:flex-1"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Próximo seguimiento">
          <input type="date" className="field" value={values.nextFollowUp} onChange={set('nextFollowUp')} />
        </Field>
        <Field label="Etiquetas" hint="Separadas por coma">
          <input className="field" value={values.tags} onChange={set('tags')} placeholder="vip, referido" />
        </Field>
      </div>
      <div className="flex gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Guardar
        </Button>
      </div>
    </form>
  )
}

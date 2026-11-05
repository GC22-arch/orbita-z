'use client'

import { useState, type FormEvent } from 'react'
import { z } from 'zod'
import { Button, Field } from '@/shared/components/ui'
import { clientMessages } from '../lib/messages'
import { useProfile, type Profile } from '../store/profile-store'

/** Países para completar los números de clientes cargados sin código */
const COUNTRIES = [
  { code: '54', name: 'Argentina' },
  { code: '591', name: 'Bolivia' },
  { code: '56', name: 'Chile' },
  { code: '57', name: 'Colombia' },
  { code: '593', name: 'Ecuador' },
  { code: '34', name: 'España' },
  { code: '1', name: 'Estados Unidos' },
  { code: '52', name: 'México' },
  { code: '595', name: 'Paraguay' },
  { code: '51', name: 'Perú' },
  { code: '598', name: 'Uruguay' },
  { code: '58', name: 'Venezuela' },
]

const profileSchema = z.object({
  fullName: z.string().trim().max(80, 'Nombre muy largo'),
  phone: z
    .string()
    .trim()
    .refine((v) => v === '' || v.replace(/\D/g, '').length >= 8, 'Teléfono incompleto'),
  business: z.string().trim().max(80, 'Nombre muy largo'),
  countryCode: z.enum(COUNTRIES.map((c) => c.code) as [string, ...string[]]),
})

export function ProfileForm({ onDone }: { onDone: () => void }) {
  const { profile, email, save } = useProfile()
  const [values, setValues] = useState<Profile>(profile)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const set = (key: keyof Profile) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [key]: e.target.value }))
  const preview = clientMessages('Laura Méndez', values).whatsappText

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const parsed = profileSchema.safeParse(values)
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? 'Revisá los datos')
    setSaving(true)
    setError(null)
    try {
      await save(parsed.data)
      onDone()
    } catch {
      setError('No se pudo guardar. Revisá tu conexión y probá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-2" noValidate>
      <p className="text-sm text-muted">
        Estos datos aparecen en los mensajes que les mandás a tus clientes. Cuenta: <span className="font-semibold text-ink">{email}</span>
      </p>
      <Field label="Tu nombre">
        <input className="field" value={values.fullName} onChange={set('fullName')} autoFocus placeholder="Ej: Ana Pérez" />
      </Field>
      <Field label="Tu WhatsApp" hint="Con código de país. Va en la firma de tus mails.">
        <input className="field" value={values.phone} onChange={set('phone')} inputMode="tel" placeholder="+54 9 11 5555 1234" />
      </Field>
      <Field label="Tu país" hint="Se agrega solo a los números de tus clientes que cargues sin código de país.">
        <select className="field" value={values.countryCode} onChange={set('countryCode')}>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name} (+{c.code})
            </option>
          ))}
        </select>
      </Field>
      <Field label="Tu empresa o negocio" hint="Opcional">
        <input className="field" value={values.business} onChange={set('business')} placeholder="Ej: Estudio Pérez" />
      </Field>
      <div className="rounded-2xl bg-ink/[0.04] p-3 text-sm">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Así empieza tu WhatsApp</p>
        <p>{preview}…</p>
      </div>
      {error && <p className="rounded-2xl bg-bad/10 px-4 py-3 text-sm font-medium text-bad">{error}</p>}
      <div className="flex gap-2 pt-2">
        <Button variant="ghost" onClick={onDone} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? 'Guardando…' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}

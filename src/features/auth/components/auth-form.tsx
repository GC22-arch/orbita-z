'use client'

import { useActionState } from 'react'
import { Button, Field } from '@/shared/components/ui'
import type { AuthResult } from '../services/auth-actions'

interface AuthFormProps {
  action: (prev: AuthResult, formData: FormData) => Promise<AuthResult>
  submitLabel: string
  pendingLabel: string
  fields: ('email' | 'password' | 'new-password')[]
}

const FIELD_PROPS = {
  email: { label: 'Mail', name: 'email', type: 'email', autoComplete: 'email', placeholder: 'nombre@mail.com' },
  password: { label: 'Contraseña', name: 'password', type: 'password', autoComplete: 'current-password', placeholder: '••••••' },
  'new-password': { label: 'Contraseña', name: 'password', type: 'password', autoComplete: 'new-password', placeholder: 'Mínimo 6 caracteres' },
}

/** Formulario único para entrar y crear cuenta */
export function AuthForm({ action, submitLabel, pendingLabel, fields }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="space-y-4">
      {fields.map((f, i) => {
        const { label, ...input } = FIELD_PROPS[f]
        return (
          <Field key={f} label={label}>
            <input {...input} required autoFocus={i === 0} className="field" />
          </Field>
        )
      })}
      {state?.error && <p className="rounded-2xl bg-bad/10 px-4 py-3 text-sm font-medium text-bad">{state.error}</p>}
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  )
}

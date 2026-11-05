'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export type AuthResult = { error?: string } | undefined

const emailSchema = z.string().trim().toLowerCase().email('Escribí un mail válido')
const passwordSchema = z.string().min(6, 'La contraseña necesita al menos 6 caracteres')
const credentialsSchema = z.object({ email: emailSchema, password: passwordSchema })

/** Traduce los errores más comunes de Supabase */
function friendly(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Mail o contraseña incorrectos'
  if (m.includes('already registered')) return 'Ese mail ya tiene una cuenta. Iniciá sesión.'
  if (m.includes('rate limit') || m.includes('security purposes')) return 'Demasiados intentos. Esperá unos minutos y probá de nuevo.'
  return 'No se pudo completar. Probá de nuevo en un momento.'
}

function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Datos inválidos'
}

export async function login(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: firstError(parsed.error) }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { error: friendly(error.message) }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: firstError(parsed.error) }

  // La cuenta se crea ya confirmada: el mail gratuito de Supabase no llega a usuarios externos.
  // Cuando haya un proveedor de mail propio (Resend), se puede volver a pedir confirmación.
  const { error: createError } = await createAdminClient().auth.admin.createUser({
    ...parsed.data,
    email_confirm: true,
  })
  if (createError) {
    const taken = createError.status === 422 || /already/i.test(createError.message)
    return { error: taken ? 'Ese mail ya tiene una cuenta. Iniciá sesión.' : friendly(createError.message) }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { error: friendly(error.message) }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

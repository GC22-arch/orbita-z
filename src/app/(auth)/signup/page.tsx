import Link from 'next/link'
import { AuthForm } from '@/features/auth/components/auth-form'
import { signup } from '@/features/auth/services/auth-actions'

export default function SignupPage() {
  return (
    <>
      <h1 className="font-display text-2xl font-semibold">Crear cuenta</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Gratis y al instante. Tus clientes quedan guardados en la nube.</p>
      <AuthForm action={signup} fields={['email', 'new-password']} submitLabel="Crear cuenta" pendingLabel="Creando…" />
      <p className="mt-6 text-center text-sm text-muted">
        ¿Ya tenés cuenta?{' '}
        <Link href="/login" className="font-semibold text-accent hover:underline">
          Entrar
        </Link>
      </p>
    </>
  )
}

import Link from 'next/link'
import { AuthForm } from '@/features/auth/components/auth-form'
import { login } from '@/features/auth/services/auth-actions'

export default function LoginPage() {
  return (
    <>
      <h1 className="font-display text-2xl font-semibold">Entrar</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Tus clientes te esperan.</p>
      <AuthForm action={login} fields={['email', 'password']} submitLabel="Entrar" pendingLabel="Entrando…" />
      <p className="mt-6 text-center text-sm text-muted">
        ¿No tenés cuenta?{' '}
        <Link href="/signup" className="font-semibold text-accent hover:underline">
          Crear cuenta
        </Link>
      </p>
    </>
  )
}

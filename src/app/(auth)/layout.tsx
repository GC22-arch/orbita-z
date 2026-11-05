import { AppLogo } from '@/shared/components/aurora-background'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-rise">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <AppLogo size={48} />
          <p className="font-display text-2xl font-bold tracking-tight">
            <span className="text-gradient">Orbita Z</span>
          </p>
        </div>
        <div className="glass rounded-4xl p-6 sm:p-8">{children}</div>
      </div>
    </main>
  )
}

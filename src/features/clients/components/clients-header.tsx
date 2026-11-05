'use client'

import { LogOut, Plus, UserRound } from 'lucide-react'
import { signout } from '@/features/auth/services/auth-actions'
import { AppLogo } from '@/shared/components/aurora-background'
import { ThemeToggle } from '@/shared/components/theme-toggle'
import { Button, IconButton } from '@/shared/components/ui'

interface ClientsHeaderProps {
  onNew: () => void
  onProfile: () => void
}

export function ClientsHeader({ onNew, onProfile }: ClientsHeaderProps) {
  return (
    <header className="mb-8 flex items-center justify-between gap-4">
      <div className="flex animate-rise items-center gap-3">
        <AppLogo size={40} />
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            <span className="text-gradient">Orbita Z</span>
          </h1>
          <p className="text-sm text-muted">Tus clientes, siempre a mano</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <IconButton label="Mi perfil" onClick={onProfile}>
          <UserRound size={20} />
        </IconButton>
        <form action={signout}>
          <IconButton label="Cerrar sesión" type="submit">
            <LogOut size={20} />
          </IconButton>
        </form>
        <Button icon={<Plus size={18} />} onClick={onNew} className="shadow-glow">
          Nuevo
        </Button>
      </div>
    </header>
  )
}

'use client'

import { UserRound } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { useProfile } from '../store/profile-store'

/** Invita a completar el perfil para que los mensajes salgan con nombre */
export function ProfileBanner({ onOpen }: { onOpen: () => void }) {
  const loaded = useProfile((s) => s.loaded)
  const fullName = useProfile((s) => s.profile.fullName)
  if (!loaded || fullName) return null
  return (
    <div className="glass mb-4 flex animate-rise flex-wrap items-center gap-3 rounded-3xl p-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
        <UserRound size={22} />
      </div>
      <div className="min-w-[12rem] flex-1">
        <p className="font-semibold">Completá tu perfil</p>
        <p className="text-sm text-muted">Así tus WhatsApp y mails salen con tu nombre, tu empresa y tu número.</p>
      </div>
      <Button size="sm" onClick={onOpen}>
        Completar
      </Button>
    </div>
  )
}

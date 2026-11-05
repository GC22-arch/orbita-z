'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'
import { useSettings, type ThemeMode } from '@/shared/stores/settings-store'
import { IconButton } from './ui'

const NEXT: Record<ThemeMode, ThemeMode> = { light: 'dark', dark: 'system', system: 'light' }
const LABELS: Record<ThemeMode, string> = { light: 'Tema claro', dark: 'Tema oscuro', system: 'Tema automático' }

/** Cambia entre claro, oscuro y automático, y mantiene sincronizada la clase .dark */
export function ThemeToggle() {
  const theme = useSettings((s) => s.theme)
  const setTheme = useSettings((s) => s.setTheme)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () =>
      document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && media.matches))
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor
  return (
    <IconButton label={`${LABELS[theme]} (tocar para cambiar)`} onClick={() => setTheme(NEXT[theme])}>
      <Icon key={theme} size={20} className="animate-pop" />
    </IconButton>
  )
}

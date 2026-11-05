'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SETTINGS_STORAGE_KEY } from '@/shared/constants/storage'

export type ThemeMode = 'light' | 'dark' | 'system'

interface SettingsState {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
}

export const useSettings = create<SettingsState>()(
  persist((set) => ({ theme: 'light', setTheme: (theme) => set({ theme }) }), { name: SETTINGS_STORAGE_KEY }),
)

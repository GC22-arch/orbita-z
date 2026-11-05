'use client'

import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_COUNTRY_CODE } from '@/shared/lib/format'

/** Datos del usuario que aparecen en los mensajes a sus clientes */
export interface Profile {
  fullName: string
  phone: string
  business: string
  /** Se agrega a los números de clientes cargados sin código de país */
  countryCode: string
}

const EMPTY: Profile = { fullName: '', phone: '', business: '', countryCode: DEFAULT_COUNTRY_CODE }

interface ProfileState {
  profile: Profile
  email: string
  loaded: boolean
  load: () => Promise<void>
  save: (profile: Profile) => Promise<void>
}

/**
 * El perfil se guarda en los metadatos de la cuenta de Supabase (user_metadata),
 * así no hace falta una tabla aparte. Cada usuario solo puede editar el suyo.
 */
export const useProfile = create<ProfileState>()((set) => ({
  profile: EMPTY,
  email: '',
  loaded: false,
  load: async () => {
    const { data } = await createClient().auth.getUser()
    const meta = (data.user?.user_metadata ?? {}) as Record<string, unknown>
    const text = (key: string) => (typeof meta[key] === 'string' ? (meta[key] as string) : '')
    set({
      profile: {
        fullName: text('full_name'),
        phone: text('phone'),
        business: text('business'),
        countryCode: text('country_code') || DEFAULT_COUNTRY_CODE,
      },
      email: data.user?.email ?? '',
      loaded: true,
    })
  },
  save: async (profile) => {
    const { error } = await createClient().auth.updateUser({
      data: { full_name: profile.fullName, phone: profile.phone, business: profile.business, country_code: profile.countryCode },
    })
    if (error) throw error
    set({ profile })
  },
}))

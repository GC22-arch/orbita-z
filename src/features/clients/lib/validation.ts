import { z } from 'zod'

export const clientSchema = z
  .object({
    name: z.string().trim().min(2, 'Escribí el nombre'),
    phone: z
      .string()
      .trim()
      .refine((v) => v === '' || v.replace(/\D/g, '').length >= 8, 'Teléfono incompleto'),
    email: z.string().trim().refine((v) => v === '' || z.string().email().safeParse(v).success, 'Mail inválido'),
    company: z.string().trim(),
    status: z.enum(['activo', 'potencial', 'inactivo']),
    tags: z.string(),
    nextFollowUp: z.string(),
  })
  .transform((v) => ({
    ...v,
    tags: v.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean),
    nextFollowUp: v.nextFollowUp || undefined,
  }))

export type ClientFormValues = z.input<typeof clientSchema>

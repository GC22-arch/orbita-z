import { firstName } from '@/shared/lib/format'
import type { Profile } from '../store/profile-store'

/** "Soy Ana, de Estudio Pérez." según lo que el usuario haya completado */
function presentation(p: Profile): string {
  const name = firstName(p.fullName)
  if (name && p.business) return `Soy ${name}, de ${p.business}.`
  if (name) return `Soy ${name}.`
  if (p.business) return `Te escribo de ${p.business}.`
  return ''
}

/** Firma para mails: nombre, empresa y WhatsApp en líneas separadas */
function signature(p: Profile): string {
  return [p.fullName, p.business, p.phone && `WhatsApp: ${p.phone}`].filter(Boolean).join('\n')
}

/** Arma los textos de WhatsApp y mail para un cliente con los datos del usuario */
export function clientMessages(clientName: string, p: Profile) {
  const greeting = `Hola ${firstName(clientName)}!`
  const intro = presentation(p)
  const sign = signature(p)
  return {
    whatsappText: `${greeting} ${intro} `.replace(/\s+$/, ' '),
    mailSubject: p.business ? `${p.business} — ${greeting}` : greeting,
    mailBody: `${greeting}\n\n\n${sign ? `Saludos,\n${sign}` : ''}`,
    countryCode: p.countryCode,
  }
}

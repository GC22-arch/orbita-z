export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

/** Fecha local en formato YYYY-MM-DD */
export function todayISO(offsetDays = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function formatDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es', { day: 'numeric', month: 'short' })
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? ''
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export const DEFAULT_COUNTRY_CODE = '54'

/** WhatsApp pide 54 9 para celulares argentinos: agrega el 9 si falta */
const fixArgentina = (d: string) => (d.startsWith('54') && !d.startsWith('549') && d.length === 12 ? `549${d.slice(2)}` : d)

/** Saca el "15" de los celulares argentinos escritos a la vieja usanza (área + 15 + número) */
function stripArgentine15(d: string): string {
  if (d.length !== 12) return d
  for (const area of [2, 3, 4]) {
    if (d.slice(area, area + 2) === '15') return d.slice(0, area) + d.slice(area + 2)
  }
  return d
}

/**
 * Número listo para wa.me (solo dígitos, con código de país).
 * Si el número se cargó sin código, usa el país del perfil del usuario.
 */
export function toWhatsappNumber(phone: string, countryCode = DEFAULT_COUNTRY_CODE): string {
  const raw = phone.trim()
  const digits = raw.replace(/\D/g, '')
  if (raw.startsWith('+') || raw.startsWith('00')) return fixArgentina(digits.replace(/^00/, ''))
  if (digits.startsWith(countryCode) && digits.length > 10) return fixArgentina(digits)
  const local = digits.replace(/^0+/, '')
  return countryCode === '54' ? `549${stripArgentine15(local)}` : `${countryCode}${local}`
}

export function whatsappUrl(phone: string, text = '', countryCode = DEFAULT_COUNTRY_CODE): string {
  return `https://wa.me/${toWhatsappNumber(phone, countryCode)}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

export function mailtoUrl(email: string, subject = '', body = ''): string {
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const query = params.toString().replace(/\+/g, '%20')
  return `mailto:${email}${query ? `?${query}` : ''}`
}

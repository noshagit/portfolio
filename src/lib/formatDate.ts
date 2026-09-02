const FR_MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]
const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const PRESENT_KEY = 999999

/**
 * @internal Parses a "MM/YYYY" or, when a precise start day matters for the live duration
 * calculation, "DD/MM/YYYY" string into day/month/year integers. Day defaults to 1 when
 * absent, and safe defaults are returned on malformed input.
 */
function parse(dateStr: string): { d: number; m: number; y: number } {
  const parts = (dateStr ?? '').split('/')
  const hasDay = parts.length === 3
  const d = hasDay ? parseInt(parts[0], 10) : 1
  const m = parseInt(parts[hasDay ? 1 : 0], 10)
  const y = parseInt(parts[hasDay ? 2 : 1], 10)
  return {
    d: isNaN(d) || d < 1 || d > 31 ? 1 : d,
    m: isNaN(m) || m < 1 || m > 12 ? 1 : m,
    y: isNaN(y) ? 0 : y,
  }
}

/** @internal Converts a parsed date to a sortable YYYYMM integer (e.g. `{ m: 6, y: 2026 }` → `202606`). */
function toKey(p: { m: number; y: number }): number {
  return p.y * 100 + p.m
}

/** Years only — card grid display. "PRESENT" → localized ongoing label */
export function dateShort(d: [string, string], lang: string): string {
  const s = parse(d[0])
  if (d[1] === 'PRESENT') {
    return lang === 'fr' ? `${s.y} - Aujourd'hui` : `${s.y} - Present`
  }
  const e = parse(d[1])
  return s.y === e.y ? String(s.y) : `${s.y}-${e.y}`
}

/** Localized full string — modal display */
export function dateLong(d: [string, string], lang: string): string {
  const months = lang === 'fr' ? FR_MONTHS : EN_MONTHS
  const s = parse(d[0])

  if (d[1] === 'PRESENT') {
    return lang === 'fr'
      ? `depuis ${months[s.m - 1]} ${s.y}, encore aujourd'hui`
      : `since ${months[s.m - 1]} ${s.y}, still ongoing`
  }

  const e = parse(d[1])
  if (s.m === e.m && s.y === e.y) return `${months[s.m - 1]} ${s.y}`

  return lang === 'fr'
    ? `de ${months[s.m - 1]} ${s.y} à ${months[e.m - 1]} ${e.y}`
    : `from ${months[s.m - 1]} ${s.y} to ${months[e.m - 1]} ${e.y}`
}

/**
 * Contract duration shown below the date range on the card.
 *
 * An experience is "ongoing" when it is `PRESENT` or its declared end month hasn't
 * passed yet relative to `today` - in that case the duration counts from the start
 * date up to `today` instead of the declared end, so it grows day by day (the caller
 * re-renders this off `useToday`, which itself ticks over at 00:01 local time).
 * A finished experience keeps counting to its fixed end date.
 *
 * Only the start date may carry day precision ("DD/MM/YYYY"); every other date in the
 * dataset is "MM/YYYY" and defaults to day 1. A same-month result (or less than a full
 * month elapsed) collapses to a "≤ 1 month" label.
 */
export function duration(d: [string, string], lang: string, today: Date = new Date()): string {
  const s = parse(d[0])
  const todayKey = today.getFullYear() * 100 + (today.getMonth() + 1)
  const ongoing = d[1] === 'PRESENT' || todayKey <= toKey(parse(d[1]))

  const e = ongoing
    ? { d: today.getDate(), m: today.getMonth() + 1, y: today.getFullYear() }
    : parse(d[1])

  let totalMonths = (e.y * 12 + e.m) - (s.y * 12 + s.m)
  if (e.d < s.d) totalMonths -= 1
  if (totalMonths <= 0) return lang === 'fr' ? '≤ 1 mois' : '≤ 1 month'

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  const yPart = years > 0 ? `${years} ${lang === 'fr' ? `an${years > 1 ? 's' : ''}` : `year${years > 1 ? 's' : ''}`}` : ''
  const mPart = months > 0 ? `${months} ${lang === 'fr' ? 'mois' : `month${months > 1 ? 's' : ''}`}` : ''
  return [yPart, mPart].filter(Boolean).join(' ')
}

/** Clé YYYYMM max — tri desc. PRESENT = 999999, toujours en tête */
export function yearMax(d: [string, string]): number {
  if (d[1] === 'PRESENT') return PRESENT_KEY
  return Math.max(toKey(parse(d[0])), toKey(parse(d[1])))
}

/** Clé YYYYMM min — tri asc */
export function yearMin(d: [string, string]): number {
  const startKey = toKey(parse(d[0]))
  if (d[1] === 'PRESENT') return startKey
  return Math.min(startKey, toKey(parse(d[1])))
}

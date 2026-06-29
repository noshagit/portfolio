const FR_MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]
const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// Clé de tri YYYYMM — sentinelle pour les postes en cours
const PRESENT_KEY = 999999

function parse(mmYYYY: string): { m: number; y: number } {
  const parts = (mmYYYY ?? '').split('/')
  const m = parseInt(parts[0], 10)
  const y = parseInt(parts[1], 10)
  return {
    m: isNaN(m) || m < 1 || m > 12 ? 1 : m,
    y: isNaN(y) ? 0 : y,
  }
}

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

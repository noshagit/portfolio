import type { Lang } from '../context/LanguageContext'
import type { View } from '../types'

export const SITE_URL = 'https://ilianbenhamou.fr'

const VIEW_SLUGS: Record<View, string> = {
  landing:      '',
  presentation: 'presentation',
  experiences:  'experiences',
  contact:      'contact',
  privacy:      'privacy',
  legal:        'legal',
}

const SLUG_VIEWS: Record<string, View> = Object.fromEntries(
  Object.entries(VIEW_SLUGS).map(([view, slug]) => [slug, view as View])
)

/** Builds the canonical path for a view/lang pair - EN is prefixed with /en, FR has no prefix. */
export function viewToPath(view: View, lang: Lang): string {
  const slug = VIEW_SLUGS[view]
  const prefix = lang === 'en' ? '/en' : ''
  return `${prefix}/${slug}`.replace(/\/$/, '') || '/'
}

/** Resolves a pathname (e.g. from window.location or a popstate event) back to its view/lang. */
export function parseLocation(pathname: string): { view: View; lang: Lang } {
  const segments = pathname.split('/').filter(Boolean)
  const lang: Lang = segments[0] === 'en' ? 'en' : 'fr'
  if (lang === 'en') segments.shift()
  const view = SLUG_VIEWS[segments[0] ?? ''] ?? 'landing'
  return { view, lang }
}

/** Absolute, canonical URL for a view/lang pair - used for canonical/OG/hreflang tags and the sitemap. */
export function absoluteViewUrl(view: View, lang: Lang): string {
  return `${SITE_URL}${viewToPath(view, lang)}`
}

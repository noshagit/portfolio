import { createContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import type FR from '../../public/locales/fr.json'

export type Lang = 'fr' | 'en'
export type Translations = typeof FR

export interface LanguageContextValue {
  lang:    Lang
  t:       Translations
  setLang: (l: Lang) => Promise<void>
  loading: boolean
}

// oxlint-disable-next-line react/only-export-components -- context objects must be co-located with their Provider
export const LanguageContext = createContext<LanguageContextValue | null>(null)

const cache = new Map<Lang, Translations>()

/**
 * The URL path is the sole source of truth for which language renders on a given URL
 * (`/en/*` = EN, everything else = FR) - required for hreflang correctness: a canonical
 * URL must always render the same content, never vary by visitor or cache. `?lang=` is
 * kept as a best-effort fallback for old links; src/App.tsx normalizes it to a path on mount.
 */
function resolveInitialLang(): Lang {
  if (window.location.pathname.startsWith('/en')) return 'en'

  const urlLang = new URLSearchParams(window.location.search).get('lang') as Lang | null
  if (urlLang === 'en' || urlLang === 'fr') return urlLang

  return 'fr'
}

async function fetchTranslations(lang: Lang, signal?: AbortSignal): Promise<Translations> {
  const res = await fetch(`/locales/${lang}.json`, { signal })
  if (!res.ok) throw new Error(`Failed to load locale: ${res.status}`)
  return res.json() as Promise<Translations>
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(resolveInitialLang)
  const [t,    setT]         = useState<Translations | null>(null)

  // Keep html[lang] in sync with active language - SEO + screen readers
  useEffect(() => { document.documentElement.lang = lang }, [lang])

  // Capture initial lang in a ref so the mount effect below doesn't need lang as a dep
  const initialLang = useRef(lang)

  // Initial fetch - neither language is bundled, both are fetched from public/locales/
  useEffect(() => {
    const ctrl = new AbortController()
    const timeout = setTimeout(() => ctrl.abort(), 4000) // 4s hard cap

    fetchTranslations(initialLang.current, ctrl.signal)
      .then(data => { cache.set(initialLang.current, data); setT(data) })
      .catch(() => { /* network error / timeout - AppShell stays gated behind the splash */ })
      .finally(() => clearTimeout(timeout))

    return () => { ctrl.abort(); clearTimeout(timeout) }
  }, []) // intentionally empty - runs once on mount

  const setLang = useCallback(async (next: Lang) => {
    if (next === lang) return
    const cached = cache.get(next)
    if (cached) {
      setLangState(next)
      setT(cached)
      return
    }
    try {
      const data = await fetchTranslations(next)
      cache.set(next, data)
      setLangState(next)
      setT(data)
    } catch {
      // Network error or bad response - stay on current language
    }
  }, [lang])

  return (
    <LanguageContext.Provider value={{
      lang,
      // Safe non-null cast: `t` is only ever null before the initial fetch resolves,
      // during which `loading` is true and AppShell (src/App.tsx) renders nothing -
      // so no consumer of `t` can mount while this cast would be inaccurate.
      t: t as Translations,
      setLang,
      loading: t === null,
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

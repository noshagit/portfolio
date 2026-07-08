import { createContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import type FR from '../../public/locales/fr.json'
import { CURTAIN_COVER_DURATION_MS } from '../lib/motion'

export type Lang = 'fr' | 'en'
export type Translations = typeof FR
export type LangTransitionDirection = 'toEn' | 'toFr'

export interface LanguageContextValue {
  lang:                 Lang
  t:                    Translations
  setLang:              (l: Lang) => Promise<void>
  loading:              boolean
  isTransitioning:      boolean
  transitionDirection:  LangTransitionDirection | null
}

const TRANSITION_DURATION_MS = 2000

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
  const [isTransitioning,     setIsTransitioning]     = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<LangTransitionDirection | null>(null)

  const mountedRef = useRef(true)
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const curtainCoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
      if (curtainCoverTimeoutRef.current) clearTimeout(curtainCoverTimeoutRef.current)
    }
  }, [])

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

  /**
   * Switches the active language through a two-phase transition timeline, kept in sync
   * with `LanguageTransitionOverlay` (`src/components/ui/LanguageTransitionOverlay.tsx`)
   * purely by sharing `CURTAIN_COVER_DURATION_MS` (`src/lib/motion.ts`) as the single
   * source of truth for how long the curtain takes to fully cover the viewport - this
   * function has no direct reference to the overlay component or its `curtainSettled`
   * state.
   *
   * Phase 1 (Cover & Defer): `isTransitioning` flips `true` immediately, which is what
   * mounts the curtain and starts its drop animation. The actual locale mutation
   * (`setLangState`/`setT`) is deliberately withheld behind a `curtainCoverTimeoutRef`
   * timer of `CURTAIN_COVER_DURATION_MS` - the same duration the curtain's own drop
   * transition uses - so the underlying page can never re-render with the new language's
   * text while the viewport is still even partially visible.
   *
   * Phase 2 (Mutate & Flight): once that timer fires, the cache is checked (or a fetch is
   * made) and the mutation is applied - by construction, this happens at essentially the
   * same moment the curtain visually finishes covering the screen, so the overlay's own
   * plane-flight sequence (gated on its curtain's `onAnimationComplete`) starts against an
   * already-mutated page underneath it.
   *
   * Both the deferred mutation and the overall `TRANSITION_DURATION_MS` floor are awaited
   * together, so `isTransitioning` cannot flip back to `false` (lifting the curtain) before
   * the new language has actually been applied, however long the underlying fetch takes.
   *
   * @param next - The language to switch to; a no-op if it matches the current language.
   */
  const setLang = useCallback(async (next: Lang) => {
    if (next === lang) return

    setTransitionDirection(next === 'en' ? 'toEn' : 'toFr')
    setIsTransitioning(true)

    const applyLangAfterCover = async () => {
      await new Promise<void>(resolve => {
        curtainCoverTimeoutRef.current = setTimeout(resolve, CURTAIN_COVER_DURATION_MS)
      })

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
    }

    const minDelay = new Promise<void>(resolve => {
      transitionTimeoutRef.current = setTimeout(resolve, TRANSITION_DURATION_MS)
    })

    await Promise.all([applyLangAfterCover(), minDelay])
    if (mountedRef.current) setIsTransitioning(false)
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
      isTransitioning,
      transitionDirection,
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

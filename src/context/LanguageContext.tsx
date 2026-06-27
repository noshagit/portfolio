import { createContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import FR from '../locales/fr.json'

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

const cache = new Map<Lang, Translations>([['fr', FR]])

function resolveInitialLang(): Lang {
  const saved = localStorage.getItem('portfolio-lang') as Lang | null
  if (saved === 'en' || saved === 'fr') return saved

  // First visit — detect from browser, persist the result
  const detected = (navigator.languages?.[0] ?? navigator.language ?? 'fr').toLowerCase()
  const lang: Lang = detected.startsWith('fr') ? 'fr' : 'en'
  localStorage.setItem('portfolio-lang', lang)
  return lang
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(resolveInitialLang)

  // If the resolved initial lang is EN, it isn't bundled — set loading=true until fetched
  const [t,       setT]       = useState<Translations>(() => cache.get(lang) ?? FR)
  const [loading, setLoading] = useState<boolean>(() => lang === 'en' && !cache.has('en'))
  // Capture initial lang in a ref so the mount effect below doesn't need lang as a dep
  const initialLang = useRef(lang)

  // Initial EN fetch — only fires when the browser default or saved pref is EN
  useEffect(() => {
    if (initialLang.current !== 'en' || cache.has('en')) return

    const ctrl = new AbortController()
    const timeout = setTimeout(() => ctrl.abort(), 4000) // 4s hard cap

    fetch('/locales/en.json', { signal: ctrl.signal })
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then((data: Translations) => {
        cache.set('en', data)
        setT(data)
      })
      .catch(() => { /* network error / timeout — fall back to FR text silently */ })
      .finally(() => { clearTimeout(timeout); setLoading(false) })

    return () => { ctrl.abort(); clearTimeout(timeout) }
  }, []) // intentionally empty — runs once on mount

  const setLang = useCallback(async (next: Lang) => {
    if (next === lang) return
    const cached = cache.get(next)
    if (cached) {
      setLangState(next)
      setT(cached)
      localStorage.setItem('portfolio-lang', next)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/locales/${next}.json`)
      if (!res.ok) throw new Error(`Failed to load locale: ${res.status}`)
      const data = await res.json() as Translations
      cache.set(next, data)
      setLangState(next)
      setT(data)
      localStorage.setItem('portfolio-lang', next)
    } catch {
      // Network error or bad response — stay on current language
    } finally {
      setLoading(false)
    }
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, t, setLang, loading }}>
      {children}
    </LanguageContext.Provider>
  )
}

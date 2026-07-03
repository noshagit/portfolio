import { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { useLang } from './hooks/useLang'
import { useDocumentMeta } from './hooks/useDocumentMeta'
import { viewToPath, parseLocation } from './lib/routes'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import SplashScreen from './components/ui/SplashScreen'
import SkipLink from './components/ui/SkipLink'
import Landing from './pages/Landing'
import type { View } from './types'

const Presentation = lazy(() => import('./pages/Presentation'))
const Experiences  = lazy(() => import('./pages/Experiences'))
const Contact      = lazy(() => import('./pages/Contact'))
const Privacy      = lazy(() => import('./pages/Privacy'))
const LegalNotice  = lazy(() => import('./pages/legal/LegalNotice'))

type PageProps = { onNavigate: (view: View) => void }

const PAGES: Record<View, React.ComponentType<PageProps>> = {
  landing:      Landing,
  presentation: Presentation,
  experiences:  Experiences,
  contact:      Contact,
  privacy:      Privacy,
  legal:        LegalNotice,
}

/**
 * Root layout shell: owns active-view state, keeps it in sync with the URL (path-based
 * routing, `/en` prefix for English), and wires navigation across header, main, and footer.
 * Renders nothing while translations are loading - neither FR nor EN is bundled, both are
 * fetched from public/locales/, so every `useLang()` consumer below needs `t` to be ready.
 */
function AppShell() {
  const { loading, lang, setLang } = useLang()
  const [currentView, setCurrentView] = useState<View>(() => parseLocation(window.location.pathname).view)
  const Page = PAGES[currentView]
  const mainRef = useRef<HTMLElement>(null)
  const isFirstRender = useRef(true)

  useDocumentMeta(currentView)

  const navigate = useCallback((view: View) => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setCurrentView(view)
    history.pushState(null, '', viewToPath(view, lang))
  }, [lang])

  // Keeps the URL aligned with [currentView, lang]: normalizes a legacy `?lang=` URL on
  // mount, and pushes the new prefix once LangToggle's setLang() actually resolves.
  // replaceState (not push) - this isn't a new navigation, `navigate()` already pushed one.
  useEffect(() => {
    const path = viewToPath(currentView, lang)
    if (window.location.pathname !== path) history.replaceState(null, '', path)
  }, [currentView, lang])

  // Browser back/forward
  useEffect(() => {
    function onPopState() {
      const next = parseLocation(window.location.pathname)
      setCurrentView(next.view)
      if (next.lang !== lang) void setLang(next.lang)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [lang, setLang])

  // Move focus to the page content on navigation (not on initial load) - a11y baseline
  // that was entirely absent before: SPA route changes must announce/land somewhere.
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    mainRef.current?.focus({ preventScroll: true })
  }, [currentView])

  if (loading) return null

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SkipLink />
      <Header currentView={currentView} onNavigate={navigate} />
      <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={null}>
          <AnimatePresence mode="wait">
            <Page key={currentView} onNavigate={navigate} />
          </AnimatePresence>
        </Suspense>
      </main>
      {currentView !== 'presentation' && <Footer onNavigate={navigate} />}
    </div>
  )
}

/**
 * Splash-screen gate that blocks the app shell until translations are loaded.
 * Triggers prefetches for all lazy page chunks during the splash animation so
 * every route chunk is ready before the user can interact.
 *
 * @param onDone - Fired once the splash animation completes and `loading` is false.
 */
function SplashGate({ onDone }: { onDone: () => void }) {
  const { loading } = useLang()

  useEffect(() => {
    import('./pages/Presentation')
    import('./pages/Experiences')
    import('./pages/Contact')
    import('./pages/Privacy')
    import('./pages/legal/LegalNotice')
  }, [])

  return <SplashScreen ready={!loading} onDone={onDone} />
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <LanguageProvider>
      <ThemeProvider>
        <AnimatePresence>
          {!splashDone && <SplashGate onDone={() => setSplashDone(true)} />}
        </AnimatePresence>
        <AppShell />
      </ThemeProvider>
    </LanguageProvider>
  )
}

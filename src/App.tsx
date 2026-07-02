import { useState, useCallback, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { useLang } from './hooks/useLang'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import SplashScreen from './components/ui/SplashScreen'
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

/** Root layout shell: owns active-view state and wires navigation across header, main, and footer. */
function AppShell() {
  const [currentView, setCurrentView] = useState<View>('landing')
  const Page = PAGES[currentView]

  const navigate = useCallback((view: View) => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setCurrentView(view)
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <Header currentView={currentView} onNavigate={navigate} />
      <main className="flex-1">
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

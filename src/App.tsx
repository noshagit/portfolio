import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { useLang } from './hooks/useLang'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import SplashScreen from './components/ui/SplashScreen'
import Landing from './pages/Landing'
import Presentation from './pages/Presentation'
import Experiences from './pages/Experiences'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import type { View } from './types'

const PAGES = {
  landing:      Landing,
  presentation: Presentation,
  experiences:  Experiences,
  contact:      Contact,
  privacy:      Privacy,
} as const

function AppShell() {
  const [currentView, setCurrentView] = useState<View>('landing')
  const Page = PAGES[currentView]

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Page key={currentView} onNavigate={setCurrentView} />
        </AnimatePresence>
      </main>
      <Footer onNavigate={setCurrentView} />
    </div>
  )
}

// Thin gate: reads loading state from LanguageContext and passes ready signal to SplashScreen
function SplashGate({ onDone }: { onDone: () => void }) {
  const { loading } = useLang()
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

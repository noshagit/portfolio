import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Landing from './pages/Landing'
import Presentation from './pages/Presentation'
import Experiences from './pages/Experiences'
import Contact from './pages/Contact'
import type { View } from './types'

const PAGES = {
  landing:      Landing,
  presentation: Presentation,
  experiences:  Experiences,
  contact:      Contact,
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

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}

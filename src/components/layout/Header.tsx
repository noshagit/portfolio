import { Fragment, useState } from 'react'
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import type { View, NavItem } from '../../types'
import ThemeToggle from '../ui/ThemeToggle'
import LangToggle from '../ui/LangToggle'
import { LinkedInIcon } from '../ui/BrandIcons'
import { useTheme } from '../../hooks/useTheme'
import { useLang } from '../../hooks/useLang'
import { EASE } from '../../lib/motion'

function useNavItems(t: ReturnType<typeof useLang>['t']): NavItem[] {
  return [
    { id: 'landing',      label: t.header.nav.home },
    { id: 'presentation', label: t.header.nav.about },
    { id: 'experiences',  label: t.header.nav.experiences },
    { id: 'contact',      label: t.header.nav.contact },
  ]
}

interface Props {
  currentView: View
  onNavigate:  (view: View) => void
}

export default function Header({ currentView, onNavigate }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme } = useTheme()
  const { t } = useLang()
  const NAV_ITEMS = useNavItems(t)

  function navigate(view: View) {
    onNavigate(view)
    setMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-accent/10 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-6 md:h-20">

          {/* Left — initials */}
          <div className="flex flex-1">
            <button
              onClick={() => navigate('landing')}
              aria-label="Accueil"
              className="transition-opacity duration-200 hover:opacity-50"
            >
              <img
                src={theme === 'dark' ? '/favicon-dark.png' : '/favicon.png'}
                alt="Ilian BEN HAMOU"
                className="h-11 w-11 rounded-full"
              />
            </button>
          </div>

          {/* Center — desktop nav with dot separators */}
          <LayoutGroup>
            <nav aria-label="Navigation principale" className="hidden items-center md:flex">
              {NAV_ITEMS.map((item, i) => {
                const isActive = currentView === item.id
                return (
                  <Fragment key={item.id}>
                    {i > 0 && (
                      <span aria-hidden="true" className="select-none px-3 text-foreground/20">
                        ·
                      </span>
                    )}
                    <button
                      onClick={() => navigate(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={[
                        'relative py-1 text-sm font-medium transition-colors duration-200',
                        isActive
                          ? 'text-foreground'
                          : 'text-foreground/60 hover:text-foreground',
                      ].join(' ')}
                    >
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  </Fragment>
                )
              })}
            </nav>
          </LayoutGroup>

          {/* Right — LinkedIn + theme toggle + hamburger */}
          <div className="flex flex-1 items-center justify-end gap-2.5">
            <a
              href="https://www.linkedin.com/in/ilian-ben-hamou-7b6053297/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/20
                         text-foreground/60 transition-all duration-200 hover:border-accent/60 hover:text-accent"
            >
              <LinkedInIcon size={15} />
            </a>
            <LangToggle />
            <ThemeToggle />

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/20
                         text-foreground/60 transition-all duration-200 hover:border-accent/60 hover:text-accent md:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen
                  ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 45, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X size={16} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open"
                      initial={{ rotate: 45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -45, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu size={16} />
                    </motion.span>
                  )
                }
              </AnimatePresence>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 flex flex-col bg-background/98 backdrop-blur-md md:hidden"
          >
            <nav aria-label="Navigation mobile" className="flex flex-1 flex-col items-center justify-center gap-8">
              {NAV_ITEMS.map((item, i) => {
                const isActive = currentView === item.id
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3, ease: EASE }}
                    onClick={() => navigate(item.id)}
                    className={[
                      'text-2xl font-bold uppercase tracking-widest transition-colors duration-200',
                      isActive ? 'text-accent' : 'text-foreground/60 hover:text-foreground',
                    ].join(' ')}
                  >
                    {item.label}
                  </motion.button>
                )
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.3 }}
              className="flex justify-center border-t border-accent/10 py-8"
            >
              <a
                href="https://www.linkedin.com/in/ilian-ben-hamou-7b6053297/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-foreground/60 transition-colors duration-200 hover:text-accent"
              >
                <LinkedInIcon size={20} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

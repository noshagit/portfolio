import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import { EASE } from '../../lib/motion'

interface Props {
  activeIdx: number
  onChange:  (idx: number) => void
}

/**
 * Fixed left-rail dot navigation for the Presentation page, visible below the 2xl breakpoint.
 * Collapses to dots only; expands to labeled dots when the user taps the chevron toggle.
 *
 * @param activeIdx - Index of the currently visible slide (0-based).
 * @param onChange  - Callback to jump directly to a specific slide index.
 */
export default function MobileNav({ activeIdx, onChange }: Props) {
  const { t } = useLang()
  const p = t.presentation
  const [expanded, setExpanded] = useState(false)

  const labels = [
    p.intro.label,
    p.techSkills.label,
    p.softSkills.label,
    p.education.label,
    p.recommendations.label,
    p.passions.label,
    p.transition.label,
  ]

  function handleSelect(i: number) {
    onChange(i)
    setExpanded(false)
  }

  return (
    <>
      {expanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setExpanded(false)}
          aria-hidden="true"
        />
      )}

      <nav
        aria-label="Sections"
        className={[
          'fixed left-0 top-1/2 z-50 -translate-y-1/2 2xl:hidden',
          'transition-all duration-300',
          expanded
            ? 'rounded-r-xl bg-background/95 shadow-xl backdrop-blur-sm'
            : '',
        ].join(' ')}
      >
        <div className={['flex flex-col py-2', expanded ? 'pl-3 pr-5' : 'pl-2 pr-1'].join(' ')}>

          {labels.map((label, i) => {
            const isActive = activeIdx === i
            return (
              <div key={label} className="flex flex-col">
                {i > 0 && (
                  <div className={[
                    'ml-[13px] w-px self-start transition-colors duration-200',
                    expanded ? 'h-3' : 'h-4',
                    isActive ? 'bg-accent/30' : 'bg-foreground/10',
                  ].join(' ')} />
                )}
                <button
                  onClick={() => handleSelect(i)}
                  aria-label={label}
                  aria-current={isActive ? 'step' : undefined}
                  className="flex min-h-[44px] min-w-[44px] items-center gap-2.5 py-0.5 text-left"
                >
                  <span className={[
                    'shrink-0 rounded-full transition-all duration-200',
                    isActive ? 'h-2 w-2 bg-accent' : 'h-1.5 w-1.5 border border-foreground/25',
                  ].join(' ')} />
                  <AnimatePresence>
                    {expanded && (
                      <motion.span
                        key={label}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.15, ease: EASE, delay: i * 0.025 }}
                        className={[
                          'whitespace-nowrap text-[10px] uppercase tracking-widest',
                          isActive ? 'text-accent' : 'text-foreground/50',
                        ].join(' ')}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            )
          })}

          <button
            onClick={() => setExpanded(e => !e)}
            aria-label={expanded ? 'Fermer la navigation' : 'Ouvrir la navigation'}
            aria-expanded={expanded}
            className="mt-1 flex min-h-[44px] min-w-[44px] items-center justify-start pl-[5px]"
          >
            <ChevronRight
              size={11}
              aria-hidden="true"
              className={[
                'text-foreground/30 transition-transform duration-300 ease-in-out',
                expanded ? 'rotate-180' : 'rotate-0',
              ].join(' ')}
            />
          </button>

        </div>
      </nav>
    </>
  )
}

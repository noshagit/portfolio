import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { View } from '../types'
import type { Experience, SortDir } from '../types/experience'
import RAW from '../data/experiences.json'
import ExperienceCard from './experiences/ExperienceCard'
import ExperienceModal from './experiences/ExperienceModal'
import ExperienceFilters from './experiences/ExperienceFilters'

// ─── Data ─────────────────────────────────────────────────────────────────────

const EXPERIENCES  = RAW as Experience[]
const ALL_TYPES    = Array.from(new Set(EXPERIENCES.map(e => e.type)))
const ALL_DOMAINES = Array.from(new Set(EXPERIENCES.flatMap(e => e.domaine)))
const EASE         = [0.22, 1, 0.36, 1] as const

function yearMax(date: string) { return Math.max(...date.split('-').map(Number)) }
function yearMin(date: string) { return Math.min(...date.split('-').map(Number)) }

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  onNavigate: (view: View) => void
}

export default function Experiences({ onNavigate: _onNavigate }: Props) {
  const [activeType,    setActiveType]    = useState<string | null>(null)
  const [activeDomaine, setActiveDomaine] = useState<string | null>(null)
  const [selected,      setSelected]      = useState<Experience | null>(null)
  const [sort,          setSort]          = useState<SortDir>('desc')

  const filtered = useMemo(() => {
    return EXPERIENCES
      .filter(exp =>
        (activeType    === null || exp.type === activeType) &&
        (activeDomaine === null || exp.domaine.includes(activeDomaine))
      )
      .sort((a, b) =>
        sort === 'desc'
          ? yearMax(b.date) - yearMax(a.date) || yearMin(b.date) - yearMin(a.date)
          : yearMin(a.date) - yearMin(b.date) || yearMax(a.date) - yearMax(b.date)
      )
  }, [activeType, activeDomaine, sort])

  const availableTypes = useMemo(() => {
    if (activeDomaine === null) return new Set(ALL_TYPES)
    return new Set(EXPERIENCES.filter(e => e.domaine.includes(activeDomaine)).map(e => e.type))
  }, [activeDomaine])

  const availableDomaines = useMemo(() => {
    if (activeType === null) return new Set(ALL_DOMAINES)
    return new Set(EXPERIENCES.filter(e => e.type === activeType).flatMap(e => e.domaine))
  }, [activeType])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 sm:py-16">

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="space-y-5">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            // expériences & participations
          </p>

          <ExperienceFilters
            allTypes={ALL_TYPES}
            allDomaines={ALL_DOMAINES}
            availableTypes={availableTypes}
            availableDomaines={availableDomaines}
            activeType={activeType}
            activeDomaine={activeDomaine}
            sort={sort}
            onTypeChange={setActiveType}
            onDomaineChange={setActiveDomaine}
            onSortChange={setSort}
          />
        </div>

        {/* ── Grid ──────────────────────────────────────────────────── */}
        <div aria-live="polite" aria-atomic="false" className="sr-only">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
        </div>
        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map(exp => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                onOpen={() => setSelected(exp)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center font-mono text-xs text-foreground/60"
            >
              Aucune expérience ne correspond aux filtres sélectionnés.
            </motion.p>
          )}
        </AnimatePresence>

      </div>

      {/* ── Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <ExperienceModal
            exp={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

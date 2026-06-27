import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { View } from '../types'
import type { Experience, SortDir } from '../types/experience'
import type { Lang } from '../context/LanguageContext'
import RAW from '../data/experiences.json'
import ExperienceCard from './experiences/ExperienceCard'
import ExperienceModal from './experiences/ExperienceModal'
import ExperienceFilters from './experiences/ExperienceFilters'
import { useLang } from '../hooks/useLang'
import { EASE } from '../lib/motion'

const FR_BASE = RAW as Experience[]
const ALL_TYPES_BASE    = Array.from(new Set(FR_BASE.map(e => e.type)))
const ALL_DOMAINES_BASE = Array.from(new Set(FR_BASE.flatMap(e => e.domaine)))

// Module-level cache — survives page navigation
const expCache = new Map<Lang, Experience[]>([['fr', FR_BASE]])

function yearMax(date: string) { return Math.max(...date.split('-').map(Number)) }
function yearMin(date: string) { return Math.min(...date.split('-').map(Number)) }

interface Props {
  onNavigate: (view: View) => void
}

export default function Experiences({ onNavigate: _onNavigate }: Props) {
  const { lang, t } = useLang()
  const [activeType,    setActiveType]    = useState<string | null>(null)
  const [activeDomaine, setActiveDomaine] = useState<string | null>(null)
  const [selectedId,    setSelectedId]    = useState<string | null>(null)
  const [sort,          setSort]          = useState<SortDir>('desc')
  const [experiences,   setExperiences]   = useState<Experience[]>(expCache.get(lang) ?? FR_BASE)
  const abortRef = useRef<AbortController | null>(null)

  // Fetch EN experiences lazily; FR is always from the bundled JSON
  useEffect(() => {
    const cached = expCache.get(lang)
    if (cached) { setExperiences(cached); return }

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    fetch(`/locales/${lang}/experiences.json`, { signal: abortRef.current.signal })
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then((data: Experience[]) => { expCache.set(lang, data); setExperiences(data) })
      .catch(() => {/* aborted or HTTP error — keep current */})
  }, [lang])

  const filtered = useMemo(() => experiences
    .filter(exp =>
      (activeType    === null || exp.type === activeType) &&
      (activeDomaine === null || exp.domaine.includes(activeDomaine))
    )
    .sort((a, b) =>
      sort === 'desc'
        ? yearMax(b.date) - yearMax(a.date) || yearMin(b.date) - yearMin(a.date)
        : yearMin(a.date) - yearMin(b.date) || yearMax(a.date) - yearMax(b.date)
    ), [experiences, activeType, activeDomaine, sort])

  const availableTypes = useMemo(() => {
    if (activeDomaine === null) return new Set(ALL_TYPES_BASE)
    return new Set(FR_BASE.filter(e => e.domaine.includes(activeDomaine)).map(e => e.type))
  }, [activeDomaine])

  const availableDomaines = useMemo(() => {
    if (activeType === null) return new Set(ALL_DOMAINES_BASE)
    return new Set(FR_BASE.filter(e => e.type === activeType).flatMap(e => e.domaine))
  }, [activeType])

  const selected = useMemo(
    () => selectedId ? (experiences.find(e => e.id === selectedId) ?? null) : null,
    [selectedId, experiences],
  )

  const clearSelection = useCallback(() => setSelectedId(null), [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 sm:py-16">

        <div className="space-y-5">
          <h1 className="font-mono text-xs uppercase tracking-widest text-accent">
            {t.experiences.sectionLabel}
          </h1>
          <ExperienceFilters
            allTypes={ALL_TYPES_BASE}
            allDomaines={ALL_DOMAINES_BASE}
            availableTypes={availableTypes}
            availableDomaines={availableDomaines}
            activeType={activeType}
            activeDomaine={activeDomaine}
            sort={sort}
            onTypeChange={setActiveType}    // stable: useState setter
            onDomaineChange={setActiveDomaine}
            onSortChange={setSort}
          />
        </div>

        <div aria-live="polite" aria-atomic="false" className="sr-only">
          {filtered.length} {t.experiences.sectionLabel}
        </div>
        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map(exp => (
              <ExperienceCard key={exp.id} exp={exp} onOpen={setSelectedId} />
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center font-mono text-xs text-foreground/60"
            >
              {t.experiences.empty}
            </motion.p>
          )}
        </AnimatePresence>

      </div>

      <AnimatePresence>
        {selected && (
          <ExperienceModal exp={selected} onClose={clearSelection} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

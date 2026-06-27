import { useState, useMemo, useEffect } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronRight } from 'lucide-react'
import type { View } from '../types'
import RAW from '../data/experiences.json'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Experience {
  id:                  string
  nom:                 string
  date:                string
  type:                string
  domaine:             string[]
  employeur_collab:    string
  description:         string
  metiers_lies:        string[]
  competences_obtenir: string[]
  soft_skills_utilises: string[]
}

const EXPERIENCES   = RAW as Experience[]
const ALL_TYPES     = Array.from(new Set(EXPERIENCES.map(e => e.type)))
const ALL_DOMAINES  = Array.from(new Set(EXPERIENCES.flatMap(e => e.domaine)))
const EASE        = [0.22, 1, 0.36, 1] as const

type SortDir = 'desc' | 'asc'

function yearMax(date: string) { return Math.max(...date.split('-').map(Number)) }
function yearMin(date: string) { return Math.min(...date.split('-').map(Number)) }

// ─── Micro-components ─────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">
      {children}
    </p>
  )
}

function Tag({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={[
        'border px-2.5 py-1 font-mono text-xs',
        accent
          ? 'border-accent/35 text-accent'
          : 'border-accent/15 text-foreground/50',
      ].join(' ')}
    >
      {children}
    </span>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function ExperienceCard({ exp, onOpen }: { exp: Experience; onOpen: () => void }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.28, ease: EASE }}
      onClick={onOpen}
      className="group flex flex-col gap-4 border border-accent/15 p-5 transition-colors duration-200 hover:border-accent/40 hover:bg-accent-muted"
    >
      {/* Type badge */}
      <span className="self-start border border-accent/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground/45">
        {exp.type}
      </span>

      {/* Name + employer */}
      <div className="flex-1">
        <h3 className="mb-1 text-sm font-bold leading-snug text-foreground">
          {exp.nom}
        </h3>
        <p className="font-mono text-xs text-foreground/50">{exp.employeur_collab}</p>
      </div>

      {/* Date + arrow */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-foreground/30">{exp.date}</span>
        <ChevronRight
          size={14}
          className="text-foreground/25 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </div>
    </motion.article>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function ExperienceModal({ exp, onClose }: { exp: Experience; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', fn)
    }
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-foreground/15 backdrop-blur-sm"
      />

      {/* Centering shell — pointer-events-none so clicks fall through to backdrop */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.97 }}
          transition={{ duration: 0.32, ease: EASE }}
          onClick={e => e.stopPropagation()}
          className="pointer-events-auto relative w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-accent/20 bg-background p-5 shadow-2xl sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={exp.nom}
        >
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center text-foreground/35 transition-colors duration-150 hover:text-foreground"
          >
            <X size={15} />
          </button>

          {/* Header */}
          <div className="mb-8 pr-10">
            <span className="mb-3 inline-block border border-accent/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground/45">
              {exp.type}
            </span>
            <h2 className="mb-1 text-2xl font-black text-foreground">{exp.nom}</h2>
            <p className="font-mono text-sm text-accent">{exp.employeur_collab}</p>
            <p className="mt-1 font-mono text-xs text-foreground/35">{exp.date}</p>
          </div>

          {/* Description */}
          <section className="mb-8">
            <SectionLabel>// description</SectionLabel>
            <p className="text-sm leading-relaxed text-foreground/60">{exp.description}</p>
          </section>

          {/* Métiers liés */}
          <section className="mb-6">
            <SectionLabel>// métiers liés</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {exp.metiers_lies.map(m => <Tag key={m}>{m}</Tag>)}
            </div>
          </section>

          {/* Compétences */}
          <section className="mb-6">
            <SectionLabel>// compétences obtenues</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {exp.competences_obtenir.map(c => <Tag key={c} accent>{c}</Tag>)}
            </div>
          </section>

          {/* Soft skills */}
          <section>
            <SectionLabel>// soft skills utilisés</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {exp.soft_skills_utilises.map(s => <Tag key={s}>{s}</Tag>)}
            </div>
          </section>
        </motion.div>
      </div>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  onNavigate: (view: View) => void
}

export default function Experiences({ onNavigate: _onNavigate }: Props) {
  const [search,        setSearch]        = useState('')
  const [activeType,    setActiveType]    = useState<string | null>(null)
  const [activeDomaine, setActiveDomaine] = useState<string | null>(null)
  const [selected,      setSelected]      = useState<Experience | null>(null)
  const [sort,          setSort]          = useState<SortDir>('desc')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return EXPERIENCES
      .filter(exp =>
        (activeType    === null || exp.type    === activeType)    &&
        (activeDomaine === null || exp.domaine.includes(activeDomaine)) &&
        exp.nom.toLowerCase().includes(q)
      )
      .sort((a, b) =>
        sort === 'desc'
          ? yearMax(b.date) - yearMax(a.date) || yearMin(b.date) - yearMin(a.date)
          : yearMin(a.date) - yearMin(b.date) || yearMax(a.date) - yearMax(b.date)
      )
  }, [search, activeType, activeDomaine, sort])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 sm:py-16">

        {/* ── Controls ──────────────────────────────────────────────── */}
        <div className="space-y-5">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            // expériences & participations
          </p>

          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30"
            />
            <input
              type="search"
              placeholder="Rechercher une expérience…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-accent/20 bg-transparent py-2.5 pl-10 pr-4 font-mono text-sm text-foreground placeholder:text-foreground/25 outline-none transition-colors duration-200 focus:border-accent/50"
            />
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-2">
            {(['Tous', ...ALL_TYPES] as const).map(label => {
              const value = label === 'Tous' ? null : label
              const isActive = activeType === value
              return (
                <button
                  key={label}
                  onClick={() => setActiveType(isActive && value !== null ? null : value)}
                  className={[
                    'border px-3 py-1 font-mono text-xs transition-all duration-200',
                    isActive
                      ? 'border-accent bg-accent text-background'
                      : 'border-accent/20 text-foreground/50 hover:border-accent/40 hover:text-foreground',
                  ].join(' ')}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Domain filters */}
          <div className="flex flex-wrap gap-2">
            {(['Tous', ...ALL_DOMAINES] as const).map(label => {
              const value = label === 'Tous' ? null : label
              const isActive = activeDomaine === value
              return (
                <button
                  key={label}
                  onClick={() => setActiveDomaine(isActive && value !== null ? null : value)}
                  className={[
                    'border px-3 py-1 font-mono text-xs transition-all duration-200',
                    isActive
                      ? 'border-accent bg-accent text-background'
                      : 'border-accent/20 text-foreground/50 hover:border-accent/40 hover:text-foreground',
                  ].join(' ')}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/30">
              Trier par
            </span>
            {([
              { dir: 'desc' as SortDir, label: 'Récent → Ancien' },
              { dir: 'asc'  as SortDir, label: 'Ancien → Récent' },
            ]).map(({ dir, label }) => (
              <button
                key={dir}
                onClick={() => setSort(dir)}
                className={[
                  'border px-3 py-1 font-mono text-xs transition-all duration-200',
                  sort === dir
                    ? 'border-accent bg-accent text-background'
                    : 'border-accent/20 text-foreground/50 hover:border-accent/40 hover:text-foreground',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ──────────────────────────────────────────────────── */}
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
              className="py-20 text-center font-mono text-xs text-foreground/30"
            >
              Aucune expérience ne correspond à votre recherche.
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

import { useState, useMemo, useEffect } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ExternalLink } from 'lucide-react'
import type { View } from '../types'
import RAW from '../data/experiences.json'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExpLink {
  label: string
  url:   string
}

interface Experience {
  id:                   string
  nom:                  string
  date:                 string
  type:                 string
  domaine:              string[]
  employeur_collab:     string
  description:          string
  metiers_lies:         string[]
  competences_obtenir:  string[]
  soft_skills_utilises: string[]
  links?:               ExpLink[]
}

const EXPERIENCES  = RAW as Experience[]
const ALL_TYPES    = Array.from(new Set(EXPERIENCES.map(e => e.type)))
const ALL_DOMAINES = Array.from(new Set(EXPERIENCES.flatMap(e => e.domaine)))

// ── Image map (Vite resolves at build time) ───────────────────────────────────
// Drop files into src/assets/experiences/{experience-id}/ to activate the gallery.
const RAW_IMAGES = import.meta.glob<{ default: string }>(
  '../assets/experiences/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
)
const EXPERIENCE_IMAGES: Record<string, string[]> = {}
for (const [path, mod] of Object.entries(RAW_IMAGES)) {
  const id = path.split('/').at(-2) ?? ''
  if (id) (EXPERIENCE_IMAGES[id] ??= []).push(mod.default)
}
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
          : 'border-accent/15 text-foreground/60',
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
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } }}
      role="button"
      tabIndex={0}
      aria-label={`Voir le détail : ${exp.nom}`}
      className="group flex flex-col gap-4 border border-accent/15 p-5 transition-colors duration-200 hover:border-accent/40 hover:bg-accent-muted"
    >
      {/* Type badge */}
      <span className="self-start border border-accent/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground/60">
        {exp.type}
      </span>

      {/* Name + employer */}
      <div className="flex-1">
        <h3 className="mb-1 text-sm font-bold leading-snug text-foreground">
          {exp.nom}
        </h3>
        <p className="font-mono text-xs text-foreground/60">{exp.employeur_collab}</p>
      </div>

      {/* Date + arrow */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-foreground/60">{exp.date}</span>
        <ChevronRight
          size={14}
          className="text-foreground/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
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
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center text-foreground/60 transition-colors duration-150 hover:text-foreground"
          >
            <X size={15} />
          </button>

          {/* Header */}
          <div className="mb-8 pr-10">
            <span className="mb-3 inline-block border border-accent/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground/60">
              {exp.type}
            </span>
            <h2 className="mb-1 text-2xl font-black text-foreground">{exp.nom}</h2>
            <p className="font-mono text-sm text-accent">{exp.employeur_collab}</p>
            <p className="mt-1 font-mono text-xs text-foreground/60">{exp.date}</p>
          </div>

          {/* Description */}
          <section className="mb-8">
            <SectionLabel>// description</SectionLabel>
            <p className="text-sm leading-relaxed text-foreground/60">{exp.description}</p>
          </section>

          {/* Images — rendered only when files exist in src/assets/experiences/{id}/ */}
          {(EXPERIENCE_IMAGES[exp.id]?.length ?? 0) > 0 && (
            <section className="mb-8">
              <SectionLabel>// images</SectionLabel>
              <div
                className={[
                  'grid gap-2',
                  EXPERIENCE_IMAGES[exp.id].length === 1
                    ? 'grid-cols-1'
                    : 'grid-cols-2',
                ].join(' ')}
              >
                {EXPERIENCE_IMAGES[exp.id].map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${exp.nom} — photo ${i + 1}`}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            </section>
          )}

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
          <section className={exp.links?.length ? 'mb-8' : ''}>
            <SectionLabel>// soft skills utilisés</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {exp.soft_skills_utilises.map(s => <Tag key={s}>{s}</Tag>)}
            </div>
          </section>

          {/* Links — rendered only when the experience has entries in links[] */}
          {exp.links && exp.links.length > 0 && (
            <section className="border-t border-accent/10 pt-6">
              <SectionLabel>// liens</SectionLabel>
              <div className="flex flex-col gap-2">
                {exp.links.map(link => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-xs
                               text-foreground/60 transition-colors duration-150
                               hover:text-accent"
                  >
                    <ExternalLink size={11} aria-hidden="true" />
                    {link.label}
                  </a>
                ))}
              </div>
            </section>
          )}
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
  const [activeType,    setActiveType]    = useState<string | null>(null)
  const [activeDomaine, setActiveDomaine] = useState<string | null>(null)
  const [selected,      setSelected]      = useState<Experience | null>(null)
  const [sort,          setSort]          = useState<SortDir>('desc')

  const filtered = useMemo(() => {
    return EXPERIENCES
      .filter(exp =>
        (activeType    === null || exp.type    === activeType) &&
        (activeDomaine === null || exp.domaine.includes(activeDomaine))
      )
      .sort((a, b) =>
        sort === 'desc'
          ? yearMax(b.date) - yearMax(a.date) || yearMin(b.date) - yearMin(a.date)
          : yearMin(a.date) - yearMin(b.date) || yearMax(a.date) - yearMax(b.date)
      )
  }, [activeType, activeDomaine, sort])

  // Which types are reachable given the active domain (domain filter only, no type filter)
  const availableTypes = useMemo(() => {
    if (activeDomaine === null) return new Set(ALL_TYPES)
    return new Set(
      EXPERIENCES
        .filter(e => e.domaine.includes(activeDomaine))
        .map(e => e.type)
    )
  }, [activeDomaine])

  // Which domains are reachable given the active type (type filter only, no domain filter)
  const availableDomaines = useMemo(() => {
    if (activeType === null) return new Set(ALL_DOMAINES)
    return new Set(
      EXPERIENCES
        .filter(e => e.type === activeType)
        .flatMap(e => e.domaine)
    )
  }, [activeType])

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

          {/* Type filters */}
          <motion.div layout role="group" aria-label="Filtrer par type" className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {(['Tous', ...ALL_TYPES] as const)
                .filter(label => label === 'Tous' || availableTypes.has(label))
                .map(label => {
                  const value = label === 'Tous' ? null : label
                  const isActive = activeType === value
                  return (
                    <motion.button
                      key={label}
                      layout
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.88 }}
                      transition={{ duration: 0.16, ease: EASE }}
                      onClick={() => setActiveType(isActive && value !== null ? null : value)}
                      aria-pressed={isActive}
                      className={[
                        'border px-3 py-1 font-mono text-xs transition-colors duration-200',
                        isActive
                          ? 'border-accent bg-accent text-background'
                          : 'border-accent/20 text-foreground/60 hover:border-accent/60 hover:text-foreground',
                      ].join(' ')}
                    >
                      {label}
                    </motion.button>
                  )
                })
              }
            </AnimatePresence>
          </motion.div>

          {/* Domain filters */}
          <motion.div layout role="group" aria-label="Filtrer par domaine" className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {(['Tous', ...ALL_DOMAINES] as const)
                .filter(label => label === 'Tous' || availableDomaines.has(label))
                .map(label => {
                  const value = label === 'Tous' ? null : label
                  const isActive = activeDomaine === value
                  return (
                    <motion.button
                      key={label}
                      layout
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.88 }}
                      transition={{ duration: 0.16, ease: EASE }}
                      onClick={() => setActiveDomaine(isActive && value !== null ? null : value)}
                      aria-pressed={isActive}
                      className={[
                        'border px-3 py-1 font-mono text-xs transition-colors duration-200',
                        isActive
                          ? 'border-accent bg-accent text-background'
                          : 'border-accent/20 text-foreground/60 hover:border-accent/60 hover:text-foreground',
                      ].join(' ')}
                    >
                      {label}
                    </motion.button>
                  )
                })
              }
            </AnimatePresence>
          </motion.div>

          {/* Sort */}
          <div role="group" aria-label="Trier les expériences" className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">
              Trier par
            </span>
            {([
              { dir: 'desc' as SortDir, label: 'Récent → Ancien' },
              { dir: 'asc'  as SortDir, label: 'Ancien → Récent' },
            ]).map(({ dir, label }) => (
              <button
                key={dir}
                onClick={() => setSort(dir)}
                aria-pressed={sort === dir}
                className={[
                  'border px-3 py-1 font-mono text-xs transition-all duration-200',
                  sort === dir
                    ? 'border-accent bg-accent text-background'
                    : 'border-accent/20 text-foreground/60 hover:border-accent/60 hover:text-foreground',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
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

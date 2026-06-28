import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import type { Experience } from '../../types/experience'
import SectionLabel from '../../components/ui/SectionLabel'
import Tag from '../../components/ui/Tag'
import EXPERIENCE_IMAGES from './imageMap'
import { useLang } from '../../hooks/useLang'
import { EASE } from '../../lib/motion'

interface Props {
  exp:     Experience
  onClose: () => void
}

export default function ExperienceModal({ exp, onClose }: Props) {
  const { t } = useLang()
  const { modal, types } = t.experiences
  const images    = EXPERIENCE_IMAGES[exp.id] ?? []
  const typeLabel = types[exp.type as keyof typeof types] ?? exp.type

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
        className="fixed inset-0 z-[60] bg-foreground/15 backdrop-blur-sm"
      />

      {/* Shell — pointer-events-none so clicks outside fall through to backdrop */}
      <div className="pointer-events-none fixed inset-0 z-[70] flex items-start justify-center p-4 pt-20 sm:items-center sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.97 }}
          transition={{ duration: 0.32, ease: EASE }}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={exp.nom}
          className="pointer-events-auto relative flex w-full max-w-2xl flex-col
                     max-h-[calc(100dvh-6rem)] sm:max-h-[80vh]
                     border border-accent/20 bg-background shadow-2xl"
        >

          {/* ── Fixed header ───────────────────────────────────────── */}
          <div className="shrink-0 border-b border-accent/10 px-5 py-4 sm:px-6">
            <button
              onClick={onClose}
              aria-label={modal.close}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center
                         text-foreground/60 transition-colors duration-150 hover:text-foreground
                         sm:right-4 sm:top-4 sm:h-8 sm:w-8"
            >
              <X size={15} />
            </button>

            <span className="mb-2 inline-block border border-accent/20 px-2 py-0.5
                             text-[10px] uppercase tracking-widest text-foreground/60">
              {typeLabel}
            </span>
            <h2 className="pr-8 text-xl font-black leading-snug text-foreground sm:text-2xl">
              {exp.nom}
            </h2>
            <p className="mt-1 text-sm text-accent">{exp.employeur_collab}</p>
            <p className="text-xs text-foreground/60">{exp.date}</p>
          </div>

          {/* ── Scrollable body ────────────────────────────────────── */}
          <div
            className="flex-1 overflow-y-auto px-5 py-4 sm:px-6
                       [scrollbar-width:thin]
                       [scrollbar-color:color-mix(in_srgb,var(--accent)_25%,transparent)_transparent]
                       [&::-webkit-scrollbar]:w-[3px]
                       [&::-webkit-scrollbar-track]:bg-transparent
                       [&::-webkit-scrollbar-thumb]:rounded-full
                       [&::-webkit-scrollbar-thumb]:bg-accent/25"
          >

            {/* Description */}
            <section className="mb-5">
              <SectionLabel as="p" className="mb-2 text-[10px]">{modal.description}</SectionLabel>
              <p className="text-sm leading-relaxed text-foreground/60">{exp.description}</p>
            </section>

            {/* Images (optional) */}
            {images.length > 0 && (
              <section className="mb-5">
                <SectionLabel as="p" className="mb-2 text-[10px]">{modal.images}</SectionLabel>
                <div className={['grid gap-2', images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'].join(' ')}>
                  {images.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`${exp.nom} — ${modal.photo} ${i + 1}`}
                      className="aspect-video w-full object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Tag grid — 3 columns side by side on sm+, stacked on mobile */}
            <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <section>
                <SectionLabel as="p" className="mb-2 text-[10px]">{modal.relatedJobs}</SectionLabel>
                <div className="flex flex-wrap gap-1.5">
                  {exp.metiers_lies.map(m => <Tag key={m}>{m}</Tag>)}
                </div>
              </section>

              <section>
                <SectionLabel as="p" className="mb-2 text-[10px]">{modal.skills}</SectionLabel>
                <div className="flex flex-wrap gap-1.5">
                  {exp.competences_obtenir.map(c => <Tag key={c} accent>{c}</Tag>)}
                </div>
              </section>

              <section>
                <SectionLabel as="p" className="mb-2 text-[10px]">{modal.softSkills}</SectionLabel>
                <div className="flex flex-wrap gap-1.5">
                  {exp.soft_skills_utilises.map(s => <Tag key={s}>{s}</Tag>)}
                </div>
              </section>
            </div>

            {/* Links */}
            {exp.links && exp.links.length > 0 && (
              <section className="border-t border-accent/10 pt-4">
                <SectionLabel as="p" className="mb-2 text-[10px]">{modal.links}</SectionLabel>
                <div className="flex flex-col gap-1.5">
                  {exp.links.map(link => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs
                                 text-foreground/60 transition-colors duration-150 hover:text-accent"
                    >
                      <ExternalLink size={11} aria-hidden="true" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </section>
            )}

          </div>
        </motion.div>
      </div>
    </>
  )
}

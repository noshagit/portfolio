import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import type { Experience } from '../../types/experience'
import SectionLabel from '../../components/ui/SectionLabel'
import Tag from '../../components/ui/Tag'
import EXPERIENCE_IMAGES from './imageMap'
import { useLang } from '../../hooks/useLang'
import { EASE } from '../../lib/motion'
import { dateLong } from '../../lib/formatDate'

interface Props {
  exp:     Experience
  onClose: () => void
}

/**
 * Full-screen modal displaying the detailed view of a single experience record.
 *
 * Locks body scroll and registers an Escape-key listener for its entire mount lifetime.
 * Renders as two framer-motion layers: a click-to-close backdrop and a scrollable content panel.
 *
 * @param exp     - The experience record to render.
 * @param onClose - Callback invoked on backdrop click, Escape key, or close-button press.
 * @returns Animated backdrop + modal panel with body-scroll locked during the mount.
 */
export default function ExperienceModal({ exp, onClose }: Props) {
  const { t, lang } = useLang()
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-foreground/15 backdrop-blur-sm"
      />

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
          className="pointer-events-auto relative flex w-full max-w-3xl flex-col
                     max-h-[calc(100dvh-6rem)] sm:max-h-[80vh]
                     border border-accent/20 bg-background shadow-2xl"
        >

          <div className="shrink-0 border-b border-accent/10 px-5 py-5 sm:px-8 sm:py-6">
            <button
              onClick={onClose}
              aria-label={modal.close}
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center
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
            <p className="mt-1.5 text-sm text-accent">{exp.employeur_collab}</p>
            <p className="mt-1 text-xs text-foreground/60">{dateLong(exp.detailed_date, lang)}</p>
          </div>

          <div
            className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8
                       [scrollbar-width:thin]
                       [scrollbar-color:color-mix(in_srgb,var(--accent)_25%,transparent)_transparent]
                       [&::-webkit-scrollbar]:w-[3px]
                       [&::-webkit-scrollbar-track]:bg-transparent
                       [&::-webkit-scrollbar-thumb]:rounded-full
                       [&::-webkit-scrollbar-thumb]:bg-accent/25"
          >
            <div className="space-y-7">

              <section>
                <SectionLabel as="p" className="mb-3 text-[10px]">{modal.description}</SectionLabel>
                {Array.isArray(exp.description) ? (
                  <div className="space-y-5">
                    {exp.description.map(s => (
                      <div key={s.titre}>
                        <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-widest text-foreground/35">{s.titre}</p>
                        <p className="text-justify hyphens-auto break-words text-sm leading-relaxed text-foreground/60">{s.texte}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-justify hyphens-auto break-words text-sm leading-relaxed text-foreground/60">
                    {exp.description}
                  </p>
                )}
              </section>

              {images.length > 0 && (
                <section>
                  <SectionLabel as="p" className="mb-3 text-[10px]">{modal.images}</SectionLabel>
                  <div className={['grid gap-2', images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'].join(' ')}>
                    {images.map((src, i) => (
                      <img
                        key={src}
                        src={src}
                        alt={`${exp.nom} - ${modal.photo} ${i + 1}`}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                      />
                    ))}
                  </div>
                </section>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <section>
                  <SectionLabel as="p" className="mb-3 text-[10px]">{modal.relatedJobs}</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {exp.metiers_lies.map(m => <Tag key={m}>{m}</Tag>)}
                  </div>
                </section>

                <section>
                  <SectionLabel as="p" className="mb-3 text-[10px]">{modal.skills}</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {exp.competences_obtenir.map(c => <Tag key={c} accent>{c}</Tag>)}
                  </div>
                </section>

                <section>
                  <SectionLabel as="p" className="mb-3 text-[10px]">{modal.softSkills}</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {exp.soft_skills_utilises.map(s => <Tag key={s}>{s}</Tag>)}
                  </div>
                </section>
              </div>

              {exp.links && exp.links.length > 0 && (
                <section className="border-t border-accent/10 pt-5">
                  <SectionLabel as="p" className="mb-3 text-[10px]">{modal.links}</SectionLabel>
                  <div className="flex flex-col gap-3">
                    {exp.links.map(link => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 text-xs
                                   text-accent transition-colors duration-150 hover:text-accent/70"
                      >
                        <ExternalLink size={16} aria-hidden="true" className="shrink-0" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </section>
              )}

            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

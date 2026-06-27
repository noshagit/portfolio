import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import type { Experience } from '../../types/experience'
import SectionLabel from '../../components/ui/SectionLabel'
import Tag from '../../components/ui/Tag'
import EXPERIENCE_IMAGES from './imageMap'

const EASE = [0.22, 1, 0.36, 1] as const

interface Props {
  exp:     Experience
  onClose: () => void
}

export default function ExperienceModal({ exp, onClose }: Props) {
  const images = EXPERIENCE_IMAGES[exp.id] ?? []

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

      {/* Centering shell — pointer-events-none lets backdrop clicks fall through */}
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
            <SectionLabel as="p" className="mb-3 text-[10px]">// description</SectionLabel>
            <p className="text-sm leading-relaxed text-foreground/60">{exp.description}</p>
          </section>

          {/* Images — only when files exist in src/assets/experiences/{id}/ */}
          {images.length > 0 && (
            <section className="mb-8">
              <SectionLabel as="p" className="mb-3 text-[10px]">// images</SectionLabel>
              <div className={['grid gap-2', images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'].join(' ')}>
                {images.map((src, i) => (
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
            <SectionLabel as="p" className="mb-3 text-[10px]">// métiers liés</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {exp.metiers_lies.map(m => <Tag key={m}>{m}</Tag>)}
            </div>
          </section>

          {/* Compétences */}
          <section className="mb-6">
            <SectionLabel as="p" className="mb-3 text-[10px]">// compétences obtenues</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {exp.competences_obtenir.map(c => <Tag key={c} accent>{c}</Tag>)}
            </div>
          </section>

          {/* Soft skills */}
          <section className={exp.links?.length ? 'mb-8' : ''}>
            <SectionLabel as="p" className="mb-3 text-[10px]">// soft skills utilisés</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {exp.soft_skills_utilises.map(s => <Tag key={s}>{s}</Tag>)}
            </div>
          </section>

          {/* Links — only when experience has entries in links[] */}
          {exp.links && exp.links.length > 0 && (
            <section className="border-t border-accent/10 pt-6">
              <SectionLabel as="p" className="mb-3 text-[10px]">// liens</SectionLabel>
              <div className="flex flex-col gap-2">
                {exp.links.map(link => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-xs text-foreground/60 transition-colors duration-150 hover:text-accent"
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

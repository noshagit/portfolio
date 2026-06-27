import { memo } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { Experience } from '../../types/experience'
import { useLang } from '../../hooks/useLang'
import { EASE } from '../../lib/motion'

interface Props {
  exp:    Experience
  onOpen: (id: string) => void
}

function ExperienceCard({ exp, onOpen }: Props) {
  const { t } = useLang()
  const typeLabel = t.experiences.types[exp.type as keyof typeof t.experiences.types] ?? exp.type

  function handleOpen() { onOpen(exp.id) }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.28, ease: EASE }}
      onClick={handleOpen}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen() } }}
      role="button"
      tabIndex={0}
      aria-label={exp.nom}
      className="group flex flex-col gap-4 border border-accent/15 p-5 transition-colors duration-200 hover:border-accent/40 hover:bg-accent-muted"
    >
      <span className="self-start border border-accent/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground/60">
        {typeLabel}
      </span>

      <div className="flex-1">
        <h2 className="mb-1 text-sm font-bold leading-snug text-foreground">{exp.nom}</h2>
        <p className="font-mono text-xs text-foreground/60">{exp.employeur_collab}</p>
      </div>

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

export default memo(ExperienceCard)

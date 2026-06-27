import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { Experience } from '../../types/experience'

const EASE = [0.22, 1, 0.36, 1] as const

interface Props {
  exp:    Experience
  onOpen: () => void
}

export default function ExperienceCard({ exp, onOpen }: Props) {
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

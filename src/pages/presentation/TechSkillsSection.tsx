import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionLabel from '../../components/ui/SectionLabel'
import { useLang } from '../../hooks/useLang'

export default function TechSkillsSection() {
  const { t } = useLang()
  const { techSkills } = t.presentation
  const [activeId, setActiveId] = useState(techSkills.categories[0].id)

  const active = techSkills.categories.find(c => c.id === activeId) ?? techSkills.categories[0]

  return (
    <>
      <SectionLabel>{techSkills.label}</SectionLabel>

      {/* Category tabs — horizontal scroll on mobile */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {techSkills.categories.map(({ id, label }) => {
          const isActive = activeId === id
          return (
            <button
              key={id}
              onClick={() => setActiveId(id)}
              aria-pressed={isActive}
              className={[
                'shrink-0 rounded-full border px-4 py-1.5 font-mono text-xs transition-all duration-200',
                isActive
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-foreground/15 text-foreground/60 hover:border-accent/40 hover:text-foreground',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Cross-fading skill grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {active.skills.map(({ title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-2 border border-foreground/10 px-5 py-4
                         transition-colors duration-200 hover:border-accent/30"
            >
              <span className="font-mono text-xs font-medium text-accent">{title}</span>
              <span className="text-sm leading-relaxed text-foreground/60">{description}</span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

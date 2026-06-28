import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mountain, Camera, Gamepad2, Telescope, ExternalLink } from 'lucide-react'
import SectionLabel from '../../components/ui/SectionLabel'
import { useLang } from '../../hooks/useLang'
import { EASE } from '../../lib/motion'

const ICONS: Record<string, React.ElementType> = {
  hiking:      Mountain,
  photography: Camera,
  gaming:      Gamepad2,
  astronomy:   Telescope,
}

export default function PassionPanel() {
  const { t } = useLang()
  const { passions } = t.presentation
  const [activeId, setActiveId] = useState(passions.items[0].id)

  const active = passions.items.find(p => p.id === activeId) ?? passions.items[0]

  return (
    <>
      <SectionLabel>{passions.label}</SectionLabel>

      {/* Tab buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {passions.items.map(({ id, label }) => {
          const Icon = ICONS[id] ?? Mountain
          const isActive = activeId === id
          return (
            <button
              key={id}
              onClick={() => setActiveId(id)}
              className={[
                'inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-widest',
                'transition-colors duration-200',
                isActive
                  ? 'border-accent text-accent'
                  : 'border-foreground/10 text-foreground/40 hover:border-accent/30 hover:text-foreground/60',
              ].join(' ')}
            >
              <Icon size={10} aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>

      {/* Active passion content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="flex flex-col gap-3"
        >
          <p className="text-justify hyphens-auto break-words text-sm leading-relaxed text-foreground/60 md:text-base">
            {active.text}
          </p>
          {active.url && (
            <a
              href={active.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 self-start
                         text-xs text-foreground/40 transition-colors duration-200 hover:text-accent"
            >
              <ExternalLink size={10} aria-hidden="true" />
              {active.urlLabel}
            </a>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

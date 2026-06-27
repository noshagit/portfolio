import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mountain, Camera, Gamepad2, Telescope } from 'lucide-react'
import SectionLabel from '../../components/ui/SectionLabel'
import { useLang } from '../../hooks/useLang'

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
  const passion = passions.items.find(p => p.id === activeId) ?? passions.items[0]

  return (
    <>
      <SectionLabel>{passions.label}</SectionLabel>

      <div className="grid gap-8 md:grid-cols-[200px_1fr] md:gap-16">

        {/* Selector */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 md:flex-col md:gap-4">
          {passions.items.map(({ id, label }) => {
            const isActive = activeId === id
            const Icon = ICONS[id] ?? Mountain
            return (
              <button
                key={id}
                onClick={() => setActiveId(id)}
                aria-pressed={isActive}
                className={[
                  'flex items-center gap-3 text-left transition-all duration-200',
                  isActive ? 'text-accent' : 'text-foreground/60 hover:text-foreground',
                ].join(' ')}
              >
                <motion.span
                  animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -4 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="font-mono text-xs"
                >
                  ›
                </motion.span>
                <Icon size={13} />
                <span className="font-mono text-sm">{label}</span>
              </button>
            )
          })}
        </div>

        {/* Cross-fading text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="min-h-[6rem] text-sm leading-relaxed text-foreground/60 md:min-h-[8rem] md:text-base"
          >
            {passion.text}
          </motion.p>
        </AnimatePresence>

      </div>
    </>
  )
}

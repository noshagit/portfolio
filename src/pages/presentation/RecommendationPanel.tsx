import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download } from 'lucide-react'
import SectionLabel from '../../components/ui/SectionLabel'
import { useLang } from '../../hooks/useLang'

export default function RecommendationPanel() {
  const { t } = useLang()
  const { recommendations } = t.presentation
  const [activeId, setActiveId] = useState(recommendations.items[0].id)
  const reco = recommendations.items.find(r => r.id === activeId) ?? recommendations.items[0]

  return (
    <>
      <SectionLabel>{recommendations.label}</SectionLabel>

      <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-16">

        {/* Selector */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 md:flex-col md:gap-4">
          {recommendations.items.map(({ id, label }) => {
            const isActive = activeId === id
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
                <span className="font-mono text-sm">{label}</span>
              </button>
            )
          })}
        </div>

        {/* Cross-fading content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex flex-col gap-4"
          >
            <p className="font-mono text-xs text-accent">{reco.role}</p>
            <p className="min-h-[6rem] text-sm leading-relaxed text-foreground/60 md:min-h-[8rem] md:text-base">
              {reco.text}
            </p>
            <a
              href={reco.pdf}
              download
              className="inline-flex items-center gap-2 self-start border border-accent/30 px-5 py-2.5
                         font-mono text-xs text-foreground/60
                         transition-all duration-200 hover:-translate-y-px hover:border-accent/70 hover:text-foreground"
            >
              <Download size={13} />
              {recommendations.downloadPdf}
            </a>
          </motion.div>
        </AnimatePresence>

      </div>
    </>
  )
}

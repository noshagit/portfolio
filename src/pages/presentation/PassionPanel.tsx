import { motion } from 'framer-motion'
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

  return (
    <>
      <SectionLabel>{passions.label}</SectionLabel>

      <div className="flex flex-col gap-8">
        {passions.items.map(({ id, label, text, url, urlLabel }, i) => {
          const Icon = ICONS[id] ?? Mountain
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.07 }}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <Icon size={12} className="text-accent" />
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                  {label}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-foreground/60 md:text-base">
                {text}
              </p>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 self-start
                             text-xs text-foreground/40 transition-colors duration-200 hover:text-accent"
                >
                  <ExternalLink size={10} aria-hidden="true" />
                  {urlLabel}
                </a>
              )}
            </motion.div>
          )
        })}
      </div>
    </>
  )
}

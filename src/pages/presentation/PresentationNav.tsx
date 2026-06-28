import { motion } from 'framer-motion'
import { useLang } from '../../hooks/useLang'

interface Props {
  activeIdx: number
  onChange:  (idx: number) => void
}

export default function PresentationNav({ activeIdx, onChange }: Props) {
  const { t } = useLang()
  const p = t.presentation

  const labels = [
    p.intro.label.replace(/^\/\/ /, ''),
    p.techSkills.label.replace(/^\/\/ /, ''),
    p.softSkills.label.replace(/^\/\/ /, ''),
    p.education.label.replace(/^\/\/ /, ''),
    p.recommendations.label.replace(/^\/\/ /, ''),
    p.passions.label.replace(/^\/\/ /, ''),
    p.transition.label.replace(/^\/\/ /, ''),
  ]

  return (
    <nav
      aria-label="Page sections"
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col xl:flex"
    >
      {labels.map((label, i) => {
        const isActive = activeIdx === i
        return (
          <div key={label} className="flex flex-col">
            {i > 0 && (
              <div className="ml-[3px] h-6 w-px self-start bg-foreground/10" />
            )}
            <motion.button
              onClick={() => onChange(i)}
              aria-current={isActive ? 'step' : undefined}
              animate={{ scale: isActive ? 1.05 : 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ transformOrigin: 'left center' }}
              className={[
                'flex items-center gap-2.5 py-0.5 text-left transition-colors duration-200',
                isActive
                  ? 'text-accent'
                  : 'text-foreground/40 hover:text-accent',
              ].join(' ')}
            >
              <span
                className={[
                  'shrink-0 rounded-full transition-all duration-300',
                  isActive
                    ? 'h-2 w-2 bg-accent'
                    : 'h-1.5 w-1.5 border border-foreground/25',
                ].join(' ')}
              />
              <span className="whitespace-nowrap text-[10px] uppercase tracking-widest">
                {label}
              </span>
            </motion.button>
          </div>
        )
      })}
    </nav>
  )
}

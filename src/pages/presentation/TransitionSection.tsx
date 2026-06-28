import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SectionLabel from '../../components/ui/SectionLabel'
import { useLang } from '../../hooks/useLang'
import type { View } from '../../types'
import { EASE } from '../../lib/motion'

interface Props {
  onNavigate: (view: View) => void
}

export default function TransitionSection({ onNavigate }: Props) {
  const { t } = useLang()
  const { transition } = t.presentation

  return (
    <>
      <SectionLabel>{transition.label}</SectionLabel>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
        className="mb-10 max-w-2xl text-justify hyphens-auto break-words text-base leading-relaxed text-foreground/60 md:text-lg"
      >
        {transition.text}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.2 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('experiences')}
        className="inline-flex items-center gap-2.5 border border-accent px-6 py-3
                   text-sm font-medium text-accent transition-colors duration-200
                   hover:bg-accent hover:text-background"
      >
        {transition.cta}
        <ArrowRight size={14} aria-hidden="true" />
      </motion.button>
    </>
  )
}

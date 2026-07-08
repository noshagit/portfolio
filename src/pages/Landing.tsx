import { motion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { View } from '../types'
import { useLang } from '../hooks/useLang'
import { EASE } from '../lib/motion'

interface Props {
  onNavigate: (view: View) => void
}

const WORD: Variants = {
  hidden:  { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

const NAME_CONTAINER: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.05 } },
}

const BUTTONS: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE, delay: 0.8 } },
}

const SPRING = { type: 'spring', stiffness: 380, damping: 22 } as const

export default function Landing({ onNavigate }: Props) {
  const { t } = useLang()

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -28, transition: { duration: 0.3 } }}
      className="relative flex min-h-[calc(100dvh-5rem)] items-center justify-center px-6"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col items-center gap-14 text-center sm:gap-20">

          <motion.h1 variants={NAME_CONTAINER} className="flex flex-col items-center">
            <div className="overflow-hidden pb-1">
              <motion.span
                variants={WORD}
                className="inline-block font-light tracking-tight text-foreground
                           text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
              >
                Ilian
              </motion.span>
            </div>
            <div className="flex items-baseline gap-3 overflow-hidden pb-2 sm:gap-5">
              {(['BEN', 'HAMOU'] as const).map(word => (
                <motion.span
                  key={word}
                  variants={WORD}
                  className="inline-block font-black uppercase tracking-tighter text-accent
                             text-[2.5rem] sm:text-6xl md:text-8xl lg:text-[9rem]"
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.h1>

          <motion.div
            variants={BUTTONS}
            className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5"
          >
            <motion.button
              onClick={() => onNavigate('presentation')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              className="group flex items-center gap-2.5 rounded-lg
                         bg-accent px-6 py-3 text-sm font-medium text-background
                         shadow-lg hover:shadow-accent transition-[box-shadow] duration-300"
            >
              {t.landing.discover}
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

        </div>
      </div>
    </motion.div>
  )
}

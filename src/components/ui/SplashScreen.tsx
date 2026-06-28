import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '../../lib/motion'

interface Props {
  ready:  boolean   // true when translations are loaded
  onDone: () => void
}

export default function SplashScreen({ ready, onDone }: Props) {
  const [barDone, setBarDone] = useState(false)

  // Exit only when BOTH the progress bar has finished AND translations are ready
  useEffect(() => {
    if (!barDone || !ready) return
    const timer = setTimeout(onDone, 180)
    return () => clearTimeout(timer)
  }, [barDone, ready, onDone])

  return (
    <motion.div
      key="splash"
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.55, ease: EASE } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <div className="mb-10 text-center">
        <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-foreground/30">
          portfolio
        </p>
        <div className="flex flex-col items-center leading-none">
          <span className="font-light tracking-tight text-foreground text-4xl sm:text-5xl">
            Ilian
          </span>
          <span className="font-black uppercase tracking-tighter text-accent text-5xl sm:text-6xl">
            BEN HAMOU
          </span>
        </div>
      </div>

      {/* Progress bar — scaleX is GPU-accelerated, origin-left expands left→right */}
      <div
        className="w-40 overflow-hidden"
        style={{ height: '1px', background: 'color-mix(in srgb, var(--foreground) 10%, transparent)' }}
      >
        <motion.div
          className="h-full origin-left bg-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: 'easeInOut', delay: 0.1 }}
          onAnimationComplete={() => setBarDone(true)}
        />
      </div>
    </motion.div>
  )
}

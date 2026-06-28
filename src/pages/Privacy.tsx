import { motion } from 'framer-motion'
import type { View } from '../types'
import { useLang } from '../hooks/useLang'
import { EASE } from '../lib/motion'

const CONTAINER = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const BLOCK = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

interface Props {
  onNavigate: (view: View) => void
}

export default function Privacy({ onNavigate: _onNavigate }: Props) {
  const { t } = useLang()
  const p = t.privacy

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24"
    >
      <motion.div variants={CONTAINER} initial="hidden" animate="visible" className="flex flex-col gap-12">

        <motion.p variants={BLOCK} className="text-xs text-accent">
          {p.label}
        </motion.p>

        <motion.section variants={BLOCK} className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            {p.controller.heading}
          </h2>
          <p className="text-sm text-foreground/80">{p.controller.name}</p>
          <a
            href={`mailto:${p.controller.email}`}
            className="text-sm text-accent underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            {p.controller.email}
          </a>
        </motion.section>

        <motion.section variants={BLOCK} className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            {p.data.heading}
          </h2>
          <p className="text-sm leading-relaxed text-foreground/70">{p.data.body}</p>
          <ul className="flex flex-col gap-1.5 pl-4">
            {p.data.items.map((item) => (
              <li key={item} className="text-xs text-foreground/60 before:mr-2 before:text-accent before:content-['›']">
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm leading-relaxed text-foreground/70">{p.data.retention}</p>
        </motion.section>

        <motion.section variants={BLOCK} className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            {p.letters.heading}
          </h2>
          <p className="text-sm leading-relaxed text-foreground/70">{p.letters.body}</p>
        </motion.section>

        <motion.section variants={BLOCK} className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            {p.rights.heading}
          </h2>
          <p className="text-sm leading-relaxed text-foreground/70">
            {p.rights.body}{' '}
            <a
              href={`mailto:${p.controller.email}`}
              className="text-accent underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              {p.controller.email}
            </a>
            .
          </p>
        </motion.section>

        <motion.p variants={BLOCK} className="text-[11px] text-foreground/30">
          {p.updated}
        </motion.p>

      </motion.div>
    </motion.div>
  )
}

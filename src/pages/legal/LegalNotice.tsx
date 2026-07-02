import { motion } from 'framer-motion'
import type { View } from '../../types'
import { useLang } from '../../hooks/useLang'
import { EASE } from '../../lib/motion'

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

/** Legal notice page: editor, hosting provider, and intellectual property disclosures. */
export default function LegalNotice({ onNavigate: _onNavigate }: Props) {
  const { t } = useLang()
  const l = t.legal

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24"
    >
      <motion.main variants={CONTAINER} initial="hidden" animate="visible" className="flex flex-col gap-12">

        <motion.p variants={BLOCK} className="text-xs text-accent">
          {l.label}
        </motion.p>

        <motion.section variants={BLOCK} className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            {l.editor.heading}
          </h2>
          <p className="text-sm text-foreground/80">{l.editor.name}</p>
          <p className="text-justify hyphens-auto break-words text-sm leading-relaxed text-foreground/70">{l.editor.status}</p>
          <a
            href={`mailto:${l.editor.email}`}
            className="text-sm text-accent underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            {l.editor.email}
          </a>
          <p className="text-sm text-foreground/70">{l.editor.phone}</p>
        </motion.section>

        <motion.section variants={BLOCK} className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            {l.publisher.heading}
          </h2>
          <p className="text-justify hyphens-auto break-words text-sm leading-relaxed text-foreground/70">{l.publisher.body}</p>
        </motion.section>

        <motion.section variants={BLOCK} className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            {l.host.heading}
          </h2>
          <p className="text-sm text-foreground/80">{l.host.name}</p>
          <p className="text-justify hyphens-auto break-words text-sm leading-relaxed text-foreground/70">{l.host.address}</p>
          <a
            href={l.host.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            {l.host.website}
          </a>
        </motion.section>

        <motion.section variants={BLOCK} className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            {l.ip.heading}
          </h2>
          <p className="text-justify hyphens-auto break-words text-sm leading-relaxed text-foreground/70">{l.ip.body}</p>
        </motion.section>

        <motion.section variants={BLOCK} className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            {l.liability.heading}
          </h2>
          <p className="text-justify hyphens-auto break-words text-sm leading-relaxed text-foreground/70">{l.liability.body}</p>
        </motion.section>

        <motion.p variants={BLOCK} className="text-[11px] text-foreground/30">
          {l.updated}
        </motion.p>

      </motion.main>
    </motion.div>
  )
}

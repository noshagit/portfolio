import { motion } from 'framer-motion'
import { Mail, ExternalLink, Download } from 'lucide-react'
import type { View } from '../types'
import PopoverContactLink from './contact/PopoverContactLink'
import { useLang } from '../hooks/useLang'
import { EASE } from '../lib/motion'

const CONTAINER = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
}

const LINE = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

interface Props {
  onNavigate: (view: View) => void
}

export default function Contact({ onNavigate: _onNavigate }: Props) {
  const { t } = useLang()
  const c = t.contact

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="flex min-h-[calc(100dvh-10rem)] items-center"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16">
        <motion.div variants={CONTAINER} initial="hidden" animate="visible">

          <motion.p
            variants={LINE}
            className="mb-8 text-sm font-semibold uppercase tracking-widest text-accent sm:mb-12"
          >
            {c.sectionLabel}
          </motion.p>

          <motion.h1
            variants={LINE}
            aria-label="Ilian BEN HAMOU"
            className="font-black uppercase tracking-tight text-accent
                       text-4xl sm:text-6xl md:text-8xl"
          >
            BEN HAMOU
          </motion.h1>

          <motion.p
            variants={LINE}
            aria-hidden="true"
            className="mb-10 font-light tracking-tight text-foreground
                       text-3xl sm:text-4xl md:text-6xl sm:mb-14"
          >
            Ilian
          </motion.p>

          <motion.div variants={LINE} className="mb-8 h-px bg-accent/10 sm:mb-10" />

          <motion.div variants={LINE} className="mb-10 sm:mb-14">
            <PopoverContactLink
              Icon={Mail}
              displayValue="ilianbenhamou2163@gmail.com"
              copyValue="ilianbenhamou2163@gmail.com"
              actionHref="mailto:ilianbenhamou2163@gmail.com"
              actionLabel={c.email.action}
              ActionIcon={ExternalLink}
            />
          </motion.div>

          <motion.div variants={LINE} className="mb-8 h-px bg-accent/10 sm:mb-10" />

          <motion.div variants={LINE} className="mt-8 sm:mt-10">
            <p className="mb-6 text-justify hyphens-auto break-words text-xs leading-relaxed text-foreground/60">
              {c.cv.tagline}
            </p>
            <motion.a
              href="/cv.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2.5 border border-accent px-6 py-3
                         text-sm font-medium text-accent transition-colors duration-200
                         hover:bg-accent hover:text-background"
            >
              <Download size={14} aria-hidden="true" />
              {c.cv.button}
            </motion.a>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  )
}

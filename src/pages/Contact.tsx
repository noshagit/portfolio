import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, ExternalLink, PhoneCall } from 'lucide-react'
import type { View } from '../types'
import PopoverContactLink from './contact/PopoverContactLink'

const EASE = [0.22, 1, 0.36, 1] as const

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="flex min-h-[calc(100vh-10rem)] items-center"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16">

        <motion.div variants={CONTAINER} initial="hidden" animate="visible">

          {/* ── Label ─────────────────────────────────────────────── */}
          <motion.p
            variants={LINE}
            className="mb-8 text-xs font-semibold uppercase tracking-widest text-accent sm:mb-12"
          >
            Contact
          </motion.p>

          {/* ── Name ──────────────────────────────────────────────── */}
          <motion.h1
            variants={LINE}
            className="font-black uppercase tracking-tight text-accent
                       text-4xl sm:text-6xl md:text-8xl"
          >
            BEN HAMOU
          </motion.h1>

          <motion.p
            variants={LINE}
            className="mb-10 font-light tracking-tight text-foreground
                       text-3xl sm:text-4xl md:text-6xl sm:mb-14"
          >
            Ilian
          </motion.p>

          {/* ── Divider ───────────────────────────────────────────── */}
          <motion.div variants={LINE} className="mb-8 h-px bg-accent/10 sm:mb-10" />

          {/* ── Phone ─────────────────────────────────────────────── */}
          <motion.div variants={LINE} className="mb-5">
            <PopoverContactLink
              Icon={Phone}
              displayValue="+33 7 81 58 38 39"
              copyValue="+33781583839"
              actionHref="tel:+33781583839"
              actionLabel="Appeler"
              ActionIcon={PhoneCall}
            />
          </motion.div>

          {/* ── Email ─────────────────────────────────────────────── */}
          <motion.div variants={LINE} className="mb-10 sm:mb-14">
            <PopoverContactLink
              Icon={Mail}
              displayValue="ilianbenhamou2163@gmail.com"
              copyValue="ilianbenhamou2163@gmail.com"
              actionHref="mailto:ilianbenhamou2163@gmail.com"
              actionLabel="Ouvrir la messagerie"
              ActionIcon={ExternalLink}
            />
          </motion.div>

          {/* ── Divider ───────────────────────────────────────────── */}
          <motion.div variants={LINE} className="mb-8 h-px bg-accent/10 sm:mb-10" />

          {/* ── Mobility label ────────────────────────────────────── */}
          <motion.div variants={LINE} className="mb-5 flex items-center gap-2 sm:mb-6">
            <MapPin size={11} className="text-foreground/60" />
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/60">
              Zone de mobilité / Lieux de travail
            </p>
          </motion.div>

          {/* ── Cities ────────────────────────────────────────────── */}
          <motion.div
            variants={LINE}
            className="mb-5 flex flex-wrap items-baseline gap-4 sm:gap-6 md:gap-10"
          >
            <span className="font-black uppercase tracking-tight text-foreground
                             text-3xl sm:text-4xl md:text-5xl">
              Marseille
            </span>
            <span className="text-lg text-accent/10 sm:text-xl">|</span>
            <span className="font-black uppercase tracking-tight text-foreground
                             text-3xl sm:text-4xl md:text-5xl">
              Lyon
            </span>
          </motion.div>

          {/* ── Remote note ───────────────────────────────────────── */}
          <motion.p variants={LINE} className="text-xs text-foreground/60">
            Ouvert aux propositions (Full Remote / Déplacements)
          </motion.p>

        </motion.div>
      </div>
    </motion.div>
  )
}

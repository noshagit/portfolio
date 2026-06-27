import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, MapPin, Copy, Check, ExternalLink, PhoneCall } from 'lucide-react'
import type { ComponentType } from 'react'
import type { View } from '../types'

// ─── Constants ────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const

const CONTAINER = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
}

const LINE = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

// ─── Shared popover contact link ──────────────────────────────────────────────

interface IconProps { size?: number; className?: string }

function PopoverContactLink({
  Icon,
  displayValue,
  copyValue,
  actionHref,
  actionLabel,
  ActionIcon,
}: {
  Icon:         ComponentType<IconProps>
  displayValue: string
  copyValue:    string
  actionHref:   string
  actionLabel:  string
  ActionIcon:   ComponentType<IconProps>
}) {
  const [open,   setOpen]   = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function handleCopy() {
    await navigator.clipboard.writeText(copyValue)
    setCopied(true)
    setTimeout(() => { setCopied(false); setOpen(false) }, 1600)
  }

  return (
    <div ref={ref} className="inline-flex items-start gap-4">
      <Icon
        size={15}
        className={[
          'mt-0.5 shrink-0 transition-colors duration-200',
          open ? 'text-accent' : 'text-foreground/60',
        ].join(' ')}
      />

      <div className="flex flex-col gap-3">
        {/* Trigger */}
        <button
          onClick={() => setOpen(prev => !prev)}
          aria-expanded={open}
          className="group relative text-left text-sm text-foreground/60
                     transition-colors duration-200 hover:text-foreground sm:text-base md:text-lg"
        >
          {displayValue}
          <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent
                           transition-transform duration-300 ease-out group-hover:scale-x-100" />
        </button>

        {/* Options */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-center gap-2"
            >
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded border border-accent/25 px-2.5 py-1
                           text-xs text-foreground/60 transition-colors duration-150
                           hover:border-accent/60 hover:text-foreground"
              >
                {copied
                  ? <><Check size={11} className="text-accent" /><span>Copié !</span></>
                  : <><Copy size={11} /><span>Copier</span></>
                }
              </button>

              <a
                href={actionHref}
                className="flex items-center gap-1.5 rounded border border-accent/25 px-2.5 py-1
                           text-xs text-foreground/60 transition-colors duration-150
                           hover:border-accent/60 hover:text-foreground"
              >
                <ActionIcon size={11} />
                <span>{actionLabel}</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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

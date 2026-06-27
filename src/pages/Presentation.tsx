import { motion } from 'framer-motion'
import type { View } from '../types'
import SectionLabel from '../components/ui/SectionLabel'
import ScrollReveal from '../components/ui/ScrollReveal'
import SkillsSection from './presentation/SkillsSection'
import RecommendationPanel from './presentation/RecommendationPanel'
import PassionPanel from './presentation/PassionPanel'

const EASE = [0.22, 1, 0.36, 1] as const

interface Props {
  onNavigate: (view: View) => void
}

export default function Presentation({ onNavigate: _onNavigate }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="mx-auto max-w-5xl space-y-16 px-4 py-12 sm:px-6 sm:py-16 md:space-y-24 md:py-20">

        {/* ── Intro — visible immediately, no scroll reveal ─────────── */}
        <div>
          <SectionLabel as="p">// intro</SectionLabel>
          <h1 className="mb-6 font-black leading-tight text-foreground
                         text-3xl sm:text-4xl md:text-5xl">
            Étudiant en<br />
            <span className="text-accent">Cybersécurité.</span>
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-foreground/60 md:text-base">
            23 ans, en troisième année d'école spécialisée en cybersécurité,
            je suis activement à la recherche d'un{' '}
            <span className="font-medium text-accent">contrat d'apprentissage</span>{' '}
            pour poursuivre ma montée en compétences au sein d'une équipe
            technique ambitieuse.
          </p>
        </div>

        {/* ── Soft Skills + Languages ── each column has its own reveal */}
        <SkillsSection />

        {/* ── Recommandations ───────────────────────────────────────── */}
        <ScrollReveal>
          <RecommendationPanel />
        </ScrollReveal>

        {/* ── Passions ──────────────────────────────────────────────── */}
        <ScrollReveal>
          <PassionPanel />
        </ScrollReveal>

      </div>
    </motion.div>
  )
}

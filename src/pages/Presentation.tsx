import { motion } from 'framer-motion'
import type { View } from '../types'
import SectionLabel from '../components/ui/SectionLabel'
import { useLang } from '../hooks/useLang'
import ScrollReveal from '../components/ui/ScrollReveal'
import TechSkillsSection from './presentation/TechSkillsSection'
import SkillsSection from './presentation/SkillsSection'
import EducationSection from './presentation/EducationSection'
import RecommendationPanel from './presentation/RecommendationPanel'
import PassionPanel from './presentation/PassionPanel'
import { EASE } from '../lib/motion'

interface Props {
  onNavigate: (view: View) => void
}

export default function Presentation({ onNavigate: _onNavigate }: Props) {
  const { t } = useLang()
  const i = t.presentation.intro

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
          <SectionLabel as="p">{i.label}</SectionLabel>
          <h1 className="mb-6 font-black leading-tight text-foreground
                         text-3xl sm:text-4xl md:text-5xl">
            {i.title}<br />
            <span className="text-accent">{i.titleAccent}</span>
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-foreground/60 md:text-base">
            {i.bio1}{' '}
            <span className="font-medium text-accent">{i.bioAccent}</span>{' '}
            {i.bio2}
          </p>
        </div>

        {/* ── 1. Compétences techniques ─────────────────────────────── */}
        <ScrollReveal>
          <TechSkillsSection />
        </ScrollReveal>

        {/* ── 2. Soft Skills + Languages ────────────────────────────── */}
        <SkillsSection />

        {/* ── 3. Parcours éducatif ──────────────────────────────────── */}
        <ScrollReveal>
          <EducationSection />
        </ScrollReveal>

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

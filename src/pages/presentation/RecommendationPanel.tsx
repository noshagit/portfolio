import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download } from 'lucide-react'
import SectionLabel from '../../components/ui/SectionLabel'

const RECOMMENDATIONS = [
  {
    id:    'iaboni',
    label: 'Alexandra IABONI',
    role:  'Responsable des admissions - Lyon Ynov Campus',
    text:  "Alexandra m'a côtoyé en tant qu'ambassadeur de l'école et ancien membre du Bureau des Sports. Elle atteste de mon engagement dans la vie étudiante, de mon sens du collectif et de ma capacité à représenter l'établissement avec authenticité lors d'événements d'envergure.",
    pdf:   '/ldr/Alexandra%20IABONI.pdf',
  },
  {
    id:    'sirot',
    label: 'Cellya SIROT',
    role:  'Développeuse web - Oraxya',
    text:  "Cellya m'a confié un rôle clé sur un projet numérique d'envergure nationale. Elle souligne ma posture client exemplaire, mon esprit force de proposition, ayant contribué à des optimisations encore appréciées aujourd'hui, et ma capacité à progresser en autonomie face à des problématiques techniques complexes.",
    pdf:   '/ldr/Cellya%20SIROT.pdf',
  },
  {
    id:    'theodore',
    label: 'Melvin THEODORE',
    role:  'Expert en cybersécurité - Formateur / Conférencier',
    text:  "Fort d'expériences au sein d'ARKEMA et d'INTERPOL, Melvin m'a encadré dans plusieurs formations spécialisées. Il témoigne de mes compétences techniques, de ma curiosité pour les enjeux du domaine et de mon éthique professionnelle, des qualités qu'il juge essentielles dans les métiers de la cybersécurité.",
    pdf:   '/ldr/Melvin%20Theodore.pdf',
  },
] as const

type RecoId = (typeof RECOMMENDATIONS)[number]['id']

export default function RecommendationPanel() {
  const [activeReco, setActiveReco] = useState<RecoId>('iaboni')
  const reco = RECOMMENDATIONS.find(r => r.id === activeReco)!

  return (
    <>
      <SectionLabel>// recommandations</SectionLabel>

      <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-16">

        {/* Selector */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 md:flex-col md:gap-4">
          {RECOMMENDATIONS.map(({ id, label }) => {
            const isActive = activeReco === id
            return (
              <button
                key={id}
                onClick={() => setActiveReco(id)}
                aria-pressed={isActive}
                className={[
                  'flex items-center gap-3 text-left transition-all duration-200',
                  isActive ? 'text-accent' : 'text-foreground/60 hover:text-foreground',
                ].join(' ')}
              >
                <motion.span
                  animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -4 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="font-mono text-xs"
                >
                  ›
                </motion.span>
                <span className="font-mono text-sm">{label}</span>
              </button>
            )
          })}
        </div>

        {/* Cross-fading content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeReco}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex flex-col gap-4"
          >
            <p className="font-mono text-xs text-accent">{reco.role}</p>
            <p className="min-h-[6rem] text-sm leading-relaxed text-foreground/60 md:min-h-[8rem] md:text-base">
              {reco.text}
            </p>
            <a
              href={reco.pdf}
              download
              className="inline-flex items-center gap-2 self-start border border-accent/30 px-5 py-2.5
                         font-mono text-xs text-foreground/60
                         transition-all duration-200 hover:-translate-y-px hover:border-accent/70 hover:text-foreground"
            >
              <Download size={13} />
              Télécharger le PDF
            </a>
          </motion.div>
        </AnimatePresence>

      </div>
    </>
  )
}

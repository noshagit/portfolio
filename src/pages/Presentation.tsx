import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Mountain, Camera, Gamepad2, Telescope } from 'lucide-react'
import type { ReactNode } from 'react'
import type { View } from '../types'

// ─── Data ────────────────────────────────────────────────────────────────────

const SOFT_SKILLS = [
  'Adaptabilité', 'Curiosité', 'Rigueur', 'Autonomie', "Esprit d'équipe", 'Persévérance', 'Force de proposition', 'Leadership', 'Organisation',
]

const LANGUAGES = [
  { lang: 'Français', level: 'Langue maternelle' },
  { lang: 'Anglais',  level: 'B2+' },
]

const RECOMMENDATIONS = [
  {
    id:   'iaboni',
    label: 'Alexandra IABONI',
    role:  'Responsable des admissions - Lyon Ynov Campus',
    text:  "Alexandra m'a côtoyé en tant qu'ambassadeur de l'école et membre du Bureau des Sports. Elle atteste de mon engagement dans la vie étudiante, de mon sens du collectif et de ma capacité à représenter l'établissement avec authenticité lors d'événements d'envergure.",
    pdf:   '/ldr/Alexandra%20IABONI.pdf',
  },
  {
    id:   'sirot',
    label: 'Cellya SIROT',
    role:  'Développeuse web - Oraxya',
    text:  "Cellya m'a confié un rôle clé sur un projet numérique d'envergure nationale. Elle souligne ma posture client exemplaire, mon esprit force de proposition, ayant contribué à des optimisations encore appréciées aujourd'hui, et ma capacité à progresser en autonomie face à des problématiques techniques complexes.",
    pdf:   '/ldr/Cellya%20SIROT.pdf',
  },
  {
    id:   'theodore',
    label: 'Melvin THEODORE',
    role:  'Expert en cybersécurité - Formateur / Conférencier',
    text:  "Fort d'expériences au sein d'ARKEMA et d'INTERPOL, Melvin m'a encadré dans plusieurs formations spécialisées. Il témoigne de mes compétences techniques, de ma curiosité pour les enjeux du domaine et de mon éthique professionnelle, des qualités qu'il juge essentielles dans les métiers de la cybersécurité.",
    pdf:   '/ldr/Melvin%20Theodore.pdf',
  },
] as const

type RecoId = (typeof RECOMMENDATIONS)[number]['id']

const PASSIONS = [
  {
    id:    'hiking',
    label: 'Randonnée',
    Icon:  Mountain,
    text:  "J'aime partir à la découverte de zones naturelles et sillonner les sentiers de montagne pour me ressourcer. Prendre un bol d'air frais loin du quotidien, se dépasser physiquement et contempler des paysages sauvages, la montagne représente pour moi un espace de liberté et de reconnexion avec l'essentiel.",
  },
  {
    id:    'photography',
    label: 'Photographie',
    Icon:  Camera,
    text:  "Commencée en 2021 avec le petit Nikon Coolpix P510 de mon père, la photographie est rapidement devenue une passion à part entière. J'emporte mon appareil partout, à l'école, en randonnée, en camping, en vacances... Il m'accompagne presque en permanence. Capturer l'instant, choisir la lumière, figer un paysage ou un visage : chaque prise de vue est une nouvelle exploration.",
  },
  {
    id:    'gaming',
    label: 'Jeux Vidéo',
    Icon:  Gamepad2,
    text:  "Je joue aux jeux vidéo depuis l'enfance, ce qui m'a permis de développer des compétences sociales et relationnelles bien avant ma vie professionnelle. C'est en me demandant comment un jeu est créé que j'ai commencé à coder, puis à m'intéresser au réseau et système informatique, et enfin à comprendre leur protection, et pourquoi il était si simple de cracker certains jeux à l'époque. Le jeu vidéo est à l'origine de ma vocation en cybersécurité.",
  },
  {
    id:    'astronomy',
    label: 'Astronomie',
    Icon:  Telescope,
    text:  "Un amour émergent pour le ciel, et tout particulièrement pour l'observation du ciel profond. Galaxies, nébuleuses, amas stellaires... contempler ce qui se passe à des millions d'années-lumière me donne une perspective unique sur le monde. Cette passion croise naturellement la photographie, notamment l'astrophotographie, un terrain d'exploration qui n'a pas fini de me surprendre.",
  },
] as const

type PassionId = (typeof PASSIONS)[number]['id']

// ─── Helpers ─────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-5 font-mono text-xs uppercase tracking-widest text-accent">
      {children}
    </p>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  onNavigate: (view: View) => void
}

export default function Presentation({ onNavigate: _onNavigate }: Props) {
  const [active, setActive]         = useState<PassionId>('hiking')
  const [activeReco, setActiveReco] = useState<RecoId>('iaboni')
  const passion = PASSIONS.find(p => p.id === active)!
  const reco    = RECOMMENDATIONS.find(r => r.id === activeReco)!

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="mx-auto max-w-5xl space-y-16 px-4 py-12 sm:px-6 sm:py-16 md:space-y-24 md:py-20">

        {/* ── Intro ─────────────────────────────────────────────────────── */}
        <Reveal>
          <SectionLabel>// intro</SectionLabel>
          <h1 className="mb-6 font-black leading-tight text-foreground
                         text-3xl sm:text-4xl md:text-5xl">
            Étudiant en<br />
            <span className="text-accent">Cybersécurité.</span>
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-foreground/60 md:text-base">
            23 ans, en troisième année d'école spécialisée en cybersécurité,
            je suis activement à la recherche d'un{' '}
            <span className="font-medium text-foreground">contrat d'apprentissage</span>{' '}
            pour poursuivre ma montée en compétences au sein d'une équipe
            technique ambitieuse.
          </p>
        </Reveal>

        {/* ── Soft Skills + Languages ───────────────────────────────────── */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">

          <Reveal>
            <SectionLabel>// soft skills</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {SOFT_SKILLS.map(skill => (
                <span
                  key={skill}
                  className="border border-accent/20 px-3 py-1 font-mono text-xs text-foreground/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <SectionLabel>// langues</SectionLabel>
            <div className="flex flex-col gap-4">
              {LANGUAGES.map(({ lang, level }) => (
                <div
                  key={lang}
                  className="flex items-baseline justify-between border-b border-accent/10 pb-3"
                >
                  <span className="text-sm font-semibold text-foreground">{lang}</span>
                  <span className="font-mono text-xs text-foreground/40">{level}</span>
                </div>
              ))}
            </div>
          </Reveal>

        </div>

        {/* ── Recommandations ───────────────────────────────────────────── */}
        <Reveal>
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
                    className={[
                      'flex items-center gap-3 text-left transition-all duration-200',
                      isActive
                        ? 'text-accent'
                        : 'text-foreground/40 hover:text-foreground/70',
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
        </Reveal>

        {/* ── Passions ──────────────────────────────────────────────────── */}
        <Reveal>
          <SectionLabel>// passions</SectionLabel>

          <div className="grid gap-8 md:grid-cols-[200px_1fr] md:gap-16">

            {/* Selector */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 md:flex-col md:gap-4">
              {PASSIONS.map(({ id, label, Icon }) => {
                const isActive = active === id
                return (
                  <button
                    key={id}
                    onClick={() => setActive(id)}
                    className={[
                      'flex items-center gap-3 text-left transition-all duration-200',
                      isActive
                        ? 'text-accent'
                        : 'text-foreground/40 hover:text-foreground/70',
                    ].join(' ')}
                  >
                    <motion.span
                      animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -4 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="font-mono text-xs"
                    >
                      ›
                    </motion.span>
                    <Icon size={13} />
                    <span className="font-mono text-sm">{label}</span>
                  </button>
                )
              })}
            </div>

            {/* Cross-fading text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="min-h-[6rem] text-sm leading-relaxed text-foreground/60 md:min-h-[8rem] md:text-base"
              >
                {passion.text}
              </motion.p>
            </AnimatePresence>

          </div>
        </Reveal>

      </div>
    </motion.div>
  )
}

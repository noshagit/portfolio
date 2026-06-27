import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mountain, Camera, Gamepad2, Telescope } from 'lucide-react'
import SectionLabel from '../../components/ui/SectionLabel'

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

export default function PassionPanel() {
  const [active, setActive] = useState<PassionId>('hiking')
  const passion = PASSIONS.find(p => p.id === active)!

  return (
    <>
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
    </>
  )
}

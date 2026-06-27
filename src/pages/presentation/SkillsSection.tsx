import ScrollReveal from '../../components/ui/ScrollReveal'
import SectionLabel from '../../components/ui/SectionLabel'

const SOFT_SKILLS = [
  'Adaptabilité', 'Curiosité', 'Rigueur', 'Autonomie', "Esprit d'équipe",
  'Persévérance', 'Force de proposition', 'Leadership', 'Organisation',
]

const LANGUAGES = [
  { lang: 'Français', level: 'Langue maternelle' },
  { lang: 'Anglais',  level: 'B2+' },
]

export default function SkillsSection() {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-16">

      <ScrollReveal>
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
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <SectionLabel>// langues</SectionLabel>
        <div className="flex flex-col gap-4">
          {LANGUAGES.map(({ lang, level }) => (
            <div
              key={lang}
              className="flex items-baseline justify-between border-b border-accent/10 pb-3"
            >
              <span className="text-sm font-semibold text-foreground">{lang}</span>
              <span className="font-mono text-xs text-foreground/60">{level}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>

    </div>
  )
}

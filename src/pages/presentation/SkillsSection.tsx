import ScrollReveal from '../../components/ui/ScrollReveal'
import SectionLabel from '../../components/ui/SectionLabel'
import { useLang } from '../../hooks/useLang'

export default function SkillsSection() {
  const { t } = useLang()
  const { softSkills, languages } = t.presentation

  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-16">

      <ScrollReveal>
        <SectionLabel>{softSkills.label}</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {softSkills.items.map(skill => (
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
        <SectionLabel>{languages.label}</SectionLabel>
        <div className="flex flex-col gap-4">
          {languages.items.map(({ lang, level }) => (
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

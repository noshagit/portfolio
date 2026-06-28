import { motion } from 'framer-motion'
import SectionLabel from '../../components/ui/SectionLabel'
import { useLang } from '../../hooks/useLang'
import { EASE } from '../../lib/motion'

export default function SkillsSection() {
  const { t } = useLang()
  const { softSkills, languages } = t.presentation

  return (
    <div className="flex flex-col gap-12">

      <div>
        <SectionLabel>{softSkills.label}</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {softSkills.categories.map(({ id, label, items }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.07 }}
              className="flex flex-col gap-3 border border-foreground/10 px-5 py-4
                         transition-colors duration-200 hover:border-accent/30"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                {label}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map(skill => (
                  <span
                    key={skill}
                    className="border border-accent/20 px-2.5 py-0.5 text-xs text-foreground/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>{languages.label}</SectionLabel>
        <div className="flex flex-col gap-4">
          {languages.items.map(({ lang, level }) => (
            <div
              key={lang}
              className="flex items-baseline justify-between border-b border-accent/10 pb-3"
            >
              <span className="text-sm font-semibold text-foreground">{lang}</span>
              <span className="text-xs text-foreground/60">{level}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

import { motion } from 'framer-motion'
import SectionLabel from '../../components/ui/SectionLabel'
import { useLang } from '../../hooks/useLang'
import { EASE } from '../../lib/motion'

export default function TechSkillsSection() {
  const { t } = useLang()
  const { techSkills } = t.presentation

  return (
    <>
      <SectionLabel>{techSkills.label}</SectionLabel>

      <div className="flex flex-col gap-10">
        {techSkills.categories.map(({ id, label, skills }, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: i * 0.07 }}
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/40">
              {label}
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {skills.map(({ title, description }) => (
                <div
                  key={title}
                  className="flex flex-col gap-2 border border-foreground/10 px-5 py-4
                             transition-colors duration-200 hover:border-accent/30"
                >
                  <span className="text-xs font-medium text-accent">{title}</span>
                  <span className="text-justify text-sm leading-relaxed text-foreground/60">{description}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}

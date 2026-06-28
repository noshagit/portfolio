import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import SectionLabel from '../../components/ui/SectionLabel'
import { useLang } from '../../hooks/useLang'
import { EASE } from '../../lib/motion'

export default function RecommendationPanel() {
  const { t } = useLang()
  const { recommendations } = t.presentation

  return (
    <>
      <SectionLabel>{recommendations.label}</SectionLabel>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {recommendations.items.map(({ id, label, role, text, pdf }, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: i * 0.07 }}
            className="flex flex-col gap-3 border border-foreground/10 px-5 py-5
                       transition-colors duration-200 hover:border-accent/30"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                {label}
              </p>
              <p className="mt-1 text-xs text-accent">{role}</p>
            </div>

            <p className="flex-1 text-justify text-sm leading-relaxed text-foreground/60 md:text-base">
              {text}
            </p>

            <a
              href={pdf}
              download
              className="mt-auto inline-flex items-center gap-2 self-start border border-accent/30 px-5 py-2.5
                         text-xs text-foreground/60
                         transition-all duration-200 hover:-translate-y-px hover:border-accent/70 hover:text-foreground"
            >
              <Download size={13} aria-hidden="true" />
              {recommendations.downloadPdf}
            </a>
          </motion.div>
        ))}
      </div>
    </>
  )
}

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import SectionLabel from '../../components/ui/SectionLabel'
import { useLang } from '../../hooks/useLang'
import { EASE } from '../../lib/motion'

export default function EducationSection() {
  const { t } = useLang()
  const { education } = t.presentation

  return (
    <>
      <SectionLabel>{education.label}</SectionLabel>

      <div className="relative">
        {/* Horizontal rule - desktop only */}
        <div className="absolute top-2 hidden h-px w-full bg-foreground/10 md:block" aria-hidden="true" />

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-14">
          {education.items.map(({ id, period, degree, institution, url, context }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.1 }}
              className="relative flex gap-5 md:flex-col md:gap-4"
            >
              {/* Mobile: left accent line */}
              <div className="mt-1 flex flex-col items-center md:hidden" aria-hidden="true">
                <div className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                <div className="mt-1 w-px flex-1 bg-foreground/10" />
              </div>

              {/* Desktop: top dot on the timeline bar */}
              <div
                className="absolute -top-[3px] left-0 hidden h-[7px] w-[7px] rounded-full bg-accent md:block"
                aria-hidden="true"
              />

              <div className="pb-6 md:pt-10">
                <p className="mb-4 text-xs uppercase tracking-[0.2em] text-accent">
                  {period}
                </p>
                <h3 className="mb-3 text-xl font-bold leading-snug text-foreground">
                  {degree}
                </h3>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-5 inline-flex items-center gap-1.5 text-sm text-foreground/50
                             transition-colors duration-200 hover:text-accent"
                >
                  {institution}
                  <ExternalLink size={10} className="shrink-0" aria-hidden="true" />
                </a>
                <p className="text-justify text-base leading-relaxed text-foreground/60">
                  {context}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}

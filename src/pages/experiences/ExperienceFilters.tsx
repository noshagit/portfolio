import { motion, AnimatePresence } from 'framer-motion'
import type { SortDir } from '../../types/experience'

const EASE = [0.22, 1, 0.36, 1] as const

interface Props {
  allTypes:          string[]
  allDomaines:       string[]
  availableTypes:    Set<string>
  availableDomaines: Set<string>
  activeType:        string | null
  activeDomaine:     string | null
  sort:              SortDir
  onTypeChange:      (v: string | null) => void
  onDomaineChange:   (v: string | null) => void
  onSortChange:      (v: SortDir) => void
}

function FilterButton({
  label,
  isActive,
  onClick,
}: {
  label:    string
  isActive: boolean
  onClick:  () => void
}) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.16, ease: EASE }}
      onClick={onClick}
      aria-pressed={isActive}
      className={[
        'border px-3 py-1 font-mono text-xs transition-colors duration-200',
        isActive
          ? 'border-accent bg-accent text-background'
          : 'border-accent/20 text-foreground/60 hover:border-accent/60 hover:text-foreground',
      ].join(' ')}
    >
      {label}
    </motion.button>
  )
}

export default function ExperienceFilters({
  allTypes,
  allDomaines,
  availableTypes,
  availableDomaines,
  activeType,
  activeDomaine,
  sort,
  onTypeChange,
  onDomaineChange,
  onSortChange,
}: Props) {
  return (
    <div className="space-y-5">
      {/* Type filters */}
      <motion.div layout role="group" aria-label="Filtrer par type" className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          <FilterButton
            key="tous-type"
            label="Tous"
            isActive={activeType === null}
            onClick={() => onTypeChange(null)}
          />
          {allTypes
            .filter(t => availableTypes.has(t))
            .map(type => (
              <FilterButton
                key={type}
                label={type}
                isActive={activeType === type}
                onClick={() => onTypeChange(activeType === type ? null : type)}
              />
            ))}
        </AnimatePresence>
      </motion.div>

      {/* Domain filters */}
      <motion.div layout role="group" aria-label="Filtrer par domaine" className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          <FilterButton
            key="tous-domaine"
            label="Tous"
            isActive={activeDomaine === null}
            onClick={() => onDomaineChange(null)}
          />
          {allDomaines
            .filter(d => availableDomaines.has(d))
            .map(domaine => (
              <FilterButton
                key={domaine}
                label={domaine}
                isActive={activeDomaine === domaine}
                onClick={() => onDomaineChange(activeDomaine === domaine ? null : domaine)}
              />
            ))}
        </AnimatePresence>
      </motion.div>

      {/* Sort */}
      <div role="group" aria-label="Trier les expériences" className="flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">
          Trier par
        </span>
        {([
          { dir: 'desc' as SortDir, label: 'Récent → Ancien' },
          { dir: 'asc'  as SortDir, label: 'Ancien → Récent' },
        ] as const).map(({ dir, label }) => (
          <button
            key={dir}
            onClick={() => onSortChange(dir)}
            aria-pressed={sort === dir}
            className={[
              'border px-3 py-1 font-mono text-xs transition-all duration-200',
              sort === dir
                ? 'border-accent bg-accent text-background'
                : 'border-accent/20 text-foreground/60 hover:border-accent/60 hover:text-foreground',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

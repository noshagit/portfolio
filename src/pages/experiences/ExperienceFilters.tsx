import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SortDir } from '../../types/experience'
import { useLang } from '../../hooks/useLang'
import { EASE } from '../../lib/motion'

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

function FilterButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
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
        'flex min-h-[44px] items-center border px-3 py-1 text-xs transition-colors duration-200',
        isActive
          ? 'border-accent bg-accent text-background'
          : 'border-accent/20 text-foreground/60 hover:border-accent/60 hover:text-foreground',
      ].join(' ')}
    >
      {label}
    </motion.button>
  )
}

function ExperienceFilters({
  allTypes, allDomaines, availableTypes, availableDomaines,
  activeType, activeDomaine, sort,
  onTypeChange, onDomaineChange, onSortChange,
}: Props) {
  const { t } = useLang()
  const { filters, types, domains } = t.experiences

  return (
    <div className="space-y-5">
      {/* Type filters */}
      <motion.div layout role="group" aria-label={filters.ariaType} className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          <FilterButton
            key="tous-type"
            label={filters.all}
            isActive={activeType === null}
            onClick={() => onTypeChange(null)}
          />
          {allTypes
            .filter(type => availableTypes.has(type))
            .map(type => (
              <FilterButton
                key={type}
                label={types[type as keyof typeof types] ?? type}
                isActive={activeType === type}
                onClick={() => onTypeChange(activeType === type ? null : type)}
              />
            ))}
        </AnimatePresence>
      </motion.div>

      {/* Domain filters */}
      <motion.div layout role="group" aria-label={filters.ariaDomain} className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          <FilterButton
            key="tous-domaine"
            label={filters.all}
            isActive={activeDomaine === null}
            onClick={() => onDomaineChange(null)}
          />
          {allDomaines
            .filter(dom => availableDomaines.has(dom))
            .map(dom => (
              <FilterButton
                key={dom}
                label={domains[dom as keyof typeof domains] ?? dom}
                isActive={activeDomaine === dom}
                onClick={() => onDomaineChange(activeDomaine === dom ? null : dom)}
              />
            ))}
        </AnimatePresence>
      </motion.div>

      {/* Sort */}
      <div role="group" aria-label={filters.ariaSort} className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-widest text-foreground/60">
          {filters.sortLabel}
        </span>
        {([
          { dir: 'desc' as SortDir, label: filters.sortDesc },
          { dir: 'asc'  as SortDir, label: filters.sortAsc  },
        ]).map(({ dir, label }) => (
          <button
            key={dir}
            onClick={() => onSortChange(dir)}
            aria-pressed={sort === dir}
            className={[
              'flex min-h-[44px] items-center border px-3 py-1 text-xs transition-all duration-200',
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

export default memo(ExperienceFilters)

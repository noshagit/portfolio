import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import type { ComponentType } from 'react'

interface IconProps { size?: number; className?: string }

interface Props {
  Icon:         ComponentType<IconProps>
  displayValue: string
  copyValue:    string
  actionHref:   string
  actionLabel:  string
  ActionIcon:   ComponentType<IconProps>
}

export default function PopoverContactLink({
  Icon,
  displayValue,
  copyValue,
  actionHref,
  actionLabel,
  ActionIcon,
}: Props) {
  const [open,   setOpen]   = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function handleCopy() {
    await navigator.clipboard.writeText(copyValue)
    setCopied(true)
    setTimeout(() => { setCopied(false); setOpen(false) }, 1600)
  }

  return (
    <div ref={ref} className="inline-flex items-start gap-4">
      <Icon
        size={15}
        className={[
          'mt-0.5 shrink-0 transition-colors duration-200',
          open ? 'text-accent' : 'text-foreground/60',
        ].join(' ')}
      />

      <div className="flex flex-col gap-3">
        {/* Trigger */}
        <button
          onClick={() => setOpen(prev => !prev)}
          aria-expanded={open}
          className="group relative text-left text-sm text-foreground/60
                     transition-colors duration-200 hover:text-foreground sm:text-base md:text-lg"
        >
          {displayValue}
          <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent
                           transition-transform duration-300 ease-out group-hover:scale-x-100" />
        </button>

        {/* Options popover */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-center gap-2"
            >
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded border border-accent/25 px-2.5 py-1
                           text-xs text-foreground/60 transition-colors duration-150
                           hover:border-accent/60 hover:text-foreground"
              >
                {copied
                  ? <><Check size={11} className="text-accent" /><span>Copié !</span></>
                  : <><Copy size={11} /><span>Copier</span></>
                }
              </button>

              <a
                href={actionHref}
                className="flex items-center gap-1.5 rounded border border-accent/25 px-2.5 py-1
                           text-xs text-foreground/60 transition-colors duration-150
                           hover:border-accent/60 hover:text-foreground"
              >
                <ActionIcon size={11} />
                <span>{actionLabel}</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

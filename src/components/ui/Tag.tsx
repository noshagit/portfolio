import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  accent?:  boolean
}

export default function Tag({ children, accent = false }: Props) {
  return (
    <span
      className={[
        'border px-2.5 py-1 font-mono text-xs',
        accent
          ? 'border-accent/35 text-accent'
          : 'border-accent/15 text-foreground/60',
      ].join(' ')}
    >
      {children}
    </span>
  )
}

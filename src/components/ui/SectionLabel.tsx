import type { ReactNode } from 'react'

interface Props {
  children:  ReactNode
  as?:       'h1' | 'h2' | 'h3' | 'p'
  className?: string
}

export default function SectionLabel({
  children,
  as: Tag = 'h2',
  className = 'mb-6 text-sm font-semibold',
}: Props) {
  return (
    <Tag className={`uppercase tracking-widest text-accent ${className}`}>
      {children}
    </Tag>
  )
}

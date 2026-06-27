import { useRef, useEffect } from 'react'
import type { ReactNode } from 'react'

interface Props {
  children:   ReactNode
  delay?:     number
  className?: string
}

export default function ScrollReveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.style.opacity    = '1'
        el.style.transform  = 'translateY(0)'
        observer.unobserve(el)
      },
      { rootMargin: '-60px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity:    0,
        transform:  'translateY(28px)',
        transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
      className={className}
    >
      {children}
    </div>
  )
}

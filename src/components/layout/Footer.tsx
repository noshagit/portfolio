import { useRef, useEffect, useState } from 'react'
import { Mail } from 'lucide-react'
import type { View } from '../../types'
import { LinkedInIcon } from '../ui/BrandIcons'
import { useLang } from '../../hooks/useLang'

interface Props {
  onNavigate: (view: View) => void
}

export default function Footer({ onNavigate }: Props) {
  const { t } = useLang()
  const footerRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <footer
      ref={footerRef}
      className={[
        'w-full border-t border-accent/10 transition-opacity duration-300',
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none',
      ].join(' ')}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6">

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-4">
          <button
            onClick={() => onNavigate('contact')}
            className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest text-foreground/60
                       transition-all duration-200 hover:text-accent"
          >
            {t.footer.contact}
          </button>
          <span className="h-3 w-px bg-accent/15" />
          <button
            onClick={() => onNavigate('privacy')}
            className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest text-foreground/60
                       transition-all duration-200 hover:text-accent"
          >
            {t.footer.privacy}
          </button>
          <span className="h-3 w-px bg-accent/15" />
          <button
            onClick={() => onNavigate('legal')}
            className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest text-foreground/60
                       transition-all duration-200 hover:text-accent"
          >
            {t.footer.legal}
          </button>
          <span className="h-3 w-px bg-accent/15" />
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/ilian-ben-hamou-7b6053297/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-foreground/60 transition-all duration-200 hover:text-accent"
            >
              <LinkedInIcon size={13} />
            </a>
            <a
              href="mailto:ilianbenhamou2163@gmail.com"
              aria-label="Email"
              className="text-foreground/60 transition-all duration-200 hover:text-accent"
            >
              <Mail size={13} />
            </a>
          </div>
        </div>

        <div className="hidden text-center text-[11px] leading-relaxed text-foreground/60 sm:block sm:text-right">
          <p>BEN HAMOU Ilian</p>
          <p>ilianbenhamou2163@gmail.com</p>
        </div>

      </div>
    </footer>
  )
}

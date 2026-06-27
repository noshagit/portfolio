import { Mail } from 'lucide-react'
import type { View } from '../../types'
import { LinkedInIcon } from '../ui/BrandIcons'

interface Props {
  onNavigate: (view: View) => void
}

export default function Footer({ onNavigate }: Props) {
  return (
    <footer className="w-full border-t border-accent/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 sm:py-6">

        {/* Left — CONTACT label + social icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('contact')}
            className="text-[10px] font-semibold uppercase tracking-widest text-foreground/40
                       transition-all duration-200 hover:text-accent"
          >
            Contact
          </button>
          <span className="h-3 w-px bg-accent/15" />
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/ilian-ben-hamou-7b6053297/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-foreground/30 transition-all duration-200 hover:text-accent"
            >
              <LinkedInIcon size={13} />
            </a>
            <a
              href="mailto:ilianbenhamou2163@gmail.com"
              aria-label="Email"
              className="text-foreground/30 transition-all duration-200 hover:text-accent"
            >
              <Mail size={13} />
            </a>
          </div>
        </div>

        {/* Right — monospace contact details (cyber feel per spec) */}
        <div className="hidden text-right font-mono text-[11px] leading-relaxed text-foreground/30 sm:block">
          <p>BEN HAMOU Ilian</p>
          <p>+33781583839</p>
          <p>ilianbenhamou2163@gmail.com</p>
        </div>

      </div>
    </footer>
  )
}

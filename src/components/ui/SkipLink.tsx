import { useLang } from '../../hooks/useLang'

/** Visually hidden until focused; lets keyboard/screen-reader users jump past the header nav. */
export default function SkipLink() {
  const { t } = useLang()

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200]
                 focus:rounded-full focus:border focus:border-accent focus:bg-background
                 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground
                 focus:shadow-accent"
    >
      {t.a11y.skipToContent}
    </a>
  )
}

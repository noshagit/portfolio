import { useLang } from '../../hooks/useLang'

export default function LangToggle() {
  const { lang, setLang, loading } = useLang()

  return (
    <button
      onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
      disabled={loading}
      aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
      className="flex h-11 items-center gap-px rounded-full border border-accent/20 px-3 md:h-8
                 text-[11px] font-medium tracking-wider transition-all duration-200
                 hover:border-accent/60 hover:text-accent
                 disabled:opacity-40 disabled:cursor-wait"
    >
      <span className={lang === 'fr' ? 'text-foreground' : 'text-foreground/40'}>FR</span>
      <span className="mx-1 text-foreground/20">|</span>
      <span className={lang === 'en' ? 'text-foreground' : 'text-foreground/40'}>EN</span>
    </button>
  )
}

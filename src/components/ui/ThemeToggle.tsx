import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useLang } from '../../hooks/useLang'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLang()

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? t.header.themeToggle.toLight : t.header.themeToggle.toDark}
      aria-pressed={theme === 'dark'}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/20
                 text-foreground/60 transition-colors duration-200 hover:border-accent/60 hover:text-accent
                 md:h-8 md:w-8"
    >
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}

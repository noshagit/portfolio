import { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'
import type { LanguageContextValue } from '../context/LanguageContext'

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}

import { useEffect } from 'react'
import type { View } from '../types'
import { absoluteViewUrl } from '../lib/routes'
import { useLang } from './useLang'

function setMetaContent(id: string, content: string) {
  document.getElementById(id)?.setAttribute('content', content)
}

function setLinkHref(id: string, href: string) {
  document.getElementById(id)?.setAttribute('href', href)
}

/**
 * Keeps document.title, description, canonical, OpenGraph/Twitter tags, and hreflang
 * alternates in sync with the active view and language. Targets stable ids set on the
 * relevant tags in index.html. Only reaches crawlers that execute JS (Googlebot does);
 * social-share bots only ever see index.html's static FR landing tags.
 *
 * Called unconditionally from AppShell (src/App.tsx) before its `loading` early-return,
 * so the `t.meta` read must stay inside the effect, guarded by `loading` - `t` is an
 * unsafe non-null cast until translations finish loading (see LanguageContext.tsx).
 */
export function useDocumentMeta(view: View) {
  const { t, lang, loading } = useLang()

  useEffect(() => {
    if (loading) return
    const meta = t.meta[view]
    const url = absoluteViewUrl(view, lang)

    document.title = meta.title
    setMetaContent('meta-description', meta.description)
    setLinkHref('canonical-link', url)

    setMetaContent('og-url',         url)
    setMetaContent('og-title',       meta.title)
    setMetaContent('og-description', meta.description)
    setMetaContent('og-locale',      lang === 'fr' ? 'fr_FR' : 'en_GB')

    setMetaContent('twitter-url',         url)
    setMetaContent('twitter-title',       meta.title)
    setMetaContent('twitter-description', meta.description)

    setLinkHref('hreflang-fr',        absoluteViewUrl(view, 'fr'))
    setLinkHref('hreflang-en',        absoluteViewUrl(view, 'en'))
    setLinkHref('hreflang-x-default', absoluteViewUrl(view, 'fr'))
  }, [view, lang, loading, t])
}

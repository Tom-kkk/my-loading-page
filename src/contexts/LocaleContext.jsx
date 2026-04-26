import { createContext, useContext, useEffect, useState } from 'react'
import { BUNDLES } from '@/locales/buildSite'

const STORAGE_KEY = 'my-loading-page-locale'

const LocaleContext = createContext({
  locale: 'zh',
  setLocale: () => {},
  site: BUNDLES.zh,
})

function readInitialLocale() {
  if (typeof window === 'undefined') return 'zh'
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'zh') return stored
  } catch {
    /* ignore */
  }
  const nav = navigator.language || ''
  if (nav.toLowerCase().startsWith('en')) return 'en'
  return 'zh'
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState('zh')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setLocaleState(readInitialLocale())
    setReady(true)
  }, [])

  const site = BUNDLES[locale] ?? BUNDLES.zh

  useEffect(() => {
    if (!ready) return
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* ignore */
    }
  }, [locale, ready])

  const setLocale = (next) => {
    if (next === 'en' || next === 'zh') setLocaleState(next)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, site }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

export function useSiteContent() {
  const { site } = useLocale()
  return site
}

import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useData } from './DataContext'
import { useLocalStorage } from '../lib/hooks'
import { t as translate } from '../lib/i18n'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const { settings, updateSettings } = useData()
  const [lang, setLangState] = useLocalStorage('ghsnb_language', settings?.language || 'en')

  useEffect(() => {
    document.documentElement.lang = lang === 'ur' ? 'ur' : 'en'
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr'
  }, [lang])

  const setLang = useCallback(
    (next) => {
      const value = next === 'ur' ? 'ur' : 'en'
      setLangState(value)
      updateSettings({ language: value })
    },
    [setLangState, updateSettings],
  )

  const toggleLang = useCallback(() => setLang(lang === 'ur' ? 'en' : 'ur'), [lang, setLang])
  const t = useCallback((key) => translate(key, lang), [lang])

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t, isUrdu: lang === 'ur', dir: lang === 'ur' ? 'rtl' : 'ltr' }),
    [lang, setLang, toggleLang, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}

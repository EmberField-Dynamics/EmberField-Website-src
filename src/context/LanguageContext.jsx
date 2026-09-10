import { createContext, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { translations, languages } from '../i18n/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const { lang } = useParams()
  const navigate = useNavigate()
  const currentLang = languages[lang] ? lang : 'en'
  const t = translations[currentLang] || translations.en

  const changeLanguage = (newLang) => {
    localStorage.setItem('ed-lang', newLang)
    const currentPath = window.location.pathname
    const pathWithoutLang = currentPath.replace(/^\/(en|fr|de|es|it)/, '') || '/'
    navigate(`/${newLang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`)
  }

  return (
    <LanguageContext.Provider value={{ lang: currentLang, t, changeLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

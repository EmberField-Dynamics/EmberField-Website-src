import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function AuthCallback() {
  const { user, loading } = useAuth()
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const handled = useRef(false)

  useEffect(() => {
    if (loading || !user || handled.current) return
    handled.current = true
    if (user.role === 'admin' || user.role === 'staff') navigate(`/${lang}/admin`, { replace: true })
    else if (user.passwordSet === false) navigate(`/${lang}/setup`, { replace: true })
    else navigate(`/${lang}/dashboard`, { replace: true })
  }, [user, loading, lang, navigate])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Signing you in...</div>
    </div>
  )
}
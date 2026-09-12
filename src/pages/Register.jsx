import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { lang, t } = useLanguage()
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const p = (path) => `/${lang}${path}`

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError(t.register.mismatch)
      return
    }
    setLoading(true)
    const result = await signUp(form.name, form.email, form.password)
    setLoading(false)
    if (result.success) {
      navigate(p('/login'))
    } else {
      setError(result.error)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)', marginTop: '64px' }} className="register-split">
      <div style={{
        flex: 1, background: 'linear-gradient(135deg, #030712 0%, #064E3B 50%, #030712 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: '60px', position: 'relative', overflow: 'hidden',
      }} className="register-left">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(16,185,129,0.08) 0%, transparent 60%)',
        }}/>
        <img src="/white-color-logo.png" alt="Logo" style={{ width: '80px', height: '80px', marginBottom: '32px', position: 'relative', zIndex: 1 }}/>
        <p style={{
          fontSize: '28px', fontWeight: 300, fontStyle: 'italic',
          color: '#F8FAFC', lineHeight: 1.5, textAlign: 'center',
          maxWidth: '380px', position: 'relative', zIndex: 1,
        }}>
          {t.register.tagline}
        </p>
      </div>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px', background: 'var(--bg)',
      }} className="register-right">
        <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeInUp 0.6s ease-out' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>{t.register.title}</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '36px' }}>{t.register.subtitle}</p>

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 0,
              background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)',
              color: '#DC2626', fontSize: '13px', marginBottom: '20px',
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>{t.register.name}</label>
              <input
                type="text" required
                className="field"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>{t.register.email}</label>
              <input
                type="email" required
                className="field"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>{t.register.password}</label>
              <input
                type="password" required
                className="field"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>{t.register.confirm}</label>
              <input
                type="password" required
                className="field"
                value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})}
              />
            </div>

            <div style={{ marginBottom: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" required style={{ marginTop: '3px', accentColor: 'var(--primary)' }}/>
                <span>{t.register.agree} <a href="#" style={{ color: 'var(--primary)' }}>{t.register.terms}</a> {t.register.and} <a href="#" style={{ color: 'var(--primary)' }}>{t.register.privacy}</a></span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary btn-block" style={{ marginBottom: '24px', opacity: loading ? 0.7 : 1 }}>
              {loading ? t.register.signingUp : t.register.btn}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
            {t.register.hasAccount} <Link to={p('/login')} style={{ color: 'var(--primary)', fontWeight: 600 }}>{t.register.signIn}</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .register-split { flex-direction: column !important; }
          .register-left { min-height: 200px; padding: 40px !important; }
          .register-right { padding: 40px 24px !important; }
        }
      `}</style>
    </div>
  )
}

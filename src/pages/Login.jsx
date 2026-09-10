import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { lang, t } = useLanguage()
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const p = (path) => `/${lang}${path}`

  const handleGoogle = async () => {
    setError('')
    const result = await signInWithGoogle()
    if (!result.success) setError(result.error)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn(form.email, form.password)
    setLoading(false)
    if (result.success) {
      navigate(result.role === 'admin' ? p('/admin') : p('/member'))
    } else {
      setError(result.error)
    }
  }

  const inputStyle = {
    width: '100%', height: '52px', padding: '0 18px', borderRadius: '12px',
    border: '1px solid var(--border)', background: 'var(--input-bg)',
    color: 'var(--text)', fontSize: '15px', outline: 'none',
    transition: 'all 0.2s',
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)', marginTop: '64px' }} className="login-split">
      <div style={{
        flex: 1, background: 'linear-gradient(135deg, #030712 0%, #064E3B 50%, #030712 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: '60px', position: 'relative', overflow: 'hidden',
      }} className="login-left">
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
          Building modern infrastructure solutions.
        </p>
      </div>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px', background: 'var(--bg)',
      }} className="login-right">
        <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeInUp 0.6s ease-out' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>{t.login.title}</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '36px' }}>{t.login.subtitle}</p>

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px',
              background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)',
              color: '#DC2626', fontSize: '13px', marginBottom: '20px',
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>{t.login.email}</label>
              <input
                type="email" required
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{t.login.password}</label>
                <a href="#" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 500 }}>{t.login.forgot}</a>
              </div>
              <input
                type="password" required
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', height: '52px', borderRadius: '12px', border: 'none',
              background: 'var(--primary)', color: '#000', fontSize: '15px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              transition: 'all 0.25s', marginBottom: '24px',
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 0 30px rgba(16,185,129,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
            >{loading ? 'Signing in...' : t.login.btn}</button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}/>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.login.or}</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}/>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <button type="button" onClick={handleGoogle} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              width: '100%', height: '52px', borderRadius: '12px',
              border: '1px solid var(--border)', background: 'var(--input-bg)',
              color: 'var(--text)', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--hover-bg)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--input-bg)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {t.login.googleBtn}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
            {t.login.noAccount} <Link to={p('/register')} style={{ color: 'var(--primary)', fontWeight: 600 }}>{t.login.signUp}</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-split { flex-direction: column !important; }
          .login-left { min-height: 200px; padding: 40px !important; }
          .login-right { padding: 40px 24px !important; }
        }
      `}</style>
    </div>
  )
}

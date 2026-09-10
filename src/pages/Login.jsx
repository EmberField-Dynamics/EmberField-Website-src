import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { lang, t } = useLanguage()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const p = (path) => `/${lang}${path}`

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const result = login(form.email, form.password)
    setLoading(false)
    if (result.success) {
      navigate(p('/admin'))
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

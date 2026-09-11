import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

export default function SetupAccount() {
  const { lang, t } = useLanguage()
  const { user, completeGoogleSetup } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const p = (path) => `/${lang}${path}`

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError(t.setup.mismatch); return }
    if (password.length < 6) { setError(t.setup.tooShort); return }
    setLoading(true)
    const result = await completeGoogleSetup(password)
    setLoading(false)
    if (result.success) {
      navigate(p('/dashboard'), { replace: true })
    } else {
      setError(result.error)
    }
  }

  const inputStyle = {
    width: '100%', height: '52px', padding: '0 18px', borderRadius: 0,
    border: '1px solid var(--border)', background: 'var(--input-bg)',
    color: 'var(--text)', fontSize: '15px', outline: 'none',
    transition: 'all 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
      <div style={{ width: '100%', maxWidth: '440px', animation: 'fadeInUp 0.6s ease-out' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%', marginBottom: '24px',
          overflow: 'hidden', border: '2px solid var(--border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {user?.avatar ? (
            <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          ) : (
            <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>
              {(user?.name || '?').charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>{t.setup.title}</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '36px' }}>{t.setup.subtitle}</p>

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 0,
            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)',
            color: '#DC2626', fontSize: '13px', marginBottom: '20px',
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>{t.setup.name}</label>
            <input type="text" value={user?.name || ''} disabled style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }}/>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>{t.setup.email}</label>
            <input type="email" value={user?.email || ''} disabled style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }}/>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>{t.setup.password}</label>
            <input
              type="password" required autoFocus
              value={password} onChange={e => setPassword(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>{t.setup.confirm}</label>
            <input
              type="password" required
              value={confirm} onChange={e => setConfirm(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', height: '52px', borderRadius: 0, border: 'none',
            background: 'var(--primary)', color: '#000', fontSize: '15px', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            transition: 'all 0.25s',
          }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = 'none' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
          >{loading ? t.setup.saving : t.setup.btn}</button>
        </form>
      </div>
    </div>
  )
}
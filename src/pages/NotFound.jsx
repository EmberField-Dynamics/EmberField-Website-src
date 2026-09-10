import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function NotFound() {
  const { lang, t } = useLanguage()

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '80px 24px', textAlign: 'center',
    }}>
      <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
        <div style={{
          fontSize: '120px', fontWeight: 900, lineHeight: 1,
          background: 'linear-gradient(135deg, var(--text) 0%, var(--primary) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          marginBottom: '16px',
        }}>404</div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>{t.notFound.title}</h1>
        <p style={{ fontSize: '16px', color: 'var(--muted)', marginBottom: '36px', maxWidth: '400px' }}>
          {t.notFound.desc}
        </p>
        <Link to={`/${lang}/`} style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '14px 32px', borderRadius: '12px', border: 'none',
          background: 'var(--primary)', color: '#000',
          fontSize: '15px', fontWeight: 700, transition: 'all 0.25s',
          boxShadow: '0 0 20px rgba(16,185,129,0.2)',
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 40px rgba(16,185,129,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(16,185,129,0.2)'; e.currentTarget.style.transform = 'none' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          {t.notFound.home}
        </Link>
      </div>
    </div>
  )
}

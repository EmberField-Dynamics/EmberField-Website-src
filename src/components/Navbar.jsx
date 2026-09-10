import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import LanguageSelector from './LanguageSelector'

export default function Navbar() {
  const { lang, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const p = (path) => `/${lang}${path}`
  const isDark = theme === 'dark'
  const logoSrc = isDark ? '/white-color-logo.png' : '/gray-color-logo.png'

  const navLinks = [
    ['/services', t.nav.services],
    ['/developers', t.nav.developers],
    ['/pricing', t.nav.pricing],
    ['/contact', t.nav.contact],
    ...(user ? [['/admin', 'Admin']] : []),
  ]

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000, padding: '0 40px', height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: isDark
          ? (scrolled ? 'rgba(3,7,18,0.92)' : 'rgba(3,7,18,0.6)')
          : (scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)'),
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        transition: 'background 0.3s, box-shadow 0.3s',
        boxShadow: scrolled ? (isDark ? '0 4px 30px rgba(0,0,0,0.3)' : '0 4px 30px rgba(0,0,0,0.06)') : 'none',
      }}>
        <Link to={p('/')} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img
            src={logoSrc}
            alt="Emberfield Dynamics"
            style={{ height: '38px', objectFit: 'contain' }}
          />
          <span style={{
            fontSize: '17px', fontWeight: 700, letterSpacing: '-0.3px',
            color: isDark ? '#FFFFFF' : '#1F2937',
          }}>
            Emberfield Dynamics
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="nav-center-links">
          {navLinks.map(([path, label]) => {
            const active = location.pathname === `/${lang}${path}`
            return (
              <Link key={path} to={p(path)} style={{
                color: active ? (isDark ? '#FFFFFF' : '#0F172A') : (isDark ? '#94A3B8' : '#64748B'),
                fontSize: '14px', fontWeight: 500, transition: 'color 0.2s',
                letterSpacing: '0.2px',
              }}
                onMouseEnter={e => e.target.style.color = isDark ? '#FFFFFF' : '#0F172A'}
                onMouseLeave={e => e.target.style.color = active ? (isDark ? '#FFFFFF' : '#0F172A') : (isDark ? '#94A3B8' : '#64748B')}
              >{label}</Link>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="nav-right-actions">
          {!user && (
            <Link to={p('/register')} style={{
              padding: '9px 22px', borderRadius: 0, border: 'none',
              background: '#10B981', color: '#000', fontSize: '13px',
              fontWeight: 700, transition: 'all 0.2s', letterSpacing: '0.2px',
            }}
              onMouseEnter={e => { e.target.style.background = '#059669' }}
              onMouseLeave={e => { e.target.style.background = '#10B981' }}
            >{t.nav.signUp}</Link>
          )}

          {!user && (
            <Link to={p('/login')} style={{
              padding: '9px 18px', borderRadius: 0, border: 'none',
              background: 'transparent', color: isDark ? '#94A3B8' : '#64748B',
              fontSize: '13px', fontWeight: 600, transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = isDark ? '#FFFFFF' : '#0F172A'}
              onMouseLeave={e => e.target.style.color = isDark ? '#94A3B8' : '#64748B'}
            >{t.nav.signIn}</Link>
          )}

          {user && (
            <>
              <Link to={p('/admin')} style={{
                padding: '8px 16px', borderRadius: 0,
                border: `1px solid ${isDark ? 'rgba(16,185,129,0.25)' : 'rgba(16,185,129,0.25)'}`,
                background: 'rgba(16,185,129,0.1)', color: '#10B981', fontSize: '13px',
                fontWeight: 600, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 800, color: '#000',
                }}>{user.name.charAt(0).toUpperCase()}</div>
                {user.name}
              </Link>
              <button onClick={() => { logout(); window.location.href = `/${lang}/` }} style={{
                padding: '9px 16px', borderRadius: 0, border: 'none',
                background: 'transparent', color: isDark ? '#94A3B8' : '#64748B',
                fontSize: '13px', fontWeight: 600, transition: 'color 0.2s', cursor: 'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.color = isDark ? '#FFFFFF' : '#0F172A'}
                onMouseLeave={e => e.currentTarget.style.color = isDark ? '#94A3B8' : '#64748B'}
              >Logout</button>
            </>
          )}

          <LanguageSelector />

          <button onClick={toggleTheme} style={{
            width: '36px', height: '36px', borderRadius: 0,
            border: 'none', background: 'transparent',
            color: isDark ? '#94A3B8' : '#64748B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.2s', cursor: 'pointer',
          }}
            onMouseEnter={e => e.currentTarget.style.color = isDark ? '#FFFFFF' : '#0F172A'}
            onMouseLeave={e => e.currentTarget.style.color = isDark ? '#94A3B8' : '#64748B'}
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none', width: '36px', height: '36px', borderRadius: 0,
              border: 'none', background: 'transparent',
              color: isDark ? '#94A3B8' : '#64748B',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{
          position: 'fixed', top: '72px', left: 0, right: 0, bottom: 0,
          background: isDark ? 'rgba(3,7,18,0.95)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          zIndex: 999, padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px',
          animation: 'fadeIn 0.2s ease',
        }}>
          {navLinks.map(([path, label]) => (
            <Link key={path} to={p(path)} style={{
              padding: '14px 16px', fontSize: '16px', fontWeight: 500, borderRadius: 0,
              color: isDark ? '#FFFFFF' : '#0F172A',
              background: location.pathname === `/${lang}${path}` ? 'rgba(16,185,129,0.1)' : 'transparent',
              border: 'none', transition: 'background 0.15s',
            }}>{label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-center-links { display: none !important; }
          .nav-right-actions .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}

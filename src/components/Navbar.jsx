import { useState, useEffect, useRef } from 'react'
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
  const [servicesOpen, setServicesOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const servicesRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setServicesOpen(false)
    setUserOpen(false)
  }, [location])

  useEffect(() => {
    const onDocClick = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false)
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserOpen(false)
      }
    }
    if (servicesOpen || userOpen) document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [servicesOpen, userOpen])

  const p = (path) => `/${lang}${path}`
  const isDark = theme === 'dark'
  const logoSrc = isDark ? '/white-color-logo.png' : '/gray-color-logo.png'

  const navLinks = [
    ['/developers', t.nav.developers],
    ['/docs', t.nav.docs],
    ['/forums', t.nav.forums],
    ['/contact', t.nav.contact],
  ]

  const serviceOptions = t.nav.serviceOptions || []

  const serviceActive = location.pathname === p('/services')

  const linkBase = {
    fontSize: '14px', fontWeight: 500, transition: 'color 0.2s',
    letterSpacing: '0.2px', padding: '6px 0',
  }

  const linkColor = (active) => active ? (isDark ? '#FFFFFF' : '#0F172A') : (isDark ? '#94A3B8' : '#64748B')

  const chevronSvg = (open) => (
    <svg
      width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="square"
      style={{
        transition: 'transform 0.2s',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        opacity: 0.6,
      }}
    >
      <path d="m3 4.5 3 3 3-3"></path>
    </svg>
  )

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60, height: '64px',
        display: 'flex', alignItems: 'center', padding: '0 32px',
        justifyContent: 'space-between',
        background: isDark
          ? (scrolled ? 'rgba(3,7,18,0.92)' : 'rgba(3,7,18,0.6)')
          : (scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)'),
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        transition: 'background 0.3s, box-shadow 0.3s',
        boxShadow: scrolled ? (isDark ? '0 4px 30px rgba(0,0,0,0.3)' : '0 4px 30px rgba(0,0,0,0.06)') : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px', minWidth: 0 }}>
          <Link to={p('/')} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flexShrink: 0 }}>
            <img
              src={logoSrc}
              alt="Emberfield Dynamics"
              style={{ height: '36px', objectFit: 'contain' }}
            />
            <span style={{
              fontSize: '16px', fontWeight: 700, letterSpacing: '-0.3px',
              color: isDark ? '#FFFFFF' : '#1F2937', whiteSpace: 'nowrap',
            }}>
              Emberfield Dynamics
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="nav-links">
            <div
              ref={servicesRef}
              style={{ position: 'relative' }}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setServicesOpen(!servicesOpen)
                }}
                style={{
                  ...linkBase,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  color: serviceActive ? (isDark ? '#FFFFFF' : '#0F172A') : (isDark ? '#94A3B8' : '#64748B'),
                  borderBottom: serviceActive ? `2px solid ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.15)'}` : '2px solid transparent',
                }}
                onMouseEnter={e => e.currentTarget.style.color = isDark ? '#FFFFFF' : '#0F172A'}
                onMouseLeave={e => e.currentTarget.style.color = serviceActive ? (isDark ? '#FFFFFF' : '#0F172A') : (isDark ? '#94A3B8' : '#64748B')}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                <span>{t.nav.services}</span>
                {chevronSvg(servicesOpen)}
              </button>

              {servicesOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', left: 0, zIndex: 70,
                  minWidth: '300px', padding: '8px',
                  background: isDark ? 'rgba(3,7,18,0.98)' : 'rgba(255,255,255,0.98)',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: 0,
                  boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.5)' : '0 12px 40px rgba(0,0,0,0.1)',
                  animation: 'fadeIn 0.15s ease',
                }}>
                  {serviceOptions.map((opt, i) => (
                    <Link
                      key={i}
                      to={opt.id ? `${p('/services')}#${opt.id}` : p('/services')}
                      onClick={() => setServicesOpen(false)}
                      style={{
                        display: 'block', padding: '10px 12px', borderRadius: 0,
                        textDecoration: 'none', transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{
                        fontSize: '14px', fontWeight: 600, color: isDark ? '#FFFFFF' : '#0F172A',
                      }}>{opt.title}</div>
                      <div style={{
                        fontSize: '12.5px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '3px',
                        lineHeight: 1.4,
                      }}>{opt.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.map(([path, label]) => {
              const active = location.pathname === `/${lang}${path}`
              return (
                <Link key={path} to={p(path)} style={{
                  ...linkBase,
                  color: linkColor(active),
                  borderBottom: active ? `2px solid ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.15)'}` : '2px solid transparent',
                }}
                  onMouseEnter={e => e.target.style.color = isDark ? '#FFFFFF' : '#0F172A'}
                  onMouseLeave={e => e.target.style.color = linkColor(active)}
                >{label}</Link>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="nav-right-actions">
          {!user && (
            <Link to={p('/register')} style={{
              padding: '9px 18px', borderRadius: 0, border: 'none',
              background: '#10B981', color: '#000', fontSize: '13px',
              fontWeight: 700, transition: 'all 0.2s', letterSpacing: '0.2px',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#059669' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#10B981' }}
            >{t.nav.signUp}</Link>
          )}

          {!user && (
            <Link to={p('/login')} style={{
              padding: '9px 16px', borderRadius: 0, border: 'none',
              background: 'transparent', color: isDark ? '#94A3B8' : '#64748B',
              fontSize: '13px', fontWeight: 600, transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = isDark ? '#FFFFFF' : '#0F172A'}
              onMouseLeave={e => e.target.style.color = isDark ? '#94A3B8' : '#64748B'}
            >{t.nav.signIn}</Link>
          )}

          {user && (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setUserOpen(!userOpen) }}
                aria-expanded={userOpen}
                aria-haspopup="true"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px',
                  border: `1px solid ${userOpen ? 'rgba(16,185,129,0.5)' : 'rgba(16,185,129,0.25)'}`,
                  background: userOpen ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
                  color: '#10B981', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  transition: 'border-color 0.2s, background 0.2s', borderRadius: 0,
                }}
              >
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#000' }}>{(user.name || user.email || '?').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                {user.name}
                {chevronSvg(userOpen)}
              </button>

              {userOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 10px)', zIndex: 70,
                  minWidth: '220px', padding: '8px',
                  background: isDark ? 'rgba(3,7,18,0.98)' : 'rgba(255,255,255,0.98)',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: 0, boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.5)' : '0 12px 40px rgba(0,0,0,0.1)',
                  animation: 'fadeIn 0.15s ease',
                }}>
                  <div style={{
                    padding: '10px 12px', marginBottom: '6px',
                    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>{user.name}</div>
                    <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '2px', fontFamily: 'monospace' }}>{user.role.toUpperCase()}</div>
                  </div>

                  {[
                    { to: '/dashboard', label: 'Dashboard' },
                    { to: '/settings/my-profile', label: 'Profile Settings' },
                    { to: '/support', label: 'Support' },
                    ...(user.role === 'staff' || user.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
                  ].map(item => (
                    <Link key={item.to} to={p(item.to)} onClick={() => setUserOpen(false)} style={{
                      display: 'block', padding: '10px 12px', fontSize: '13px', fontWeight: 600,
                      color: isDark ? '#FFFFFF' : '#0F172A', textDecoration: 'none',
                      transition: 'background 0.15s', borderRadius: 0, textTransform: 'none',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >{item.label}</Link>
                  ))}

                  <button onClick={() => { setUserOpen(false); logout(); window.location.href = `/${lang}/` }} style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px',
                    fontSize: '13px', fontWeight: 600, color: '#DC2626', background: 'transparent',
                    border: 'none', cursor: 'pointer', borderRadius: 0, transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >Logout</button>
                </div>
              )}
            </div>
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
          position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0,
          background: isDark ? 'rgba(3,7,18,0.95)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          zIndex: 55, padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px',
          animation: 'fadeIn 0.2s ease',
        }}>
          {serviceOptions.map((opt, i) => (
            <Link key={i} to={opt.id ? `${p('/services')}#${opt.id}` : p('/services')} style={{
              padding: '12px 16px', fontSize: '16px', fontWeight: 500, borderRadius: 0,
              color: isDark ? '#FFFFFF' : '#0F172A',
              background: 'transparent',
              border: 'none', transition: 'background 0.15s',
            }}>
              {opt.title}
              <span style={{
                display: 'block', fontSize: '12.5px', fontWeight: 400,
                color: isDark ? '#94A3B8' : '#64748B', marginTop: '3px',
              }}>{opt.desc}</span>
            </Link>
          ))}
          {navLinks.map(([path, label]) => (
            <Link key={path} to={p(path)} style={{
              padding: '14px 16px', fontSize: '16px', fontWeight: 500, borderRadius: 0,
              color: isDark ? '#FFFFFF' : '#0F172A',
              background: location.pathname === `/${lang}${path}` ? 'rgba(16,185,129,0.1)' : 'transparent',
              border: 'none', transition: 'background 0.15s',
            }}>{label}</Link>
          ))}
          {user && (
            <>
              <div style={{ padding: '14px 16px 4px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{user.name} — {user.role}</div>
              <Link to={p('/dashboard')} style={{ padding: '14px 16px', fontSize: '16px', fontWeight: 500, borderRadius: 0, color: isDark ? '#FFFFFF' : '#0F172A', background: 'transparent', border: 'none', transition: 'background 0.15s' }}>Dashboard</Link>
              <Link to={p('/settings/my-profile')} style={{ padding: '14px 16px', fontSize: '16px', fontWeight: 500, borderRadius: 0, color: isDark ? '#FFFFFF' : '#0F172A', background: 'transparent', border: 'none', transition: 'background 0.15s' }}>Profile Settings</Link>
              <Link to={p('/support')} style={{ padding: '14px 16px', fontSize: '16px', fontWeight: 500, borderRadius: 0, color: isDark ? '#FFFFFF' : '#0F172A', background: 'transparent', border: 'none', transition: 'background 0.15s' }}>Support</Link>
              {(user.role === 'staff' || user.role === 'admin') && (
                <Link to={p('/admin')} style={{ padding: '14px 16px', fontSize: '16px', fontWeight: 500, borderRadius: 0, color: isDark ? '#FFFFFF' : '#0F172A', background: 'transparent', border: 'none', transition: 'background 0.15s' }}>Admin</Link>
              )}
              <button onClick={() => { setMobileOpen(false); logout(); window.location.href = `/${lang}/` }} style={{
                padding: '14px 16px', fontSize: '16px', fontWeight: 500, borderRadius: 0,
                color: '#DC2626', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer',
              }}>Logout</button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .nav-links { display: none !important; }
          .nav-right-actions .mobile-menu-btn { display: flex !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}
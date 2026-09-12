import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import LanguageSelector from './LanguageSelector'

export default function Navbar() {
  const { lang, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const { count, setOpen } = useCart()
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
  const logoSrc = theme === 'dark' ? '/white-color-logo.png' : '/gray-color-logo.png'

  const navLinks = [
    ['/developers', t.nav.developers],
    ['/docs', t.nav.docs],
    ['/forums', t.nav.forums],
    ['/blog', t.nav.blog],
    ['/support/new', t.nav.contact],
  ]

  const serviceOptions = t.nav.serviceOptions || []

  const userMenu = [
    { to: '/dashboard', label: t.nav.dashboard },
    { to: '/settings/my-profile', label: t.nav.profileSettings },
    { to: '/support', label: t.nav.support },
    ...(user && (user.role === 'staff' || user.role === 'admin') ? [{ to: '/admin', label: t.nav.admin }] : []),
  ]

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
        background: scrolled ? 'var(--glass-bg-solid)' : 'var(--glass-bg)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        transition: 'background 0.3s, box-shadow 0.3s',
        boxShadow: scrolled ? 'var(--shadow)' : 'none',
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
              color: 'var(--text)', whiteSpace: 'nowrap',
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
                  setServicesOpen(true)
                }}
                className={`nav-link ${location.pathname === p('/services') ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', outline: 'none' }}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                <span>{t.nav.services}</span>
                {chevronSvg(servicesOpen)}
              </button>

              {servicesOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, zIndex: 70,
                  minWidth: '300px', paddingTop: '10px',
                }}>
                  <div className="dropdown-panel" style={{ padding: '8px', borderRadius: 0 }}>
                    {serviceOptions.map((opt, i) => (
                      <Link
                        key={i}
                        className="dropdown-item"
                        to={opt.id ? `${p('/services')}/${opt.id}` : p('/services')}
                        onClick={() => setServicesOpen(false)}
                      >
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{opt.title}</div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.4, fontWeight: 400 }}>
                          {opt.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navLinks.map(([path, label]) => {
              const active = location.pathname === `/${lang}${path}`
              return (
                <Link key={path} to={p(path)} className={`nav-link ${active ? 'active' : ''}`}>
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="nav-right-actions">
          <button
            onClick={() => setOpen(true)}
            className="icon-btn"
            style={{ position: 'relative' }}
            aria-label={t.cart.title}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1 h4 l2.68 13.39 a2 2 0 0 0 2 1.61 h9.72 a2 2 0 0 0 2-1.61 L23 6 H6" />
            </svg>
            {count > 0 && (
              <span style={{
                position: 'absolute', top: '0', right: '0', minWidth: '16px', height: '16px',
                padding: '0 4px', borderRadius: '8px', background: '#10B981', color: '#000',
                fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{count}</span>
            )}
          </button>

          {!user && (
            <Link
              to={p('/register')}
              className="btn-primary btn-slim"
              style={{ background: 'var(--primary)', color: '#000', height: '38px', padding: '0 18px', fontSize: '13px' }}
            >{t.nav.signUp}</Link>
          )}

          {!user && (
            <Link to={p('/login')} className="nav-link" style={{ padding: '6px 12px' }}>{t.nav.signIn}</Link>
          )}

          {user && (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setUserOpen(!userOpen) }}
                aria-expanded={userOpen}
                aria-haspopup="true"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px',
                  border: `1px solid ${userOpen ? 'rgba(16,185,129,0.5)' : 'var(--badge-border)'}`,
                  background: 'var(--badge-bg)',
                  color: 'var(--primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  transition: 'border-color 0.2s, background 0.2s', borderRadius: 0,
                }}
              >
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
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
                  position: 'absolute', right: 0, top: '100%', zIndex: 70,
                  minWidth: '220px', paddingTop: '10px',
                }}>
                  <div className="dropdown-panel" style={{ padding: '8px', borderRadius: 0 }}>
                    <div style={{
                      padding: '10px 12px', marginBottom: '6px',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>{user.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'monospace' }}>{user.role.toUpperCase()}</div>
                    </div>

                    {userMenu.map(item => (
                      <Link key={item.to} to={p(item.to)} className="dropdown-item" onClick={() => setUserOpen(false)}>
                        {item.label}
                      </Link>
                    ))}

                    <button
                      className="dropdown-item"
                      onClick={() => { setUserOpen(false); logout(); window.location.href = `/${lang}/` }}
                      style={{ color: '#DC2626' }}
                    >{t.nav.logout}</button>
                  </div>
                </div>
              )}
            </div>
          )}

          <LanguageSelector />

          <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle theme">
            {theme === 'dark' ? (
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
            className="mobile-menu-btn icon-btn"
            style={{ display: 'none' }}
            aria-label="Toggle menu"
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
          background: 'var(--glass-bg-solid)',
          backdropFilter: 'blur(20px)',
          zIndex: 55, padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px',
          animation: 'fadeIn 0.2s ease',
        }}>
          {serviceOptions.map((opt, i) => (
            <Link key={i}
              to={opt.id ? `${p('/services')}/${opt.id}` : p('/services')}
              style={{ padding: '12px 16px', fontSize: '16px', fontWeight: 500, borderRadius: 0, color: 'var(--text)', background: 'transparent', border: 'none', transition: 'background 0.15s' }}
            >
              {opt.title}
              <span style={{ display: 'block', fontSize: '12.5px', fontWeight: 400, color: 'var(--text-secondary)', marginTop: '3px' }}>{opt.desc}</span>
            </Link>
          ))}
          {navLinks.map(([path, label]) => (
            <Link key={path} to={p(path)} style={{
              padding: '14px 16px', fontSize: '16px', fontWeight: 500, borderRadius: 0,
              color: 'var(--text)',
              background: location.pathname === `/${lang}${path}` ? 'var(--hover-bg)' : 'transparent',
              border: 'none', transition: 'background 0.15s',
            }}>{label}</Link>
          ))}
          {user && (
            <>
              <div style={{ padding: '14px 16px 4px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{user.name} — {user.role}</div>
              {userMenu.map(item => (
                <Link key={item.to} to={p(item.to)} style={{ padding: '14px 16px', fontSize: '16px', fontWeight: 500, borderRadius: 0, color: 'var(--text)', background: 'transparent', border: 'none', transition: 'background 0.15s' }}>{item.label}</Link>
              ))}
              <button onClick={() => { setMobileOpen(false); logout(); window.location.href = `/${lang}/` }} style={{
                padding: '14px 16px', fontSize: '16px', fontWeight: 500, borderRadius: 0,
                color: '#DC2626', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer',
              }}>{t.nav.logout}</button>
            </>
          )}
        </div>
      )}

      <style>{`
        nav .nav-link { outline: none !important; }
        nav .nav-link:focus-visible { outline: none !important; }
        nav .dropdown-trigger, nav .mobile-menu-btn { outline: none !important; }
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
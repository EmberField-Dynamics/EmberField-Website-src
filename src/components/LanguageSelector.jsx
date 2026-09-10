import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

export default function LanguageSelector() {
  const { lang, changeLanguage, languages } = useLanguage()
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const isDark = theme === 'dark'

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = languages[lang]

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 12px', borderRadius: 0,
          border: 'none', background: 'transparent',
          color: isDark ? '#94A3B8' : '#64748B',
          fontSize: '13px', fontWeight: 600,
          cursor: 'pointer', transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = isDark ? '#FFFFFF' : '#0F172A'}
        onMouseLeave={e => e.currentTarget.style.color = isDark ? '#94A3B8' : '#64748B'}
      >
        <span style={{ fontSize: '13px', letterSpacing: '0.5px' }}>{lang.toUpperCase()}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: isDark ? '#111827' : '#FFFFFF',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          borderRadius: 0, padding: '6px', minWidth: '160px',
          boxShadow: isDark ? '0 4px 30px rgba(0,0,0,0.4)' : '0 4px 30px rgba(0,0,0,0.06)',
          zIndex: 9999, animation: 'slideDown 0.15s ease',
        }}>
          {Object.values(languages).map(l => (
            <button
              key={l.code}
              onClick={() => { changeLanguage(l.code); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '10px 14px', borderRadius: 0,
                border: 'none',
                background: l.code === lang ? 'rgba(16,185,129,0.1)' : 'transparent',
                color: isDark ? '#FFFFFF' : '#0F172A',
                fontSize: '14px', fontWeight: l.code === lang ? 600 : 400,
                cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left',
              }}
              onMouseEnter={e => { if (l.code !== lang) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
              onMouseLeave={e => { if (l.code !== lang) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: '16px' }}>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

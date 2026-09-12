import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function LanguageSelector() {
  const { lang, changeLanguage, languages } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        className="dropdown-trigger"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span style={{ fontSize: '13px', letterSpacing: '0.5px' }}>{lang.toUpperCase()}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div className="dropdown-panel" style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, padding: '6px', minWidth: '160px', borderRadius: 0, zIndex: 9999 }}>
          {Object.values(languages).map(l => (
            <button
              key={l.code}
              onClick={() => { changeLanguage(l.code); setOpen(false) }}
              className="dropdown-item"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                background: l.code === lang ? 'var(--hover-bg)' : 'transparent',
                color: 'var(--text)',
                fontSize: '14px', fontWeight: l.code === lang ? 600 : 400,
              }}
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
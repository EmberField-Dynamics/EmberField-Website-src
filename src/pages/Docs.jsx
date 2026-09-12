import { useState, useMemo } from 'react'
import { useLanguage } from '../context/LanguageContext'
import Reveal from '../components/Reveal'
import { DOCS } from '../data/docs.jsx'

const searchSvg = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export default function Docs() {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(null)

  const q = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    if (!q) return DOCS
    return DOCS
      .map((cat) => ({
        ...cat,
        docs: cat.docs.filter((d) => `${d.title} ${d.desc}`.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.docs.length > 0)
  }, [q])

  const resultsCount = filtered.reduce((n, c) => n + c.docs.length, 0)

  return (
    <div style={{ minHeight: '100vh', padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 18px', border: '1px solid var(--badge-border)', background: 'var(--badge-bg)',
          marginBottom: '24px', fontSize: '12px', fontWeight: 600,
          color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase',
        }}>
          {t.docs.badge}
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '16px' }}>
          {t.docs.title}
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          {t.docs.subtitle}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '520px', margin: '36px auto 0' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{searchSvg}</span>
          <input
            className="field"
            type="text"
            placeholder={t.docs.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {q && (
            <button
              onClick={() => setQuery('')}
              className="icon-btn"
              aria-label="Clear"
              style={{ flexShrink: 0 }}
            >&times;</button>
          )}
        </div>
      </Reveal>

      {filtered.length === 0 ? (
        <Reveal>
          <div className="card-lift" style={{ padding: '64px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '16px', color: 'var(--text-secondary)' }}>{'{ }'}</div>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
              {t.docs.noResults} <strong style={{ color: 'var(--text)' }}>"{query}"</strong>
            </p>
          </div>
        </Reveal>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {filtered.map((cat, ci) => (
            <Reveal key={cat.id} delay={ci * 60}>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>{t.docs.cat[cat.id] || cat.id}</h2>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{cat.id}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
                {cat.docs.map((doc) => {
                  const isOpen = open === doc.id
                  return (
                    <div key={doc.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <button
                        onClick={() => setOpen(isOpen ? null : doc.id)}
                        aria-expanded={isOpen}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '16px',
                          padding: '18px 22px', background: 'transparent', border: 'none',
                          cursor: 'pointer', textAlign: 'left', color: 'var(--text)',
                        }}
                      >
                        <span style={{ flexShrink: 0, width: '10px', height: '10px', background: 'var(--primary)' }} />
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: 'block', fontSize: '15px', fontWeight: 700 }}>{doc.title}</span>
                          <span style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '3px' }}>{doc.desc}</span>
                        </span>
                        <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                            {t.docs.updated} {doc.updated} ago
                          </span>
                          <span style={{
                            color: 'var(--primary)', fontSize: '18px', lineHeight: 1, fontWeight: 400,
                            transition: 'transform 0.2s', transform: isOpen ? 'rotate(45deg)' : 'none',
                          }}>+</span>
                        </span>
                      </button>
                      {isOpen && (
                        <div style={{
                          padding: '0 22px 22px 48px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.75,
                        }}>
                          {doc.body}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {q && resultsCount > 0 && (
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '28px' }}>
          {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
        </p>
      )}
    </div>
  )
}
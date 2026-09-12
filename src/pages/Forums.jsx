import { useState, useMemo } from 'react'
import { useLanguage } from '../context/LanguageContext'
import Reveal from '../components/Reveal'
import { FORUM_CATEGORIES } from '../data/forums.jsx'

const searchSvg = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const dotSvg = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--primary)">
    <circle cx="12" cy="12" r="6" />
  </svg>
)

export default function Forums() {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    if (!q) return FORUM_CATEGORIES
    return FORUM_CATEGORIES
      .map((cat) => ({
        ...cat,
        threads: cat.threads.filter((th) => `${th.title} ${th.author}`.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.threads.length > 0)
  }, [q])

  const resultsCount = filtered.reduce((n, c) => n + c.threads.length, 0)

  return (
    <div style={{ minHeight: '100vh', padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 18px', border: '1px solid var(--badge-border)', background: 'var(--badge-bg)',
          marginBottom: '24px', fontSize: '12px', fontWeight: 600,
          color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase',
        }}>
          {t.forums.badge}
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '16px' }}>
          {t.forums.title}
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          {t.forums.subtitle}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '520px', margin: '36px auto 0' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{searchSvg}</span>
          <input
            className="field"
            type="text"
            placeholder={t.forums.search}
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
            <div style={{ fontSize: '36px', marginBottom: '16px', color: 'var(--text-secondary)' }}>{'[ ]'}</div>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
              {t.forums.noResults} <strong style={{ color: 'var(--text)' }}>"{query}"</strong>
            </p>
          </div>
        </Reveal>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {filtered.map((cat, ci) => (
            <Reveal key={cat.id} delay={ci * 60}>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>{t.forums.cat[cat.id] || cat.id}</h2>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{cat.id}</span>
              </div>

              <div style={{ border: '1px solid var(--border)', background: 'var(--card-bg)', overflow: 'hidden' }}>
                <div className="thread-head">
                  <span>{t.forums.topic}</span>
                  <span>{t.forums.replies}</span>
                  <span>{t.forums.views}</span>
                </div>
                {cat.threads.map((th) => (
                  <div key={th.id} className="thread-row">
                    <div className="thread-main">
                      {th.pinned && (
                        <span className="pinned-badge">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M14 4l4 4-1.5 1.5L15 8v4l3 3v2h-6v-6H8l-1.5 1.5L5 10l4-4V3h2z"/></svg>
                          {t.forums.pinned}
                        </span>
                      )}
                      <span className="thread-title">{th.title}</span>
                      <span className="thread-author">
                        {dotSvg} {t.forums.by} <strong>{th.author}</strong>
                      </span>
                    </div>
                    <div className="thread-stat">{th.replies.toLocaleString()}</div>
                    <div className="thread-stat">{th.views.toLocaleString()}</div>
                  </div>
                ))}
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

      <style>{`
        .thread-head {
          display: grid;
          grid-template-columns: 1fr 90px 80px;
          gap: 16px;
          padding: 12px 22px;
          background: var(--input-bg);
          border-bottom: 1px solid var(--border);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .thread-head span:nth-child(2),
        .thread-head span:nth-child(3),
        .thread-stat { text-align: right; font-family: monospace; }

        .thread-row {
          display: grid;
          grid-template-columns: 1fr 90px 80px;
          gap: 16px;
          align-items: center;
          padding: 16px 22px;
          border-bottom: 1px solid var(--border);
          transition: background 0.2s ease;
        }
        .thread-row:last-child { border-bottom: none; }
        .thread-row:hover { background: var(--surface-hover); }

        .thread-main { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .thread-title {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--text);
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .thread-author {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .thread-author strong { color: var(--text); font-weight: 600; }
        .thread-stat { font-size: 13px; color: var(--text-secondary); }

        .pinned-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          align-self: flex-start;
          padding: 2px 8px;
          background: var(--badge-bg);
          border: 1px solid var(--badge-border);
          color: var(--primary);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        @media (max-width: 640px) {
          .thread-head, .thread-row { grid-template-columns: 1fr 56px 48px; gap: 10px; padding-left: 16px; padding-right: 16px; }
        }
      `}</style>
    </div>
  )
}
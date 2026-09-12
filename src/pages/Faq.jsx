import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import Reveal from '../components/Reveal'
import { CATEGORIES } from '../data/services.jsx'

export default function Faq() {
  const { lang, t } = useLanguage()
  const p = (path) => `/${lang}${path}`
  const [open, setOpen] = useState({})

  const groups = t.faq.groups ? t.faq.groups.map((group) => ({
    id: group.id,
    title: group.title,
    items: group.items.map((item, i) => ({ id: `${group.id}-${i}`, q: item.q, a: item.a })),
  })) : []

  return (
    <div style={{ minHeight: '100vh', padding: '96px 24px 72px', maxWidth: '900px', margin: '0 auto' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: '44px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px',
          border: '1px solid var(--badge-border)', background: 'var(--badge-bg)',
          marginBottom: '20px', fontSize: '12px', fontWeight: 600,
          color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase',
        }}>
          {t.faq.badge}
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 46px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '14px' }}>
          {t.faq.title}
        </h1>
        <p style={{ fontSize: '17px', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          {t.faq.subtitle}
        </p>
      </Reveal>

      {groups.map((group) => (
        <Reveal key={group.id} style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: '16px' }}>
            {group.title}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {group.items.map((item) => {
              const isOpen = open[item.id]
              return (
                <div key={item.id} className="faq-item">
                  <button
                    onClick={() => setOpen((o) => ({ ...o, [item.id]: !isOpen }))}
                    className="faq-question"
                    aria-expanded={!!isOpen}
                  >
                    {item.q}
                    <span className="faq-toggle" style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                  {isOpen && <div className="faq-answer">{item.a}</div>}
                </div>
              )
            })}
          </div>
        </Reveal>
      ))}

      <Reveal style={{ marginTop: '48px', textAlign: 'center' }}>
        <div className="card-lift" style={{ padding: '32px', borderRadius: 0 }}>
          <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>{t.faq.helpTitle}</div>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '20px' }}>{t.faq.helpDesc}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={p('/support/new')} className="btn-primary" style={{ color: '#000' }}>{t.nav.contact}</Link>
            <Link to={p('/services')} className="btn-ghost">{t.faq.browse}</Link>
          </div>
        </div>
      </Reveal>

      <Reveal style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
          {CATEGORIES.map((cat) => {
            const meta = t.nav.serviceOptions.find((o) => o.id === cat.id) || {}
            return (
              <Link
                key={cat.id}
                to={p(`/services/${cat.id}`)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
                  border: '1px solid var(--border)', background: 'var(--badge-bg)',
                  fontSize: '13px', fontWeight: 700, color: 'var(--text)', textDecoration: 'none',
                  transition: 'border-color 0.25s, color 0.25s, transform 0.25s',
                }}
              >
                {cat.icon}
                {meta.title}
              </Link>
            )
          })}
        </div>
      </Reveal>

      <style>{`
        .faq-item {
          border: 1px solid var(--border);
          background: var(--card-bg);
          overflow: hidden;
          transition: border-color 0.25s;
        }
        .faq-item:hover { border-color: var(--border-hover); }
        .faq-question {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 22px;
          background: transparent;
          border: none;
          color: var(--text);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          text-align: left;
        }
        .faq-toggle {
          color: var(--primary);
          font-size: 20px;
          line-height: 1;
          transition: transform 0.2s;
        }
        .faq-answer {
          padding: 0 22px 20px;
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
        }
      `}</style>
    </div>
  )
}
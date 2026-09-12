import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { legalContent } from '../data/legal'

export default function Legal({ type }) {
  const { lang, t } = useLanguage()
  const content = legalContent[type]
  const p = (path) => `/${lang}${path}`

  if (!content) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Not found</p>
        <Link to={p('/')} className="btn-ghost">{t.notFound.home}</Link>
      </div>
    )
  }

  const title = t.legal[`${type}Title`] || type

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '80px 24px 40px', marginTop: '64px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
          color: 'var(--primary)', border: '1px solid rgba(16,185,129,0.35)', padding: '4px 10px',
        }}>{t.legal.legal}</span>
      </div>
      <h1 style={{ fontSize: '34px', fontWeight: 800, marginBottom: '8px' }}>{title}</h1>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
        {t.legal.updated} — {content.updated}
      </p>

      <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--text)', marginBottom: '36px' }}>{content.intro}</p>

      {content.sections.map((section, i) => (
        <section key={i} style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '12px' }}>{section.title}</h2>
          {section.text && (
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{section.text}</p>
          )}
          {section.items && (
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'grid', gap: '8px' }}>
              {section.items.map((item, j) => (
                <li key={j} style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <Link to={p('/')} className="btn-ghost" style={{ marginTop: '12px' }}>{t.notFound.home}</Link>
    </div>
  )
}
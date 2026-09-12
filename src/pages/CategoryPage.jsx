import { Link, useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import Reveal from '../components/Reveal'
import { CATEGORIES, productsByCategory } from '../data/services.jsx'

const checkSvg = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>

export default function CategoryPage() {
  const { lang, t } = useLanguage()
  const { catId } = useParams()
  const p = (path) => `/${lang}${path}`

  const cat = CATEGORIES.find((c) => c.id === catId)
  const items = cat ? productsByCategory(catId) : []
  const meta = cat ? (t.nav.serviceOptions.find((o) => o.id === cat.id) || {}) : {}

  const currency = t.checkout.currency
  const money = (n) => (t.checkout.currencyBefore ? `${currency}${n}` : `${n}${currency}`)
  const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2))

  if (!cat) {
    return (
      <div style={{ minHeight: '100vh', padding: '120px 24px', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '12px' }}>{t.checkout.notFoundTitle}</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '28px' }}>{t.store.notFound}</p>
        <Link to={p('/services')} className="btn-primary" style={{ color: '#000' }}>{t.store.viewAll}</Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '96px 24px 72px', maxWidth: '1200px', margin: '0 auto' }}>
      <Reveal>
        <button onClick={() => window.history.back()} className="arrow-link" style={{ marginBottom: '20px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          {t.product.back}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' }}>
          <div style={{
            width: '60px', height: '60px', flexShrink: 0,
            background: 'var(--badge-bg)', border: '1px solid var(--badge-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{cat.icon}</div>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', padding: '5px 14px',
              border: '1px solid var(--badge-border)', background: 'var(--badge-bg)',
              fontSize: '11px', fontWeight: 600, color: 'var(--primary)',
              letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px',
            }}>
              {t.store.badge}
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.1 }}>
              {meta.title}
            </h1>
          </div>
        </div>
        <p style={{ fontSize: '16px', color: 'var(--muted)', maxWidth: '640px', lineHeight: 1.7, marginBottom: '8px' }}>
          {meta.desc}
        </p>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {items.length} {t.store.services}
        </div>
      </Reveal>

      <Reveal style={{ margin: '28px 0 40px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {CATEGORIES.map((c) => {
            const cMeta = t.nav.serviceOptions.find((o) => o.id === c.id) || {}
            const active = c.id === cat.id
            return (
              <Link
                key={c.id}
                to={p(`/services/${c.id}`)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
                  border: active ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: active ? 'rgba(16,185,129,0.08)' : 'var(--badge-bg)',
                  fontSize: '13px', fontWeight: 700, color: active ? 'var(--primary)' : 'var(--text)',
                  textDecoration: 'none', transition: 'border-color 0.25s, color 0.25s, transform 0.25s',
                }}
              >
                {c.icon}
                {cMeta.title}
              </Link>
            )
          })}
        </div>
      </Reveal>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
      }}>
        {items.map((product, i) => (
          <Reveal key={product.slug} delay={i * 60} style={{ height: '100%' }}>
            <div className={`store-card ${product.popular ? 'popular' : ''}`}>
              {product.popular && <div className="store-popular">{t.pricing.popular}</div>}

              <Link
                to={p(`/product/${product.slug}`)}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: product.popular ? '12px' : 0, marginBottom: '8px', lineHeight: 1.3 }}>
                  {product.name}
                </h3>
              </Link>
              <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                {product.desc}
              </p>

              <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-1.2px' }}>{money(fmt(product.price))}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.checkout.once}</span>
              </div>

              {product.tags && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {product.tags.slice(0, 3).map((tag) => (
                    <span key={tag} style={{
                      padding: '3px 10px', fontSize: '11px', fontWeight: 600,
                      border: '1px solid var(--border)', color: 'var(--text-secondary)',
                      background: 'var(--badge-bg)',
                    }}>{tag}</span>
                  ))}
                </div>
              )}

              <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
                {product.features.slice(0, 3).map((f, fi) => (
                  <li key={fi} style={{
                    padding: '6px 0', fontSize: '13px', color: 'var(--muted)',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    borderBottom: fi < Math.min(product.features.length, 3) - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{ flexShrink: 0 }}>{checkSvg}</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                <Link to={p(`/product/${product.slug}`)} className="btn-ghost btn-slim" style={{ width: '100%' }}>
                  {t.store.viewProduct}
                </Link>
                <Link to={p(`/buy/${product.slug}`)} className={`btn-primary btn-slim ${product.popular ? '' : ''}`} style={{ width: '100%' }}>
                  {t.product.buyNow}
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal style={{ marginTop: '56px', textAlign: 'center' }}>
        <Link to={p('/services')} className="arrow-link" style={{ fontSize: '14px' }}>
          {t.store.viewAll}
        </Link>
      </Reveal>
    </div>
  )
}
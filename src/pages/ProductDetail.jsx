import { Link, useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import Reveal from '../components/Reveal'
import { CATEGORIES, getProduct, relatedProducts } from '../data/services.jsx'

const checkSvg = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>

const specIcon = (k) => {
  const common = { width: '17', height: '17', viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--primary)', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (k) {
    case 'delivery':
      return <svg {...common}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    case 'support':
      return <svg {...common}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
    case 'revisions':
      return <svg {...common}><path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
    case 'source':
      return <svg {...common}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
    default:
      return null
  }
}

export default function ProductDetail() {
  const { lang, t } = useLanguage()
  const { slug } = useParams()
  const { add, setOpen } = useCart()
  const p = (path) => `/${lang}${path}`

  const product = getProduct(slug)
  const cat = product ? CATEGORIES.find((c) => c.id === product.cat) : undefined
  const related = relatedProducts(product?.slug || '')

  const currency = t.checkout.currency
  const money = (n) => (t.checkout.currencyBefore ? `${currency}${n}` : `${n}${currency}`)
  const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2))

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', padding: '120px 24px', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '12px' }}>{t.checkout.notFoundTitle}</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '28px' }}>{t.product.notFound}</p>
        <Link to={p('/services')} className="btn-primary" style={{ color: '#000' }}>{t.store.viewAll}</Link>
      </div>
    )
  }

  const specs = [
    { key: 'delivery', label: t.product.delivery, value: product.delivery || '—', note: t.product.deliveryNote },
    { key: 'support', label: t.product.support, value: product.support || '—', note: t.product.supportNote },
    { key: 'revisions', label: t.product.revisions, value: product.revisions || '—', note: t.product.revisionsNote },
    { key: 'source', label: t.product.source, value: product.source ? t.product.sourceYes : t.product.sourceNo, note: product.source ? t.product.sourceYesNote : t.product.sourceNoNote },
  ]

  const handleAdd = () => {
    add(product.slug)
    setOpen(true)
  }

  return (
    <div style={{ minHeight: '100vh', padding: '96px 24px 72px', maxWidth: '1200px', margin: '0 auto' }}>
      <Reveal>
        <button onClick={() => window.history.back()} className="arrow-link" style={{ marginBottom: '24px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          {t.product.back}
        </button>
      </Reveal>

      <Reveal style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
          gap: '40px', alignItems: 'start',
        }} className="prod-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {cat && (
                <Link
                  to={p(`/services/${cat.id}`)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px',
                    border: '1px solid var(--badge-border)', background: 'var(--badge-bg)',
                    fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}
                >
                  {cat.icon}
                  {product.cat}
                </Link>
              )}
              {product.popular && (
                <span style={{
                  padding: '5px 12px', background: 'var(--primary)', color: '#000',
                  fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
                }}>{t.pricing.popular}</span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(30px, 4.5vw, 46px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.08, marginBottom: '16px' }}>
              {product.name}
            </h1>
            <p style={{ fontSize: '17px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '640px', marginBottom: '24px' }}>
              {product.desc}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
              {product.tags && product.tags.map((tag) => (
                <span key={tag} style={{
                  padding: '4px 12px', fontSize: '12px', fontWeight: 600,
                  border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--badge-bg)',
                }}>{tag}</span>
              ))}
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div className="field-label" style={{ fontSize: '14px', marginBottom: '12px' }}>{t.product.featuresTitle}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px' }} className="prod-feats">
                {product.features.map((f, fi) => (
                  <div key={fi} style={{ padding: '8px 0', fontSize: '13.5px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ flexShrink: 0 }}>{checkSvg}</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="store-card" style={{ position: 'sticky', top: '96px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>{t.checkout.total}</div>
              <div style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '4px' }}>{money(fmt(product.price))}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '22px' }}>{t.checkout.once}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                <button onClick={handleAdd} className="btn-primary" style={{ color: '#000' }}>{t.product.addToCart}</button>
                <Link to={p(`/buy/${product.slug}`)} className="btn-ghost" style={{ textAlign: 'center' }}>{t.product.buyNow}</Link>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 14px', border: '1px solid var(--border)', background: 'var(--badge-bg)',
                fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                {t.product.secure}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal style={{ marginBottom: '48px' }}>
        <div className="spec-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {specs.map((spec) => (
            <div key={spec.key} className="card-lift" style={{ padding: '20px', borderRadius: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>{specIcon(spec.key)}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '6px' }}>{spec.label}</div>
              <div style={{ fontSize: '17px', fontWeight: 800 }}>{spec.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{spec.note}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {related.length > 0 && (
        <Reveal>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '20px' }}>
            {t.product.related}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {related.map((r) => (
              <Link key={r.slug} to={p(`/product/${r.slug}`)} className="card-lift" style={{ padding: '24px', textDecoration: 'none', color: 'inherit', borderRadius: 0 }}>
                <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px', lineHeight: 1.35 }}>{r.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '14px' }}>{r.desc}</div>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>{money(fmt(r.price))}</div>
              </Link>
            ))}
          </div>
        </Reveal>
      )}

      <style>{`
        @media (max-width: 900px) { .prod-grid { grid-template-columns: 1fr !important; } .prod-feats { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
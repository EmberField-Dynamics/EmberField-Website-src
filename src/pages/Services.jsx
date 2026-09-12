import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import Reveal from '../components/Reveal'
import { CATEGORIES, productsByCategory } from '../data/services.jsx'

const checkSvg = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>

export default function Services() {
  const { lang, t } = useLanguage()
  const location = useLocation()
  const p = (path) => `/${lang}${path}`

  const currency = t.checkout.currency
  const money = (n) => (t.checkout.currencyBefore ? `${currency}${n}` : `${n}${currency}`)
  const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2))

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60)
    }
  }, [location.hash])

  const [openFaq, setOpenFaq] = useState(0)

  const catMeta = (id) => t.nav.serviceOptions.find((o) => o.id === id) || {}

  return (
    <div style={{ minHeight: '100vh', padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 18px', borderRadius: '50px',
          border: '1px solid var(--badge-border)', background: 'var(--badge-bg)',
          marginBottom: '24px', fontSize: '12px', fontWeight: 600,
          color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase',
        }}>
          Our Products
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '16px' }}>
          {t.services.title}
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          {t.services.subtitle}
        </p>
      </Reveal>

      <Reveal style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
          {CATEGORIES.map((cat) => {
            const meta = catMeta(cat.id)
            return (
              <a
                key={cat.id}
                href={`${p('/services')}#${cat.id}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '10px 18px', borderRadius: '50px', textDecoration: 'none',
                  border: '1px solid var(--border)', background: 'var(--badge-bg)',
                  fontSize: '13px', fontWeight: 700, color: 'var(--text)',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
              >
                {cat.icon}
                {meta.title}
              </a>
            )
          })}
        </div>
      </Reveal>

      {CATEGORIES.map((cat, ci) => {
        const meta = catMeta(cat.id)
        const items = productsByCategory(cat.id)
        return (
          <section key={cat.id} id={cat.id} style={{ scrollMarginTop: '90px', marginBottom: '72px' }}>
            <Reveal style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
              <div style={{
                width: '52px', height: '52px', flexShrink: 0, borderRadius: '14px',
                background: 'var(--badge-bg)', border: '1px solid var(--badge-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{cat.icon}</div>
              <div>
                <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, letterSpacing: '-0.5px' }}>
                  {meta.title}
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>{meta.desc}</p>
              </div>
            </Reveal>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
            }}>
              {items.map((product, i) => (
                <Reveal key={product.slug} delay={(ci * 40 + i) * 60} style={{ height: '100%' }}>
                  <div style={{
                    display: 'flex', flexDirection: 'column', height: '100%',
                    padding: '32px 30px', borderRadius: '18px',
                    border: product.popular ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: product.popular
                      ? 'linear-gradient(180deg, rgba(16,185,129,0.08) 0%, var(--card-bg) 100%)'
                      : 'var(--card-bg)',
                    backdropFilter: 'blur(10px)', position: 'relative',
                    transition: 'all 0.3s',
                    transform: product.popular ? 'scale(1.01)' : 'none',
                    boxShadow: product.popular ? '0 8px 40px rgba(16,185,129,0.15)' : 'none',
                  }}
                    onMouseEnter={e => {
                      if (!product.popular) {
                        e.currentTarget.style.borderColor = 'var(--primary)'
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.boxShadow = '0 8px 40px rgba(16,185,129,0.1)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!product.popular) {
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.boxShadow = 'none'
                      }
                    }}
                  >
                    {product.popular && (
                      <div style={{
                        position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                        padding: '4px 16px', borderRadius: '50px',
                        background: 'var(--primary)', color: '#000',
                        fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
                        display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
                      }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#000" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        {t.pricing.popular}
                      </div>
                    )}

                    <h3 style={{ fontSize: '19px', fontWeight: 800, marginTop: product.popular ? '8px' : 0, marginBottom: '18px', lineHeight: 1.3 }}>
                      {product.name}
                    </h3>

                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-1.5px' }}>{money(fmt(product.price))}</span>
                      <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '8px' }}>{t.checkout.once}</span>
                    </div>

                    <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
                      {product.features.map((f, fi) => (
                        <li key={fi} style={{
                          padding: '8px 0', fontSize: '13.5px', color: 'var(--muted)',
                          display: 'flex', alignItems: 'center', gap: '10px',
                          borderBottom: fi < product.features.length - 1 ? '1px solid var(--border)' : 'none',
                        }}>
                          <span style={{ flexShrink: 0 }}>{checkSvg}</span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link to={p(`/buy/${product.slug}`)} style={{
                      display: 'block', width: '100%', marginTop: 'auto', padding: '13px',
                      borderRadius: '10px', textDecoration: 'none',
                      border: product.popular ? 'none' : '1px solid var(--border)',
                      background: product.popular ? 'var(--primary)' : 'var(--input-bg)',
                      color: product.popular ? '#000' : 'var(--text)',
                      fontSize: '14px', fontWeight: 700, textAlign: 'center',
                      transition: 'all 0.25s',
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        if (product.popular) e.currentTarget.style.boxShadow = '0 0 30px rgba(16,185,129,0.3)'
                        else e.currentTarget.style.background = 'var(--surface-hover)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.boxShadow = 'none'
                        if (!product.popular) e.currentTarget.style.background = 'var(--input-bg)'
                      }}
                    >{t.checkout.payBtn}</Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )
      })}

      <Reveal style={{ marginTop: '40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '10px' }}>
          {t.servicesFaq.title}
        </h2>
        <p style={{ textAlign: 'center', fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '40px' }}>
          {t.servicesFaq.subtitle}
        </p>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { q: t.servicesFaq.q1, a: t.servicesFaq.a1 },
            { q: t.servicesFaq.q2, a: t.servicesFaq.a2 },
            { q: t.servicesFaq.q3, a: t.servicesFaq.a3 },
            { q: t.servicesFaq.q4, a: t.servicesFaq.a4 },
          ].map((item, i) => {
            const open = openFaq === i
            return (
              <div key={i} style={{
                border: '1px solid var(--border)', background: 'var(--card-bg)',
                borderRadius: '12px', overflow: 'hidden',
              }}>
                <button
                  onClick={() => setOpenFaq(open ? -1 : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '16px', padding: '18px 22px', background: 'transparent', border: 'none',
                    color: 'var(--text)', fontSize: '15px', fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  {item.q}
                  <span style={{ color: 'var(--primary)', fontSize: '20px', lineHeight: 1, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                </button>
                {open && (
                  <div style={{ padding: '0 22px 20px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Reveal>
    </div>
  )
}

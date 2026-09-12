import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { getProduct } from '../data/services.jsx'

export default function CartDrawer() {
  const { items, setQty, remove, count, open, setOpen } = useCart()
  const { lang, t } = useLanguage()
  const location = useLocation()
  const p = (path) => `/${lang}${path}`

  useEffect(() => {
    setOpen(false)
  }, [location, setOpen])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const currency = t.checkout.currency
  const money = (n) => (t.checkout.currencyBefore ? `${currency}${n}` : `${n}${currency}`)
  const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2))

  const subtotal = items.reduce((sum, i) => {
    const prod = getProduct(i.slug)
    return sum + (prod ? prod.price * i.qty : 0)
  }, 0)

  return (
    <>
      <div
        className="cart-backdrop"
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 90,
          background: 'rgba(0,0,0,0.55)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s',
        }}
      />
      <aside
        className="cart-panel"
        aria-hidden={!open}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 95,
          width: 'min(420px, 100vw)',
          background: 'var(--card-bg)',
          borderLeft: '1px solid var(--border)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px', color: 'var(--text)' }}>
            {t.cart.title}
          </h3>
          <button
            onClick={() => setOpen(false)}
            className="icon-btn"
            aria-label={t.cart.close}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '40px 24px', textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--badge-bg)', border: '1px solid var(--badge-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1 h4 l2.68 13.39 a2 2 0 0 0 2 1.61 h9.72 a2 2 0 0 0 2-1.61 L23 6 H6" />
              </svg>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>{t.cart.empty}</div>
            <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{t.cart.emptyDesc}</div>
            <Link
              to={p('/services')}
              className="btn-primary"
              style={{ marginTop: '8px', padding: '12px 26px', fontSize: '14px', color: '#000' }}
              onClick={() => setOpen(false)}
            >
              {t.cart.browse}
            </Link>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
              {items.map((item) => {
                const prod = getProduct(item.slug)
                if (!prod) return null
                return (
                  <div key={item.slug} style={{ display: 'flex', gap: '14px', padding: '14px 24px', borderBottom: '1px solid var(--border)' }}>
                    <Link
                      to={p(`/product/${prod.slug}`)}
                      onClick={() => setOpen(false)}
                      style={{
                        width: '52px', height: '52px', flexShrink: 0,
                        background: 'var(--badge-bg)', border: '1px solid var(--badge-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none',
                      }}
                    >
                      {prod.name.charAt(0).toUpperCase()}
                    </Link>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link
                        to={p(`/product/${prod.slug}`)}
                        onClick={() => setOpen(false)}
                        style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', textDecoration: 'none', lineHeight: 1.35, display: 'block' }}
                      >
                        {prod.name}
                      </Link>
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'inline-flex', border: '1px solid var(--border)' }}>
                          <button
                            onClick={() => setQty(item.slug, item.qty - 1)}
                            aria-label="decrease"
                            style={{ background: 'transparent', border: 'none', color: 'var(--text)', width: '26px', height: '26px', cursor: 'pointer', fontSize: '15px', lineHeight: 1 }}
                          >−</button>
                          <span style={{ width: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>{item.qty}</span>
                          <button
                            onClick={() => setQty(item.slug, item.qty + 1)}
                            aria-label="increase"
                            style={{ background: 'transparent', border: 'none', color: 'var(--text)', width: '26px', height: '26px', cursor: 'pointer', fontSize: '15px', lineHeight: 1 }}
                          >+</button>
                        </div>
                        <button
                          onClick={() => remove(item.slug)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {t.cart.remove}
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>
                      {money(fmt(prod.price * item.qty))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', padding: '18px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{t.cart.subtotal} ({count} {t.cart.items})</span>
                <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.5px', color: 'var(--text)' }}>{money(fmt(subtotal))}</span>
              </div>
              <Link
                to={p('/checkout')}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', color: '#000', textAlign: 'center' }}
              >
                {t.cart.checkout}
              </Link>
            </div>
          </>
        )}

        <style>{`
          .cart-panel { box-shadow: -20px 0 60px rgba(0,0,0,0.25); }
          .cart-panel [aria-hidden='true'] { visibility: hidden; }
        `}</style>
      </aside>
    </>
  )
}
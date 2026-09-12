import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { getProduct } from '../data/services.jsx'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const formatNumber = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}
const brandOf = (num) => {
  const n = num.replace(/\D/g, '')
  if (/^4/.test(n)) return 'VISA'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'MC'
  if (/^3[47]/.test(n)) return 'AMEX'
  return ''
}

export default function CartCheckout() {
  const { lang, t } = useLanguage()
  const { user } = useAuth()
  const { items, clear } = useCart()
  const p = (path) => `/${lang}${path}`

  const cartItems = items
    .map((i) => ({ ...i, product: getProduct(i.slug) }))
    .filter((i) => i.product)

  const [form, setForm] = useState({ name: '', email: '', note: '' })
  const [payment, setPayment] = useState({ name: '', number: '', expiry: '', cvc: '' })
  const [promoInput, setPromoInput] = useState('')
  const [promoStatus, setPromoStatus] = useState('idle')
  const [promoInfo, setPromoInfo] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const currency = t.checkout.currency
  const money = (n) => (t.checkout.currencyBefore ? `${currency}${n}` : `${n}${currency}`)
  const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2))

  const discountPct = promoInfo?.discount_percent || 0
  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0)
  const discountAmount = Math.round(subtotal * (discountPct / 100) * 100) / 100
  const total = Math.round((subtotal - discountAmount) * 100) / 100

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    setPromoStatus('checking')
    if (!isSupabaseConfigured()) {
      setPromoStatus('invalid')
      return
    }
    const { data, error: err } = await supabase
      .from('promo_codes')
      .select('code, discount_percent, enabled, max_uses, times_used, expires_at')
      .eq('code', code)
      .maybeSingle()
    const valid = !err && data && data.enabled
      && (data.max_uses == null || data.times_used < data.max_uses)
      && (!data.expires_at || new Date(data.expires_at) > new Date())
    if (valid) {
      setPromoInfo({ code: data.code, discount_percent: data.discount_percent })
      setPromoStatus('valid')
    } else {
      setPromoInfo(null)
      setPromoStatus('invalid')
    }
  }

  const clearPromo = () => {
    setPromoInput('')
    setPromoInfo(null)
    setPromoStatus('idle')
  }

  const cardValid = () => {
    const num = payment.number.replace(/\D/g, '')
    const exp = payment.expiry.replace(/\D/g, '')
    const now = new Date()
    const expOk = exp.length === 4 && Number(exp.slice(0, 2)) >= 1 && Number(exp.slice(0, 2)) <= 12
      && (now.getFullYear() - 2000 < Number(exp.slice(2)) || (now.getFullYear() - 2000 === Number(exp.slice(2)) && now.getMonth() + 1 <= Number(exp.slice(0, 2))))
    return num.length >= 12 && payment.name.trim().length > 0 && expOk && payment.cvc.length >= 3
  }

  const placeOrder = async () => {
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError(t.checkout.required)
      return
    }
    if (!cardValid()) {
      setError(t.cartCheckout.cardError)
      return
    }
    if (cartItems.length === 0) {
      setError(t.cart.empty)
      return
    }
    setError('')
    setSubmitting(true)
    try {
      if (isSupabaseConfigured()) {
        if (promoInfo) {
          await supabase.rpc('increment_promo_use', { code_text: promoInfo.code })
        }
        const rows = cartItems.map((i) => ({
          user_id: user?.id || null,
          plan: i.product.slug,
          full_name: form.name.trim(),
          email: form.email.trim(),
          note: form.note.trim() || null,
          promo_code: promoInfo?.code || null,
          discount_percent: discountPct,
          base_price: i.product.price * i.qty,
          total: Math.round(i.product.price * i.qty * (1 - discountPct / 100) * 100) / 100,
        }))
        await supabase.from('purchases').insert(rows)
      }
      clear()
      setDone(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', padding: '110px 24px 80px', display: 'flex', justifyContent: 'center' }}>
        <div className="card-lift" style={{ maxWidth: 640, width: '100%', textAlign: 'center', padding: '48px 40px', borderRadius: 0 }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 20px',
            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '12px' }}>
            {t.cartCheckout.successTitle}
          </h1>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '28px' }}>
            {t.cartCheckout.successText.replace('{name}', form.name.trim()).replace('{email}', form.email.trim())}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={p('/')} className="btn-primary" style={{ color: '#000' }}>{t.checkout.backHome}</Link>
            <Link to={p('/services')} className="btn-ghost">{t.store.viewAll}</Link>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0 && !done) {
    return (
      <div style={{ minHeight: '100vh', padding: '120px 24px', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '12px' }}>{t.cart.empty}</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '28px' }}>{t.cart.emptyDesc}</p>
        <Link to={p('/services')} className="btn-primary" style={{ color: '#000' }}>{t.cart.browse}</Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '100px 24px 80px' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px',
            border: '1px solid var(--badge-border)', background: 'var(--badge-bg)',
            fontSize: '12px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            {t.cartCheckout.badge}
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 900, letterSpacing: '-1px', margin: '16px 0 8px' }}>
            {t.cartCheckout.title}
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--muted)', maxWidth: '520px', margin: '0 auto' }}>
            {t.cartCheckout.subtitle}
          </p>
        </div>

        <div className="ck-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '28px', alignItems: 'start' }}>
          <div className="card-lift" style={{ padding: '28px', borderRadius: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--primary)', color: '#000', fontWeight: 900, fontSize: '15px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>1</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>{t.checkout.detailsTitle}</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{t.cartCheckout.whereToSend}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '30px' }}>
              <div>
                <label className="field-label" htmlFor="cc-name">{t.checkout.name}</label>
                <input id="cc-name" className="field" type="text" autoComplete="name"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="field-label" htmlFor="cc-email">{t.checkout.email}</label>
                <input id="cc-email" className="field" type="email" autoComplete="email"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="field-label" htmlFor="cc-note">{t.checkout.note}</label>
                <textarea id="cc-note" className="field" style={{ height: 'auto', minHeight: '80px', padding: '12px 18px', resize: 'vertical' }}
                  value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--primary)', color: '#000', fontWeight: 900, fontSize: '15px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>2</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>{t.checkout.stepPayment}</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{t.product.secure}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label className="field-label" htmlFor="card-name">{t.checkout.cardName}</label>
                <input id="card-name" className="field" type="text" autoComplete="cc-name"
                  value={payment.name} onChange={(e) => setPayment({ ...payment, name: e.target.value })} />
              </div>
              <div>
                <label className="field-label" htmlFor="card-number">{t.checkout.cardNumber}</label>
                <div style={{ position: 'relative' }}>
                  <input id="card-number" className="field" type="text" inputMode="numeric" autoComplete="cc-number"
                    placeholder="4242 4242 4242 4242"
                    value={payment.number} onChange={(e) => setPayment({ ...payment, number: formatNumber(e.target.value) })} />
                  {brandOf(payment.number) && (
                    <span style={{
                      position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                      fontSize: '11px', fontWeight: 900, letterSpacing: '1px', color: 'var(--primary)',
                      border: '1px solid var(--badge-border)', padding: '2px 6px', background: 'var(--badge-bg)',
                    }}>{brandOf(payment.number)}</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="field-label" htmlFor="card-exp">{t.checkout.expDate}</label>
                  <input id="card-exp" className="field" type="text" inputMode="numeric" placeholder="MM/YY" autoComplete="cc-exp"
                    value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })} />
                </div>
                <div>
                  <label className="field-label" htmlFor="card-cvc">{t.checkout.cvc}</label>
                  <input id="card-cvc" className="field" type="text" inputMode="numeric" autoComplete="cc-csc" placeholder="123"
                    value={payment.cvc} onChange={(e) => setPayment({ ...payment, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} />
                </div>
              </div>
            </div>

            {error && (
              <div style={{ marginTop: '18px', padding: '12px 16px', border: '1px solid rgba(220,38,38,0.35)', background: 'rgba(220,38,38,0.08)', color: '#DC2626', fontSize: '13.5px', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button onClick={placeOrder} disabled={submitting} className="btn-primary btn-block" style={{ marginTop: '26px', padding: '15px', fontSize: '16px', color: '#000' }}>
              {submitting
                ? t.cartCheckout.placing
                : `${t.cartCheckout.pay} · ${money(fmt(total))}`}
            </button>
          </div>

          <div>
            <div className="card-lift" style={{ padding: '24px', borderRadius: 0, position: 'sticky', top: '96px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '16px' }}>{t.checkout.summary}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px', maxHeight: '280px', overflowY: 'auto' }}>
                {cartItems.map((i) => (
                  <div key={i.slug} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: '38px', height: '38px', flexShrink: 0,
                      background: 'var(--badge-bg)', border: '1px solid var(--badge-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 800, color: 'var(--primary)',
                    }}>{i.qty}×</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link to={p(`/product/${i.product.slug}`)} style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text)', textDecoration: 'none', lineHeight: 1.35, display: 'block' }}>
                        {i.product.name}
                      </Link>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{money(fmt(i.product.price))} {t.cart.each}</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, whiteSpace: 'nowrap' }}>{money(fmt(i.product.price * i.qty))}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <span>{t.cart.subtotal}</span><span>{money(fmt(subtotal))}</span>
                </div>
                {discountPct > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#10B981', fontWeight: 700 }}>
                    <span>{t.checkout.discount} ({discountPct}%)</span><span>-{money(fmt(discountAmount))}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: 900, letterSpacing: '-0.3px' }}>
                  <span>{t.checkout.total}</span><span>{money(fmt(total))}</span>
                </div>
              </div>

              <div style={{ marginTop: '18px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <div className="field-label" style={{ marginBottom: '10px' }}>{t.checkout.promoTitle}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    className="field"
                    style={{ height: '44px', fontSize: '13.5px', textTransform: 'uppercase' }}
                    placeholder={t.checkout.promoPlaceholder}
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); if (promoStatus !== 'idle') setPromoStatus('idle') }}
                  />
                  {promoInfo ? (
                    <button onClick={clearPromo} className="btn-ghost btn-slim" style={{ whiteSpace: 'nowrap' }}>{t.checkout.promoRemove}</button>
                  ) : (
                    <button onClick={applyPromo} className="btn-primary btn-slim" style={{ whiteSpace: 'nowrap', color: '#000' }} disabled={promoStatus === 'checking'}>
                      {promoStatus === 'checking' ? '...' : t.checkout.promoApply}
                    </button>
                  )}
                </div>
                {promoStatus === 'valid' && <div style={{ fontSize: '12.5px', color: '#10B981', marginTop: '8px', fontWeight: 600 }}>{t.checkout.promoApplied}</div>}
                {promoStatus === 'invalid' && <div style={{ fontSize: '12.5px', color: '#DC2626', marginTop: '8px', fontWeight: 600 }}>{t.checkout.promoInvalid}</div>}
              </div>

              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '18px',
                fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                {t.cartCheckout.trustNote}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .ck-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
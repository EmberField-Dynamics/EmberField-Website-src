import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import Reveal from '../components/Reveal'

export default function Pricing() {
  const { lang, t } = useLanguage()
  const p = (path) => `/${lang}${path}`

  const plans = [
    {
      name: t.pricing.starter,
      price: t.pricing.starterPrice,
      period: t.pricing.starterPeriod,
      features: t.pricing.starterFeatures,
      btn: t.pricing.starterBtn,
      popular: false,
    },
    {
      name: t.pricing.pro,
      price: t.pricing.proPrice,
      period: t.pricing.proPeriod,
      features: t.pricing.proFeatures,
      btn: t.pricing.proBtn,
      popular: true,
    },
    {
      name: t.pricing.enterprise,
      price: t.pricing.enterprisePrice,
      period: t.pricing.enterprisePeriod,
      features: t.pricing.enterpriseFeatures,
      btn: t.pricing.enterpriseBtn,
      popular: false,
    },
  ]

  return (
    <div style={{ minHeight: '100vh', padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '16px' }}>
          {t.pricing.title}
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          {t.pricing.subtitle}
        </p>
      </Reveal>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px', alignItems: 'start',
      }}>
        {plans.map((plan, i) => (
          <Reveal key={i} delay={i * 120} style={{ height: '100%' }}>
          <div style={{
            padding: '40px 36px', borderRadius: '20px',
            border: plan.popular ? '2px solid var(--primary)' : '1px solid var(--border)',
            background: plan.popular ? 'linear-gradient(180deg, rgba(16,185,129,0.08) 0%, var(--card-bg) 100%)' : 'var(--card-bg)',
            backdropFilter: 'blur(10px)', position: 'relative',
            transition: 'all 0.3s',
            transform: plan.popular ? 'scale(1.02)' : 'none',
            boxShadow: plan.popular ? '0 8px 40px rgba(16,185,129,0.15)' : 'none',
          }}
            onMouseEnter={e => { if (!plan.popular) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(16,185,129,0.1)' } }}
            onMouseLeave={e => { if (!plan.popular) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' } }}
          >
            {plan.popular && (
              <div style={{
                position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                padding: '4px 16px', borderRadius: '20px',
                background: 'var(--primary)', color: '#000',
                fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
              }}>{t.pricing.popular}</div>
            )}
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', marginTop: plan.popular ? '8px' : 0 }}>{plan.name}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '32px' }}>
              <span style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-2px' }}>{plan.price}</span>
              <span style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>{plan.period}</span>
            </div>
            <ul style={{ listStyle: 'none', marginBottom: '32px' }}>
              {plan.features.map((f, fi) => (
                <li key={fi} style={{
                  padding: '10px 0', fontSize: '14px', color: 'var(--muted)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  borderBottom: fi < plan.features.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link to={p('/contact')} style={{
              display: 'block', width: '100%', padding: '14px', borderRadius: '12px',
              border: plan.popular ? 'none' : '1px solid var(--border)',
              background: plan.popular ? 'var(--primary)' : 'var(--input-bg)',
              color: plan.popular ? '#000' : 'var(--text)',
              fontSize: '15px', fontWeight: 700, textAlign: 'center',
              transition: 'all 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; if (plan.popular) e.currentTarget.style.boxShadow = '0 0 30px rgba(16,185,129,0.3)'; else e.currentTarget.style.background = 'var(--surface-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; if (!plan.popular) e.currentTarget.style.background = 'var(--input-bg)' }}
            >{plan.btn}</Link>
          </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

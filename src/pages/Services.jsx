import { useLanguage } from '../context/LanguageContext'
import Reveal from '../components/Reveal'

const checkSvg = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>

export default function Services() {
  const { t } = useLanguage()

  const products = [
    {
      title: 'Custom AntiCheat Configuration',
      desc: 'Professional anticheat configuration for any server',
      price: '$3.99',
      popular: false,
      features: [
        'Configuration of any Anticheat',
        'Setup on your server',
        'Custom Detection Rules',
        'Performance Optimization',
        '24/7 Support',
        '30 days maintenance',
      ],
      link: '#',
    },
    {
      title: 'Server Mode Setup',
      desc: 'Complete Minecraft server setup and configuration service',
      price: '$14.99',
      popular: true,
      features: [
        'Complete Server Configuration',
        'Setup on your machine',
        'Server naming to your preference',
        'Anticheat included',
        'Permissions ready',
        'Any game mode',
        'Performance Optimization',
        '30 days maintenance',
      ],
      link: '#',
    },
    {
      title: 'Custom Discord Bot',
      desc: 'Professional Discord bot development with custom features',
      price: '$5.99',
      popular: false,
      features: [
        'Everything to your preference',
        'Moderation Features',
        'Complete Entertainment',
        'Server Management Tools',
        'Custom Commands',
        'Database Integration',
        '30 days maintenance',
      ],
      link: '#',
    },
  ]

  const icons = [
    <svg key="mc" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 7h4v4H7z"/><path d="M13 7h4v4h-4z"/><path d="M7 13h4v4H7z"/><path d="M13 13h4v4h-4z"/></svg>,
    <svg key="web" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    <svg key="dc" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
    <svg key="cons" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
    <svg key="ui" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
    <svg key="cloud" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
  ]

  const infoCards = [
    { icon: icons[0], title: t.services.mcTitle, desc: t.services.mcDesc },
    { icon: icons[1], title: t.services.webTitle, desc: t.services.webDesc },
    { icon: icons[2], title: t.services.discordTitle, desc: t.services.discordDesc },
    { icon: icons[3], title: t.services.consultTitle, desc: t.services.consultDesc },
    { icon: icons[4], title: t.services.designTitle, desc: t.services.designDesc },
    { icon: icons[5], title: t.services.cloudTitle, desc: t.services.cloudDesc },
  ]

  return (
    <div style={{ minHeight: '100vh', padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: '64px' }}>
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

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px', marginBottom: '80px',
      }}>
        {products.map((product, i) => (
          <Reveal key={i} delay={i * 120} style={{ height: '100%' }}>
          <div style={{
            padding: '40px 36px', borderRadius: '20px',
            border: product.popular ? '2px solid var(--primary)' : '1px solid var(--border)',
            background: product.popular ? 'linear-gradient(180deg, rgba(16,185,129,0.08) 0%, var(--card-bg) 100%)' : 'var(--card-bg)',
            backdropFilter: 'blur(10px)', position: 'relative',
            transition: 'all 0.3s',
            transform: product.popular ? 'scale(1.02)' : 'none',
            boxShadow: product.popular ? '0 8px 40px rgba(16,185,129,0.15)' : 'none',
          }}
            onMouseEnter={e => { if (!product.popular) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(16,185,129,0.1)' }}}
            onMouseLeave={e => { if (!product.popular) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}}
          >
            {product.popular && (
              <div style={{
                position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                padding: '4px 16px', borderRadius: '20px',
                background: 'var(--primary)', color: '#000',
                fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#000" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Most Popular
              </div>
            )}

            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', marginTop: product.popular ? '8px' : 0 }}>
              {product.title}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
              {product.desc}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '28px' }}>
              <span style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-2px', color: 'var(--text)' }}>
                {product.price}
              </span>
            </div>

            <ul style={{ listStyle: 'none', marginBottom: '32px' }}>
              {product.features.map((f, fi) => (
                <li key={fi} style={{
                  padding: '10px 0', fontSize: '14px', color: 'var(--muted)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  borderBottom: fi < product.features.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  {checkSvg}
                  {f}
                </li>
              ))}
            </ul>

            <a href={product.link} style={{
              display: 'block', width: '100%', padding: '14px', borderRadius: '12px',
              border: product.popular ? 'none' : '1px solid var(--border)',
              background: product.popular ? 'var(--primary)' : 'var(--input-bg)',
              color: product.popular ? '#000' : 'var(--text)',
              fontSize: '15px', fontWeight: 700, textAlign: 'center',
              transition: 'all 0.25s', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; if (product.popular) e.currentTarget.style.boxShadow = '0 0 30px rgba(16,185,129,0.3)'; else e.currentTarget.style.background = 'var(--surface-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; if (!product.popular) e.currentTarget.style.background = 'var(--input-bg)' }}
            >Get Started</a>
          </div>
          </Reveal>
        ))}
      </div>

      <Reveal style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '12px' }}>
          More Services
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--muted)', maxWidth: '500px', margin: '0 auto' }}>
          Additional solutions for your digital infrastructure needs.
        </p>
      </Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {infoCards.map((card, i) => (
          <Reveal key={i} delay={i * 100}>
          <div style={{
            padding: '36px', borderRadius: '16px',
            border: '1px solid var(--border)', background: 'var(--card-bg)',
            backdropFilter: 'blur(10px)', transition: 'all 0.3s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(16,185,129,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              background: 'var(--badge-bg)', border: '1px solid var(--badge-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px',
            }}>{card.icon}</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{card.title}</h3>
            <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7 }}>{card.desc}</p>
          </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

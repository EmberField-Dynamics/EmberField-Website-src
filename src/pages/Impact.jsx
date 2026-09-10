import { useLanguage } from '../context/LanguageContext'

export default function Impact() {
  const { t } = useLanguage()

  const stats = [
    { value: '500+', label: t.impact.projects },
    { value: '99.9%', label: t.impact.uptime },
    { value: '300+', label: t.impact.clients },
    { value: '<50ms', label: t.impact.response },
    { value: '40+', label: t.impact.countries },
    { value: '2.5x', label: t.impact.revenue },
  ]

  return (
    <div style={{ minHeight: '100vh', padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '72px', animation: 'fadeInUp 0.6s ease-out' }}>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '16px' }}>
          {t.impact.title}
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          {t.impact.subtitle}
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px',
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            padding: '48px 36px', borderRadius: '16px',
            border: '1px solid var(--border)', background: 'var(--card-bg)',
            backdropFilter: 'blur(10px)', textAlign: 'center',
            transition: 'all 0.3s', animation: `fadeInUp 0.6s ease-out ${0.1 * i}s both`,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(16,185,129,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{
              fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 900, letterSpacing: '-2px',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, var(--text) 0%, var(--primary) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{s.value}</div>
            <div style={{
              fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase',
              letterSpacing: '1.5px', fontWeight: 500,
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '80px', padding: '48px', borderRadius: '20px',
        border: '1px solid var(--border)', background: 'var(--card-bg)',
        backdropFilter: 'blur(10px)', textAlign: 'center',
        animation: 'fadeInUp 0.6s ease-out 0.6s both',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1" style={{ marginBottom: '20px', opacity: 0.5 }}>
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 .001 0 .001 0 0z"/>
        </svg>
        <p style={{
          fontSize: '20px', color: 'var(--muted)', lineHeight: 1.8,
          maxWidth: '700px', margin: '0 auto 24px', fontStyle: 'italic',
        }}>
          &ldquo;Emberfield Dynamics transformed our Minecraft network infrastructure. Their technical expertise and 24/7 support made the transition seamless. We saw a 40% improvement in player retention within the first month.&rdquo;
        </p>
        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>Alex Johnson</div>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>CTO, PixelCraft Studios</div>
      </div>
    </div>
  )
}

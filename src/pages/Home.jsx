import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import Reveal from '../components/Reveal'

const CONTAINER = {
  width: '100%',
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '0 16px',
}

const BANNERS = [
  { img: '/banner-plugins.png', label: ['Plugins Development Banner', 'Banni\u00e8re D\u00e9veloppement de Plugins', 'Plugin-Entwicklung Banner', 'Banner de Desarrollo de Plugins', 'Banner Sviluppo di Plugin'] },
  { img: '/banner-web.png', label: ['Web Development Banner', 'Banni\u00e8re D\u00e9veloppement Web', 'Webentwicklung Banner', 'Banner de Desarrollo Web', 'Banner Sviluppo Web'] },
  { img: '/banner-discord.png', label: ['Discord Bot Development Banner', 'Banni\u00e8re D\u00e9veloppement de Bots Discord', 'Discord-Bot-Entwicklung Banner', 'Banner de Desarrollo de Bots de Discord', 'Banner Sviluppo di Bot Discord'] },
]

const STACK_GROUPS = {
  languages: [
    ['Java', '/logos/java-4-logo.svg'],
    ['Kotlin', '/logos/kotlin-1-logo.svg'],
    ['JavaScript', '/logos/javascript.svg'],
    ['TypeScript', '/logos/typescript-official.svg'],
  ],
  databases: [
    ['MongoDB', '/logos/mongodb.svg'],
    ['MySQL', '/logos/mysql-logo.svg'],
    ['Redis', '/logos/redis.svg'],
  ],
  general: [
    ['Node.js', '/logos/nodejs-icon.svg'],
    ['Next.js', '/logos/nextjs-icon.svg'],
    ['npm', '/logos/npm.svg'],
    ['pnpm', '/logos/light-pnpm.svg'],
    ['Discord.js', '/logos/discord-icon.svg'],
    ['VS Code', '/logos/visual-studio-code.svg'],
    ['IntelliJ IDEA', '/logos/intellij-idea.svg'],
    ['Vercel', '/logos/vercel-logo.svg'],
    ['React', '/logos/react.svg'],
    ['Tailwind CSS', '/logos/tailwindcss-icon.svg'],
    ['Git', '/logos/git.svg'],
    ['Linux', '/logos/linux.svg'],
  ],
}

const ICONS = {
  mc: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-9 5-9-5V8l9-5 9 5v8Z"/><path d="M12 22v-11"/><path d="m12 11 9-5"/><path d="m12 11-9-5"/></svg>,
  web: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>,
  bot: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M12 15h.01"/><path d="M9 15h.01"/><path d="M15 15h.01"/><path d="M10 9h4"/></svg>,
  planning: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.7 1.3 1.5 1.5 2.4"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>,
  design: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  dev: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>,
  integration: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>,
  ssl: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3"/><path d="m17.5 5.5 3 3"/></svg>,
  ddos: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  backup: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>,
}

function StackTile({ name, src }) {
  const { theme } = useTheme()
  const invert = theme === 'dark' && (name === 'Next.js' || name === 'Vercel')
  return (
    <div title={name} style={{
      width: '64px', height: '64px', borderRadius: '6px',
      background: 'var(--surface)', border: '1px solid var(--border-hover)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '12px', flexShrink: 0, transition: 'border 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'none' }}
    >
      <img src={src} alt={name} style={{
        width: '30px', height: '30px', objectFit: 'contain',
        filter: invert ? 'invert(1)' : 'none',
      }} loading="lazy" />
    </div>
  )
}

export default function Home() {
  const { lang, t } = useLanguage()
  const p = (path) => `/${lang}${path}`

  const [slide, setSlide] = useState(0)
  const next = useCallback(() => setSlide(s => (s + 1) % BANNERS.length), [])
  const prev = () => setSlide(s => (s - 1 + BANNERS.length) % BANNERS.length)

  useEffect(() => {
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next])

  const getLabel = (b) => {
    const idx = ['en', 'fr', 'de', 'es', 'it'].indexOf(lang)
    return b.label[idx] || b.label[0]
  }

  const stackKeys = [
    { label: t.techStack.languages, items: STACK_GROUPS.languages },
    { label: t.techStack.databases, items: STACK_GROUPS.databases },
    { label: t.techStack.general, items: STACK_GROUPS.general },
  ]

  const processSteps = [
    { icon: ICONS.planning, title: t.process.step1, desc: t.process.step1Desc, num: '01' },
    { icon: ICONS.design, title: t.process.step2, desc: t.process.step2Desc, num: '02' },
    { icon: ICONS.dev, title: t.process.step3, desc: t.process.step3Desc, num: '03' },
    { icon: ICONS.integration, title: t.process.step4, desc: t.process.step4Desc, num: '04' },
  ]

  const serviceCards = [
    { icon: ICONS.mc, title: t.services.mcTitle, tag: t.services.mcTag, desc: t.services.mcDesc },
    { icon: ICONS.web, title: t.services.webTitle, tag: t.services.webTag, desc: t.services.webDesc },
    { icon: ICONS.bot, title: t.services.discordTitle, tag: t.services.discordTag, desc: t.services.discordDesc },
  ]

  const securityItems = [
    { icon: ICONS.ssl, title: t.security.item1, desc: t.security.item1Desc },
    { icon: ICONS.ddos, title: t.security.item2, desc: t.security.item2Desc },
    { icon: ICONS.backup, title: t.security.item3, desc: t.security.item3Desc },
  ]

  return (
    <>
      <section className="hero-section" style={{
        position: 'relative', overflow: 'hidden', background: '#09090b',
      }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            alt="Emberfield Dynamics"
            src="/beach-city.png"
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.75) 75%, rgba(0,0,0,0.5) 100%)',
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
        </div>

        <div style={{ ...CONTAINER, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', alignItems: 'end' }}>
            <div className="hero-left" style={{ padding: '32px 0' }}>
              <h1 className="hero-title hero-title-anim" style={{
                fontWeight: 800, lineHeight: 0.98, letterSpacing: '-2px',
                color: '#fff', maxWidth: '13ch',
              }}>
                {t.home.title1}<br />{t.home.title2}
              </h1>
              <p className="hero-desc hero-desc-anim" style={{
                marginTop: '24px', lineHeight: 1.7, fontWeight: 400,
                maxWidth: '576px', color: 'rgba(255,255,255,0.85)',
              }}>
                {t.home.desc}
              </p>
              <div className="hero-cta hero-cta-anim" style={{
                marginTop: '40px', display: 'flex', flexWrap: 'wrap',
                alignItems: 'center', gap: '16px',
              }}>
                <Link to={p('/register')} style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  padding: '14px 28px', background: '#1A1A1A',
                  color: '#fff', fontSize: '14px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '1px', border: 'none',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#000'}
                  onMouseLeave={e => e.currentTarget.style.background = '#1A1A1A'}
                >{t.home.cta1}</Link>
                <Link to={p('/services')} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontSize: '14px', fontWeight: 500, color: '#fff',
                  textDecoration: 'underline', textUnderlineOffset: '4px',
                  textDecorationColor: 'rgba(255,255,255,0.4)',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                  onMouseLeave={e => e.currentTarget.style.color = '#fff'}
                >
                  {t.home.cta2}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
            </div>

            <div className="hero-right" style={{
              gridColumn: 'span 5 / span 5', display: 'flex',
              justifyContent: 'flex-end', alignItems: 'flex-start', paddingTop: '16px',
            }}>
              <img
                alt="Emberfield Dynamics app"
                src="/man-looking-at-phone.png"
                className="hero-phone"
                style={{
                  width: 'auto', height: '490px', maxWidth: '100%', objectFit: 'contain',
                  objectPosition: 'top', userSelect: 'none', pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="services" style={{
        padding: '128px 0', background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={CONTAINER}>
          <Reveal style={{ textAlign: 'center', maxWidth: '768px', margin: '0 auto 64px' }}>
            <h2 style={{
              fontSize: 'clamp(30px, 4vw, 40px)', fontWeight: 700,
              letterSpacing: '-0.5px', color: 'var(--text)',
            }}>{t.services.title}</h2>
            <p style={{ marginTop: '16px', fontSize: '16px', lineHeight: 1.7, color: 'var(--muted)' }}>
              {t.services.subtitle}
            </p>
          </Reveal>

          <Reveal delay={100}>
          <div style={{ marginBottom: '64px' }}>
            <div className="carousel-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button type="button" onClick={prev} aria-label="Previous slide" className="carousel-btn" style={{
                flexShrink: 0, width: '36px', height: '36px', borderRadius: '4px',
                border: '1px solid var(--border-hover)', background: 'var(--surface)',
                color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.2s, color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>

              <div style={{
                position: 'relative', flex: 1, overflow: 'hidden',
                borderRadius: '4px', border: '1px solid var(--border-hover)',
                background: 'var(--bg)', aspectRatio: '1200/350',
              }}>
                {BANNERS.map((b, i) => {
                  const active = slide === i
                  return (
                    <div key={i} style={{
                      position: 'absolute', inset: 0,
                      opacity: active ? 1 : 0,
                      pointerEvents: active ? 'auto' : 'none',
                      transition: 'opacity 0.5s ease-in-out',
                      zIndex: active ? 10 : 0,
                    }}>
                      <img
                        alt={getLabel(b)}
                        src={b.img}
                        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )
                })}
              </div>

              <button type="button" onClick={next} aria-label="Next slide" className="carousel-btn" style={{
                flexShrink: 0, width: '36px', height: '36px', borderRadius: '4px',
                border: '1px solid var(--border-hover)', background: 'var(--surface)',
                color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.2s, color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {BANNERS.map((_, i) => (
                  <button
                    key={i} type="button" aria-label={`Slide ${i + 1}`}
                    onClick={() => setSlide(i)}
                    style={{
                      height: '6px', borderRadius: '1px', border: 'none', cursor: 'pointer',
                      width: slide === i ? '32px' : '12px',
                      background: slide === i ? 'var(--text)' : 'var(--border-hover)',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={e => { if (slide !== i) e.currentTarget.style.background = 'var(--surface-hover)' }}
                    onMouseLeave={e => { if (slide !== i) e.currentTarget.style.background = 'var(--border-hover)' }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--muted)', marginLeft: '8px', userSelect: 'none' }}>
                {String(slide + 1).padStart(2, '0')} / {String(BANNERS.length).padStart(2, '0')}
              </span>
            </div>
          </div>
          </Reveal>

          <Reveal delay={150}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            border: '1px solid var(--border)', background: 'var(--card-bg)',
            overflow: 'hidden',
          }} className="service-cards">
            {serviceCards.map((card, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px' }}>
                <h3 style={{
                  fontSize: '18px', fontWeight: 600, color: 'var(--text)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span style={{ color: 'var(--primary)', display: 'inline-flex' }}>{card.icon}</span>
                  {card.title}
                </h3>
                <p style={{
                  color: 'var(--primary)', fontWeight: 500, fontSize: '12px',
                  marginTop: '6px', textTransform: 'uppercase', letterSpacing: '1px',
                }}>{card.tag}</p>
                <p style={{ marginTop: '16px', fontSize: '14px', lineHeight: 1.7, color: 'var(--muted)', flex: 1 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
          </Reveal>
        </div>
      </section>

      <section id="stack" style={{
        padding: '80px 0', background: 'var(--bg)',
        color: 'var(--text)', borderTop: '1px solid var(--border)',
      }}>
        <div style={{ ...CONTAINER, textAlign: 'center' }}>
          <Reveal>
          {stackKeys.map((group, gi) => (
            <div key={gi} style={{ marginBottom: '48px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.3px', color: 'var(--text)', textAlign: 'center', marginBottom: '16px' }}>
                {group.label}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'center' }}>
                {group.items.map(([name, src]) => (
                  <StackTile key={name} name={name} src={src} />
                ))}
              </div>
            </div>
          ))}
          </Reveal>
        </div>
      </section>

      <section style={{
        padding: '96px 0', background: 'var(--bg)', borderTop: '1px solid var(--border)',
      }}>
        <div style={CONTAINER}>
          <Reveal style={{ textAlign: 'center', maxWidth: '768px', margin: '0 auto 80px' }}>
            <h2 style={{
              fontSize: 'clamp(30px, 4vw, 40px)', fontWeight: 700,
              letterSpacing: '-0.5px', color: 'var(--text)',
            }}>{t.process.title}</h2>
            <p style={{ marginTop: '16px', fontSize: '16px', lineHeight: 1.7, color: 'var(--muted)' }}>
              {t.process.subtitle}
            </p>
          </Reveal>

          <Reveal delay={100}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px',
            position: 'relative',
          }} className="process-grid">
            {processSteps.map((step, i) => (
              <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                {i < processSteps.length - 1 && (
                  <div style={{
                    position: 'absolute', top: '32px', left: '60%', right: '-40%',
                    height: '2px', background: 'var(--border)', zIndex: 0, display: 'none',
                  }} className="process-line" />
                )}
                <div style={{
                  position: 'relative', width: '64px', height: '64px', borderRadius: '2px',
                  border: '2px solid var(--border)', background: 'var(--card-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)', zIndex: 1,
                }}>
                  <span style={{ color: 'var(--muted)', display: 'inline-flex' }}>{step.icon}</span>
                  <span style={{
                    position: 'absolute', bottom: '-8px', right: '-8px',
                    padding: '2px 6px', borderRadius: '2px',
                    background: 'var(--primary)', color: '#000',
                    fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
                  }}>{step.num}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginTop: '24px' }}>{step.title}</h3>
                <p style={{ marginTop: '12px', fontSize: '14px', lineHeight: 1.7, color: 'var(--muted)', maxWidth: '240px' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          </Reveal>
        </div>
      </section>

      <section style={{
        padding: '96px 0', background: 'var(--bg)',
        color: 'var(--text)', borderTop: '1px solid var(--border)',
      }}>
        <div style={{ ...CONTAINER }}>
          <Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '560px' }}>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700,
              letterSpacing: '-0.5px', lineHeight: 1.15, color: 'var(--text)',
            }}>{t.security.title}</h2>
            <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              {t.security.subtitle}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' }}>
              {securityItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    flexShrink: 0, width: '40px', height: '40px', borderRadius: '2px',
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981',
                  }}>{item.icon}</div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>{item.title}</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      <section className="cta-section" style={{
        padding: '96px 0', background: 'var(--bg)', borderTop: '1px solid var(--border)',
      }}>
        <div style={CONTAINER}>
          <Reveal delay={100}>
          <div style={{
            position: 'relative', overflow: 'hidden', borderRadius: '0',
            border: '1px solid var(--border-hover)', background: 'var(--bg)',
            padding: '64px 32px', textAlign: 'center',
          }}>
            <h2 className="cta-title" style={{
              fontSize: '30px', fontWeight: 700,
              letterSpacing: '-0.5px', color: 'var(--text)', maxWidth: '672px', margin: '0 auto',
            }}>{t.cta.title}</h2>
            <p className="cta-desc" style={{
              marginTop: '16px', fontSize: '16px', lineHeight: 1.7,
              color: 'var(--text-secondary)', maxWidth: '576px', marginLeft: 'auto', marginRight: 'auto',
            }}>{t.cta.subtitle}</p>
            <div className="cta-buttons" style={{
              marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap',
            }}>
              <Link to={p('/register')} style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px 32px', background: 'var(--primary)', color: '#000',
                fontSize: '16px', fontWeight: 600, border: 'none', borderRadius: '6px',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >{t.cta.btn1}</Link>
              <Link to={p('/support/new')} style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px 32px', background: 'transparent',
                border: '1px solid var(--border-hover)', color: 'var(--text)',
                borderRadius: '6px',
                fontSize: '16px', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--primary)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
              >{t.cta.btn2}</Link>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        .hero-section { padding: 112px 0 64px; animation: heroFade 0.8s ease both; }
        @keyframes heroFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .hero-title-anim { animation: titleUp 0.8s ease 0.1s both; }
        @keyframes titleUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-desc-anim { animation: titleUp 0.8s ease 0.25s both; }
        .hero-cta-anim { animation: titleUp 0.8s ease 0.4s both; }
        .hero-left { grid-column: span 12 / span 12; padding: 32px 0; }
        .hero-right { display: none !important; }
        .hero-phone { height: 490px !important; }
        .hero-title { font-size: 36px; font-family: var(--font-brand); }
        .hero-desc { font-size: 14px; margin-top: 20px; }
        .hero-cta { margin-top: 32px; flex-direction: column; align-items: flex-start; gap: 24px; }
        .carousel-row { gap: 8px !important; }
        .carousel-btn { width: 36px !important; height: 36px !important; }
        .cta-title { font-size: 30px; }

        @media (min-width: 640px) {
          .hero-section { padding: 128px 0 0; }
          .hero-left { padding: 64px 0; }
          .hero-title { font-size: 48px; }
          .hero-desc { font-size: 16px; margin-top: 24px; }
          .hero-cta { margin-top: 40px; flex-direction: column; align-items: flex-start; gap: 24px; }
          .carousel-row { gap: 16px !important; }
          .carousel-btn { width: 44px !important; height: 44px !important; }
          .cta-title { font-size: 36px; }
        }
        @media (min-width: 768px) {
          .hero-title { font-size: 60px; }
          .hero-desc { font-size: 18px; }
          .cta-section > div > div { padding: 80px 64px !important; }
        }
        @media (min-width: 1024px) {
          .hero-left { grid-column: span 7 / span 7; padding: 96px 0; }
          .hero-title { font-size: 72px; }
          .hero-cta { flex-direction: row; align-items: center; gap: 32px; }
          .hero-right { display: flex !important; }
          .hero-phone { height: 640px !important; }
        }
        @media (min-width: 1280px) {
          .hero-phone { height: 700px !important; }
        }

        .service-cards > div { transition: background 0.3s ease, transform 0.3s ease; }
        .service-cards > div:hover { background: var(--surface-hover); }
        .process-grid > div { transition: transform 0.3s ease; }
        .process-grid > div:hover { transform: translateY(-4px); }

        @media (max-width: 900px) {
          .service-cards { grid-template-columns: 1fr !important; }
          .service-cards > div { border-bottom: 1px solid var(--border); }
          .service-cards > div:last-child { border-bottom: none; }
          .process-grid { grid-template-columns: 1fr !important; }
          .security-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 901px) {
          .service-cards > div:not(:last-child) { border-right: 1px solid var(--border); }
          .process-line { display: block; }
        }
      `}</style>
    </>
  )
}

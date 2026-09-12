import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import Reveal from '../components/Reveal'
import { POSTS } from '../data/blog.jsx'

export default function Blog() {
  const { lang, t } = useLanguage()
  const p = (path) => `/${lang}${path}`

  const [first, ...rest] = POSTS

  return (
    <div style={{ minHeight: '100vh', padding: '96px 24px 72px', maxWidth: '1100px', margin: '0 auto' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px',
          border: '1px solid var(--badge-border)', background: 'var(--badge-bg)',
          marginBottom: '20px', fontSize: '12px', fontWeight: 600,
          color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase',
        }}>
          {t.blog.badge}
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 46px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '14px' }}>
          {t.blog.title}
        </h1>
        <p style={{ fontSize: '17px', color: 'var(--muted)', maxWidth: '620px', margin: '0 auto', lineHeight: 1.7 }}>
          {t.blog.subtitle}
        </p>
      </Reveal>

      {first && (
        <Link
          to={p(`/blog/${first.slug}`)}
          className="card-lift"
          style={{ display: 'block', textDecoration: 'none', color: 'inherit', marginBottom: '40px', borderRadius: 0, overflow: 'hidden' }}
        >
          <div style={{ padding: '36px 32px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
              <span style={{
                padding: '4px 12px', background: 'var(--primary)', color: '#000',
                fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
              }}>{first.tag}</span>
              <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{first.date}</span>
              <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{first.author} · {first.readTime}</span>
            </div>
            <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 900, letterSpacing: '-0.8px', marginBottom: '12px', lineHeight: 1.2 }}>
              {first.title}
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '20px', maxWidth: '720px' }}>
              {first.excerpt}
            </p>
            <span className="arrow-link">
              {t.blog.read}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </span>
          </div>
        </Link>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {rest.map((post, i) => (
          <Reveal key={post.slug} delay={i * 60} style={{ height: '100%' }}>
            <Link to={p(`/blog/${post.slug}`)} className="card-lift" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px', textDecoration: 'none', color: 'inherit', borderRadius: 0 }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
                <span style={{
                  padding: '3px 10px', background: 'var(--badge-bg)', border: '1px solid var(--badge-border)',
                  color: 'var(--primary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
                }}>{post.tag}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{post.date}</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px', lineHeight: 1.35, marginBottom: '10px' }}>
                {post.title}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '18px', flex: 1 }}>
                {post.excerpt}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{post.author} · {post.readTime}</span>
                <span className="arrow-link">{t.blog.read}</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
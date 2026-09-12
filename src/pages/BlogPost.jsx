import { Link, useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import Reveal from '../components/Reveal'
import { getPost, relatedPosts, POSTS } from '../data/blog.jsx'

export default function BlogPost() {
  const { lang, t } = useLanguage()
  const { slug } = useParams()
  const p = (path) => `/${lang}${path}`

  const post = getPost(slug)
  const related = relatedPosts(slug, 2)

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', padding: '120px 24px', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '12px' }}>{t.checkout.notFoundTitle}</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '28px' }}>{t.blog.notFound}</p>
        <Link to={p('/blog')} className="btn-primary" style={{ color: '#000' }}>{t.blog.back}</Link>
      </div>
    )
  }

  const postIndex = POSTS.findIndex((x) => x.slug === post.slug)

  return (
    <div style={{ minHeight: '100vh', padding: '96px 24px 72px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <Reveal>
          <button onClick={() => window.history.back()} className="arrow-link" style={{ marginBottom: '24px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            {t.blog.back}
          </button>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span style={{
              padding: '4px 12px', background: 'var(--primary)', color: '#000',
              fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
            }}>{post.tag}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{post.date}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.12, marginBottom: '20px' }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #10B981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#000', fontSize: '14px', fontWeight: 800,
            }}>{post.author.charAt(0).toUpperCase()}</div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700 }}>{post.author}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{post.readTime || ''}</div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <p style={{ fontSize: '19px', fontWeight: 650, color: 'var(--text)', lineHeight: 1.7, marginBottom: '32px' }}>
            {post.excerpt}
          </p>

          {post.body.map((block, i) => {
            if (block.type === 'h2') {
              return (
                <h2 key={i} style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, letterSpacing: '-0.5px', margin: '32px 0 14px', lineHeight: 1.3 }}>
                  {block.text}
                </h2>
              )
            }
            return (
              <p key={i} style={{ fontSize: '15.5px', color: 'var(--muted)', lineHeight: 1.85, marginBottom: '18px' }}>
                {block.text}
              </p>
            )
          })}
        </Reveal>

        {related.length > 0 && (
          <Reveal style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
            <div style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 800 }}>{t.blog.related}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="rel-grid">
              {related.map((r) => (
                <Link key={r.slug} to={p(`/blog/${r.slug}`)} className="card-lift" style={{ padding: '20px', textDecoration: 'none', color: 'inherit', borderRadius: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)', marginBottom: '8px' }}>{r.tag}</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, lineHeight: 1.35 }}>{r.title}</div>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {postIndex > 0 ? (
            <Link to={p(`/blog/${POSTS[postIndex - 1].slug}`)} className="arrow-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              {t.blog.prev}
            </Link>
          ) : <span />}
          {postIndex < POSTS.length - 1 ? (
            <Link to={p(`/blog/${POSTS[postIndex + 1].slug}`)} className="arrow-link">
              {t.blog.next}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </Link>
          ) : <span />}
        </Reveal>

        <Reveal style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link to={p('/blog')} className="btn-ghost">{t.blog.back}</Link>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 620px) { .rel-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import Reveal from '../components/Reveal'

export default function Contact() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const inputStyle = {
    width: '100%', padding: '14px 18px', borderRadius: 0,
    border: '1px solid var(--border)', background: 'var(--input-bg)',
    color: 'var(--text)', fontSize: '15px', outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    display: 'block', fontSize: '13px', fontWeight: 600,
    color: 'var(--text-secondary)', marginBottom: '8px',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  }

  return (
    <div style={{ minHeight: '100vh', padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '16px' }}>
          {t.contact.title}
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          {t.contact.subtitle}
        </p>
      </Reveal>

      <Reveal delay={150}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px',
      }} className="contact-grid">
        <form onSubmit={handleSubmit} style={{
          padding: '40px', borderRadius: 0,
          border: '1px solid var(--border)', background: 'var(--card-bg)',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="contact-form-grid">
            <div>
              <label style={labelStyle}>{t.contact.name}</label>
              <input
                type="text" required
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>{t.contact.email}</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <label style={labelStyle}>{t.contact.subject}</label>
            <input
              type="text" required
              value={form.subject}
              onChange={e => setForm({...form, subject: e.target.value})}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <label style={labelStyle}>{t.contact.message}</label>
            <textarea
              rows={6} required
              value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <button type="submit" style={{
            marginTop: '24px', padding: '16px 40px', borderRadius: 0,
            border: 'none', background: sent ? '#059669' : 'var(--primary)',
            color: '#000', fontSize: '15px', fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.25s',
            boxShadow: 'none',
            width: '100%',
          }}
            onMouseEnter={e => { if (!sent) { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(-2px)' }}}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
          >
            {sent ? '\u2713 Message Sent!' : t.contact.send}
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            padding: '32px', borderRadius: 0,
            border: '1px solid var(--border)', background: 'var(--card-bg)',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>{t.contact.info}</h3>
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, text: t.contact.address },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, text: t.contact.phone },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, text: t.contact.hours },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '14px 0',
                borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ marginTop: '2px' }}>{item.icon}</div>
                <span style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>{item.text}</span>
              </div>
            ))}
          </div>

          <div style={{
            flex: 1, minHeight: '200px', borderRadius: 0,
            border: '1px solid var(--border)', background: 'var(--card-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=-74.006,40.7128,-73.98,40.75&layer=mapnik"
              style={{ width: '100%', height: '100%', border: 'none', minHeight: '200px' }}
              title="Map"
            />
          </div>
        </div>
      </div>
      </Reveal>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .contact-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

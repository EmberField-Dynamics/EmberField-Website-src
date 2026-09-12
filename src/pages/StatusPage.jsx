import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import Reveal from '../components/Reveal'
import { SYSTEMS, INCIDENTS, statusLabel, statusColor } from '../data/status.js'

const dotSvg = (color) => (
  <span style={{
    display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%',
    background: color, boxShadow: `0 0 0 4px ${color}22`,
  }} />
)

export default function StatusPage() {
  const { lang, t } = useLanguage()
  const p = (path) => `/${lang}${path}`
  const allOk = SYSTEMS.every((s) => s.status === 'operational')

  const systemName = (key) => t.status.systems[key] || key

  return (
    <div style={{ minHeight: '100vh', padding: '96px 24px 72px', maxWidth: '860px', margin: '0 auto' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px',
          border: '1px solid var(--badge-border)', background: 'var(--badge-bg)',
          marginBottom: '20px', fontSize: '12px', fontWeight: 600,
          color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase',
        }}>
          {t.status.badge}
        </div>
        <h1 style={{ fontSize: 'clamp(30px, 5vw, 42px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '14px' }}>
          {t.status.title}
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--muted)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
          {t.status.subtitle}
        </p>
      </Reveal>

      <Reveal style={{ marginBottom: '36px' }}>
        <div
          className="card-lift"
          style={{
            display: 'flex', alignItems: 'center', gap: '16px', padding: '28px', borderRadius: 0,
            borderColor: allOk ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)',
            background: allOk ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)',
          }}
        >
          {dotSvg(allOk ? '#10B981' : '#F59E0B')}
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)' }}>
              {allOk ? t.status.allOperational : t.status.partialOutage}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {t.status.lastUpdated} · {new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          {t.status.systemsTitle}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
          {SYSTEMS.map((sys) => (
            <div key={sys.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', padding: '16px 22px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {dotSvg(statusColor(sys.status))}
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>{systemName(sys.key)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', textAlign: 'right' }}>{t.status.uptime}: <b style={{ color: 'var(--text)' }}>{sys.uptime}</b></span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: statusColor(sys.status), minWidth: '96px', textAlign: 'right' }}>
                  {statusLabel(sys.status, t)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          {t.status.incidents}
        </div>
        {INCIDENTS.map((inc) => (
          <div key={inc.date} className="card-lift" style={{ padding: '22px', borderRadius: 0, marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <span style={{
                padding: '3px 10px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
                background: inc.status === 'maintenance' ? 'rgba(59,130,246,0.12)' : 'rgba(16,185,129,0.12)',
                color: inc.status === 'maintenance' ? '#3B82F6' : '#10B981',
                border: `1px solid ${inc.status === 'maintenance' ? 'rgba(59,130,246,0.35)' : 'rgba(16,185,129,0.35)'}`,
              }}>
                {inc.status === 'maintenance' ? t.status.maintenance : t.status.resolved}
              </span>
              <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{inc.date}</span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>{inc.title}</div>
            <div style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.7 }}>{inc.desc}</div>
          </div>
        ))}
      </Reveal>

      <Reveal style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '18px' }}>{t.status.notice}</div>
        <Link to={p('/support/new')} className="btn-ghost">{t.nav.contact}</Link>
      </Reveal>
    </div>
  )
}
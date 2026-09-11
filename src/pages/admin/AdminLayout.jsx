import { Outlet, Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'

const LINKS = [
  { id: '', label: 'Overview', icon: '▤' },
  { id: 'projects', label: 'Projects', icon: '▣' },
  { id: 'team', label: 'Team', icon: '▦' },
  { id: 'roles', label: 'Roles', icon: '◇' },
  { id: 'users', label: 'Users', icon: '◉' },
  { id: 'tickets', label: 'Tickets', icon: '☰' },
  { id: 'licenses', label: 'Licenses', icon: '§' },
  { id: 'promos', label: 'Promos', icon: '%' },
]

export default function AdminLayout() {
  const { lang } = useLanguage()
  const { user } = useAuth()
  const location = useLocation()
  const p = (path) => `/${lang}${path}`
  const base = p('/admin')

  const seg = location.pathname.replace(base, '').replace(/^\//, '')
  const active = seg || ''

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '96px 24px 64px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '11px', color: '#10B981', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px', fontFamily: 'monospace' }}>
          Emberfield Dynamics — Control Panel
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>Admin</h1>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }} className="admin-cols">
        <div style={{
          width: '190px', flexShrink: 0, position: 'sticky', top: '88px',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }} className="admin-nav">
          {LINKS.map(l => (
            <Link key={l.id || 'overview'} to={l.id ? `${base}/${l.id}` : base} style={{
              padding: '10px 14px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px',
              textTransform: 'uppercase', fontFamily: 'monospace',
              color: active === l.id ? '#10B981' : '#71717a',
              background: active === l.id ? 'rgba(16,185,129,0.08)' : 'transparent',
              border: `1px solid ${active === l.id ? 'rgba(16,185,129,0.3)' : '#252529'}`,
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <span>{l.icon}</span> {l.label}
            </Link>
          ))}
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #27272a' }}>
            <Link to={p('/dashboard')} style={{ padding: '10px 14px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'monospace', color: '#71717a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>←</span> Back to Dashboard
            </Link>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .admin-cols { flex-direction: column !important; }
          .admin-nav { position: static !important; width: 100% !important; flex-direction: row !important; overflow-x: auto; }
        }
      `}</style>
    </div>
  )
}
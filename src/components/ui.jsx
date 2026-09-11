export const BORDER = '#27272a'
export const PANEL = '#18181b'
export const PANEL_DARK = '#09090b'
export const ACCENT = '#10B981'
export const MUTED = '#71717a'
export const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

export function PageHead({ kicker, title, desc, actions }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
      <div>
        {kicker && (
          <div style={{ fontSize: '11px', fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontFamily: MONO }}>
            {kicker}
          </div>
        )}
        <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>{title}</h1>
        {desc && <p style={{ marginTop: '8px', fontSize: '14px', color: MUTED, lineHeight: 1.6, maxWidth: '560px' }}>{desc}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  )
}

export function Card({ children, style, as = 'div' }) {
  const Tag = as
  return (
    <Tag style={{
      background: PANEL, border: `1px solid ${BORDER}`,
      padding: '24px', borderRadius: 0, ...style,
    }}>
      {children}
    </Tag>
  )
}

export function Btn({ children, tone = 'ghost', variant, size = 'md', style, ...rest }) {
  const base = {
    border: 'none', cursor: 'pointer', fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    fontFamily: 'inherit', transition: 'background 0.15s, color 0.15s, opacity 0.15s',
  }
  const sizes = {
    sm: { padding: '6px 12px', fontSize: '12px' },
    md: { padding: '10px 18px', fontSize: '13px' },
    lg: { padding: '14px 28px', fontSize: '14px' },
  }
  const look = variant === 'solid' || tone === 'primary'
    ? { background: ACCENT, color: '#000' }
    : tone === 'danger'
      ? { background: 'transparent', border: '1px solid rgba(220,38,38,0.4)', color: '#DC2626' }
      : { background: 'transparent', border: '1px solid ' + BORDER, color: 'var(--text)' }
  return (
    <button style={{ ...base, ...sizes[size], ...look, ...style }}
      onMouseEnter={e => {
        if (variant === 'solid' || tone === 'primary') { e.currentTarget.style.background = '#0D9673' }
        else if (tone === 'danger') { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#fff' }
        else { e.currentTarget.style.background = '#27272a' }
      }}
      onMouseLeave={e => {
        if (variant === 'solid' || tone === 'primary') { e.currentTarget.style.background = ACCENT }
        else if (tone === 'danger') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#DC2626' }
        else { e.currentTarget.style.background = 'transparent' }
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Field({ label, children, hint }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{
        display: 'block', fontSize: '11px', fontWeight: 700, color: MUTED,
        textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px',
      }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: '12px', color: MUTED, marginTop: '6px' }}>{hint}</div>}
    </div>
  )
}

const controlBase = {
  width: '100%', background: PANEL_DARK, border: `1px solid ${BORDER}`,
  color: 'var(--text)', fontSize: '14px', padding: '10px 12px', borderRadius: 0,
  fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s',
}
export function Input(props) {
  return <input style={{ ...controlBase, ...props.style }}
    onFocus={e => { e.target.style.borderColor = ACCENT }}
    onBlur={e => { e.target.style.borderColor = BORDER }}
    {...props} />
}
export function TextArea(props) {
  return <textarea style={{ ...controlBase, minHeight: '90px', resize: 'vertical', ...props.style }}
    onFocus={e => { e.target.style.borderColor = ACCENT }}
    onBlur={e => { e.target.style.borderColor = BORDER }}
    {...props} />
}
export function Select(props) {
  return <select style={{ ...controlBase, cursor: 'pointer', appearance: 'auto', ...props.style }}
    onFocus={e => { e.target.style.borderColor = ACCENT }}
    onBlur={e => { e.target.style.borderColor = BORDER }}
    {...props} />
}

export function Badge({ tone = 'muted', children }) {
  const tones = {
    green: { bg: 'rgba(16,185,129,0.1)', color: '#10B981', border: 'rgba(16,185,129,0.3)' },
    amber: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
    red: { bg: 'rgba(220,38,38,0.1)', color: '#DC2626', border: 'rgba(220,38,38,0.3)' },
    blue: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: 'rgba(59,130,246,0.3)' },
    muted: { bg: '#18181b', color: '#a1a1aa', border: '#27272a' },
    accent: { bg: ACCENT, color: '#000', border: ACCENT },
  }
  const c = tones[tone] || tones.muted
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
      padding: '3px 8px', background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      fontFamily: MONO, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const map = {
    open: <Badge tone="green">Open</Badge>,
    closed: <Badge tone="muted">Closed</Badge>,
    active: <Badge tone="green">Active</Badge>,
    expired: <Badge tone="amber">Expired</Badge>,
    revoked: <Badge tone="red">Revoked</Badge>,
    general: <Badge tone="blue">General</Badge>,
    technical: <Badge tone="amber">Technical</Badge>,
    billing: <Badge tone="green">Billing</Badge>,
  }
  return map[status] || <Badge tone="muted">{status}</Badge>
}

export function Empty({ text, action }) {
  return (
    <div style={{
      padding: '48px 24px', textAlign: 'center', border: '1px dashed #27272a',
      background: PANEL,
    }}>
      <div style={{ fontSize: '13px', color: MUTED, fontFamily: MONO }}>{text}</div>
      {action && <div style={{ marginTop: '20px' }}>{action}</div>}
    </div>
  )
}

export function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function fmtTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export function shortTs(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function Avatar({ name, url, size = 36 }) {
  if (url) {
    return <img src={url} alt="" style={{ width: size, height: size, objectFit: 'cover', borderRadius: 0, border: '1px solid ' + BORDER, flexShrink: 0 }} />
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: 0, flexShrink: 0,
      background: PANEL_DARK, border: `1px solid ${BORDER}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.42), fontWeight: 800, color: ACCENT,
    }}>{(name || '?').charAt(0).toUpperCase()}</div>
  )
}
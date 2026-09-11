import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { PageHead, Card, Btn, StatusBadge, Empty, fmtDate, Select } from '../components/ui'

const CATS = ['general', 'technical', 'billing']

export default function Support() {
  const { lang } = useLanguage()
  const { user, loading } = useAuth()
  const p = (path) => `/${lang}${path}`

  const [tickets, setTickets] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [filter, setFilter] = useState('all')
  const [cat, setCat] = useState('all')

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data } = await supabase
        .from('tickets')
        .select('*')
        .or(`created_by.eq.${user.id},assignee_id.eq.${user.id}`)
        .order('updated_at', { ascending: false })
      setTickets(data || [])
      setLoadingData(false)
    })()
  }, [user?.id])

  if (loading) return <div style={{ padding: '120px 24px', textAlign: 'center', color: '#71717a', fontFamily: 'monospace' }}>LOADING…</div>
  if (!user) return <Navigate to={p('/login')} replace />

  const filtered = tickets.filter(t =>
    (filter === 'all' || t.status === filter) && (cat === 'all' || t.category === cat)
  )

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '104px 24px 64px' }}>
      <PageHead
        kicker="Support"
        title="My Tickets"
        desc="Create a support ticket or continue an existing conversation. Replies are emailed to you when a ticket is closed."
        actions={<Btn tone="primary" onClick={() => window.location.href = p('/support/new')}>New Ticket</Btn>}
      />

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <Select value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 'auto', minWidth: '140px' }}>
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </Select>
        <Select value={cat} onChange={e => setCat(e.target.value)} style={{ width: 'auto', minWidth: '140px' }}>
          <option value="all">All categories</option>
          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {loadingData && <Card><div style={{ color: '#71717a', fontSize: '13px', fontFamily: 'monospace' }}>LOADING…</div></Card>}
        {!loadingData && filtered.length === 0 && (
          <Empty text="No tickets match the current filters." action={<Link to={p('/support/new')}><Btn tone="primary">Create Ticket</Btn></Link>} />
        )}
        {filtered.map(t => (
          <Link key={t.id} to={p(`/support/ticket-${t.slug}`)} style={{ textDecoration: 'none' }}>
            <Card style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', transition: 'border-color 0.15s, background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1c1c1f'; e.currentTarget.style.borderColor = '#10B981' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#18181b'; e.currentTarget.style.borderColor = '#27272a' }}
            >
              <div style={{ flex: 1, minWidth: '180px' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>{t.title}</div>
                <div style={{ fontSize: '11px', color: '#71717a', fontFamily: 'monospace', marginTop: '4px' }}>
                  TICKET-{t.slug}
                  {t.assignee_id && t.assignee_id !== user.id ? ' · ASSIGNED' : ''}
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#71717a', fontFamily: 'monospace' }}>{fmtDate(t.created_at)}</div>
              <StatusBadge status={t.category} />
              <StatusBadge status={t.status} />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
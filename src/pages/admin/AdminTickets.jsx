import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Card, Btn, StatusBadge, Badge, Select, Empty } from '../../components/ui'

export default function AdminTickets() {
  const { lang } = useLanguage()
  const { user } = useAuth()
  const p = (path) => `/${lang}${path}`

  const [tickets, setTickets] = useState([])
  const [profiles, setProfiles] = useState({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState({})

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .order('updated_at', { ascending: false })
    setTickets(data || [])
    setLoading(false)
    if (data?.length) {
      const ids = new Set()
      data.forEach(t => { ids.add(t.created_by); if (t.assignee_id) ids.add(t.assignee_id) })
      const { data: prof } = await supabase.from('profiles').select('id, full_name, avatar_url').in('id', [...ids])
      const map = {}
      prof?.forEach(x => { map[x.id] = x })
      setProfiles(map)
    }
  }

  useEffect(() => { load() }, [])

  const toggle = async (t) => {
    setBusy(prev => ({ ...prev, [t.id]: true }))
    const closed = t.status !== 'closed'
    await supabase.from('tickets').update({
      status: closed ? 'closed' : 'open',
      closed_at: closed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }).eq('id', t.id)
    setBusy(prev => ({ ...prev, [t.id]: false }))
    load()
  }

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)' }}>Tickets</div>
          <div style={{ fontSize: '12px', color: '#71717a', marginTop: '2px' }}>All support tickets across the platform.</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Select value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 'auto', minWidth: '130px' }}>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </Select>
          <Btn onClick={load}>{loading ? '…' : 'Refresh'}</Btn>
        </div>
      </div>

      {loading && <div style={{ color: '#71717a', fontFamily: 'monospace', fontSize: '13px', padding: '20px 0' }}>LOADING TICKETS…</div>}
      {!loading && filtered.length === 0 && <Empty text="No tickets match." />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(t => {
          const author = t.created_by === user?.id ? user : profiles[t.created_by]
          return (
            <Card key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', padding: '14px 18px' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <Link to={p(`/support/ticket-${t.slug}`)} style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', textDecoration: 'none' }}>
                  {t.title}
                </Link>
                <div style={{ fontSize: '11px', color: '#71717a', fontFamily: 'monospace', marginTop: '3px' }}>
                  TICKET-{t.slug} · {author?.full_name || author?.email || 'Unknown'}
                </div>
              </div>
              {t.assignee_id && <Badge tone="blue">→ {(profiles[t.assignee_id]?.full_name || 'staff').split(' ')[0]}</Badge>}
              <StatusBadge status={t.category} />
              <StatusBadge status={t.status} />
              <Btn size="sm" tone={t.status === 'open' ? 'primary' : 'danger'} disabled={busy[t.id]} onClick={() => toggle(t)}>
                {busy[t.id] ? '…' : (t.status === 'open' ? 'Close' : 'Reopen')}
              </Btn>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
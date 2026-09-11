import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Card, MONO } from '../../components/ui'

export default function AdminOverview() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ users: 0, tickets: 0, open: 0, staff: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const [u, t] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('tickets').select('id', { count: 'exact', head: true }),
      ])
      const [op, st] = await Promise.all([
        supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).in('role', ['staff', 'admin']),
      ])
      setStats({
        users: u.count || 0,
        tickets: t.count || 0,
        open: op.count || 0,
        staff: st.count || 0,
      })
      setLoading(false)
    })()
  }, [])

  const tiles = [
    { label: 'Registered Users', value: stats.users },
    { label: 'Total Tickets', value: stats.tickets },
    { label: 'Open Tickets', value: stats.open },
    { label: 'Staff Accounts', value: stats.staff },
  ]

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: MONO, marginBottom: '6px' }}>Signed in as</div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>{user?.name} — {user?.role}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '32px' }}>
        {tiles.map(t => (
          <Card key={t.label} style={{ padding: '20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: MONO }}>{t.label}</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#10B981', marginTop: '8px', fontFamily: MONO }}>
              {loading ? '…' : String(t.value).padStart(2, '0')}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: MONO, marginBottom: '12px' }}>Status</div>
        <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text)' }}>
          The full site is split across dedicated sections — Projects, Team, Roles, Users, Tickets and Licenses — reachable from the panel on the left.
          Tickets can be viewed and replied to by any Staff or Admin account.
        </p>
      </Card>
    </div>
  )
}
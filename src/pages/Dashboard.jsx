import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { PageHead, Card, Btn, Badge, StatusBadge, Empty, fmtDate, MONO } from '../components/ui'

export default function Dashboard() {
  const { lang } = useLanguage()
  const { user, loading } = useAuth()
  const p = (path) => `/${lang}${path}`

  const [tickets, setTickets] = useState([])
  const [licenses, setLicenses] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data: tck } = await supabase
        .from('tickets')
        .select('*')
        .or(`created_by.eq.${user.id},assignee_id.eq.${user.id}`)
        .order('updated_at', { ascending: false })
      const { data: lic } = await supabase
        .from('licenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setTickets(tck || [])
      setLicenses(lic || [])
      setLoadingData(false)
    })()
  }, [user?.id])

  if (loading) return <div style={{ padding: '120px 24px', textAlign: 'center', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>LOADING…</div>
  if (!user) return <Navigate to={p('/login')} replace />

  const openCount = tickets.filter(t => t.status === 'open').length
  const activeLic = licenses.filter(l => l.status === 'active').length

  const stat = (label, value, suffix) => (
    <Card style={{ padding: '20px' }}>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: MONO }}>
        {label}
      </div>
      <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text)', marginTop: '10px', fontFamily: MONO }}>
        {value}
        {suffix && <span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>{suffix}</span>}
      </div>
    </Card>
  )

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '104px 24px 64px' }}>
      <PageHead
        kicker="Client Area"
        title={`Dashboard — ${user.name || 'Account'}`}
        desc="Overview of your tickets, licenses and account activity."
        actions={<Btn tone="primary" onClick={() => window.location.href = p('/support/new')}>New Ticket</Btn>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '40px' }}>
        {stat('Open Tickets', String(openCount).padStart(2, '0'))}
        {stat('Total Tickets', tickets.length)}
        {stat('Licenses', licenses.length)}
        {stat('Active', activeLic)}
        {stat('Role', user.role.toUpperCase(), '')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }} className="dash-cols">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text)' }}>Tickets</h2>
            <Link to={p('/support')} style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>VIEW ALL →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {loadingData && <Card><div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontFamily: MONO }}>LOADING…</div></Card>}
            {!loadingData && tickets.length === 0 && (
              <Empty text="No tickets yet. Open a support ticket when you need help." action={<Link to={p('/support/new')}><Btn tone="primary" size="md">Create Ticket</Btn></Link>} />
            )}
            {tickets.slice(0, 5).map(t => (
              <Link key={t.id} to={p(`/support/ticket/${t.slug}`)} style={{ textDecoration: 'none' }}>
                <Card style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{t.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: MONO, marginTop: '3px' }}>
                      TICKET-{t.slug} &nbsp;·&nbsp; {fmtDate(t.created_at)}
                    </div>
                  </div>
                  <StatusBadge status={t.category} />
                  <StatusBadge status={t.status} />
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text)' }}>Licenses</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{licenses.length} TOTAL</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {!loadingData && licenses.length === 0 && (
              <Empty text="No licenses assigned to this account yet." />
            )}
            {licenses.map(l => (
              <Card key={l.id} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '160px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{l.product}</div>
                  <div style={{ fontSize: '11px', color: '#10B981', fontFamily: MONO, marginTop: '3px' }}>{l.license_key}</div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: MONO }}>EXP {fmtDate(l.expires_at)}</div>
                <StatusBadge status={l.status} />
              </Card>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dash-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
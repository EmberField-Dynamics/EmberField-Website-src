import { useState, useEffect } from 'react'
import { Navigate, Link, useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Card, Btn, Badge, StatusBadge, TextArea, Select, Avatar, fmtTime, MONO } from '../components/ui'

export default function TicketDetail() {
  const { lang } = useLanguage()
  const { user, loading } = useAuth()
  const { slug } = useParams()
  const p = (path) => `/${lang}${path}`

  const [ticket, setTicket] = useState(null)
  const [messages, setMessages] = useState([])
  const [profiles, setProfiles] = useState({})
  const [notFound, setNotFound] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editBody, setEditBody] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [staffList, setStaffList] = useState([])
  const [closing, setClosing] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const isStaff = user && (user.role === 'staff' || user.role === 'admin')
  const isOwner = user && ticket && ticket.created_by === user.id
  const canManage = isStaff || isOwner

  const load = async () => {
    setLoadingData(true)
    const { data: t, error: tErr } = await supabase
      .from('tickets')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
    if (tErr || !t) { setNotFound(true); setLoadingData(false); return }

    const { data: msgs } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', t.id)
      .order('created_at', { ascending: true })

    setTicket(t)
    setMessages(msgs || [])
    setLoadingData(false)

    const ids = new Set()
    msgs?.forEach(m => ids.add(m.author_id))
    ids.add(t.created_by)
    if (t.assignee_id) ids.add(t.assignee_id)
    if (ids.size && isStaff) {
      const { data: prof } = await supabase
        .from('profiles').select('id, full_name, avatar_url').in('id', [...ids])
      const map = {}
      prof?.forEach(x => { map[x.id] = x })
      setProfiles(map)
    }
  }

  useEffect(() => {
    if (!user) return
    load()
  }, [user?.id, slug])

  useEffect(() => {
    if (isStaff) {
      supabase.from('profiles').select('id, full_name, role').in('role', ['staff', 'admin']).then(({ data }) => setStaffList(data || []))
    }
  }, [user?.id])

  if (loading) return <div style={{ padding: '120px 24px', textAlign: 'center', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>LOADING…</div>
  if (!user) return <Navigate to={p('/login')} replace />
  if (loadingData && !ticket) return <div style={{ padding: '120px 24px', textAlign: 'center', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>LOADING TICKET…</div>
  if (!ticket) return (
    <div style={{ padding: '120px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: MONO, marginBottom: '20px' }}>TICKET NOT FOUND</div>
      <Link to={p('/support')}><Btn>Back to Tickets</Btn></Link>
    </div>
  )

  const sendReply = async () => {
    if (!reply.trim()) return
    setError(''); setNotice(''); setSending(true)
    const { error: rErr } = await supabase
      .from('ticket_messages')
      .insert({ ticket_id: ticket.id, author_id: user.id, author_name: user.name || user.email, body: reply.trim() })
    setSending(false)
    if (rErr) { setError(rErr.message); return }
    setReply('')
    await supabase.from('tickets').update({ updated_at: new Date().toISOString() }).eq('id', ticket.id)
    load()
  }

  const saveEdit = async (msg) => {
    if (!editBody.trim()) return
    setSavingEdit(true)
    const { error: eErr } = await supabase
      .from('ticket_messages')
      .update({ body: editBody.trim(), edited_at: new Date().toISOString() })
      .eq('id', msg.id)
    setSavingEdit(false)
    if (eErr) { setError(eErr.message); return }
    setEditingId(null); setEditBody('')
    load()
  }

  const setStatus = async (status) => {
    setError(''); setNotice(''); setClosing(true)
    const patch = status === 'closed'
      ? { status, closed_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      : { status, closed_at: null, updated_at: new Date().toISOString() }
    const { error: sErr } = await supabase.from('tickets').update(patch).eq('id', ticket.id)
    if (sErr) { setClosing(false); setError(sErr.message); return }
    if (status === 'closed') {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const resp = await fetch('/api/ticket-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token || ''}` },
          body: JSON.stringify({ slug: ticket.slug }),
        })
        const json = await resp.json().catch(() => ({}))
        if (json.skipped) setNotice('Ticket closed. Transcript email is not configured on this deployment (set RESEND_API_KEY to enable).')
        else if (resp.ok) setNotice('Ticket closed. Transcript was emailed.')
        else setNotice('Ticket closed but the transcript email could not be sent: ' + (json.error || 'unknown error'))
      } catch {
        setNotice('Ticket closed.')
      }
    } else {
      setNotice('Ticket reopened.')
    }
    setClosing(false)
    load()
  }

  const assign = async (e) => {
    const val = e.target.value
    const { error: aErr } = await supabase.from('tickets').update({ assignee_id: val || null }).eq('id', ticket.id)
    if (aErr) { setError(aErr.message); return }
    load()
  }

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '104px 24px 64px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to={p('/support')} style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: MONO, textTransform: 'uppercase', letterSpacing: '1px' }}>← ALL TICKETS</Link>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ fontSize: '11px', color: '#10B981', fontFamily: MONO, marginBottom: '8px' }}>TICKET-{ticket.slug}</div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.3px', color: 'var(--text)' }}>{ticket.title}</h1>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
              <StatusBadge status={ticket.category} />
              <StatusBadge status={ticket.status} />
              {ticket.assignee_id ? <Badge tone="blue">Assigned</Badge> : <Badge tone="muted">Unassigned</Badge>}
            </div>
          </div>
          {(isStaff || canManage) && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {isStaff && (
                <Select value={ticket.assignee_id || ''} onChange={assign} style={{ width: 'auto', maxWidth: '200px' }}>
                  <option value="">Unassigned</option>
                  {staffList.filter(s => s.id !== user.id).map(s => (
                    <option key={s.id} value={s.id}>{s.full_name || s.id.slice(0, 8)}</option>
                  ))}
                </Select>
              )}
              {ticket.status === 'open'
                ? <Btn tone="primary" onClick={() => setStatus('closed')} disabled={closing}>{closing ? '…' : 'Close Ticket'}</Btn>
                : <Btn onClick={() => setStatus('open')} disabled={closing}>{closing ? '…' : 'Reopen'}</Btn>}
            </div>
          )}
        </div>
      </Card>

      {notice && <div style={{ marginBottom: '16px', padding: '12px 16px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)', fontSize: '13px', color: '#10B981', fontFamily: MONO }}>{notice}</div>}
      {error && <div style={{ marginBottom: '16px', padding: '12px 16px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.08)', fontSize: '13px', color: '#DC2626', fontFamily: MONO }}>{error}</div>}

      <Card style={{ padding: '0' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {loadingData && <div style={{ padding: '32px', color: 'var(--text-secondary)', fontFamily: MONO, fontSize: '13px' }}>LOADING TRANSCRIPT…</div>}
          {messages.map(m => {
            const mine = m.author_id === user.id
            const authorName = m.author_name || (profiles[m.author_id]?.full_name) || 'Team Member'
            const authorAvatar = profiles[m.author_id]?.avatar_url || (mine ? user.avatar : null)
            return (
              <div key={m.id} style={{
                padding: '20px 24px', borderBottom: '1px solid var(--border)',
                background: mine ? 'rgba(16,185,129,0.04)' : 'transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <Avatar name={authorName} url={authorAvatar} size={30} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>{authorName}</span>
                    {mine && <Badge tone="accent" style={{ marginLeft: '8px' }}>You</Badge>}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: MONO }}>
                    {fmtTime(m.created_at)}{m.edited_at && ' · edited'}
                  </span>
                  {mine && (
                    editingId === m.id
                      ? <Btn size="sm" onClick={() => setEditingId(null)}>Cancel</Btn>
                      : <Btn size="sm" onClick={() => { setEditingId(m.id); setEditBody(m.body) }}>Edit</Btn>
                  )}
                </div>
                {editingId === m.id ? (
                  <div>
                    <TextArea value={editBody} onChange={e => setEditBody(e.target.value)} style={{ minHeight: '80px' }} />
                    <div style={{ marginTop: '10px', textAlign: 'right' }}>
                      <Btn size="sm" tone="primary" onClick={() => saveEdit(m)} disabled={savingEdit}>{savingEdit ? '…' : 'Save Edit'}</Btn>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{m.body}</p>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ padding: '20px 24px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
            {ticket.status === 'open' ? 'Reply' : 'Closed — reopen to reply'}
          </label>
          <TextArea value={reply} onChange={e => setReply(e.target.value)} disabled={ticket.status !== 'open'}
            placeholder={ticket.status === 'open' ? 'Write your reply…' : 'This ticket is closed.'} />
          <div style={{ marginTop: '10px', textAlign: 'right' }}>
            <Btn tone="primary" onClick={sendReply} disabled={sending || ticket.status !== 'open' || !reply.trim()}>
              {sending ? 'SENDING…' : 'Send Reply'}
            </Btn>
          </div>
        </div>
      </Card>
    </div>
  )
}
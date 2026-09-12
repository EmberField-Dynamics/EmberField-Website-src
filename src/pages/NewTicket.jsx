import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { PageHead, Card, Btn, Field, Input, TextArea, Select, Badge } from '../components/ui'

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'
function genSlug() {
  const arr = new Uint32Array(12)
  crypto.getRandomValues(arr)
  let s = ''
  for (const n of arr) s += CHARS[n % CHARS.length]
  return s
}

export default function NewTicket() {
  const { lang } = useLanguage()
  const { user, loading } = useAuth()
  const p = (path) => `/${lang}${path}`
  const navigate = useNavigate()

  const [category, setCategory] = useState('technical')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (loading) return <div style={{ padding: '120px 24px', textAlign: 'center', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>LOADING…</div>
  if (!user) return <Navigate to={p('/login')} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (title.trim().length < 4) { setError('Title must be at least 4 characters.'); return }
    if (body.trim().length < 10) { setError('Describe your issue in at least 10 characters.'); return }
    setSaving(true)
    const slug = genSlug()

    const { data: ticket, error: tErr } = await supabase
      .from('tickets')
      .insert({ slug, title: title.trim(), category, created_by: user.id, status: 'open' })
      .select('id')
      .single()
    if (tErr || !ticket) {
      setSaving(false)
      setError(tErr?.message || 'Failed to create ticket.')
      return
    }
    const { error: mErr } = await supabase
      .from('ticket_messages')
      .insert({ ticket_id: ticket.id, author_id: user.id, body: body.trim() })
    setSaving(false)
    if (mErr) { setError(mErr.message || 'Ticket created but message could not be saved.'); return }
    navigate(p(`/support/ticket/${slug}`), { replace: true })
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '104px 24px 64px' }}>
      <PageHead
        kicker="Support"
        title="New Ticket"
        desc="Choose a category and describe your request. Our team replies on this ticket and you'll get the full transcript by email when it's closed."
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {['general', 'technical', 'billing'].map(c => (
              <button type="button" key={c} onClick={() => setCategory(c)} style={{
                padding: '8px 16px', border: `1px solid ${category === c ? '#10B981' : 'var(--border)'}`,
                background: category === c ? 'rgba(16,185,129,0.1)' : 'transparent',
                color: category === c ? '#10B981' : 'var(--text-secondary)', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px',
              }}>
                {c}
              </button>
            ))}
          </div>

          <Field label="Subject">
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Short summary of the issue" maxLength={80} />
          </Field>

          <Field label="Message">
            <TextArea value={body} onChange={e => setBody(e.target.value)} placeholder="Give us the details — what happened, what you expected, and what you tried." style={{ minHeight: '140px' }} />
          </Field>

          {error && <div style={{ marginBottom: '16px', fontSize: '13px', color: '#DC2626', fontFamily: 'monospace' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Btn type="submit" tone="primary" disabled={saving}>{saving ? 'CREATING…' : 'Create Ticket'}</Btn>
            <Btn type="button" onClick={() => navigate(p('/support'))} disabled={saving}>Cancel</Btn>
          </div>
        </Card>
      </form>
    </div>
  )
}
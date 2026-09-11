import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Card, Btn, Field, Input, Select, StatusBadge, Empty, fmtDate, MONO } from '../../components/ui'

function genKey() {
  const C = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const rand = (n) => { const a = new Uint32Array(n); crypto.getRandomValues(a); return a }
  const nums = rand(16)
  let s = ''
  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && i % 4 === 0) s += '-'
    s += C[nums[i] % C.length]
  }
  return s
}

export default function AdminLicenses() {
  const { user } = useAuth()
  const [licenses, setLicenses] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ user_id: '', product: 'EmberGuard', expires_at: '' })

  const load = async () => {
    setLoading(true)
    const [{ data: lic }, { data: us }] = await Promise.all([
      supabase.from('licenses').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, email, full_name').order('email'),
    ])
    setLicenses(lic || [])
    setUsers(us || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.user_id) { setMsg('Choose a user to assign the license to.'); return }
    setMsg('')
    const { error: err } = await supabase.from('licenses').insert({
      license_key: genKey(), user_id: form.user_id, product: form.product.trim() || 'EmberGuard',
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    })
    if (err) { setMsg(err.message); return }
    setForm({ user_id: '', product: 'EmberGuard', expires_at: '' })
    setShowAdd(false)
    load()
  }

  const setStatus = async (l, status) => {
    const { error } = await supabase.from('licenses').update({ status }).eq('id', l.id)
    if (error) { setMsg(error.message); return }
    load()
  }

  const remove = async (l) => {
    if (!window.confirm(`Delete license ${l.license_key}?`)) return
    await supabase.from('licenses').delete().eq('id', l.id)
    load()
  }

  const ownerName = (id) => {
    const u = users.find(x => x.id === id)
    return u?.full_name || u?.email || 'Unknown'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)' }}>Licenses</div>
          <div style={{ fontSize: '12px', color: '#71717a', marginTop: '2px' }}>{licenses.length} issued licenses.</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Btn onClick={load}>{loading ? '…' : 'Refresh'}</Btn>
          <Btn tone="primary" onClick={() => { setShowAdd(v => !v); setMsg('') }}>Issue License</Btn>
        </div>
      </div>

      {msg && <div style={{ marginBottom: '16px', padding: '10px 14px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.08)', fontSize: '13px', color: '#DC2626', fontFamily: 'monospace' }}>{msg}</div>}

      {showAdd && (
        <form onSubmit={submit} style={{ marginBottom: '24px' }}>
          <Card>
            <div style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', fontFamily: 'monospace' }}>Issue New License</div>
            <div className="lic-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <Field label="Assigned To">
                <Select value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })}>
                  <option value="">Select user…</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.full_name || '—'} ({u.email})</option>)}
                </Select>
              </Field>
              <Field label="Product">
                <Input value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} placeholder="EmberGuard" />
              </Field>
              <Field label="Expires (optional)">
                <Input type="date" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} />
              </Field>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Btn type="submit" tone="primary">Issue</Btn>
              <Btn type="button" onClick={() => setShowAdd(false)}>Cancel</Btn>
            </div>
          </Card>
        </form>
      )}

      {loading && <div style={{ color: '#71717a', fontFamily: 'monospace', fontSize: '13px', padding: '20px 0' }}>LOADING LICENSES…</div>}
      {!loading && licenses.length === 0 && <Empty text="No licenses issued yet." />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {licenses.map(l => (
          <Card key={l.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', padding: '14px 18px' }}>
            <div style={{ flex: 1, minWidth: '230px' }}>
              <div style={{ fontSize: '13px', color: '#10B981', fontFamily: MONO, letterSpacing: '0.5px' }}>{l.license_key}</div>
              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>
                {ownerName(l.user_id)}{l.user_id === user?.id ? ' (you)' : ''} · {l.product}
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#71717a', fontFamily: MONO }}>EXP {fmtDate(l.expires_at)}</div>
            <StatusBadge status={l.status} />
            <div style={{ display: 'flex', gap: '6px' }}>
              {l.status === 'active'
                ? <Btn size="sm" tone="danger" onClick={() => setStatus(l, 'revoked')}>Revoke</Btn>
                : <Btn size="sm" tone="primary" onClick={() => setStatus(l, 'active')}>Activate</Btn>}
              <Btn size="sm" tone="danger" onClick={() => remove(l)}>Delete</Btn>
            </div>
          </Card>
        ))}
      </div>
      <style>{`@media (max-width: 700px){ .lic-form { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
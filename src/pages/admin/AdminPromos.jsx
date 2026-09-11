import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Card, Btn, Field, Input, Badge, Empty, fmtDate, MONO } from '../../components/ui'

export default function AdminPromos() {
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ code: '', discount_percent: '', max_uses: '', expires_at: '' })

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setMsg(error.message)
    setPromos(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    const code = form.code.trim().toUpperCase().replace(/\s+/g, '')
    const discount = Number(form.discount_percent)
    if (!code) { setMsg('Enter a promo code.'); return }
    if (!discount || discount <= 0 || discount > 100) { setMsg('Discount must be between 1 and 100.'); return }
    setMsg('')
    const { error } = await supabase.from('promo_codes').insert({
      code,
      discount_percent: discount,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    })
    if (error) { setMsg(error.message); return }
    setForm({ code: '', discount_percent: '', max_uses: '', expires_at: '' })
    setShowAdd(false)
    load()
  }

  const toggle = async (c) => {
    const { error } = await supabase.from('promo_codes').update({ enabled: !c.enabled }).eq('id', c.id)
    if (error) { setMsg(error.message); return }
    load()
  }

  const remove = async (c) => {
    if (!window.confirm(`Delete promo code ${c.code}?`)) return
    const { error } = await supabase.from('promo_codes').delete().eq('id', c.id)
    if (error) { setMsg(error.message); return }
    load()
  }

  const usage = (c) => (c.max_uses == null ? `${c.times_used} uses` : `${c.times_used}/${c.max_uses} uses`)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)' }}>Promo Codes</div>
          <div style={{ fontSize: '12px', color: '#71717a', marginTop: '2px' }}>{promos.length} active promo codes.</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Btn onClick={load}>{loading ? '…' : 'Refresh'}</Btn>
          <Btn tone="primary" onClick={() => { setShowAdd(v => !v); setMsg('') }}>Create Promo</Btn>
        </div>
      </div>

      {msg && <div style={{ marginBottom: '16px', padding: '10px 14px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.08)', fontSize: '13px', color: '#DC2626', fontFamily: MONO }}>{msg}</div>}

      {showAdd && (
        <form onSubmit={submit} style={{ marginBottom: '24px' }}>
          <Card>
            <div style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', fontFamily: MONO }}>New Promo Code</div>
            <div className="promo-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
              <Field label="Code">
                <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="SUMMER10" style={{ textTransform: 'uppercase' }} />
              </Field>
              <Field label="Discount %">
                <Input type="number" value={form.discount_percent} onChange={e => setForm({ ...form, discount_percent: e.target.value })} min="1" max="100" placeholder="10" />
              </Field>
              <Field label="Max Uses (optional)">
                <Input type="number" value={form.max_uses} onChange={e => setForm({ ...form, max_uses: e.target.value })} placeholder="Unlimited" />
              </Field>
              <Field label="Expires (optional)">
                <Input type="date" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} />
              </Field>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Btn type="submit" tone="primary">Create</Btn>
              <Btn type="button" onClick={() => setShowAdd(false)}>Cancel</Btn>
            </div>
          </Card>
        </form>
      )}

      {loading && <div style={{ color: '#71717a', fontFamily: MONO, fontSize: '13px', padding: '20px 0' }}>LOADING PROMO CODES…</div>}
      {!loading && promos.length === 0 && <Empty text="No promo codes yet." />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {promos.map(c => (
          <Card key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', padding: '14px 18px' }}>
            <div style={{ flex: 1, minWidth: '230px' }}>
              <div style={{ fontSize: '13px', color: '#10B981', fontFamily: MONO, letterSpacing: '0.5px' }}>{c.code}</div>
              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>
                {c.discount_percent}% off · {usage(c)}{c.expires_at ? ` · EXP ${fmtDate(c.expires_at)}` : ''}
              </div>
            </div>
            <Badge tone={c.enabled ? 'green' : 'red'}>{c.enabled ? 'Active' : 'Disabled'}</Badge>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Btn size="sm" tone={c.enabled ? 'danger' : 'primary'} onClick={() => toggle(c)}>
                {c.enabled ? 'Disable' : 'Enable'}
              </Btn>
              <Btn size="sm" tone="danger" onClick={() => remove(c)}>Delete</Btn>
            </div>
          </Card>
        ))}
      </div>
      <style>{`@media (max-width: 700px){ .promo-form { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
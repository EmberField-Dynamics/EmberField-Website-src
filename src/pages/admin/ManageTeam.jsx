import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { Card, Btn, Field, Input, Select, Empty, Avatar } from '../../components/ui'
import ImageUpload from './ImageUpload'

export default function ManageTeam() {
  const { roles, members, addMember, updateMember, removeMember, getRoleName } = useAdmin()
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', roleId: '', avatar: '', tags: '' })

  const reset = () => { setForm({ name: '', roleId: '', avatar: '', tags: '' }); setShowAdd(false); setEditing(null) }

  const submit = (e) => {
    e.preventDefault()
    const payload = {
      name: form.name, roleId: form.roleId, avatar: form.avatar,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    if (editing) updateMember(editing, payload)
    else addMember(payload)
    reset()
  }

  const grouped = roles.map(r => ({ ...r, list: members.filter(m => m.roleId === r.id) }))
  const unassigned = members.filter(m => !m.roleId)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)' }}>Team Members</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{members.length} members shown on the Developers page.</div>
        </div>
        <Btn tone="primary" onClick={() => { reset(); setShowAdd(true) }}>Add Team Member</Btn>
      </div>

      {(showAdd || editing) && (
        <form onSubmit={submit} style={{ marginBottom: '24px' }}>
          <Card>
            <div style={{ display: 'flex', gap: '20px' }} className="form-top">
              <ImageUpload value={form.avatar} onChange={v => setForm({ ...form, avatar: v })} />
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="form-grid">
                <Field label="Name">
                  <Input required placeholder="e.g. John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </Field>
                <Field label="Role">
                  <Select value={form.roleId} onChange={e => setForm({ ...form, roleId: e.target.value })}>
                    <option value="">No Role</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </Select>
                </Field>
              </div>
            </div>
            <Field label="Feature Tags (comma-separated)">
              <Input placeholder="React, Node.js, Minecraft, APIs" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            </Field>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Btn type="submit" tone="primary">{editing ? 'Save Changes' : 'Add Member'}</Btn>
              <Btn type="button" onClick={reset}>Cancel</Btn>
            </div>
          </Card>
        </form>
      )}

      {grouped.filter(g => g.list.length).map(g => (
        <div key={g.id} style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#10B981', marginBottom: '12px', fontFamily: 'monospace' }}>
            {g.name} — {g.list.length}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {g.list.map(m => (
              <Card key={m.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <Avatar name={m.name} url={m.avatar} size={46} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>{m.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{g.name}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {m.tags.map((t, i) => (
                    <span key={i} style={{ fontSize: '10px', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 8px', fontFamily: 'monospace' }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Btn size="sm" style={{ flex: 1 }} onClick={() => { setEditing(m.id); setShowAdd(false); setForm({ name: m.name, roleId: m.roleId || '', avatar: m.avatar, tags: (m.tags || []).join(', ') }) }}>Edit</Btn>
                  <Btn size="sm" tone="danger" style={{ flex: 1 }} onClick={() => removeMember(m.id)}>Remove</Btn>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {unassigned.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', marginBottom: '12px', fontFamily: 'monospace' }}>
            No Role — {unassigned.length}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {unassigned.map(m => (
              <Card key={m.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <Avatar name={m.name} url={m.avatar} size={46} />
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>{m.name}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Btn size="sm" style={{ flex: 1 }} onClick={() => { setEditing(m.id); setShowAdd(false); setForm({ name: m.name, roleId: m.roleId || '', avatar: m.avatar, tags: (m.tags || []).join(', ') }) }}>Edit</Btn>
                  <Btn size="sm" tone="danger" style={{ flex: 1 }} onClick={() => removeMember(m.id)}>Remove</Btn>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      {members.length === 0 && <Empty text="No team members yet." />}
      <style>{`@media (max-width: 640px){ .form-top { flex-direction: column !important; } .form-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
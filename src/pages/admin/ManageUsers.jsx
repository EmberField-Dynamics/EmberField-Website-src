import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Card, Btn, Badge, Select, Avatar, Empty } from '../../components/ui'

export default function ManageUsers() {
  const { user, listUsers, setRole, adminCall } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [roleChange, setRoleChange] = useState({})
  const [adminAction, setAdminAction] = useState({})
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    const r = await listUsers()
    setLoading(false)
    if (r.success) setUsers(r.users)
  }

  useEffect(() => { load() }, [])

  const handleRole = async (id, role) => {
    setRoleChange(prev => ({ ...prev, [id]: true }))
    const r = await setRole(id, role)
    setRoleChange(prev => ({ ...prev, [id]: false }))
    if (r.success) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
      setMsg(`Role updated to ${role}.`)
    } else {
      setMsg(r.error)
    }
  }

  const handleReset = async (u) => {
    const pw = window.prompt(`Reset password for ${u.email}? Enter a new password (min 6 chars):`, '')
    if (!pw) return
    if (pw.length < 6) { setMsg('Password too short.'); return }
    setAdminAction(prev => ({ ...prev, [u.id]: 'reset' }))
    const r = await adminCall({ action: 'resetPassword', userId: u.id, newPassword: pw })
    setAdminAction(prev => ({ ...prev, [u.id]: '' }))
    setMsg(r.success ? `Password reset for ${u.email}.` : r.error)
  }

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete ${u.email} permanently? This cannot be undone.`)) return
    setAdminAction(prev => ({ ...prev, [u.id]: 'delete' }))
    const r = await adminCall({ action: 'deleteUser', userId: u.id })
    setAdminAction(prev => ({ ...prev, [u.id]: '' }))
    if (r.success) { setUsers(prev => prev.filter(x => x.id !== u.id)); setMsg(`Deleted ${u.email}.`) }
    else setMsg(r.error)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)' }}>Users</div>
          <div style={{ fontSize: '12px', color: '#71717a', marginTop: '2px' }}>{users.length} registered accounts.</div>
        </div>
        <Btn onClick={load}>{loading ? '…' : 'Refresh'}</Btn>
      </div>

      {msg && <div style={{ marginBottom: '16px', padding: '10px 14px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)', fontSize: '13px', color: '#10B981', fontFamily: 'monospace' }}>{msg}</div>}

      {loading && <div style={{ color: '#71717a', fontFamily: 'monospace', fontSize: '13px', padding: '20px 0' }}>LOADING USERS…</div>}
      {!loading && users.length === 0 && <Empty text="No registered users yet." />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {users.map(u => (
          <Card key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', padding: '14px 18px' }}>
            <Avatar name={u.full_name || u.email} url={u.avatar_url} size={40} />
            <div style={{ flex: 1, minWidth: '170px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                {u.full_name || '(No name)'}
                {u.id === user?.id && <Badge tone="accent">You</Badge>}
                {u.email === 'mcminedime@gmail.com' && <Badge tone="accent">Owner</Badge>}
              </div>
              <div style={{ fontSize: '12px', color: '#71717a', fontFamily: 'monospace' }}>{u.email}</div>
            </div>
            <div style={{ fontSize: '11px', color: '#71717a', fontFamily: 'monospace' }}>
              {u.password_set ? 'Password' : 'Google only'}
            </div>
            <Select value={u.role} disabled={u.id === user?.id}
              onChange={e => handleRole(u.id, e.target.value)}
              style={{ width: 'auto', minWidth: '110px', opacity: roleChange[u.id] ? 0.5 : 1, cursor: u.id === user?.id ? 'not-allowed' : 'pointer' }}>
              <option value="member">Member</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="banned">Banned</option>
            </Select>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Btn size="sm" disabled={u.id === user?.id || adminAction[u.id] === 'delete'} onClick={() => handleReset(u)}>
                {adminAction[u.id] === 'reset' ? '…' : 'Reset PW'}
              </Btn>
              <Btn size="sm" tone="danger" disabled={u.id === user?.id || adminAction[u.id] === 'reset'} onClick={() => handleDelete(u)}>
                {adminAction[u.id] === 'delete' ? '…' : 'Delete'}
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
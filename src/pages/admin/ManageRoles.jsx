import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { Card, Btn, Input, Empty } from '../../components/ui'

export default function ManageRoles() {
  const { roles, members, addRole, updateRole, removeRole, reorderRoles } = useAdmin()
  const [newRoleName, setNewRoleName] = useState('')
  const [editingRole, setEditingRole] = useState(null)
  const [roleEditName, setRoleEditName] = useState('')
  const [dragIdx, setDragIdx] = useState(null)

  const onDragStart = (e, idx) => { setDragIdx(idx); e.dataTransfer.effectAllowed = 'move' }
  const onDragOver = (e, idx) => { e.preventDefault(); if (dragIdx === null || dragIdx === idx) return; reorderRoles(dragIdx, idx); setDragIdx(idx) }
  const onDragEnd = () => setDragIdx(null)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)' }}>Roles</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Drag to reorder — the top role appears first on the Developers page.</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Input placeholder="New role name…" value={newRoleName} onChange={e => setNewRoleName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newRoleName.trim()) { addRole(newRoleName.trim()); setNewRoleName('') } }} style={{ width: '200px' }} />
          <Btn tone="primary" onClick={() => { if (newRoleName.trim()) { addRole(newRoleName.trim()); setNewRoleName('') } }}>Add Role</Btn>
        </div>
      </div>

      {roles.length === 0 && <Empty text="No roles yet." />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '560px' }}>
        {roles.map((role, idx) => (
          <div key={role.id} draggable onDragStart={e => onDragStart(e, idx)} onDragOver={e => onDragOver(e, idx)} onDragEnd={onDragEnd} style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            border: dragIdx === idx ? '1px solid #10B981' : '1px solid var(--border)',
            background: dragIdx === idx ? 'rgba(16,185,129,0.06)' : 'var(--surface)',
            cursor: 'grab', opacity: dragIdx === idx ? 0.7 : 1,
          }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace', minWidth: '28px' }}>#{String(idx + 1).padStart(2, '0')}</span>
            {editingRole === role.id ? (
              <Input autoFocus value={roleEditName} onChange={e => setRoleEditName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { updateRole(role.id, roleEditName); setEditingRole(null) } if (e.key === 'Escape') setEditingRole(null) }}
                onBlur={() => { updateRole(role.id, roleEditName); setEditingRole(null) }} style={{ flex: 1 }} />
            ) : (
              <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{role.name}</span>
            )}
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
              {members.filter(m => m.roleId === role.id).length} MEMBER{(members.filter(m => m.roleId === role.id).length === 1 ? '' : 'S')}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Btn size="sm" onClick={() => { setEditingRole(role.id); setRoleEditName(role.name) }}>Edit</Btn>
              <Btn size="sm" tone="danger" onClick={() => removeRole(role.id)}>Delete</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
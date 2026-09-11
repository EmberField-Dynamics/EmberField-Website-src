import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { useAdmin } from '../context/AdminContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import UsersTableSkeleton from '../components/UsersTableSkeleton'

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: '10px',
  border: '1px solid var(--border)', background: 'var(--input-bg)',
  color: 'var(--text)', fontSize: '14px', outline: 'none',
  transition: 'border-color 0.2s',
}

const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: 600,
  color: 'var(--text-secondary)', marginBottom: '6px',
  textTransform: 'uppercase', letterSpacing: '0.5px',
}

function ImageUpload({ value, onChange }) {
  const fileRef = useRef(null)
  const [preview, setPreview] = useState(value || '')

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert('Max 2MB'); return }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target.result
      setPreview(base64)
      onChange(base64)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} style={{ display: 'none' }}/>
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          width: '80px', height: '80px', borderRadius: '14px',
          border: '2px dashed var(--border-hover)', background: 'var(--input-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s',
          position: 'relative',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-hover)' }}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.2s',
            }} className="img-overlay">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" style={{ margin: '0 auto' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '4px' }}>Upload</div>
          </div>
        )}
      </div>
      {preview && (
        <button type="button" onClick={(e) => { e.stopPropagation(); setPreview(''); onChange('') }} style={{
          marginTop: '6px', fontSize: '11px', color: '#DC2626', background: 'none',
          border: 'none', cursor: 'pointer', padding: 0,
        }}>Remove</button>
      )}
      <style>{`.img-overlay:hover { opacity: 1 !important; }`}</style>
    </div>
  )
}

export default function Admin() {
  const { lang } = useLanguage()
  const { user, logout, listUsers, setRole, adminCall } = useAuth()
  const {
    roles, members, projects,
    addRole, updateRole, removeRole, reorderRoles,
    addMember, updateMember, removeMember,
    addProject, updateProject, removeProject,
  } = useAdmin()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('team')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', roleId: '', avatar: '', tags: '' })
  const [newRoleName, setNewRoleName] = useState('')
  const [editingRole, setEditingRole] = useState(null)
  const [roleEditName, setRoleEditName] = useState('')
  const [dragIdx, setDragIdx] = useState(null)

  const [showAddProject, setShowAddProject] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [projectForm, setProjectForm] = useState({ name: '', description: '', tags: '', link: '', image: '' })

  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [roleChange, setRoleChange] = useState({})
  const [adminAction, setAdminAction] = useState({})
  const [userMsg, setUserMsg] = useState('')

  const [promos, setPromos] = useState([])
  const [promosLoading, setPromosLoading] = useState(false)
  const [promoMsg, setPromoMsg] = useState('')
  const [promoForm, setPromoForm] = useState({ code: '', discount_percent: '10', max_uses: '', expires_at: '', enabled: true, note: '' })

  const loadPromos = async () => {
    setPromoMsg('')
    if (!isSupabaseConfigured()) { setPromoMsg('Supabase is not configured.'); setPromos([]); return }
    setPromosLoading(true)
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false })
    setPromosLoading(false)
    if (error) setPromoMsg(error.message)
    else setPromos(data || [])
  }

  useEffect(() => {
    if (user && user.role === 'admin' && activeTab === 'promos') loadPromos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const addPromo = async (e) => {
    e.preventDefault()
    if (!promoForm.code.trim()) return
    setPromoMsg('')
    const { error } = await supabase.from('promo_codes').insert({
      code: promoForm.code.trim().toUpperCase(),
      discount_percent: Math.max(0, Math.min(100, Number(promoForm.discount_percent) || 0)),
      max_uses: promoForm.max_uses ? Number(promoForm.max_uses) : null,
      expires_at: promoForm.expires_at ? new Date(promoForm.expires_at).toISOString() : null,
      enabled: promoForm.enabled,
      note: promoForm.note.trim() || null,
    })
    if (error) setPromoMsg(error.message)
    else {
      setPromoForm({ code: '', discount_percent: '10', max_uses: '', expires_at: '', enabled: true, note: '' })
      loadPromos()
    }
  }

  const togglePromo = async (promo) => {
    setPromoMsg('')
    const { error } = await supabase.from('promo_codes').update({ enabled: !promo.enabled }).eq('id', promo.id)
    if (error) setPromoMsg(error.message)
    else loadPromos()
  }

  const deletePromo = async (promo) => {
    if (!window.confirm(`Delete promo code ${promo.code}?`)) return
    setPromoMsg('')
    const { error } = await supabase.from('promo_codes').delete().eq('id', promo.id)
    if (error) setPromoMsg(error.message)
    else loadPromos()
  }

  const loadUsers = async () => {
    setUsersLoading(true)
    const result = await listUsers()
    setUsersLoading(false)
    if (result.success) setUsers(result.users)
    return result
  }

  useEffect(() => {
    if (user && user.role === 'admin') loadUsers()
  }, [])

  const handleResetPassword = async (u) => {
    const newPassword = window.prompt(`Reset password for ${u.email}?\nEnter a new password (min 6 characters):`, '')
    if (!newPassword) return
    if (newPassword.length < 6) { setUserMsg('Password too short (min 6 characters).'); return }
    setUserMsg(''); setAdminAction(prev => ({ ...prev, [u.id]: 'reset' }))
    const result = await adminCall({ action: 'resetPassword', userId: u.id, newPassword })
    setAdminAction(prev => ({ ...prev, [u.id]: '' }))
    setUserMsg(result.success ? `Password reset for ${u.email}.` : result.error)
  }

  const handleDeleteUser = async (u) => {
    if (!window.confirm(`Delete user ${u.email}?\nThis permanently removes their account and cannot be undone.`)) return
    setUserMsg(''); setAdminAction(prev => ({ ...prev, [u.id]: 'delete' }))
    const result = await adminCall({ action: 'deleteUser', userId: u.id })
    setAdminAction(prev => ({ ...prev, [u.id]: '' }))
    if (result.success) { setUsers(prev => prev.filter(x => x.id !== u.id)); setUserMsg(`User ${u.email} deleted.`) }
    else setUserMsg(result.error)
  }

  const handleRoleChange = async (userId, role) => {
    setRoleChange(prev => ({ ...prev, [userId]: true }))
    const result = await setRole(userId, role)
    setRoleChange(prev => ({ ...prev, [userId]: false }))
    if (result.success) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
    }
  }

  if (!user) {
    navigate(`/${lang}/login`)
    return null
  }

  const handleAdd = (e) => {
    e.preventDefault()
    addMember({
      name: form.name, roleId: form.roleId, avatar: form.avatar,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    setForm({ name: '', roleId: '', avatar: '', tags: '' })
    setShowAdd(false)
  }

  const handleEdit = (member) => {
    setEditing(member.id)
    setForm({
      name: member.name, roleId: member.roleId || '', avatar: member.avatar,
      tags: member.tags.join(', '),
    })
  }

  const handleSave = (e) => {
    e.preventDefault()
    updateMember(editing, {
      name: form.name, roleId: form.roleId, avatar: form.avatar,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    setEditing(null)
    setForm({ name: '', roleId: '', avatar: '', tags: '' })
  }

  const resetForm = () => {
    setForm({ name: '', roleId: '', avatar: '', tags: '' })
    setShowAdd(false)
    setEditing(null)
  }

  const handleAddProject = (e) => {
    e.preventDefault()
    addProject({
      name: projectForm.name,
      description: projectForm.description,
      tags: projectForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      link: projectForm.link,
      image: projectForm.image,
    })
    setProjectForm({ name: '', description: '', tags: '', link: '', image: '' })
    setShowAddProject(false)
  }

  const handleEditProject = (project) => {
    setEditingProject(project.id)
    setProjectForm({
      name: project.name,
      description: project.description,
      tags: project.tags.join(', '),
      link: project.link,
      image: project.image,
    })
  }

  const handleSaveProject = (e) => {
    e.preventDefault()
    updateProject(editingProject, {
      name: projectForm.name,
      description: projectForm.description,
      tags: projectForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      link: projectForm.link,
      image: projectForm.image,
    })
    setEditingProject(null)
    setProjectForm({ name: '', description: '', tags: '', link: '', image: '' })
  }

  const resetProjectForm = () => {
    setProjectForm({ name: '', description: '', tags: '', link: '', image: '' })
    setShowAddProject(false)
    setEditingProject(null)
  }

  const onDragStart = (e, idx) => { setDragIdx(idx); e.dataTransfer.effectAllowed = 'move' }
  const onDragOver = (e, idx) => { e.preventDefault(); if (dragIdx === null || dragIdx === idx) return; reorderRoles(dragIdx, idx); setDragIdx(idx) }
  const onDragEnd = () => setDragIdx(null)

  const tabs = [
    { id: 'team', label: 'Team Members', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
    { id: 'roles', label: 'Roles', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: 'projects', label: 'Projects', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
    { id: 'users', label: 'Users', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { id: 'promos', label: 'Promo Codes', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h8l10 10-8 8L3 11V3z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg> },
    { id: 'stats', label: 'Overview', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  ]

  return (
    <div style={{ minHeight: '100vh', padding: '80px 24px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px', animation: 'fadeInUp 0.6s ease-out' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '6px', background: 'var(--badge-bg)', border: '1px solid var(--badge-border)', fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Admin Panel
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px' }}>Dashboard</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Welcome back, {user.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate(`/${lang}/developers`)} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--input-bg)'}>View Public Page</button>
          <button onClick={() => { logout(); navigate(`/${lang}/`) }} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #DC2626', background: 'transparent', color: '#DC2626', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#fff' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#DC2626' }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', padding: '4px', borderRadius: '12px', background: 'var(--input-bg)', border: '1px solid var(--border)', width: 'fit-content', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === tab.id ? 'var(--surface)' : 'transparent', color: activeTab === tab.id ? 'var(--text)' : 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>{tab.icon} {tab.label}</button>
        ))}
      </div>

      {activeTab === 'roles' && (
        <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input
              placeholder="New role name..."
              value={newRoleName}
              onChange={e => setNewRoleName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && newRoleName.trim()) { addRole(newRoleName.trim()); setNewRoleName('') } }}
              style={{ ...inputStyle, maxWidth: '300px' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button onClick={() => { if (newRoleName.trim()) { addRole(newRoleName.trim()); setNewRoleName('') } }} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: '#000', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.25s' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(16,185,129,0.3)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>Add Role</button>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Drag roles to reorder. The top role appears first on the Developers page.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '500px' }}>
            {roles.map((role, idx) => (
              <div
                key={role.id}
                draggable
                onDragStart={e => onDragStart(e, idx)}
                onDragOver={e => onDragOver(e, idx)}
                onDragEnd={onDragEnd}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 18px', borderRadius: '12px',
                  border: dragIdx === idx ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: dragIdx === idx ? 'var(--badge-bg)' : 'var(--card-bg)',
                  cursor: 'grab', transition: 'all 0.2s',
                  opacity: dragIdx === idx ? 0.7 : 1,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" style={{ flexShrink: 0, cursor: 'grab' }}>
                  <circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/>
                </svg>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, minWidth: '24px' }}>#{idx + 1}</div>
                {editingRole === role.id ? (
                  <input
                    autoFocus value={roleEditName}
                    onChange={e => setRoleEditName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { updateRole(role.id, roleEditName); setEditingRole(null) } if (e.key === 'Escape') setEditingRole(null) }}
                    onBlur={() => { updateRole(role.id, roleEditName); setEditingRole(null) }}
                    style={{ ...inputStyle, flex: 1, padding: '6px 12px' }}
                  />
                ) : (
                  <span style={{ flex: 1, fontSize: '15px', fontWeight: 600 }}>{role.name}</span>
                )}
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {members.filter(m => m.roleId === role.id).length} member{members.filter(m => m.roleId === role.id).length !== 1 ? 's' : ''}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => { setEditingRole(role.id); setRoleEditName(role.name) }} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => removeRole(role.id)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(220,38,38,0.3)', background: 'transparent', color: '#DC2626', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
            {roles.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '14px', padding: '20px' }}>No roles yet. Create one above.</p>}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', animation: 'fadeInUp 0.6s ease-out' }}>
          {[
            { label: 'Team Members', value: members.length, color: 'var(--primary)' },
            { label: 'Roles', value: roles.length, color: '#F59E0B' },
            { label: 'Projects', value: projects.length, color: '#8B5CF6' },
            { label: 'With Images', value: members.filter(m => m.avatar).length + projects.filter(p => p.image).length, color: '#14B8A6' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '24px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: s.color, marginTop: '8px' }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'users' && (
        <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Registered Users</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>All accounts on the platform. Change roles to grant or revoke admin access.</p>
            </div>
            <button onClick={loadUsers} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/></svg>
              Refresh
            </button>
          </div>

          {usersLoading && <UsersTableSkeleton />}

          {userMsg && (
            <div style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--badge-bg)', color: 'var(--text)', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>{userMsg}</div>
          )}

          {!usersLoading && users.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', borderRadius: '14px', border: '1px dashed var(--border)', background: 'var(--card-bg)' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No registered users yet.</div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {users.map((u, i) => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card-bg)', animation: `fadeInUp 0.5s ease-out ${0.04 * i}s both` }}>
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt="" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}/>
                ) : (
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{(u.full_name || u.email || '?').charAt(0).toUpperCase()}</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {u.full_name || '(No name)'}
                    {u.email === 'mcminedime@gmail.com' && (
                      <span title="You" style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'var(--badge-bg)', border: '1px solid var(--badge-border)', color: 'var(--primary)' }}>YOU</span>
                    )}
                    {u.role === 'admin' && (
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}>ADMIN</span>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  {u.password_set ? 'Password set' : 'Google only'}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleResetPassword(u)}
                    disabled={adminAction[u.id] === 'delete'}
                    style={{
                      padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)',
                      background: 'transparent', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600,
                      cursor: adminAction[u.id] === 'delete' ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (!adminAction[u.id]) e.currentTarget.style.borderColor = 'var(--primary)' }}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    {adminAction[u.id] === 'reset' ? '...' : 'Reset Password'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u)}
                    disabled={u.id === user?.id || adminAction[u.id] === 'reset'}
                    style={{
                      padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.3)',
                      background: 'transparent', color: '#DC2626', fontSize: '12px', fontWeight: 600,
                      cursor: u.id === user?.id || adminAction[u.id] === 'reset' ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (u.id !== user?.id && !adminAction[u.id]) { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#fff' } }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#DC2626' }}
                  >
                    {adminAction[u.id] === 'delete' ? '...' : 'Delete'}
                  </button>
                </div>
                <select
                  value={u.role}
                  disabled={u.id === user?.id}
                  onChange={e => handleRoleChange(u.id, e.target.value)}
                  style={{
                    padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)',
                    background: 'var(--input-bg)', color: 'var(--text)', fontSize: '13px', fontWeight: 600,
                    cursor: u.id === user?.id ? 'not-allowed' : 'pointer', appearance: 'auto', opacity: roleChange[u.id] ? 0.5 : 1,
                  }}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'promos' && (
        <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Promo Codes</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Create discount codes that customers can use at checkout.</p>
            </div>
            <button onClick={loadPromos} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/></svg>
              Refresh
            </button>
          </div>

          {promoMsg && (
            <div style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--badge-bg)', color: 'var(--text)', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>{promoMsg}</div>
          )}

          <form onSubmit={addPromo} style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Add Promo Code</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Code</label>
                <input required placeholder="e.g. SUMMER25" value={promoForm.code} onChange={e => setPromoForm({...promoForm, code: e.target.value})} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}/>
              </div>
              <div>
                <label style={labelStyle}>Discount %</label>
                <input type="number" min="0" max="100" value={promoForm.discount_percent} onChange={e => setPromoForm({...promoForm, discount_percent: e.target.value})} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}/>
              </div>
              <div>
                <label style={labelStyle}>Max Uses (optional)</label>
                <input type="number" min="1" value={promoForm.max_uses} onChange={e => setPromoForm({...promoForm, max_uses: e.target.value})} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}/>
              </div>
              <div>
                <label style={labelStyle}>Expires (optional)</label>
                <input type="date" value={promoForm.expires_at} onChange={e => setPromoForm({...promoForm, expires_at: e.target.value})} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}/>
              </div>
              <div>
                <label style={labelStyle}>Note</label>
                <input placeholder="Optional note" value={promoForm.note} onChange={e => setPromoForm({...promoForm, note: e.target.value})} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}/>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                <input type="checkbox" checked={promoForm.enabled} onChange={e => setPromoForm({...promoForm, enabled: e.target.checked})} style={{ accentColor: 'var(--primary)' }}/>
                Enabled
              </label>
              <button type="submit" style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: '#000', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginLeft: 'auto', transition: 'all 0.25s' }} onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(16,185,129,0.3)' }} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none' }>
                Add Code
              </button>
            </div>
          </form>

          {promosLoading && <div style={{ padding: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>Loading...</div>}

          {!promosLoading && promos.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', borderRadius: '14px', border: '1px dashed var(--border)', background: 'var(--card-bg)' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No promo codes yet. Create one above.</div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {promos.map((promo, i) => (
              <div key={promo.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card-bg)', animation: `fadeInUp 0.5s ease-out ${0.04 * i}s both` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {promo.code}
                    {promo.enabled ? (
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}>ACTIVE</span>
                    ) : (
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', color: '#EF4444' }}>DISABLED</span>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {promo.discount_percent}% off{promo.max_uses ? ` · ${promo.times_used}/${promo.max_uses} used` : ''}{promo.expires_at ? ` · expires ${new Date(promo.expires_at).toLocaleDateString()}` : ''}{promo.note ? ` · ${promo.note}` : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => togglePromo(promo)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    {promo.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => deletePromo(promo)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.3)', background: 'transparent', color: '#DC2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#fff' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#DC2626' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <>
          <div style={{ marginBottom: '24px', animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
            <button onClick={() => { resetProjectForm(); setShowAddProject(true) }} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: '#000', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.25s' }} onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(16,185,129,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Project
            </button>
          </div>

          {(showAddProject || editingProject) && (
            <form onSubmit={editingProject ? handleSaveProject : handleAddProject} style={{ padding: '28px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)', marginBottom: '24px', animation: 'slideDown 0.2s ease' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>{editingProject ? 'Edit Project' : 'Add Project'}</h3>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }} className="admin-form-top">
                <ImageUpload value={projectForm.image} onChange={v => setProjectForm({...projectForm, image: v})}/>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Project Name</label>
                    <input required placeholder="e.g. EmberGuard Anticheat" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Link (e.g. /projects/configs)</label>
                    <input placeholder="e.g. /projects/emberguard" value={projectForm.link} onChange={e => setProjectForm({...projectForm, link: e.target.value})} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}/>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Description</label>
                <textarea placeholder="Brief description of the project..." value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}/>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Tags (comma-separated)</label>
                <input placeholder="e.g. Anticheat, Minecraft, Security" value={projectForm.tags} onChange={e => setProjectForm({...projectForm, tags: e.target.value})} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}/>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: '#000', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>{editingProject ? 'Save Changes' : 'Add Project'}</button>
                <button type="button" onClick={resetProjectForm} style={{ padding: '10px 24px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {projects.map((project, i) => (
              <div key={project.id} style={{ padding: '24px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--card-bg)', transition: 'all 0.3s', animation: `fadeInUp 0.6s ease-out ${0.05 * i}s both` }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(16,185,129,0.08)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                  {project.image && <img src={project.image} alt={project.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}/>}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{project.name}</div>
                    {project.link && <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '2px', fontFamily: 'monospace' }}>{project.link}</div>}
                  </div>
                </div>
                {project.description && <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>{project.description}</p>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {project.tags.map((tag, ti) => (
                    <span key={ti} style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--badge-bg)', border: '1px solid var(--badge-border)', fontSize: '11px', fontWeight: 600, color: 'var(--primary)' }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEditProject(project)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Edit</button>
                  <button onClick={() => removeProject(project.id)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.3)', background: 'transparent', color: '#DC2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#fff' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#DC2626' }}>Delete</button>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '14px', padding: '20px' }}>No projects yet. Create one above.</p>}
          </div>
        </>
      )}

      {activeTab === 'team' && (
        <>
          <div style={{ marginBottom: '24px', animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
            <button onClick={() => { resetForm(); setShowAdd(true) }} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: '#000', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.25s' }} onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(16,185,129,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Team Member
            </button>
          </div>

          {(showAdd || editing) && (
            <form onSubmit={editing ? handleSave : handleAdd} style={{ padding: '28px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)', marginBottom: '24px', animation: 'slideDown 0.2s ease' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>{editing ? 'Edit Team Member' : 'Add Team Member'}</h3>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }} className="admin-form-top">
                <ImageUpload value={form.avatar} onChange={v => setForm({...form, avatar: v})}/>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="admin-form-grid">
                    <div>
                      <label style={labelStyle}>Name</label>
                      <input required placeholder="e.g. John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}/>
                    </div>
                    <div>
                      <label style={labelStyle}>Role</label>
                      <select value={form.roleId} onChange={e => setForm({...form, roleId: e.target.value})} style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}>
                        <option value="">No Role</option>
                        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Feature Tags (comma-separated)</label>
                <input placeholder="e.g. React, Node.js, Minecraft, APIs" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}/>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: '#000', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>{editing ? 'Save Changes' : 'Add Member'}</button>
                <button type="button" onClick={resetForm} style={{ padding: '10px 24px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          )}

          {roles.map(role => {
            const roleMembers = members.filter(m => m.roleId === role.id)
            if (roleMembers.length === 0) return null
            return (
              <div key={role.id} style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '6px', background: 'var(--badge-bg)', border: '1px solid var(--badge-border)', fontSize: '12px', color: 'var(--primary)' }}>{role.name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>({roleMembers.length})</span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {roleMembers.map((member, i) => (
                    <MemberCard key={member.id} member={member} onEdit={handleEdit} onRemove={removeMember} index={i} roleName={role.name}/>
                  ))}
                </div>
              </div>
            )
          })}

          {(() => {
            const uncategorized = members.filter(m => !m.roleId)
            if (uncategorized.length === 0) return null
            return (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '6px', background: 'var(--input-bg)', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-secondary)' }}>No Role</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>({uncategorized.length})</span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {uncategorized.map((member, i) => (
                    <MemberCard key={member.id} member={member} onEdit={handleEdit} onRemove={removeMember} index={i} roleName="No Role"/>
                  ))}
                </div>
              </div>
            )
          })()}
        </>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-form-grid { grid-template-columns: 1fr !important; }
          .admin-form-top { flex-direction: column !important; }
        }
      `}</style>
    </div>
  )
}

function MemberCard({ member, onEdit, onRemove, index, roleName }) {
  return (
    <div style={{ padding: '24px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--card-bg)', transition: 'all 0.3s', animation: `fadeInUp 0.6s ease-out ${0.05 * index}s both` }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(16,185,129,0.08)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
        {member.avatar ? (
          <img src={member.avatar} alt={member.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}/>
        ) : (
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, color: '#fff' }}>{member.name.charAt(0).toUpperCase()}</div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 700 }}>{member.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{roleName}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
        {member.tags.map((tag, ti) => (
          <span key={ti} style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--badge-bg)', border: '1px solid var(--badge-border)', fontSize: '11px', fontWeight: 600, color: 'var(--primary)' }}>{tag}</span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => onEdit(member)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Edit</button>
        <button onClick={() => onRemove(member.id)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.3)', background: 'transparent', color: '#DC2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#fff' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#DC2626' }}>Remove</button>
      </div>
    </div>
  )
}

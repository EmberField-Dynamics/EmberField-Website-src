import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext()

const defaultRoles = [
  { id: 'role-1', name: 'Director', order: 0 },
  { id: 'role-2', name: 'Developer', order: 1 },
  { id: 'role-3', name: 'Designer', order: 2 },
]

const defaultMembers = [
  {
    id: '1', name: 'ITZ_PRIMEME', roleId: 'role-1', avatar: '',
    tags: ['Leadership', 'Strategy', 'Minecraft', 'Infrastructure'],
  },
  {
    id: '2', name: 'xDev', roleId: 'role-2', avatar: '',
    tags: ['React', 'Node.js', 'Minecraft Plugins', 'APIs'],
  },
  {
    id: '3', name: 'CodeCraft', roleId: 'role-2', avatar: '',
    tags: ['Python', 'Discord Bots', 'Backend', 'Databases'],
  },
]

export function AdminProvider({ children }) {
  const [roles, setRoles] = useState(() => {
    const saved = localStorage.getItem('ed-roles')
    return saved ? JSON.parse(saved) : defaultRoles
  })

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('ed-team')
    return saved ? JSON.parse(saved) : defaultMembers
  })

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('ed-projects')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('ed-roles', JSON.stringify(roles))
  }, [roles])

  useEffect(() => {
    localStorage.setItem('ed-team', JSON.stringify(members))
  }, [members])

  useEffect(() => {
    localStorage.setItem('ed-projects', JSON.stringify(projects))
  }, [projects])

  const addRole = (name) => {
    const id = 'role-' + Date.now()
    setRoles(prev => [...prev, { id, name, order: prev.length }])
  }

  const updateRole = (id, name) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, name } : r))
  }

  const removeRole = (id) => {
    setRoles(prev => prev.filter(r => r.id !== id))
    setMembers(prev => prev.map(m => m.roleId === id ? { ...m, roleId: '' } : m))
  }

  const reorderRoles = (fromIndex, toIndex) => {
    setRoles(prev => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next.map((r, i) => ({ ...r, order: i }))
    })
  }

  const addMember = (member) => {
    setMembers(prev => [...prev, { ...member, id: Date.now().toString() }])
  }

  const updateMember = (id, updates) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const removeMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  const addProject = (project) => {
    setProjects(prev => [...prev, { ...project, id: 'proj-' + Date.now(), order: prev.length }])
  }

  const updateProject = (id, updates) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const removeProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const sortedRoles = [...roles].sort((a, b) => a.order - b.order)
  const sortedProjects = [...projects].sort((a, b) => a.order - b.order)

  const getMembersForRole = (roleId) =>
    members.filter(m => m.roleId === roleId)

  const getUnassignedMembers = () =>
    members.filter(m => !m.roleId)

  const getRoleName = (roleId) => {
    const r = roles.find(r => r.id === roleId)
    return r ? r.name : 'Uncategorized'
  }

  return (
    <AdminContext.Provider value={{
      roles: sortedRoles,
      members,
      projects: sortedProjects,
      addRole, updateRole, removeRole, reorderRoles,
      addMember, updateMember, removeMember,
      addProject, updateProject, removeProject,
      getMembersForRole, getUnassignedMembers, getRoleName,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}

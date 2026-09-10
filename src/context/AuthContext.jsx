import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const ADMIN_USER = { email: 'mcminedime@gmail.com', password: 'andrej_11', name: 'Admin', role: 'admin' }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ed-user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) localStorage.setItem('ed-user', JSON.stringify(user))
    else localStorage.removeItem('ed-user')
  }, [user])

  const login = (email, password) => {
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      setUser({ email: ADMIN_USER.email, name: ADMIN_USER.name, role: 'admin' })
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const register = (name, email, password) => {
    setUser({ email, name, role: 'user' })
    return { success: true }
  }

  const logout = () => setUser(null)

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

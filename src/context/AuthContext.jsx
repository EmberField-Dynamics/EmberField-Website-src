import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const fetchProfile = async (authUser) => {
      if (!authUser) { setUser(null); return }
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, role, password_set, created_at')
        .eq('id', authUser.id)
        .maybeSingle()
      if (error || !data) {
        setUser({
          id: authUser.id, email: authUser.email, name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
          avatar: authUser.user_metadata?.avatar_url || null, role: 'member', passwordSet: true,
        })
        return
      }
      setUser({
        id: data.id, email: data.email, name: data.full_name, avatar: data.avatar_url,
        role: data.role, passwordSet: data.password_set, createdAt: data.created_at,
      })
    }

    supabase.auth.getSession().then(async ({ data }) => {
      await fetchProfile(data.session?.user)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, error: error.message }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, password_set')
      .eq('id', data.user.id)
      .maybeSingle()
    return {
      success: true,
      role: profile?.role || 'member',
      passwordSet: profile?.password_set ?? true,
    }
  }

  const signUp = async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: name, password_set: 'true' },
      },
    })
    if (error) return { success: false, error: error.message }
    return { success: true, user: data.user }
  }

  const signInWithGoogle = async () => {
    const redirectTo = `${window.location.origin}/${window.location.pathname.split('/')[1] || 'en'}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  const completeGoogleSetup = async (password) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) return { success: false, error: error.message }
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ password_set: true })
      .eq('id', user.id)
    if (profileError) return { success: false, error: profileError.message }
    return { success: true }
  }

  const linkGoogle = async () => {
    const redirectTo = `${window.location.origin}/${window.location.pathname.split('/')[1] || 'en'}/auth/callback`
    const { error } = await supabase.auth.linkIdentity({ provider: 'google', options: { redirectTo } })
    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  const updateProfile = async ({ full_name, avatar }) => {
    const updates = {}
    if (full_name !== undefined) updates.full_name = full_name
    if (avatar !== undefined) updates.avatar_url = avatar
    if (Object.keys(updates).length === 0) return { success: true }
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
    if (error) return { success: false, error: error.message }
    setUser(prev => ({
      ...prev,
      name: full_name !== undefined ? full_name : prev.name,
      avatar: avatar !== undefined ? avatar : prev.avatar,
    }))
    return { success: true }
  }

  const listUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, role, password_set, created_at')
      .order('created_at', { ascending: false })
    if (error) return { success: false, error: error.message }
    return { success: true, users: data }
  }

  const setRole = async (userId, role) => {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{
      user, loading, isAdmin,
      signIn, signUp, signInWithGoogle, completeGoogleSetup, linkGoogle,
      updateProfile, listUsers, setRole, logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
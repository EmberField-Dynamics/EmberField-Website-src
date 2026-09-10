import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL || 'https://umewdijfnbzonpmnxuor.supabase.co'
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtZXdkaWpmbmJ6b25wbW54dW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNTgzNjAsImV4cCI6MjEwNDYzNDM2MH0.NeYAGqAQWcyhbXwyh6Zmqt2FstMohKmU7cHu-qzGcOw'
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  const anon = createClient(url, anonKey)

  const { data: { user: caller }, error: authError } = await anon.auth.getUser(token)
  if (authError || !caller) return res.status(401).json({ error: 'Invalid session' })

  if (!serviceKey) return res.status(500).json({ error: 'Service role key not configured' })
  const admin = createClient(url, serviceKey)

  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', caller.id)
    .maybeSingle()

  if (!profile || profile.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const { action, userId, newPassword, newEmail } = req.body || {}

  if (action === 'resetPassword') {
    if (!userId || !newPassword) return res.status(400).json({ error: 'Missing userId or newPassword' })
    const { error } = await admin.auth.admin.updateUserById(userId, { password: newPassword })
    if (error) return res.status(400).json({ error: error.message })
    return res.json({ success: true })
  }

  if (action === 'updateEmail') {
    if (!userId || !newEmail) return res.status(400).json({ error: 'Missing userId or newEmail' })
    const { error } = await admin.auth.admin.updateUserById(userId, { email: newEmail })
    if (error) return res.status(400).json({ error: error.message })
    return res.json({ success: true })
  }

  if (action === 'deleteUser') {
    if (!userId) return res.status(400).json({ error: 'Missing userId' })
    if (userId === caller.id) return res.status(400).json({ error: 'You cannot delete your own account from here' })
    const { error } = await admin.auth.admin.deleteUser(userId)
    if (error) return res.status(400).json({ error: error.message })
    return res.json({ success: true })
  }

  return res.status(400).json({ error: 'Unknown action' })
}
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL || 'https://umewdijfnbzonpmnxuor.supabase.co'
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtZXdkaWpmbmJ6b25wbW54dW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNTgzNjAsImV4cCI6MjEwNDYzNDM2MH0.NeYAGqAQWcyhbXwyh6Zmqt2FstMohKmU7cHu-qzGcOw'
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  if (!serviceKey) return res.status(501).json({ error: 'Email not configured on this deployment', skipped: true })

  const anon = createClient(url, anonKey)
  const admin = createClient(url, serviceKey)

  const { data: { user: caller }, error: authError } = await anon.auth.getUser(token)
  if (authError || !caller) return res.status(401).json({ error: 'Invalid session' })

  const profile = await admin.from('profiles').select('role').eq('id', caller.id).maybeSingle()
  if (!profile.data || !['staff', 'admin'].includes(profile.data.role)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const { slug } = req.body || {}
  if (!slug) return res.status(400).json({ error: 'Missing slug' })

  const { data: ticket, error: tErr } = await admin
    .from('tickets').select('*').eq('slug', slug).maybeSingle()
  if (tErr || !ticket) return res.status(404).json({ error: 'Ticket not found' })

  const { data: owner, error: ownerErr } = await admin
    .from('profiles').select('email, full_name').eq('id', ticket.created_by).maybeSingle()
  if (ownerErr || !owner) return res.status(404).json({ error: 'Ticket owner not found' })

  const { data: messages } = await admin
    .from('ticket_messages').select('*').eq('ticket_id', ticket.id).order('created_at', { ascending: true })

  const lines = [
    `Your ticket ${ticket.title} (TICKET-${slug}) has been closed.`,
    '',
    `Category: ${ticket.category}`,
    `Opened:   ${new Date(ticket.created_at).toLocaleString()}`,
    `Closed:   ${new Date(ticket.closed_at || new Date()).toLocaleString()}`,
    '',
    '--------------- Transcript ---------------',
    '',
  ]
  ;(messages || []).forEach(m => {
    const name = m.author_name || 'Unknown'
    const time = new Date(m.created_at).toLocaleString()
    lines.push(`[${time}] ${name}${m.edited_at ? ' (edited)' : ''}:`, m.body, '')
  })
  lines.push('--------------------------------------', '')
  lines.push('If you need further help, open a new support ticket at our website.')
  const text = lines.join('\n')

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return res.status(501).json({ error: 'RESEND_API_KEY not set; transcript email skipped', skipped: true })

  const from = process.env.RESEND_FROM || 'Emberfield Dynamics <onboarding@resend.dev>'
  const to = owner.email
  if (!to) return res.status(400).json({ error: 'Owner has no email on file' })

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from, to: [to], subject: `Ticket ${ticket.title} — closed`, text }),
  })
  if (!r.ok) {
    const body = await r.text().catch(() => '')
    return res.status(502).json({ error: `Email provider error: ${r.status}`, detail: body })
  }
  return res.json({ success: true })
}
import { useState, useEffect, useRef } from 'react'
import { Navigate, Link, useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Card, Btn, Field, Input, PageHead, Badge } from '../components/ui'

const SECTIONS = [
  { id: 'my-profile', label: 'MY PROFILE', icon: '▣' },
  { id: 'account', label: 'ACCOUNT & LOGIN', icon: '◈' },
]

export default function Settings() {
  const { lang } = useLanguage()
  const { user, loading, updateProfile, linkGoogle, unlinkGoogle } = useAuth()
  const { section = 'my-profile' } = useParams()
  const p = (path) => `/${lang}${path}`

  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [saved, setSaved] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)

  const [pass, setPass] = useState('')
  const [passSaving, setPassSaving] = useState(false)
  const [passMsg, setPassMsg] = useState('')

  const [identities, setIdentities] = useState([])
  const [linking, setLinking] = useState(false)
  const [unlinking, setUnlinking] = useState(false)

  useEffect(() => {
    if (user) { setName(user.name || ''); setAvatar(user.avatar || null) }
  }, [user?.id])

  useEffect(() => {
    if (section !== 'account') return
    supabase.auth.getUserIdentities().then(({ data }) => setIdentities(data?.identities || []))
  }, [section, user?.id])

  if (loading) return <div style={{ padding: '120px 24px', textAlign: 'center', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>LOADING…</div>
  if (!user) return <Navigate to={p('/login')} replace />
  if (!SECTIONS.some(s => s.id === section)) return <Navigate to={p('/settings/my-profile')} replace />

  const googleLinked = identities.some(i => i.provider === 'google')

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Only image files are supported.'); return }
    if (file.size > 2 * 1024 * 1024) { setError('Image must be under 2MB.'); return }
    const reader = new FileReader()
    reader.onload = (ev) => setAvatar(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setError(''); setSaved(''); setSaving(true)
    let avatarUrl = avatar
    if (avatar && avatar.startsWith('data:')) {
      const ext = avatar.startsWith('data:image/png') ? 'png' : avatar.startsWith('data:image/webp') ? 'webp' : 'jpg'
      const base64Data = avatar.split(',')[1]
      const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(`${user.id}.${ext}`, bytes, { contentType: `image/${ext}`, upsert: true })
      if (upErr) { setSaving(false); setError(upErr.message); return }
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(`${user.id}.${ext}`)
      avatarUrl = publicUrl
    }
    const result = await updateProfile({ full_name: name.trim(), avatar: avatarUrl })
    setSaving(false)
    if (result.success) setSaved('Profile updated.')
    else setError(result.error)
  }

  const handleChangePass = async (e) => {
    e.preventDefault()
    setError(''); setPassMsg(''); setPassSaving(true)
    if (pass.length < 6) { setPassSaving(false); setError('Password must be at least 6 characters.'); return }
    const { error: pErr } = await supabase.auth.updateUser({ password: pass })
    setPassSaving(false)
    if (pErr) { setError(pErr.message); return }
    setPass(''); setPassMsg('Password updated.')
  }

  const doLink = async () => {
    setLinking(true); setError(''); setSaved('')
    const r = await linkGoogle()
    setLinking(false)
    if (!r.success) setError(r.error)
  }

  const doUnlink = async () => {
    setUnlinking(true); setError(''); setSaved('')
    const r = await unlinkGoogle()
    setUnlinking(false)
    if (r.success) { setIdentities(prev => prev.filter(i => i.provider !== 'google')) }
    else setError(r.error)
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '104px 24px 64px' }}>
      <PageHead kicker="Settings" title="Account Settings" desc="Manage your profile, password and connected sign-in methods." />

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }} className="settings-cols">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px', position: 'sticky', top: '88px' }} className="settings-nav">
          <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '8px' }}>{user.name || 'Account'}</div>
          {SECTIONS.map(s => (
            <Link key={s.id} to={p(`/settings/${s.id}`)} style={{
              padding: '10px 12px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px',
              textTransform: 'uppercase', fontFamily: "monospace",
              color: section === s.id ? '#10B981' : 'var(--text-secondary)',
              background: section === s.id ? 'rgba(16,185,129,0.08)' : 'transparent',
              border: `1px solid ${section === s.id ? 'rgba(16,185,129,0.3)' : 'transparent'}`,
            }}>
              {s.label}
            </Link>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {saved && <div style={{ marginBottom: '16px', padding: '10px 14px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)', fontSize: '13px', color: '#10B981', fontFamily: 'monospace' }}>{saved}</div>}
          {error && <div style={{ marginBottom: '16px', padding: '10px 14px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.08)', fontSize: '13px', color: '#DC2626', fontFamily: 'monospace' }}>{error}</div>}

          {section === 'my-profile' && (
            <form onSubmit={handleSaveProfile}>
              <Card>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px', fontFamily: 'monospace' }}>Avatar</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {avatar ? (
                      <img src={avatar} alt="" style={{ width: '72px', height: '72px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                    ) : (
                      <div style={{
                        width: '72px', height: '72px', border: '1px dashed var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px', fontWeight: 800, color: '#10B981', fontFamily: 'monospace',
                      }}>{(name || '?').charAt(0).toUpperCase()}</div>
                    )}
                    <div>
                      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }} onChange={handleAvatar} />
                      <Btn size="sm" type="button" onClick={() => fileRef.current?.click()}>Choose Image</Btn>
                      {avatar && avatar.startsWith('data:') && (
                        <div style={{ marginTop: '6px' }}>
                          <Btn size="sm" type="button" onClick={() => setAvatar(user.avatar || null)}>Reset</Btn>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Field label="Display Name">
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
                </Field>

                <Field label="Email" hint="Email cannot be changed here yet.">
                  <Input value={user.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                </Field>

                <Btn type="submit" tone="primary" disabled={saving}>{saving ? 'SAVING…' : 'Save Changes'}</Btn>
              </Card>
            </form>
          )}

          {section === 'account' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Card>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px', fontFamily: 'monospace' }}>Change Password</div>
                <form onSubmit={handleChangePass}>
                  <Field label="New Password" hint="At least 6 characters. You'll need to sign in again after changing it.">
                    <Input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
                  </Field>
                  {passMsg && <div style={{ marginBottom: '14px', fontSize: '13px', color: '#10B981', fontFamily: 'monospace' }}>{passMsg}</div>}
                  <Btn type="submit" disabled={passSaving}>{passSaving ? 'UPDATING…' : 'Update Password'}</Btn>
                </form>
              </Card>

              <Card>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px', fontFamily: 'monospace' }}>Connected Accounts</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Email &amp; Password</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{user.email}</div>
                  </div>
                  <Badge tone="green">Set up</Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Google</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{googleLinked ? 'Linked with ' + (user.email || 'your Google account') : 'Not linked'}</div>
                  </div>
                  {googleLinked
                    ? <Btn size="sm" tone="danger" onClick={doUnlink} disabled={unlinking}>{unlinking ? '…' : 'Unlink'}</Btn>
                    : <Btn size="sm" onClick={doLink} disabled={linking}>{linking ? '…' : 'Link Google'}</Btn>}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: 1.6 }}>
                  You can link Google for one-click sign-in. To unlink it you must keep at least one other sign-in method (Email &amp; Password), so you can't get locked out.
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .settings-cols { flex-direction: column !important; }
          .settings-nav { position: static !important; width: 100% !important; flex-direction: row !important; overflow-x: auto; }
        }
      `}</style>
    </div>
  )
}
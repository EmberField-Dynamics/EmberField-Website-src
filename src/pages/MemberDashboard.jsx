import { useState, useRef, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import PageSkeleton from '../components/PageSkeleton'

export default function MemberDashboard() {
  const { lang, t } = useLanguage()
  const { user, loading, updateProfile, linkGoogle, unlinkGoogle, logout } = useAuth()
  const p = (path) => `/${lang}${path}`

  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [saved, setSaved] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [linking, setLinking] = useState(false)
  const [unlinking, setUnlinking] = useState(false)
  const [googleLinked, setGoogleLinked] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    if (user) { setName(user.name || ''); setAvatar(user.avatar || null) }
  }, [user?.name, user?.avatar])

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data } = await supabase.auth.getUserIdentities()
      if (!active) return
      setGoogleLinked(!!data?.identities?.some(i => i.provider === 'google'))
    })()
    return () => { active = false }
  }, [])

  const handleUnlink = async () => {
    setError(''); setSaved(''); setUnlinking(true)
    const result = await unlinkGoogle()
    setUnlinking(false)
    if (result.success) { setGoogleLinked(false); setSaved(t.member.googleUnlinkMsg) }
    else setError(result.error)
  }

  if (loading) return <PageSkeleton count={2} />
  if (!user) return <Navigate to={p('/login')} replace />

  const inputStyle = {
    width: '100%', height: '50px', padding: '0 16px', borderRadius: '12px',
    border: '1px solid var(--border)', background: 'var(--input-bg)',
    color: 'var(--text)', fontSize: '15px', outline: 'none',
    transition: 'all 0.2s',
  }
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError(t.member.badImage); return }
    if (file.size > 2 * 1024 * 1024) { setError(t.member.maxSize); return }
    const reader = new FileReader()
    reader.onload = (ev) => setAvatar(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError(''); setSaved(''); setSaving(true)
    let avatarUrl = avatar
    if (avatar && avatar.startsWith('data:')) {
      const ext = avatar.startsWith('data:image/png') ? 'png' : avatar.startsWith('data:image/webp') ? 'webp' : 'jpg'
      const base64Data = avatar.split(',')[1]
      const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(`${user.id}.${ext}`, bytes, {
          contentType: `image/${ext}`, upsert: true,
        })
      if (uploadError) { setError(uploadError.message); setSaving(false); return }
      avatarUrl = supabase.storage.from('avatars').getPublicUrl(`${user.id}.${ext}`).data.publicUrl
    }
    const result = await updateProfile({ full_name: name, avatar: avatarUrl })
    setSaving(false)
    if (result.success) setSaved(t.member.saved)
    else setError(result.error)
  }

  const handleLinkGoogle = async () => {
    setError(''); setSaved(''); setLinking(true)
    const result = await linkGoogle()
    if (!result.success) { setLinking(false); setError(result.error) }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '80px 24px 40px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px', animation: 'fadeInUp 0.6s ease-out' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '6px', background: 'var(--badge-bg)', border: '1px solid var(--badge-border)', fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            Member Dashboard
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px' }}>{t.member.title}</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>{t.member.subtitle}</p>
        </div>
        <button onClick={() => { logout(); window.location.href = p('/') }} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #DC2626', background: 'transparent', color: '#DC2626', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#fff' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#DC2626' }}>{t.member.logout}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <div style={{ padding: '28px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)', animation: 'fadeInUp 0.6s ease-out 0.05s both' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>{t.member.profileTitle}</h3>

          {error && <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#DC2626', fontSize: '13px', marginBottom: '20px' }}>{error}</div>}
          {saved && <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981', fontSize: '13px', marginBottom: '20px' }}>{saved}</div>}

          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  width: '88px', height: '88px', borderRadius: '50%', cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
                  border: '2px dashed var(--border-hover)', background: 'var(--input-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
              >
                {avatar ? (
                  <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                ) : (
                  <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--primary)' }}>{name.charAt(0).toUpperCase() || '?'}</div>
                )}
              </div>
              <div>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatar} style={{ display: 'none' }}/>
                <button type="button" onClick={() => fileRef.current?.click()} style={{ padding: '9px 18px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>{t.member.changePhoto}</button>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>{user.email}</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>{t.member.fullName}</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}/>
            </div>

            <button type="submit" disabled={saving} style={{ width: '100%', height: '50px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: '#000', fontSize: '15px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, transition: 'all 0.25s' }} onMouseEnter={e => { if (!saving) e.currentTarget.style.boxShadow = '0 0 30px rgba(16,185,129,0.3)' }} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
              {saving ? 'Saving...' : t.member.save}
            </button>
          </form>
        </div>

        <div style={{ padding: '28px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)', animation: 'fadeInUp 0.6s ease-out 0.1s both', alignSelf: 'start' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{t.member.connectionsTitle}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>{t.member.connectionsDesc}</p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--input-bg)', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>Google</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{googleLinked ? user.email : t.member.notConnected}</div>
              </div>
            </div>
            {googleLinked ? (
              <button onClick={handleUnlink} disabled={unlinking} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.3)', background: 'transparent', color: '#DC2626', fontSize: '12px', fontWeight: 600, cursor: unlinking ? 'not-allowed' : 'pointer' }}>
                {unlinking ? '...' : t.member.unlinkGoogle}
              </button>
            ) : (
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{t.member.googleUnlinked}</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--input-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: 'var(--primary)' }}>{user.name.charAt(0).toUpperCase() || '?'}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{user.email}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Email &amp; Password</div>
              </div>
            </div>
            {!googleLinked && (
              <button onClick={handleLinkGoogle} disabled={linking} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '12px', fontWeight: 600, cursor: linking ? 'not-allowed' : 'pointer' }}>
                {linking ? 'Connecting...' : t.member.linkGoogle}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
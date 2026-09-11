import { useLanguage } from '../context/LanguageContext'
import { useAdmin } from '../context/AdminContext'
import Reveal from '../components/Reveal'

function MemberCard({ member }) {
  return (
    <div style={{
      padding: '28px', borderRadius: 0,
      border: '1px solid var(--border)', background: 'var(--card-bg)',
      backdropFilter: 'blur(10px)', textAlign: 'center',
      transition: 'all 0.3s', height: '100%',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'none' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {member.avatar ? (
        <img src={member.avatar} alt={member.name} style={{
          width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover',
          border: '3px solid var(--primary)', margin: '0 auto 16px', display: 'block',
        }}/>
      ) : (
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 16px',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', fontWeight: 800, color: '#fff', border: '3px solid var(--primary)',
        }}>{member.name.charAt(0).toUpperCase()}</div>
      )}
      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>{member.name}</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
        {member.tags.map((tag, ti) => (
          <span key={ti} style={{
            padding: '4px 10px', borderRadius: 0,
            background: 'var(--badge-bg)', border: '1px solid var(--badge-border)',
            fontSize: '11px', fontWeight: 600, color: 'var(--primary)',
          }}>{tag}</span>
        ))}
      </div>
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <a
      href={project.link || '#'}
      style={{
        padding: '24px', borderRadius: 0,
        border: '1px solid var(--border)', background: 'var(--card-bg)',
        backdropFilter: 'blur(10px)', textDecoration: 'none', color: 'inherit',
        transition: 'all 0.3s', display: 'block', height: '100%',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'none' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
        {project.image && <img src={project.image} alt={project.name} style={{ width: '48px', height: '48px', borderRadius: 0, objectFit: 'cover' }}/>}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>{project.name}</h3>
          {project.link && <span style={{ fontSize: '12px', color: 'var(--primary)', fontFamily: 'monospace' }}>{project.link}</span>}
        </div>
      </div>
      {project.description && <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>{project.description}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {project.tags.map((tag, ti) => (
          <span key={ti} style={{
            padding: '4px 10px', borderRadius: 0,
            background: 'var(--badge-bg)', border: '1px solid var(--badge-border)',
            fontSize: '11px', fontWeight: 600, color: 'var(--primary)',
          }}>{tag}</span>
        ))}
      </div>
    </a>
  )
}

export default function Developers() {
  const { t } = useLanguage()
  const { roles, members, projects, getMembersForRole, getUnassignedMembers } = useAdmin()

  const unassigned = getUnassignedMembers()

  return (
    <div style={{ minHeight: '100vh', padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '16px' }}>
          {t.developers.title}
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          {t.developers.subtitle}
        </p>
      </Reveal>

      {roles.map(role => {
        const roleMembers = getMembersForRole(role.id)
        if (roleMembers.length === 0) return null

        return (
          <Reveal key={role.id} style={{ marginBottom: '64px' }}>
            <h2 style={{
              fontSize: '24px', fontWeight: 800, marginBottom: '32px',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <span style={{
                padding: '8px 20px', borderRadius: 0,
                background: 'var(--badge-bg)', border: '1px solid var(--badge-border)',
                color: 'var(--primary)', fontSize: '14px', fontWeight: 700,
              }}>{role.name}</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {roleMembers.map((m, i) => <Reveal key={m.id} delay={i * 80}><MemberCard member={m}/></Reveal>)}
            </div>
          </Reveal>
        )
      })}

      {unassigned.length > 0 && (
        <Reveal style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '32px' }}>
            <span style={{ padding: '8px 20px', borderRadius: 0, background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '14px' }}>Team</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {unassigned.map((m, i) => <Reveal key={m.id} delay={i * 80}><MemberCard member={m}/></Reveal>)}
          </div>
        </Reveal>
      )}

      {projects.length > 0 && (
        <Reveal style={{ marginTop: '64px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>Projects</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {projects.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 100}><ProjectCard project={p}/></Reveal>)}
          </div>
        </Reveal>
      )}
    </div>
  )
}

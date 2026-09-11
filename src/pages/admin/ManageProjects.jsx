import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { Card, Btn, Field, Input, Select, TextArea, Empty } from '../../components/ui'
import ImageUpload from './ImageUpload'

export default function ManageProjects() {
  const { projects, addProject, updateProject, removeProject } = useAdmin()
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', tags: '', link: '', image: '' })

  const reset = () => { setForm({ name: '', description: '', tags: '', link: '', image: '' }); setShowAdd(false); setEditing(null) }

  const submit = (e) => {
    e.preventDefault()
    const payload = {
      name: form.name, description: form.description, link: form.link, image: form.image,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    if (editing) updateProject(editing, payload)
    else addProject(payload)
    reset()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)' }}>Projects</div>
          <div style={{ fontSize: '12px', color: '#71717a', marginTop: '2px' }}>{projects.length} listed on the Home page.</div>
        </div>
        <Btn tone="primary" onClick={() => { reset(); setShowAdd(true) }}>Add Project</Btn>
      </div>

      {(showAdd || editing) && (
        <form onSubmit={submit} style={{ marginBottom: '24px' }}>
          <Card>
            <div style={{ display: 'flex', gap: '20px' }} className="form-top">
              <ImageUpload value={form.image} onChange={v => setForm({ ...form, image: v })} />
              <div style={{ flex: 1 }}>
                <Field label="Project Name">
                  <Input required placeholder="e.g. EmberGuard Anticheat" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </Field>
                <Field label="Link (e.g. /projects/emberguard)">
                  <Input placeholder="/projects/…" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
                </Field>
              </div>
            </div>
            <Field label="Description">
              <TextArea placeholder="Brief description…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </Field>
            <Field label="Tags (comma-separated)">
              <Input placeholder="Anticheat, Minecraft, Security" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            </Field>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Btn type="submit" tone="primary">{editing ? 'Save Changes' : 'Add Project'}</Btn>
              <Btn type="button" onClick={reset}>Cancel</Btn>
            </div>
          </Card>
        </form>
      )}

      {projects.length === 0 && <Empty text="No projects yet." />}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
        {projects.map(proj => (
          <Card key={proj.id}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              {proj.image && <img src={proj.image} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', border: '1px solid #27272a' }} />}
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>{proj.name}</div>
                {proj.link && <div style={{ fontSize: '11px', color: '#10B981', fontFamily: 'monospace', marginTop: '2px' }}>{proj.link}</div>}
              </div>
            </div>
            {proj.description && <p style={{ fontSize: '13px', color: '#71717a', lineHeight: 1.6, marginBottom: '12px' }}>{proj.description}</p>}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {proj.tags.map((t, i) => (
                <span key={i} style={{ fontSize: '10px', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 8px', fontFamily: 'monospace', textTransform: 'uppercase' }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Btn size="sm" style={{ flex: 1 }} onClick={() => { setEditing(proj.id); setShowAdd(false); setForm({ name: proj.name, description: proj.description, link: proj.link, image: proj.image, tags: (proj.tags || []).join(', ') }) }}>Edit</Btn>
              <Btn size="sm" tone="danger" style={{ flex: 1 }} onClick={() => removeProject(proj.id)}>Delete</Btn>
            </div>
          </Card>
        ))}
      </div>
      <style>{`@media (max-width: 640px){ .form-top { flex-direction: column !important; } }`}</style>
    </div>
  )
}
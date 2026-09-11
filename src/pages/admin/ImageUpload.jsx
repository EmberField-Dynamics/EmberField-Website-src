import { useRef, useState } from 'react'

export default function ImageUpload({ value, onChange }) {
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
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} style={{ display: 'none' }} />
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          width: '80px', height: '80px', border: '2px dashed var(--border)',
          background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', overflow: 'hidden', position: 'relative', transition: 'border-color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#10B981' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
      >
        {preview ? (
          <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace', textTransform: 'uppercase' }}>Add</span>
        )}
      </div>
      {preview && (
        <button type="button" onClick={(e) => { e.stopPropagation(); setPreview(''); onChange('') }} style={{
          marginTop: '6px', fontSize: '11px', color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>Remove</button>
      )}
    </div>
  )
}
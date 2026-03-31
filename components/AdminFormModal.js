'use client'

import { useState, useEffect } from 'react'

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-mid)',
  borderRadius: 6,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  outline: 'none',
}

export default function AdminFormModal({ fields, initialData, onSave, onClose, title }) {
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData })
    } else {
      const defaults = {}
      fields.forEach(f => {
        defaults[f.key] = f.default ?? ''
      })
      setFormData(defaults)
    }
  }, [initialData, fields])

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave(formData)
    setSaving(false)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 24,
    }} onClick={onClose}>
      <div
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-mid)',
          borderRadius: 12,
          padding: '28px 24px',
          width: '100%',
          maxWidth: 500,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{
          margin: '0 0 20px',
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--text-primary)',
        }}>
          {title || (initialData ? 'Edit' : 'Create')}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {fields.map((field) => (
            <div key={field.key}>
              <label style={{
                display: 'block',
                fontSize: 10,
                color: 'var(--text-faint)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                marginBottom: 6,
              }}>
                {field.label}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <select
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === 'tags' ? (
                <input
                  type="text"
                  value={Array.isArray(formData[field.key]) ? formData[field.key].join(', ') : (formData[field.key] || '')}
                  onChange={(e) => handleChange(field.key, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="tag1, tag2, tag3"
                  style={inputStyle}
                />
              ) : field.type === 'number' ? (
                <input
                  type="number"
                  value={formData[field.key] ?? 0}
                  onChange={(e) => handleChange(field.key, parseInt(e.target.value) || 0)}
                  style={inputStyle}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  style={inputStyle}
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                padding: '10px',
                background: 'linear-gradient(135deg, #58A6FF, #1F6FEB)',
                border: 'none',
                borderRadius: 6,
                color: '#fff',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'SAVING...' : 'SAVE'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-mid)',
                borderRadius: 6,
                color: 'var(--text-muted)',
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

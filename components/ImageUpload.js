'use client'

import { useState } from 'react'

export default function ImageUpload({ supabase, bucket, currentUrl, onUploaded }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true })

    if (!error) {
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)
      onUploaded(publicUrl)
    }
    setUploading(false)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {currentUrl && (
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 6,
          background: `url(${currentUrl}) center/cover no-repeat`,
          border: '1px solid var(--border-mid)',
          flexShrink: 0,
        }} />
      )}
      <label style={{
        padding: '6px 14px',
        borderRadius: 6,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-mid)',
        color: 'var(--text-muted)',
        fontSize: 10,
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        cursor: 'pointer',
        letterSpacing: '0.06em',
      }}>
        {uploading ? 'UPLOADING...' : 'UPLOAD'}
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleUpload}
          style={{ display: 'none' }}
          disabled={uploading}
        />
      </label>
    </div>
  )
}

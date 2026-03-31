'use client'

import { useState } from 'react'

export default function CivicCard({ project, index }) {
  const [hovered, setHovered] = useState(false)
  const isDeployed = project.status === 'deployed'

  const handleClick = () => {
    if (isDeployed && project.url) {
      window.open(project.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-surface)' : '#080B10',
        border: `1px solid ${hovered ? (project.color || '#58A6FF') + '44' : 'var(--border-dim)'}`,
        borderRadius: 10,
        padding: '22px 20px 18px',
        cursor: isDeployed ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        animation: `fade-up 0.5s ease ${index * 0.08}s both`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {hovered && (
        <div style={{
          position: 'absolute', top: -50, right: -50,
          width: 150, height: 150, borderRadius: '50%',
          background: `radial-gradient(circle, ${project.color || '#58A6FF'}12, transparent)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: project.logo_url
            ? `url(${project.logo_url}) center/cover no-repeat`
            : `linear-gradient(135deg, ${project.color || '#58A6FF'}, ${project.color || '#58A6FF'}77)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hovered ? `0 0 24px ${project.color || '#58A6FF'}33` : 'none',
          transition: 'box-shadow 0.3s',
          overflow: 'hidden',
        }}>
          {!project.logo_url && (
            <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {project.name?.charAt(0)}
            </span>
          )}
        </div>
        <span style={{
          display: 'flex', alignItems: 'center', gap: 4,
          color: isDeployed ? 'var(--accent-green)' : 'var(--accent-yellow)',
          fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700,
          letterSpacing: '0.12em',
        }}>
          {isDeployed && (
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-green)' }} />
          )}
          {isDeployed ? 'DEPLOYED' : 'PENDING'}
        </span>
      </div>

      {/* Title */}
      <h2 style={{
        margin: '0 0 3px', fontSize: 17, fontWeight: 800,
        color: 'var(--text-primary)', letterSpacing: '0.01em', lineHeight: 1.2,
      }}>
        {project.name}
      </h2>
      {project.subtitle && (
        <div style={{
          fontSize: 9, color: project.color || '#58A6FF', letterSpacing: '0.12em',
          fontWeight: 700, marginBottom: 10, fontFamily: 'var(--font-mono)',
        }}>
          {project.subtitle}
        </div>
      )}

      {/* Description */}
      <p style={{
        margin: '0 0 14px', fontSize: 12,
        color: 'var(--text-muted)', lineHeight: 1.65, flex: 1,
      }}>
        {project.description}
      </p>

      {/* Tags */}
      {project.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {project.tags.map((tag, i) => (
            <span key={i} style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)',
              borderRadius: 4, padding: '3px 8px',
              fontSize: 9, color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Launch indicator */}
      {isDeployed && hovered && (
        <div style={{
          position: 'absolute', bottom: 12, right: 14,
          color: project.color || '#58A6FF', fontSize: 10, fontWeight: 700,
          fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          LAUNCH →
        </div>
      )}
    </div>
  )
}

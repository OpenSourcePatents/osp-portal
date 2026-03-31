'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import PageShell from '@/components/PageShell'

const CATEGORY_COLORS = {
  defense: '#EF4444',
  energy: '#22C55E',
  food: '#F59E0B',
  fintech: '#3B82F6',
  civic: '#A855F7',
  other: '#8B949E',
}

const STATUS_LABELS = {
  concept: { label: 'CONCEPT', color: 'var(--text-faint)' },
  provisional_filed: { label: 'PROVISIONAL FILED', color: 'var(--accent-orange)' },
  published: { label: 'PUBLISHED', color: 'var(--accent-green)' },
  pending: { label: 'PENDING', color: 'var(--accent-yellow)' },
}

function ItarWall({ onAccept }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 57px)',
      padding: 24,
    }}>
      <div style={{
        maxWidth: 600,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--accent-red)',
        borderRadius: 12,
        padding: '40px 32px',
        animation: 'fade-up 0.5s ease both',
      }}>
        <div style={{
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: 'var(--accent-red)',
          letterSpacing: '0.15em',
          marginBottom: 16,
        }}>
          ⚠ ITAR / EAR NOTICE
        </div>

        <h2 style={{
          margin: '0 0 16px',
          fontSize: 22,
          fontWeight: 800,
          color: 'var(--text-primary)',
        }}>
          Export Control Disclaimer
        </h2>

        <div style={{
          fontSize: 13,
          color: 'var(--text-muted)',
          lineHeight: 1.8,
          marginBottom: 24,
        }}>
          <p style={{ margin: '0 0 12px' }}>
            Some concepts in this portfolio may relate to technologies subject to the
            International Traffic in Arms Regulations (ITAR) or Export Administration
            Regulations (EAR).
          </p>
          <p style={{ margin: '0 0 12px' }}>
            All information presented here is derived from publicly available sources
            and published under open licenses (CC0 / Apache 2.0). Nothing on this page
            constitutes controlled technical data.
          </p>
          <p style={{ margin: 0 }}>
            By proceeding, you acknowledge that you understand this notice and that you
            are responsible for your own compliance with applicable export control laws.
          </p>
        </div>

        <div style={{
          padding: '12px 16px',
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: 8,
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-faint)',
          lineHeight: 1.7,
          marginBottom: 24,
        }}>
          This is not legal advice. OpenSourcePatents does not provide legal counsel.
          Consult qualified export control counsel for specific guidance.
        </div>

        <button
          onClick={onAccept}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #EF4444, #B91C1C)',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.08em',
            cursor: 'pointer',
          }}
        >
          I ACKNOWLEDGE — PROCEED
        </button>
      </div>
    </div>
  )
}

function PatentCard({ patent, index }) {
  const [hovered, setHovered] = useState(false)
  const catColor = CATEGORY_COLORS[patent.category] || '#8B949E'
  const statusInfo = STATUS_LABELS[patent.status] || STATUS_LABELS.concept

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-surface)' : '#080B10',
        border: `1px solid ${hovered ? catColor + '44' : 'var(--border-dim)'}`,
        borderRadius: 10,
        padding: '22px 20px 18px',
        transition: 'all 0.3s ease',
        animation: `fade-up 0.5s ease ${index * 0.06}s both`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {hovered && (
        <div style={{
          position: 'absolute', top: -50, right: -50,
          width: 150, height: 150, borderRadius: '50%',
          background: `radial-gradient(circle, ${catColor}12, transparent)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Category + Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{
          padding: '3px 10px',
          borderRadius: 4,
          background: catColor + '15',
          border: `1px solid ${catColor}25`,
          fontSize: 9,
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: catColor,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          {patent.category}
        </span>
        <span style={{
          fontSize: 9,
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: statusInfo.color,
          letterSpacing: '0.08em',
        }}>
          {statusInfo.label}
        </span>
      </div>

      {/* Name */}
      <h3 style={{
        margin: '0 0 8px', fontSize: 18, fontWeight: 800,
        color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
      }}>
        {patent.name}
      </h3>

      {/* Description */}
      <p style={{
        margin: 0, fontSize: 12,
        color: 'var(--text-muted)', lineHeight: 1.65,
      }}>
        {patent.description}
      </p>

      {/* Links */}
      {(patent.repo_url || patent.document_url) && (
        <div style={{
          display: 'flex', gap: 8, marginTop: 14,
        }}>
          {patent.repo_url && (
            <a
              href={patent.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '5px 12px', borderRadius: 4,
                background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)',
                fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600,
                color: 'var(--accent-blue)',
              }}
            >
              REPO →
            </a>
          )}
          {patent.document_url && (
            <a
              href={patent.document_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '5px 12px', borderRadius: 4,
                background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)',
                fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600,
                color: 'var(--accent-orange)',
              }}
            >
              PDF →
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default function PatentsPage() {
  const [supabase] = useState(() => createClient())
  const [accepted, setAccepted] = useState(false)
  const [patents, setPatents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!accepted) return
    async function load() {
      const { data } = await supabase
        .from('patents')
        .select('*')
        .order('sort_order', { ascending: true })
      setPatents(data || [])
      setLoading(false)
    }
    load()
  }, [accepted, supabase])

  if (!accepted) {
    return (
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <div style={{
          position: 'fixed', inset: 0,
          backgroundImage: 'linear-gradient(rgba(239,68,68,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />
        <ItarWall onAccept={() => setAccepted(true)} />
      </div>
    )
  }

  const categories = ['all', ...Object.keys(CATEGORY_COLORS)]
  const filtered = filter === 'all' ? patents : patents.filter(p => p.category === filter)

  return (
    <PageShell title="Patent Portfolio" subtitle="OPEN DEFENSE CONCEPTS — CC0 / APACHE 2.0">
      {/* Category filter */}
      <div style={{
        display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24,
        animation: 'fade-up 0.4s ease both',
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: filter === cat ? 'rgba(88,166,255,0.12)' : 'var(--bg-elevated)',
              border: `1px solid ${filter === cat ? 'rgba(88,166,255,0.3)' : 'var(--border-mid)'}`,
              color: filter === cat ? 'var(--accent-blue)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{
          textAlign: 'center', padding: '60px 0',
          color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', fontSize: 12,
        }}>
          LOADING...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}>
          {filtered.map((patent, i) => (
            <PatentCard key={patent.id} patent={patent} index={i} />
          ))}
        </div>
      )}
    </PageShell>
  )
}

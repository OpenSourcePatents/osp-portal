'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import PageShell from '@/components/PageShell'

function ServiceCard({ service, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-surface)' : '#080B10',
        border: `1px solid ${hovered ? 'rgba(168,85,247,0.3)' : 'var(--border-dim)'}`,
        borderRadius: 12,
        padding: '28px 24px',
        transition: 'all 0.3s ease',
        animation: `fade-up 0.5s ease ${index * 0.1}s both`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {hovered && (
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.08), transparent)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Logo / initial */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: service.logo_url
            ? `url(${service.logo_url}) center/cover no-repeat`
            : 'linear-gradient(135deg, #A855F7, #7C3AED)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hovered ? '0 0 30px rgba(168,85,247,0.2)' : 'none',
          transition: 'box-shadow 0.3s',
          overflow: 'hidden',
        }}>
          {!service.logo_url && (
            <span style={{
              fontSize: 18, fontWeight: 800, color: '#fff',
              fontFamily: 'var(--font-mono)',
            }}>
              {service.name?.charAt(0)}
            </span>
          )}
        </div>
        {service.url && (
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              background: hovered ? 'rgba(168,85,247,0.15)' : 'rgba(168,85,247,0.08)',
              border: '1px solid rgba(168,85,247,0.2)',
              color: '#A855F7',
              letterSpacing: '0.08em',
              transition: 'all 0.3s',
            }}
          >
            VISIT →
          </a>
        )}
      </div>

      <h2 style={{
        margin: '0 0 4px', fontSize: 20, fontWeight: 800,
        color: 'var(--text-primary)',
      }}>
        {service.name}
      </h2>
      {service.subtitle && (
        <div style={{
          fontSize: 9, color: '#A855F7', letterSpacing: '0.12em',
          fontWeight: 700, marginBottom: 12, fontFamily: 'var(--font-mono)',
        }}>
          {service.subtitle}
        </div>
      )}

      <p style={{
        margin: '0 0 16px', fontSize: 13,
        color: 'var(--text-muted)', lineHeight: 1.7,
      }}>
        {service.description}
      </p>

      {service.pricing_summary && (
        <div style={{
          padding: '10px 14px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-dim)',
          borderRadius: 6,
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-green)',
          fontWeight: 600,
          letterSpacing: '0.04em',
        }}>
          {service.pricing_summary}
        </div>
      )}
    </div>
  )
}

export default function ServicesPage() {
  const [supabase] = useState(() => createClient())
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true })
      setServices(data || [])
      setLoading(false)
    }
    load()
  }, [supabase])

  return (
    <PageShell title="Services" subtitle="TOOLS WE BUILD FOR YOU">
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 16,
          maxWidth: 800,
        }}>
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      )}
    </PageShell>
  )
}

'use client'

import { useState, useEffect } from 'react'

// ═══════════════════════════════════════════════════════════
// APP REGISTRY
// Update `url` for each app as you deploy them.
// Set url to null for "Coming Soon" state.
// ═══════════════════════════════════════════════════════════
const APPS = [
  {
    id: 'dockwatch',
    name: 'DOCKWATCH',
    subtitle: 'COMMUNITY PORT INTELLIGENCE',
    description: 'Anonymous citizen reporting of screaming, suspicious activity, and potential trafficking at shipping docks and port areas. No police, no news — just workers and witnesses.',
    color: '#FF2E2E',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    stats: [
      { label: 'Anonymous Reports', value: 'Live Feed' },
      { label: 'Corroboration', value: 'Witness Verified' },
      { label: 'Coverage', value: 'All US Ports' },
    ],
    tags: ['Trafficking', 'Port Security', 'Whistleblower'],
    url: 'https://dockwatch.vercel.app', // 
  },
  {
    id: 'sentinel',
    name: 'SENTINEL',
    subtitle: 'GOVERNMENT ACCOUNTABILITY DETECTION',
    description: 'Automated detection of corruption patterns, conflicts of interest, and anomalous behavior across government officials. Cross-references financial disclosures, voting records, and public contracts.',
    color: '#A855F7',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    stats: [
      { label: 'Data Sources', value: 'FEC + STOCK Act' },
      { label: 'Detection', value: 'Anomaly Scoring' },
      { label: 'Scope', value: 'Federal + State' },
    ],
    tags: ['Corruption', 'Transparency', 'Accountability'],
    url: null,
  },
  {
    id: 'narc',
    name: 'NARC',
    subtitle: 'OPIOID CRISIS GEOSPATIAL INTELLIGENCE',
    description: 'Real-time geospatial mapping of opioid distribution patterns, overdose clusters, and supply chain anomalies. Community-sourced intelligence overlaid with public health data.',
    color: '#F59E0B',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    stats: [
      { label: 'Mapping', value: 'Live Hotspots' },
      { label: 'Sources', value: 'EMS + CDC + Community' },
      { label: 'Tracking', value: 'Supply Routes' },
    ],
    tags: ['Opioid Crisis', 'Public Health', 'Geospatial'],
    url: null,
  },
  {
    id: 'congresswatch',
    name: 'CONGRESSWATCH',
    subtitle: 'CONGRESSIONAL ANOMALY SCORING',
    description: 'Anomaly scoring of congressional members based on voting patterns, donor influence, insider trading signals, and deviation from constituent interests.',
    color: '#3B82F6',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
      </svg>
    ),
    stats: [
      { label: 'Members', value: '535 Tracked' },
      { label: 'Data', value: 'FEC + ProPublica' },
      { label: 'Scoring', value: 'Real-time Anomaly' },
    ],
    tags: ['Congress', 'Insider Trading', 'Donor Influence'],
    url: 'https://congresswatch.vercel.app',
  },
  {
    id: 'canaan-roads',
    name: 'CANAAN ROAD WATCH',
    subtitle: 'CITIZEN ROAD ACCOUNTABILITY',
    description: 'Community reporting and accountability platform for road conditions in Canaan, NH. Track potholes, frost heaves, grading failures. Performance scoring holds the highway department accountable.',
    color: '#EF4444',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12"/>
        <path d="M4 4h16v16H4z" strokeWidth="1.5"/>
      </svg>
    ),
    stats: [
      { label: 'Coverage', value: 'Canaan, NH' },
      { label: 'Framework', value: 'Funding Accountability' },
      { label: 'Reporting', value: 'Citizen-Driven' },
    ],
    tags: ['Roads', 'Local Gov', 'Canaan NH'],
    url: 'https://canaanroads.com',
  },
  {
    id: 'canaan-budget',
    name: 'CANAAN BUDGET WATCH',
    subtitle: 'YOUR TAX DOLLARS — DIGITIZED',
    description: 'Full transparency dashboard for Canaan, NH town budget. Every department, every salary, every dollar — sourced from public records under NH RSA 91-A.',
    color: '#22C55E',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    stats: [
      { label: '2026 Budget', value: '$6.37M' },
      { label: 'Source', value: 'RSA 91-A Public Records' },
      { label: 'Detail', value: 'Every Position' },
    ],
    tags: ['Budget', 'Salaries', 'Canaan NH'],
    url: null,
  },
]

function LiveClock() {
  const [time, setTime] = useState(null)
  useEffect(() => {
    setTime(new Date())
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  if (!time) return null
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
      {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
  )
}

function StatusIndicator() {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)',
        animation: 'pulse-dot 2s ease-in-out infinite',
      }} />
      <span style={{
        color: 'var(--accent-green)', fontSize: 11,
        fontFamily: 'var(--font-mono)', fontWeight: 600,
        letterSpacing: '0.08em',
      }}>
        SYSTEMS IN DEVELOPMENT
      </span>
    </span>
  )
}

function AppCard({ app, index }) {
  const [hovered, setHovered] = useState(false)
  const isDeployed = !!app.url

  const handleClick = () => {
    if (isDeployed) {
      window.open(app.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role={isDeployed ? 'link' : undefined}
      style={{
        background: hovered ? 'var(--bg-surface)' : '#080B10',
        border: `1px solid ${hovered ? app.color + '44' : 'var(--border-dim)'}`,
        borderRadius: 10,
        padding: '22px 20px 18px',
        cursor: isDeployed ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        animation: `fade-up 0.5s ease ${index * 0.1}s both`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Hover glow */}
      {hovered && (
        <div style={{
          position: 'absolute', top: -50, right: -50,
          width: 150, height: 150, borderRadius: '50%',
          background: `radial-gradient(circle, ${app.color}12, transparent)`,
          pointerEvents: 'none',
          transition: 'opacity 0.3s',
        }} />
      )}

      {/* Top row: icon + status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, position: 'relative' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: `linear-gradient(135deg, ${app.color}, ${app.color}77)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: hovered ? `0 0 24px ${app.color}33` : 'none',
          transition: 'box-shadow 0.3s',
        }}>
          {app.icon}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {isDeployed ? (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 4,
              color: 'var(--accent-green)', fontSize: 9,
              fontFamily: 'var(--font-mono)', fontWeight: 700,
              letterSpacing: '0.12em',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-green)' }} />
              DEPLOYED
            </span>
          ) : (
            <span style={{
              color: 'var(--accent-yellow)', fontSize: 9,
              fontFamily: 'var(--font-mono)', fontWeight: 700,
              letterSpacing: '0.12em',
            }}>
              DEPLOY PENDING
            </span>
          )}
        </div>
      </div>

      {/* Title block */}
      <h2 style={{
        margin: '0 0 3px', fontSize: 17, fontWeight: 800,
        color: 'var(--text-primary)', letterSpacing: '0.01em',
        lineHeight: 1.2,
      }}>
        {app.name}
      </h2>
      <div style={{
        fontSize: 9, color: app.color, letterSpacing: '0.12em',
        fontWeight: 700, marginBottom: 10,
        fontFamily: 'var(--font-mono)',
      }}>
        {app.subtitle}
      </div>

      {/* Description */}
      <p style={{
        margin: '0 0 14px', fontSize: 12,
        color: 'var(--text-muted)', lineHeight: 1.65,
        flex: 1,
      }}>
        {app.description}
      </p>

      {/* Stats row */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 6,
        marginBottom: 14,
      }}>
        {app.stats.map((s, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '4px 0',
            borderBottom: i < app.stats.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
          }}>
            <span style={{ fontSize: 10, color: 'var(--text-faint)', letterSpacing: '0.04em' }}>{s.label}</span>
            <span style={{
              fontSize: 10, color: app.color, fontWeight: 700,
              fontFamily: 'var(--font-mono)', letterSpacing: '0.02em',
            }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {app.tags.map((tag, i) => (
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

      {/* Launch indicator */}
      {isDeployed && hovered && (
        <div style={{
          position: 'absolute', bottom: 12, right: 14,
          color: app.color, fontSize: 10, fontWeight: 700,
          fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          LAUNCH →
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Animated grid background */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'linear-gradient(rgba(88,166,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(88,166,255,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        animation: 'grid-scan 4s linear infinite',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <header style={{
        position: 'relative', zIndex: 1,
        borderBottom: '1px solid var(--border-dim)',
        background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-void) 100%)',
        padding: '20px 24px',
      }}>
        <div style={{
          maxWidth: 960, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 10,
              background: 'linear-gradient(135deg, #58A6FF 0%, #1F6FEB 50%, #A855F7 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800, color: '#fff',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
              animation: 'glow-pulse 3s ease-in-out infinite',
            }}>
              O.S.P.
            </div>
            <div>
              <h1 style={{
                margin: 0, fontSize: 22, fontWeight: 800,
                color: 'var(--text-primary)', letterSpacing: '-0.02em',
              }}>
                O.S.P. PORTAL
              </h1>
              <div style={{
                fontSize: 10, color: 'var(--text-faint)',
                letterSpacing: '0.18em',
                fontFamily: 'var(--font-mono)',
              }}>
                OPENSOURCEPATENTS — CIVIC INTELLIGENCE NETWORK
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <StatusIndicator />
            <LiveClock />
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ position: 'relative', zIndex: 1, maxWidth: 960, margin: '0 auto', padding: '28px 24px 60px' }}>
        {/* Mission banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(88,166,255,0.04), rgba(168,85,247,0.04))',
          border: '1px solid rgba(88,166,255,0.1)',
          borderRadius: 10, padding: '18px 24px', marginBottom: 28,
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 13, color: 'var(--accent-blue)',
            fontWeight: 600, lineHeight: 1.7, margin: 0,
          }}>
            "Just a regular guy releasing open source patents on whatever I can think of to help the world.
            <br />No royalty or charge. Ever."
          </p>
          <p style={{
            fontSize: 10, color: 'var(--text-faint)', margin: '8px 0 0',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
          }}>
            SELECT AN INTELLIGENCE MODULE TO LAUNCH
          </p>
        </div>

        {/* App grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: 16,
        }}>
          {APPS.map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center', padding: '0 24px 32px',
      }}>
        <div style={{
          maxWidth: 960, margin: '0 auto',
          borderTop: '1px solid var(--border-dim)',
          paddingTop: 20,
        }}>
          <p style={{
            color: 'var(--border-mid)', fontSize: 10,
            fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
            lineHeight: 1.8,
          }}>
            OpenSourcePatents | CC0 Public Domain |{' '}
            <a
              href="https://github.com/OpenSourcePatents"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-faint)', borderBottom: '1px solid var(--border-mid)' }}
            >
              github.com/OpenSourcePatents
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

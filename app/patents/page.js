'use client'

import { useState } from 'react'
import PageShell from '@/components/PageShell'

// ═══════════════════════════════════════════════════════════
// SECTION A — Open Source (public repos)
// ═══════════════════════════════════════════════════════════
const OPEN_SOURCE = [
  {
    name: 'REHD (Public)',
    desc: 'Recoil Energy Harvesting concept. Open source.',
    repo: 'https://github.com/OpenSourcePatents/REHD_Public',
  },
  {
    name: 'REVOLT',
    desc: 'Renewable energy system. Open source.',
    repo: 'https://github.com/OpenSourcePatents/REVOLT',
  },
  {
    name: 'THOR',
    desc: 'Energy concept. Open source.',
    repo: 'https://github.com/OpenSourcePatents/THOR',
  },
  {
    name: 'Earth Pills',
    desc: 'Environmental remediation concept. Open source.',
    repo: 'https://github.com/OpenSourcePatents/Earth_Pills',
  },
  {
    name: 'AIR-U',
    desc: 'Open source.',
    repo: 'https://github.com/OpenSourcePatents/AIR-U',
  },
  {
    name: 'GiveCoin',
    desc: 'Fintech concept. Open source.',
    repo: 'https://github.com/OpenSourcePatents/GiveCoin',
  },
  {
    name: 'Project NARC',
    desc: 'Counter-fentanyl architecture. Five-part system. Open source.',
    repo: 'https://github.com/OpenSourcePatents/Project_NARC',
  },
  {
    name: 'FCK-U System',
    desc: 'Open source.',
    repo: 'https://github.com/OpenSourcePatents/FCK-U-System',
  },
  {
    name: 'SENTINEL',
    desc: 'Government accountability detection. Open source.',
    repo: 'https://github.com/OpenSourcePatents/SENTINEL',
  },
  {
    name: 'GUARDIAN',
    desc: 'Open source.',
    repo: 'https://github.com/OpenSourcePatents/GUARDIAN',
  },
  {
    name: 'Citizens Shield',
    desc: 'Open source.',
    repo: 'https://github.com/OpenSourcePatents/Citizens_Shield',
  },
  {
    name: 'ANMP',
    desc: 'Open source.',
    repo: 'https://github.com/OpenSourcePatents/ANMP',
  },
]

// ═══════════════════════════════════════════════════════════
// SECTION B — Restricted Portfolio (redacted)
// ═══════════════════════════════════════════════════════════
const RESTRICTED = [
  {
    desc: 'Naval energy harvesting system. Mode 3 withheld pending ITAR review.',
    status: 'Concept',
  },
  {
    desc: 'Counter-UAS threat density platform. Provisional filed USPTO 2026.',
    status: 'Filed',
  },
  {
    desc: 'Incendiary entanglement munitions family. Provisional filed USPTO 2026.',
    status: 'Filed',
  },
  {
    desc: 'Autonomous theater deployment architecture. Classification pending.',
    status: 'Concept',
  },
  {
    desc: 'Fraud detection system. Provisional application pending.',
    status: 'Pending',
  },
]

const STATUS_COLORS = {
  Concept: 'var(--text-faint)',
  Filed: 'var(--accent-orange)',
  Pending: 'var(--accent-yellow)',
}

function OpenSourceCard({ item, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-surface)' : '#080B10',
        border: `1px solid ${hovered ? 'rgba(63,185,80,0.35)' : 'var(--border-dim)'}`,
        borderRadius: 10,
        padding: '20px 18px 16px',
        transition: 'all 0.3s ease',
        animation: `fade-up 0.5s ease ${index * 0.05}s both`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {hovered && (
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 120, height: 120, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(63,185,80,0.08), transparent)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Header: name + badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
        gap: 8,
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 800,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
        }}>
          {item.name}
        </h3>
        <span style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 8px',
          borderRadius: 4,
          background: 'rgba(63,185,80,0.1)',
          border: '1px solid rgba(63,185,80,0.2)',
          fontSize: 9,
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: 'var(--accent-green)',
          letterSpacing: '0.08em',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-green)' }} />
          OPEN SOURCE
        </span>
      </div>

      {/* Description */}
      <p style={{
        margin: '0 0 14px',
        fontSize: 12,
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        flex: 1,
      }}>
        {item.desc}
      </p>

      {/* GitHub link */}
      <a
        href={item.repo}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          borderRadius: 6,
          background: hovered ? 'rgba(63,185,80,0.12)' : 'var(--bg-elevated)',
          border: '1px solid var(--border-mid)',
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          color: 'var(--accent-green)',
          letterSpacing: '0.04em',
          transition: 'all 0.2s',
          alignSelf: 'flex-start',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        GitHub
      </a>
    </div>
  )
}

function RedactedCard({ item, index }) {
  const [hovered, setHovered] = useState(false)
  const statusColor = STATUS_COLORS[item.status] || 'var(--text-faint)'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(30,15,15,0.8)' : 'rgba(20,10,10,0.6)',
        border: `1px solid ${hovered ? 'rgba(239,68,68,0.25)' : 'rgba(60,20,20,0.4)'}`,
        borderRadius: 10,
        padding: '20px 18px 16px',
        transition: 'all 0.3s ease',
        animation: `fade-up 0.5s ease ${index * 0.06}s both`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {hovered && (
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 120, height: 120, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.06), transparent)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Header: redacted name + lock + status */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          {/* Lock icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" style={{ flexShrink: 0 }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span style={{
            fontSize: 15,
            fontWeight: 800,
            color: 'var(--accent-red)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.1em',
          }}>
            [REDACTED]
          </span>
        </div>
        <span style={{
          padding: '3px 8px',
          borderRadius: 4,
          background: `${statusColor}12`,
          border: `1px solid ${statusColor}25`,
          fontSize: 9,
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: statusColor,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          {item.status}
        </span>
      </div>

      {/* Description */}
      <p style={{
        margin: 0,
        fontSize: 12,
        color: 'var(--text-muted)',
        lineHeight: 1.6,
      }}>
        {item.desc}
      </p>
    </div>
  )
}

export default function PatentsPage() {
  return (
    <PageShell title="Patent Portfolio" subtitle="OPEN SOURCE PATENTS & DEFENSE CONCEPTS">
      {/* ITAR Banner */}
      <div style={{
        padding: '14px 18px',
        background: 'rgba(239,68,68,0.05)',
        border: '1px solid rgba(239,68,68,0.15)',
        borderRadius: 8,
        marginBottom: 32,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        animation: 'fade-up 0.4s ease both',
      }}>
        <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>&#9888;</span>
        <p style={{
          margin: 0,
          fontSize: 12,
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          fontFamily: 'var(--font-mono)',
        }}>
          <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>NOTICE:</span>{' '}
          Some concepts in this portfolio may be subject to ITAR/EAR regulations.
          Viewing of restricted items requires identity verification.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION A — Open Source */}
      {/* ═══════════════════════════════════════════════════ */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 20,
          animation: 'fade-up 0.4s ease 0.1s both',
        }}>
          <h2 style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: 'var(--text-primary)',
          }}>
            Open Source
          </h2>
          <span style={{
            padding: '3px 10px',
            borderRadius: 4,
            background: 'rgba(63,185,80,0.1)',
            border: '1px solid rgba(63,185,80,0.2)',
            fontSize: 9,
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--accent-green)',
            letterSpacing: '0.08em',
          }}>
            {OPEN_SOURCE.length} REPOS
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 14,
        }}>
          {OPEN_SOURCE.map((item, i) => (
            <OpenSourceCard key={item.name} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION B — Restricted Portfolio */}
      {/* ═══════════════════════════════════════════════════ */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 16,
          animation: 'fade-up 0.4s ease 0.2s both',
        }}>
          <h2 style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: 'var(--text-primary)',
          }}>
            Restricted Portfolio
          </h2>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </div>

        {/* Access banner */}
        <div style={{
          padding: '14px 18px',
          background: 'rgba(255,140,0,0.04)',
          border: '1px solid rgba(255,140,0,0.12)',
          borderRadius: 8,
          marginBottom: 20,
          animation: 'fade-up 0.4s ease 0.25s both',
        }}>
          <p style={{
            margin: 0,
            fontSize: 12,
            color: 'var(--text-muted)',
            lineHeight: 1.6,
          }}>
            Access to detailed documentation requires verified clearance.
            Contact{' '}
            <a
              href="mailto:opensourcepatents@gmail.com"
              style={{
                color: 'var(--accent-blue)',
                borderBottom: '1px solid rgba(88,166,255,0.3)',
              }}
            >
              opensourcepatents@gmail.com
            </a>{' '}
            to request access.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 14,
        }}>
          {RESTRICTED.map((item, i) => (
            <RedactedCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </PageShell>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import GridBackground from '@/components/GridBackground'

const RADIUS = 280

// 0 deg = 12 o'clock, clockwise
const SECTIONS = [
  { href: '/civic',    label: 'CIVIC',      desc: 'Public accountability tools',  color: '#3FB950', icon: '◈',  deg: 0   },
  { href: '/mission',  label: 'MISSION',    desc: 'Why we exist',                 color: '#58A6FF', icon: '◎',  deg: 72  },
  { href: '/services', label: 'SERVICES',   desc: 'FundForge & DraftProSe',       color: '#A855F7', icon: '⬡',  deg: 144 },
  { href: '/voice',    label: 'YOUR VOICE', desc: 'Speak. Be heard.',             color: '#FFD000', icon: '◉',  deg: 216 },
  { href: '/patents',  label: 'PATENTS',    desc: 'Open defense portfolio',       color: '#FF8C00', icon: '△',  deg: 288 },
]

function GlowLogo() {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(88,166,255,0.12) 0%, rgba(88,166,255,0.04) 40%, transparent 70%)',
        animation: 'glow-pulse 3s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        width: 120,
        height: 120,
        borderRadius: 22,
        background: 'linear-gradient(135deg, #58A6FF 0%, #1F6FEB 40%, #A855F7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 0 60px rgba(88,166,255,0.25), 0 0 120px rgba(88,166,255,0.1)',
        animation: 'glow-pulse 3s ease-in-out infinite',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 800,
          fontSize: 26,
          color: '#fff',
          letterSpacing: '0.08em',
        }}>
          O.S.P.
        </span>
      </div>
    </div>
  )
}

function ClockCard({ section, cx, cy, index }) {
  const [hovered, setHovered] = useState(false)
  const rad = section.deg * (Math.PI / 180)
  const x = cx + RADIUS * Math.sin(rad)
  const y = cy - RADIUS * Math.cos(rad)

  return (
    <Link
      href={section.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${hovered ? 1.07 : 1})`,
        width: 160,
        padding: '14px 16px',
        background: hovered ? 'var(--bg-surface)' : 'rgba(13,17,23,0.85)',
        border: `1px solid ${hovered ? section.color + '55' : 'var(--border-dim)'}`,
        borderRadius: 10,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        animation: `fade-up 0.5s ease ${0.3 + index * 0.1}s both`,
        zIndex: 2,
        boxShadow: hovered
          ? `0 0 28px ${section.color}25, 0 4px 20px rgba(0,0,0,0.3)`
          : '0 2px 8px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(8px)',
        textAlign: 'center',
      }}
    >
      {hovered && (
        <div style={{
          position: 'absolute',
          inset: -1,
          borderRadius: 10,
          background: `radial-gradient(circle at center, ${section.color}0A, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      <div style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: `linear-gradient(135deg, ${section.color}28, ${section.color}0A)`,
        border: `1px solid ${section.color}22`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15,
        margin: '0 auto 8px',
        transition: 'all 0.3s',
        boxShadow: hovered ? `0 0 16px ${section.color}30` : 'none',
      }}>
        {section.icon}
      </div>

      <div style={{
        fontSize: 11,
        fontWeight: 700,
        color: hovered ? section.color : 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.06em',
        transition: 'color 0.3s',
        marginBottom: 3,
      }}>
        {section.label}
      </div>
      <div style={{
        fontSize: 9,
        color: 'var(--text-muted)',
        lineHeight: 1.4,
      }}>
        {section.desc}
      </div>
    </Link>
  )
}

function ConnectorLine({ section, cx, cy, hovered }) {
  const rad = section.deg * (Math.PI / 180)
  const innerR = 75
  const outerR = RADIUS - 50
  const x1 = cx + innerR * Math.sin(rad)
  const y1 = cy - innerR * Math.cos(rad)
  const x2 = cx + outerR * Math.sin(rad)
  const y2 = cy - outerR * Math.cos(rad)

  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={hovered ? section.color : 'rgba(44,50,63,0.5)'}
      strokeWidth={hovered ? 1.5 : 0.5}
      strokeDasharray={hovered ? 'none' : '4 4'}
      style={{ transition: 'all 0.3s ease' }}
    />
  )
}

function MobileList({ mounted }) {
  const [hovered, setHovered] = useState(-1)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      gap: 24,
      position: 'relative',
      zIndex: 1,
    }}>
      <GlowLogo />

      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          margin: 0, fontSize: 22, fontWeight: 800,
          color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
        }}>
          OpenSourcePatents
        </h1>
        <div style={{
          marginTop: 4, fontSize: 10, fontFamily: 'var(--font-mono)',
          letterSpacing: '0.18em', color: 'var(--text-faint)',
        }}>
          CIVIC INTELLIGENCE NETWORK
        </div>
        <p style={{
          fontSize: 14, color: 'var(--accent-blue)', fontWeight: 600,
          margin: '10px 0 0',
        }}>
          &ldquo;No royalty or charge. Ever.&rdquo;
        </p>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 10,
        width: '100%', maxWidth: 360,
      }}>
        {SECTIONS.map((section, i) => (
          <Link
            key={section.href}
            href={section.href}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 18px',
              background: hovered === i ? 'var(--bg-surface)' : 'rgba(13,17,23,0.7)',
              border: `1px solid ${hovered === i ? section.color + '44' : 'var(--border-dim)'}`,
              borderRadius: 10,
              transition: 'all 0.3s ease',
              animation: mounted ? `fade-up 0.5s ease ${0.2 + i * 0.08}s both` : 'none',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: `linear-gradient(135deg, ${section.color}22, ${section.color}08)`,
              border: `1px solid ${section.color}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0,
            }}>
              {section.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 12, fontWeight: 700,
                color: hovered === i ? section.color : 'var(--text-primary)',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
                transition: 'color 0.3s',
              }}>
                {section.label}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                {section.desc}
              </div>
            </div>
            <span style={{
              fontSize: 14,
              color: hovered === i ? section.color : 'var(--text-faint)',
              transition: 'all 0.3s',
            }}>
              &rarr;
            </span>
          </Link>
        ))}
      </div>

      <p style={{
        color: 'var(--border-mid)', fontSize: 10, fontFamily: 'var(--font-mono)',
        letterSpacing: '0.1em', marginTop: 16, textAlign: 'center',
      }}>
        OpenSourcePatents | CC0 Public Domain
      </p>
    </div>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState(-1)
  const [center, setCenter] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    const update = () => {
      setIsMobile(window.innerWidth < 700)
      setCenter({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (!mounted) return null

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <GridBackground />

      {isMobile ? (
        <MobileList mounted={mounted} />
      ) : (
        <>
          {/* Center logo + text */}
          <div style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            animation: 'fade-up 0.6s ease both',
            pointerEvents: 'none',
          }}>
            <GlowLogo />
            <div style={{ textAlign: 'center' }}>
              <h1 style={{
                margin: 0, fontSize: 22, fontWeight: 800,
                color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                letterSpacing: '-0.02em',
              }}>
                OpenSourcePatents
              </h1>
              <div style={{
                marginTop: 3, fontSize: 9, fontFamily: 'var(--font-mono)',
                letterSpacing: '0.18em', color: 'var(--text-faint)',
              }}>
                CIVIC INTELLIGENCE NETWORK
              </div>
            </div>
            <p style={{
              fontSize: 13, color: 'var(--accent-blue)', fontWeight: 600, margin: 0,
            }}>
              &ldquo;No royalty or charge. Ever.&rdquo;
            </p>
          </div>

          {/* SVG connector lines */}
          <svg style={{
            position: 'fixed', inset: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 1,
          }}>
            {SECTIONS.map((section, i) => (
              <ConnectorLine
                key={section.href}
                section={section}
                cx={center.x}
                cy={center.y}
                hovered={hoveredIdx === i}
              />
            ))}
          </svg>

          {/* Clock cards */}
          {SECTIONS.map((section, i) => (
            <div
              key={section.href}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(-1)}
            >
              <ClockCard
                section={section}
                cx={center.x}
                cy={center.y}
                index={i}
              />
            </div>
          ))}

          {/* Footer */}
          <div style={{
            position: 'fixed', bottom: 16, left: 0, right: 0,
            textAlign: 'center', zIndex: 1,
          }}>
            <p style={{
              color: 'var(--border-mid)', fontSize: 10, fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
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
        </>
      )}
    </div>
  )
}

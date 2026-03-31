'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import GridBackground from '@/components/GridBackground'
import Nav from '@/components/Nav'

// Clock positions: angle in degrees from 12 o'clock (clockwise)
// 12 = 0deg, 2 = 60deg, 4 = 120deg, 8 = 240deg, 10 = 300deg
const SECTIONS = [
  { href: '/civic',    label: 'CIVIC',      desc: 'Public accountability tools',  color: '#3FB950', icon: '◈',  angle: 0   },
  { href: '/mission',  label: 'MISSION',    desc: 'Why we exist',                 color: '#58A6FF', icon: '◎',  angle: 60  },
  { href: '/services', label: 'SERVICES',   desc: 'FundForge & DraftProSe',       color: '#A855F7', icon: '⬡',  angle: 120 },
  { href: '/voice',    label: 'YOUR VOICE', desc: 'Speak. Be heard.',             color: '#FFD000', icon: '◉',  angle: 240 },
  { href: '/patents',  label: 'PATENTS',    desc: 'Open defense portfolio',       color: '#FF8C00', icon: '△',  angle: 300 },
]

function GlowLogo() {
  return (
    <div style={{ position: 'relative' }}>
      {/* Outer glow */}
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

      {/* Logo block */}
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

function Connector({ angle, radius, color, hovered }) {
  // Calculate line from inner edge to outer edge
  const innerR = 80
  const outerR = radius - 20
  const rad = (angle - 90) * (Math.PI / 180)
  const x1 = Math.cos(rad) * innerR
  const y1 = Math.sin(rad) * innerR
  const x2 = Math.cos(rad) * outerR
  const y2 = Math.sin(rad) * outerR

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={hovered ? color : 'var(--border-dim)'}
      strokeWidth={hovered ? 1.5 : 0.5}
      strokeDasharray={hovered ? 'none' : '4 4'}
      style={{ transition: 'all 0.3s ease' }}
    />
  )
}

function ClockCard({ section, radius, index, onHover, hovered }) {
  const rad = (section.angle - 90) * (Math.PI / 180)
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius

  return (
    <Link
      href={section.href}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(-1)}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 18px',
        background: hovered ? 'var(--bg-surface)' : 'rgba(13,17,23,0.85)',
        border: `1px solid ${hovered ? section.color + '55' : 'var(--border-dim)'}`,
        borderRadius: 10,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        animation: `fade-up 0.5s ease ${0.3 + index * 0.1}s both`,
        whiteSpace: 'nowrap',
        zIndex: 2,
        boxShadow: hovered
          ? `0 0 24px ${section.color}22, 0 4px 20px rgba(0,0,0,0.3)`
          : '0 2px 8px rgba(0,0,0,0.2)',
        scale: hovered ? '1.05' : '1',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Hover glow */}
      {hovered && (
        <div style={{
          position: 'absolute',
          inset: -1,
          borderRadius: 10,
          background: `radial-gradient(circle at center, ${section.color}08, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      <div style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        background: `linear-gradient(135deg, ${section.color}28, ${section.color}0A)`,
        border: `1px solid ${section.color}22`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        flexShrink: 0,
        transition: 'all 0.3s',
        boxShadow: hovered ? `0 0 16px ${section.color}30` : 'none',
      }}>
        {section.icon}
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{
          fontSize: 12,
          fontWeight: 700,
          color: hovered ? section.color : 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.06em',
          transition: 'color 0.3s',
        }}>
          {section.label}
        </div>
        <div style={{
          fontSize: 10,
          color: 'var(--text-muted)',
          marginTop: 1,
        }}>
          {section.desc}
        </div>
      </div>
    </Link>
  )
}

function MobileList({ sections, mounted }) {
  const [hovered, setHovered] = useState(-1)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      width: '100%',
      maxWidth: 400,
      padding: '0 24px',
    }}>
      {sections.map((section, i) => (
        <Link
          key={section.href}
          href={section.href}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            background: hovered === i ? 'var(--bg-surface)' : 'rgba(13,17,23,0.7)',
            border: `1px solid ${hovered === i ? section.color + '44' : 'var(--border-dim)'}`,
            borderRadius: 10,
            transition: 'all 0.3s ease',
            animation: mounted ? `fade-up 0.5s ease ${0.2 + i * 0.08}s both` : 'none',
          }}
        >
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${section.color}22, ${section.color}08)`,
            border: `1px solid ${section.color}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            flexShrink: 0,
          }}>
            {section.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              color: hovered === i ? section.color : 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
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
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(-1)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768 || window.innerHeight < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const clockRadius = 240

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <GridBackground />
      <Nav />

      <main style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 57px)',
        padding: isMobile ? '40px 0' : '0 24px',
      }}>
        {/* Center logo + tagline group */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          animation: mounted ? 'fade-up 0.6s ease both' : 'none',
          marginBottom: isMobile ? 32 : 0,
        }}>
          <GlowLogo />

          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              margin: 0,
              fontSize: isMobile ? 22 : 24,
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-body)',
            }}>
              OpenSourcePatents
            </h1>
            <div style={{
              marginTop: 4,
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.18em',
              color: 'var(--text-faint)',
            }}>
              CIVIC INTELLIGENCE NETWORK
            </div>
          </div>

          <p style={{
            fontSize: 14,
            color: 'var(--accent-blue)',
            fontWeight: 600,
            margin: 0,
            animation: mounted ? 'fade-up 0.6s ease 0.15s both' : 'none',
          }}>
            &ldquo;No royalty or charge. Ever.&rdquo;
          </p>
        </div>

        {/* Clock layout (desktop) or list (mobile) */}
        {isMobile ? (
          <MobileList sections={SECTIONS} mounted={mounted} />
        ) : (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: clockRadius * 2 + 300,
            height: clockRadius * 2 + 200,
          }}>
            {/* SVG connectors */}
            <svg
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                overflow: 'visible',
                pointerEvents: 'none',
                zIndex: 1,
              }}
              width="0"
              height="0"
            >
              {SECTIONS.map((section, i) => (
                <Connector
                  key={section.href}
                  angle={section.angle}
                  radius={clockRadius}
                  color={section.color}
                  hovered={hoveredCard === i}
                />
              ))}
            </svg>

            {/* Cards positioned around the clock */}
            {SECTIONS.map((section, i) => (
              <ClockCard
                key={section.href}
                section={section}
                radius={clockRadius}
                index={i}
                onHover={setHoveredCard}
                hovered={hoveredCard === i}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        position: isMobile ? 'relative' : 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        textAlign: 'center',
        padding: '16px 24px',
      }}>
        <p style={{
          color: 'var(--border-mid)',
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.1em',
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
      </footer>
    </div>
  )
}

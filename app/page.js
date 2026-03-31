'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import GridBackground from '@/components/GridBackground'
import Nav from '@/components/Nav'

const SECTIONS = [
  { href: '/civic', label: 'CIVIC ARM', desc: 'Public accountability tools', color: '#3FB950', icon: '◈' },
  { href: '/mission', label: 'MISSION', desc: 'Why we exist', color: '#58A6FF', icon: '◎' },
  { href: '/services', label: 'SERVICES', desc: 'FundForge & DraftProSe', color: '#A855F7', icon: '⬡' },
  { href: '/patents', label: 'PATENTS', desc: 'Open defense portfolio', color: '#FF8C00', icon: '△' },
  { href: '/voice', label: 'YOUR VOICE', desc: 'Speak. Be heard.', color: '#FFD000', icon: '◉' },
]

function GlowLogo() {
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 24,
    }}>
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
        width: 140,
        height: 140,
        borderRadius: 24,
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
          fontSize: 32,
          color: '#fff',
          letterSpacing: '0.08em',
        }}>
          O.S.P.
        </span>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          fontFamily: 'var(--font-body)',
        }}>
          OpenSourcePatents
        </h1>
        <div style={{
          marginTop: 8,
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.2em',
          color: 'var(--text-faint)',
        }}>
          CIVIC INTELLIGENCE NETWORK
        </div>
      </div>
    </div>
  )
}

function SectionCard({ section, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={section.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '18px 22px',
        background: hovered ? 'var(--bg-surface)' : 'rgba(13,17,23,0.6)',
        border: `1px solid ${hovered ? section.color + '44' : 'var(--border-dim)'}`,
        borderRadius: 10,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        animation: `fade-up 0.5s ease ${0.2 + index * 0.1}s both`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {hovered && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 20% 50%, ${section.color}08, transparent 60%)`,
          pointerEvents: 'none',
        }} />
      )}
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: `linear-gradient(135deg, ${section.color}22, ${section.color}08)`,
        border: `1px solid ${section.color}22`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        flexShrink: 0,
        transition: 'all 0.3s',
        boxShadow: hovered ? `0 0 20px ${section.color}22` : 'none',
      }}>
        {section.icon}
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: hovered ? section.color : 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.06em',
          transition: 'color 0.3s',
        }}>
          {section.label}
        </div>
        <div style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          marginTop: 2,
        }}>
          {section.desc}
        </div>
      </div>
      <span style={{
        fontSize: 14,
        color: hovered ? section.color : 'var(--text-faint)',
        transition: 'all 0.3s',
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
      }}>
        →
      </span>
    </Link>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

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
        padding: '60px 24px',
        gap: 48,
      }}>
        {/* Hero */}
        <div style={{
          animation: mounted ? 'fade-up 0.6s ease both' : 'none',
        }}>
          <GlowLogo />
        </div>

        {/* Tagline */}
        <div style={{
          textAlign: 'center',
          animation: mounted ? 'fade-up 0.6s ease 0.15s both' : 'none',
        }}>
          <p style={{
            fontSize: 16,
            color: 'var(--accent-blue)',
            fontWeight: 600,
            margin: 0,
            lineHeight: 1.6,
          }}>
            &ldquo;No royalty or charge. Ever.&rdquo;
          </p>
          <p style={{
            fontSize: 12,
            color: 'var(--text-faint)',
            margin: '8px 0 0',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.06em',
          }}>
            Open source patents &amp; civic tools — free forever
          </p>
        </div>

        {/* Section navigation */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
          width: '100%',
          maxWidth: 700,
        }}>
          {SECTIONS.map((section, i) => (
            <SectionCard key={section.href} section={section} index={i} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        padding: '0 24px 32px',
      }}>
        <div style={{
          maxWidth: 700,
          margin: '0 auto',
          borderTop: '1px solid var(--border-dim)',
          paddingTop: 20,
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
        </div>
      </footer>
    </div>
  )
}

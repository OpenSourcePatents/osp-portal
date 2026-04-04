'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import GridBackground from '@/components/GridBackground'
import Nav from '@/components/Nav'

// ─── Open Source Arm ────────────────────────────────────────
const CIVIC_TOOLS = [
  {
    href: '/civic',
    name: 'Civic Intelligence',
    desc: 'Public accountability platforms — CongressWatch, Canaan Road Watch, DockWatch, and more.',
    color: '#3FB950',
    tag: 'FREE FOREVER',
  },
  {
    href: '/patents',
    name: 'Patent Portfolio',
    desc: 'Open source inventions released under CC0 and Apache 2.0. Defensive publications to keep ideas free.',
    color: '#FF8C00',
    tag: 'CC0 / APACHE 2.0',
  },
  {
    href: '/voice',
    name: 'Your Voice Matters',
    desc: 'Public submission board for civic concerns. Anonymous or identified. Sunlight is the best disinfectant.',
    color: '#FFD000',
    tag: 'PUBLIC BOARD',
  },
  {
    href: '/mission',
    name: 'Mission & Philosophy',
    desc: 'Why open source patents matter. Why we release everything. Why we will never charge.',
    color: '#58A6FF',
    tag: 'READ MORE',
  },
]

// ─── Platform Arm ───────────────────────────────────────────
const PLATFORMS = [
  {
    name: 'FundForge',
    desc: 'Transparent fundraising infrastructure. No middlemen, no platform fees on donations.',
    url: 'https://fundforge.finance',
    color: '#A855F7',
    tag: 'LIVE',
  },
  {
    name: 'DraftProSe',
    desc: 'AI-powered legal document generation. Contracts, filings, and patent prose — accessible to everyone.',
    url: 'https://draft.prose',
    color: '#A855F7',
    tag: 'LIVE',
  },
]

// ─── Animated counter ───────────────────────────────────────
function AnimatedNumber({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let current = 0
    const step = Math.max(1, Math.floor(target / 40))
    const interval = setInterval(() => {
      current += step
      if (current >= target) { setVal(target); clearInterval(interval) }
      else setVal(current)
    }, 30)
    return () => clearInterval(interval)
  }, [started, target])

  return <span ref={ref}>{val}{suffix}</span>
}

// ─── Section card ───────────────────────────────────────────
function ArmCard({ item, index, isInternal }) {
  const [hovered, setHovered] = useState(false)

  const inner = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-surface)' : 'rgba(13,17,23,0.5)',
        border: `1px solid ${hovered ? item.color + '40' : 'var(--border-dim)'}`,
        borderRadius: 12,
        padding: '24px 22px 20px',
        cursor: 'pointer',
        transition: 'all 0.35s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 8px 30px ${item.color}12, 0 0 0 1px ${item.color}15`
          : '0 2px 8px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {hovered && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
        }} />
      )}

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 14,
      }}>
        <span style={{
          padding: '4px 10px', borderRadius: 4,
          background: item.color + '12', border: `1px solid ${item.color}20`,
          fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: item.color, letterSpacing: '0.08em',
        }}>
          {item.tag}
        </span>
        <span style={{
          fontSize: 14, color: hovered ? item.color : 'var(--text-faint)',
          transition: 'all 0.3s',
          transform: hovered ? 'translateX(3px)' : 'none',
        }}>
          &rarr;
        </span>
      </div>

      <h3 style={{
        margin: '0 0 8px', fontSize: 18, fontWeight: 700,
        color: hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        transition: 'color 0.3s',
      }}>
        {item.name}
      </h3>

      <p style={{
        margin: 0, fontSize: 13, color: 'var(--text-muted)',
        lineHeight: 1.7, flex: 1,
      }}>
        {item.desc}
      </p>
    </div>
  )

  if (isInternal) {
    return <Link href={item.href} style={{ display: 'block' }}>{inner}</Link>
  }
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
      {inner}
    </a>
  )
}

// ─── Stats bar ──────────────────────────────────────────────
function StatsBar() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: 1,
      background: 'var(--border-dim)',
      borderRadius: 10,
      overflow: 'hidden',
      maxWidth: 700,
      margin: '0 auto',
    }}>
      {[
        { value: 12, suffix: '+', label: 'Open Source Repos' },
        { value: 4, suffix: '', label: 'Deployed Civic Tools' },
        { value: 7, suffix: '+', label: 'Patent Concepts' },
        { value: 0, suffix: '', label: 'Royalties Charged', special: true },
      ].map((stat, i) => (
        <div key={i} style={{
          background: 'var(--bg-surface)',
          padding: '20px 16px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 28, fontWeight: 800,
            color: stat.special ? 'var(--accent-green)' : 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '-0.02em',
          }}>
            {stat.special ? '$0' : <AnimatedNumber target={stat.value} suffix={stat.suffix} />}
          </div>
          <div style={{
            fontSize: 10, color: 'var(--text-faint)',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
            marginTop: 4,
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────
export default function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <GridBackground />
      <Nav />

      {/* ═══ HERO ═══ */}
      <section style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        minHeight: 'calc(100vh - 57px)',
        padding: '80px 24px 60px',
        gap: 28,
      }}>
        {/* Radial glow behind logo */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(88,166,255,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{
          animation: mounted ? 'fade-up 0.7s ease both' : 'none',
          position: 'relative',
        }}>
          <div style={{
            width: 100, height: 100, borderRadius: 20,
            background: 'linear-gradient(135deg, #58A6FF 0%, #1F6FEB 40%, #A855F7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 60px rgba(88,166,255,0.2), 0 0 120px rgba(88,166,255,0.08)',
            animation: 'glow-pulse 3s ease-in-out infinite',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontWeight: 800,
              fontSize: 22, color: '#fff', letterSpacing: '0.08em',
            }}>
              O.S.P.
            </span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ animation: mounted ? 'fade-up 0.7s ease 0.1s both' : 'none', maxWidth: 680 }}>
          <h1 style={{
            margin: 0, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.15, letterSpacing: '-0.03em',
            fontFamily: 'var(--font-body)',
          }}>
            Open Source Intelligence<br />
            <span style={{ color: 'var(--accent-blue)' }}>for the Public Good</span>
          </h1>
        </div>

        {/* Subhead */}
        <p style={{
          animation: mounted ? 'fade-up 0.7s ease 0.2s both' : 'none',
          maxWidth: 520, margin: 0,
          fontSize: 'clamp(14px, 2vw, 17px)',
          color: 'var(--text-muted)', lineHeight: 1.7,
        }}>
          We build civic accountability tools and release patents into the public domain.
          No royalty or charge. Ever.
        </p>

        {/* CTAs */}
        <div style={{
          animation: mounted ? 'fade-up 0.7s ease 0.3s both' : 'none',
          display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <Link href="/civic" style={{
            padding: '12px 28px', borderRadius: 8,
            background: 'linear-gradient(135deg, #58A6FF, #1F6FEB)',
            color: '#fff', fontWeight: 700, fontSize: 14,
            fontFamily: 'var(--font-body)', letterSpacing: '0.01em',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}>
            Explore Our Work
          </Link>
          <Link href="/mission" style={{
            padding: '12px 28px', borderRadius: 8,
            background: 'transparent',
            border: '1px solid var(--border-mid)',
            color: 'var(--text-secondary)', fontWeight: 600, fontSize: 14,
            fontFamily: 'var(--font-body)', letterSpacing: '0.01em',
            transition: 'all 0.2s',
          }}>
            Our Mission
          </Link>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 24,
          animation: mounted ? 'float 3s ease-in-out infinite' : 'none',
          opacity: 0.3,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </section>

      {/* ═══ PHILOSOPHY STRIP ═══ */}
      <section style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid var(--border-dim)',
        borderBottom: '1px solid var(--border-dim)',
        padding: '48px 24px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(88,166,255,0.02), transparent)',
      }}>
        <p style={{
          maxWidth: 680, margin: '0 auto',
          fontSize: 'clamp(16px, 2.5vw, 22px)',
          fontWeight: 600, lineHeight: 1.6,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
        }}>
          Everything we build, we build to give away.
          <br />
          <span style={{ color: 'var(--accent-blue)' }}>
            Our platforms fund the mission.
          </span>
        </p>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '48px 24px',
      }}>
        <StatsBar />
      </section>

      {/* ═══ TWO ARMS ═══ */}
      <section style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1060, margin: '0 auto',
        padding: '32px 24px 64px',
      }}>
        {/* ── Open Source Arm ── */}
        <div style={{ marginBottom: 56 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 8,
          }}>
            <div style={{
              width: 3, height: 24, borderRadius: 2,
              background: 'var(--accent-green)',
            }} />
            <h2 style={{
              margin: 0, fontSize: 24, fontWeight: 800,
              color: 'var(--text-primary)',
            }}>
              Open Source Arm
            </h2>
          </div>
          <p style={{
            margin: '0 0 24px', fontSize: 14, color: 'var(--text-muted)',
            paddingLeft: 15, lineHeight: 1.6,
          }}>
            Civic tools, patents, and platforms released for free under CC0 and Apache 2.0.
            No strings. No royalties. No exceptions.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 14,
          }}>
            {CIVIC_TOOLS.map((item, i) => (
              <ArmCard key={item.name} item={item} index={i} isInternal />
            ))}
          </div>
        </div>

        {/* ── Platform Arm ── */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 8,
          }}>
            <div style={{
              width: 3, height: 24, borderRadius: 2,
              background: 'var(--accent-purple)',
            }} />
            <h2 style={{
              margin: 0, fontSize: 24, fontWeight: 800,
              color: 'var(--text-primary)',
            }}>
              Platform Arm
            </h2>
          </div>
          <p style={{
            margin: '0 0 24px', fontSize: 14, color: 'var(--text-muted)',
            paddingLeft: 15, lineHeight: 1.6,
          }}>
            SaaS products that generate the revenue to sustain everything above.
            Open core, transparent operations.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
          }}>
            {PLATFORMS.map((item, i) => (
              <ArmCard key={item.name} item={item} index={i} />
            ))}
          </div>
          <Link href="/services" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 16, paddingLeft: 15,
            fontSize: 13, color: 'var(--accent-purple)',
            fontWeight: 600, transition: 'opacity 0.2s',
          }}>
            View all services &rarr;
          </Link>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '64px 24px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-dim)',
        background: 'linear-gradient(180deg, transparent, rgba(88,166,255,0.015))',
      }}>
        <h2 style={{
          margin: '0 0 12px', fontSize: 'clamp(22px, 3vw, 32px)',
          fontWeight: 800, color: 'var(--text-primary)',
        }}>
          Your voice matters.
        </h2>
        <p style={{
          margin: '0 auto 24px', maxWidth: 460,
          fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7,
        }}>
          See something wrong? Have an idea? The public board is open.
          Anonymous submissions welcome.
        </p>
        <Link href="/voice" style={{
          display: 'inline-block',
          padding: '12px 32px', borderRadius: 8,
          background: 'linear-gradient(135deg, #FFD000, #FF8C00)',
          color: '#000', fontWeight: 700, fontSize: 14,
        }}>
          Submit a Report
        </Link>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid var(--border-dim)',
        padding: '40px 24px',
      }}>
        <div style={{
          maxWidth: 1060, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 32,
        }}>
          {/* Brand col */}
          <div style={{ minWidth: 200 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontWeight: 800,
              fontSize: 16, color: 'var(--accent-blue)',
              letterSpacing: '0.08em', marginBottom: 8,
            }}>
              O.S.P.
            </div>
            <p style={{
              fontSize: 12, color: 'var(--text-faint)', lineHeight: 1.6, margin: 0,
            }}>
              OpenSourcePatents LLC
              <br />New Hampshire
            </p>
            <a href="mailto:opensourcepatents@gmail.com" style={{
              display: 'inline-block', marginTop: 8,
              fontSize: 11, color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border-mid)',
            }}>
              opensourcepatents@gmail.com
            </a>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            <div>
              <div style={{
                fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700,
                color: 'var(--text-faint)', letterSpacing: '0.1em', marginBottom: 12,
              }}>
                OPEN SOURCE
              </div>
              {[
                { href: '/civic', label: 'Civic Tools' },
                { href: '/patents', label: 'Patents' },
                { href: '/voice', label: 'Your Voice' },
                { href: '/mission', label: 'Mission' },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{
                  display: 'block', fontSize: 13, color: 'var(--text-muted)',
                  marginBottom: 8, transition: 'color 0.2s',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div>
              <div style={{
                fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700,
                color: 'var(--text-faint)', letterSpacing: '0.1em', marginBottom: 12,
              }}>
                PLATFORMS
              </div>
              <a href="https://fundforge.finance" target="_blank" rel="noopener noreferrer" style={{
                display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8,
              }}>
                FundForge
              </a>
              <a href="https://draft.prose" target="_blank" rel="noopener noreferrer" style={{
                display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8,
              }}>
                DraftProSe
              </a>
              <Link href="/services" style={{
                display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8,
              }}>
                All Services
              </Link>
            </div>
            <div>
              <div style={{
                fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700,
                color: 'var(--text-faint)', letterSpacing: '0.1em', marginBottom: 12,
              }}>
                CONNECT
              </div>
              <a href="https://github.com/OpenSourcePatents" target="_blank" rel="noopener noreferrer" style={{
                display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8,
              }}>
                GitHub
              </a>
              <Link href="/login" style={{
                display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8,
              }}>
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          maxWidth: 1060, margin: '32px auto 0',
          paddingTop: 20, borderTop: '1px solid var(--border-dim)',
          display: 'flex', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 8,
        }}>
          <p style={{
            fontSize: 10, fontFamily: 'var(--font-mono)',
            color: 'var(--border-mid)', letterSpacing: '0.06em', margin: 0,
          }}>
            CC0 Public Domain &mdash; No royalty or charge. Ever.
          </p>
          <p style={{
            fontSize: 10, fontFamily: 'var(--font-mono)',
            color: 'var(--border-mid)', letterSpacing: '0.06em', margin: 0,
          }}>
            &copy; {new Date().getFullYear()} OpenSourcePatents LLC
          </p>
        </div>
      </footer>
    </div>
  )
}

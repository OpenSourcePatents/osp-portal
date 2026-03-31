'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'

const NAV_ITEMS = [
  { href: '/civic', label: 'CIVIC' },
  { href: '/mission', label: 'MISSION' },
  { href: '/services', label: 'SERVICES' },
  { href: '/patents', label: 'PATENTS' },
  { href: '/voice', label: 'YOUR VOICE' },
]

export default function Nav() {
  const pathname = usePathname()
  const { user, isAdmin, signOut, loading } = useAuth()

  return (
    <nav style={{
      position: 'relative',
      zIndex: 10,
      borderBottom: '1px solid var(--border-dim)',
      background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-void) 100%)',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        gap: 8,
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 800,
          fontSize: 16,
          color: 'var(--accent-blue)',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
        }}>
          O.S.P.
        </Link>

        {/* Nav Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          overflowX: 'auto',
          flex: 1,
          justifyContent: 'center',
        }}>
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname === href || pathname?.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: '8px 14px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: active ? 'var(--accent-blue)' : 'var(--text-muted)',
                  background: active ? 'rgba(88,166,255,0.08)' : 'transparent',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </Link>
            )
          })}
          {isAdmin && (
            <Link
              href="/admin"
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: pathname?.startsWith('/admin') ? 'var(--accent-red)' : 'var(--accent-orange)',
                background: pathname?.startsWith('/admin') ? 'rgba(255,46,46,0.08)' : 'transparent',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              ADMIN
            </Link>
          )}
        </div>

        {/* Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {loading ? null : user ? (
            <button
              onClick={signOut}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-mid)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                letterSpacing: '0.06em',
              }}
            >
              SIGN OUT
            </button>
          ) : (
            <Link
              href="/login"
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                background: 'rgba(88,166,255,0.1)',
                border: '1px solid rgba(88,166,255,0.2)',
                color: 'var(--accent-blue)',
                letterSpacing: '0.06em',
              }}
            >
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

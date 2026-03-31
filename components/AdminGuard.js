'use client'

import { useAuth } from './AuthProvider'
import Link from 'next/link'

export default function AdminGuard({ children }) {
  const { isAdmin, loading, user } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-faint)',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
      }}>
        AUTHENTICATING...
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
      }}>
        <p style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
          AUTHENTICATION REQUIRED
        </p>
        <Link href="/login" style={{
          padding: '10px 24px',
          borderRadius: 8,
          background: 'rgba(88,166,255,0.1)',
          border: '1px solid rgba(88,166,255,0.2)',
          color: 'var(--accent-blue)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 600,
        }}>
          SIGN IN →
        </Link>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 12,
      }}>
        <p style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
          ACCESS DENIED
        </p>
        <p style={{ color: 'var(--text-faint)', fontSize: 12 }}>
          Admin privileges required.
        </p>
      </div>
    )
  }

  return children
}

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

export default function LoginPage() {
  const [supabase] = useState(() => createClient())
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login') // login | signup | magic
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({ email })
        if (error) throw error
        setMessage('Check your email for the magic link!')
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('Check your email to confirm your account!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.href = '/'
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-mid)',
    borderRadius: 8,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    outline: 'none',
  }

  const btnStyle = {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #58A6FF, #1F6FEB)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-dim)',
        borderRadius: 12,
        padding: 32,
      }}>
        <Link href="/" style={{
          display: 'block',
          textAlign: 'center',
          marginBottom: 24,
          color: 'var(--accent-blue)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: '0.08em',
        }}>
          O.S.P.
        </Link>

        <h1 style={{
          textAlign: 'center',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: '0 0 8px',
        }}>
          {mode === 'signup' ? 'Create Account' : mode === 'magic' ? 'Magic Link' : 'Sign In'}
        </h1>

        <p style={{
          textAlign: 'center',
          fontSize: 12,
          color: 'var(--text-muted)',
          margin: '0 0 24px',
        }}>
          {mode === 'magic'
            ? 'We\'ll send you a login link'
            : mode === 'signup'
            ? 'Join the network'
            : 'Welcome back'}
        </p>

        {/* OAuth Buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => handleOAuth('google')}
            style={{
              flex: 1, padding: '10px', background: 'var(--bg-surface)',
              border: '1px solid var(--border-mid)', borderRadius: 8,
              color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            Google
          </button>
          <button
            onClick={() => handleOAuth('github')}
            style={{
              flex: 1, padding: '10px', background: 'var(--bg-surface)',
              border: '1px solid var(--border-mid)', borderRadius: 8,
              color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            GitHub
          </button>
        </div>

        <div style={{
          textAlign: 'center', fontSize: 10, color: 'var(--text-faint)',
          margin: '12px 0', fontFamily: 'var(--font-mono)',
        }}>
          OR
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          {mode !== 'magic' && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={inputStyle}
            />
          )}

          <button type="submit" disabled={loading} style={{
            ...btnStyle,
            opacity: loading ? 0.6 : 1,
          }}>
            {loading ? 'Loading...' : mode === 'signup' ? 'Sign Up' : mode === 'magic' ? 'Send Magic Link' : 'Sign In'}
          </button>
        </form>

        {error && (
          <p style={{ color: 'var(--accent-red)', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
            {error}
          </p>
        )}
        {message && (
          <p style={{ color: 'var(--accent-green)', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
            {message}
          </p>
        )}

        <div style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center',
          fontSize: 12,
          color: 'var(--text-muted)',
        }}>
          {mode === 'login' && (
            <>
              <button onClick={() => setMode('signup')} style={{
                background: 'none', border: 'none', color: 'var(--accent-blue)',
                cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)',
              }}>
                Don&apos;t have an account? Sign up
              </button>
              <button onClick={() => setMode('magic')} style={{
                background: 'none', border: 'none', color: 'var(--text-faint)',
                cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-body)',
              }}>
                Use magic link instead
              </button>
            </>
          )}
          {mode === 'signup' && (
            <button onClick={() => setMode('login')} style={{
              background: 'none', border: 'none', color: 'var(--accent-blue)',
              cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)',
            }}>
              Already have an account? Sign in
            </button>
          )}
          {mode === 'magic' && (
            <button onClick={() => setMode('login')} style={{
              background: 'none', border: 'none', color: 'var(--accent-blue)',
              cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)',
            }}>
              Back to password login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import GridBackground from './GridBackground'
import Nav from './Nav'

export default function PageShell({ children, title, subtitle }) {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <GridBackground />
      <Nav />
      <main style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1100,
        margin: '0 auto',
        padding: '40px 24px 80px',
      }}>
        {title && (
          <div style={{ marginBottom: 32, animation: 'fade-up 0.5s ease both' }}>
            <h1 style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{
                margin: '6px 0 0',
                fontSize: 12,
                color: 'var(--text-faint)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.12em',
              }}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  )
}

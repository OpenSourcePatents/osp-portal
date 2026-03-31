'use client'

export default function GridBackground() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundImage: 'linear-gradient(rgba(88,166,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(88,166,255,0.025) 1px, transparent 1px)',
      backgroundSize: '60px 60px',
      animation: 'grid-scan 4s linear infinite',
      pointerEvents: 'none',
      zIndex: 0,
    }} />
  )
}

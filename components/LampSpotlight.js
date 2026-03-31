'use client'

export default function LampSpotlight({ children }) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Lamp fixture */}
      <div style={{
        position: 'absolute',
        top: -60,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
      }}>
        {/* Arm */}
        <div style={{
          width: 2,
          height: 30,
          background: 'linear-gradient(180deg, var(--border-mid), #8B7355)',
          margin: '0 auto',
        }} />
        {/* Shade */}
        <div style={{
          width: 80,
          height: 28,
          background: 'linear-gradient(180deg, #2A2218, #1A1510)',
          borderRadius: '50% 50% 0 0',
          border: '1px solid #3D3225',
          borderBottom: 'none',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
          {/* Bulb glow */}
          <div style={{
            width: 12,
            height: 8,
            borderRadius: '0 0 50% 50%',
            background: 'radial-gradient(circle, #FFE4B5, #FFCC66)',
            boxShadow: '0 0 12px #FFD98066, 0 0 24px #FFD98033',
            animation: 'lamp-flicker 4s ease-in-out infinite',
            marginBottom: -2,
          }} />
        </div>
      </div>

      {/* Light cone */}
      <div style={{
        position: 'absolute',
        top: -4,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '250px solid transparent',
        borderRight: '250px solid transparent',
        borderTop: '500px solid rgba(255,225,150,0.03)',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(20px)',
      }} />

      {/* Radial warm glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 600,
        height: '100%',
        background: 'radial-gradient(ellipse at top center, rgba(255,210,100,0.06) 0%, rgba(255,210,100,0.02) 40%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'lamp-flicker 4s ease-in-out infinite',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

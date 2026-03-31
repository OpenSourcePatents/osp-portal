'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import PageShell from '@/components/PageShell'

export default function MissionPage() {
  const [supabase] = useState(() => createClient())
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'mission')
        .order('sort_order', { ascending: true })
      setContent(data || [])
      setLoading(false)
    }
    load()
  }, [supabase])

  return (
    <PageShell title="Mission" subtitle="WHY WE EXIST">
      {loading ? (
        <div style={{
          textAlign: 'center', padding: '60px 0',
          color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', fontSize: 12,
        }}>
          LOADING...
        </div>
      ) : (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {content.map((block, i) => (
            <div
              key={block.id}
              style={{
                marginBottom: 40,
                animation: `fade-up 0.5s ease ${i * 0.1}s both`,
              }}
            >
              {i === 0 ? (
                /* Hero block */
                <div style={{
                  background: 'linear-gradient(135deg, rgba(88,166,255,0.06), rgba(168,85,247,0.04))',
                  border: '1px solid rgba(88,166,255,0.12)',
                  borderRadius: 12,
                  padding: '40px 32px',
                  textAlign: 'center',
                  marginBottom: 40,
                }}>
                  <h2 style={{
                    margin: 0,
                    fontSize: 26,
                    fontWeight: 800,
                    color: 'var(--accent-blue)',
                    lineHeight: 1.3,
                  }}>
                    &ldquo;{block.title}&rdquo;
                  </h2>
                  <p style={{
                    margin: '16px 0 0',
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.8,
                  }}>
                    {block.body}
                  </p>
                </div>
              ) : (
                <>
                  <h3 style={{
                    margin: '0 0 12px',
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}>
                    {block.title}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: 14,
                    color: 'var(--text-muted)',
                    lineHeight: 1.8,
                  }}>
                    {block.body}
                  </p>
                </>
              )}
            </div>
          ))}

          {/* License badges */}
          <div style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            marginTop: 40,
            animation: `fade-up 0.5s ease ${content.length * 0.1}s both`,
          }}>
            {['CC0', 'Apache 2.0'].map((license) => (
              <span
                key={license}
                style={{
                  padding: '8px 20px',
                  borderRadius: 8,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-mid)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--accent-green)',
                  letterSpacing: '0.08em',
                }}
              >
                {license}
              </span>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  )
}

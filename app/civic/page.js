'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import PageShell from '@/components/PageShell'
import CivicCard from '@/components/CivicCard'

export default function CivicPage() {
  const [supabase] = useState(() => createClient())
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('civic_projects')
        .select('*')
        .order('sort_order', { ascending: true })
      setProjects(data || [])
      setLoading(false)
    }
    load()
  }, [supabase])

  return (
    <PageShell title="Civic Arm" subtitle="PUBLIC ACCOUNTABILITY TOOLS">
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 0',
          color: 'var(--text-faint)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
        }}>
          LOADING...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: 16,
        }}>
          {projects.map((project, i) => (
            <CivicCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}
    </PageShell>
  )
}

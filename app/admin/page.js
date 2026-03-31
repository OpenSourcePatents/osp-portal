'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import PageShell from '@/components/PageShell'
import AdminGuard from '@/components/AdminGuard'
import AdminTable from '@/components/AdminTable'
import AdminFormModal from '@/components/AdminFormModal'
import ImageUpload from '@/components/ImageUpload'

const TABS = ['civic_projects', 'services', 'patents', 'voice', 'site_content']

const CIVIC_FIELDS = [
  { key: 'name', label: 'NAME', required: true },
  { key: 'subtitle', label: 'SUBTITLE' },
  { key: 'description', label: 'DESCRIPTION', type: 'textarea' },
  { key: 'status', label: 'STATUS', type: 'select', options: [
    { value: 'deployed', label: 'Deployed' },
    { value: 'pending', label: 'Pending' },
  ], default: 'pending' },
  { key: 'color', label: 'COLOR', default: '#58A6FF' },
  { key: 'tags', label: 'TAGS', type: 'tags' },
  { key: 'url', label: 'URL' },
  { key: 'sort_order', label: 'SORT ORDER', type: 'number', default: 0 },
]

const SERVICE_FIELDS = [
  { key: 'name', label: 'NAME', required: true },
  { key: 'subtitle', label: 'SUBTITLE' },
  { key: 'description', label: 'DESCRIPTION', type: 'textarea' },
  { key: 'pricing_summary', label: 'PRICING SUMMARY' },
  { key: 'url', label: 'URL' },
  { key: 'sort_order', label: 'SORT ORDER', type: 'number', default: 0 },
]

const PATENT_FIELDS = [
  { key: 'name', label: 'NAME', required: true },
  { key: 'description', label: 'DESCRIPTION', type: 'textarea' },
  { key: 'category', label: 'CATEGORY', type: 'select', options: [
    { value: 'defense', label: 'Defense' },
    { value: 'energy', label: 'Energy' },
    { value: 'food', label: 'Food' },
    { value: 'fintech', label: 'Fintech' },
    { value: 'civic', label: 'Civic' },
    { value: 'other', label: 'Other' },
  ], default: 'other' },
  { key: 'status', label: 'STATUS', type: 'select', options: [
    { value: 'concept', label: 'Concept' },
    { value: 'provisional_filed', label: 'Provisional Filed' },
    { value: 'published', label: 'Published' },
    { value: 'pending', label: 'Pending' },
  ], default: 'concept' },
  { key: 'repo_url', label: 'REPO URL' },
  { key: 'document_url', label: 'DOCUMENT URL' },
  { key: 'sort_order', label: 'SORT ORDER', type: 'number', default: 0 },
]

const CONTENT_FIELDS = [
  { key: 'slug', label: 'SLUG', required: true },
  { key: 'title', label: 'TITLE' },
  { key: 'body', label: 'BODY', type: 'textarea' },
  { key: 'section', label: 'SECTION', default: 'mission' },
  { key: 'sort_order', label: 'SORT ORDER', type: 'number', default: 0 },
]

const TAB_CONFIG = {
  civic_projects: {
    label: 'CIVIC PROJECTS',
    table: 'civic_projects',
    fields: CIVIC_FIELDS,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'status', label: 'Status', render: (v) => (
        <span style={{
          color: v === 'deployed' ? 'var(--accent-green)' : 'var(--accent-yellow)',
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
        }}>{v?.toUpperCase()}</span>
      )},
      { key: 'url', label: 'URL' },
      { key: 'sort_order', label: 'Order' },
    ],
    hasLogo: true,
    logoBucket: 'logos',
  },
  services: {
    label: 'SERVICES',
    table: 'services',
    fields: SERVICE_FIELDS,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'pricing_summary', label: 'Pricing' },
      { key: 'url', label: 'URL' },
      { key: 'sort_order', label: 'Order' },
    ],
    hasLogo: true,
    logoBucket: 'logos',
  },
  patents: {
    label: 'PATENTS',
    table: 'patents',
    fields: PATENT_FIELDS,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'category', label: 'Category' },
      { key: 'status', label: 'Status', render: (v) => (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
          color: v === 'provisional_filed' ? 'var(--accent-orange)' : v === 'published' ? 'var(--accent-green)' : 'var(--text-faint)',
        }}>{v?.toUpperCase().replace('_', ' ')}</span>
      )},
      { key: 'sort_order', label: 'Order' },
    ],
    hasDocument: true,
    docBucket: 'patents',
  },
  voice: {
    label: 'VOICE SUBMISSIONS',
    table: 'voice_submissions',
    fields: [],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'visibility', label: 'Visibility', render: (v) => (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
          color: v === 'public' ? 'var(--accent-green)' : 'var(--accent-orange)',
        }}>{v?.toUpperCase()}</span>
      )},
      { key: 'identity_mode', label: 'Identity' },
      { key: 'upvote_count', label: 'Votes' },
      { key: 'is_approved', label: 'Approved', render: (v) => (
        <span style={{
          color: v ? 'var(--accent-green)' : 'var(--accent-red)',
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
        }}>{v ? 'YES' : 'NO'}</span>
      )},
    ],
    isVoice: true,
  },
  site_content: {
    label: 'SITE CONTENT',
    table: 'site_content',
    fields: CONTENT_FIELDS,
    columns: [
      { key: 'slug', label: 'Slug' },
      { key: 'title', label: 'Title' },
      { key: 'section', label: 'Section' },
      { key: 'sort_order', label: 'Order' },
    ],
  },
}

function VoiceModeration({ supabase, submission, onUpdate }) {
  const toggleApproval = async () => {
    await supabase
      .from('voice_submissions')
      .update({ is_approved: !submission.is_approved })
      .eq('id', submission.id)
    onUpdate()
  }

  return (
    <button
      onClick={toggleApproval}
      style={{
        padding: '4px 10px', borderRadius: 4,
        background: submission.is_approved ? 'rgba(239,68,68,0.1)' : 'rgba(63,185,80,0.1)',
        border: `1px solid ${submission.is_approved ? 'rgba(239,68,68,0.2)' : 'rgba(63,185,80,0.2)'}`,
        color: submission.is_approved ? 'var(--accent-red)' : 'var(--accent-green)',
        fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)',
        cursor: 'pointer',
      }}
    >
      {submission.is_approved ? 'HIDE' : 'APPROVE'}
    </button>
  )
}

export default function AdminPage() {
  const [supabase] = useState(() => createClient())
  const [activeTab, setActiveTab] = useState('civic_projects')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingRow, setEditingRow] = useState(null)

  const config = TAB_CONFIG[activeTab]

  const loadData = useCallback(async () => {
    setLoading(true)
    const query = supabase.from(config.table).select('*')
    if (config.table !== 'voice_submissions') {
      query.order('sort_order', { ascending: true })
    } else {
      query.order('created_at', { ascending: false })
    }
    const { data } = await query
    setRows(data || [])
    setLoading(false)
  }, [supabase, config.table])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSave = async (formData) => {
    const cleaned = { ...formData }
    delete cleaned.id
    delete cleaned.created_at
    delete cleaned.updated_at

    if (editingRow) {
      await supabase.from(config.table).update(cleaned).eq('id', editingRow.id)
    } else {
      await supabase.from(config.table).insert(cleaned)
    }
    setShowModal(false)
    setEditingRow(null)
    loadData()
  }

  const handleDelete = async (id) => {
    await supabase.from(config.table).delete().eq('id', id)
    loadData()
  }

  const handleEdit = (row) => {
    setEditingRow(row)
    setShowModal(true)
  }

  const handleReorder = async (id, direction) => {
    const idx = rows.findIndex(r => r.id === id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= rows.length) return

    const currentOrder = rows[idx].sort_order
    const swapOrder = rows[swapIdx].sort_order

    await supabase.from(config.table).update({ sort_order: swapOrder }).eq('id', rows[idx].id)
    await supabase.from(config.table).update({ sort_order: currentOrder }).eq('id', rows[swapIdx].id)
    loadData()
  }

  const handleLogoUpload = async (rowId, url) => {
    await supabase.from(config.table).update({ logo_url: url }).eq('id', rowId)
    loadData()
  }

  const handleDocUpload = async (rowId, url) => {
    await supabase.from(config.table).update({ document_url: url }).eq('id', rowId)
    loadData()
  }

  // Augment columns for voice moderation and uploads
  let displayColumns = [...config.columns]

  if (config.hasLogo) {
    displayColumns.push({
      key: 'logo_url',
      label: 'Logo',
      render: (val, row) => (
        <ImageUpload
          supabase={supabase}
          bucket={config.logoBucket}
          currentUrl={val}
          onUploaded={(url) => handleLogoUpload(row.id, url)}
        />
      ),
    })
  }

  if (config.hasDocument) {
    displayColumns.push({
      key: 'document_url',
      label: 'Document',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ImageUpload
            supabase={supabase}
            bucket={config.docBucket}
            currentUrl={null}
            onUploaded={(url) => handleDocUpload(row.id, url)}
          />
          {val && (
            <a href={val} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 10, color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)',
            }}>VIEW</a>
          )}
        </div>
      ),
    })
  }

  if (config.isVoice) {
    displayColumns.push({
      key: '_moderate',
      label: 'Moderate',
      render: (_, row) => (
        <VoiceModeration supabase={supabase} submission={row} onUpdate={loadData} />
      ),
    })
  }

  return (
    <AdminGuard>
      <PageShell title="Admin Panel" subtitle="FULL SYSTEM CONTROL">
        {/* Tab bar */}
        <div style={{
          display: 'flex',
          gap: 4,
          marginBottom: 24,
          overflowX: 'auto',
          flexWrap: 'wrap',
        }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setRows([]); }}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                background: activeTab === tab ? 'rgba(88,166,255,0.12)' : 'var(--bg-elevated)',
                border: `1px solid ${activeTab === tab ? 'rgba(88,166,255,0.3)' : 'var(--border-mid)'}`,
                color: activeTab === tab ? 'var(--accent-blue)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {TAB_CONFIG[tab].label}
            </button>
          ))}
        </div>

        {/* Create button (not for voice) */}
        {!config.isVoice && (
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={() => { setEditingRow(null); setShowModal(true); }}
              style={{
                padding: '8px 20px',
                borderRadius: 6,
                background: 'linear-gradient(135deg, #3FB950, #238636)',
                border: 'none',
                color: '#fff',
                fontWeight: 700,
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.06em',
                cursor: 'pointer',
              }}
            >
              + CREATE NEW
            </button>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div style={{
            textAlign: 'center', padding: '40px 0',
            color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', fontSize: 12,
          }}>
            LOADING...
          </div>
        ) : (
          <AdminTable
            columns={displayColumns}
            rows={rows}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReorder={!config.isVoice ? handleReorder : undefined}
          />
        )}

        {/* Form Modal */}
        {showModal && config.fields.length > 0 && (
          <AdminFormModal
            fields={config.fields}
            initialData={editingRow}
            onSave={handleSave}
            onClose={() => { setShowModal(false); setEditingRow(null); }}
            title={`${editingRow ? 'Edit' : 'Create'} ${config.label}`}
          />
        )}
      </PageShell>
    </AdminGuard>
  )
}

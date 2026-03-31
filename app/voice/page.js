'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/components/AuthProvider'
import GridBackground from '@/components/GridBackground'
import Nav from '@/components/Nav'
import LampSpotlight from '@/components/LampSpotlight'

function SubmissionForm({ supabase, user, onSubmitted }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [visibility, setVisibility] = useState('public')
  const [identityMode, setIdentityMode] = useState('anonymous')
  const [displayName, setDisplayName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    const { error } = await supabase.from('voice_submissions').insert({
      user_id: user?.id || null,
      title,
      body,
      visibility,
      identity_mode: identityMode,
      display_name: identityMode === 'username' ? displayName : identityMode === 'full' ? displayName : null,
    })

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Submitted! Your voice matters.')
      setTitle('')
      setBody('')
      setDisplayName('')
      onSubmitted()
    }
    setSubmitting(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(13,17,23,0.8)',
    border: '1px solid var(--border-mid)',
    borderRadius: 8,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%238B949E\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: 36,
  }

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      <input
        type="text"
        placeholder="Subject — what's on your mind?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={inputStyle}
      />

      <textarea
        placeholder="Speak freely. Be heard."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        rows={5}
        style={{
          ...inputStyle,
          resize: 'vertical',
          fontFamily: 'var(--font-body)',
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{
            display: 'block', fontSize: 10, color: 'var(--text-faint)',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
            marginBottom: 6,
          }}>
            BOARD
          </label>
          <select value={visibility} onChange={(e) => setVisibility(e.target.value)} style={selectStyle}>
            <option value="public">Public Board</option>
            <option value="private">Private (Admin Only)</option>
          </select>
        </div>
        <div>
          <label style={{
            display: 'block', fontSize: 10, color: 'var(--text-faint)',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
            marginBottom: 6,
          }}>
            IDENTITY
          </label>
          <select value={identityMode} onChange={(e) => setIdentityMode(e.target.value)} style={selectStyle}>
            <option value="anonymous">Anonymous</option>
            <option value="username">Username Only</option>
            <option value="full">Full Identity</option>
          </select>
        </div>
      </div>

      {(identityMode === 'username' || identityMode === 'full') && (
        <input
          type="text"
          placeholder={identityMode === 'full' ? 'Your full name' : 'Display name'}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          style={inputStyle}
        />
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          padding: '14px',
          background: 'linear-gradient(135deg, #FFD000, #FF8C00)',
          border: 'none',
          borderRadius: 8,
          color: '#000',
          fontWeight: 800,
          fontSize: 13,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.08em',
          cursor: 'pointer',
          opacity: submitting ? 0.6 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {submitting ? 'SUBMITTING...' : 'SUBMIT'}
      </button>

      {message && (
        <p style={{
          textAlign: 'center',
          fontSize: 12,
          color: message.startsWith('Error') ? 'var(--accent-red)' : 'var(--accent-green)',
          margin: 0,
        }}>
          {message}
        </p>
      )}
    </form>
  )
}

function SubmissionCard({ submission, supabase, user, onVoteChange }) {
  const [hovered, setHovered] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [voteLoading, setVoteLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from('voice_upvotes')
      .select('id')
      .eq('submission_id', submission.id)
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data && data.length > 0) setHasVoted(true)
      })
  }, [user, submission.id, supabase])

  const handleVote = async () => {
    if (!user || voteLoading) return
    setVoteLoading(true)

    if (hasVoted) {
      await supabase
        .from('voice_upvotes')
        .delete()
        .eq('submission_id', submission.id)
        .eq('user_id', user.id)
      setHasVoted(false)
    } else {
      await supabase
        .from('voice_upvotes')
        .insert({ submission_id: submission.id, user_id: user.id })
      setHasVoted(true)
    }
    setVoteLoading(false)
    onVoteChange()
  }

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-surface)' : 'rgba(13,17,23,0.6)',
        border: `1px solid ${hovered ? 'rgba(255,208,0,0.2)' : 'var(--border-dim)'}`,
        borderRadius: 10,
        padding: '18px 20px',
        transition: 'all 0.3s',
        display: 'flex',
        gap: 16,
      }}
    >
      {/* Upvote */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        minWidth: 40,
      }}>
        <button
          onClick={handleVote}
          disabled={!user}
          title={user ? (hasVoted ? 'Remove upvote' : 'Upvote') : 'Sign in to vote'}
          style={{
            background: 'none',
            border: 'none',
            cursor: user ? 'pointer' : 'default',
            fontSize: 18,
            color: hasVoted ? 'var(--accent-yellow)' : 'var(--text-faint)',
            transition: 'color 0.2s',
            padding: 4,
          }}
        >
          ▲
        </button>
        <span style={{
          fontSize: 13,
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          color: hasVoted ? 'var(--accent-yellow)' : 'var(--text-muted)',
        }}>
          {submission.upvote_count}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          margin: '0 0 6px',
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--text-primary)',
        }}>
          {submission.title}
        </h3>
        <p style={{
          margin: '0 0 10px',
          fontSize: 13,
          color: 'var(--text-muted)',
          lineHeight: 1.6,
        }}>
          {submission.body}
        </p>
        <div style={{
          display: 'flex',
          gap: 12,
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-faint)',
        }}>
          <span>
            {submission.identity_mode === 'anonymous'
              ? 'Anonymous'
              : submission.display_name || 'Anonymous'}
          </span>
          <span>{timeAgo(submission.created_at)}</span>
        </div>
      </div>
    </div>
  )
}

export default function VoicePage() {
  const [supabase] = useState(() => createClient())
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  const loadSubmissions = useCallback(async () => {
    const { data } = await supabase
      .from('voice_submissions')
      .select('*')
      .eq('visibility', 'public')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
    setSubmissions(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadSubmissions()
  }, [loadSubmissions])

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'var(--bg-void)' }}>
      <GridBackground />
      <Nav />

      <main style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 700,
        margin: '0 auto',
        padding: '80px 24px 80px',
      }}>
        {/* Lamp + Form section */}
        <LampSpotlight>
          <div style={{
            textAlign: 'center',
            marginBottom: 32,
            paddingTop: 20,
          }}>
            <div style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.2em',
              color: 'var(--text-faint)',
              marginBottom: 8,
            }}>
              YOUR VOICE MATTERS
            </div>
            <h1 style={{
              margin: '0 0 8px',
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--text-primary)',
            }}>
              Speak. Be Heard.
            </h1>
            <p style={{
              margin: 0,
              fontSize: 13,
              color: 'var(--accent-yellow)',
              fontStyle: 'italic',
              animation: 'lamp-flicker 4s ease-in-out infinite',
            }}>
              &ldquo;Sunlight is the best disinfectant.&rdquo;
            </p>
          </div>

          {/* Form in the spotlight */}
          <div style={{
            background: 'rgba(13,17,23,0.7)',
            border: '1px solid rgba(255,210,100,0.1)',
            borderRadius: 12,
            padding: '28px 24px',
            backdropFilter: 'blur(8px)',
          }}>
            <SubmissionForm
              supabase={supabase}
              user={user}
              onSubmitted={loadSubmissions}
            />
          </div>
        </LampSpotlight>

        {/* Public Board */}
        <div style={{ marginTop: 60 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 16,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.06em',
          }}>
            PUBLIC BOARD
          </h2>

          {loading ? (
            <div style={{
              textAlign: 'center', padding: '40px 0',
              color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', fontSize: 12,
            }}>
              LOADING...
            </div>
          ) : submissions.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '40px 0',
              color: 'var(--text-faint)', fontSize: 13,
            }}>
              No submissions yet. Be the first voice.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {submissions.map((sub) => (
                <SubmissionCard
                  key={sub.id}
                  submission={sub}
                  supabase={supabase}
                  user={user}
                  onVoteChange={loadSubmissions}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

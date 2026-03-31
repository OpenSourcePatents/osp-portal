'use client'

import { useState } from 'react'

const cellStyle = {
  padding: '10px 14px',
  fontSize: 12,
  color: 'var(--text-secondary)',
  borderBottom: '1px solid var(--border-dim)',
  maxWidth: 200,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const thStyle = {
  ...cellStyle,
  color: 'var(--text-faint)',
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  background: 'var(--bg-elevated)',
  position: 'sticky',
  top: 0,
}

export default function AdminTable({ columns, rows, onEdit, onDelete, onReorder }) {
  return (
    <div style={{
      overflowX: 'auto',
      border: '1px solid var(--border-dim)',
      borderRadius: 8,
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 12,
      }}>
        <thead>
          <tr>
            {onReorder && <th style={thStyle}>#</th>}
            {columns.map((col) => (
              <th key={col.key} style={thStyle}>{col.label}</th>
            ))}
            <th style={thStyle}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id} style={{ background: idx % 2 === 0 ? 'var(--bg-surface)' : 'transparent' }}>
              {onReorder && (
                <td style={cellStyle}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      onClick={() => onReorder(row.id, 'up')}
                      disabled={idx === 0}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: idx === 0 ? 'var(--border-mid)' : 'var(--text-muted)',
                        fontSize: 12, padding: 2,
                      }}
                    >▲</button>
                    <button
                      onClick={() => onReorder(row.id, 'down')}
                      disabled={idx === rows.length - 1}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: idx === rows.length - 1 ? 'var(--border-mid)' : 'var(--text-muted)',
                        fontSize: 12, padding: 2,
                      }}
                    >▼</button>
                  </div>
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} style={cellStyle}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
              <td style={cellStyle}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => onEdit(row)}
                    style={{
                      padding: '4px 10px', borderRadius: 4,
                      background: 'rgba(88,166,255,0.1)', border: '1px solid rgba(88,166,255,0.2)',
                      color: 'var(--accent-blue)', fontSize: 10, fontWeight: 600,
                      fontFamily: 'var(--font-mono)', cursor: 'pointer',
                    }}
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this item?')) onDelete(row.id)
                    }}
                    style={{
                      padding: '4px 10px', borderRadius: 4,
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                      color: 'var(--accent-red)', fontSize: 10, fontWeight: 600,
                      fontFamily: 'var(--font-mono)', cursor: 'pointer',
                    }}
                  >
                    DEL
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '30px 0',
          color: 'var(--text-faint)', fontSize: 12, fontFamily: 'var(--font-mono)',
        }}>
          NO RECORDS
        </div>
      )}
    </div>
  )
}

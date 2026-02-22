'use client'

import { useState, KeyboardEvent } from 'react'
import { X, Plus } from 'lucide-react'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  label?: string
}

export default function TagInput({ value, onChange, placeholder = 'Type and press Enter...', label }: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
      setInput('')
    }
  }

  const removeTag = (tag: string) => {
    onChange(value.filter(t => t !== tag))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div>
      {label && <label className="label">{label}</label>}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--surface-border)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 12px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        alignItems: 'center',
        transition: 'border-color 0.15s ease',
        cursor: 'text',
      }}
        onClick={() => {
          const inputs = document.querySelectorAll('.tag-input-field')
          inputs.forEach(i => (i as HTMLElement).focus())
        }}
      >
        {value.map(tag => (
          <span key={tag} className="tag" style={{ background: 'var(--surface-raised)' }}>
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center',
                lineHeight: 1,
              }}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          className="tag-input-field"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ''}
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.88rem',
            flex: 1,
            minWidth: '120px',
            padding: '2px 0',
            fontFamily: 'var(--font-dm)',
          }}
        />
        {input && (
          <button
            type="button"
            onClick={addTag}
            style={{
              background: 'var(--coral)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              padding: '2px 6px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Plus size={12} />
          </button>
        )}
      </div>
      {value.length === 0 && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          Press Enter or comma to add
        </p>
      )}
    </div>
  )
}

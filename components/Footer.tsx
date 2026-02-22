import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--surface-border)',
      padding: 'var(--space-xl) 24px',
      background: 'var(--navy)',
    }}>
      <div style={{
        maxWidth: 'var(--content-wide)',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-lg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 30, height: 30,
            background: 'var(--coral)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Heart size={14} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
            Emergency<span style={{ color: 'var(--coral)' }}>ID</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
          {[
            { href: '/', label: 'Home' },
            { href: '/create', label: 'Create Profile' },
            { href: '/dashboard', label: 'Dashboard' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Built for emergencies. Built with care.
        </p>
      </div>
    </footer>
  )
}

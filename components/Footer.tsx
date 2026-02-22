import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--surface-border)',
      padding: '48px 24px',
      background: 'var(--navy)',
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 28, height: 28,
            background: 'var(--coral)',
            borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Heart size={14} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'var(--text-primary)' }}>
            Emergency<span style={{ color: 'var(--coral)' }}>ID</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {[
            { href: '/', label: 'Home' },
            { href: '/create', label: 'Create Profile' },
            { href: '/dashboard', label: 'Dashboard' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Built for emergencies. Built with care.
        </p>
      </div>
    </footer>
  )
}

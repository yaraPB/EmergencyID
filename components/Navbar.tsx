'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Heart, Menu, X } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(13, 27, 42, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--surface-border)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          width: 32, height: 32,
          background: 'var(--coral)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Heart size={16} color="white" fill="white" />
        </div>
        <span style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: '1.1rem',
          color: 'var(--text-primary)',
        }}>
          Emergency<span style={{ color: 'var(--coral)' }}>ID</span>
        </span>
      </Link>

      {/* Desktop Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
        {[
          { href: '/', label: 'Home' },
          { href: '/create', label: 'Create Profile' },
          { href: '/dashboard', label: 'My Profiles' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              color: isActive(item.href) ? 'var(--text-primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: 500,
              background: isActive(item.href) ? 'var(--surface-raised)' : 'transparent',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              if (!isActive(item.href)) {
                (e.target as HTMLElement).style.color = 'var(--text-primary)'
              }
            }}
            onMouseLeave={e => {
              if (!isActive(item.href)) {
                (e.target as HTMLElement).style.color = 'var(--text-secondary)'
              }
            }}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/create" className="btn-primary" style={{ marginLeft: '8px', fontSize: '0.85rem', padding: '9px 20px' }}>
          Get Your ID
        </Link>
      </div>

      {/* Mobile Toggle */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          background: 'none', border: 'none', color: 'var(--text-primary)',
          cursor: 'pointer', padding: '4px',
        }}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '64px',
          left: 0, right: 0,
          background: 'var(--navy-mid)',
          borderBottom: '1px solid var(--surface-border)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {[
            { href: '/', label: 'Home' },
            { href: '/create', label: 'Create Profile' },
            { href: '/dashboard', label: 'My Profiles' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                color: isActive(item.href) ? 'var(--coral)' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/create" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ marginTop: '8px', justifyContent: 'center' }}>
            Get Your ID
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 641px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </nav>
  )
}

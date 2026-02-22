'use client'

import Link from 'next/link'
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      el.style.setProperty('--mouse-x', `${x}%`)
      el.style.setProperty('--mouse-y', `${y}%`)
    }

    el.addEventListener('mousemove', handleMouseMove)
    return () => el.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--navy)',
        '--mouse-x': '50%',
        '--mouse-y': '50%',
      } as React.CSSProperties}
    >
      {/* Radial glow following cursor */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(232, 83, 58, 0.05) 0%, transparent 60%)',
        pointerEvents: 'none',
        transition: 'opacity 0.3s ease',
      }} />

      {/* Grid background */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />

      {/* Decorative orbs */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '10%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232, 83, 58, 0.08) 0%, transparent 70%)',
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
        animation: 'float 8s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />

      {/* ECG line decoration */}
      <svg
        style={{ position: 'absolute', bottom: 80, left: 0, right: 0, opacity: 0.07, pointerEvents: 'none' }}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        height="120"
      >
        <path
          d="M0,60 L200,60 L240,60 L260,10 L280,110 L310,10 L340,110 L360,60 L400,60 L440,60 L460,20 L480,100 L500,20 L520,100 L540,60 L600,60 L1440,60"
          stroke="var(--coral)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Content */}
      <div className="section" style={{ paddingTop: '120px', paddingBottom: '80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 720 }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(232, 83, 58, 0.1)',
              border: '1px solid rgba(232, 83, 58, 0.3)',
              borderRadius: '100px',
              padding: '6px 16px',
              marginBottom: '32px',
              animation: 'fadeUp 0.5s ease forwards',
            }}
          >
            <span className="status-dot" />
            <span style={{ color: 'var(--coral)', fontSize: '0.8rem', fontFamily: 'var(--font-syne)', fontWeight: 600, letterSpacing: '0.08em' }}>
              EVERY SECOND COUNTS
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: '24px',
              animation: 'fadeUp 0.5s 0.1s ease both',
              opacity: 0,
            }}
          >
            Your medical info,{' '}
            <br />
            one scan away from{' '}
            <br />
            <span className="text-gradient">saving your life.</span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: 540,
              marginBottom: '40px',
              animation: 'fadeUp 0.5s 0.2s ease both',
              opacity: 0,
            }}
          >
            EmergencyID links a simple QR code to your critical medical information.
            In an emergency, a doctor scans it and instantly sees what they need —
            even if you can't speak.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              animation: 'fadeUp 0.5s 0.3s ease both',
              opacity: 0,
            }}
          >
            <Link href="/create" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 28px' }}>
              Create Your Emergency ID
              <ArrowRight size={18} />
            </Link>
            <Link href="#how-it-works" className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 28px' }}>
              See How It Works
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              marginTop: '48px',
              flexWrap: 'wrap',
              animation: 'fadeUp 0.5s 0.4s ease both',
              opacity: 0,
            }}
          >
            {[
              { icon: <Zap size={14} />, label: 'Instant Access', desc: 'No login required' },
              { icon: <Shield size={14} />, label: 'You Control', desc: 'Choose what\'s visible' },
              { icon: <Lock size={14} />, label: 'One Scan', desc: 'Works with any phone' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: 32, height: 32,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-raised)',
                  border: '1px solid var(--surface-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--coral)',
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code visual mockup */}
        <div
          style={{
            position: 'absolute',
            right: '5%',
            top: '50%',
            transform: 'translateY(-50%)',
            animation: 'fadeIn 0.8s 0.5s ease both, float 6s 1s ease-in-out infinite',
            opacity: 0,
          }}
          className="hero-qr"
        >
          {/* <QRMockup /> */}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-qr { display: none; }
        }
      `}</style>
    </section>
  )
}


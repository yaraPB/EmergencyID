'use client'

import { UserPlus, QrCode, ScanLine } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: <UserPlus size={24} />,
    title: 'Fill Your Profile',
    description:
      'Enter your blood type, allergies, chronic conditions, medications, and emergency contacts. You decide exactly what to share — per field.',
    accent: 'var(--coral)',
  },
  {
    number: '02',
    icon: <QrCode size={24} />,
    title: 'Get Your QR Code',
    description:
      'A unique QR code is generated instantly for your profile. Print it, keep it on your phone lock screen, or put it in your wallet.',
    accent: '#3b82f6',
  },
  {
    number: '03',
    icon: <ScanLine size={24} />,
    title: 'Scan in Emergencies',
    description:
      'A doctor or paramedic scans the code — no login, no app. Your critical information appears instantly on any device with a browser.',
    accent: 'var(--green)',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background: 'var(--navy)',
        padding: '100px 24px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <div style={{
            display: 'inline-block',
            background: 'var(--surface-raised)',
            border: '1px solid var(--surface-border)',
            borderRadius: '100px',
            padding: '5px 16px',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
              HOW IT WORKS
            </span>
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}>
            Three steps to be ready for anything
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            Set up once, be protected forever. The whole process takes under 3 minutes.
          </p>
        </div>

        {/* Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="card"
              style={{
                padding: '36px 32px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.transform = 'translateY(-4px)'
                el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.3)`
                el.style.borderColor = step.accent
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
                el.style.borderColor = 'var(--surface-border)'
              }}
            >
              {/* Big number background */}
              <div className="step-number">{step.number}</div>

              {/* Icon */}
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 'var(--radius-md)',
                background: `${step.accent}18`,
                border: `1px solid ${step.accent}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: step.accent,
                marginBottom: '24px',
              }}>
                {step.icon}
              </div>

              <h3 className="font-display" style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                marginBottom: '12px',
                color: 'var(--text-primary)',
              }}>
                {step.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                {step.description}
              </p>

              {/* Connector line for non-last items */}
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  right: '-13px',
                  top: '50%',
                  width: 26,
                  height: 2,
                  background: `linear-gradient(90deg, ${step.accent}60, transparent)`,
                  zIndex: 1,
                }} className="connector-line" />
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .connector-line { display: none; }
        }
      `}</style>
    </section>
  )
}

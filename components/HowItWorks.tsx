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
        padding: 'var(--section-padding)',
      }}
    >
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div style={{
            display: 'inline-block',
            background: 'var(--surface-raised)',
            border: '1px solid var(--surface-border)',
            borderRadius: '100px',
            padding: '8px 18px',
            marginBottom: 'var(--space-md)',
          }}>
            <span className="section-label">HOW IT WORKS</span>
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.9rem, 3.8vw, 2.75rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: 'var(--space-sm)',
          }}>
            Three steps to be ready for anything
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            Set up once, be protected forever. The whole process takes under 3 minutes.
          </p>
        </div>

        {/* Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-lg)',
        }}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="card card-hover"
              style={{
                padding: 'var(--space-lg) 28px',
                position: 'relative',
                overflow: 'hidden',
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
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: 'var(--space-sm)',
                color: 'var(--text-primary)',
              }}>
                {step.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
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

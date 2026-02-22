import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import HowItWorks from '@/components/HowItWorks'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Shield, Heart, AlertTriangle, Smartphone } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <WhyItMatters />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}

function WhyItMatters() {
  const stats = [
    { value: '< 3 min', label: 'to set up your profile', icon: <Heart size={20} /> },
    { value: '0 clicks', label: 'needed by emergency responders', icon: <Smartphone size={20} /> },
    { value: '100%', label: 'control over your privacy', icon: <Shield size={20} /> },
    { value: '0 apps', label: 'required to view your info', icon: <AlertTriangle size={20} /> },
  ]

  return (
    <section style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--surface-border)',
      borderBottom: '1px solid var(--surface-border)',
      padding: 'var(--section-padding)',
    }}>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 'var(--space-sm)' }}>
            Why EmergencyID matters
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.75, fontSize: '1.05rem' }}>
            In critical situations, first responders need information fast. Every second of confusion can cost a life.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-md)',
        }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card card-hover"
              style={{ padding: 'var(--space-lg) 28px', textAlign: 'center' }}
            >
              <div style={{
                width: 52, height: 52,
                borderRadius: 'var(--radius-md)',
                background: 'var(--coral-bg)',
                border: '1px solid var(--coral-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--coral)',
                margin: '0 auto var(--space-sm)',
              }}>
                {stat.icon}
              </div>
              <div className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--coral)', marginBottom: '8px' }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section style={{
      padding: 'var(--section-padding)',
      background: 'var(--navy)',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{
          width: 72, height: 72,
          background: 'var(--coral)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-lg)',
          boxShadow: '0 0 0 16px var(--coral-dim)',
          animation: 'float 4s ease-in-out infinite',
        }}>
          <Heart size={32} fill="white" color="white" />
        </div>
        <h2 className="font-display" style={{
          fontSize: 'clamp(1.9rem, 3.8vw, 2.75rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          marginBottom: 'var(--space-md)',
          lineHeight: 1.2,
        }}>
          Be ready before the<br />emergency happens
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-lg)', fontSize: '1.05rem' }}>
          It takes less than 3 minutes to create your Emergency ID. Don't wait until it's too late.
        </p>
        <Link href="/create" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 32px' }}>
          Create Your Free Emergency ID
        </Link>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
          Free forever. No account required to view emergency data.
        </p>
      </div>
    </section>
  )
}

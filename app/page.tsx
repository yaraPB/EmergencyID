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
      padding: '80px 24px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Why EmergencyID matters
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            In critical situations, first responders need information fast. Every second of confusion can cost a life.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card card-hover"
              style={{ padding: '32px 28px', textAlign: 'center' }}
            >
              <div style={{
                width: 48, height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(232,83,58,0.1)',
                border: '1px solid rgba(232,83,58,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--coral)',
                margin: '0 auto 16px',
              }}>
                {stat.icon}
              </div>
              <div className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--coral)', marginBottom: '8px' }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
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
      padding: '100px 24px',
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
          margin: '0 auto 32px',
          boxShadow: '0 0 0 16px rgba(232,83,58,0.08)',
          animation: 'float 4s ease-in-out infinite',
        }}>
          <Heart size={32} fill="white" color="white" />
        </div>
        <h2 className="font-display" style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          marginBottom: '20px',
          lineHeight: 1.1,
        }}>
          Be ready before the<br />emergency happens
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '40px', fontSize: '1rem' }}>
          It takes less than 3 minutes to create your Emergency ID. Don't wait until it's too late.
        </p>
        <Link href="/create" className="btn-primary" style={{ fontSize: '1.05rem', padding: '16px 36px' }}>
          Create Your Free Emergency ID
        </Link>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '16px' }}>
          Free forever. No account required to view emergency data.
        </p>
      </div>
    </section>
  )
}

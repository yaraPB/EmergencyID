import { prisma } from '@/lib/prisma'
import { Heart, AlertCircle, Phone, Calendar, ShieldCheck, Activity, Pill, Droplet, UserCheck, Smartphone, Info } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

interface EmergencyPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EmergencyPageProps): Promise<Metadata> {
  const { id } = await params
  const profile = await prisma.profile.findUnique({
    where: { publicId: id },
  })

  return {
    title: profile ? `Emergency ID: ${profile.fullName}` : 'Profile Not Found',
    description: 'Emergency medical information profile.',
  }
}

export default async function EmergencyPage({ params }: EmergencyPageProps) {
  const { id } = await params
  const profile = await prisma.profile.findUnique({
    where: { publicId: id },
  })

  if (!profile) {
    return <EmergencyNotFound />
  }

  const visibility = (profile.visibility as any) || {}
  const showDonor = visibility.organDonor && profile.organDonor;
  // Use profile.emergencyContacts directly since we're on server
  const showContacts = visibility.emergencyContacts && profile.emergencyContacts.length > 0;

  return (
    <div style={{ minHeight: '100vh', background: '#080c10', color: 'white' }}>
      {/* Critical Header Band */}
      <div style={{
        background: 'linear-gradient(to right, #7f1d1d, #ef4444, #7f1d1d)',
        height: '6px',
        width: '100%',
        position: 'fixed',
        top: 0,
        zIndex: 100
      }} />

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 20px 80px' }}>

        {/* Verification Badge */}
        <div
          className="fade-in"
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}
        >
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.2)',
            padding: '8px 16px',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#4ade80',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <ShieldCheck size={16} />
            Verified Emergency Record
          </div>
        </div>

        {/* Profile Card */}
        <div
          className="card fade-in"
          style={{
            padding: '48px 32px',
            textAlign: 'center',
            marginBottom: '32px',
            background: 'linear-gradient(180deg, var(--surface-raised) 0%, var(--surface) 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            position: 'relative',
            overflow: 'hidden',
            animationDelay: '0.1s'
          }}
        >
          {/* Subtle Glow Background */}
          <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(232, 90, 66, 0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />

          {/* Blood Type Badge */}
          <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 28px' }}>
            <div
              className="pulse-ring"
              style={{
                position: 'absolute', inset: -10, borderRadius: '50%', background: 'var(--coral)', filter: 'blur(20px)'
              }}
            />
            <div className="blood-badge" style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', fontSize: '1.75rem', border: '2px solid rgba(255,255,255,0.1)' }}>
              {visibility.bloodType && profile.bloodType ? profile.bloodType : '?'}
            </div>
          </div>

          <h1 className="font-display" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {profile.fullName}
          </h1>

          {visibility.dateOfBirth && profile.dateOfBirth && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              <Calendar size={18} />
              Born {new Date(profile.dateOfBirth).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          )}

          {showDonor && (
            <div style={{
              marginTop: '24px',
              background: 'rgba(34,197,94,0.12)',
              color: '#86efac',
              padding: '8px 20px',
              borderRadius: '100px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: 700,
              border: '1px solid rgba(34,197,94,0.2)'
            }}>
              <Heart size={16} fill="#86efac" />
              Organ Donor
            </div>
          )}
        </div>

        {/* Information Grid/List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Allergies */}
          {visibility.allergies && profile.allergies.length > 0 && (
            <div
              className="card fade-in"
              style={{ borderLeft: '4px solid var(--red)', padding: '24px 28px', background: 'rgba(239, 68, 68, 0.03)', animationDelay: '0.2s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#fca5a5' }}>
                <AlertCircle size={22} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Allergies (Critical)</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {profile.allergies.map((a: string) => (
                  <span key={a} className="tag tag-danger" style={{ fontSize: '1.1rem', padding: '10px 20px', fontWeight: 600 }}>{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Conditions */}
          {visibility.conditions && profile.conditions.length > 0 && (
            <div
              className="card fade-in"
              style={{ borderLeft: '4px solid var(--yellow)', padding: '24px 28px', animationDelay: '0.3s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#fde047' }}>
                <Activity size={22} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Medical Conditions</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {profile.conditions.map((c: string) => (
                  <span key={c} className="tag tag-warning" style={{ fontSize: '1.1rem', padding: '10px 20px', fontWeight: 600 }}>{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Medications */}
          {visibility.medications && profile.medications.length > 0 && (
            <div
              className="card fade-in"
              style={{ borderLeft: '4px solid #3b82f6', padding: '24px 28px', animationDelay: '0.4s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#93c5fd' }}>
                <Pill size={22} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current Medications</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {profile.medications.map((m: string) => (
                  <div key={m} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />
                    {m}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {visibility.notes && profile.notes && (
            <div
              className="card fade-in"
              style={{ padding: '24px 28px', background: 'rgba(255,255,255,0.02)', animationDelay: '0.5s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: 'var(--text-muted)' }}>
                <Info size={18} />
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Clinical Notes</h3>
              </div>
              <p style={{ lineHeight: 1.8, fontSize: '1.1rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{profile.notes}</p>
            </div>
          )}

          {/* Emergency Contacts */}
          {showContacts && (
            <div
              className="fade-in"
              style={{ marginTop: '32px', animationDelay: '0.6s' }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px', textAlign: 'center', opacity: 0.8 }}>
                Primary Contacts
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {profile.emergencyContacts.map((contact: any, idx: number) => (
                  <div key={idx} className="card" style={{ padding: '24px', background: 'var(--surface-raised)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px', color: 'white' }}>{contact.name}</div>
                        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{contact.relationship}</div>
                      </div>
                      <a
                        href={`tel:${contact.countryCode || ''}${contact.phone}`}
                        className="btn-primary"
                        style={{
                          padding: '16px 24px',
                          background: 'var(--green)',
                          boxShadow: '0 10px 25px rgba(34,197,94,0.4)',
                          borderRadius: '16px'
                        }}
                      >
                        <Phone size={22} fill="white" />
                        <span style={{ fontWeight: 800 }}>CALL</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Generic Footer */}
        <div
          className="fade-in"
          style={{ marginTop: '80px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '40px', animationDelay: '0.8s' }}
        >
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: 32, height: 32, background: 'var(--coral)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={16} fill="white" />
            </div>
            <span style={{ fontWeight: 800, color: 'white', fontSize: '1.1rem', letterSpacing: '-0.01em' }}>Emergency<span style={{ color: 'var(--coral)' }}>ID</span></span>
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px', maxWidth: '300px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            The universal standard for digital medical identification.
          </p>
          <Link href="/create" className="btn-secondary" style={{ padding: '14px 28px', borderRadius: '14px', border: '1px solid var(--surface-border)' }}>
            Create Your Emergency QR Profile
          </Link>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.5; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        .pulse-ring {
          animation: pulseRing 3s ease-in-out infinite;
        }
      `}} />
    </div>
  )
}

function EmergencyNotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#080c10',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center'
    }}>
      <div className="card" style={{ padding: '64px 32px', maxWidth: '440px', background: 'var(--surface-raised)' }}>
        <div style={{ width: 80, height: 80, background: 'rgba(239,68,68,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
          <AlertCircle size={40} color="var(--red)" />
        </div>
        <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>Unknown Record</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.7, fontSize: '1.1rem' }}>
          This medical profile is either restricted, deleted, or the secure link has expired.
        </p>
        <Link href="/" className="btn-primary" style={{ padding: '16px 32px', width: '100%', justifyContent: 'center' }}>Return to Safety</Link>
      </div>
    </div>
  )
}

import { prisma } from '@/lib/prisma'
import { Profile, EmergencyContact, VisibilitySettings } from '@/lib/types'
import { Phone, AlertTriangle, Heart, Pill, Activity, User, Calendar, Info } from 'lucide-react'
import { notFound } from 'next/navigation'

interface EmergencyPageProps {
  params: { id: string }
}

export default async function EmergencyPage({ params }: EmergencyPageProps) {
  let profile: any = null

  try {
    profile = await prisma.profile.findUnique({
      where: { publicId: params.id },
    })
  } catch (error) {
    // DB not connected in demo
  }

  if (!profile) {
    return <EmergencyNotFound />
  }

  const visibility = profile.visibility as VisibilitySettings
  const contacts = profile.emergencyContacts as EmergencyContact[]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a1520',
      color: '#f0f4f8',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>

      {/* Emergency Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0a08 0%, #2a1008 100%)',
        borderBottom: '2px solid #e8533a',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#e8533a',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            animation: 'pulse 2s infinite',
          }}>
            <Heart size={18} color="white" fill="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#e8533a', letterSpacing: '0.05em' }}>
              ⚠ EMERGENCY MEDICAL ID
            </div>
            <div style={{ fontSize: '0.72rem', color: '#7fa5c4', marginTop: '2px' }}>
              Scan this QR code in emergencies only
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#4a7090', textAlign: 'right' }}>
          <div>EmergencyID Platform</div>
          <div>No login required</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>

        {/* Patient Name & Blood Type */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#4a7090', letterSpacing: '0.1em', marginBottom: '4px' }}>PATIENT</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.1, margin: 0 }}>{profile.fullName}</h1>
            {visibility.dateOfBirth && profile.dateOfBirth && (
              <div style={{ color: '#7fa5c4', fontSize: '0.85rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} />
                {new Date(profile.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            )}
          </div>

          {visibility.bloodType && profile.bloodType && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#e8533a', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '4px' }}>BLOOD TYPE</div>
              <div style={{
                width: 72, height: 72,
                background: '#e8533a',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 900,
                boxShadow: '0 0 0 6px rgba(232,83,58,0.2), 0 0 24px rgba(232,83,58,0.3)',
              }}>
                {profile.bloodType}
              </div>
            </div>
          )}
        </div>

        {/* Organ Donor */}
        {visibility.organDonor && profile.organDonor && (
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.4)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <Heart size={16} color="#86efac" fill="#86efac" />
            <span style={{ color: '#86efac', fontWeight: 700, fontSize: '0.9rem' }}>ORGAN DONOR — Consent given</span>
          </div>
        )}

        {/* CRITICAL: Allergies */}
        {visibility.allergies && profile.allergies.length > 0 && (
          <EmergencySection
            icon={<AlertTriangle size={16} />}
            title="⚠ ALLERGIES — CRITICAL"
            color="#ef4444"
            bgColor="rgba(239,68,68,0.08)"
            borderColor="rgba(239,68,68,0.4)"
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {profile.allergies.map((a: string) => (
                <span key={a} style={{
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.4)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  color: '#fca5a5',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                }}>
                  {a}
                </span>
              ))}
            </div>
          </EmergencySection>
        )}

        {/* Conditions */}
        {visibility.conditions && profile.conditions.length > 0 && (
          <EmergencySection
            icon={<Activity size={16} />}
            title="CHRONIC CONDITIONS"
            color="#eab308"
            bgColor="rgba(234,179,8,0.06)"
            borderColor="rgba(234,179,8,0.3)"
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {profile.conditions.map((c: string) => (
                <span key={c} style={{
                  background: 'rgba(234,179,8,0.1)',
                  border: '1px solid rgba(234,179,8,0.3)',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  color: '#fde047',
                  fontSize: '0.85rem',
                }}>
                  {c}
                </span>
              ))}
            </div>
          </EmergencySection>
        )}

        {/* Medications */}
        {visibility.medications && profile.medications.length > 0 && (
          <EmergencySection
            icon={<Pill size={16} />}
            title="CURRENT MEDICATIONS"
            color="#3b82f6"
            bgColor="rgba(59,130,246,0.06)"
            borderColor="rgba(59,130,246,0.3)"
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {profile.medications.map((m: string) => (
                <span key={m} style={{
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  color: '#93c5fd',
                  fontSize: '0.85rem',
                }}>
                  {m}
                </span>
              ))}
            </div>
          </EmergencySection>
        )}

        {/* Notes */}
        {visibility.notes && profile.notes && (
          <EmergencySection
            icon={<Info size={16} />}
            title="MEDICAL NOTES"
            color="#a78bfa"
            bgColor="rgba(167,139,250,0.06)"
            borderColor="rgba(167,139,250,0.3)"
          >
            <p style={{ color: '#c4b5fd', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              {profile.notes}
            </p>
          </EmergencySection>
        )}

        {/* Emergency Contacts */}
        {visibility.emergencyContacts && contacts.length > 0 && (
          <EmergencySection
            icon={<User size={16} />}
            title="EMERGENCY CONTACTS"
            color="#e8533a"
            bgColor="rgba(232,83,58,0.06)"
            borderColor="rgba(232,83,58,0.3)"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {contacts.map((contact, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  flexWrap: 'wrap',
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{contact.name}</div>
                    <div style={{ color: '#7fa5c4', fontSize: '0.75rem' }}>{contact.relationship}</div>
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#e8533a',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '8px 14px',
                      borderRadius: '20px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    <Phone size={13} />
                    {contact.phone}
                  </a>
                </div>
              ))}
            </div>
          </EmergencySection>
        )}

        {/* Footer notice */}
        <div style={{
          marginTop: '32px',
          paddingTop: '16px',
          borderTop: '1px solid #1e3147',
          textAlign: 'center',
          color: '#4a7090',
          fontSize: '0.72rem',
          lineHeight: 1.6,
        }}>
          <p>This page contains personal medical information. Access only in genuine emergencies.</p>
          <p style={{ marginTop: '4px' }}>Powered by EmergencyID • Profile owner controls all information on this page</p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}

function EmergencySection({
  icon, title, color, bgColor, borderColor, children
}: {
  icon: React.ReactNode
  title: string
  color: string
  bgColor: string
  borderColor: string
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderLeft: `3px solid ${color}`,
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '14px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
        color: color,
      }}>
        {icon}
        <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function EmergencyNotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a1520',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, sans-serif',
      color: '#f0f4f8',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '12px' }}>Profile Not Found</h1>
        <p style={{ color: '#7fa5c4', lineHeight: 1.6, marginBottom: '24px' }}>
          This Emergency ID doesn't exist or may have been deleted by its owner.
        </p>
        <a href="/" style={{
          background: '#e8533a',
          color: 'white',
          textDecoration: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '0.9rem',
        }}>
          Create Your Own Emergency ID
        </a>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: EmergencyPageProps) {
  return {
    title: 'Emergency Medical ID',
    description: 'Critical medical information for emergency responders',
    robots: 'noindex',
  }
}

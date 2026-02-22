'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import QRDisplay from '@/components/QRDisplay'
import { Profile } from '@/lib/types'
import { getOwnerToken, getBaseUrl } from '@/lib/token'
import { Plus, Trash2, Edit2, QrCode, Eye, X, ArrowLeft, EyeOff, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    // ... load profiles ...
    const loadProfiles = async () => {
      try {
        const ownerToken = getOwnerToken()
        const res = await fetch('/api/profiles', {
          headers: { 'x-owner-token': ownerToken },
        })
        const data = await res.json()
        if (data.success) {
          setProfiles(data.profiles)
        }
      } catch (error) {
        console.error('Error loading profiles:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProfiles()
  }, [])

  const deleteProfile = async (publicId: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return
    setDeleting(publicId)
    try {
      const ownerToken = getOwnerToken()
      const res = await fetch(`/api/profiles/${publicId}`, {
        method: 'DELETE',
        headers: { 'x-owner-token': ownerToken },
      })
      const data = await res.json()
      if (data.success) {
        setProfiles(prev => prev.filter(p => p.publicId !== publicId))
      }
    } catch (error) {
      console.error('Error deleting profile:', error)
    } finally {
      setDeleting(null)
    }
  }

  const getEmergencyUrl = (publicId: string) => {
    return `${getBaseUrl()}/emergency/${publicId}`
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--navy)', paddingTop: '64px' }}>
        <div className="page-wrap" style={{ maxWidth: 960 }}>

          {/* Navigation & Header */}
          <Link href="/" className="btn-ghost" style={{ marginBottom: 'var(--space-md)', display: 'inline-flex' }}>
            <ArrowLeft size={14} />
            Back to Home
          </Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <div>
              <div className="section-label" style={{ marginBottom: 'var(--space-sm)' }}>
                ADMINISTRATION
              </div>
              <h1 className="font-display" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                My Emergency Profiles
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                  Manage your medical identities
                </p>
                <div style={{ height: 20, width: 1, background: 'var(--surface-border)' }} />
                <button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  style={{
                    background: isPreviewMode ? 'var(--coral)' : 'var(--surface)',
                    border: '1px solid var(--surface-border)',
                    borderRadius: '100px',
                    padding: '4px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isPreviewMode ? 'white' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isPreviewMode ? <Eye size={12} /> : <EyeOff size={12} />}
                  {isPreviewMode ? 'Public View: ON' : 'Public View: OFF'}
                </button>
              </div>
            </div>
            <Link href="/create" className="btn-primary" style={{ padding: '12px 24px' }}>
              <Plus size={18} />
              New Profile
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
              {[1, 2].map(i => (
                <div key={i} className="card skeleton" style={{ height: 140 }} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && profiles.length === 0 && (
            <div className="card" style={{ padding: 'var(--space-2xl) 24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{
                width: 80, height: 80,
                background: 'var(--surface)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto var(--space-lg)',
                border: '1px solid var(--surface-border)',
              }}>
                <QrCode size={32} color="var(--text-muted)" />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>No profiles created</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', fontSize: '1rem', maxWidth: 360, margin: '0 auto var(--space-lg)' }}>
                You haven't created any Emergency IDs yet. Protect yourself by creating one now.
              </p>
              <Link href="/create" className="btn-primary" style={{ padding: '14px 28px' }}>
                <Plus size={18} />
                Create Your First ID
              </Link>
            </div>
          )}

          {/* Profile cards */}
          {!loading && profiles.length > 0 && (
            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
              {profiles.map(profile => {
                const visibility = profile.visibility as any;
                return (
                  <div key={profile.publicId} className="card card-hover" style={{ padding: 'var(--space-lg) 32px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-md)', flexWrap: 'wrap' }}>

                      {/* Left: Info */}
                      <div style={{ flex: 1, minWidth: 260 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                          <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                            {profile.fullName}
                          </h3>
                          {profile.bloodType && (
                            <span style={{
                              background: visibility?.bloodType ? 'var(--coral)' : 'var(--surface-border)',
                              color: visibility?.bloodType ? 'white' : 'var(--text-muted)',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              fontFamily: 'var(--font-display)',
                              padding: '3px 12px',
                              borderRadius: '100px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}>
                              {profile.bloodType}
                              {!visibility?.bloodType && <EyeOff size={10} />}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                          {profile.allergies.length > 0 && (
                            <span className={`tag ${visibility?.allergies ? 'tag-danger' : ''}`} style={{ opacity: visibility?.allergies ? 1 : 0.6 }}>
                              {profile.allergies.length} allerg{profile.allergies.length === 1 ? 'y' : 'ies'}
                              {!visibility?.allergies && <EyeOff size={12} style={{ marginLeft: 4 }} />}
                            </span>
                          )}
                          {profile.conditions.length > 0 && (
                            <span className={`tag ${visibility?.conditions ? 'tag-warning' : ''}`} style={{ opacity: visibility?.conditions ? 1 : 0.6 }}>
                              {profile.conditions.length} condition{profile.conditions.length !== 1 ? 's' : ''}
                              {!visibility?.conditions && <EyeOff size={12} style={{ marginLeft: 4 }} />}
                            </span>
                          )}
                          {profile.emergencyContacts.length > 0 && (
                            <span className={`tag ${visibility?.emergencyContacts ? 'tag-blue' : ''}`} style={{ opacity: visibility?.emergencyContacts ? 1 : 0.6 }}>
                              {profile.emergencyContacts.length} contact{profile.emergencyContacts.length !== 1 ? 's' : ''}
                              {!visibility?.emergencyContacts && <EyeOff size={12} style={{ marginLeft: 4 }} />}
                            </span>
                          )}
                          {profile.organDonor && (
                            <span className="tag" style={{
                              background: visibility?.organDonor ? 'rgba(34,197,94,0.1)' : 'var(--surface)',
                              borderColor: visibility?.organDonor ? 'rgba(34,197,94,0.3)' : 'var(--surface-border)',
                              color: visibility?.organDonor ? '#86efac' : 'var(--text-muted)',
                              opacity: visibility?.organDonor ? 1 : 0.6
                            }}>
                              Organ Donor
                              {!visibility?.organDonor && <EyeOff size={12} style={{ marginLeft: 4 }} />}
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={12} />
                          Created {new Date(profile.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>

                      {/* Right: Actions */}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <Link
                          href={`/emergency/${profile.publicId}`}
                          target="_blank"
                          className="btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                          title="Preview public emergency page"
                        >
                          <Eye size={14} />
                          Preview
                        </Link>
                        <button
                          className="btn-secondary"
                          onClick={() => setShowQR(showQR === profile.publicId ? null : profile.publicId)}
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                          title="Show QR code for this profile"
                        >
                          <QrCode size={14} />
                          QR Code
                        </button>
                        <Link
                          href={`/edit/${profile.publicId}`}
                          className="btn-ghost"
                          style={{ padding: '8px 14px' }}
                          title="Modify profile information"
                        >
                          <Edit2 size={14} />
                          Edit
                        </Link>
                        <button
                          className="btn-ghost"
                          onClick={() => deleteProfile(profile.publicId)}
                          disabled={deleting === profile.publicId}
                          style={{ color: deleting === profile.publicId ? 'var(--text-muted)' : '#fca5a5', padding: '8px 14px' }}
                          title="Permanently remove profile"
                        >
                          {deleting === profile.publicId ? (
                            <span style={{ width: 14, height: 14, border: '1.5px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* QR Code panel */}
                    {showQR === profile.publicId && (
                      <div style={{
                        marginTop: '24px',
                        paddingTop: '24px',
                        borderTop: '1px solid var(--surface-border)',
                        animation: 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                          <div>
                            <h4 style={{ fontSize: '0.9rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
                              Profile QR Code
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Responders can scan this to see your medical info</p>
                          </div>
                          <button className="btn-ghost" onClick={() => setShowQR(null)} style={{ padding: 8 }}>
                            <X size={18} />
                          </button>
                        </div>
                        <QRDisplay url={getEmergencyUrl(profile.publicId)} profileName={profile.fullName} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}

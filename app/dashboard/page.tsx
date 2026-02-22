'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import QRDisplay from '@/components/QRDisplay'
import { Profile } from '@/lib/types'
import { getOwnerToken, getBaseUrl } from '@/lib/token'
import { Plus, Trash2, Edit2, QrCode, Eye, X } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProfiles = async () => {
    try {
      const ownerToken = getOwnerToken()
      const res = await fetch('/api/profiles', {
        headers: { 'x-owner-token': ownerToken },
      })
      const data = await res.json()
      setProfiles(data.profiles ?? [])
    } catch (err: any) {
      setProfiles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const deleteProfile = async (publicId: string) => {
    if (!confirm('Delete this profile? This cannot be undone.')) return
    setDeleting(publicId)
    try {
      const ownerToken = getOwnerToken()
      await fetch(`/api/profiles/${publicId}`, {
        method: 'DELETE',
        headers: { 'x-owner-token': ownerToken },
      })
      setProfiles(prev => prev.filter(p => p.publicId !== publicId))
    } catch (err) {
      alert('Failed to delete profile')
    } finally {
      setDeleting(null)
    }
  }

  const getEmergencyUrl = (publicId: string) => `${getBaseUrl()}/emergency/${publicId}`

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--navy)', paddingTop: '64px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '12px' }}>
                MY PROFILES
              </div>
              <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Dashboard
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                Manage your Emergency ID profiles
              </p>
            </div>
            <Link href="/create" className="btn-primary">
              <Plus size={16} />
              New Profile
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {[1, 2].map(i => (
                <div key={i} className="card skeleton" style={{ height: 120 }} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && profiles.length === 0 && (
            <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64,
                background: 'var(--surface)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <QrCode size={28} color="var(--text-muted)" />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>No profiles yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                Create your first Emergency ID to get started
              </p>
              <Link href="/create" className="btn-primary">
                <Plus size={16} />
                Create Emergency ID
              </Link>
            </div>
          )}

          {/* Profile cards */}
          {!loading && profiles.length > 0 && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {profiles.map(profile => (
                <div key={profile.publicId} className="card" style={{ padding: '24px 28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>

                    {/* Left: Info */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                          {profile.fullName}
                        </h3>
                        {profile.bloodType && (
                          <span style={{
                            background: 'var(--coral)',
                            color: 'white',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-syne)',
                            padding: '2px 10px',
                            borderRadius: '100px',
                          }}>
                            {profile.bloodType}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        {profile.allergies.length > 0 && (
                          <span className="tag tag-danger">
                            {profile.allergies.length} allerg{profile.allergies.length === 1 ? 'y' : 'ies'}
                          </span>
                        )}
                        {profile.conditions.length > 0 && (
                          <span className="tag tag-warning">
                            {profile.conditions.length} condition{profile.conditions.length !== 1 ? 's' : ''}
                          </span>
                        )}
                        {profile.emergencyContacts.length > 0 && (
                          <span className="tag tag-blue">
                            {profile.emergencyContacts.length} contact{profile.emergencyContacts.length !== 1 ? 's' : ''}
                          </span>
                        )}
                        {profile.organDonor && (
                          <span className="tag" style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)', color: '#86efac' }}>
                            Organ Donor
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Created {new Date(profile.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <Link
                        href={`/emergency/${profile.publicId}`}
                        target="_blank"
                        className="btn-ghost"
                        title="Preview emergency page"
                      >
                        <Eye size={14} />
                        Preview
                      </Link>
                      <button
                        className="btn-ghost"
                        onClick={() => setShowQR(showQR === profile.publicId ? null : profile.publicId)}
                        title="Show QR code"
                      >
                        <QrCode size={14} />
                        QR Code
                      </button>
                      <Link
                        href={`/edit/${profile.publicId}`}
                        className="btn-ghost"
                        title="Edit profile"
                      >
                        <Edit2 size={14} />
                        Edit
                      </Link>
                      <button
                        className="btn-ghost"
                        onClick={() => deleteProfile(profile.publicId)}
                        disabled={deleting === profile.publicId}
                        style={{ color: deleting === profile.publicId ? 'var(--text-muted)' : '#fca5a5' }}
                        title="Delete profile"
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
                      marginTop: '20px',
                      paddingTop: '20px',
                      borderTop: '1px solid var(--surface-border)',
                      animation: 'fadeUp 0.3s ease',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          QR CODE
                        </h4>
                        <button className="btn-ghost" onClick={() => setShowQR(null)}>
                          <X size={14} />
                        </button>
                      </div>
                      <QRDisplay url={getEmergencyUrl(profile.publicId)} profileName={profile.fullName} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}

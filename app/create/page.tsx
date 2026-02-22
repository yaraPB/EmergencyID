'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProfileForm from '@/components/ProfileForm'
import QRDisplay from '@/components/QRDisplay'
import { ProfileFormData } from '@/lib/validations'
import { getOwnerToken, getBaseUrl } from '@/lib/token'
import { CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function CreatePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<{ publicId: string; emergencyUrl: string } | null>(null)

  const handleSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      const ownerToken = getOwnerToken()
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-token': ownerToken,
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to create profile')
      }

      const baseUrl = getBaseUrl()
      const emergencyUrl = `${baseUrl}/emergency/${result.profile.publicId}`

      setCreated({
        publicId: result.profile.publicId,
        emergencyUrl,
      })

      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--navy)', paddingTop: '64px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px' }}>

          {/* Success state */}
          {created ? (
            <div style={{ animation: 'fadeUp 0.5s ease' }}>
              <div className="card" style={{ padding: '40px', textAlign: 'center', marginBottom: '32px', borderColor: 'rgba(34,197,94,0.3)' }}>
                <div style={{
                  width: 64, height: 64,
                  background: 'rgba(34,197,94,0.1)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <CheckCircle size={32} color="var(--green)" />
                </div>
                <h1 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
                  Your Emergency ID is ready!
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
                  Your profile has been created. Download the QR code below or copy the emergency link.
                </p>

                <QRDisplay url={created.emergencyUrl} profileName="Emergency ID" />

                <div className="divider" style={{ margin: '32px 0' }} />

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link
                    href={`/emergency/${created.publicId}`}
                    target="_blank"
                    className="btn-secondary"
                    style={{ fontSize: '0.88rem' }}
                  >
                    Preview Emergency Page
                  </Link>
                  <Link href="/dashboard" className="btn-primary" style={{ fontSize: '0.88rem' }}>
                    Go to Dashboard
                  </Link>
                </div>
              </div>

              <div className="card" style={{ padding: '20px 24px', background: 'rgba(232,83,58,0.05)', borderColor: 'rgba(232,83,58,0.2)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--coral)' }}>Important:</strong> Your profiles are linked to this browser. 
                  Don't clear your browser data, or you'll lose access to manage your profiles. 
                  You can view all your profiles in the <Link href="/dashboard" style={{ color: 'var(--coral)' }}>Dashboard</Link>.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Form header */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  CREATE YOUR ID
                </div>
                <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}>
                  Build your Emergency Profile
                </h1>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Fill in your medical information. You control exactly what's visible to emergency responders.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                  marginBottom: '24px',
                  color: '#fca5a5',
                  fontSize: '0.88rem',
                }}>
                  <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong>Error: </strong>{error}
                    {error.includes('connect') && (
                      <><br /><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Make sure your DATABASE_URL is configured in .env</span></>
                    )}
                  </div>
                </div>
              )}

              <ProfileForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                submitLabel="Create Emergency ID"
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

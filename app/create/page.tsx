'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProfileForm from '@/components/ProfileForm'
import QRDisplay from '@/components/QRDisplay'
import { ProfileFormData } from '@/lib/validations'
import { getOwnerToken, getBaseUrl, isLocalhost } from '@/lib/token'
import { CheckCircle, AlertCircle, ArrowLeft, Info, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

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
      const url = '/api/profiles'
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-token': ownerToken,
        },
        body: JSON.stringify(data),
      })

      const contentType = res.headers.get('content-type') || ''
      const text = await res.text()
      let result: any
      try {
        result = text ? JSON.parse(text) : {}
      } catch (_e) {
        setError('Server returned an invalid response. Please try again.')
        return
      }

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
        <div className="page-wrap-narrow">

          {/* Back button */}
          <Link href="/" className="btn-ghost" style={{ marginBottom: 'var(--space-md)', display: 'inline-flex' }}>
            <ArrowLeft size={14} />
            Back to Home
          </Link>

          {/* Success state */}
          {created ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="card" style={{ padding: 'var(--space-xl)', textAlign: 'center', marginBottom: 'var(--space-lg)', borderColor: 'rgba(34,197,94,0.3)' }}>
                <div style={{
                  width: 72, height: 72,
                  background: 'var(--green-dim)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--space-md)',
                  border: '1px solid rgba(34,197,94,0.2)',
                }}>
                  <CheckCircle size={36} color="var(--green)" />
                </div>
                <h1 className="font-display" style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: 'var(--space-sm)' }}>
                  Successfully Created!
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', lineHeight: 1.6, fontSize: '1.05rem', maxWidth: 460, margin: '0 auto var(--space-xl)' }}>
                  Your Emergency ID is now active. First responders can access this critical data by scanning your unique QR code.
                </p>

                <QRDisplay url={created.emergencyUrl} profileName="Emergency ID" />

                <div className="divider" style={{ margin: '40px 0' }} />

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link
                    href={`/emergency/${created.publicId}`}
                    target="_blank"
                    className="btn-secondary"
                    style={{ fontSize: '0.9rem', padding: '12px 24px' }}
                  >
                    Preview Emergency Page
                  </Link>
                  <Link href="/dashboard" className="btn-primary" style={{ fontSize: '0.9rem', padding: '12px 24px' }}>
                    Manage My Profiles
                  </Link>
                </div>
              </div>

              <div className="card" style={{ padding: '24px', background: 'rgba(232,83,58,0.05)', borderColor: 'rgba(232,83,58,0.2)' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Info size={18} color="var(--coral)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--coral)' }}>Important:</strong> Your profiles are securely linked to this browser.
                    If you clear your browser cookies, you'll lose access to edit this profile.
                    Always go to <Link href="/dashboard" style={{ color: 'var(--coral)', fontWeight: 600 }}>My Profiles</Link> to see everything you've created.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Form header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 'var(--space-xl)' }}
              >
                <div className="section-label" style={{ marginBottom: 'var(--space-sm)' }}>
                  PREPAREDNESS
                </div>
                <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 'var(--space-sm)', lineHeight: 1.1 }}>
                  Create your <span style={{ color: 'var(--coral)' }}>Emergency Profile</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.1rem', maxWidth: 560 }}>
                  Tell us what first responders need to know. You have total control over what is visible and what stays private.
                </p>
              </motion.div>

              {/* Error */}
              {error && (
                <div style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  marginBottom: '32px',
                  color: '#fca5a5',
                  fontSize: '0.9rem',
                }}>
                  <AlertCircle size={18} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>Submission Error </strong>
                    {error}
                  </div>
                </div>
              )}



              <ProfileForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                submitLabel="Generate My Emergency ID"
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

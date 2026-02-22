'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProfileForm from '@/components/ProfileForm'
import { Profile } from '@/lib/types'
import { ProfileFormData } from '@/lib/validations'
import { getOwnerToken } from '@/lib/token'
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditPage() {
  const params = useParams()
  const router = useRouter()
  const publicId = params.id as string

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profiles/${publicId}`)
        const data = await res.json()
        if (data.success) {
          setProfile(data.profile)
        } else {
          setError(data.error)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [publicId])

  const handleSubmit = async (data: ProfileFormData) => {
    setSaving(true)
    setError(null)
    try {
      const ownerToken = getOwnerToken()
      const res = await fetch(`/api/profiles/${publicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-token': ownerToken,
        },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!result.success) throw new Error(result.error)
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--navy)', paddingTop: '64px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px' }}>

          <Link href="/dashboard" className="btn-ghost" style={{ marginBottom: '24px', display: 'inline-flex' }}>
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>

          <div style={{ marginBottom: '40px' }}>
            <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Edit Profile
            </h1>
            {profile && (
              <p style={{ color: 'var(--text-secondary)' }}>
                Editing <strong style={{ color: 'var(--text-primary)' }}>{profile.fullName}</strong>
              </p>
            )}
          </div>

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1,2,3].map(i => <div key={i} className="card skeleton" style={{ height: 80 }} />)}
            </div>
          )}

          {error && !loading && (
            <div style={{
              display: 'flex', gap: '10px', alignItems: 'flex-start',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              color: '#fca5a5',
              fontSize: '0.88rem',
              marginBottom: '16px',
            }}>
              <AlertCircle size={16} style={{ marginTop: '2px' }} />
              {error}
            </div>
          )}

          {success && (
            <div style={{
              display: 'flex', gap: '10px', alignItems: 'center',
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              color: '#86efac',
              fontSize: '0.88rem',
              marginBottom: '16px',
            }}>
              <CheckCircle size={16} />
              Profile updated! Redirecting to dashboard...
            </div>
          )}

          {profile && !loading && (
            <ProfileForm
              defaultValues={{
                fullName: profile.fullName,
                dateOfBirth: profile.dateOfBirth,
                bloodType: profile.bloodType,
                organDonor: profile.organDonor,
                allergies: profile.allergies,
                conditions: profile.conditions,
                medications: profile.medications,
                notes: profile.notes,
                emergencyContacts: profile.emergencyContacts,
                visibility: profile.visibility,
              }}
              onSubmit={handleSubmit}
              isLoading={saving}
              submitLabel="Save Changes"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

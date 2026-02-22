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

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default function EditPage({ params }: EditPageProps) {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const { id } = await params
        const ownerToken = getOwnerToken()
        const res = await fetch(`/api/profiles/${id}`, {
          headers: { 'x-owner-token': ownerToken },
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.error)
        setProfile(data.profile)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params])

  const handleSubmit = async (data: any) => {
    setSaving(true)
    try {
      const { id } = await params
      const ownerToken = getOwnerToken()
      const res = await fetch(`/api/profiles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-token': ownerToken,
        },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!result.success) throw new Error(result.error)
      router.push('/dashboard')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--navy)', paddingTop: '64px' }}>
        <div className="page-wrap-narrow">

          {/* Back button */}
          <Link href="/dashboard" className="btn-ghost" style={{ marginBottom: 'var(--space-md)', display: 'inline-flex' }}>
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>

          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h1 className="font-display" style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Edit Profile
            </h1>
            {profile && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                Editing <strong style={{ color: 'var(--text-primary)' }}>{profile.fullName}</strong>
              </p>
            )}
          </div>

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {[1, 2, 3].map(i => <div key={i} className="card skeleton" style={{ height: 80 }} />)}
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

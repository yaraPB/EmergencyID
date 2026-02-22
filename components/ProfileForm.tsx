'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, ProfileFormData } from '@/lib/validations'
import { BLOOD_TYPES, DEFAULT_VISIBILITY } from '@/lib/types'
import TagInput from './TagInput'
import { Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronUp, AlertCircle, User, Activity, Users, Lock, Shield } from 'lucide-react'

interface ProfileFormProps {
  defaultValues?: Partial<ProfileFormData>
  onSubmit: (data: ProfileFormData) => Promise<void>
  isLoading?: boolean
  submitLabel?: string
}

const SECTION_KEYS = [
  { key: 'bloodType', label: 'Blood Type' },
  { key: 'dateOfBirth', label: 'Date of Birth' },
  { key: 'allergies', label: 'Allergies' },
  { key: 'conditions', label: 'Conditions' },
  { key: 'medications', label: 'Medications' },
  { key: 'organDonor', label: 'Organ Donor Status' },
  { key: 'notes', label: 'Medical Notes' },
  { key: 'emergencyContacts', label: 'Emergency Contacts' },
] as const

const COUNTRY_CODES = [
  { code: '+212', label: '🇲🇦 +212 (Morocco)' },
  { code: '+1', label: '🇺🇸 +1 (US/CA)' },
  { code: '+44', label: '🇬🇧 +44 (UK)' },
  { code: '+33', label: '🇫🇷 +33 (France)' },
  { code: '+34', label: '🇪🇸 +34 (Spain)' },
  { code: '+49', label: '🇩🇪 +49 (Germany)' },
  { code: '+39', label: '🇮🇹 +39 (Italy)' },
  { code: '+971', label: '🇦🇪 +971 (UAE)' },
  { code: '+966', label: '🇸🇦 +966 (Saudi Arabia)' },
  { code: '+20', label: '🇪🇬 +20 (Egypt)' },
]

export default function ProfileForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Create Profile' }: ProfileFormProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    medical: true,
    contacts: true,
    privacy: false,
  })

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      bloodType: '',
      organDonor: false,
      allergies: [],
      conditions: [],
      medications: [],
      notes: '',
      emergencyContacts: [],
      visibility: DEFAULT_VISIBILITY,
      ...defaultValues,
    },
  })

  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control,
    name: 'emergencyContacts',
  })

  const visibility = watch('visibility')
  const allergies = watch('allergies')
  const conditions = watch('conditions')
  const medications = watch('medications')

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleVisibility = (key: keyof typeof DEFAULT_VISIBILITY) => {
    setValue(`visibility.${key}`, !visibility[key])
  }

  const SectionHeader = ({ id, title, badge, icon: Icon }: { id: string; title: string; badge?: string; icon?: any }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '20px 0',
        borderBottom: openSections[id] ? '1px solid var(--surface-border)' : 'none',
        marginBottom: openSections[id] ? '24px' : '0',
        color: 'var(--text-primary)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {Icon && <div style={{ color: 'var(--coral)', display: 'flex' }}><Icon size={20} className="icon-glow" /></div>}
        <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 800 }}>{title}</h3>
        {badge && (
          <span style={{
            fontSize: '0.7rem',
            background: 'var(--coral-dim)',
            color: 'var(--coral)',
            padding: '2px 8px',
            borderRadius: '100px',
            fontFamily: 'var(--font-syne)',
            fontWeight: 600,
          }}>{badge}</span>
        )}
      </div>
      {openSections[id] ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
    </button>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>

      {/* Personal Info */}
      <div className="card" style={{ padding: '0 28px', borderTop: '2px solid rgba(232, 90, 66, 0.2)' }}>
        <SectionHeader id="personal" title="Personal Information" icon={User} />
        {openSections.personal && (
          <div style={{ paddingBottom: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="label">Full Name <span style={{ color: 'var(--coral)' }}>*</span></label>
              <input
                {...register('fullName')}
                className="input"
                placeholder="e.g. Mohammed El Amrani"
              />
              {errors.fullName && (
                <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: '6px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <AlertCircle size={12} /> {errors.fullName.message}
                </p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="label">Date of Birth</label>
                <input
                  {...register('dateOfBirth')}
                  type="date"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Blood Type <span style={{ color: 'var(--coral)' }}>*</span></label>
                <select {...register('bloodType')} className="input">
                  <option value="">Select blood type</option>
                  {BLOOD_TYPES.map(bt => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
                {errors.bloodType && (
                  <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: '6px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <AlertCircle size={12} /> {errors.bloodType.message}
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label className="toggle">
                <input type="checkbox" {...register('organDonor')} />
                <span className="toggle-slider" />
              </label>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Organ Donor</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>I consent to organ donation in case of death</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Medical Info */}
      <div className="card" style={{ padding: '0 28px', marginTop: '16px', borderTop: '2px solid rgba(253, 224, 71, 0.2)' }}>
        <SectionHeader id="medical" title="Medical Information" icon={Activity} />
        {openSections.medical && (
          <div style={{ paddingBottom: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <TagInput
              label="Allergies"
              value={allergies}
              onChange={val => setValue('allergies', val)}
              placeholder="e.g. Penicillin, Peanuts, Latex..."
            />

            <TagInput
              label="Chronic Conditions"
              value={conditions}
              onChange={val => setValue('conditions', val)}
              placeholder="e.g. Diabetes Type 2, Hypertension..."
            />

            <TagInput
              label="Current Medications"
              value={medications}
              onChange={val => setValue('medications', val)}
              placeholder="e.g. Metformin 500mg, Lisinopril 10mg..."
            />

            <div>
              <label className="label">Additional Medical Notes</label>
              <textarea
                {...register('notes')}
                className="input"
                style={{ resize: 'vertical', minHeight: '80px' }}
                placeholder="Any other important medical information doctors should know..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Emergency Contacts */}
      <div className="card" style={{ padding: '0 28px', marginTop: '16px', borderTop: '2px solid rgba(59, 130, 246, 0.2)' }}>
        <SectionHeader id="contacts" title="Emergency Contacts" badge={contactFields.length > 0 ? `${contactFields.length} added` : undefined} icon={Users} />
        {openSections.contacts && (
          <div style={{ paddingBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {contactFields.map((field, index) => (
              <div
                key={field.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  position: 'relative',
                }}
              >
                <button
                  type="button"
                  onClick={() => removeContact(index)}
                  style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 'var(--radius-sm)', color: '#fca5a5',
                    cursor: 'pointer', padding: '4px', display: 'flex',
                  }}
                >
                  <Trash2 size={14} />
                </button>

                <div style={{ fontFamily: 'var(--font-syne)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.06em' }}>
                  CONTACT {index + 1}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="label" style={{ fontSize: '0.7rem' }}>Name <span style={{ color: 'var(--coral)' }}>*</span></label>
                    <input
                      {...register(`emergencyContacts.${index}.name`)}
                      className="input"
                      style={{ padding: '10px 12px' }}
                      placeholder="Full name"
                    />
                    {errors.emergencyContacts?.[index]?.name && (
                      <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <AlertCircle size={10} /> {errors.emergencyContacts[index]?.name?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label" style={{ fontSize: '0.7rem' }}>Phone <span style={{ color: 'var(--coral)' }}>*</span></label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        {...register(`emergencyContacts.${index}.countryCode`)}
                        className="input"
                        style={{ padding: '10px 4px', width: '80px', flexShrink: 0 }}
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>{c.label}</option>
                        ))}
                      </select>
                      <input
                        {...register(`emergencyContacts.${index}.phone`)}
                        type="tel"
                        className="input"
                        style={{ padding: '10px 12px', flex: 1 }}
                        placeholder="600 000 000"
                      />
                    </div>
                    {errors.emergencyContacts?.[index]?.countryCode && (
                      <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <AlertCircle size={10} /> {errors.emergencyContacts[index]?.countryCode?.message}
                      </p>
                    )}
                    {errors.emergencyContacts?.[index]?.phone && (
                      <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <AlertCircle size={10} /> {errors.emergencyContacts[index]?.phone?.message}
                      </p>
                    )}
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="label" style={{ fontSize: '0.7rem' }}>Relationship <span style={{ color: 'var(--coral)' }}>*</span></label>
                    <input
                      {...register(`emergencyContacts.${index}.relationship`)}
                      className="input"
                      style={{ padding: '10px 12px' }}
                      placeholder="e.g. Spouse, Parent, Sibling"
                    />
                    {errors.emergencyContacts?.[index]?.relationship && (
                      <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <AlertCircle size={10} /> {errors.emergencyContacts[index]?.relationship?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendContact({ name: '', countryCode: '+212', phone: '', relationship: '' })}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            >
              <Plus size={16} />
              Add Emergency Contact
            </button>
          </div>
        )}
      </div>

      {/* Privacy Controls */}
      <div className="card" style={{ padding: '0 28px', marginTop: '16px', borderTop: '2px solid rgba(168, 85, 247, 0.2)' }}>
        <SectionHeader id="privacy" title="Privacy Controls" icon={Lock} />
        {openSections.privacy && (
          <div style={{ paddingBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: 1.6 }}>
              Choose which fields are visible on your public emergency page. Hidden fields are stored but never shown to anyone scanning your QR code.
            </p>
            {SECTION_KEYS.map(({ key, label }) => (
              <div key={key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--surface-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {visibility[key] ? <Eye size={14} color="var(--green)" /> : <EyeOff size={14} color="var(--text-muted)" />}
                  <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{label}</span>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={visibility[key]}
                    onChange={() => toggleVisibility(key)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn-primary"
        disabled={isLoading}
        style={{
          marginTop: '24px',
          justifyContent: 'center',
          padding: '16px',
          fontSize: '1rem',
          opacity: isLoading ? 0.7 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? (
          <>
            <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
            Saving...
          </>
        ) : submitLabel}
      </button>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  )
}

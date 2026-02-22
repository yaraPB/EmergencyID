export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

export interface VisibilitySettings {
  bloodType: boolean
  allergies: boolean
  conditions: boolean
  medications: boolean
  organDonor: boolean
  notes: boolean
  emergencyContacts: boolean
  dateOfBirth: boolean
}

export interface Profile {
  id: string
  publicId: string
  createdAt: string
  updatedAt: string
  fullName: string
  dateOfBirth?: string
  bloodType?: string
  organDonor: boolean
  allergies: string[]
  conditions: string[]
  medications: string[]
  notes?: string
  emergencyContacts: EmergencyContact[]
  visibility: VisibilitySettings
}

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const

export const DEFAULT_VISIBILITY: VisibilitySettings = {
  bloodType: true,
  allergies: true,
  conditions: true,
  medications: true,
  organDonor: true,
  notes: true,
  emergencyContacts: true,
  dateOfBirth: false,
}

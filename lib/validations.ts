import { z } from 'zod'

export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  countryCode: z.string().min(1, 'Country code is required'),
  phone: z.string().regex(/^[0-9]{5,15}$/, 'Invalid number (must be 5-15 digits only)'),
  relationship: z.string().min(1, 'Relationship is required'),
})

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  dateOfBirth: z.string().optional(),
  bloodType: z.string().min(1, 'Blood type is required'),
  organDonor: z.boolean().default(false),
  allergies: z.array(z.string()).default([]),
  conditions: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  notes: z.string().optional(),
  emergencyContacts: z.array(emergencyContactSchema).default([]),
  visibility: z.object({
    bloodType: z.boolean().default(true),
    allergies: z.boolean().default(true),
    conditions: z.boolean().default(true),
    medications: z.boolean().default(true),
    organDonor: z.boolean().default(true),
    notes: z.boolean().default(true),
    emergencyContacts: z.boolean().default(true),
    dateOfBirth: z.boolean().default(false),
  }).default({ bloodType: true, allergies: true, conditions: true, medications: true, organDonor: true, notes: true, emergencyContacts: true, dateOfBirth: false }),
})

export type ProfileFormData = z.infer<typeof profileSchema>

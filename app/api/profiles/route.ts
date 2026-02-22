import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { profileSchema } from '@/lib/validations'

function formatZodError(err: ZodError): string {
  const issues = ('issues' in err ? err.issues : (err as { errors?: unknown[] }).errors) ?? []
  const first = issues[0] as { path?: (string | number)[]; message?: string } | undefined
  if (!first) return 'Validation failed'
  const path = Array.isArray(first?.path) ? first.path.join('.') : ''
  const msg = first?.message ?? 'Invalid value'
  if (path.startsWith('emergencyContacts.')) {
    const match = path.match(/emergencyContacts\.(\d+)\.(\w+)/)
    const contactNum = match ? Number(match[1]) + 1 : ''
    const field = match ? match[2] : path
    return `Contact ${contactNum}: ${field} - ${msg}`
  }
  return path ? `${path}: ${msg}` : msg
}

function isDbConnectionError(error: any): boolean {
  const code = error?.code
  const msg = (error?.message || '').toLowerCase()
  return code === 'P1001' || code === 'P1017' || msg.includes('connect') || msg.includes('econnrefused')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = profileSchema.parse(body)

    const profile = await prisma.profile.create({
      data: {
        fullName: validated.fullName,
        dateOfBirth: validated.dateOfBirth,
        bloodType: validated.bloodType,
        organDonor: validated.organDonor,
        allergies: validated.allergies,
        conditions: validated.conditions,
        medications: validated.medications,
        notes: validated.notes,
        emergencyContacts: validated.emergencyContacts as any[],
        visibility: validated.visibility as any,
        ownerToken: request.headers.get('x-owner-token') || undefined,
      },
    })

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        publicId: profile.publicId,
      },
    })
  } catch (error: any) {
    console.error('Create profile error:', error)
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: formatZodError(error) },
        { status: 400 }
      )
    }
    if (isDbConnectionError(error)) {
      return NextResponse.json(
        { success: false, error: 'Cannot connect to the database. Check that MongoDB is running and DATABASE_URL in .env is correct (e.g. mongodb://localhost:27017/emergencyid).' },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create profile' },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const ownerToken = request.headers.get('x-owner-token')
    if (!ownerToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const profiles = await prisma.profile.findMany({
      where: { ownerToken },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, profiles })
  } catch (error: any) {
    if (isDbConnectionError(error)) {
      return NextResponse.json(
        { success: false, error: 'Cannot connect to the database. Check that MongoDB is running and DATABASE_URL in .env is correct.' },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

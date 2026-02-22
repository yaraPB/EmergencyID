import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { profileSchema } from '@/lib/validations'

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
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

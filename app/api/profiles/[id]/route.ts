import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { profileSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const ownerToken = request.headers.get('x-owner-token')

    // Check if the requester is the owner
    const profile = await prisma.profile.findUnique({
      where: { publicId: id },
    })

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    // If not the owner, sanitize based on visibility
    if (!ownerToken || (profile.ownerToken && profile.ownerToken !== ownerToken)) {
      const visibility = profile.visibility as any
      const sanitized: any = {
        publicId: profile.publicId,
        fullName: profile.fullName,
        visibility: profile.visibility,
        // Only include visible fields
        bloodType: visibility.bloodType ? profile.bloodType : null,
        allergies: visibility.allergies ? profile.allergies : [],
        conditions: visibility.conditions ? profile.conditions : [],
        medications: visibility.medications ? profile.medications : [],
        notes: visibility.notes ? profile.notes : null,
        organDonor: visibility.organDonor ? profile.organDonor : false,
        emergencyContacts: visibility.emergencyContacts ? profile.emergencyContacts : [],
        dateOfBirth: visibility.dateOfBirth ? profile.dateOfBirth : null,
      }
      return NextResponse.json({ success: true, profile: sanitized })
    }

    return NextResponse.json({ success: true, profile })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const ownerToken = request.headers.get('x-owner-token')
    const body = await request.json()
    const validated = profileSchema.parse(body)

    const existing = await prisma.profile.findUnique({
      where: { publicId: id },
    })

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    if (existing.ownerToken && existing.ownerToken !== ownerToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const profile = await prisma.profile.update({
      where: { publicId: id },
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
      },
    })

    return NextResponse.json({ success: true, profile })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const ownerToken = request.headers.get('x-owner-token')

    const existing = await prisma.profile.findUnique({
      where: { publicId: id },
    })

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    if (existing.ownerToken && existing.ownerToken !== ownerToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.profile.delete({ where: { publicId: id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { profileSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { publicId: params.id },
    })

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, profile })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ownerToken = request.headers.get('x-owner-token')
    const body = await request.json()
    const validated = profileSchema.parse(body)

    const existing = await prisma.profile.findUnique({
      where: { publicId: params.id },
    })

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    if (existing.ownerToken && existing.ownerToken !== ownerToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const profile = await prisma.profile.update({
      where: { publicId: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    const ownerToken = request.headers.get('x-owner-token')

    const existing = await prisma.profile.findUnique({
      where: { publicId: params.id },
    })

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    if (existing.ownerToken && existing.ownerToken !== ownerToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.profile.delete({ where: { publicId: params.id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, position, imagePath, createdBy } = body

  try {
    const newManagement = await prisma.management.create({
      data: {
        name,
        position,
        imagePath,
        createdBy,
      },
    })

    return NextResponse.json({ success: true, data: newManagement })
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const management = await prisma.management.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, data: management })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ message: 'Server error', details: error }, { status: 500 })
  }
}


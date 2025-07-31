import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const userRoles = await prisma.userRole.findMany({
      include: {
        user: true,
        role: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: userRoles,
    })
  } catch (error) {
    console.error('[USER_ROLE_GET]', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Request body:', body)

    const { userId, roleId } = body

    if (!userId || !roleId) {
      return NextResponse.json({ error: 'userId and roleId are required' }, { status: 400 })
    }

    // Cek apakah kombinasi userId dan roleId sudah ada
    const existing = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: Number(userId),
          roleId: Number(roleId),
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'User already has this role assigned' }, { status: 409 })
    }

    // Buat data baru
    const userRole = await prisma.userRole.create({
      data: {
        userId: Number(userId),
        roleId: Number(roleId),
      },
    })

    return NextResponse.json(userRole, { status: 201 })

  } catch (error: any) {
    console.error('POST /user-role error:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        detail: error?.message || error,
        code: error?.code,
      },
      { status: 500 }
    )
  }
}

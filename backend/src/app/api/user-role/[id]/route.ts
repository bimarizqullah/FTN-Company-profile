// src/app/api/user-role/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

interface Params {
  params: {
    id: string // userId sebagai param
  }
}

// GET: ambil user dan semua role-nya
export async function GET(_: Request, { params }: Params) {
  const userId = parseInt(params.id)

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles.map((r) => ({
        id: r.role.id,
        role: r.role.role,
        description: r.role.description,
      })),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to get user roles' }, { status: 500 })
  }
}

// PUT: update semua role user (replace)
export async function PUT(req: NextRequest, { params }: Params) {
  const userId = parseInt(params.id)
  const body = await req.json()

  const newRoleIds: number[] = body.roleIds // contoh: [1, 2, 3]

  try {
    // hapus semua role lama
    await prisma.userRole.deleteMany({ where: { userId } })

    // tambah relasi baru
    await prisma.userRole.createMany({
      data: newRoleIds.map((roleId) => ({ userId, roleId })),
    })

    return NextResponse.json({ message: 'Roles updated successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update roles' }, { status: 500 })
  }
}

// DELETE: hapus semua role milik user
export async function DELETE(_: NextRequest, { params }: Params) {
  const userId = parseInt(params.id)

  try {
    await prisma.userRole.deleteMany({
      where: { userId },
    })

    return NextResponse.json({ message: 'User roles deleted successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete user roles' }, { status: 500 })
  }
}

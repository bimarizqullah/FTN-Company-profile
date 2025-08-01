import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params // ✅ Await params
  const userRoleId = parseInt(params.id)
  
  try {
    const userRole = await prisma.userRole.findFirst({
      where: { id: userRoleId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        role: {
          select: {
            id: true,
            role: true,
            description: true,
          },
        },
      },
    })

    if (!userRole) {
      return Response.json({ message: 'User role not found' }, { status: 404 })
    }

    return Response.json(userRole)
  } catch (error) {
    console.error('Error fetching user role:', error)
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params // ✅ Await params
  const userRoleId = parseInt(params.id)

  try {
    const body = await req.json()
    const { userId, roleId } = body

    console.log('[UPDATE_USER_ROLE] Received data:', { userId, roleId, userRoleId })

    // Validasi input
    if (!userId || !roleId) {
      console.log('[UPDATE_USER_ROLE_ERROR] Missing required fields:', { userId, roleId })
      return Response.json(
        { message: 'userId dan roleId wajib diisi' },
        { status: 400 }
      )
    }

    // Cek apakah user role exists
    const existingUserRole = await prisma.userRole.findUnique({
      where: { id: userRoleId }
    })

    if (!existingUserRole) {
      return Response.json(
        { message: 'User role tidak ditemukan' },
        { status: 404 }
      )
    }

    // Cek apakah user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!userExists) {
      return Response.json(
        { message: 'User tidak ditemukan' },
        { status: 400 }
      )
    }

    // Cek apakah role exists
    const roleExists = await prisma.role.findUnique({
      where: { id: roleId }
    })

    if (!roleExists) {
      return Response.json(
        { message: 'Role tidak ditemukan' },
        { status: 400 }
      )
    }

    // Update user role
    const updatedUserRole = await prisma.userRole.update({
      where: { id: userRoleId },
      data: {
        userId: userId,
        roleId: roleId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        role: {
          select: {
            id: true,
            role: true,
            description: true,
          },
        },
      },
    })

    console.log('[UPDATE_USER_ROLE_SUCCESS]', updatedUserRole)
    return Response.json(updatedUserRole)

  } catch (error) {
    console.error('[UPDATE_USER_ROLE_ERROR]', error)
    return Response.json(
      { message: 'Gagal memperbarui user role' },
      { status: 500 }
    )
  }
}
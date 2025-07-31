import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

interface Params {
  params: {
    id: string
  }
}

export async function GET(_: Request, { params }: Params) {
  const userId = parseInt(params.id)

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Ambil semua permission dari semua role, lalu flatten dan unique
    const permissionSet = new Set<string>()
    user.roles.forEach(userRole => {
      userRole.role.permissions.forEach(rolePermission => {
        permissionSet.add(rolePermission.permission.permission)
      })
    })

    const permissions = Array.from(permissionSet)

    return NextResponse.json({
      userId: user.id,
      name: user.name,
      email: user.email,
      permissions
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch user permissions' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

interface Params {
  params: {
    id: string // roleId sebagai param
  }
}

// GET: Ambil semua permission milik role tertentu
export async function GET(_: Request, { params }: Params) {
  const roleId = parseInt(params.id)

  try {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    if (!role) {
      return NextResponse.json({ message: 'Role not found' }, { status: 404 })
    }

    const response = {
      id: role.id,
      role: role.role,
      description: role.description,
      permissions: role.permissions.map((p) => ({
        id: p.permission.id,
        description: p.permission.description,
      })),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[ROLE_PERMISSION_GET]', error)
    return NextResponse.json({ error: 'Failed to get role permissions' }, { status: 500 })
  }
}

// PUT: Replace semua permission untuk role tertentu
export async function PUT(req: NextRequest, { params }: Params) {
  const roleId = parseInt(params.id)
  const body = await req.json()

  const newPermissionIds: number[] = body.permissionIds // contoh: [1, 2, 3]

  try {
    // hapus semua permission lama
    await prisma.rolePermission.deleteMany({ where: { roleId } })

    // tambah permission baru
    await prisma.rolePermission.createMany({
      data: newPermissionIds.map((permissionId) => ({ roleId, permissionId })),
    })

    return NextResponse.json({ message: 'Permissions updated successfully' })
  } catch (error) {
    console.error('[ROLE_PERMISSION_PUT]', error)
    return NextResponse.json({ error: 'Failed to update role permissions' }, { status: 500 })
  }
}

// DELETE: Hapus semua permission milik role tertentu
export async function DELETE(_: NextRequest, { params }: Params) {
  const roleId = parseInt(params.id)

  try {
    await prisma.rolePermission.deleteMany({ where: { roleId } })

    return NextResponse.json({ message: 'Role permissions deleted successfully' })
  } catch (error) {
    console.error('[ROLE_PERMISSION_DELETE]', error)
    return NextResponse.json({ error: 'Failed to delete role permissions' }, { status: 500 })
  }
}

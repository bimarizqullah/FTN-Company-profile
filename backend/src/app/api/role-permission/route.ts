// src/app/api/role-permission/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const rolePermissions = await prisma.rolePermission.findMany({
      include: {
        role: true,
        permission: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: rolePermissions,
    })
  } catch (error) {
    console.error('[ROLE_PERMISSION_GET]', error)
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

export async function POST(req: NextRequest) {
  try {
    const { roleId, permissionIds } = await req.json()

    if (!roleId || !Array.isArray(permissionIds)) {
      return NextResponse.json({ success: false, message: 'Invalid input' }, { status: 400 })
    }

    // Optional: konversi ke integer jika perlu
    const numericRoleId = Number(roleId)
    const numericPermissionIds = permissionIds.map((id: any) => Number(id))

    // Simpan ke DB (contoh insert batch)
    const created = await prisma.rolePermission.createMany({
      data: numericPermissionIds.map((pid) => ({
        roleId: numericRoleId,
        permissionId: pid
      })),
      skipDuplicates: true,
    })

    return NextResponse.json({ success: true, data: created })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}


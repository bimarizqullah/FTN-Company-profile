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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { roleId, permissionId } = body

    if (!roleId || !permissionId) {
      return NextResponse.json(
        { error: 'roleId and permissionId are required' },
        { status: 400 }
      )
    }

    // Cek apakah kombinasi sudah ada
    const existing = await prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId: Number(roleId),
          permissionId: Number(permissionId),
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Role already has this permission assigned' },
        { status: 409 }
      )
    }

    const created = await prisma.rolePermission.create({
      data: {
        roleId: Number(roleId),
        permissionId: Number(permissionId),
      },
    })

    return NextResponse.json({ success: true, data: created }, { status: 201 })
  } catch (error: any) {
    console.error('[ROLE_PERMISSION_POST]', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        detail: error?.message || String(error),
      },
      { status: 500 }
    )
  }
}

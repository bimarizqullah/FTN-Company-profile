// PUT update role, DELETE role by id
import prisma from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'


type Params = {
  params: {
    id: string
  }
}

export async function GET(_: NextRequest, { params }: Params) {
  const permissionId = parseInt(params.id)

  try {
    const permission = await prisma.permission.findUnique({
      where: { id: permissionId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    })

    if (!permission) {
      return NextResponse.json({ message: 'Permission not found' }, { status: 404 })
    }

    const response = {
      id: permission.id,
      permission: permission.permission,
      description: permission.description,
      roles: permission.roles.map((r) => ({
        id: r.role.id,
        description: r.role.description,
      })),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[PERMISSION_ID_GET]', error)
    return NextResponse.json(
      { error: 'Failed to fetch role detail' },
      { status: 500 }
    )
  }
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { permission, description } = await req.json()
  const updated = await prisma.permission.update({
    where: { id: parseInt(params.id) },
    data: { permission, description }
  })

  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.permission.delete({ where: { id: parseInt(params.id) } })
  return NextResponse.json({ message: 'Deleted' })
}

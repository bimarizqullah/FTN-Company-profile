// PUT update role, DELETE role by id
import prisma from '@/lib/db'
import { NextResponse,  NextRequest } from 'next/server'

type Params = {
  params: {
    id: string
  }
}

export async function GET(_: NextRequest, { params }: Params) {
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
    console.error('[ROLE_ID_GET]', error)
    return NextResponse.json(
      { error: 'Failed to fetch role detail' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { role, description } = await req.json()
  const updated = await prisma.role.update({
    where: { id: parseInt(params.id) },
    data: { role, description }
  })

  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.role.delete({ where: { id: parseInt(params.id) } })
  return NextResponse.json({ message: 'Deleted' })
}

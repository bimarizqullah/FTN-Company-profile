// src/app/api/permission/[id]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

interface Params {
  params: {
    id: string
  }
}

// PUT: update permission
export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json()
    const { permission, description } = body

    const updated = await prisma.permission.update({
      where: { id: parseInt(params.id) },
      data: { permission, description }
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update permission' }, { status: 500 })
  }
}

// DELETE: hapus permission
export async function DELETE(_: Request, { params }: Params) {
  try {
    await prisma.permission.delete({
      where: { id: parseInt(params.id) }
    })
    return NextResponse.json({ message: 'Permission deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete permission' }, { status: 500 })
  }
}

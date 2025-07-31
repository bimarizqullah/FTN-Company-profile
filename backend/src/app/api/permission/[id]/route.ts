// PUT update role, DELETE role by id
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'

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

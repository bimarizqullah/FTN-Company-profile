// PUT update role, DELETE role by id
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'

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

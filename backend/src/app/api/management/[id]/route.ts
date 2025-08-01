import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { status_enum } from '@prisma/client'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  console.log('Incoming params:', params)

  try {
    const management = await prisma.management.findUnique({
      where: { id: Number(params.id) },
      include: { user: true },
    })

    if (!management) {
      console.log(`No management found with id ${params.id}`)
      return NextResponse.json({ message: 'Data tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: management })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ message: 'Server error', details: error }, { status: 500 })
  }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData()
    const name = formData.get('name')?.toString() || ''
    const position = formData.get('position')?.toString() || ''
    const status = formData.get('status')?.toString() as status_enum
    const file = formData.get('file') as File | null

    if (!name || !position) {
      return NextResponse.json({ message: 'Nama dan posisi wajib diisi' }, { status: 400 })
    }

    let imagePath: string | undefined = undefined

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'management')
      await mkdir(uploadsDir, { recursive: true })
      const filePath = path.join(uploadsDir, filename)
      await writeFile(filePath, buffer)
      imagePath = `/uploads/management/${filename}`
    }

    const updated = await prisma.management.update({
      where: { id: Number(params.id) },
      data: {
        name,
        position,
        status,
        ...(imagePath ? { imagePath } : {}) // hanya update imagePath jika file baru diunggah
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ message: 'Gagal update data', details: error }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await prisma.management.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ success: true, message: 'Data berhasil dihapus' })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ message: 'Server error', details: error }, { status: 500 })
  }
}
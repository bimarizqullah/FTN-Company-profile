import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import prisma from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { status_enum } from '@prisma/client'

export async function POST(req: NextRequest) {
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

    const { searchParams } = new URL(req.url)
    const method = searchParams.get('method') // bisa 'PUT'
    const id = searchParams.get('id') // jika PUT

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const name = formData.get('name')?.toString() || ''
    const position = formData.get('position')?.toString() || ''
    const statusInput = (formData.get('status')?.toString() || 'active') as status_enum

    if (!name || !position) {
      return NextResponse.json({ message: 'Nama dan posisi wajib diisi' }, { status: 400 })
    }

    let filename = ''
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'management')
      await mkdir(uploadsDir, { recursive: true })
      const filePath = path.join(uploadsDir, filename)
      await writeFile(filePath, buffer)
    }

    if (method === 'PUT' && id) {
      const updated = await prisma.management.update({
        where: { id: Number(id) },
        data: {
          name,
          position,
          status: statusInput,
          ...(filename && { imagePath: `/uploads/management/${filename}` }),
        },
      })

      return NextResponse.json({ success: true, message: 'Berhasil diupdate', data: updated })
    } else {
      const newManagement = await prisma.management.create({
        data: {
          imagePath: `/uploads/management/${filename}`,
          name,
          position,
          status: statusInput,
          createdBy: Number(decoded.userId),
        },
      })

      return NextResponse.json({ success: true, message: 'Berhasil ditambahkan', data: newManagement })
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ message: 'Server error', details: error }, { status: 500 })
  }
}

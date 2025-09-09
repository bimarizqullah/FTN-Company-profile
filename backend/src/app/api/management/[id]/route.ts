import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { authMiddleware } from '@/middlewares/authMiddleware'
import { permissionMiddleware } from '@/middlewares/permissionMiddleware'
import { PERMISSIONS } from '@/constants/permissions'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { status_enum } from '@prisma/client'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication
  const authResponse = await authMiddleware(req);
  if (authResponse) return authResponse;

  // Check permissions
  const permissionResponse = await permissionMiddleware(req, [PERMISSIONS.MANAGEMENT_READ]);
  if (permissionResponse) return permissionResponse;

  try {
    const management = await prisma.management.findUnique({
      where: { id: Number(params.id) },
      include: { user: true },
    })

    if (!management) {
      return NextResponse.json({ 
        success: false,
        message: 'Data management tidak ditemukan' 
      }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: management })
  } catch (error) {
    console.error('Management GET error:', error)
    return NextResponse.json({ 
      success: false,
      message: 'Gagal mengambil data management',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication
  const authResponse = await authMiddleware(req);
  if (authResponse) return authResponse;

  // Check permissions
  const permissionResponse = await permissionMiddleware(req, [PERMISSIONS.MANAGEMENT_UPDATE]);
  if (permissionResponse) return permissionResponse;

  try {
    const formData = await req.formData()
    const name = formData.get('name')?.toString() || ''
    const position = formData.get('position')?.toString() || ''
    const status = formData.get('status')?.toString() as status_enum
    const file = formData.get('file') as File | null

    if (!name || !position) {
      return NextResponse.json({ 
        success: false,
        message: 'Nama dan posisi wajib diisi' 
      }, { status: 400 })
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
    console.error('Management update error:', error)
    return NextResponse.json({ 
      success: false,
      message: 'Gagal update data management',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication
  const authResponse = await authMiddleware(req);
  if (authResponse) return authResponse;

  // Check permissions
  const permissionResponse = await permissionMiddleware(req, [PERMISSIONS.MANAGEMENT_DELETE]);
  if (permissionResponse) return permissionResponse;

  try {
    // Check if management exists
    const existing = await prisma.management.findUnique({
      where: { id: Number(params.id) }
    });

    if (!existing) {
      return NextResponse.json({ 
        success: false,
        message: 'Data management tidak ditemukan' 
      }, { status: 404 });
    }

    await prisma.management.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ 
      success: true, 
      message: 'Data management berhasil dihapus' 
    })
  } catch (error) {
    console.error('Management DELETE error:', error)
    return NextResponse.json({ 
      success: false,
      message: 'Gagal menghapus data management',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/middlewares/authMiddleware'
import prisma from '@/lib/db'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authMiddleware(req)
  if (auth) return auth

  // Untuk sementara, izinkan semua user terautentikasi membaca detail

  try {
    const id = Number(params.id)
    const item = await prisma.news.findUnique({ where: { id } })
    if (!item) return NextResponse.json({ message: 'News not found' }, { status: 404 })
    return NextResponse.json(item)
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil berita', error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authMiddleware(req)
  if (auth) return auth

  // Untuk sementara, izinkan semua user terautentikasi update

  try {
    const id = Number(params.id)
    const existing = await prisma.news.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ message: 'News not found' }, { status: 404 })

    const formData = await req.formData()
    const title = formData.get('title')?.toString()
    const slug = formData.get('slug')?.toString()
    const content = formData.get('content')?.toString()
    const sourceName = formData.get('sourceName')?.toString()
    const sourceLink = formData.get('sourceLink')?.toString()
    const status = formData.get('status')?.toString() as 'active' | 'inactive' | undefined
    const publishedAtStr = formData.get('publishedAt')?.toString()
    const publishedAt = publishedAtStr ? new Date(publishedAtStr) : undefined
    const file = formData.get('image') as File | null

    let imagePath = existing.imagePath || undefined
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'news')
      await mkdir(uploadsDir, { recursive: true })
      const filePath = path.join(uploadsDir, fileName)
      await writeFile(filePath, buffer)
      // hapus file lama jika ada
      if (existing.imagePath) {
        try { await unlink(path.join(process.cwd(), 'public', existing.imagePath)) } catch {}
      }
      imagePath = `/uploads/news/${fileName}`
    }

    const updated = await prisma.news.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        slug: slug ?? existing.slug,
        content: content ?? existing.content,
        imagePath,
        sourceName: sourceName ?? existing.sourceName,
        sourceLink: sourceLink ?? existing.sourceLink,
        status: (status ?? existing.status) as any,
        publishedAt: publishedAt ?? existing.publishedAt
      }
    })

    return NextResponse.json({ message: 'News updated', data: updated })
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal memperbarui berita', error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authMiddleware(req)
  if (auth) return auth

  // Untuk sementara, izinkan semua user terautentikasi delete

  try {
    const id = Number(params.id)
    const existing = await prisma.news.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ message: 'News not found' }, { status: 404 })

    await prisma.news.delete({ where: { id } })
    if (existing.imagePath) {
      try { await unlink(path.join(process.cwd(), 'public', existing.imagePath)) } catch {}
    }
    return NextResponse.json({ message: 'News deleted' })
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal menghapus berita', error: error.message }, { status: 500 })
  }
}



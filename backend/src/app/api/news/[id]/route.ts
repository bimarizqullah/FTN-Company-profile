import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/middlewares/authMiddleware'
import prisma from '@/lib/db'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authMiddleware(req)
  if (auth) return auth

  // Untuk sementara, izinkan semua user terautentikasi membaca detail

  try {
    const { id: idStr } = await params
    const id = Number(idStr)
    const item = await prisma.news.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        subCategory: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })
    if (!item) return NextResponse.json({ message: 'News not found' }, { status: 404 })
    return NextResponse.json(item)
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil berita', error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authMiddleware(req)
  if (auth) return auth

  // Untuk sementara, izinkan semua user terautentikasi update

  try {
    const { id: idStr } = await params
    const id = Number(idStr)
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
    const categoryIdStr = formData.get('categoryId')?.toString()
    const categoryId = categoryIdStr !== null ? (categoryIdStr ? Number(categoryIdStr) : null) : undefined
    const subCategoryIdStr = formData.get('subCategoryId')?.toString()
    const subCategoryId = subCategoryIdStr !== null ? (subCategoryIdStr ? Number(subCategoryIdStr) : null) : undefined
    const file = formData.get('image') as File | null
    const video = formData.get('video') as File | null
    const youtubeUrl = formData.get('youtubeUrl')?.toString()

    let imagePath = existing.imagePath || undefined
    let videoPath = existing.videoPath || undefined
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
      imagePath = `/api/uploads/news/${fileName}`
    }

    if (video && video.size > 0) {
      if (video.size > 200 * 1024 * 1024) {
        return NextResponse.json({ message: 'Ukuran video maksimal 200MB' }, { status: 400 })
      }
      const bytes = await video.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${video.name.replace(/\s+/g, '_')}`
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'news')
      await mkdir(uploadsDir, { recursive: true })
      const filePath = path.join(uploadsDir, fileName)
      await writeFile(filePath, buffer)
      if (existing.videoPath) {
        try { await unlink(path.join(process.cwd(), 'public', existing.videoPath)) } catch {}
      }
      videoPath = `/api/uploads/news/${fileName}`
    }

    // Validasi category dan subCategory jika diberikan
    const finalCategoryId = categoryId !== undefined ? categoryId : existing.categoryId
    const finalSubCategoryId = subCategoryId !== undefined ? subCategoryId : existing.subCategoryId

    if (finalCategoryId) {
      const category = await prisma.category.findUnique({ where: { id: finalCategoryId } })
      if (!category) {
        return NextResponse.json({ message: 'Kategori tidak ditemukan' }, { status: 404 })
      }
    }

    if (finalSubCategoryId) {
      const subCategory = await prisma.subCategory.findUnique({ where: { id: finalSubCategoryId } })
      if (!subCategory) {
        return NextResponse.json({ message: 'Sub-kategori tidak ditemukan' }, { status: 404 })
      }
      // Validasi bahwa subCategory termasuk dalam category yang dipilih
      if (finalCategoryId && subCategory.categoryId !== finalCategoryId) {
        return NextResponse.json({ message: 'Sub-kategori tidak termasuk dalam kategori yang dipilih' }, { status: 400 })
      }
    }

    const updated = await prisma.news.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        slug: slug ?? existing.slug,
        content: content ?? existing.content,
        imagePath,
        videoPath,
        youtubeUrl: youtubeUrl ?? existing.youtubeUrl,
        sourceName: sourceName ?? existing.sourceName,
        sourceLink: sourceLink ?? existing.sourceLink,
        status: (status ?? existing.status) as any,
        publishedAt: publishedAt ?? existing.publishedAt,
        categoryId: finalCategoryId,
        subCategoryId: finalSubCategoryId
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        subCategory: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json({ message: 'News updated', data: updated })
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal memperbarui berita', error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authMiddleware(req)
  if (auth) return auth

  // Untuk sementara, izinkan semua user terautentikasi delete

  try {
    const { id: idStr } = await params
    const id = Number(idStr)
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



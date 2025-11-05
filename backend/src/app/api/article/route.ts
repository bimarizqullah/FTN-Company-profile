import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/middlewares/authMiddleware'
import prisma from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  const articles = await prisma.article.findMany({
    where: {
      status: 'active',
      OR: [
        { category: { type: { in: ['article', 'both'] } } },
        { subCategory: { type: { in: ['article', 'both'] } } },
        { category: null, subCategory: null }
      ]
    },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true, title: true, slug: true, content: true, imagePath: true,
      videoPath: true, youtubeUrl: true, sourceName: true, sourceLink: true,
      status: true, publishedAt: true, createdAt: true, updatedAt: true,
      categoryId: true, subCategoryId: true,
      category: { select: { id: true, name: true, slug: true } },
      subCategory: { select: { id: true, name: true, slug: true } }
    }
  })
  return NextResponse.json(articles)
}

export async function POST(req: NextRequest) {
  const auth = await authMiddleware(req)
  if (auth) return auth

  // Untuk sementara, izinkan semua user terautentikasi membuat article

  try {
    const formData = await req.formData()
    const title = formData.get('title')?.toString() || ''
    const slug = formData.get('slug')?.toString() || ''
    const content = formData.get('content')?.toString() || ''
    const youtubeUrl = formData.get('youtubeUrl')?.toString() || undefined
    const sourceName = formData.get('sourceName')?.toString() || undefined
    const sourceLink = formData.get('sourceLink')?.toString() || undefined
    const status = (formData.get('status')?.toString() || 'active') as 'active' | 'inactive'
    const publishedAtStr = formData.get('publishedAt')?.toString()
    const publishedAt = publishedAtStr ? new Date(publishedAtStr) : null
    const categoryIdStr = formData.get('categoryId')?.toString()
    const categoryId = categoryIdStr ? Number(categoryIdStr) : undefined
    const subCategoryIdStr = formData.get('subCategoryId')?.toString()
    const subCategoryId = subCategoryIdStr ? Number(subCategoryIdStr) : undefined
    const file = formData.get('image') as File | null
    const video = formData.get('video') as File | null

    if (!title.trim() || !slug.trim() || !content.trim()) {
      return NextResponse.json({ message: 'Title, slug, dan content wajib diisi' }, { status: 400 })
    }

    let imagePath: string | undefined
    let videoPath: string | undefined
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'article')
      await mkdir(uploadsDir, { recursive: true })
      const filePath = path.join(uploadsDir, fileName)
      await writeFile(filePath, buffer)
      imagePath = `/api/uploads/article/${fileName}`
    }

    if (video && video.size > 0) {
      if (video.size > 200 * 1024 * 1024) {
        return NextResponse.json({ message: 'Ukuran video maksimal 200MB' }, { status: 400 })
      }
      const bytes = await video.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${video.name.replace(/\s+/g, '_')}`
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'article')
      await mkdir(uploadsDir, { recursive: true })
      const filePath = path.join(uploadsDir, fileName)
      await writeFile(filePath, buffer)
      videoPath = `/api/uploads/article/${fileName}`
    }

    // Ambil userId dari token
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 })
    }
    const userId = Number((decoded as any).userId)

    // Validasi category dan subCategory jika diberikan
    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } })
      if (!category) {
        return NextResponse.json({ message: 'Kategori tidak ditemukan' }, { status: 404 })
      }
    }

    if (subCategoryId) {
      const subCategory = await prisma.subCategory.findUnique({ where: { id: subCategoryId } })
      if (!subCategory) {
        return NextResponse.json({ message: 'Sub-kategori tidak ditemukan' }, { status: 404 })
      }
      // Validasi bahwa subCategory termasuk dalam category yang dipilih
      if (categoryId && subCategory.categoryId !== categoryId) {
        return NextResponse.json({ message: 'Sub-kategori tidak termasuk dalam kategori yang dipilih' }, { status: 400 })
      }
    }

    const created = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        imagePath,
        videoPath,
        youtubeUrl,
        status: status as any,
        sourceName,
        sourceLink,
        publishedAt: publishedAt || undefined,
        categoryId: categoryId || null,
        subCategoryId: subCategoryId || null,
        createdBy: userId
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

    return NextResponse.json({ message: 'Article created', data: created }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal membuat artikel', error: error.message }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/middlewares/authMiddleware'
import prisma from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  // Jadikan endpoint list news publik agar mudah dipakai di Dashboard maupun frontend

  try {
    const news = await prisma.news.findMany({
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        imagePath: true,
        videoPath: true,
        youtubeUrl: true,
        sourceName: true,
        sourceLink: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      }
    })
    return NextResponse.json(news)
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil data berita', error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await authMiddleware(req)
  if (auth) return auth

  // Untuk sementara, izinkan semua user terautentikasi membuat news

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
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'news')
      await mkdir(uploadsDir, { recursive: true })
      const filePath = path.join(uploadsDir, fileName)
      await writeFile(filePath, buffer)
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
      videoPath = `/api/uploads/news/${fileName}`
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

    const created = await prisma.news.create({
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
        createdBy: userId
      }
    })

    return NextResponse.json({ message: 'News created', data: created }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal membuat berita', error: error.message }, { status: 500 })
  }
}



import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    if (!slug) {
      return NextResponse.json({ message: 'Slug wajib diisi' }, { status: 400 })
    }

    const item = await prisma.news.findFirst({
      where: { slug, status: 'active' },
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
        user: { select: { id: true, name: true, email: true } }
      }
    })

    if (!item) {
      return NextResponse.json({ message: 'Berita tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil detail berita', error: error.message }, { status: 500 })
  }
}



import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'active' },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
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
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        status: true
      }
    })
    return NextResponse.json(articles)
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil artikel publik', error: error.message }, { status: 500 })
  }
}

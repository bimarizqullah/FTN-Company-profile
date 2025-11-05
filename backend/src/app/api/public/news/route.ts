import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const news = await prisma.news.findMany({
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
        categoryId: true,
        subCategoryId: true,
        createdAt: true,
        updatedAt: true,
        status: true,
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
    return NextResponse.json(news)
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil berita publik', error: error.message }, { status: 500 })
  }
}



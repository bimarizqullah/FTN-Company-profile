import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const article = await prisma.article.findUnique({
      where: { 
        slug: params.slug,
        status: 'active'
      },
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

    if (!article) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil artikel', error: error.message }, { status: 500 })
  }
}

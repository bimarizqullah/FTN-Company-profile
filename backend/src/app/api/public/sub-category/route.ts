import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET semua sub-kategori (public)
export async function GET(req: NextRequest) {
  try {
    const categoryId = req.nextUrl.searchParams.get('categoryId')
    
    const where: any = { status: 'active' }
    if (categoryId) {
      where.categoryId = Number(categoryId)
    }

    const subCategories = await prisma.subCategory.findMany({
      where,
      orderBy: [{ categoryId: 'asc' }, { name: 'asc' }],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            news: {
              where: { status: 'active' }
            },
            articles: {
              where: { status: 'active' }
            }
          }
        }
      }
    })
    return NextResponse.json(subCategories)
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil data sub-kategori', error: error.message }, { status: 500 })
  }
}






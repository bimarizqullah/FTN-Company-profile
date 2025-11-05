import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET semua kategori (public)
export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: { status: 'active' },
      orderBy: [{ name: 'asc' }],
      include: {
        subCategories: {
          where: { status: 'active' },
          orderBy: { name: 'asc' }
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
    return NextResponse.json(categories)
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil data kategori', error: error.message }, { status: 500 })
  }
}






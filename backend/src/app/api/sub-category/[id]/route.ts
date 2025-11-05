import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/middlewares/authMiddleware'
import prisma from '@/lib/db'

// GET detail sub-kategori by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params
    const id = Number(idStr)
    const subCategory = await prisma.subCategory.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true
          }
        },
        _count: {
          select: {
            news: true,
            articles: true
          }
        }
      }
    })
    if (!subCategory) return NextResponse.json({ message: 'Sub-kategori tidak ditemukan' }, { status: 404 })
    return NextResponse.json(subCategory)
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil sub-kategori', error: error.message }, { status: 500 })
  }
}

// PUT update sub-kategori
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authMiddleware(req)
  if (auth) return auth

  try {
    const { id: idStr } = await params
    const id = Number(idStr)
    const existing = await prisma.subCategory.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ message: 'Sub-kategori tidak ditemukan' }, { status: 404 })

    const contentType = req.headers.get('content-type') || ''
    let updateData: any = {}

    if (contentType.includes('application/json')) {
      const body = await req.json()
      updateData = {
        name: body.name ?? existing.name,
        slug: body.slug ?? existing.slug,
        description: body.description !== undefined ? body.description : existing.description,
        categoryId: body.categoryId ?? existing.categoryId,
        type: body.type ?? existing.type,
        status: body.status ?? existing.status
      }
    } else {
      const formData = await req.formData()
      updateData = {
        name: formData.get('name')?.toString() ?? existing.name,
        slug: formData.get('slug')?.toString() ?? existing.slug,
        description: formData.get('description')?.toString() ?? existing.description,
        categoryId: formData.get('categoryId') ? Number(formData.get('categoryId')) : existing.categoryId,
        type: formData.get('type')?.toString() ?? existing.type,
        status: (formData.get('status')?.toString() ?? existing.status) as 'active' | 'inactive'
      }
    }

    // Validasi type
    if (updateData.type && !['news', 'article', 'both'].includes(updateData.type)) {
      return NextResponse.json({ message: 'Type harus news, article, atau both' }, { status: 400 })
    }

    // Cek apakah kategori ada
    if (updateData.categoryId && updateData.categoryId !== existing.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: updateData.categoryId }
      })
      if (!category) {
        return NextResponse.json({ message: 'Kategori tidak ditemukan' }, { status: 404 })
      }
    }

    // Cek apakah slug sudah digunakan oleh sub-kategori lain
    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugExists = await prisma.subCategory.findUnique({
        where: { slug: updateData.slug }
      })
      if (slugExists) {
        return NextResponse.json({ message: 'Slug sudah digunakan' }, { status: 400 })
      }
    }

    const updated = await prisma.subCategory.update({
      where: { id },
      data: {
        name: updateData.name,
        slug: updateData.slug,
        description: updateData.description,
        categoryId: updateData.categoryId,
        type: updateData.type as any,
        status: updateData.status as any
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true
          }
        },
        _count: {
          select: {
            news: true,
            articles: true
          }
        }
      }
    })

    return NextResponse.json({ message: 'Sub-kategori berhasil diperbarui', data: updated })
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal memperbarui sub-kategori', error: error.message }, { status: 500 })
  }
}

// DELETE sub-kategori
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authMiddleware(req)
  if (auth) return auth

  try {
    const { id: idStr } = await params
    const id = Number(idStr)
    const existing = await prisma.subCategory.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ message: 'Sub-kategori tidak ditemukan' }, { status: 404 })

    // Cek apakah sub-kategori masih digunakan
    const newsCount = await prisma.news.count({ where: { subCategoryId: id } })
    const articleCount = await prisma.article.count({ where: { subCategoryId: id } })

    if (newsCount > 0 || articleCount > 0) {
      return NextResponse.json({
        message: 'Sub-kategori tidak dapat dihapus karena masih digunakan',
        details: {
          news: newsCount,
          articles: articleCount
        }
      }, { status: 400 })
    }

    await prisma.subCategory.delete({ where: { id } })
    return NextResponse.json({ message: 'Sub-kategori berhasil dihapus' })
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal menghapus sub-kategori', error: error.message }, { status: 500 })
  }
}
import api from './api'

export type ContentType = 'news' | 'article' | 'both'

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  type: ContentType
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  subCategories?: SubCategory[]
  _count?: {
    news: number
    articles: number
    subCategories?: number
  }
}

export interface SubCategory {
  id: number
  name: string
  slug: string
  description?: string
  categoryId: number
  type: ContentType
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  category?: {
    id: number
    name: string
    slug: string
    type?: ContentType
  }
  _count?: {
    news: number
    articles: number
  }
}

class CategoryService {
  async getCategories(type?: ContentType): Promise<Category[]> {
    const url = type 
      ? `/category?type=${type}`
      : '/category'
    const res = await api.get(url)
    return res.data
  }

  async getSubCategories(categoryId?: number, type?: ContentType): Promise<SubCategory[]> {
    const params = new URLSearchParams()
    if (categoryId) params.append('categoryId', categoryId.toString())
    if (type) params.append('type', type)
    
    const url = params.toString() 
      ? `/sub-category?${params.toString()}`
      : '/sub-category'
    
    const res = await api.get(url)
    return res.data
  }
}

export default new CategoryService()
import api, { UPLOAD_BASE_URL } from './api'

export interface Article {
  id: number
  title: string
  slug: string
  content: string
  imagePath?: string
  videoPath?: string
  youtubeUrl?: string
  sourceName?: string
  sourceLink?: string
  status: 'active' | 'inactive'
  publishedAt?: string
  createdAt: string
  updatedAt: string
  categoryId?: number
  subCategoryId?: number
  category?: { id: number; name: string; slug: string }
  subCategory?: { id: number; name: string; slug: string }
  user?: { id: number; name: string; email: string }
}

export const ARTICLE_IMAGE_BASE = UPLOAD_BASE_URL

class ArticleService {
  async getArticle(): Promise<Article[]> {
    const res = await api.get('/article')
    return res.data
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    const res = await api.get(`/article/${slug}`)
    return res.data
  }
}

export default new ArticleService()



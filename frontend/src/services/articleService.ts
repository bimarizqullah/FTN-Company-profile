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
  user?: { id: number; name: string; email: string }
}

export const ARTICLE_IMAGE_BASE = UPLOAD_BASE_URL

class ArticleService {
  async getArticle(): Promise<Article[]> {
    const res = await api.get('/public/article')
    return res.data
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    const res = await api.get(`/public/article/${slug}`)
    return res.data
  }
}

export default new ArticleService()



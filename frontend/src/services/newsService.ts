import api, { UPLOAD_BASE_URL } from './api'

export interface News {
  id: number
  title: string
  slug: string
  content: string
  imagePath?: string
  sourceName?: string
  sourceLink?: string
  status: 'active' | 'inactive'
  publishedAt?: string
  createdAt: string
  updatedAt: string
  user?: { id: number; name: string; email: string }
}

export const NEWS_IMAGE_BASE = UPLOAD_BASE_URL

class NewsService {
  async getNews(): Promise<News[]> {
    const res = await api.get('/public/news')
    return res.data
  }

  async getNewsBySlug(slug: string): Promise<News> {
    const res = await api.get(`/public/news/${slug}`)
    return res.data
  }
}

export default new NewsService()



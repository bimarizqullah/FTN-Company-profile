import api, { UPLOAD_BASE_URL } from './api'

export interface News {
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
  category?: { id: number; name: string; slug: string; type?: 'news' | 'article' | 'both' }
  subCategory?: { id: number; name: string; slug: string; type?: 'news' | 'article' | 'both' }
  user?: { id: number; name: string; email: string }
}

export const NEWS_IMAGE_BASE = UPLOAD_BASE_URL

class NewsService {
  /**
   * Ambil semua berita, bisa difilter berdasarkan type (news, article, both)
   * Contoh: getNews('news') hanya ambil berita yang kategorinya bertipe 'news'
   */
  async getNews(type?: 'news' | 'article' | 'both'): Promise<News[]> {
    const params = new URLSearchParams()
    if (type) params.append('type', type)

    const url = params.toString()
      ? `/news?type=news`
      : '/news'

    const res = await api.get(url)
    return res.data
  }

  /**
   * Ambil detail berita berdasarkan slug
   */
  async getNewsBySlug(slug: string): Promise<News> {
    const res = await api.get(`/news/${slug}`)
    return res.data
  }
}

export default new NewsService()

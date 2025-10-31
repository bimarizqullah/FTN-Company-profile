import { defineStore } from 'pinia'
import { ref } from 'vue'
import articleService, { type Article } from '@/services/articleService'

export const useArticleStore = defineStore('articles', () => {
  const items = ref<Article[]>([])
  const loading = ref(false)
  const loadedOnce = ref(false)
  const error = ref<string | null>(null)

  async function fetchArticles() {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      const data = await articleService.getArticle()
      // Hanya ambil yang active dan urutkan terbaru
      items.value = (data || [])
        .filter(n => n.status === 'active')
        .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
      loadedOnce.value = true
    } catch (e: any) {
      error.value = e?.message || 'Gagal memuat artikel'
    } finally {
      loading.value = false
    }
  }

  return { items, loading, loadedOnce, error, fetchArticles }
})




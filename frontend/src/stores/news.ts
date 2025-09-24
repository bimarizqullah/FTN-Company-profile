import { defineStore } from 'pinia'
import { ref } from 'vue'
import newsService, { type News } from '@/services/newsService'

export const useNewsStore = defineStore('news', () => {
  const items = ref<News[]>([])
  const loading = ref(false)
  const loadedOnce = ref(false)
  const error = ref<string | null>(null)

  async function fetchNews() {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      const data = await newsService.getNews()
      // Hanya ambil yang active dan urutkan terbaru
      items.value = (data || [])
        .filter(n => n.status === 'active')
        .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
      loadedOnce.value = true
    } catch (e: any) {
      error.value = e?.message || 'Gagal memuat berita'
    } finally {
      loading.value = false
    }
  }

  return { items, loading, loadedOnce, error, fetchNews }
})




<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import newsService, { type News, NEWS_IMAGE_BASE } from '@/services/newsService'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string
const loading = ref(true)
const item = ref<News | null>(null)

onMounted(async () => {
  try {
    item.value = await newsService.getNewsBySlug(slug)
  } catch (e) {
    // fallback: cari dari list jika endpoint tidak tersedia
    try {
      const list = await newsService.getNews()
      item.value = list.find(n => n.slug === slug) || null
    } finally {
      // ignore
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="container mx-auto px-4 py-10">
    <div v-if="loading" class="text-gray-600 dark:text-gray-300">Memuat...</div>
    <div v-else-if="!item" class="text-gray-600 dark:text-gray-300">Berita tidak ditemukan</div>
    <article v-else class="max-w-3xl mx-auto">
      <!-- Tombol Back -->
      <button 
        @click="router.back()" 
        class="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>
      <h1 class="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
        {{ item.title }}
      </h1>
      <div class="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-6 border-y border-gray-200 dark:border-gray-700 py-3 flex flex-wrap gap-x-4 gap-y-2">
        {{ item.publishedAt ? new Date(item.publishedAt).toLocaleString() : '-' }}
        <span v-if="item.sourceName" class="ml-2">• Sumber: 
          <a v-if="item.sourceLink" :href="item.sourceLink" target="_blank" rel="noopener" class="text-blue-600 dark:text-blue-400 hover:underline">{{ item.sourceName }}</a>
          <span v-else>{{ item.sourceName }}</span>
        </span>
      </div>
      <img v-if="item.imagePath" :src="`${NEWS_IMAGE_BASE}${item.imagePath}`" class="w-full max-h-[460px] object-cover rounded-xl shadow mb-8" />
      <div class="article-content text-gray-800 dark:text-gray-200 text-justify space-y-5 leading-8 tracking-normal">
        <p v-for="(p, idx) in (item.content || '').split(/\n+/)" :key="idx">{{ p }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.prose :deep(img) { border-radius: 0.5rem; }
.prose :deep(a) { color: #2563eb; }
.dark .prose :deep(a) { color: #60a5fa; }
.article-content p:first-child { text-indent: 1.25rem; }
</style>



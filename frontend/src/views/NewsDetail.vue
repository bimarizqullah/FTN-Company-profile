<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import newsService, { type News, NEWS_IMAGE_BASE } from '@/services/newsService'

const route = useRoute()
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
    <article v-else class="prose max-w-none dark:prose-invert">
      <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{{ item.title }}</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {{ item.publishedAt ? new Date(item.publishedAt).toLocaleString() : '-' }}
        <span v-if="item.sourceName" class="ml-2">• Sumber: 
          <a v-if="item.sourceLink" :href="item.sourceLink" target="_blank" rel="noopener" class="text-blue-600 dark:text-blue-400 hover:underline">{{ item.sourceName }}</a>
          <span v-else>{{ item.sourceName }}</span>
        </span>
      </p>
      <img v-if="item.imagePath" :src="`${NEWS_IMAGE_BASE}${item.imagePath}`" class="w-full max-h-[420px] object-cover rounded mb-6" />
      <div v-html="item.content" class="text-gray-800 dark:text-gray-200"></div>
    </article>
  </section>
</template>

<style scoped>
.prose :deep(img) {
  border-radius: 0.5rem;
}
.prose :deep(a) { color: #2563eb; }
.dark .prose :deep(a) { color: #60a5fa; }
</style>



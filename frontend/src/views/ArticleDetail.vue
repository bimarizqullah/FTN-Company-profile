<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DOMPurify from 'dompurify'
import articleService, { type Article, ARTICLE_IMAGE_BASE } from '@/services/articleService'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string
const loading = ref(true)
const item = ref<Article | null>(null)

onMounted(async () => {
  try {
    item.value = await articleService.getArticleBySlug(slug)
  } catch {
    // fallback: cari dari list jika endpoint tidak tersedia
    try {
      const list = await articleService.getArticle()
      item.value = list.find(n => n.slug === slug) || null
    } finally {
      // ignore
    }
  } finally {
    loading.value = false
  }
})

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:v=|\.be\/|embed\/)([A-Za-z0-9_-]{6,})/)
  return match?.[1] || null
}

function embedUrl(url: string): string {
  const id = extractYoutubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : ''
}
// Process HTML content to fix image URLs and sanitize
function processHtmlContent(html: string | undefined): string {
  if (!html) return ''

  // Check if we're in browser environment
  if (typeof document === 'undefined') return html

  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // Sanitize the HTML content with DOMPurify
  const sanitized = DOMPurify.sanitize(tempDiv.innerHTML, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style'],
    ALLOW_DATA_ATTR: false
  })

  return sanitized
}

// Computed property for processed and sanitized content
const processedContent = computed(() => {
  return processHtmlContent(item.value?.content)
})

// Only show YouTube iframe if url contains a valid video id
const hasYoutube = computed(() => {
  const url = item.value?.youtubeUrl || ''
  return !!extractYoutubeId(url)
})
</script>

<template>
  <section class="container mx-auto px-4 py-10">
    <div v-if="loading" class="text-gray-600 dark:text-gray-300">Memuat...</div>
    <div v-else-if="!item" class="text-gray-600 dark:text-gray-300">Artikel tidak ditemukan</div>
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
      <!-- Prioritas tampilkan YouTube jika ada -->
      <div v-if="hasYoutube" class="w-full aspect-video rounded-xl overflow-hidden shadow mb-8">
        <iframe
          class="w-full h-full"
          :src="embedUrl((item.youtubeUrl || '') as string)"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <!-- Jika tidak ada YouTube, tampilkan video upload jika ada -->
      <video v-else-if="item.videoPath" :src="`${ARTICLE_IMAGE_BASE}${item.videoPath}`" class="w-full max-h-[460px] object-cover rounded-xl shadow mb-8" controls />
      <!-- Jika tidak ada video, fallback ke gambar -->
      <img v-else-if="item.imagePath" :src="`${ARTICLE_IMAGE_BASE}${item.imagePath}`" class="w-full max-h-[460px] object-cover rounded-xl shadow mb-8" />
      <div
        class="article-content prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed"
        v-html="processedContent"
      ></div>
    </article>
  </section>
</template>

<style scoped>
.article-content :deep(img) {
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  max-width: 100%;
  height: auto;
}

.article-content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

.dark .article-content :deep(a) {
  color: #60a5fa;
}

.article-content :deep(h2) {
  color: #1f2937;
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.dark .article-content :deep(h2) {
  color: #f9fafb;
}

.article-content :deep(h3) {
  color: #374151;
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.dark .article-content :deep(h3) {
  color: #e5e7eb;
}

.article-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.article-content :deep(ul) {
  list-style-type: disc;
  list-style-position: outside;
}

.article-content :deep(ol) {
  list-style-type: decimal;
  list-style-position: outside;
}

.article-content :deep(li::marker) {
  color: #6b7280;
}

.article-content :deep(li) {
  margin: 0.25rem 0;
}

.article-content :deep(li p) {
  margin: 0; /* hilangkan margin paragraf di dalam list untuk cegah jarak ekstra */
}

.article-content :deep(li::marker) {
  color: #9ca3af; /* marker terlihat pada dark/light */
}

.article-content :deep(strong) {
  font-weight: 700;
  color: inherit;
}

.article-content :deep(em) {
  font-style: italic;
}

.article-content :deep(u) {
  text-decoration: underline;
}

.article-content :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #6b7280;
}

.dark .article-content :deep(blockquote) {
  border-left-color: #4b5563;
  color: #9ca3af;
}
</style>

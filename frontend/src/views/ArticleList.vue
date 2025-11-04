<script setup lang="ts">
import { onMounted, ref } from 'vue'
import articleService, { type Article, ARTICLE_IMAGE_BASE } from '@/services/articleService'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const items = ref<Article[]>([])

onMounted(async () => {
  try {
    items.value = await articleService.getArticle()
  } finally {
    loading.value = false
  }
})

function goDetail(slug: string) {
  router.push({ name: 'article-detail', params: { slug } })
}

</script>

<template>
  <section class="container mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Artikel</h1>

    <div v-if="loading" class="text-gray-600 dark:text-gray-300">Memuat...</div>

    <div v-else class="grid md:grid-cols-3 gap-6">
      <article
        v-for="n in items"
        :key="n.id"
        class="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
      >
        <img
          v-if="n.imagePath"
          :src="`${ARTICLE_IMAGE_BASE}${n.imagePath}`"
          class="w-full h-44 object-cover"
        />
        <div class="p-4">
          <h2 class="font-semibold text-lg line-clamp-2 text-gray-900 dark:text-gray-100">{{ n.title }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ n.publishedAt ? new Date(n.publishedAt).toLocaleString() : '-' }}
          </p>
          <button
            class="mt-3 text-blue-600 dark:text-blue-400 hover:underline"
            @click="goDetail(n.slug)"
          >
            Baca selengkapnya
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>



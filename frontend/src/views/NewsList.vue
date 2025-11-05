<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import newsService, { type News, NEWS_IMAGE_BASE } from '@/services/newsService'
import categoryService, { type Category, type SubCategory } from '@/services/categoryService'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const items = ref<News[]>([])
const categories = ref<Category[]>([])
const subCategories = ref<SubCategory[]>([])
const selectedCategoryId = ref<number | null>(null)
const selectedSubCategoryId = ref<number | null>(null)
const viewMode = ref<'all' | 'grouped'>('all')

// ✅ Fetch categories dengan filter type='news'
const fetchCategories = async () => {
  try {
    categories.value = await categoryService.getCategories('news')
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// ✅ Fetch subcategories dengan filter type='news'
const fetchSubCategories = async (categoryId?: number) => {
  try {
    subCategories.value = await categoryService.getSubCategories(categoryId, 'news')
  } catch (error) {
    console.error('Error fetching subcategories:', error)
  }
}

// Fetch news
const fetchNews = async () => {
  try {
    loading.value = true
    items.value = await newsService.getNews()
  } catch (error) {
    console.error('Error fetching news:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  const [news, cats, subs] = await Promise.all([
    newsService.getNews(),
    categoryService.getCategories('news'),
    categoryService.getSubCategories(undefined, 'news')
  ])
  items.value = news
  categories.value = cats
  subCategories.value = subs
  loading.value = false
})

// Watch category selection
const onCategoryChange = (categoryId: number | null) => {
  selectedCategoryId.value = categoryId
  selectedSubCategoryId.value = null
  if (categoryId) {
    fetchSubCategories(categoryId)
  } else {
    fetchSubCategories()
  }
}

// Filtered news based on selected category/subcategory
const filteredNews = computed(() => {
  let filtered = items.value

  if (selectedCategoryId.value) {
    filtered = filtered.filter(n => n.categoryId === selectedCategoryId.value)
  }

  if (selectedSubCategoryId.value) {
    filtered = filtered.filter(n => n.subCategoryId === selectedSubCategoryId.value)
  }

  return filtered.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt).getTime()
    const dateB = new Date(b.publishedAt || b.createdAt).getTime()
    return dateB - dateA
  })
})

// Grouped news by category
const groupedNews = computed(() => {
  const grouped: Record<string, { category: Category | null; subCategories: Record<string, { subCategory: SubCategory | null; news: News[] }> }> = {}
  
  items.value.forEach(news => {
    const categoryId = news.categoryId || 'no-category'
    const subCategoryId = news.subCategoryId || 'no-subcategory'
    
    if (!grouped[categoryId]) {
      const category = categories.value.find(c => c.id === news.categoryId) || null
      grouped[categoryId] = {
        category,
        subCategories: {}
      }
    }
    
    if (!grouped[categoryId].subCategories[subCategoryId]) {
      const subCategory = subCategories.value.find(sc => sc.id === news.subCategoryId) || null
      grouped[categoryId].subCategories[subCategoryId] = {
        subCategory,
        news: []
      }
    }
    
    grouped[categoryId].subCategories[subCategoryId].news.push(news)
  })

  // Sort news within each group
  Object.keys(grouped).forEach(categoryId => {
    Object.keys(grouped[categoryId].subCategories).forEach(subCategoryId => {
      grouped[categoryId].subCategories[subCategoryId].news.sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt).getTime()
        const dateB = new Date(b.publishedAt || b.createdAt).getTime()
        return dateB - dateA
      })
    })
  })

  return grouped
})

function goDetail(slug: string) {
  router.push({ name: 'news-detail', params: { slug } })
}

function clearFilter() {
  selectedCategoryId.value = null
  selectedSubCategoryId.value = null
  fetchSubCategories()
}
</script>

<template>
  <section class="container mx-auto px-4 py-10">
    <!-- Header Section (Outside Container) -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Berita</h1>
      <p class="text-gray-600 dark:text-gray-400">Temukan berita terbaru berdasarkan kategori dan sub-kategori</p>
    </div>
    <!-- Filter & News List Container -->
    <div class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Filter Section -->
      <div class="p-6 md:p-8">
        <!-- Header with View Mode Toggle -->
        <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter & Kelola Berita
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">Pilih kategori atau sub-kategori untuk menyaring berita</p>
        </div>
        <div class="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
          <button
            @click="viewMode = 'all'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2',
              viewMode === 'all'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Semua
          </button>
          <button
            @click="viewMode = 'grouped'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2',
              viewMode === 'grouped'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Kelompokkan
          </button>
        </div>
      </div>

      <!-- Quick Filter Categories (Pills) -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Pilih Kategori
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            @click="onCategoryChange(null)"
            :class="[
              'px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2',
              !selectedCategoryId
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Semua Kategori
            <span class="ml-1 px-2 py-0.5 rounded-full bg-white/20 dark:bg-gray-800/30 text-xs">
              {{ items.length }}
            </span>
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="onCategoryChange(cat.id)"
            :class="[
              'px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2',
              selectedCategoryId === cat.id
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {{ cat.name }}
            <span class="ml-1 px-2 py-0.5 rounded-full bg-white/20 dark:bg-gray-800/30 text-xs">
              {{ cat._count?.news || 0 }}
            </span>
          </button>
        </div>
      </div>

      <!-- Sub-Category Filter -->
      <div v-if="selectedCategoryId || subCategories.length > 0" class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Pilih Sub-Kategori
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectedSubCategoryId = null"
            :class="[
              'px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2',
              !selectedSubCategoryId
                ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            Semua Sub-Kategori
          </button>
          <button
            v-for="subCat in subCategories.filter(sc => !selectedCategoryId || sc.categoryId === selectedCategoryId)"
            :key="subCat.id"
            @click="selectedSubCategoryId = subCat.id"
            :class="[
              'px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2',
              selectedSubCategoryId === subCat.id
                ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            {{ subCat.name }}
            <span class="ml-1 px-2 py-0.5 rounded-full bg-white/20 dark:bg-gray-800/30 text-xs">
              {{ subCat._count?.news || 0 }}
            </span>
          </button>
        </div>
      </div>

      <!-- Active Filters with Stats -->
      <div v-if="selectedCategoryId || selectedSubCategoryId" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Filter Aktif:
          </span>
          <div class="flex flex-wrap gap-2">
            <span
              v-if="selectedCategoryId"
              class="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg transition-all group"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {{ categories.find(c => c.id === selectedCategoryId)?.name }}
              <button @click="onCategoryChange(null)" class="ml-2 hover:rotate-90 transition-transform">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
            <span
              v-if="selectedSubCategoryId"
              class="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md hover:shadow-lg transition-all group"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              {{ subCategories.find(sc => sc.id === selectedSubCategoryId)?.name }}
              <button @click="selectedSubCategoryId = null" class="ml-2 hover:rotate-90 transition-transform">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>
          <button
            @click="clearFilter"
            class="ml-auto px-4 py-2 rounded-xl font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset
          </button>
        </div>
        <!-- Result Count -->
        <div class="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Menampilkan <span class="font-semibold text-blue-600 dark:text-blue-400">{{ filteredNews.length }}</span> dari <span class="font-semibold">{{ items.length }}</span> berita
        </div>
      </div>
      </div>

      <!-- News List Section -->
      <div class="p-6 md:p-8">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Memuat berita...</p>
        </div>

        <!-- Grouped View -->
        <div v-else-if="viewMode === 'grouped'">
          <div v-if="Object.keys(groupedNews).length === 0" class="text-center py-20 text-gray-500 dark:text-gray-400">
            Belum ada berita yang dikelompokkan
          </div>

          <div v-for="(group, categoryId) in groupedNews" :key="categoryId" class="mb-12">
            <!-- Category Header -->
            <div class="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span
                  class="inline-flex items-center px-4 py-2 rounded-lg text-lg font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {{ group.category?.name || 'Tanpa Kategori' }}
                </span>
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({{ Object.values(group.subCategories).reduce((sum, sub) => sum + sub.news.length, 0) }} berita)
                </span>
              </h2>
            </div>

            <!-- Sub-Categories -->
            <div v-for="(subGroup, subCategoryId) in group.subCategories" :key="subCategoryId" class="mb-8">
              <h3
                v-if="subGroup.subCategory"
                class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"
              >
                <span
                  class="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                >
                  {{ subGroup.subCategory.name }}
                </span>
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({{ subGroup.news.length }} berita)
                </span>
              </h3>

              <!-- News Grid -->
              <div class="grid md:grid-cols-3 gap-6">
                <article
                  v-for="n in subGroup.news"
                  :key="n.id"
                  class="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  @click="goDetail(n.slug)"
                >
                  <img
                    v-if="n.imagePath"
                    :src="`${NEWS_IMAGE_BASE}${n.imagePath}`"
                    class="w-full h-44 object-cover"
                  />
                  <div class="p-4">
                    <h2 class="font-semibold text-lg line-clamp-2 text-gray-900 dark:text-gray-100 mb-2">
                      {{ n.title }}
                    </h2>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      {{ n.publishedAt ? new Date(n.publishedAt).toLocaleString() : '-' }}
                    </p>
                    <button
                      class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                      @click.stop="goDetail(n.slug)"
                    >
                      Baca selengkapnya →
                    </button>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>

        <!-- All News View -->
        <div v-else>
          <div v-if="filteredNews.length === 0" class="text-center py-20 text-gray-500 dark:text-gray-400">
            <p class="text-lg mb-2">Tidak ada berita ditemukan</p>
            <button
              @click="clearFilter"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Filter
            </button>
          </div>

          <div v-else class="grid md:grid-cols-3 gap-6">
            <article
              v-for="n in filteredNews"
              :key="n.id"
              class="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              @click="goDetail(n.slug)"
            >
              <img
                v-if="n.imagePath"
                :src="`${NEWS_IMAGE_BASE}${n.imagePath}`"
                class="w-full h-44 object-cover"
              />
              <div class="p-4">
                <!-- Category & Sub-Category Tags -->
                <div v-if="n.category || n.subCategory" class="flex flex-wrap gap-2 mb-3">
                  <span
                    v-if="n.category"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                  >
                    {{ n.category.name }}
                  </span>
                  <span
                    v-if="n.subCategory"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                  >
                    {{ n.subCategory.name }}
                  </span>
                </div>
                <h2 class="font-semibold text-lg line-clamp-2 text-gray-900 dark:text-gray-100">{{ n.title }}</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ n.publishedAt ? new Date(n.publishedAt).toLocaleString() : '-' }}
                </p>
                <button
                  class="mt-3 text-blue-600 dark:text-blue-400 hover:underline"
                  @click.stop="goDetail(n.slug)"
                >
                  Baca selengkapnya →
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
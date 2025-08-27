<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">
          Galeri
        </h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Galeri visual dari proyek-proyek dan aktivitas perusahaan kami.
        </p>
      </div>
    </section>

    <!-- Gallery Grid -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-6">
        <div v-if="loading" class="text-center py-12">
          <div class="text-gray-600">Memuat galeri...</div>
        </div>
        
        <div v-else-if="gallery.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div 
            v-for="(item, index) in gallery" 
            :key="item.id"
            class="overflow-hidden rounded-lg hover:shadow-lg transition-all duration-500 transform hover:scale-105 group cursor-pointer"
            :data-aos="'zoom-in'"
            :data-aos-delay="(index + 1) * 50"
            @click="showImageDetail(item)"
          >
            <img 
              v-if="item.imagePath"
              :src="`http://localhost:3000${item.imagePath}`" 
              :alt="item.title"
              class="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div v-else class="w-full h-32 bg-gray-200 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
              <svg class="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600">Tidak ada galeri yang tersedia saat ini.</div>
        </div>
      </div>
    </section>

    <!-- Image Detail Modal -->
    <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" data-aos="fade-in">
      <div class="relative max-w-4xl w-full">
        <button 
          @click="selectedImage = null"
          class="absolute top-4 right-4 text-white hover:text-gray-300 z-10 transition-colors"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="bg-white rounded-lg overflow-hidden">
          <img 
            :src="`http://localhost:3000${selectedImage.imagePath}`" 
            :alt="selectedImage.title"
            class="w-full h-auto max-h-[80vh] object-contain"
          />
          <div v-if="selectedImage.title" class="p-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ selectedImage.title }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <section class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4" data-aos="fade-up">
          Siap Bekerja Sama dengan Kami?
        </h2>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Mari kita diskusikan bagaimana kami dapat membantu mewujudkan visi teknologi Anda.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
          <router-link 
            to="/contact" 
            class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Hubungi Kami
          </router-link>
          <router-link 
            to="/projects" 
            class="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Lihat Proyek
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import companyService, { Gallery } from '@/services/companyService'

const gallery = ref<Gallery[]>([])
const selectedImage = ref<Gallery | null>(null)
const loading = ref(true)

const fetchGallery = async () => {
  try {
    const data = await companyService.getGallery()
    gallery.value = data
  } catch (error) {
    console.error('Error fetching gallery:', error)
  } finally {
    loading.value = false
  }
}

const showImageDetail = (item: Gallery) => {
  selectedImage.value = item
}

onMounted(() => {
  fetchGallery()
})
</script>

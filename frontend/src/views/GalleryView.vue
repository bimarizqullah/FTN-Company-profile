<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-700 to-blue-900 dark:from-blue-800 dark:to-blue-950 text-white py-20 relative overflow-hidden">
      <!-- Polygon Tech Hero -->
      <TechAnimations variant="polygon" density="high" />
      
      <div class="max-w-4xl mx-auto px-6 text-center relative z-20">
        <h1 class="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">
          Galeri
        </h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Galeri visual dari proyek-proyek dan aktivitas perusahaan kami.
        </p>
      </div>
    </section>

    <!-- Gallery Grid -->
    <section class="py-16 relative overflow-hidden">
      <!-- Dots Pattern for Gallery -->
      <TechAnimations variant="dots" density="medium" />
      
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div v-if="loading" class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Memuat galeri...</div>
        </div>
        
        <div v-else-if="activeGallery.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div 
            v-for="(item, index) in activeGallery" 
            :key="item.id"
            class="group cursor-pointer"
            :data-aos="'fade-up'"
            :data-aos-delay="(index + 1) * 100"
            @click="showImageDetail(item)"
          >
            <!-- Fixed Size Artistic Gallery Card -->
            <div class="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 group-hover:rotate-1">
              
              <!-- Fixed Image Container -->
              <div class="relative overflow-hidden aspect-square">
                <img 
                  v-if="item.imagePath"
                  :src="`http://localhost:3000${item.imagePath}`" 
                  :alt="item.description || 'Gallery Image'"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-blue-100 flex items-center justify-center">
                  <div class="text-center">
                    <svg class="w-16 h-16 text-gray-400 group-hover:text-blue-600 transition-colors duration-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-gray-500 dark:text-gray-400 text-sm font-medium">Gambar</span>
                  </div>
                </div>
                
                <!-- Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                
                <!-- Floating Action -->
                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <div class="bg-white/95 backdrop-blur-sm text-gray-700 dark:text-gray-300 p-3 rounded-full shadow-xl hover:bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-300 hover:scale-110">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <!-- Expand Icon -->
                <div class="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-500 delay-200">
                  <div class="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                </div>
              </div>

                <!-- Description Overlay Bottom -->
                <div v-if="item.description" class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-200">
                  <p class="text-sm font-medium leading-tight line-clamp-2 drop-shadow-lg">
                    {{ item.description }}
                  </p>
                  
                  <!-- Quick Action -->
                  <div class="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-400">
                    <div class="flex items-center space-x-2">
                      <div class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                      <span class="text-xs text-blue-200 font-medium">Galeri</span>
                    </div>
                    <span class="text-xs text-white/80">Klik untuk melihat</span>
                  </div>
                </div>

              <!-- Artistic Elements -->
              <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-400"></div>
              <div class="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-400"></div>
              
              <!-- Shimmer Effect -->
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out delay-200"></div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Tidak ada galeri yang tersedia saat ini.</div>
        </div>
      </div>
    </section>

    <!-- Simple Image Modal with Overlay Description -->
    <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50" data-aos="fade-in">
      <div class="relative max-w-6xl w-full h-full flex items-center justify-center">
        <!-- Close Button -->
        <button 
          @click="selectedImage = null"
          class="absolute top-6 right-6 z-20 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 p-3 rounded-full transition-all duration-300 hover:scale-110"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Image Container with Overlay Description -->
        <div class="relative max-w-5xl w-full">
          <img 
            :src="`http://localhost:3000${selectedImage.imagePath}`" 
            :alt="selectedImage.description || 'Gallery Image'"
            class="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
          
          <!-- Description Overlay with Bottom Gradient -->
          <div v-if="selectedImage.description" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent rounded-b-2xl p-6">
            <div class="text-white">
              <p class="text-lg leading-relaxed font-medium drop-shadow-lg">
                {{ selectedImage.description }}
              </p>
              
              <!-- Optional: Small meta info -->
              <div class="flex items-center justify-between mt-4 text-sm text-white/80">
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Galeri</span>
                </div>
                <span>{{ new Date(selectedImage.createdAt).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                }) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <section class="py-16 bg-blue-600 dark:bg-blue-900 text-white">
      <div class="max-w-4xl mx-auto px-6 text-center relative z-20">
        <h2 class="text-3xl font-bold mb-4" data-aos="fade-up">
          Siap Bekerja Sama dengan Kami?
        </h2>
        <p class="text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Mari kita diskusikan bagaimana kami dapat membantu mewujudkan visi teknologi Anda.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
          <router-link 
            to="/contact" 
            class="inline-block bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Hubungi Kami
          </router-link>
          <router-link 
            to="/projects" 
            class="inline-block border-2 border-white dark:border-gray-300 text-white dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Lihat Proyek
          </router-link>
        </div>
      </div>
    </section>

    <!-- Scroll to Top Button -->
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import companyService, { Gallery } from '@/services/companyService'
import TechAnimations from '@/components/TechAnimations.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'

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

// Computed property untuk filter gallery yang aktif
const activeGallery = computed(() => {
  return gallery.value.filter(item => item.status === 'active')
})

const showImageDetail = (item: Gallery) => {
  selectedImage.value = item
}



onMounted(() => {
  fetchGallery()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Ensure consistent aspect ratio for all gallery items */
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>

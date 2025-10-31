<template>
  <section class="section-padding">
    <div class="container-gsap">
      <div class="text-center mb-20">
        <h2 class="text-4xl md:text-6xl font-bold mb-6 gradient-text" data-aos="fade-up">
          Galeri Proyek
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Dokumentasi visual dari proyek-proyek dan aktivitas kami.
        </p>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Memuat galeri...</p>
      </div>
      
      <div v-else-if="gallery.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="(item, index) in gallery.slice(0, 8)" 
          :key="item.id"
          class="group cursor-pointer magnetic"
          :data-aos="'zoom-in'"
          :data-aos-delay="(index + 1) * 100"
          @click="$router.push('/gallery')"
        >
          <div class="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 gsap-card">
            <template v-if="item.images && item.images.length > 0">
              <!-- Always show the first image in the gallery -->
              <video
                v-if="isVideo(item.images[0].imagePath)"
                :src="`${UPLOAD_BASE_URL}${item.images[0].imagePath}`"
                class="w-full h-64 object-cover"
                muted
                loop
                preload="metadata"
                playsinline
                @mouseenter="(e) => (e.target as HTMLVideoElement).play()"
                @mouseleave="(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0 }"
              />
              <img
                v-else
                :src="`${UPLOAD_BASE_URL}${item.images[0].imagePath}`" 
                :alt="item.title || `Galeri ${item.id}`"
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <!-- Badge for multiple images -->
              <div v-if="item.images.length > 1" class="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <span class="text-white text-sm font-medium">+{{ item.images.length - 1 }}</span>
              </div>
            </template>
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div class="p-6 text-white">
                <h3 class="text-lg font-bold mb-2">{{ item.title || `Galeri ${item.id}` }}</h3>
                <p v-if="item.description" class="text-sm text-gray-200">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-center mt-12">
        <router-link 
          to="/gallery" 
          class="btn-gsap magnetic"
        >
          Lihat Semua Galeri
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { type Gallery } from '@/services/companyService'
import { UPLOAD_BASE_URL } from '@/services/api'

interface Props {
  gallery: Gallery[]
  loading: boolean
}

defineProps<Props>()

function isVideo(path: string): boolean {
  const lower = (path || '').toLowerCase()
  return ['.mp4', '.webm', '.ogg', '.mov', '.mkv'].some(ext => lower.endsWith(ext))
}
</script>




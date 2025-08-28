<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 relative overflow-hidden">
      <!-- Floating Dots Hero -->
      <TechAnimations variant="dots" density="high" />
      
      <div class="max-w-4xl mx-auto px-6 text-center relative z-20">
        <h1 class="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">
          Layanan Kami
        </h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Solusi lengkap untuk kebutuhan teknologi dan infrastruktur jaringan Anda.
        </p>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="py-16 relative overflow-hidden">
      <!-- Mixed Elements for Services -->
      <TechAnimations variant="mixed" density="medium" />
      
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div v-if="loading" class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Memuat layanan...</div>
        </div>
        
        <div v-else-if="services.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(service, index) in services" 
            :key="service.id"
            :id="service.id"
            class="group cursor-pointer"
            :data-aos="'fade-up'"
            :data-aos-delay="(index + 1) * 100"
            @click="showServiceDetail(service)"
          >
            <!-- Card Container -->
            <div class="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-[1.02]">
              
              <!-- Image Section -->
              <div class="relative overflow-hidden">
                <div class="aspect-w-16 aspect-h-10">
                  <img 
                    v-if="service.imagePath"
                    :src="`http://localhost:3000${service.imagePath}`" 
                    :alt="service.name"
                    class="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div v-else class="w-full h-52 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-700">
                    <div class="text-center">
                      <svg class="w-16 h-16 text-blue-400 group-hover:text-blue-600 transition-colors duration-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="text-blue-500 text-sm font-medium">Layanan</span>
                    </div>
                  </div>
                </div>
                
                <!-- Overlay Gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <!-- Floating Detail Button -->
                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  <div class="bg-white/90 backdrop-blur-sm text-blue-600 p-2 rounded-full shadow-lg hover:bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Content Section -->
              <div class="p-6">
                <div class="space-y-3">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300 line-height-tight">
                    {{ service.name }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {{ service.description }}
                  </p>
                </div>
                
                <!-- Action Area -->
                <div class="mt-6 flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">Tersedia</span>
                  </div>
                  
                  <div class="flex items-center text-blue-600 group-hover:text-blue-700 font-medium text-sm group-hover:translate-x-1 transition-all duration-300">
                    <span>Lihat Detail</span>
                    <svg class="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Bottom Accent -->
              <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Tidak ada layanan yang tersedia saat ini.</div>
        </div>
      </div>
    </section>

    <!-- Service Detail Modal -->
    <div v-if="selectedService" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-aos="fade-in">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">{{ selectedService.name }}</h2>
            <button 
              @click="selectedService = null"
              class="text-gray-400 hover:text-gray-600 dark:text-gray-300 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div v-if="selectedService.imagePath" class="mb-6">
            <img 
              :src="`http://localhost:3000${selectedService.imagePath}`" 
              :alt="selectedService.name"
              class="w-full h-64 object-cover rounded-lg"
            />
          </div>
          
          <div class="prose max-w-none">
            <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              {{ selectedService.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import companyService, { Service } from '@/services/companyService'
import TechAnimations from '@/components/TechAnimations.vue'

const services = ref<Service[]>([])
const selectedService = ref<Service | null>(null)
const loading = ref(true)

const fetchServices = async () => {
  try {
    const data = await companyService.getServices()
    services.value = data
  } catch (error) {
    console.error('Error fetching services:', error)
  } finally {
    loading.value = false
  }
}



const showServiceDetail = (service: Service) => {
  selectedService.value = service
}

onMounted(() => {
  fetchServices()
})
</script>

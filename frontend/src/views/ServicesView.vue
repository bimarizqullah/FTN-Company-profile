<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">
          Layanan Kami
        </h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Solusi lengkap untuk kebutuhan teknologi dan infrastruktur jaringan Anda.
        </p>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-6">
        <div v-if="loading" class="text-center py-12">
          <div class="text-gray-600">Memuat layanan...</div>
        </div>
        
        <div v-else-if="services.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(service, index) in services" 
            :key="service.id"
            :id="service.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 p-6 group"
            :data-aos="'fade-up'"
            :data-aos-delay="(index + 1) * 100"
          >
            <div class="mb-4 overflow-hidden rounded-lg">
              <img 
                v-if="service.imagePath"
                :src="`http://localhost:3000${service.imagePath}`" 
                :alt="service.name"
                class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div v-else class="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
                <svg class="w-12 h-12 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">{{ service.name }}</h3>
            <p class="text-gray-600 text-sm mb-4">{{ service.description }}</p>
            <div class="flex justify-between items-center">
              <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                Aktif
              </span>
              <button 
                @click="showServiceDetail(service)"
                class="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center group-hover:scale-105 transition-all duration-300"
              >
                Detail
                <svg class="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600">Tidak ada layanan yang tersedia saat ini.</div>
        </div>
      </div>
    </section>

    <!-- Service Detail Modal -->
    <div v-if="selectedService" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-aos="fade-in">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-bold text-gray-900">{{ selectedService.name }}</h2>
            <button 
              @click="selectedService = null"
              class="text-gray-400 hover:text-gray-600 transition-colors"
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
            <p class="text-gray-600 text-lg leading-relaxed">
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

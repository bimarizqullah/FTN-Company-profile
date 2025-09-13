<template>
  <section class="section-padding">
    <div class="container-gsap">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-5xl font-bold mb-4 text-gray-900" data-aos="fade-up">
          Layanan Kami
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Solusi lengkap untuk kebutuhan teknologi dan infrastruktur jaringan Anda.
        </p>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Memuat layanan...</p>
      </div>
      
      <div v-else-if="services.length > 0" class="gsap-grid">
        <div 
          v-for="(service, index) in services.slice(0, 6)" 
          :key="service.id"
          class="gsap-card overflow-hidden"
          :data-aos="'fade-up'"
          :data-aos-delay="(index + 1) * 100"
        >
          <div class="image-container h-48">
            <img 
              v-if="service.imagePath"
              :src="`${UPLOAD_BASE_URL}${service.imagePath}`" 
              :alt="service.name"
            />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ service.name }}</h3>
            <p class="text-gray-600 mb-4">{{ service.description }}</p>
            <router-link 
              :to="`/services#${service.id}`" 
              class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Pelajari Lebih Lanjut
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="text-center mt-12">
        <router-link 
          to="/services" 
          class="btn-gsap"
        >
          Lihat Semua Layanan
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { type Service } from '@/services/companyService'
import { UPLOAD_BASE_URL } from '@/services/api'

interface Props {
  services: Service[]
  loading: boolean
}

defineProps<Props>()
</script>

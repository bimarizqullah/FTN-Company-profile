<template>
  <section class="section-padding bg-gradient-to-br from-blue-50 to-white">
    <div class="container-gsap">
      <div class="text-center mb-20">
        <h2 class="text-4xl md:text-6xl font-bold mb-6 gradient-text" data-aos="fade-up">
          Tim Manajemen
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Kenali tim kepemimpinan yang membawa Fiber Teknologi Nusantara menuju kesuksesan.
        </p>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Memuat tim manajemen...</p>
      </div>
      
      <div v-else-if="management.length > 0" class="gsap-grid">
        <div 
          v-for="(member, index) in management.slice(0, 4)" 
          :key="member.id"
          class="gsap-card overflow-hidden group text-center magnetic"
          :data-aos="'fade-up'"
          :data-aos-delay="(index + 1) * 150"
        >
          <div class="h-64 bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
            <img 
              v-if="member.imagePath"
              :src="`http://localhost:3000${member.imagePath}`" 
              :alt="member.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ member.name }}</h3>
            <p class="text-blue-600 font-semibold text-sm">{{ member.position }}</p>
          </div>
        </div>
      </div>
      
      <div class="text-center mt-12">
        <router-link 
          to="/management" 
          class="btn-gsap magnetic"
        >
          Lihat Semua Tim
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { type Management } from '@/services/companyService'

interface Props {
  management: Management[]
  loading: boolean
}

defineProps<Props>()
</script>




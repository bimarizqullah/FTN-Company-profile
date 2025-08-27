<template>
  <section class="section-padding bg-white">
    <div class="container-gsap">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-5xl font-bold mb-4 text-gray-900" data-aos="fade-up">
          Proyek Terbaru
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Dokumentasi lengkap dari proyek-proyek infrastruktur teknologi yang telah kami kerjakan.
        </p>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Memuat proyek...</p>
      </div>
      
      <div v-else-if="projects.length > 0" class="gsap-grid">
        <div 
          v-for="(project, index) in projects.slice(0, 3)" 
          :key="project.id"
          class="gsap-card overflow-hidden cursor-pointer group"
          :data-aos="'fade-up'"
          :data-aos-delay="(index + 1) * 200"
          @click="$router.push('/projects')"
        >
          <!-- Project Image -->
          <div class="image-container h-48">
            <img 
              :src="`http://localhost:3000${project.imagePath}`" 
              :alt="project.name"
            />
          </div>

          <!-- Project Info -->
          <div class="p-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-xl font-bold text-gray-900">{{ project.name }}</h3>
              <span 
                :class="getProjectStatusClass(project.status)"
                class="px-3 py-1 rounded-full text-xs font-medium"
              >
                {{ getProjectStatusText(project.status) }}
              </span>
            </div>
            
            <div class="flex items-center text-gray-600 mb-3">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-sm">{{ project.location }}</span>
            </div>

            <p class="text-gray-600 text-sm line-clamp-3">{{ project.description }}</p>
          </div>
        </div>
      </div>
      
      <div class="text-center mt-12">
        <router-link 
          to="/projects" 
          class="btn-gsap"
        >
          Lihat Semua Proyek
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Project } from '@/services/companyService'

interface Props {
  projects: Project[]
  loading: boolean
}

defineProps<Props>()

const getProjectStatusClass = (status: string) => {
  switch (status) {
    case 'ongoing':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'terminated':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getProjectStatusText = (status: string) => {
  switch (status) {
    case 'ongoing':
      return 'Sedang Berjalan'
    case 'pending':
      return 'Pending'
    case 'terminated':
      return 'Selesai'
    default:
      return 'Unknown'
  }
}
</script>

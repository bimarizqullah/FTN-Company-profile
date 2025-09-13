<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-20 relative overflow-hidden">
      <!-- Polygon Hero Pattern -->
      <TechAnimations variant="polygon" density="high" />
      
      <div class="max-w-4xl mx-auto px-6 text-center relative z-20">
        <h1 class="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">
          Proyek Kami
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Portfolio proyek-proyek terbaik yang telah kami selesaikan dengan sukses.
        </p>
      </div>
    </section>

    <!-- Projects Grid -->
    <section class="py-16 relative overflow-hidden">
      <!-- Mixed Dots for Projects -->
      <TechAnimations variant="mixed" density="medium" />
      
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div v-if="loading" class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Memuat proyek...</div>
        </div>
        
        <div v-else-if="projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(project, index) in projects" 
            :key="project.id"
            class="group cursor-pointer"
            :data-aos="'fade-up'"
            :data-aos-delay="(index + 1) * 100"
            @click="showProjectDetail(project)"
          >
            <!-- Informative Project Card -->
            <div class="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-[1.02]">
              
              <!-- Status Badge - Top Right -->
              <div class="absolute top-4 right-4 z-10">
                <span :class="getStatusBadgeClass(project.status)" class="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                  {{ getStatusText(project.status) }}
                </span>
              </div>
              
              <!-- Image Section -->
              <div class="relative overflow-hidden">
                <div class="aspect-w-16 aspect-h-10">
                  <img 
                    v-if="project.imagePath"
                    :src="`${UPLOAD_BASE_URL}${project.imagePath}`" 
                    :alt="project.name"
                    class="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div v-else class="w-full h-52 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-100 flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-200 transition-all duration-700">
                    <div class="text-center">
                      <svg class="w-16 h-16 text-gray-400 group-hover:text-blue-600 transition-colors duration-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span class="text-gray-500 dark:text-gray-400 text-sm font-medium">Proyek</span>
                    </div>
                  </div>
                </div>
                
                <!-- Overlay on Hover -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <!-- Progress Indicator for Ongoing Projects -->
                <div v-if="project.status === 'ongoing'" class="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <div class="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">Progress</span>
                      <span class="text-xs font-bold text-blue-600">Berlangsung</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                      <div class="bg-blue-600 h-1.5 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content Section -->
              <div class="p-6">
                <div class="space-y-4">
                  <!-- Project Title -->
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                    {{ project.name }}
                  </h3>
                  
                  <!-- Location with Icon -->
                  <div class="flex items-center text-gray-600 dark:text-gray-300 dark:text-gray-300">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="text-sm font-medium">{{ project.location }}</span>
                  </div>
                  
                  <!-- Description -->
                  <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {{ project.description }}
                  </p>
                </div>
                
                <!-- Footer Information -->
                <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 dark:border-gray-700">
                  <div class="flex items-center justify-between">
                    <!-- Project Timeline -->
                    <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{{ new Date(project.createdAt).toLocaleDateString('id-ID', { 
                        year: 'numeric', 
                        month: 'short' 
                      }) }}</span>
                    </div>
                    
                    <!-- View Details Arrow -->
                    <div class="flex items-center text-blue-600 group-hover:text-blue-700 font-medium text-sm group-hover:translate-x-1 transition-all duration-300">
                      <span>Detail</span>
                      <svg class="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Subtle Bottom Accent -->
              <div class="absolute bottom-0 left-0 right-0 h-1">
                <div :class="getStatusAccentClass(project.status)" class="h-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Tidak ada proyek yang tersedia saat ini.</div>
        </div>
      </div>
    </section>

    <!-- Project Stats -->
    <section class="py-16 bg-white dark:bg-gray-800 dark:bg-gray-800">
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Statistik Proyek</h2>
          <p class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Beberapa angka yang menunjukkan pencapaian kami</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="group" data-aos="zoom-in" data-aos-delay="200">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">100+</div>
            <div class="text-gray-600 dark:text-gray-300 text-sm">Proyek Selesai</div>
          </div>
          <div class="group" data-aos="zoom-in" data-aos-delay="300">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
            <div class="text-gray-600 dark:text-gray-300 text-sm">Klien Puas</div>
          </div>
          <div class="group" data-aos="zoom-in" data-aos-delay="400">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">5+</div>
            <div class="text-gray-600 dark:text-gray-300 text-sm">Tahun Pengalaman</div>
          </div>
          <div class="group" data-aos="zoom-in" data-aos-delay="500">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
            <div class="text-gray-600 dark:text-gray-300 text-sm">Tingkat Kepuasan</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-blue-600 dark:bg-blue-900 text-white">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-4" data-aos="fade-up">
          Siap Memulai Proyek Anda?
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
            to="/services" 
            class="inline-block border-2 border-white dark:border-gray-300 text-white dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Lihat Layanan
          </router-link>
        </div>
      </div>
    </section>

    <!-- Project Detail Modal -->
    <div v-if="selectedProject" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50" data-aos="fade-in">
      <div class="relative max-w-4xl w-full h-full flex items-center justify-center">
        <!-- Close Button -->
        <button 
          @click="selectedProject = null"
          class="absolute top-6 right-6 z-20 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 p-3 rounded-full transition-all duration-300 hover:scale-110"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Modal Content -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden max-w-3xl w-full max-h-[85vh] overflow-y-auto">
          <!-- Image Header -->
          <div class="relative">
            <img 
              v-if="selectedProject.imagePath"
              :src="`${UPLOAD_BASE_URL}${selectedProject.imagePath}`" 
              :alt="selectedProject.name"
              class="w-full h-64 object-cover"
            />
            <div v-else class="w-full h-64 bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center">
              <svg class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            
            <!-- Status Badge on Image -->
            <div class="absolute top-4 right-4">
              <span :class="getStatusBadgeClass(selectedProject.status)" class="px-4 py-2 rounded-full text-sm font-semibold">
                {{ getStatusText(selectedProject.status) }}
              </span>
            </div>
          </div>
          
          <!-- Content -->
          <div class="p-8">
            <div class="space-y-6">
              <!-- Title -->
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white dark:text-white">{{ selectedProject.name }}</h2>
              
              <!-- Location -->
              <div class="flex items-center text-gray-600 dark:text-gray-300 dark:text-gray-300">
                <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-lg font-medium">{{ selectedProject.location }}</span>
              </div>
              
              <!-- Description -->
              <div class="prose max-w-none">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Deskripsi Proyek</h3>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ selectedProject.description }}
                </p>
              </div>
              
              <!-- Meta Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-600 dark:border-gray-600">
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Status Proyek</h4>
                  <div class="flex items-center space-x-2">
                    <div :class="`w-3 h-3 rounded-full ${selectedProject.status === 'ongoing' ? 'bg-blue-500 animate-pulse' : selectedProject.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}`"></div>
                    <span class="text-gray-700 dark:text-gray-300 dark:text-gray-300">{{ getStatusText(selectedProject.status) }}</span>
                  </div>
                </div>
                
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Tanggal Mulai</h4>
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300 dark:text-gray-300">{{ new Date(selectedProject.createdAt).toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Close Button -->
              <div class="pt-6">
                <button 
                  @click="selectedProject = null"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll to Top Button -->
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import companyService, { type Project } from '@/services/companyService'
import { UPLOAD_BASE_URL } from '@/services/api'
import TechAnimations from '@/components/TechAnimations.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'

const projects = ref<Project[]>([])
const selectedProject = ref<Project | null>(null)
const loading = ref(true)

const fetchProjects = async () => {
  try {
    const data = await companyService.getProjects()
    projects.value = data
  } catch (error) {
    console.error('Error fetching projects:', error)
  } finally {
    loading.value = false
  }
}

// Status helper functions
const getStatusText = (status: string) => {
  const statusMap = {
    'ongoing': 'Berlangsung',
    'pending': 'Tertunda',
    'terminated': 'Selesai'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getStatusBadgeClass = (status: string) => {
  const statusClasses = {
    'ongoing': 'bg-blue-500/90 text-white',
    'pending': 'bg-yellow-500/90 text-white',
    'terminated': 'bg-green-500/90 text-white'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-500/90 text-white'
}

const getStatusAccentClass = (status: string) => {
  const accentClasses = {
    'ongoing': 'bg-gradient-to-r from-blue-500 to-blue-600',
    'pending': 'bg-gradient-to-r from-yellow-500 to-yellow-600', 
    'terminated': 'bg-gradient-to-r from-green-500 to-green-600'
  }
  return accentClasses[status as keyof typeof accentClasses] || 'bg-gradient-to-r from-gray-500 to-gray-600'
}

const showProjectDetail = (project: Project) => {
  selectedProject.value = project
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">
          Proyek Kami
        </h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Portfolio proyek-proyek terbaik yang telah kami selesaikan dengan sukses.
        </p>
      </div>
    </section>

    <!-- Projects Grid -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-6">
        <div v-if="loading" class="text-center py-12">
          <div class="text-gray-600">Memuat proyek...</div>
        </div>
        
        <div v-else-if="projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(project, index) in projects" 
            :key="project.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group"
            :data-aos="'fade-up'"
            :data-aos-delay="(index + 1) * 100"
          >
            <div class="overflow-hidden">
              <img 
                v-if="project.imagePath"
                :src="`http://localhost:3000${project.imagePath}`" 
                :alt="project.name"
                class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
                <svg class="w-12 h-12 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">{{ project.name }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ project.description }}</p>
              <div class="flex justify-between items-center">
                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                  {{ project.category || 'Proyek' }}
                </span>
                <span class="text-gray-500 text-sm">{{ project.year || new Date(project.createdAt).getFullYear() }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600">Tidak ada proyek yang tersedia saat ini.</div>
        </div>
      </div>
    </section>

    <!-- Project Stats -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Statistik Proyek</h2>
          <p class="text-gray-600">Beberapa angka yang menunjukkan pencapaian kami</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="group" data-aos="zoom-in" data-aos-delay="200">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">100+</div>
            <div class="text-gray-600 text-sm">Proyek Selesai</div>
          </div>
          <div class="group" data-aos="zoom-in" data-aos-delay="300">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
            <div class="text-gray-600 text-sm">Klien Puas</div>
          </div>
          <div class="group" data-aos="zoom-in" data-aos-delay="400">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">5+</div>
            <div class="text-gray-600 text-sm">Tahun Pengalaman</div>
          </div>
          <div class="group" data-aos="zoom-in" data-aos-delay="500">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
            <div class="text-gray-600 text-sm">Tingkat Kepuasan</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-blue-600 text-white">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-4" data-aos="fade-up">
          Siap Memulai Proyek Anda?
        </h2>
        <p class="text-blue-100 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Mari kita diskusikan bagaimana kami dapat membantu mewujudkan visi teknologi Anda.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
          <router-link 
            to="/contact" 
            class="inline-block bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Hubungi Kami
          </router-link>
          <router-link 
            to="/services" 
            class="inline-block border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Lihat Layanan
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import companyService, { Project } from '@/services/companyService'

const projects = ref<Project[]>([])
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

onMounted(() => {
  fetchProjects()
})
</script>

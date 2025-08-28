<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 relative overflow-hidden">
      <!-- Polygon Hero for Management -->
      <TechAnimations variant="polygon" density="medium" />
      
      <div class="max-w-4xl mx-auto px-6 text-center relative z-20">
        <h1 class="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">
          Tim Manajemen
        </h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Kenali tim profesional yang membawa visi dan pengalaman untuk kesuksesan perusahaan.
        </p>
      </div>
    </section>

    <!-- Management Team -->
    <section class="py-16 relative overflow-hidden">
      <!-- Minimal Dots for Team -->
      <TechAnimations variant="minimal" density="low" />
      
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div v-if="loading" class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Memuat tim manajemen...</div>
        </div>
        
        <div v-else-if="management.length > 0">
          <!-- Management Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="(member, index) in management" 
              :key="member.id"
              class="group"
              :data-aos="'fade-up'"
              :data-aos-delay="(index + 1) * 100"
            >
              <!-- Member Card -->
              <div class="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 max-w-sm mx-auto">
                  
                  <!-- Status Indicator -->
                  <div class="absolute top-4 right-4 z-10">
                    <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  <!-- Image Section -->
                  <div class="relative overflow-hidden">
                    <div class="aspect-square">
                      <img 
                        v-if="member.imagePath"
                        :src="`http://localhost:3000${member.imagePath}`" 
                        :alt="member.name"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div v-else class="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-700">
                        <div class="text-center">
                          <svg class="w-20 h-20 text-blue-400 group-hover:text-blue-600 transition-colors duration-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span class="text-blue-500 text-sm font-medium">Manajemen</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Gradient Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <!-- Position Badge -->
                    <div class="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      <div class="bg-white/95 backdrop-blur-sm rounded-xl p-3 text-center">
                        <p class="text-blue-600 font-semibold text-sm">{{ member.position }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Content Section -->
                  <div class="p-6 text-center">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300 mb-2">
                      {{ member.name }}
                    </h3>
                    
                    <p class="text-blue-600 font-medium text-sm mb-3">
                      {{ member.position }}
                    </p>
                    
                    <!-- Experience Indicator -->
                    <div class="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2V8" />
                      </svg>
                      <span>Professional Experience</span>
                    </div>
                    

                  </div>

                  <!-- Decorative Elements -->
                  <div class="absolute top-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Tidak ada data tim manajemen yang tersedia saat ini.</div>
        </div>
      </div>
    </section>

    <!-- Company Values -->
    <section class="py-16 bg-white dark:bg-gray-800 dark:bg-gray-800">
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Nilai-Nilai Perusahaan</h2>
          <p class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Nilai-nilai yang menjadi fondasi dalam setiap langkah dan keputusan kami</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="text-center group" data-aos="zoom-in" data-aos-delay="200">
            <div class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors duration-300">Inovasi</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Terus berinovasi untuk memberikan solusi terbaik.
            </p>
          </div>
          
          <div class="text-center group" data-aos="zoom-in" data-aos-delay="300">
            <div class="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors duration-300">Kualitas</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Standar kualitas tertinggi dalam setiap layanan.
            </p>
          </div>
          
          <div class="text-center group" data-aos="zoom-in" data-aos-delay="400">
            <div class="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors duration-300">Integritas</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Kejujuran dan tanggung jawab dalam bisnis.
            </p>
          </div>
          
          <div class="text-center group" data-aos="zoom-in" data-aos-delay="500">
            <div class="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors duration-300">Kepedulian</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Peduli terhadap lingkungan dan masyarakat.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-blue-600 text-white">
      <div class="max-w-4xl mx-auto px-6 text-center relative z-20">
        <h2 class="text-3xl font-bold mb-4" data-aos="fade-up">
          Siap Bekerja Sama dengan Kami?
        </h2>
        <p class="text-blue-100 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Mari kita diskusikan bagaimana kami dapat membantu mewujudkan visi teknologi Anda.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
          <router-link 
            to="/contact" 
            class="inline-block bg-white dark:bg-gray-800 text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Hubungi Kami
          </router-link>
          <router-link 
            to="/about" 
            class="inline-block border-2 border-white text-white hover:bg-white dark:bg-gray-800 hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Pelajari Lebih Lanjut
          </router-link>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import companyService, { Management } from '@/services/companyService'
import TechAnimations from '@/components/TechAnimations.vue'

const management = ref<Management[]>([])
const loading = ref(true)

const fetchManagement = async () => {
  try {
    const data = await companyService.getManagement()
    // Tampilkan semua data management untuk sementara (tanpa filter status)
    management.value = data
    console.log('Management data loaded:', management.value.length, 'members')
  } catch (error) {
    console.error('Error fetching management:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchManagement()
})
</script>

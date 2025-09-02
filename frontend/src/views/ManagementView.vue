<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-20 relative overflow-hidden">
      <!-- Polygon Hero for Management -->
      <TechAnimations variant="polygon" density="medium" />
      
      <div class="max-w-4xl mx-auto px-6 text-center relative z-20">
        <h1 class="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">
          Tim Manajemen
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
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
          <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm group hover:shadow-lg transition-all duration-300" data-aos="zoom-in" data-aos-delay="200">
            <div class="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors duration-300">Profesional</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
              Sebagai perusahaan yang berorientasi pada keunggulan, kami menjunjung tinggi nilai-nilai profesionalisme, transparansi, dan kepatuhan terhadap regulasi dalam setiap aspek bisnis. Melalui kolaborasi dengan pemerintah daerah, operator telekomunikasi, dan pemangku kepentingan lainnya, kami berperan aktif dalam mendukung transformasi digital kota menuju Smart City serta penataan estetika perkotaan.
            </p>
          </div>
          
          <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm group hover:shadow-lg transition-all duration-300" data-aos="zoom-in" data-aos-delay="300">
            <div class="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 transition-colors duration-300">Terpercaya</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
              PT Fiber Teknologi Nusantara terus berupaya menjadi perusahaan yang terpercaya dalam penyediaan infrastruktur pasif telekomunikasi. Dengan komitmen terhadap standarisasi dan kualitas, kami menghadirkan solusi infrastruktur digital yang andal dan berkelanjutan.
            </p>
          </div>
          
          <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm group hover:shadow-lg transition-all duration-300" data-aos="zoom-in" data-aos-delay="400">
            <div class="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 transition-colors duration-300">Terbaik</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
              PT Fiber Teknologi Nusantara terus berupaya menjadi perusahaan terbaik dalam bidang Penyediaan Infrastruktur Pasif Telekomunikasi. Dengan standarisasi tinggi, teknologi modern, dan tenaga ahli berpengalaman, kami menghadirkan solusi infrastruktur telekomunikasi yang andal, efisien, dan berkelanjutan.
            </p>
          </div>
          
          <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm group hover:shadow-lg transition-all duration-300" data-aos="zoom-in" data-aos-delay="500">
            <div class="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-orange-600 transition-colors duration-300">Terjangkau</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
              PT Fiber Teknologi Nusantara berkomitmen untuk menyediakan infrastruktur pasif telekomunikasi yang berkualitas tinggi dengan harga yang terjangkau. Dengan pengalaman dan teknologi modern, kami menghadirkan solusi infrastruktur yang efisien, andal, dan sesuai standar, sehingga dapat memenuhi kebutuhan operator telekomunikasi, pemerintah daerah, serta berbagai pemangku kepentingan lainnya.
            </p>
          </div>
        </div>
      </div>
    </section>

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
            to="/about" 
            class="inline-block border-2 border-white dark:border-gray-300 text-white dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Pelajari Lebih Lanjut
          </router-link>
        </div>
      </div>
    </section>

    <!-- Scroll to Top Button -->
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import companyService, { Management } from '@/services/companyService'
import TechAnimations from '@/components/TechAnimations.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'

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

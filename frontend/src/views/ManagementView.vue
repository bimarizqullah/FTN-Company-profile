<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">
          Tim Manajemen
        </h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Kenali tim profesional yang membawa visi dan pengalaman untuk kesuksesan perusahaan.
        </p>
      </div>
    </section>

    <!-- Management Team -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-6">
        <div v-if="loading" class="text-center py-12">
          <div class="text-gray-600">Memuat tim manajemen...</div>
        </div>
        
        <div v-else-if="management.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(member, index) in management" 
            :key="member.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group"
            :data-aos="'fade-up'"
            :data-aos-delay="(index + 1) * 100"
          >
            <div class="overflow-hidden">
              <img 
                v-if="member.imagePath"
                :src="`http://localhost:3000${member.imagePath}`" 
                :alt="member.name"
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div v-else class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
                <svg class="w-16 h-16 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{{ member.name }}</h3>
              <p class="text-blue-600 font-medium mb-3">{{ member.position }}</p>
              <p class="text-gray-600 text-sm">{{ member.description }}</p>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600">Tidak ada data tim manajemen yang tersedia saat ini.</div>
        </div>
      </div>
    </section>

    <!-- Company Values -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Nilai-Nilai Perusahaan</h2>
          <p class="text-gray-600">Nilai-nilai yang menjadi fondasi dalam setiap langkah dan keputusan kami</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="text-center group" data-aos="zoom-in" data-aos-delay="200">
            <div class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">Inovasi</h3>
            <p class="text-gray-600 text-sm">
              Terus berinovasi untuk memberikan solusi terbaik.
            </p>
          </div>
          
          <div class="text-center group" data-aos="zoom-in" data-aos-delay="300">
            <div class="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">Kualitas</h3>
            <p class="text-gray-600 text-sm">
              Standar kualitas tertinggi dalam setiap layanan.
            </p>
          </div>
          
          <div class="text-center group" data-aos="zoom-in" data-aos-delay="400">
            <div class="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">Integritas</h3>
            <p class="text-gray-600 text-sm">
              Kejujuran dan tanggung jawab dalam bisnis.
            </p>
          </div>
          
          <div class="text-center group" data-aos="zoom-in" data-aos-delay="500">
            <div class="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">Kepedulian</h3>
            <p class="text-gray-600 text-sm">
              Peduli terhadap lingkungan dan masyarakat.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-blue-600 text-white">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-4" data-aos="fade-up">
          Siap Bekerja Sama dengan Kami?
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
            to="/about" 
            class="inline-block border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
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

const management = ref<Management[]>([])
const loading = ref(true)

const fetchManagement = async () => {
  try {
    const data = await companyService.getManagement()
    management.value = data
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

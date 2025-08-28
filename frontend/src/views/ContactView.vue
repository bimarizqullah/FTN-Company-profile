<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 relative overflow-hidden">
      <!-- Dots Tech Hero -->
      <TechAnimations variant="dots" density="high" />
      
      <div class="max-w-4xl mx-auto px-6 text-center relative z-20">
        <h1 class="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">
          Hubungi Kami
        </h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Mari kita diskusikan bagaimana kami dapat membantu mewujudkan visi teknologi Anda.
        </p>
      </div>
    </section>

    <!-- Contact Form & Info -->
    <section class="py-16 relative overflow-hidden">
      <!-- Minimal Dots for Contact -->
      <TechAnimations variant="minimal" density="low" />
      
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Contact Form -->
          <div data-aos="fade-right" data-aos-delay="200">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Kirim Pesan</h2>
            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="form.name"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="form.email"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nomor Telepon</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="form.phone"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subjek</label>
                <input 
                  type="text" 
                  id="subject" 
                  v-model="form.subject"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pesan</label>
                <textarea 
                  id="message" 
                  v-model="form.message"
                  rows="5"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Kirim Pesan
              </button>
            </form>
          </div>

          <!-- Contact Information -->
          <div data-aos="fade-left" data-aos-delay="400">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Informasi Kontak</h2>
            
            <div class="space-y-6">
              <div class="flex items-start group">
                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors duration-300">Alamat</h3>
                  <p class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Jl. Raya Madiun No. 123<br>Madiun, Jawa Timur 63100</p>
                </div>
              </div>
              
              <div class="flex items-start group">
                <div class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-green-600 transition-colors duration-300">Telepon</h3>
                  <p class="text-gray-600 dark:text-gray-300 dark:text-gray-300">+62 351 123 456<br>+62 351 123 457</p>
                </div>
              </div>
              
              <div class="flex items-start group">
                <div class="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 transition-colors duration-300">Email</h3>
                  <p class="text-gray-600 dark:text-gray-300 dark:text-gray-300">info@fiberteknologi.com<br>support@fiberteknologi.com</p>
                </div>
              </div>
            </div>

            <!-- Social Media -->
            <div class="mt-8">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ikuti Kami</h3>
              <div class="flex space-x-4">
                <a href="#" class="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" class="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" class="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" class="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="py-16 bg-white dark:bg-gray-800 dark:bg-gray-800">
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Lokasi Kami</h2>
          <p class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Kunjungi kantor kami untuk diskusi langsung</p>
        </div>
        
        <div class="bg-gray-200 rounded-lg h-96 flex items-center justify-center" data-aos="zoom-in" data-aos-delay="200">
          <div class="text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Peta akan ditampilkan di sini</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Jl. Raya Madiun No. 123, Madiun, Jawa Timur</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TechAnimations from '@/components/TechAnimations.vue'

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const submitForm = () => {
  // Handle form submission
  alert('Pesan telah dikirim! Kami akan segera menghubungi Anda.')
  
  // Reset form
  form.value = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  }
}
</script>

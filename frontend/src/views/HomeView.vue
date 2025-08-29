<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import companyService, { Slider, Service, Project, Management, Gallery } from '@/services/companyService'
import TechAnimations from '@/components/TechAnimations.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'

// Data refs
const sliders = ref<Slider[]>([])
const services = ref<Service[]>([])
const projects = ref<Project[]>([])
const management = ref<Management[]>([])
const gallery = ref<Gallery[]>([])
const selectedService = ref<Service | null>(null)
const selectedGallery = ref<Gallery | null>(null)
const selectedProject = ref<Project | null>(null)

// Loading states
const loading = ref(true)
const servicesLoading = ref(true)
const projectsLoading = ref(true)
const managementLoading = ref(true)
const galleryLoading = ref(true)

// Slider state
const currentSlideIndex = ref(0)
const isAutoPlaying = ref(true)
const autoSlideInterval = ref<number | null>(null)
const slideDuration = 5000 // 5 seconds

// Slider functions
const nextSlide = () => {
  if (sliders.value.length > 1) {
    currentSlideIndex.value = (currentSlideIndex.value + 1) % sliders.value.length
  }
}

const previousSlide = () => {
  if (sliders.value.length > 1) {
    currentSlideIndex.value = currentSlideIndex.value === 0 
      ? sliders.value.length - 1 
      : currentSlideIndex.value - 1
  }
}

const goToSlide = (index: number) => {
  currentSlideIndex.value = index
}

const toggleAutoSlide = () => {
  isAutoPlaying.value = !isAutoPlaying.value
  if (isAutoPlaying.value) {
    startAutoSlide()
  } else {
    stopAutoSlide()
  }
}

const startAutoSlide = () => {
  if (sliders.value.length > 1) {
    stopAutoSlide() // Clear any existing interval
    autoSlideInterval.value = window.setInterval(() => {
      nextSlide()
    }, slideDuration)
  }
}

const stopAutoSlide = () => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value)
    autoSlideInterval.value = null
  }
}

// Fetch data functions
const fetchSliders = async () => {
  try {
    const data = await companyService.getSliders()
    sliders.value = data.filter(slider => slider.status === 'active')
    console.log('Sliders loaded:', sliders.value)
    
    // Start auto-slide if there are multiple slides
    if (sliders.value.length > 1 && isAutoPlaying.value) {
      startAutoSlide()
    }
  } catch (error) {
    console.error('Error fetching sliders:', error)
  } finally {
    loading.value = false
  }
}

const fetchServices = async () => {
  try {
    const data = await companyService.getServices()
    services.value = data
    console.log('Services loaded:', services.value)
  } catch (error) {
    console.error('Error fetching services:', error)
  } finally {
    servicesLoading.value = false
  }
}



const fetchProjects = async () => {
  try {
    const data = await companyService.getProjects()
    projects.value = data
    console.log('Projects loaded:', projects.value)
  } catch (error) {
    console.error('Error fetching projects:', error)
  } finally {
    projectsLoading.value = false
  }
}

const fetchManagement = async () => {
  try {
    const data = await companyService.getManagement()
    management.value = data
    console.log('Management loaded:', management.value)
  } catch (error) {
    console.error('Error fetching management:', error)
  } finally {
    managementLoading.value = false
  }
}

const fetchGallery = async () => {
  try {
    const data = await companyService.getGallery()
    gallery.value = data
    console.log('Gallery loaded:', gallery.value)
  } catch (error) {
    console.error('Error fetching gallery:', error)
  } finally {
    galleryLoading.value = false
  }
}

// Computed property untuk filter gallery yang aktif
const activeGallery = computed(() => {
  return gallery.value.filter(item => item.status === 'active')
})

const showServiceDetail = (service: Service) => {
  selectedService.value = service
}

const showGalleryDetail = (item: Gallery) => {
  selectedGallery.value = item
}

const showProjectDetail = (project: Project) => {
  selectedProject.value = project
}

const showManagementDetail = (member: Management) => {
  // Could open a simple modal or navigate to management page
  console.log('Management detail for:', member.name)
}

// Project status helper functions
const getProjectStatusText = (status: string) => {
  const statusMap = {
    'ongoing': 'Berlangsung',
    'pending': 'Tertunda', 
    'terminated': 'Selesai'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getProjectStatusBadgeClass = (status: string) => {
  const statusClasses = {
    'ongoing': 'bg-blue-500/90 text-white',
    'pending': 'bg-yellow-500/90 text-white',
    'terminated': 'bg-green-500/90 text-white'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-500/90 text-white'
}

const getProjectStatusAccentClass = (status: string) => {
  const accentClasses = {
    'ongoing': 'bg-gradient-to-r from-blue-500 to-blue-600',
    'pending': 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    'terminated': 'bg-gradient-to-r from-green-500 to-green-600'
  }
  return accentClasses[status as keyof typeof accentClasses] || 'bg-gradient-to-r from-gray-500 to-gray-600'
}

// Initialize data on mount
onMounted(() => {
  fetchSliders()
  fetchServices()
  fetchProjects()
  fetchManagement()
  fetchGallery()
})

// Cleanup on unmount
onUnmounted(() => {
  stopAutoSlide()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-900 transition-colors duration-200">
    <!-- Hero Section -->
    <!-- Hero Section with Left-Aligned Slider -->
    <!-- Hero Section with Left-Aligned Slider -->
<section class="relative min-h-screen flex items-center overflow-hidden">
  <!-- Floating Dots Animation -->
  <TechAnimations variant="dots" density="high" />
  
  <!-- Background Slider -->
  <div class="absolute inset-0">
    <div v-if="sliders.length > 0" class="relative w-full h-full">
      <div 
        v-for="(slider, index) in sliders" 
        :key="slider.id" 
        class="absolute inset-0 transition-opacity duration-1000"
        :class="{ 'opacity-100': currentSlideIndex === index, 'opacity-0': currentSlideIndex !== index }"
      >
        <img 
          v-if="slider.imagePath"
          :src="`http://localhost:3000${slider.imagePath}`"
          :alt="slider.title"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full bg-gradient-to-br from-blue-700 to-blue-900 dark:from-blue-800 dark:to-blue-950"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-black/20 via-black/25 to-black/50 dark:from-black/40 dark:via-black/50 dark:to-black/90"></div>
        <div class="absolute inset-0 bg-gradient-to-l from-black/40 via-black/20 to-transparent dark:from-black/70 dark:via-black/40 dark:to-transparent"></div>
      </div>
    </div>
    <div v-else class="w-full h-full bg-gradient-to-br from-blue-700 to-blue-900 dark:from-blue-800 dark:to-blue-950">
              <div class="absolute inset-0 bg-gradient-to-r from-black/20 via-black/25 to-black/50 dark:from-black/40 dark:via-black/50 dark:to-black/90"></div>
        <div class="absolute inset-0 bg-gradient-to-l from-black/40 via-black/20 to-transparent dark:from-black/70 dark:via-black/40 dark:to-transparent"></div>
    </div>
  </div>
  
  <!-- Content Container - Left Aligned -->
  <div class="relative z-20 w-full h-full flex items-center">
    <div class="w-full pl-8 md:pl-16 lg:pl-20 pr-8">
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p class="mt-4 text-gray-300">Memuat...</p>
      </div>
      
      <!-- Slider Content - Left Aligned -->
      <div v-else-if="sliders.length > 0" class="relative">
        <div 
          v-for="(slider, index) in sliders" 
          :key="slider.id" 
          class="transition-all duration-1000"
          :class="{ 'opacity-100 transform translate-y-0': currentSlideIndex === index, 'opacity-0 transform translate-y-4 absolute inset-0': currentSlideIndex !== index }"
        >
          <div class="text-left text-white max-w-4xl">
            <!-- Company Badge -->
            <div class="bg-white/20 backdrop-blur-sm px-6 py-3 text-base md:text-lg font-medium text-white mb-8 inline-block rounded-full" data-aos="fade-down" data-aos-delay="200">
              Fiber Teknologi Nusantara
            </div>
            
            <!-- Main Title from API -->
            <div class="mb-7" data-aos="fade-up" data-aos-delay="400">
              <h1 class="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none">
                {{ slider.title }}
              </h1>
            </div>
            
            <!-- Subtitle/Tagline from API -->
            <div class="mb-8" data-aos="fade-up" data-aos-delay="600">
              <p class="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-200 leading-relaxed max-w-4xl">
                {{ slider.subtitle }}
              </p>
              <p v-if="slider.tagline" class="text-base md:text-lg text-gray-300 mt-4 leading-relaxed max-w-3xl">
                {{ slider.tagline }}
              </p>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 max-w-md" data-aos="fade-up" data-aos-delay="800">
              <router-link 
                to="/contact" 
                class="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Mulai Konsultasi
                <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </router-link>
              <router-link 
                to="/services" 
                class="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white dark:bg-gray-800 hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Lihat Layanan
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Fallback Content - Left Aligned -->
      <div v-else class="text-left text-white max-w-4xl">
        <!-- Company Badge -->
        <div class="bg-white/20 backdrop-blur-sm px-6 py-3 text-base md:text-lg font-medium text-white mb-8 inline-block rounded-full" data-aos="fade-down" data-aos-delay="200">
          Fiber Teknologi Nusantara
        </div>
        
        <!-- Fallback Title -->
        <div class="mb-7" data-aos="fade-up" data-aos-delay="400">
          <h1 class="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none">
            PT Fiber Teknologi Nusantara
          </h1>
        </div>
        
        <!-- Fallback Subtitle -->
        <div class="mb-8" data-aos="fade-up" data-aos-delay="600">
          <p class="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-200 leading-relaxed max-w-4xl">
            Solusi teknologi terdepan untuk infrastruktur jaringan yang handal, cepat, dan aman
          </p>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 max-w-md" data-aos="fade-up" data-aos-delay="800">
          <router-link 
            to="/contact" 
            class="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Mulai Konsultasi
            <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </router-link>
          <router-link 
            to="/services" 
            class="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white dark:bg-gray-800 hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Lihat Layanan
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <!-- Navigation Dots -->
  <div v-if="sliders.length > 1" class="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
    <div class="flex space-x-4">
      <button
        v-for="(slider, index) in sliders"
        :key="slider.id"
        @click="goToSlide(index)"
        class="w-4 h-4 rounded-full transition-all duration-300 hover:scale-125"
        :class="currentSlideIndex === index ? 'bg-white dark:bg-gray-800 shadow-lg' : 'bg-white/50 hover:bg-white/75'"
      >
        <span class="sr-only">Slide {{ index + 1 }}</span>
      </button>
    </div>
  </div>

  <!-- Navigation Arrows -->
  <div v-if="sliders.length > 1" class="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 z-20 pointer-events-none">
    <button
      @click="previousSlide"
      class="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 pointer-events-auto"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      @click="nextSlide"
      class="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 pointer-events-auto"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>

  <!-- Pause/Play Button -->
  <div v-if="sliders.length > 1" class="absolute top-6 right-6 z-20">
    <button
      @click="toggleAutoSlide"
      class="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
    >
      <svg v-if="isAutoPlaying" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6" />
      </svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  </div>
</section>

    <!-- About Section -->
    <section class="py-16 bg-white dark:bg-gray-800 dark:bg-gray-800 relative overflow-hidden transition-colors duration-200">
      <!-- Minimal Tech Dots for About -->
      <TechAnimations variant="minimal" density="low" />
      
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white dark:text-white mb-4">Tentang Kami</h2>
          <p class="text-gray-600 dark:text-gray-300">Membangun masa depan digital Indonesia dengan solusi teknologi terdepan</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right" data-aos-delay="200">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white dark:text-white mb-6">Fiber Teknologi Nusantara</h3>
            <div class="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                Perusahaan teknologi terdepan yang berfokus pada solusi fiber optik dan infrastruktur jaringan untuk masa depan digital Indonesia.
              </p>
              <p>
                Dengan pengalaman lebih dari 10 tahun di industri teknologi, kami telah membantu ratusan perusahaan dan institusi pemerintah dalam membangun infrastruktur jaringan yang handal, cepat, dan aman.
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6" data-aos="fade-left" data-aos-delay="400">
            <div class="text-center group" data-aos="zoom-in" data-aos-delay="600">
              <div class="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">10+</div>
              <div class="text-gray-600 dark:text-gray-300 dark:text-gray-400 text-sm">Tahun Pengalaman</div>
            </div>
            <div class="text-center group" data-aos="zoom-in" data-aos-delay="700">
              <div class="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
              <div class="text-gray-600 dark:text-gray-300 text-sm">Proyek Selesai</div>
            </div>
            <div class="text-center group" data-aos="zoom-in" data-aos-delay="800">
              <div class="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">100+</div>
              <div class="text-gray-600 dark:text-gray-300 text-sm">Klien Puas</div>
            </div>
            <div class="text-center group" data-aos="zoom-in" data-aos-delay="900">
              <div class="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div class="text-gray-600 dark:text-gray-300 text-sm">Dukungan Teknis</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision & Mission -->
    <section class="py-16 relative overflow-hidden">
      <!-- Geometric Polygons for Vision -->
      <TechAnimations variant="geometric" density="medium" />
      
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Visi & Misi</h2>
          <p class="text-gray-600 dark:text-gray-300">Fondasi yang membimbing setiap langkah dan keputusan kami</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm group" data-aos="fade-up" data-aos-delay="200">
            <div class="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors duration-300">Visi</h3>
            <p class="text-gray-600 dark:text-gray-300 text-justify">
              Menjadi perusahaan penyedia infrastruktur yang handal dan berstandar tinggi, serta berperan aktif dalam mewujudkan transformasi digital kota menuju Smart City yang modern, efisien, dan berkelanjutan.
            </p>
          </div>
          
          <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm group" data-aos="fade-up" data-aos-delay="400">
            <div class="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 group-hover:text-green-600 transition-colors duration-300">Misi</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <div class="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
                  <span class="font-semibold text-green-600">Menata Estetika Perkotaan:</span> Mengintegrasikan solusi infrastruktur yang modern dan tertata guna mengurangi kesemrawutan kabel udara serta meningkatkan estetika dan keamanan lingkungan perkotaan.
                </p>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <div class="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
                  <span class="font-semibold text-green-600">Meningkatkan Efisiensi dan Keberlanjutan:</span> Mengoptimalkan pemanfaatan infrastruktur pasif secara bersama guna mengurangi redundansi jaringan, meningkatkan efisiensi biaya, serta mendukung penggunaan teknologi ramah lingkungan.
                </p>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <div class="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
                  <span class="font-semibold text-green-600">Menyediakan Infrastruktur Digital yang Tersertifikasi:</span> Menghadirkan standarisasi infrastruktur digital yang berkualitas, aman, dan sesuai dengan regulasi untuk mendukung konektivitas yang andal.
                </p>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <div class="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
                  <span class="font-semibold text-green-600">Mendukung Transformasi Digital Kota:</span> Berkontribusi dalam percepatan digitalisasi melalui pembangunan infrastruktur digital yang mendukung Smart City, IoT, dan ekosistem digital yang inovatif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Company Values -->
    <section class="py-16 bg-white dark:bg-gray-800">
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Nilai-Nilai Perusahaan</h2>
          <p class="text-gray-600 dark:text-gray-300">Nilai-nilai yang menjadi fondasi dalam setiap langkah dan keputusan kami</p>
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
              Sebagai perusahaan yang berorientasi pada keunggulan, kami menjunjung tinggi nilai-nilai profesionalisme, transparansi, dan kepatuhan terhadap regulasi dalam setiap aspek bisnis.
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
              PT Fiber Teknologi Nusantara terus berupaya menjadi perusahaan terbaik dalam bidang Penyediaan Infrastruktur Pasif Telekomunikasi. Dengan standarisasi tinggi, teknologi modern, dan tenaga ahli berpengalaman.
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
              PT Fiber Teknologi Nusantara berkomitmen untuk menyediakan infrastruktur pasif telekomunikasi yang berkualitas tinggi dengan harga yang terjangkau dan sesuai standar.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="py-16 relative overflow-hidden">
      <!-- Polygon Shapes for Gallery -->
      <TechAnimations variant="polygon" density="medium" />
      
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Galeri Perusahaan</h2>
          <p class="text-gray-600 dark:text-gray-300">Galeri foto dari berbagai proyek dan kegiatan kami</p>
        </div>
        
        <div v-if="galleryLoading" class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300">Memuat galeri...</div>
        </div>
        
        <div v-else-if="activeGallery.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          <div 
            v-for="(item, index) in activeGallery.slice(0, 10)" 
            :key="item.id"
            class="group cursor-pointer"
            :data-aos="'fade-up'"
            :data-aos-delay="(index + 1) * 50"
            @click="showGalleryDetail(item)"
          >
            <!-- Artistic Gallery Card -->
            <div class="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 group-hover:rotate-1">
              
              <!-- Image Container -->
              <div class="relative w-full h-full overflow-hidden">
                <img 
                  v-if="item.imagePath"
                  :src="`http://localhost:3000${item.imagePath}`" 
                  :alt="item.description || 'Gallery Image'"
                  class="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 ease-out"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-blue-100 flex items-center justify-center">
                  <div class="text-center">
                    <svg class="w-12 h-12 text-gray-400 group-hover:text-blue-600 transition-colors duration-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-gray-500 dark:text-gray-400 text-xs font-medium">Gambar</span>
                  </div>
                </div>
                
                <!-- Artistic Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                
                <!-- Floating Elements -->
                <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <div class="bg-white/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 p-2 rounded-full shadow-lg hover:bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <!-- Description Overlay -->
                <div v-if="item.description" class="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-200">
                  <p class="text-sm font-medium leading-tight line-clamp-2 drop-shadow-lg">
                    {{ item.description }}
                  </p>
                </div>
              </div>

              <!-- Corner Decorations -->
              <div class="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300"></div>
              <div class="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300"></div>
              
              <!-- Animated Border -->
              <div class="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/20 transition-all duration-700"></div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300">Tidak ada galeri yang tersedia saat ini.</div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-16 relative overflow-hidden">
      <!-- Mixed Dots and Polygons for Services -->
      <TechAnimations variant="mixed" density="medium" />
      
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Layanan Kami</h2>
          <p class="text-gray-600 dark:text-gray-300">Solusi lengkap untuk kebutuhan teknologi dan infrastruktur jaringan Anda</p>
        </div>
        
        <div v-if="servicesLoading" class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300">Memuat layanan...</div>
        </div>
        
        <div v-else-if="services.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(service, index) in services.slice(0, 6)" 
            :key="service.id"
            class="group cursor-pointer"
            :data-aos="'fade-up'"
            :data-aos-delay="(index + 1) * 100"
            @click="showServiceDetail(service)"
          >
            <!-- Card Container -->
            <div class="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-[1.02]">
              
              <!-- Image Section -->
              <div class="relative overflow-hidden">
                <div class="aspect-w-16 aspect-h-10">
                  <img 
                    v-if="service.imagePath"
                    :src="`http://localhost:3000${service.imagePath}`" 
                    :alt="service.name"
                    class="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div v-else class="w-full h-52 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-700">
                    <div class="text-center">
                      <svg class="w-16 h-16 text-blue-400 group-hover:text-blue-600 transition-colors duration-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="text-blue-500 text-sm font-medium">Layanan</span>
                    </div>
                  </div>
                </div>
                
                <!-- Overlay Gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <!-- Floating Detail Button -->
                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  <div class="bg-white/90 backdrop-blur-sm text-blue-600 p-2 rounded-full shadow-lg hover:bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Content Section -->
              <div class="p-6">
                <div class="space-y-3">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300 line-height-tight">
                    {{ service.name }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {{ service.description }}
                  </p>
                </div>
                
                <!-- Action Area -->
                <div class="mt-6 flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">Tersedia</span>
                  </div>
                  
                  <div class="flex items-center text-blue-600 group-hover:text-blue-700 font-medium text-sm group-hover:translate-x-1 transition-all duration-300">
                    <span>Lihat Detail</span>
                    <svg class="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Bottom Accent -->
              <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300">Tidak ada layanan yang tersedia saat ini.</div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section class="py-16 bg-white dark:bg-gray-800 relative overflow-hidden">
      <!-- Geometric Polygons for Projects -->
      <TechAnimations variant="geometric" density="medium" />
      
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Proyek Terbaru</h2>
          <p class="text-gray-600 dark:text-gray-300">Beberapa proyek terbaru yang telah kami selesaikan</p>
        </div>
        
        <div v-if="projectsLoading" class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300">Memuat proyek...</div>
        </div>
        
        <div v-else-if="projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(project, index) in projects.slice(0, 6)" 
            :key="project.id"
            class="group cursor-pointer"
            :data-aos="'fade-up'"
            :data-aos-delay="(index + 1) * 100"
            @click="showProjectDetail(project)"
          >
            <!-- Compact Project Card for HomeView -->
            <div class="relative bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-[1.02]">
              
              <!-- Status Badge - Top Right -->
              <div class="absolute top-3 right-3 z-10">
                <span :class="getProjectStatusBadgeClass(project.status)" class="px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                  {{ getProjectStatusText(project.status) }}
                </span>
              </div>
              
              <!-- Image Section -->
              <div class="relative overflow-hidden">
                <img 
                  v-if="project.imagePath"
                  :src="`http://localhost:3000${project.imagePath}`" 
                  :alt="project.name"
                  class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div v-else class="w-full h-48 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-100 flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-200 transition-all duration-700">
                  <div class="text-center">
                    <svg class="w-12 h-12 text-gray-400 group-hover:text-blue-600 transition-colors duration-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span class="text-gray-500 dark:text-gray-400 text-xs font-medium">Proyek</span>
                  </div>
                </div>
                
                <!-- Overlay on Hover -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <!-- Content Section -->
              <div class="p-5">
                <div class="space-y-3">
                  <!-- Project Title -->
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                    {{ project.name }}
                  </h3>
                  
                  <!-- Location -->
                  <div class="flex items-center text-gray-600 dark:text-gray-200">
                    <svg class="w-3 h-3 mr-2 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="text-xs font-medium">{{ project.location }}</span>
                  </div>
                  
                  <!-- Description -->
                  <p class="text-gray-600 dark:text-gray-200 text-xs leading-relaxed line-clamp-2">
                    {{ project.description }}
                  </p>
                </div>
                
                <!-- Footer -->
                <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-300">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{{ new Date(project.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' }) }}</span>
                    </div>
                    
                    <div class="flex items-center text-blue-600 group-hover:text-blue-700 font-medium text-xs group-hover:translate-x-0.5 transition-all duration-300">
                      <span>Detail</span>
                      <svg class="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bottom Accent -->
              <div class="absolute bottom-0 left-0 right-0 h-0.5">
                <div :class="getProjectStatusAccentClass(project.status)" class="h-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300">Tidak ada proyek yang tersedia saat ini.</div>
        </div>
      </div>
    </section>

    <!-- Management Section -->
    <section class="py-16 relative overflow-hidden">
      <!-- Geometric Polygons for Management -->
      <TechAnimations variant="geometric" density="low" />
      
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Tim Manajemen</h2>
          <p class="text-gray-600 dark:text-gray-300">Tim profesional yang berpengalaman dalam industri teknologi</p>
        </div>
        
        <div v-if="managementLoading" class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300">Memuat tim manajemen...</div>
        </div>
        
        <div v-else-if="management.length > 0">
          <!-- Management Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div 
              v-for="(member, index) in management.slice(0, 4)" 
              :key="member.id"
              class="group cursor-pointer"
              :data-aos="'fade-up'"
              :data-aos-delay="(index + 1) * 100"
              @click="showManagementDetail(member)"
            >
              <!-- Member Card -->
              <div class="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-105">
                
                <!-- Status Indicator -->
                <div class="absolute top-3 right-3 z-10">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
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
                        <svg class="w-12 h-12 text-blue-400 group-hover:text-blue-600 transition-colors duration-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span class="text-blue-500 text-xs font-medium">Manajemen</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Gradient Overlay -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <!-- Position Badge -->
                  <div class="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <div class="bg-white/95 backdrop-blur-sm rounded-lg p-2 text-center">
                      <p class="text-blue-600 font-semibold text-xs">{{ member.position }}</p>
                    </div>
                  </div>
                </div>

                <!-- Content Section -->
                <div class="p-4 text-center">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300 mb-1">
                    {{ member.name }}
                  </h3>
                  
                  <p class="text-blue-600 font-medium text-xs mb-3">
                    {{ member.position }}
                  </p>
                  

                </div>

                <!-- Decorative Elements -->
                <div class="absolute top-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600 dark:text-gray-300">Tidak ada data tim manajemen yang tersedia saat ini.</div>
        </div>
      </div>
    </section>



    <!-- CTA Section -->
    <section class="py-16 bg-blue-600 dark:bg-blue-900 text-white">
      <div class="max-w-4xl mx-auto px-6 text-center">
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
            to="/services" 
            class="inline-block border-2 border-white dark:border-gray-300 text-white dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Lihat Layanan
          </router-link>
        </div>
      </div>
    </section>

    <!-- Service Detail Modal -->
    <div v-if="selectedService" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-aos="fade-in">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">{{ selectedService.name }}</h2>
            <button 
              @click="selectedService = null"
              class="text-gray-400 hover:text-gray-600 dark:text-gray-300 transition-colors"
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
            <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              {{ selectedService.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Simple Gallery Modal with Overlay Description -->
    <div v-if="selectedGallery" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50" data-aos="fade-in">
      <div class="relative max-w-6xl w-full h-full flex items-center justify-center">
        <!-- Close Button -->
        <button 
          @click="selectedGallery = null"
          class="absolute top-6 right-6 z-20 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 p-3 rounded-full transition-all duration-300 hover:scale-110"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Image Container with Overlay Description -->
        <div class="relative max-w-5xl w-full">
          <img 
            :src="`http://localhost:3000${selectedGallery.imagePath}`" 
            :alt="selectedGallery.description || 'Gallery Image'"
            class="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
          
          <!-- Description Overlay with Bottom Gradient -->
          <div v-if="selectedGallery.description" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent rounded-b-2xl p-6">
            <div class="text-white">
              <p class="text-lg leading-relaxed font-medium drop-shadow-lg">
                {{ selectedGallery.description }}
              </p>
              
              <!-- Optional: Small meta info -->
              <div class="flex items-center justify-between mt-4 text-sm text-white/80">
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Galeri</span>
                </div>
                <span>{{ new Date(selectedGallery.createdAt).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                }) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
              :src="`http://localhost:3000${selectedProject.imagePath}`" 
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
              <span :class="getProjectStatusBadgeClass(selectedProject.status)" class="px-4 py-2 rounded-full text-sm font-semibold">
                {{ getProjectStatusText(selectedProject.status) }}
              </span>
            </div>
          </div>
          
          <!-- Content -->
          <div class="p-8">
            <div class="space-y-6">
              <!-- Title -->
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white dark:text-white">{{ selectedProject.name }}</h2>
              
              <!-- Location -->
              <div class="flex items-center text-gray-600 dark:text-gray-300">
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
                    <span class="text-gray-700 dark:text-gray-300">{{ getProjectStatusText(selectedProject.status) }}</span>
                  </div>
                </div>
                
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Tanggal Mulai</h4>
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300">{{ new Date(selectedProject.createdAt).toLocaleDateString('id-ID', { 
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import companyService, { Slider, Service, Project, Management, Gallery } from '@/services/companyService'

// Data refs
const sliders = ref<Slider[]>([])
const services = ref<Service[]>([])
const projects = ref<Project[]>([])
const management = ref<Management[]>([])
const gallery = ref<Gallery[]>([])
const selectedService = ref<Service | null>(null)
const selectedGallery = ref<Gallery | null>(null)

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

const showServiceDetail = (service: Service) => {
  selectedService.value = service
}

const showGalleryDetail = (item: Gallery) => {
  selectedGallery.value = item
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
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <!-- Hero Section with Left-Aligned Slider -->
<!-- Hero Section with Left-Aligned Slider -->
<section class="relative min-h-screen flex items-center overflow-hidden">
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
        <div v-else class="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800"></div>
        <div class="absolute inset-0 bg-black/50"></div>
      </div>
    </div>
    <div v-else class="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800">
      <div class="absolute inset-0 bg-black/50"></div>
    </div>
  </div>
  
  <!-- Content Container - Left Aligned -->
  <div class="relative z-10 w-full h-full flex items-center">
    <div class="max-w-6xl mx-auto px-6 w-full">
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
          <div class="text-left text-white max-w-3xl">
            <div class="bg-white/20 backdrop-blur-sm px-6 py-3 text-base font-medium text-white mb-6 inline-block rounded-full" data-aos="fade-down" data-aos-delay="200">
              {{ slider.company || 'Fiber Teknologi Nusantara' }}
            </div>
            
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" data-aos="fade-up" data-aos-delay="400">
              {{ slider.title || 'Membangun Masa Depan Digital Indonesia' }}
            </h1>
            
            <p class="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed max-w-2xl" data-aos="fade-up" data-aos-delay="600">
              {{ slider.subtitle || 'Solusi teknologi terdepan untuk infrastruktur jaringan yang handal, cepat, dan aman' }}
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4" data-aos="fade-up" data-aos-delay="800">
              <router-link to="/contact" class="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Mulai Konsultasi
                <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </router-link>
              <router-link to="/services" class="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Lihat Layanan
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Fallback Content - Left Aligned -->
      <div v-else class="text-left text-white max-w-3xl">
        <div class="bg-white/20 backdrop-blur-sm px-6 py-3 text-base font-medium text-white mb-6 inline-block rounded-full" data-aos="fade-down" data-aos-delay="200">
          Fiber Teknologi Nusantara
        </div>
        
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" data-aos="fade-up" data-aos-delay="400">
          Membangun Masa Depan Digital Indonesia
        </h1>
        
        <p class="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed max-w-2xl" data-aos="fade-up" data-aos-delay="600">
          Solusi teknologi terdepan untuk infrastruktur jaringan yang handal, cepat, dan aman
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4" data-aos="fade-up" data-aos-delay="800">
          <router-link to="/contact" class="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            Mulai Konsultasi
            <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </router-link>
          <router-link to="/services" class="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
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
        :class="currentSlideIndex === index ? 'bg-white shadow-lg' : 'bg-white/50 hover:bg-white/75'"
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
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Tentang Kami</h2>
          <p class="text-gray-600">Membangun masa depan digital Indonesia dengan solusi teknologi terdepan</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right" data-aos-delay="200">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Fiber Teknologi Nusantara</h3>
            <div class="space-y-4 text-gray-600 leading-relaxed">
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
              <div class="text-gray-600 text-sm">Tahun Pengalaman</div>
            </div>
            <div class="text-center group" data-aos="zoom-in" data-aos-delay="700">
              <div class="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
              <div class="text-gray-600 text-sm">Proyek Selesai</div>
            </div>
            <div class="text-center group" data-aos="zoom-in" data-aos-delay="800">
              <div class="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">100+</div>
              <div class="text-gray-600 text-sm">Klien Puas</div>
            </div>
            <div class="text-center group" data-aos="zoom-in" data-aos-delay="900">
              <div class="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div class="text-gray-600 text-sm">Dukungan Teknis</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Layanan Kami</h2>
          <p class="text-gray-600">Solusi lengkap untuk kebutuhan teknologi dan infrastruktur jaringan Anda</p>
        </div>
        
        <div v-if="servicesLoading" class="text-center py-12">
          <div class="text-gray-600">Memuat layanan...</div>
        </div>
        
        <div v-else-if="services.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(service, index) in services.slice(0, 6)" 
            :key="service.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 p-6 group"
            :data-aos="'fade-up'"
            :data-aos-delay="(index + 1) * 100"
          >
            <div class="mb-4 overflow-hidden rounded-lg">
              <img 
                v-if="service.imagePath"
                :src="`http://localhost:3000${service.imagePath}`" 
                :alt="service.name"
                class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div v-else class="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
                <svg class="w-12 h-12 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">{{ service.name }}</h3>
            <p class="text-gray-600 text-sm mb-4">{{ service.description }}</p>
            <div class="flex justify-between items-center">
              <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                Aktif
              </span>
              <button 
                @click="showServiceDetail(service)"
                class="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center group-hover:scale-105 transition-all duration-300"
              >
                Detail
                <svg class="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600">Tidak ada layanan yang tersedia saat ini.</div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Proyek Terbaru</h2>
          <p class="text-gray-600">Beberapa proyek terbaru yang telah kami selesaikan</p>
        </div>
        
        <div v-if="projectsLoading" class="text-center py-12">
          <div class="text-gray-600">Memuat proyek...</div>
        </div>
        
        <div v-else-if="projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(project, index) in projects.slice(0, 6)" 
            :key="project.id"
            class="bg-gray-50 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group"
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
                  Selesai
                </span>
                <span class="text-gray-500 text-sm">{{ project.year }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600">Tidak ada proyek yang tersedia saat ini.</div>
        </div>
      </div>
    </section>

    <!-- Management Section -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Tim Manajemen</h2>
          <p class="text-gray-600">Tim profesional yang berpengalaman dalam industri teknologi</p>
        </div>
        
        <div v-if="managementLoading" class="text-center py-12">
          <div class="text-gray-600">Memuat tim manajemen...</div>
        </div>
        
        <div v-else-if="management.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="(member, index) in management.slice(0, 4)" 
            :key="member.id"
            class="text-center group"
            :data-aos="'fade-up'"
            :data-aos-delay="(index + 1) * 100"
          >
            <div class="mb-4 overflow-hidden rounded-lg">
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
            <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{{ member.name }}</h3>
            <p class="text-gray-600 text-sm">{{ member.position }}</p>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600">Tidak ada data tim manajemen yang tersedia saat ini.</div>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Galeri</h2>
          <p class="text-gray-600">Galeri foto dari berbagai proyek dan kegiatan kami</p>
        </div>
        
        <div v-if="galleryLoading" class="text-center py-12">
          <div class="text-gray-600">Memuat galeri...</div>
        </div>
        
        <div v-else-if="gallery.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div 
            v-for="(item, index) in gallery.slice(0, 8)" 
            :key="item.id"
            class="overflow-hidden rounded-lg hover:shadow-lg transition-all duration-500 transform hover:scale-105 group cursor-pointer"
            :data-aos="'zoom-in'"
            :data-aos-delay="(index + 1) * 50"
            @click="showGalleryDetail(item)"
          >
            <img 
              v-if="item.imagePath"
              :src="`http://localhost:3000${item.imagePath}`" 
              :alt="item.title"
              class="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div v-else class="w-full h-32 bg-gray-200 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
              <svg class="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-600">Tidak ada galeri yang tersedia saat ini.</div>
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
            to="/services" 
            class="inline-block border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Lihat Layanan
          </router-link>
        </div>
      </div>
    </section>

    <!-- Service Detail Modal -->
    <div v-if="selectedService" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-aos="fade-in">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-bold text-gray-900">{{ selectedService.name }}</h2>
            <button 
              @click="selectedService = null"
              class="text-gray-400 hover:text-gray-600 transition-colors"
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
            <p class="text-gray-600 text-lg leading-relaxed">
              {{ selectedService.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Gallery Detail Modal -->
    <div v-if="selectedGallery" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" data-aos="fade-in">
      <div class="relative max-w-4xl w-full">
        <button 
          @click="selectedGallery = null"
          class="absolute top-4 right-4 text-white hover:text-gray-300 z-10 transition-colors"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="bg-white rounded-lg overflow-hidden">
          <img 
            :src="`http://localhost:3000${selectedGallery.imagePath}`" 
            :alt="selectedGallery.title"
            class="w-full h-auto max-h-[80vh] object-contain"
          />
          <div v-if="selectedGallery.title" class="p-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ selectedGallery.title }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<template>
  <section class="relative h-screen bg-white">
    <!-- Content Container -->
    <div class="relative z-10 h-full flex items-center">
      <div v-if="loading" class="container-document text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p class="mt-4 text-gray-600">Memuat...</p>
      </div>
      
      <div v-else-if="sliders.length > 0" class="relative w-full h-full">
        <!-- Slide Background -->
        <div 
          v-for="(slider, index) in sliders" 
          :key="slider.id"
          class="absolute inset-0 transition-opacity duration-1000"
          :class="{ 'opacity-100': index === currentSlide, 'opacity-0': index !== currentSlide }"
        >
          <img 
            :src="`http://localhost:3000${slider.imagePath}`" 
            :alt="slider.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>
        
        <!-- Slide Content -->
        <div class="relative z-10 flex items-center h-full">
          <div class="container-document">
            <div class="max-w-4xl">
              <!-- Company Badge -->
              <div class="inline-block mb-8" data-aos="fade-down" data-aos-delay="100">
                <span class="badge-accent">
                  PT Fiber Teknologi Nusantara
                </span>
              </div>
              
              <!-- Main Title -->
              <h1 class="text-hero text-white mb-8 leading-tight" data-aos="fade-up" data-aos-delay="200">
                {{ sliders[currentSlide].title }}
              </h1>
              
              <!-- Subtitle -->
              <p v-if="sliders[currentSlide].subtitle" class="text-subtitle mb-8 text-white/90" data-aos="fade-up" data-aos-delay="300">
                {{ sliders[currentSlide].subtitle }}
              </p>
              
              <!-- Tagline -->
              <p v-if="sliders[currentSlide].tagline" class="text-body-large mb-12 text-white/80 max-w-3xl" data-aos="fade-up" data-aos-delay="400">
                {{ sliders[currentSlide].tagline }}
              </p>
              
              <!-- Buttons -->
              <div class="flex flex-col sm:flex-row gap-6" data-aos="fade-up" data-aos-delay="500">
                <router-link 
                  to="/services" 
                  class="btn-primary"
                >
                  Lihat Layanan
                  <svg class="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </router-link>
                <router-link 
                  to="/contact" 
                  class="btn-secondary"
                >
                  Hubungi Kami
                  <svg class="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Arrow Navigation -->
        <button
          v-if="sliders.length > 1"
          @click="previousSlide"
          class="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-white/95 hover:bg-white backdrop-blur-sm transition-all duration-300 cursor-pointer group border border-gray-200 shadow-lg"
          type="button"
          title="Previous slide"
        >
          <svg class="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          v-if="sliders.length > 1"
          @click="nextSlide"
          class="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-white/95 hover:bg-white backdrop-blur-sm transition-all duration-300 cursor-pointer group border border-gray-200 shadow-lg"
          type="button"
          title="Next slide"
        >
          <svg class="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <!-- Navigation Dots -->
        <div v-if="sliders.length > 1" class="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex space-x-4">
          <button
            v-for="(slide, index) in sliders"
            :key="index"
            @click="goToSlide(index)"
            class="w-3 h-3 transition-all duration-300 cursor-pointer hover:scale-125 rounded-full"
            :class="index === currentSlide ? 'bg-white shadow-lg' : 'bg-white/70 hover:bg-white/90'"
            type="button"
          ></button>
        </div>
      </div>
      
      <div v-else class="container-document">
        <div class="max-w-4xl">
          <h1 class="text-hero text-gray-900 mb-8" data-aos="fade-up" data-aos-delay="200">
            Fiber Teknologi Nusantara
          </h1>
          <p class="text-subtitle mb-8 text-gray-600" data-aos="fade-up" data-aos-delay="400">
            Solusi teknologi terdepan untuk masa depan digital Indonesia
          </p>
          <p class="text-body-large mb-12 text-gray-700 max-w-3xl" data-aos="fade-up" data-aos-delay="500">
            Membangun infrastruktur jaringan yang handal dan inovatif untuk mendukung transformasi digital di Indonesia.
          </p>
          <div class="flex flex-col sm:flex-row gap-6" data-aos="fade-up" data-aos-delay="600">
            <router-link 
              to="/services" 
              class="btn-primary"
            >
              Lihat Layanan
              <svg class="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </router-link>
            <router-link 
              to="/contact" 
              class="btn-secondary"
            >
              Hubungi Kami
              <svg class="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Slider } from '@/services/companyService'

interface Props {
  sliders: Slider[]
  loading: boolean
}

const props = defineProps<Props>()

const currentSlide = ref(0)
let slideInterval: NodeJS.Timeout | null = null

const nextSlide = () => {
  console.log('Next slide clicked, current:', currentSlide.value, 'total:', props.sliders.length)
  if (props.sliders.length > 0) {
    currentSlide.value = (currentSlide.value + 1) % props.sliders.length
  }
}

const previousSlide = () => {
  console.log('Previous slide clicked, current:', currentSlide.value, 'total:', props.sliders.length)
  if (props.sliders.length > 0) {
    currentSlide.value = currentSlide.value === 0 
      ? props.sliders.length - 1 
      : currentSlide.value - 1
  }
}

const goToSlide = (index: number) => {
  console.log('Go to slide clicked, index:', index, 'total:', props.sliders.length)
  if (index >= 0 && index < props.sliders.length) {
    currentSlide.value = index
  }
}

const startSlideShow = () => {
  if (props.sliders.length > 1) {
    slideInterval = setInterval(() => {
      nextSlide()
    }, 5000)
  }
}

const stopSlideShow = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
}

onMounted(() => {
  startSlideShow()
  
  // Add keyboard navigation
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      previousSlide()
    } else if (event.key === 'ArrowRight') {
      nextSlide()
    }
  }
  
  window.addEventListener('keydown', handleKeydown)
  
  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
})

onUnmounted(() => {
  stopSlideShow()
})
</script>

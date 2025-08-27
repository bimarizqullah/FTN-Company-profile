<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <nav class="max-w-6xl mx-auto px-6">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <img 
              src="/src/assets/logo.svg" 
              alt="Fiber Teknologi Nusantara" 
              class="h-8 w-auto"
              @error="handleImageError"
            />
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:block">
          <div class="flex items-center space-x-6">
            <router-link 
              v-for="item in navigationItems" 
              :key="item.name"
              :to="item.href"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-md"
              :class="[
                $route.path === item.href 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'hover:bg-gray-50'
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <!-- CTA Button -->
        <div class="hidden md:block">
          <router-link 
            to="/contact"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Hubungi Kami
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="lg:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span class="sr-only">Buka menu utama</span>
            <div class="w-6 h-6 flex flex-col justify-center items-center">
              <span 
                class="block w-5 h-0.5 bg-current transition-all duration-300"
                :class="{ 'rotate-45 translate-y-1': mobileMenuOpen }"
              ></span>
              <span 
                class="block w-5 h-0.5 bg-current mt-1 transition-all duration-300"
                :class="{ 'opacity-0': mobileMenuOpen }"
              ></span>
              <span 
                class="block w-5 h-0.5 bg-current mt-1 transition-all duration-300"
                :class="{ '-rotate-45 -translate-y-1': mobileMenuOpen }"
              ></span>
            </div>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-show="mobileMenuOpen" class="lg:hidden border-t border-gray-100">
        <div class="py-4 space-y-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            class="block px-4 py-2 text-base font-medium transition-colors"
            :class="[
              $route.path === item.href 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
          <router-link
            to="/contact"
            class="block mx-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-center transition-colors"
            @click="mobileMenuOpen = false"
          >
            Hubungi Kami
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const navigationItems = [
  { name: 'Beranda', href: '/' },
  { name: 'Tentang Kami', href: '/about' },
  { name: 'Layanan', href: '/services' },
  { name: 'Proyek', href: '/projects' },
  { name: 'Manajemen', href: '/management' },
  { name: 'Galeri', href: '/gallery' },
  { name: 'Kontak', href: '/contact' }
]

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}
</script>

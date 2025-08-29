<template>
  <header class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-all duration-300">
    <nav class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center h-14">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <!-- Light Mode Logo -->
            <img 
              src="/src/assets/logo.svg" 
              alt="Fiber Teknologi Nusantara" 
              class="h-7 w-auto block dark:hidden transition-all duration-300"
              @error="handleImageError"
            />
            <!-- Dark Mode Logo -->
            <img 
              src="/src/assets/logo-light.svg" 
              alt="Fiber Teknologi Nusantara" 
              class="h-7 w-auto hidden dark:block transition-all duration-300"
              @error="handleImageError"
            />
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:block">
          <div class="flex items-center space-x-1">
            <router-link 
              v-for="item in navigationItems" 
              :key="item.name"
              :to="item.href"
              class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 px-4 py-2 rounded-full text-sm relative group"
              :class="[
                $route.path === item.href 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20' 
                  : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/50'
              ]"
            >
              {{ item.name }}
              <!-- Active indicator -->
              <div 
                v-if="$route.path === item.href"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
              ></div>
            </router-link>
          </div>
        </div>

        <!-- Theme Toggle & CTA Button -->
        <div class="hidden md:flex items-center space-x-3">
          <ThemeToggle />
          <router-link 
            to="/contact"
            class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
          >
            Hubungi Kami
          </router-link>
        </div>

        <!-- Mobile menu button & theme toggle -->
        <div class="lg:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
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
      <div v-show="mobileMenuOpen" class="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
        <div class="py-3 space-y-1 px-2">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            class="block px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl"
            :class="[
              $route.path === item.href 
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/50'
            ]"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
          <div class="px-2 pt-3">
            <router-link
              to="/contact"
              class="block bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2.5 rounded-full font-medium text-sm text-center transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
              @click="mobileMenuOpen = false"
            >
              Hubungi Kami
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeToggle from './ThemeToggle.vue'

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

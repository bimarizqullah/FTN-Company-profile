<template>
  <button
    @click="themeStore.toggleTheme()"
    class="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
    :class="themeStore.isDark ? 'text-yellow-300' : 'text-blue-200'"
    :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
  >
    <!-- Sun Icon (Light Mode) -->
    <svg 
      v-show="!themeStore.isDark"
      class="w-6 h-6 transition-all duration-500 transform group-hover:rotate-180"
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
      />
    </svg>
    
    <!-- Moon Icon (Dark Mode) -->
    <svg 
      v-show="themeStore.isDark"
      class="w-6 h-6 transition-all duration-500 transform group-hover:rotate-12"
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
      />
    </svg>
    
    <!-- Glow Effect -->
    <div class="absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
  </button>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<style scoped>
/* Additional styles for smooth transitions */
.theme-toggle-enter-active,
.theme-toggle-leave-active {
  transition: all 0.3s ease;
}

.theme-toggle-enter-from {
  opacity: 0;
  transform: rotate(-180deg) scale(0.8);
}

.theme-toggle-leave-to {
  opacity: 0;
  transform: rotate(180deg) scale(0.8);
}
</style>

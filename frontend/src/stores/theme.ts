import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // State
  const isDark = ref(false)
  
  // Actions
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }
  
  const setTheme = (dark: boolean) => {
    isDark.value = dark
  }
  
  // Initialize theme from localStorage or system preference
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // Check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    updateDocumentClass()
  }
  
  // Update document class and localStorage
  const updateDocumentClass = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }
  
  // Watch for theme changes
  watch(isDark, () => {
    updateDocumentClass()
  })
  
  // Getters
  const currentTheme = () => isDark.value ? 'dark' : 'light'
  
  return {
    isDark,
    toggleTheme,
    setTheme,
    initializeTheme,
    currentTheme
  }
})

import './assets/main.css'
import 'aos/dist/aos.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import AOS from 'aos'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'

// Initialize AOS
AOS.init({
  duration: 1000,
  easing: 'ease-in-out-cubic',
  once: true,
  mirror: false,
  offset: 100,
  delay: 0
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize theme after pinia is available
const themeStore = useThemeStore()
themeStore.initializeTheme()

app.mount('#app')

import './assets/main.css'
import 'aos/dist/aos.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import AOS from 'aos'

import App from './App.vue'
import router from './router'

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

app.use(createPinia())
app.use(router)

app.mount('#app')

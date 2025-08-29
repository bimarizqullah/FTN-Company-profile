<template>
  <section class="section-padding bg-blue-600 dark:bg-blue-900">
    <div class="container-gsap">
      <h2 class="text-3xl md:text-5xl font-bold text-white mb-4" data-aos="fade-up">
        Siap untuk Memulai Proyek Anda?
      </h2>
      <p class="text-lg text-blue-100 dark:text-blue-200 mb-8 max-w-2xl" data-aos="fade-up" data-aos-delay="200">
        Hubungi kami hari ini untuk konsultasi gratis dan solusi yang tepat untuk kebutuhan teknologi Anda.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-start" data-aos="fade-up" data-aos-delay="400">
        <router-link 
          to="/contact" 
          class="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Hubungi Kami
        </router-link>
        <router-link 
          to="/about" 
          class="border border-white dark:border-gray-300 text-white dark:text-gray-200 px-6 py-3 rounded-lg font-medium hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Pelajari Lebih Lanjut
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No props needed for this component
</script>

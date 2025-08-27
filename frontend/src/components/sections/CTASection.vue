<template>
  <section class="section-padding bg-blue-600">
    <div class="container-gsap text-center">
      <h2 class="text-3xl md:text-5xl font-bold text-white mb-4" data-aos="fade-up">
        Siap untuk Memulai Proyek Anda?
      </h2>
      <p class="text-lg text-blue-100 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
        Hubungi kami hari ini untuk konsultasi gratis dan solusi yang tepat untuk kebutuhan teknologi Anda.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
        <router-link 
          to="/contact" 
          class="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Hubungi Kami
        </router-link>
        <router-link 
          to="/about" 
          class="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
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

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Mixed Dots and Polygons Background -->
      <TechAnimations variant="mixed" density="high" />
      
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900 dark:from-blue-800 dark:to-blue-950">
        <div class="absolute inset-0 bg-black/50 dark:bg-black/60"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-20 max-w-4xl mx-auto px-6 text-center text-white">
        <div class="bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-medium text-white mb-8 inline-block rounded-full" data-aos="fade-down" data-aos-delay="200">
          Tentang Kami
        </div>
        <h1 class="text-4xl md:text-6xl font-bold mb-8" data-aos="fade-up" data-aos-delay="400">Fiber Teknologi Nusantara</h1>
        <p class="text-xl text-gray-200 max-w-4xl mx-auto mb-12" data-aos="fade-up" data-aos-delay="600">
          Perusahaan teknologi terdepan yang berfokus pada solusi fiber optik dan infrastruktur jaringan untuk masa depan digital Indonesia.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-6 justify-center" data-aos="fade-up" data-aos-delay="800">
          <router-link to="/contact" class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            Hubungi Kami
            <svg class="ml-3 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </router-link>
          <router-link to="/services" class="inline-block border-2 border-white text-white hover:bg-white dark:bg-gray-800 hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
            Lihat Layanan
          </router-link>
        </div>
      </div>
    </section>

    <!-- Company Story -->
    <section class="py-16 bg-white dark:bg-gray-800 relative overflow-hidden">
      <!-- Minimal Dots for Story -->
      <TechAnimations variant="minimal" density="low" />
      
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right" data-aos-delay="200">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Cerita Perusahaan</h2>
            <div class="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p class="text-justify">
                PT Fiber Teknologi Nusantara adalah perusahaan swasta nasional yang bergerak di bidang Penyediaan Infrastruktur Pasif Bersama untuk sektor telekomunikasi dan Infrastruktur Digital pendukung lainnya. Kami berkomitmen untuk mendukung revitalisasi dan pengembangan infrastruktur digital yang modern, andal, dan sesuai dengan standar industri, guna mempercepat transformasi digital kota di Indonesia.
              </p>
            </div>
          </div>
          <div class="text-center" data-aos="fade-left" data-aos-delay="400">
            <div class="bg-blue-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Inovasi & Teknologi</h3>
            <p class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Terus berinovasi untuk memberikan solusi terbaik</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision & Mission -->
    <section class="py-16 relative overflow-hidden">
      <!-- Geometric Polygons for Vision -->
      <TechAnimations variant="geometric" density="medium" />
      
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Visi & Misi</h2>
          <p class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Fondasi yang membimbing setiap langkah dan keputusan kami</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm group" data-aos="fade-up" data-aos-delay="200">
            <div class="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors duration-300">Visi</h3>
            <p class="text-gray-600 dark:text-gray-300 dark:text-gray-300">
              Menjadi perusahaan penyedia infrastruktur yang handal dan berstandar tinggi, serta berperan aktif dalam mewujudkan transformasi digital kota menuju Smart City yang modern, efisien, dan berkelanjutan.
            </p>
          </div>
          
          <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm group" data-aos="fade-up" data-aos-delay="400">
            <div class="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 group-hover:text-green-600 transition-colors duration-300">Misi</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <div class="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
                  <span class="font-semibold text-green-600">Menata Estetika Perkotaan:</span> Mengintegrasikan solusi infrastruktur yang modern dan tertata guna mengurangi kesemrawutan kabel udara serta meningkatkan estetika dan keamanan lingkungan perkotaan.
                </p>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <div class="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
                  <span class="font-semibold text-green-600">Meningkatkan Efisiensi dan Keberlanjutan:</span> Mengoptimalkan pemanfaatan infrastruktur pasif secara bersama guna mengurangi redundansi jaringan, meningkatkan efisiensi biaya, serta mendukung penggunaan teknologi ramah lingkungan.
                </p>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <div class="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
                  <span class="font-semibold text-green-600">Menyediakan Infrastruktur Digital yang Tersertifikasi:</span> Menghadirkan standarisasi infrastruktur digital yang berkualitas, aman, dan sesuai dengan regulasi untuk mendukung konektivitas yang andal.
                </p>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <div class="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
                  <span class="font-semibold text-green-600">Mendukung Transformasi Digital Kota:</span> Berkontribusi dalam percepatan digitalisasi melalui pembangunan infrastruktur digital yang mendukung Smart City, IoT, dan ekosistem digital yang inovatif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-16 bg-white dark:bg-gray-800 dark:bg-gray-800">
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Nilai-Nilai Perusahaan</h2>
          <p class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Nilai-nilai yang menjadi fondasi dalam setiap langkah dan keputusan kami</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm group hover:shadow-lg transition-all duration-300" data-aos="zoom-in" data-aos-delay="200">
            <div class="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors duration-300">Profesional</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
              Sebagai perusahaan yang berorientasi pada keunggulan, kami menjunjung tinggi nilai-nilai profesionalisme, transparansi, dan kepatuhan terhadap regulasi dalam setiap aspek bisnis. Melalui kolaborasi dengan pemerintah daerah, operator telekomunikasi, dan pemangku kepentingan lainnya, kami berperan aktif dalam mendukung transformasi digital kota menuju Smart City serta penataan estetika perkotaan.
            </p>
          </div>
          
          <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm group hover:shadow-lg transition-all duration-300" data-aos="zoom-in" data-aos-delay="300">
            <div class="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 transition-colors duration-300">Terpercaya</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
              PT Fiber Teknologi Nusantara terus berupaya menjadi perusahaan yang terpercaya dalam penyediaan infrastruktur pasif telekomunikasi. Dengan komitmen terhadap standarisasi dan kualitas, kami menghadirkan solusi infrastruktur digital yang andal dan berkelanjutan.
            </p>
          </div>
          
          <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm group hover:shadow-lg transition-all duration-300" data-aos="zoom-in" data-aos-delay="400">
            <div class="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 transition-colors duration-300">Terbaik</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
              PT Fiber Teknologi Nusantara terus berupaya menjadi perusahaan terbaik dalam bidang Penyediaan Infrastruktur Pasif Telekomunikasi. Dengan standarisasi tinggi, teknologi modern, dan tenaga ahli berpengalaman, kami menghadirkan solusi infrastruktur telekomunikasi yang andal, efisien, dan berkelanjutan.
            </p>
          </div>
          
          <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm group hover:shadow-lg transition-all duration-300" data-aos="zoom-in" data-aos-delay="500">
            <div class="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-orange-600 transition-colors duration-300">Terjangkau</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm text-justify leading-relaxed">
              PT Fiber Teknologi Nusantara berkomitmen untuk menyediakan infrastruktur pasif telekomunikasi yang berkualitas tinggi dengan harga yang terjangkau. Dengan pengalaman dan teknologi modern, kami menghadirkan solusi infrastruktur yang efisien, andal, dan sesuai standar, sehingga dapat memenuhi kebutuhan operator telekomunikasi, pemerintah daerah, serta berbagai pemangku kepentingan lainnya.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pencapaian Kami</h2>
          <p class="text-gray-600 dark:text-gray-300 dark:text-gray-300">Beberapa angka yang menunjukkan dedikasi dan komitmen kami</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="group" data-aos="zoom-in" data-aos-delay="200">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">10+</div>
            <div class="text-gray-600 dark:text-gray-300 text-sm">Tahun Pengalaman</div>
          </div>
          <div class="group" data-aos="zoom-in" data-aos-delay="300">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
            <div class="text-gray-600 dark:text-gray-300 text-sm">Proyek Selesai</div>
          </div>
          <div class="group" data-aos="zoom-in" data-aos-delay="400">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">100+</div>
            <div class="text-gray-600 dark:text-gray-300 text-sm">Klien Puas</div>
          </div>
          <div class="group" data-aos="zoom-in" data-aos-delay="500">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div class="text-gray-600 dark:text-gray-300 text-sm">Dukungan Teknis</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-blue-600 dark:bg-blue-900 text-white">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-4" data-aos="fade-up">
          Siap Bekerja Sama dengan Kami?
        </h2>
        <p class="text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Mari kita diskusikan bagaimana kami dapat membantu mewujudkan visi teknologi Anda.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
          <router-link 
            to="/contact" 
            class="inline-block bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Hubungi Kami
          </router-link>
          <router-link 
            to="/services" 
            class="inline-block border-2 border-white dark:border-gray-300 text-white dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Lihat Layanan
          </router-link>
        </div>
      </div>
    </section>

    <!-- Scroll to Top Button -->
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import TechAnimations from '@/components/TechAnimations.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'
</script>

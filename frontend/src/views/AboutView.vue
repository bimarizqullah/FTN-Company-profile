<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
        <div class="absolute inset-0 bg-black/50"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
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
          <router-link to="/services" class="inline-block border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
            Lihat Layanan
          </router-link>
        </div>
      </div>
    </section>

    <!-- Company Story -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right" data-aos-delay="200">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Cerita Perusahaan</h2>
            <div class="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Fiber Teknologi Nusantara didirikan dengan visi untuk menjadi pemimpin dalam transformasi digital Indonesia melalui solusi teknologi yang inovatif dan handal.
              </p>
              <p>
                Dengan pengalaman lebih dari 10 tahun di industri teknologi, kami telah membantu ratusan perusahaan dan institusi pemerintah dalam membangun infrastruktur jaringan yang handal, cepat, dan aman.
              </p>
              <p>
                Tim kami terdiri dari para profesional yang berpengalaman dan berdedikasi tinggi untuk memberikan solusi terbaik bagi setiap klien kami.
              </p>
            </div>
          </div>
          <div class="text-center" data-aos="fade-left" data-aos-delay="400">
            <div class="bg-blue-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Inovasi & Teknologi</h3>
            <p class="text-gray-600">Terus berinovasi untuk memberikan solusi terbaik</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision & Mission -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Visi & Misi</h2>
          <p class="text-gray-600">Fondasi yang membimbing setiap langkah dan keputusan kami</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white p-8 rounded-lg shadow-sm group" data-aos="fade-up" data-aos-delay="200">
            <div class="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">Visi</h3>
            <p class="text-gray-600">
              Menjadi perusahaan teknologi terdepan yang menggerakkan transformasi digital Indonesia melalui solusi inovatif dan berkelanjutan.
            </p>
          </div>
          
          <div class="bg-white p-8 rounded-lg shadow-sm group" data-aos="fade-up" data-aos-delay="400">
            <div class="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">Misi</h3>
            <p class="text-gray-600">
              Memberikan solusi teknologi terbaik dengan standar kualitas tertinggi, mendukung pertumbuhan digital Indonesia, dan menciptakan nilai berkelanjutan bagi semua pemangku kepentingan.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Nilai-Nilai Perusahaan</h2>
          <p class="text-gray-600">Nilai-nilai yang menjadi fondasi dalam setiap langkah dan keputusan kami</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="text-center group" data-aos="zoom-in" data-aos-delay="200">
            <div class="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">Inovasi</h3>
            <p class="text-gray-600 text-sm">
              Terus berinovasi untuk memberikan solusi terbaik.
            </p>
          </div>
          
          <div class="text-center group" data-aos="zoom-in" data-aos-delay="300">
            <div class="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">Kualitas</h3>
            <p class="text-gray-600 text-sm">
              Standar kualitas tertinggi dalam setiap layanan.
            </p>
          </div>
          
          <div class="text-center group" data-aos="zoom-in" data-aos-delay="400">
            <div class="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">Integritas</h3>
            <p class="text-gray-600 text-sm">
              Kejujuran dan tanggung jawab dalam bisnis.
            </p>
          </div>
          
          <div class="text-center group" data-aos="zoom-in" data-aos-delay="500">
            <div class="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">Kepedulian</h3>
            <p class="text-gray-600 text-sm">
              Peduli terhadap lingkungan dan masyarakat.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Pencapaian Kami</h2>
          <p class="text-gray-600">Beberapa angka yang menunjukkan dedikasi dan komitmen kami</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="group" data-aos="zoom-in" data-aos-delay="200">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">10+</div>
            <div class="text-gray-600 text-sm">Tahun Pengalaman</div>
          </div>
          <div class="group" data-aos="zoom-in" data-aos-delay="300">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
            <div class="text-gray-600 text-sm">Proyek Selesai</div>
          </div>
          <div class="group" data-aos="zoom-in" data-aos-delay="400">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">100+</div>
            <div class="text-gray-600 text-sm">Klien Puas</div>
          </div>
          <div class="group" data-aos="zoom-in" data-aos-delay="500">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div class="text-gray-600 text-sm">Dukungan Teknis</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-blue-600 text-white">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-4" data-aos="fade-up">
          Siap Bekerja Sama dengan Kami?
        </h2>
        <p class="text-blue-100 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Mari kita diskusikan bagaimana kami dapat membantu mewujudkan visi teknologi Anda.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
          <router-link 
            to="/contact" 
            class="inline-block bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Hubungi Kami
          </router-link>
          <router-link 
            to="/services" 
            class="inline-block border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Lihat Layanan
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Component logic here
</script>

"use client"

import type React from "react"
import { useEffect } from "react"
import AOS from 'aos';
import 'aos/dist/aos.css';

const VisionMission: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-out-cubic",
    })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20" data-aos="fade-up">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-full mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-700 text-sm font-semibold tracking-wider uppercase">About Us</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Tentang{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Perusahaan</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Membangun masa depan teknologi fiber optik Indonesia dengan inovasi dan dedikasi
            </p>
          </div>

          {/* About Company Section */}
          <div className="mb-20" data-aos="fade-up">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-lg">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-8 text-center">
                  PT Fiber Teknologi{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Nusantara
                  </span>
                </h2>
                
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-12 items-center">
                  {/* Company Description */}
                  <div className="space-y-6">
                    <p className="text-lg text-gray-700 leading-relaxed text-justify">
                      <strong className="text-blue-700">PT Fiber Teknologi Nusantara</strong> adalah perusahaan yang bergerak di bidang penyediaan infrastruktur pasif telekomunikasi yang berfokus pada solusi fiber optik berkualitas tinggi untuk mendukung transformasi digital Indonesia.
                    </p>
                    
                    <p className="text-lg text-gray-700 leading-relaxed text-justify">
                      Dengan pengalaman dan keahlian yang mendalam, kami berkomitmen untuk menghadirkan infrastruktur digital yang andal, efisien, dan sesuai dengan standar internasional. Perusahaan kami hadir sebagai mitra strategis bagi pemerintah daerah, operator telekomunikasi, dan berbagai instansi dalam mewujudkan konektivitas yang optimal.
                    </p>
                    
                    <p className="text-lg text-gray-700 leading-relaxed text-justify">
                      Sebagai bagian dari upaya mendukung program Smart City dan digitalisasi Indonesia, kami terus berinovasi dalam menyediakan solusi infrastruktur yang tidak hanya berkualitas tinggi, tetapi juga ramah lingkungan dan berkelanjutan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vision & Mission Section Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Visi &{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Misi</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Komitmen kami dalam membangun masa depan teknologi fiber optik Indonesia
            </p>
          </div>

          {/* Vision & Mission Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
            {/* Vision Card */}
            <div
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2"
              data-aos="fade-right"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon Container */}
              <div className="relative p-8 lg:p-12">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>

                <div className="absolute top-8 left-8 w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>

                <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 group-hover:text-blue-700 transition-colors duration-300">
                  VISI
                </h2>

                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed font-medium text-justify">
                  Menjadi perusahaan penyedia infrastruktur yang handal dan berstandar tinggi, serta berperan aktif dalam mewujudkan transformasi digital kota menuju Smart City yang modern, efisien, dan berkelanjutan.
                </p>

                {/* Decorative Elements */}
                <div className="absolute bottom-8 right-8 w-16 h-16 border-2 border-blue-200 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="absolute bottom-12 right-12 w-8 h-8 border-2 border-blue-300 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-blue-400/0 group-hover:border-blue-400/20 transition-colors duration-500 pointer-events-none"></div>
            </div>

            {/* Mission Card */}
            <div
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2"
              data-aos="fade-left"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon Container */}
              <div className="relative p-8 lg:p-12">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>

                <div className="absolute top-8 right-8 w-12 h-1 bg-gradient-to-l from-blue-400 to-blue-600 rounded-full"></div>

                <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 group-hover:text-blue-700 transition-colors duration-300">
                  MISI
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-lg text-gray-700 leading-relaxed text-justify">
                      Menata Estetika Perkotaan : Mengintegrasikan solusi infrastruktur yang modern dan tertata guna mengurangi kesemrawutan kabel udara serta meningkatkan estetika dan keamanan lingkungan perkotaan.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-lg text-gray-700 leading-relaxed text-justify">
                      Meningkatkan Efisiensi dan Keberlanjutan : Mengoptimalkan pemanfaatan infrastruktur pasif secara bersama guna mengurangi redundansi jaringan, meningkatkan efisiensi biaya, serta mendukung penggunaan teknologi ramah lingkungan.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-lg text-gray-700 leading-relaxed text-justify">
                      Menyediakan Infrastruktur Digital yang Tersertifikasi : Menghadirkan standarisasi infrastruktur digital yang berkualitas, aman, dan sesuai dengan regulasi untuk mendukung konektivitas yang andal.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-lg text-gray-700 leading-relaxed text-justify">
                      Mendukung Transformasi Digital Kota : Berkontribusi dalam percepatan digitalisasi melalui pembangunan infrastruktur digital yang mendukung Smart City, IoT, dan ekosistem digital yang inovatif.
                    </p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-8 left-8 w-16 h-16 border-2 border-blue-200 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="absolute bottom-12 left-12 w-8 h-8 border-2 border-blue-300 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-blue-400/0 group-hover:border-blue-400/20 transition-colors duration-500 pointer-events-none"></div>
            </div>
          </div>

          {/* Values Section */}
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6">
              Nilai-Nilai{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Perusahaan
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Prinsip-prinsip yang menjadi fondasi dalam setiap langkah perjalanan kami
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-justify">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2h-2zm-8 0V8a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h2a2 2 0 012 2z" />
                  </svg>
                ),
                title: "Profesional",
                description: "Sebagai perusahaan yang berorientasi pada keunggulan, kami menjunjung tinggi nilai-nilai profesionalisme, transparansi, dan kepatuhan terhadap regulasi dalam setiap aspek bisnis. Melalui kolaborasi dengan pemerintah daerah, operator telekomunikasi, dan pemangku kepentingan lainnya.",
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
                title: "Terpercaya",
                description: "PT Fiber Teknologi Nusantara terus berupaya menjadi perusahaan yang terpercaya dalam penyediaan infrastruktur pasif telekomunikasi. Dengan komitmen terhadap standarisasi dan kualitas, kami menghadirkan solusi infrastruktur digital yang andal dan berkelanjutan.",
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ),
                title: "Terbaik",
                description: "PT Fiber Teknologi Nusantara terus berupaya menjadi perusahaan terbaik dalam bidang Penyediaan Infrastruktur Pasif Telekomunikasi. Dengan standarisasi tinggi, teknologi modern, dan tenaga ahli berpengalaman, kami menghadirkan solusi infrastruktur telekomunikasi yang andal, efisien, dan berkelanjutan.",
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Terjangkau",
                description: "PT Fiber Teknologi Nusantara berkomitmen untuk menyediakan infrastruktur pasif telekomunikasi yang berkualitas tinggi dengan harga yang terjangkau. Dengan pengalaman dan teknologi modern, kami menghadirkan solusi infrastruktur yang efisien, andal, dan sesuai standar.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/0 group-hover:border-blue-400/20 transition-colors duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 xl:px-32 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative" data-aos="fade-up">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Bergabunglah dengan Visi Kami</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Mari bersama-sama membangun masa depan teknologi fiber optik Indonesia yang lebih baik
              </p>
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                <span>Hubungi Kami</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default VisionMission
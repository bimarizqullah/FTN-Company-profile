"use client"

import type React from "react"
import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
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
              Visi &{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Misi</span>
            </h1>
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

                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed font-medium">
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
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Menata Estetika Perkotaan : Mengintegrasikan solusi infrastruktur yang modern dan tertata guna mengurangi kesemrawutan kabel udara serta meningkatkan estetika dan keamanan lingkungan perkotaan.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Meningkatkan Efisiensi dan Keberlanjutan : Mengoptimalkan pemanfaatan infrastruktur pasif secara bersama guna mengurangi redundansi jaringan, meningkatkan efisiensi biaya, serta mendukung penggunaan teknologi ramah lingkungan.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Menyediakan Infrastruktur Digital yang Tersertifikasi : Menghadirkan standarisasi infrastruktur digital yang berkualitas, aman, dan sesuai dengan regulasi untuk mendukung konektivitas yang andal.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-lg text-gray-700 leading-relaxed">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
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

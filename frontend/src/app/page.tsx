"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Gallery from './gallery/page';
import Services from './services/page';
import Projects from './projects/page';
import Management from './management/page';
import Slider from './sliders/page';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import VisionMission from './vision-mission/page';

// Komponen utama untuk halaman beranda
const Home: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Inisialisasi AOS untuk animasi
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic',
    });

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Muncul ketika hampir sampai dasar
      if (scrollPosition >= documentHeight - 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      <Head>
        <title>PT. Fiber Teknologi Nusantara - Keunggulan Manufaktur Fiber Optik</title>
        <meta
          name="description"
          content="Perusahaan manufaktur fiber optik terkemuka di Indonesia, menyediakan solusi mutakhir untuk infrastruktur telekomunikasi"
        />
      </Head>

      <Slider />
      <VisionMission />
      <Gallery />
      <Services />
      <Projects />
      <Management />

      {/* Tombol Scroll to Top dengan AOS */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 z-50"
          data-aos="zoom-in" // animasi dari AOS
          data-aos-offset="0"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Home;

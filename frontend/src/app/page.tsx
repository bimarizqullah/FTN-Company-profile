"use client";

import React, { useEffect } from 'react';
import Head from 'next/head';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Gallery from './gallery/page';
import Services from './services/page';
import Projects from './projects/page';
import Management from './management/page';
import Slider from './sliders/page';

// Komponen utama untuk halaman beranda
const Home: React.FC = () => {
  // Inisialisasi AOS untuk animasi
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Head>
        <title>PT. Fiber Teknologi Nusantara - Keunggulan Manufaktur Fiber Optik</title>
        <meta
          name="description"
          content="Perusahaan manufaktur fiber optik terkemuka di Indonesia, menyediakan solusi mutakhir untuk infrastruktur telekomunikasi"
        />
      </Head>
      <Slider />
      <Gallery />
      <Services />
      <Projects />
      <Management />
    </div>
  );
};

export default Home;

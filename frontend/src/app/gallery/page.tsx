"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Slider from '../sliders/page';

interface Gallery {
  id: number;
  imagePath: string;
  description: string;
}

const Gallery: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<Gallery | null>(null);

  const API_BASE_URL = '/api';
  const IMAGE_BASE_URL = '/uploads';

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic',
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const galleryRes = await fetch(`${API_BASE_URL}/gallery`);
        const galleryData = await galleryRes.json();
        setGalleries(Array.isArray(galleryData) ? galleryData : []);
      } catch (error: any) {
        console.error('Error fetching gallery:', error.message);
        setError('Failed to load gallery. Please try again later.');
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Head>
        <title>PT. Fiber Teknologi Nusantara - Gallery</title>
        <meta name="description" content="Explore our gallery showcasing fiber optic innovations and achievements" />
      </Head>
      {error && (
        <div className="fixed top-6 right-6 z-50 max-w-md">
          <div className="bg-red-500/10 backdrop-blur-xl border border-red-200/20 text-red-700 px-6 py-4 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-sm">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20" data-aos="fade-up">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-full mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-700 text-sm font-semibold tracking-wider uppercase">Gallery</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Galeri <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Kami</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Temukan portofolio inovasi Fiber optik dan keunggulan manufaktur kami
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {galleries.map((gallery, index) => (
              <div
                key={gallery.id}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-1 cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                onClick={() => setSelectedImage(gallery)}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={`${IMAGE_BASE_URL}/${gallery.imagePath.replace(/^\/uploads\//, '')}`}
                    alt={gallery.description || 'Gallery Image'}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                    onError={() => console.log('Image failed to load:', gallery.imagePath)}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  {/* View Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                      <img src="/assets/logo-ftn-2.png" alt="Logo" className="h-10 w-auto" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8">
                  <p className="text-gray-600 leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                    {gallery.description || "Explore our innovative fiber optic solutions"}
                  </p>
                  
                  {/* View Button */}
                  <button className="inline-flex items-center gap-2 text-blue-600 font-semibold mt-4 hover:gap-3 transition-all duration-300 group/btn opacity-0 group-hover:opacity-100">
                    <span>Lihat Selengkapnya</span>
                    <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-blue-400/0 group-hover:border-blue-400/20 transition-colors duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {galleries.length === 0 && !error && (
            <div className="text-center py-20" data-aos="fade-up">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Tidak ada gambar</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Galeri kami belum ada perubahan, silahan kembali lagi esok!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal for Image Preview */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video">
              <Image
                src={`${IMAGE_BASE_URL}/${selectedImage.imagePath.replace(/^\/uploads\//, '')}`}
                alt={selectedImage.description || 'Gallery Image'}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-t-3xl"
              />
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-300"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {selectedImage.description || "Explore our innovative fiber optic solutions"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-12 lg:p-16 shadow-2xl relative overflow-hidden" data-aos="fade-up">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Tertarik dengan kami?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Mari ciptakan sesuatu yang luar biasa bersama. Jelajahi bagaimana kami dapat mewujudkan visi Anda.
              </p>
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl">
                <span>Mulai Proyek Anda</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
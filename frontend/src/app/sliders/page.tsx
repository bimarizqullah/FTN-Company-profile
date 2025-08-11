"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Slider {
  id: number;
  imagePath: string;
  tagline?: string;
  title?: string;
  subtitle?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
}

const Slider: React.FC = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = '/api';
  const IMAGE_BASE_URL = '/uploads';

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      offset: 50,
      easing: 'ease-out-quart',
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sliderRes = await fetch(`${API_BASE_URL}/sliders`);
        const sliderData = await sliderRes.json();
        setSliders(Array.isArray(sliderData) ? sliderData.filter((s: Slider) => s.status === 'active') : []);
      } catch (error: any) {
        console.error('Error fetching sliders:', error.message);
        setError('Failed to load sliders. Please try again later.');
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (sliders.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliders.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [sliders]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/30">
      <Head>
        <title>PT. Fiber Teknologi Nusantara - Innovation in Fiber Optics</title>
        <meta name="description" content="Leading fiber optic technology solutions with cutting-edge manufacturing excellence" />
      </Head>

      {error && (
        <div className="fixed top-6 right-6 z-50 max-w-md">
          <div className="bg-red-500/10 backdrop-blur-xl border border-red-200/20 text-red-700 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium text-sm">{error}</span>
            </div>
          </div>
        </div>
      )}

      <section className="relative w-full h-screen overflow-hidden">
        {sliders.length > 0 && (
          <div className="relative w-full h-full">
            {/* Background Image with Parallax Effect */}
            <div className="absolute inset-0 transition-all duration-1000 ease-out">
              <Image
                src={`${IMAGE_BASE_URL}/${sliders[currentSlide].imagePath.replace(/^\/uploads\//, '')}`}
                alt={sliders[currentSlide].title || ''}
                fill
                style={{ objectFit: 'cover' }}
                className="scale-110 transition-transform duration-[8000ms] ease-out hover:scale-105"
                priority={true}
                onError={() => console.log('Image failed to load:', sliders[currentSlide].imagePath)}
              />
            </div>
            
            {/* Modern Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/70 to-blue-800/20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-950/30"></div>
            
            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-32">
              <div className="max-w-5xl">
                {/* Company Badge */}
                <div className="mb-8" data-aos="fade-up" data-aos-delay="200">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-white/90 text-sm font-semibold tracking-wider uppercase">
                      PT. FIBER TEKNOLOGI NUSANTARA
                    </span>
                  </div>
                </div>
                
                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tight" data-aos="fade-up" data-aos-delay="400">
                  <span className="block">
                    {sliders[currentSlide].title?.split(' ')[0] || "Fiber"}
                  </span>
                  <span className="block bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                    {sliders[currentSlide].title?.split(' ').slice(1).join(' ') || "Innovation"}
                  </span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-xl md:text-2xl lg:text-3xl text-blue-100/90 mb-6 max-w-3xl leading-relaxed font-light" data-aos="fade-up" data-aos-delay="600">
                  {sliders[currentSlide].subtitle || "Pioneering the future of telecommunications with cutting-edge fiber optic solutions"}
                </p>
                
                {/* Tagline */}
                <p className="text-lg md:text-xl text-blue-200/80 mb-12 max-w-2xl font-light" data-aos="fade-up" data-aos-delay="800">
                  {sliders[currentSlide].tagline || "Excellence in manufacturing, innovation in technology"}
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 lg:gap-6" data-aos="fade-up" data-aos-delay="1000">
                  <button className="group px-8 py-4 lg:px-10 lg:py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 shadow-2xl hover:shadow-blue-500/25 border border-blue-400/20">
                    <span className="flex items-center justify-center gap-3">
                      Explore Solutions
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>
                  <button className="group px-8 py-4 lg:px-10 lg:py-5 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white hover:text-blue-900 font-semibold rounded-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 shadow-2xl">
                    <span className="flex items-center justify-center gap-3">
                      Contact Us
                      <svg className="w-5 h-5 transition-transform group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Modern Slide Indicators */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
              {sliders.map((_, index) => (
                <button
                  key={index}
                  className={`relative overflow-hidden rounded-full transition-all duration-500 ${
                    index === currentSlide 
                      ? 'w-12 h-3 bg-white' 
                      : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                >
                  {index === currentSlide && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 right-8" data-aos="fade-up" data-aos-delay="1200">
              <div className="flex flex-col items-center gap-2 text-white/60">
                <span className="text-xs font-medium tracking-widest uppercase rotate-90 origin-center">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent"></div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Slider;
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
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Head>
        <title>PT. Fiber Teknologi Nusantara - Gallery</title>
        <meta name="description" content="Explore our gallery of fiber optic manufacturing excellence" />
      </Head>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 m-4 rounded-r-lg shadow-sm" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <span className="block sm:inline font-medium">{error}</span>
            </div>
          </div>
        </div>
      )}

      <section className="relative w-full h-screen overflow-hidden">
        {sliders.length > 0 && (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
              <Image
                src={`${IMAGE_BASE_URL}/${sliders[currentSlide].imagePath.replace(/^\/uploads\//, '')}`}
                alt={sliders[currentSlide].title || 'Slider'}
                fill
                style={{ objectFit: 'cover' }}
                className="scale-105 transition-transform duration-[6000ms] ease-out"
                priority={true}
                onError={() => console.log('Image failed to load:', sliders[currentSlide].imagePath)}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
              <div className="max-w-4xl">
                <div className="mb-6" data-aos="fade-up" data-aos-delay="200">
                  <span className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-300/30 rounded-full text-blue-100 text-sm font-medium tracking-wide">
                    PT. FIBER TEKNOLOGI NUSANTARA
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" data-aos="fade-up" data-aos-delay="400">
                  {sliders[currentSlide].title || "Fiber Optic Innovation"}
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 mb-4 max-w-2xl leading-relaxed" data-aos="fade-up" data-aos-delay="600">
                  {sliders[currentSlide].subtitle || "Leading the future of telecommunications infrastructure"}
                </p>
                <p className="text-lg text-blue-200 mb-8 max-w-xl" data-aos="fade-up" data-aos-delay="800">
                  {sliders[currentSlide].tagline || "Manufacturing excellence in fiber optic solutions"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4" data-aos="fade-up" data-aos-delay="1000">
                  <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Explore Our Solutions
                  </button>
                  <button className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold rounded-lg transition-all duration-300">
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {sliders.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentSlide ? 'bg-white' : 'bg-gray-400'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Slider;
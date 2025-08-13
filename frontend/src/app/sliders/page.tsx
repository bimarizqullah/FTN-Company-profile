"use client";

import React, { useEffect, useState } from 'react';

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

const ModernSlider: React.FC = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');



  const API_BASE_URL = '/api';
  const IMAGE_BASE_URL = '/uploads';

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

  const goToSlide = (index: number, slideDirection: 'next' | 'prev' = 'next') => {
    if (isTransitioning || index === currentSlide) return;
    
    setDirection(slideDirection);
    setNextSlide(index);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 1200);
  };

  const nextSlideHandler = () => {
    const next = (currentSlide + 1) % sliders.length;
    goToSlide(next, 'next');
  };

  const prevSlideHandler = () => {
    const prev = (currentSlide - 1 + sliders.length) % sliders.length;
    goToSlide(prev, 'prev');
  };

  useEffect(() => {
    if (sliders.length > 1) {
      const timer = setInterval(nextSlideHandler, 8000);
      return () => clearInterval(timer);
    }
  }, [currentSlide, sliders.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlideHandler();
      if (e.key === 'ArrowRight') nextSlideHandler();
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);

  if (sliders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
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
        {/* Slide Container */}
        <div className="relative w-full h-full">
          {/* Current Slide */}
          <div className={`absolute inset-0 transition-all duration-1000 ease-out ${
            isTransitioning 
              ? direction === 'next' 
                ? '-translate-x-full opacity-0 scale-110' 
                : 'translate-x-full opacity-0 scale-110'
              : 'translate-x-0 opacity-100 scale-100'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-blue-900/30"></div>
            <img
              src={sliders[currentSlide].imagePath.startsWith('/api/placeholder') 
                ? sliders[currentSlide].imagePath 
                : `${IMAGE_BASE_URL}/${sliders[currentSlide].imagePath.replace(/^\/uploads\//, '')}`}
              alt={sliders[currentSlide].title || ''}
              className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out scale-105 hover:scale-110"
              onError={(e) => {
                console.log('Image failed to load:', sliders[currentSlide].imagePath);
                (e.target as HTMLImageElement).src = '/api/placeholder/1920/1080';
              }}
            />
          </div>
          
          {/* Next Slide (for smooth transition) */}
          {isTransitioning && (
            <div className={`absolute inset-0 transition-all duration-1000 ease-out ${
              direction === 'next' 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-0 opacity-100'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-blue-900/30"></div>
              <img
                src={`${IMAGE_BASE_URL}/${sliders[nextSlide].imagePath.replace(/^\/uploads\//, '')}`}
                alt={sliders[nextSlide].title || ''}
                className="w-full h-full object-cover scale-105"
                onError={(e) => {
                  console.log('Image failed to load:', sliders[nextSlide].imagePath);
                }}
              />
            </div>
          )}
          
          {/* Dynamic Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
          
          {/* Animated Background Particles */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/10 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 4 + 2}s`
                }}
              />
            ))}
          </div>
          
          {/* Content Container */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-32 z-10">
            <div className="max-w-6xl">
              {/* Company Badge with Animation */}
              <div className={`mb-8 transform transition-all duration-[1000ms] delay-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                isTransitioning ? 'translate-y-12 opacity-0 scale-95 blur-sm' : 'translate-y-0 opacity-100 scale-100 blur-0'
              }`}>
                <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl group hover:bg-white/10 transition-all duration-700 hover:scale-105">
                  <div className="relative">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-white/95 text-sm md:text-base font-bold tracking-wider uppercase bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    PT. FIBER TEKNOLOGI NUSANTARA
                  </span>
                </div>
              </div>
              
              {/* Main Heading with Stagger Animation */}
              <div className={`transform transition-all duration-[1200ms] delay-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                isTransitioning ? 'translate-y-16 opacity-0 scale-95 blur-sm' : 'translate-y-0 opacity-100 scale-100 blur-0'
              }`}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white mb-8 leading-[0.85] tracking-tight">
                  <span className="block transform transition-all duration-[900ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-105 origin-left">
                    {sliders[currentSlide].title?.split(' ')[0] || 'Innovation'}
                  </span>
                  <span className="block bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent transform transition-all duration-[900ms] delay-100 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-105 origin-left">
                    {sliders[currentSlide].title?.split(' ').slice(1).join(' ') || 'Excellence'}
                  </span>
                </h1>
              </div>
              
              {/* Subtitle with Slide Animation */}
              <div className={`transform transition-all duration-[1100ms] delay-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                isTransitioning ? 'translate-x-12 opacity-0 scale-95 blur-sm' : 'translate-x-0 opacity-100 scale-100 blur-0'
              }`}>
                <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-blue-100/95 mb-6 max-w-4xl leading-relaxed font-light">
                  {sliders[currentSlide].subtitle || "Pioneering the future of telecommunications with cutting-edge fiber optic solutions"}
                </p>
              </div>
              
              {/* Tagline */}
              <div className={`transform transition-all duration-[1000ms] delay-800 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                isTransitioning ? 'translate-x-12 opacity-0 scale-95 blur-sm' : 'translate-x-0 opacity-100 scale-100 blur-0'
              }`}>
                <p className="text-lg md:text-xl lg:text-2xl text-blue-200/80 mb-12 max-w-3xl font-light leading-relaxed">
                  {sliders[currentSlide].tagline || "Excellence in manufacturing, innovation in technology"}
                </p>
              </div>
              
              {/* CTA Buttons with Bounce Animation */}
              <div className={`flex flex-col sm:flex-row gap-4 lg:gap-6 transform transition-all duration-[1100ms] delay-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                isTransitioning ? 'translate-y-12 opacity-0 scale-90 blur-sm' : 'translate-y-0 opacity-100 scale-100 blur-0'
              }`}>
                <button className="group relative px-10 py-5 lg:px-12 lg:py-6 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 hover:from-blue-500 hover:via-blue-400 hover:to-blue-300 text-white font-bold text-lg rounded-2xl transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] transform hover:scale-105 hover:-translate-y-3 shadow-2xl hover:shadow-blue-500/40 border border-blue-400/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    Explore Solutions
                    <svg className="w-6 h-6 transition-transform duration-[500ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
                
                <button className="group px-10 py-5 lg:px-12 lg:py-6 bg-white/10 backdrop-blur-2xl border-2 border-white/20 text-white hover:bg-white hover:text-blue-900 font-bold text-lg rounded-2xl transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] transform hover:scale-105 hover:-translate-y-3 shadow-2xl hover:shadow-white/30">
                  <span className="flex items-center justify-center gap-3">
                    Contact Us
                    <svg className="w-6 h-6 transition-transform duration-[500ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Navigation Arrows */}
          {sliders.length > 1 && (
            <>
              <button
                onClick={prevSlideHandler}
                disabled={isTransitioning}
                className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <svg className="w-8 h-8 transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextSlideHandler}
                disabled={isTransitioning}
                className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <svg className="w-8 h-8 transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Modern Progress Indicators */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
            {sliders.map((_, index) => (
              <button
                key={index}
                className={`relative group transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                  index === currentSlide 
                    ? 'w-16 h-4' 
                    : 'w-4 h-4 hover:w-6'
                }`}
                onClick={() => goToSlide(index, index > currentSlide ? 'next' : 'prev')}
                disabled={isTransitioning}
              >
                <div className={`w-full h-full rounded-full transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                  index === currentSlide 
                    ? 'bg-white shadow-lg shadow-white/50' 
                    : 'bg-white/40 group-hover:bg-white/70'
                }`}>
                  {index === currentSlide && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full animate-pulse"></div>
                  )}
                </div>
              </button>
            ))}
          </div>          
          {/* Slide Counter */}
          <div className="absolute top-8 right-8 z-20">
            <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-3">
              <span className="text-white/90 font-bold">
                {String(currentSlide + 1).padStart(2, '0')} / {String(sliders.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernSlider;
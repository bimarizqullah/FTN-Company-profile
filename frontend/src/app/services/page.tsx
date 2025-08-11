"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Service {
  id: number;
  imagePath: string;
  name: string;
  description: string;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
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
        const serviceRes = await fetch(`${API_BASE_URL}/services`);
        const serviceData = await serviceRes.json();
        setServices(Array.isArray(serviceData) ? serviceData : []);
      } catch (error: any) {
        console.error('Error fetching services:', error.message);
        setError('Failed to load services. Please try again later.');
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Head>
        <title>PT. Fiber Teknologi Nusantara - Premium Services</title>
        <meta name="description" content="Comprehensive fiber optic solutions and premium services" />
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
              <span className="text-blue-700 text-sm font-semibold tracking-wider uppercase">Our Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Premium <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Solutions</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Comprehensive fiber optic services designed for the future of connectivity
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 border border-white/20"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={`${IMAGE_BASE_URL}/${service.imagePath.replace(/^\/uploads\//, '')}`}
                    alt={service.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-700 group-hover:scale-110"
                    onError={() => console.log('Image failed to load:', service.imagePath)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Floating Icon */}
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {service.description}
                  </p>
                  
                  {/* Learn More Button */}
                  <button className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-300 group/btn">
                    <span>Learn More</span>
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
          {services.length === 0 && !error && (
            <div className="text-center py-20" data-aos="fade-up">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Services Available</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Our services are currently being updated. Please check back soon for our comprehensive offerings.
              </p>
            </div>
          )}
        </div>
      </section>

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
                Ready to Transform Your Infrastructure?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Let's discuss how our fiber optic solutions can elevate your connectivity needs.
              </p>
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl">
                <span>Get Started Today</span>
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

export default Services;
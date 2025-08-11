"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Management {
  id: number;
  imagePath: string;
  name: string;
  position: string;
  status: 'active' | 'inactive';
}

const Management: React.FC = () => {
  const [management, setManagement] = useState<Management[]>([]);
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
        const managementRes = await fetch(`${API_BASE_URL}/management`);
        const managementData = await managementRes.json();
        setManagement(Array.isArray(managementData.data) ? managementData.data.filter((m: Management) => m.status === 'active') : []);
      } catch (error: any) {
        console.error('Error fetching management:', error.message);
        setError('Failed to load management team. Please try again later.');
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Head>
        <title>PT. Fiber Teknologi Nusantara - Leadership Team</title>
        <meta name="description" content="Meet our visionary leadership team driving innovation in fiber optics" />
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
              <span className="text-blue-700 text-sm font-semibold tracking-wider uppercase">Leadership</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Our <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Leaders</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Visionary minds driving innovation and excellence in fiber optic technology
            </p>
          </div>

          {/* Management Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            {management.length > 0 ? (
              management.map((member, index) => (
                <div
                  key={member.id}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={`${IMAGE_BASE_URL}/${member.imagePath.replace(/^\/uploads\//, '')}`}
                      alt={member.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      onError={() => console.log('Image failed to load:', member.imagePath)}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    
                    {/* Professional Badge */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-8 text-center relative">
                    {/* Background Decoration */}
                    <div className="absolute top-0 left-1/2 w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-semibold mb-4 text-sm lg:text-base uppercase tracking-wider">
                      {member.position}
                    </p>
                    
                    {/* Connect Button */}
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-full transition-all duration-300 transform hover:scale-105 opacity-0 group-hover:opacity-100">
                      <span className="text-sm">Connect</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-blue-400/0 group-hover:border-blue-400/20 transition-colors duration-500 pointer-events-none"></div>
                  
                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20" data-aos="fade-up">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Team Members Available</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Our leadership team information is currently being updated. Please check back soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 xl:px-32 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center" data-aos="fade-up">
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
              <div className="relative p-8">
                <div className="text-4xl lg:text-5xl font-black text-white mb-2">15+</div>
                <div className="text-blue-100 font-semibold uppercase tracking-wider">Years Experience</div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
              <div className="relative p-8">
                <div className="text-4xl lg:text-5xl font-black text-white mb-2">100+</div>
                <div className="text-blue-100 font-semibold uppercase tracking-wider">Projects Delivered</div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
              <div className="relative p-8">
                <div className="text-4xl lg:text-5xl font-black text-white mb-2">50+</div>
                <div className="text-blue-100 font-semibold uppercase tracking-wider">Team Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-3xl p-12 lg:p-16 shadow-xl relative overflow-hidden" data-aos="fade-up">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500 rounded-full translate-x-20 translate-y-20"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Want to Join Our Team?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                We're always looking for talented individuals who share our passion for innovation and excellence.
              </p>
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-2xl hover:from-blue-500 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                <span>View Careers</span>
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

export default Management;
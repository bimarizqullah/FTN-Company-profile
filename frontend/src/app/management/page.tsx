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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Head>
        <title>PT. Fiber Teknologi Nusantara - Management Team</title>
        <meta name="description" content="Meet our dedicated management team" />
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

      <section className="py-16 px-4 md:px-8">
        <h2 className="text-black text-3xl font-bold text-center mb-12">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {management.length > 0 ? (
            management.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <Image
                  src={`${IMAGE_BASE_URL}/${member.imagePath.replace(/^\/uploads\//, '')}`}
                  alt={member.name}
                  width={400}
                  height={400}
                  style={{ objectFit: 'cover' }}
                  onError={() => console.log('Image failed to load:', member.imagePath)}
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-gray-600">{member.position}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No team members available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Management;
"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

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

interface Service {
  id: number;
  imagePath: string;
  name: string;
  description: string;
}

interface Project {
  id: number;
  imagePath: string;
  name: string;
  location: string;
  description: string;
  status: 'ongoing' | 'pending' | 'terminated';
}

interface Management {
  id: number;
  imagePath: string;
  name: string;
  position: string;
  status: 'active' | 'inactive';
}

const Home: React.FC = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [management, setManagement] = useState<Management[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = '/api'; // Proxy untuk API (menuju 192.168.1.24:3000)
  const IMAGE_BASE_URL = '/uploads'; // Proxy untuk gambar (menuju 192.168.1.24:3000/uploads)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching from:', API_BASE_URL);
        const [sliderRes, serviceRes, projectRes, managementRes] = await Promise.all([
          fetch(`${API_BASE_URL}/sliders`),
          fetch(`${API_BASE_URL}/services`),
          fetch(`${API_BASE_URL}/project`), // Perbaiki ke /projects (plural)
          fetch(`${API_BASE_URL}/management`),
        ]);
        const sliderData = await sliderRes.json();
        const serviceData = await serviceRes.json();
        const projectData = await projectRes.json();
        const managementData = await managementRes.json();
        console.log('Sliders:', sliderData);
        console.log('Services:', serviceData);
        console.log('Projects:', projectData);
        console.log('Management:', managementData);

        // Pastikan data adalah array sebelum filter
        setSliders(Array.isArray(sliderData) ? sliderData.filter((s: Slider) => s.status === 'active') : []);
        setServices(Array.isArray(serviceData) ? serviceData : []);
        setProjects(Array.isArray(projectData) ? projectData : []);
        setManagement(Array.isArray(managementData.data) ? managementData.data.filter((m: Management) => m.status === 'active') : []);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
        setError('Failed to load data. Please try again later.');
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (sliders.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliders.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [sliders]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Company Profile</title>
        <meta name="description" content="Welcome to our company profile" />
      </Head>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <section className="relative w-full h-[600px]">
        {sliders.length > 0 && (
          <div className="relative w-full h-full">
            <Image
              src={`${IMAGE_BASE_URL}/${sliders[currentSlide].imagePath.replace(/^\/uploads\//, '')}`}
              alt={sliders[currentSlide].title || 'Slider'}
              fill
              style={{ objectFit: 'cover' }}
              className="brightness-50"
              priority={true}
              onError={() => console.log('Image failed to load:', sliders[currentSlide].imagePath)}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {sliders[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl">{sliders[currentSlide].subtitle}</p>
              <p className="text-lg mt-2">{sliders[currentSlide].tagline}</p>
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

      <section className="py-16 px-4 md:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Image
                src={`${IMAGE_BASE_URL}/${service.imagePath.replace(/^\/uploads\//, '')}`}
                alt={service.name}
                width={400}
                height={200}
                style={{ objectFit: 'cover' }}
                onError={() => console.log('Image failed to load:', service.imagePath)}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-12">Our Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Image
                src={`${IMAGE_BASE_URL}/${project.imagePath.replace(/^\/uploads\//, '')}`}
                alt={project.name}
                width={400}
                height={200}
                style={{ objectFit: 'cover' }}
                onError={() => console.log('Image failed to load:', project.imagePath)}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <p className="text-gray-600 mb-2">{project.location}</p>
                <p className="text-gray-600">{project.description}</p>
                <span
                  className={`inline-block mt-4 px-3 py-1 rounded-full text-sm ${
                    project.status === 'ongoing'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 md:px-8">
    <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
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

      <footer className="py-8 px-4 bg-gray-800 text-white text-center">
        <p>&copy; {new Date().getFullYear()} Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
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
        console.log('Fetching from:', API_BASE_URL);
        const [sliderRes, serviceRes, projectRes, managementRes] = await Promise.all([
          fetch(`${API_BASE_URL}/sliders`),
          fetch(`${API_BASE_URL}/services`),
          fetch(`${API_BASE_URL}/project`),
          fetch(`${API_BASE_URL}/management`),
        ]);
        const sliderData = await sliderRes.json();
        const serviceData = await serviceRes.json();
        const projectData = await projectRes.json();
        const managementData = await managementRes.json();

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
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [sliders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'terminated':
        return 'bg-red-100 text-red-700 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Head>
        <title>PT. Fiber Teknologi Nusantara - Fiber Optic Manufacturing Excellence</title>
        <meta name="description" content="Leading fiber optic manufacturing company in Indonesia, providing cutting-edge solutions for telecommunications infrastructure" />
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

      {/* Hero Section */}
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
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-transparent"></div>
            
            {/* Content */}
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
"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Project {
  id: number;
  imagePath: string;
  name: string;
  location: string;
  description: string;
  status: 'ongoing' | 'pending' | 'terminated';
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
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
        const projectRes = await fetch(`${API_BASE_URL}/project`);
        const projectData = await projectRes.json();
        setProjects(Array.isArray(projectData) ? projectData : []);
      } catch (error: any) {
        console.error('Error fetching projects:', error.message);
        setError('Failed to load projects. Please try again later.');
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Head>
        <title>PT. Fiber Teknologi Nusantara - Projects</title>
        <meta name="description" content="Explore our ongoing and completed fiber optic projects" />
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

      <section className="py-16 px-4 md:px-8 bg-gray-100">
        <h2 className="text-black text-3xl font-bold text-center mb-12">Our Projects</h2>
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
    </div>
  );
};

export default Projects;
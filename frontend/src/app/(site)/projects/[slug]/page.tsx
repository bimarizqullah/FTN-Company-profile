"use client"
import React from 'react';
import { useParams } from "next/navigation";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProjectDetails() {
  const { slug } = useParams();

  const projectData = {
    madiun: {
      name: "Revitalization & Development of Passive Telecommunication Infrastructure – Madiun City",
      location: "Madiun, East Java",
      status: "On Progress",
      description: [
        "Currently, PT Fiber Teknologi Nusantara is carrying out a project for the revitalization and development of passive telecommunication infrastructure in Madiun City.",
        "In collaboration with the Madiun City Government, we strive to provide standardized, well-organized, and sustainable telecommunication infrastructure to support the city's digital transformation and enhance the quality of telecommunication services for the community.",
        "Through efficient and environmentally friendly work methods, we ensure that the excavation and installation of ducts and subducts are conducted with high standards, minimizing the impact on the city's aesthetics, and supporting the integration of a modern telecommunication system.",
        "This project is part of PT Fiber Teknologi Nusantara’s commitment to creating a reliable digital infrastructure network while helping Madiun City become a smarter, more connected city, ready to embrace the digital era."
      ],
      highlights: [
        "Collaboration with Madiun City Government",
        "Standardized duct & subduct installation",
        "Environmentally friendly excavation",
        "Support for Smart City transformation"
      ],
      images: [
        "/images/projects/madiun1.jpg",
        "/images/projects/madiun2.jpg",
        "/images/projects/madiun3.jpg"
      ],
      maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.047149016038!2d111.521!3d-7.629"
    }
  };

  const project = projectData[slug as keyof typeof projectData];

  if (!project) {
    return <div className="pt-40 text-center">Project not found</div>;
  }

  return (
    <section className="!pt-44 pb-20 relative">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="lg:col-span-8 col-span-12">
            <h1 className='lg:text-52 text-40 font-semibold text-dark dark:text-white'>{project.name}</h1>
            <div className="flex gap-2.5">
              <Icon icon="ph:map-pin" width={24} height={24} className="text-dark/50 dark:text-white/50" />
              <p className='text-dark/50 dark:text-white/50 text-xm'>{project.location}</p>
            </div>
            <p className="mt-2 text-blue-500 font-semibold">{project.status}</p>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-12 mt-8 gap-8">
          {project.images.map((img, idx) => (
            <div key={idx} className="lg:col-span-4 col-span-12">
              <Image src={img} alt={`Image ${idx+1}`} width={400} height={300} className="rounded-2xl w-full" unoptimized />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mt-10 lg:col-span-8 col-span-12">
          <h3 className='text-xl font-medium mb-4'>Project Overview</h3>
          {project.description.map((desc, idx) => (
            <p key={idx} className='text-dark dark:text-white text-base mb-3'>{desc}</p>
          ))}

          <h3 className='text-xl font-medium mt-6 mb-3'>Key Highlights</h3>
          <ul className="list-disc pl-6 text-dark dark:text-white">
            {project.highlights.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Map */}
        <div className="mt-10">
          <iframe
            src={project.maps}
            width="100%"
            height="400"
            loading="lazy"
            className="rounded-2xl"
          ></iframe>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-blue-500 p-6 rounded-2xl text-white flex justify-between items-center">
          <p className="font-semibold">Want to learn more about this project?</p>
          <Link href="/contact" className="bg-white text-blue-500 px-6 py-2 rounded-full hover:bg-gray-100 duration-300">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

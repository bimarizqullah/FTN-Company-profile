"use client"

import type React from "react"
import { useEffect } from "react"
import Head from "next/head"
import AOS from "aos"
import "aos/dist/aos.css"

interface ContactPerson {
  name: string
  position: string
  email: string
  phone: string
  department: string
}

interface Office {
  type: "Head Office" | "Branch Office"
  name: string
  address: string
  city: string
  phone: string
  email: string
  contactPersons: ContactPerson[]
}

const Contact: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-out-cubic",
    })
  }, [])

  const offices: Office[] = [
    {
      type: "Head Office",
      name: "PT. Fiber Teknologi Nusantara",
      address: "Jl. Sudirman No. 123, Gedung Teknologi Lt. 15",
      city: "Jakarta Pusat, DKI Jakarta 10220",
      phone: "(0351) 2816378",
      email: "info@fiberteknologinusantara.com",
      contactPersons: [
        {
          name: "John Doe",
          position: "Head Administrator",
          email: "John.doe@fibertekno.co.id",
          phone: "+62 812 3456 7890",
          department: "Management",
        },
      ],
    },
    {
      type: "Branch Office",
      name: "PT. Fiber Teknologi Nusantara - Madiun",
      address: "Jl. Karta Wijaya No.30, Klegen, Kec. Kartoharjo, Kota Madiun, Jawa Timur 63117",
      city: "Madiun, Jawa Timur 60271",
      phone: "+62 857-3613-2366",
      email: "info@fiberteknologinusantara.com",
      contactPersons: [
        {
          name: "Bambang Puguh Tri S",
          position: "Branch Administrator",
          email: "bambang@fibertekno.co.id",
          phone: "+62 815 6789 0123",
          department: "Management",
        },
      ],
    },
  ]

  const getDepartmentColor = (department: string) => {
    switch (department.toLowerCase()) {
      case "management":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "sales & marketing":
        return "bg-green-100 text-green-800 border-green-200"
      case "technical":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "operations":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "customer service":
        return "bg-pink-100 text-pink-800 border-pink-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDepartmentIcon = (department: string) => {
    switch (department.toLowerCase()) {
      case "management":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        )
      case "sales & marketing":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )
      case "technical":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case "operations":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        )
      case "customer service":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        )
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>PT. Fiber Teknologi Nusantara - Contact Us</title>
        <meta name="description" content="Get in touch with our team across Indonesia for fiber optic solutions" />
      </Head>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20" data-aos="fade-up">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-full mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-700 text-sm font-semibold tracking-wider uppercase">Hubungi Kami</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Mari{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Terhubung
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Tim ahli kami siap membantu Anda dengan solusi fiber optik terdepan di seluruh Indonesia.
            </p>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20" data-aos="fade-up" data-aos-delay="200">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email Umum</h3>
              <p className="text-blue-600 font-semibold">info@fiberteknologinusantara.com</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Telepon Pusat</h3>
              <p className="text-green-600 font-semibold">(0351) 2816378</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Jam Operasional</h3>
              <p className="text-purple-600 font-semibold">08:00 - 17:00 WIB</p>
            </div>
          </div>

          {/* Office Locations */}
          <div className="space-y-12">
            {offices.map((office, officeIndex) => (
              <div
                key={officeIndex}
                className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border border-gray-100"
                data-aos="fade-up"
                data-aos-delay={officeIndex * 100}
              >
                {/* Office Header */}
                <div
                  className={`px-8 py-6 ${office.type === "Head Office" ? "bg-gradient-to-r from-blue-600 to-blue-500" : "bg-gradient-to-r from-gray-700 to-gray-600"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            office.type === "Head Office" ? "bg-white/20 text-white" : "bg-white/20 text-white"
                          }`}
                        >
                          {office.type}
                        </div>
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">{office.name}</h2>
                      <div className="flex items-start gap-2 text-blue-100 mb-2">
                        <svg
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <div>
                          <p className="font-medium">{office.address}</p>
                          <p>{office.city}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-blue-100 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="font-medium">{office.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="font-medium">{office.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Persons */}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Contact Person
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {office.contactPersons.map((person, personIndex) => (
                      <div
                        key={personIndex}
                        className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      >
                        {/* Department Badge */}
                        <div className="mb-4">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${getDepartmentColor(person.department)}`}
                          >
                            {getDepartmentIcon(person.department)}
                            <span>{person.department}</span>
                          </div>
                        </div>

                        {/* Person Info */}
                        <div className="mb-4">
                          <h4 className="text-lg font-bold text-gray-900 mb-1">{person.name}</h4>
                          <p className="text-blue-600 font-semibold text-sm">{person.position}</p>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-4 h-4 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</p>
                              <p className="text-sm text-gray-700 font-medium">{person.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-4 h-4 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">WhatsApp</p>
                              <p className="text-sm text-gray-700 font-medium">{person.phone}</p>
                            </div>
                          </div>
                        </div>

                        {/* Contact Button */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <a
                                href="https://wa.me/6281234567890" // ganti dengan link tujuan
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                                </svg>
                                <span>Hubungi Sekarang</span>
                            </a>
                            </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 xl:px-32 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative overflow-hidden" data-aos="fade-up">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
              <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Siap Memulai Proyek Fiber Optik Anda?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Tim ahli kami siap membantu Anda merancang dan mengimplementasikan solusi fiber optik yang tepat untuk
                kebutuhan bisnis Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                  <span>Konsultasi Gratis</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <button className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <span>Download Brochure</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact

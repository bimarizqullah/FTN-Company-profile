"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Head from "next/head"
import AOS from "aos"
import "aos/dist/aos.css"

interface ContactPerson {
  id: number
  name: string
  position: string
  email: string
  whatsapp: string
  status: string
}

interface Office {
  id: number
  name: string
  address: string
  phone: string
  email: string
  status: string
  contacts: ContactPerson[]
}

const Contact: React.FC = () => {
  const [offices, setOffices] = useState<Office[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-out-cubic",
    })

    // Fetch offices with contacts
    fetchOfficesWithContacts()
  }, [])

  const fetchOfficesWithContacts = async () => {
    try {
      setLoading(true)
      
      // Fetch offices data
      const officesResponse = await fetch('/api/office')
      if (!officesResponse.ok) throw new Error('Failed to fetch offices')
      const officesData = await officesResponse.json()

      // Fetch contacts data
      const contactsResponse = await fetch('/api/contact')
      if (!contactsResponse.ok) throw new Error('Failed to fetch contacts')
      const contactsData = await contactsResponse.json()

      // Combine offices with their contacts
      const officesWithContacts = officesData.map((office: Office) => ({
        ...office,
        contacts: contactsData
          .filter((contact: any) => contact.officeId === office.id)
          .map((contact: any) => ({
            id: contact.id,
            name: contact.name,
            position: contact.position,
            email: contact.email,
            whatsapp: contact.whatsapp,
            status: contact.status
          }))
      }))

      setOffices(officesWithContacts)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Gagal memuat data kontak')
    } finally {
      setLoading(false)
    }
  }

  const getOfficeType = (name: string): "Head Office" | "Branch Office" => {
    return name.toLowerCase().includes('head office') ? "Head Office" : "Branch Office"
  }

  const getDepartmentColor = (position: string) => {
    const pos = position.toLowerCase()
    if (pos.includes('administrator') || pos.includes('manager')) {
      return "bg-blue-100 text-blue-800 border-blue-200"
    } else if (pos.includes('sales') || pos.includes('marketing')) {
      return "bg-green-100 text-green-800 border-green-200"
    } else if (pos.includes('technical') || pos.includes('engineer')) {
      return "bg-purple-100 text-purple-800 border-purple-200"
    } else if (pos.includes('operation')) {
      return "bg-orange-100 text-orange-800 border-orange-200"
    } else if (pos.includes('customer') || pos.includes('service')) {
      return "bg-pink-100 text-pink-800 border-pink-200"
    }
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getDepartmentIcon = (position: string) => {
    const pos = position.toLowerCase()
    if (pos.includes('administrator') || pos.includes('manager')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    } else if (pos.includes('technical') || pos.includes('engineer')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
    // Default icon
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  }

  const formatWhatsAppLink = (whatsapp: string) => {
    const cleanNumber = whatsapp.replace(/\D/g, '')
    if (cleanNumber.startsWith('0')) {
      return `https://wa.me/62${cleanNumber.slice(1)}`
    } else if (cleanNumber.startsWith('62')) {
      return `https://wa.me/${cleanNumber}`
    }
    return `https://wa.me/62${cleanNumber}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data kontak...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchOfficesWithContacts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email Umum</h3>
              <p className="text-blue-600 font-semibold">fiber-teknologinusantara@gmail.com</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Telepon Pusat</h3>
              <p className="text-green-600 font-semibold">08123456789</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Jam Operasional</h3>
              <p className="text-purple-600 font-semibold">08:00 - 17:00 WIB</p>
            </div>
          </div>

          {/* Office Locations */}
          <div className="space-y-12">
            {offices.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Data Kantor</h3>
                <p className="text-gray-600">Data kantor dan kontak sedang dalam proses pembaruan.</p>
              </div>
            ) : (
              offices.map((office, officeIndex) => (
                <div
                  key={office.id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border border-gray-100"
                  data-aos="fade-up"
                  data-aos-delay={officeIndex * 100}
                >
                  {/* Office Header */}
                  <div
                    className={`px-8 py-6 ${getOfficeType(office.name) === "Head Office" ? "bg-gradient-to-r from-blue-600 to-blue-500" : "bg-gradient-to-r from-gray-700 to-gray-600"}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                              getOfficeType(office.name) === "Head Office" ? "bg-white/20 text-white" : "bg-white/20 text-white"
                            }`}
                          >
                            {getOfficeType(office.name)}
                          </div>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">{office.name}</h2>
                        <div className="flex items-start gap-2 text-blue-100 mb-2">
                          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <p className="font-medium">{office.address}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-left lg:text-right">
                        <div className="flex items-center gap-2 text-blue-100 mb-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="font-medium">{office.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-100">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Contact Person ({office.contacts.length})
                    </h3>

                    {office.contacts.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-2xl">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <p className="text-gray-500">Belum ada contact person untuk kantor ini</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {office.contacts.map((person, personIndex) => (
                          <div
                            key={person.id}
                            className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                          >
                            {/* Department Badge */}
                            <div className="mb-4">
                              <div
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${getDepartmentColor(person.position)}`}
                              >
                                {getDepartmentIcon(person.position)}
                                <span>Staff</span>
                              </div>
                            </div>

                            {/* Person Info */}
                            <div className="mb-4">
                              <h4 className="text-lg font-bold text-gray-900 mb-1">{person.name}</h4>
                              <p className="text-blue-600 font-semibold text-sm">{person.position}</p>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-3">
                              {person.email && (
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</p>
                                    <p className="text-sm text-gray-700 font-medium">{person.email}</p>
                                  </div>
                                </div>
                              )}

                              {person.whatsapp && (
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">WhatsApp</p>
                                    <p className="text-sm text-gray-700 font-medium">{person.whatsapp}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Contact Button */}
                            {person.whatsapp && (
                              <div className="mt-6 pt-4 border-t border-gray-200">
                                <a
                                  href={formatWhatsAppLink(person.whatsapp)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 text-sm"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  <span>Hubungi Sekarang</span>
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
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
                Tim ahli kami siap membantu Anda merancang dan mengimplementasikan solusi fiber optik yang tepat untuk kebutuhan bisnis Anda.
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
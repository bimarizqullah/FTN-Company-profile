import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-gray-200/50 overflow-hidden">
      <div className="relative z-10 px-4 md:px-6 lg:px-8 xl:px-16 py-12 lg:py-16 max-w-full">
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
               <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                  <img src="/assets/logo-ftn.svg" alt="Logo" className="h-20 w-auto" />
              </Link>
                <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                  Driving innovation and excellence in fiber optic technology across Indonesia.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  </div>
                  <span className="font-medium">Head Office : Jln. Telaga Sarangan IV. No. 85. Kel. pengasinan. Kec. Rawalumbu. Kota Bekasi. Jawa Barat</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  </div>
                  <span className="font-medium">Branch Office : Jln. Kartawijaya No 30A. Kel. Klegen. Kec. Kartoharjo. Kota Madiun. Jawa Timur 63117</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">fiber-teknologinusantara@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {[
                  { name: "About Us", href: "/about" },
                  { name: "Services", href: "/services" },
                  { name: "Projects", href: "/projects" },
                  { name: "Leadership", href: "/management" },
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium"
                    >
                      <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-6">Services</h4>
              <ul className="space-y-4">
                {["Fiber Optic Installation", "Network Infrastructure", "Technical Support", "Consultation"].map(
                  (service) => (
                    <li key={service}>
                      <span className="flex items-center gap-2 text-gray-600 font-medium">
                        <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                        {service}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div className="border-t border-gray-200/50 pt-8 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              {/* Social Media */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                <span className="text-gray-600 font-medium">Follow Us:</span>
                <div className="flex gap-3">
                  {[
                    { icon: "instagram", href: "https://www.instagram.com/fiberteknologinusantara/?utm_source=ig_web_button_share_sheet" },
                  ].map((social) => (
                    <a
                      key={social.icon}
                      href={social.href}
                      className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 hover:border-blue-500 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <p className="text-gray-600 font-medium">
                © {new Date().getFullYear()} PT. Fiber Teknologi Nusantara. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="/privacy"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium text-sm"
                >
                  Terms of Service
                </a>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium text-sm"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

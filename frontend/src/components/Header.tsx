"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('nav') && menuOpen) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/gallery", label: "Gallery" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/management", label: "Managements" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/95 backdrop-blur-md shadow-lg" 
            : "bg-white shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center hover:opacity-80 transition-opacity z-60"
              onClick={() => setMenuOpen(false)}
            >
              <img 
                src="/assets/logo-ftn.svg" 
                alt="Logo" 
                className="h-8 w-auto sm:h-9 md:h-10" 
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group py-2 px-1"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
              
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
              >
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors z-60 relative"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6">
                <Menu 
                  size={24} 
                  className={`absolute inset-0 transform transition-all duration-200 ${
                    menuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
                  }`} 
                />
                <X 
                  size={24} 
                  className={`absolute inset-0 transform transition-all duration-200 ${
                    menuOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'
                  }`} 
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-16 left-0 right-0 bg-white shadow-xl z-50 lg:hidden transform transition-all duration-300 ease-in-out ${
          menuOpen 
            ? "translate-y-0 opacity-100 visible" 
            : "-translate-y-4 opacity-0 invisible"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="px-4 sm:px-6 py-6 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium transform ${
                  menuOpen 
                    ? "translate-x-0 opacity-100" 
                    : "-translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: menuOpen ? `${index * 50}ms` : '0ms'
                }}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="pt-4 px-4">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className={`block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-center font-medium transform ${
                  menuOpen 
                    ? "translate-x-0 opacity-100" 
                    : "-translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: menuOpen ? `${navItems.length * 50}ms` : '0ms'
                }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
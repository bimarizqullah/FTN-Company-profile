'use client'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const Header: React.FC = () => {
  const [sticky, setSticky] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const isHomepage = pathname === '/'

  const linkClass = (href: string) => {
    const isActive = pathname === href
    return `relative transition-colors duration-300 hover:text-blue-500
      ${
        isHomepage
          ? sticky
            ? 'text-dark dark:text-white'
            : 'text-white'
          : 'text-dark dark:text-white'
      }
      ${isActive ? 'text-blue-500 font-semibold' : ''}
      after:content-[""] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-500 
      after:transition-all after:duration-300 after:w-0 hover:after:w-full 
      ${isActive ? 'after:w-full' : ''}`
  }

  return (
    <header
      className={`fixed h-24 z-50 w-full transition-all duration-300 ${
        sticky ? 'top-3' : 'top-0'
      }`}
    >
      <nav
        className={`container mx-auto max-w-8xl flex items-center justify-between py-4 px-6 transition-all duration-300 ${
          sticky
            ? 'shadow-lg bg-white dark:bg-dark rounded-full'
            : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <Link href='/'>
          <Image
            src={'/images/header/dark-logo.svg'}
            alt='logo'
            width={150}
            height={68}
            unoptimized
            className={`${
              isHomepage
                ? sticky
                  ? 'block dark:hidden'
                  : 'hidden'
                : sticky
                ? 'block dark:hidden'
                : 'block dark:hidden'
            }`}
          />
          <Image
            src={'/images/header/light-logo.svg'}
            alt='logo'
            width={150}
            height={68}
            unoptimized
            className={`${
              isHomepage
                ? sticky
                  ? 'hidden dark:block'
                  : 'block'
                : sticky
                ? 'dark:block hidden'
                : 'dark:block hidden'
            }`}
          />
        </Link>

        {/* Menu Links */}
        <div className='hidden md:flex items-center gap-8'>
          <Link href='/' className={linkClass('/')}>Home</Link>
          <Link href='/about' className={linkClass('/about')}>About</Link>
          <Link href='/services' className={linkClass('/services')}>Services</Link>
          <Link href='/articles' className={linkClass('/articles')}>Articles</Link>
          <Link href='/contact' className={linkClass('/contact')}>Contact</Link>
        </div>

        {/* Theme & Contact */}
        <div className='flex items-center gap-6'>
          <button
            className='hover:cursor-pointer'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Icon
              icon={'solar:sun-bold'}
              width={28}
              height={28}
              className={`dark:hidden block ${
                isHomepage
                  ? sticky
                    ? 'text-dark'
                    : 'text-white'
                  : 'text-dark'
              }`}
            />
            <Icon
              icon={'solar:moon-bold'}
              width={28}
              height={28}
              className='dark:block hidden text-white'
            />
          </button>

          <div className='hidden md:block border-l pl-4'>
            <Link
              href='#'
              className={`flex items-center gap-2 ${
                isHomepage
                  ? sticky
                    ? 'text-dark dark:text-white hover:text-blue-500'
                    : 'text-white hover:text-blue-500'
                  : 'text-dark dark:text-white hover:text-blue-500'
              }`}
            >
              <Icon icon={'ph:phone-bold'} width={20} height={20} />
              +62-811-1253-027
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header

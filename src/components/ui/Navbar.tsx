'use client'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handler = () => {
      const current = window.scrollY
      const scrolled = current > 80

      setIsScrolled(scrolled)

      if (scrolled) {
        if (current > lastScrollY.current + 4) {
          setIsVisible(false)   // scrolling down
        } else if (current < lastScrollY.current - 4) {
          setIsVisible(true)    // scrolling up
        }
      } else {
        setIsVisible(true)      // at top
      }

      lastScrollY.current = current
    }

    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { href: `/${locale}#services`, label: t('services') },
    { href: `/${locale}#about`, label: t('about') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/portal`, label: t('portal') },
  ]

  return (
    <>
      {/* Hover trigger zone — reveals navbar when hidden */}
      <div
        className="fixed top-0 left-0 right-0 h-6 z-40"
        onMouseEnter={() => setIsVisible(true)}
      />

      <motion.header
        animate={{
          y: isVisible ? 0 : -120,
        }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        onMouseEnter={() => setIsVisible(true)}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{ paddingTop: isScrolled ? 12 : 0 }}
      >
        <div
          className={`pointer-events-auto transition-all duration-500 ${
            isScrolled
              ? 'mx-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)] px-4'
              : 'w-full bg-transparent border-b border-white/0 px-0'
          }`}
          style={{ maxWidth: isScrolled ? 860 : '100%' }}
        >
          <div className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? 'h-14' : 'h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>

            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Agrin Transporte"
                width={130}
                height={44}
                className={`w-auto object-contain transition-all duration-500 ${isScrolled ? 'h-8' : 'h-10'}`}
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                    isScrolled
                      ? 'text-white/70 hover:text-white hover:bg-white/8'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher />
              <Link
                href={`/${locale}#anfrage`}
                className={`text-black font-semibold text-sm px-5 py-2 rounded-full transition-all ${
                  isScrolled
                    ? 'bg-[#C9A84C] hover:bg-[#b8963e]'
                    : 'bg-[#C9A84C] hover:bg-[#b8963e] hover:shadow-[0_0_20px_rgba(201,168,76,0.4)]'
                }`}
              >
                {t('quickRequest')}
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="md:hidden flex items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Menu"
              >
                <div className="w-5 space-y-1.5">
                  <motion.span
                    animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block w-5 h-0.5 bg-white origin-center"
                  />
                  <motion.span
                    animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                    className="block w-5 h-0.5 bg-white"
                  />
                  <motion.span
                    animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block w-5 h-0.5 bg-white origin-center"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-20 left-4 right-4 z-40 md:hidden bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/8 transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.2 }}
                className="pt-2 pb-1"
              >
                <Link
                  href={`/${locale}#anfrage`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center w-full bg-[#C9A84C] hover:bg-[#b8963e] text-black font-bold px-5 py-3 rounded-xl text-sm transition-colors"
                >
                  {t('quickRequest')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

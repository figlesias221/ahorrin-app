'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Only use white text on blog pages when not scrolled
  const isBlogPage = pathname?.startsWith('/blog');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Calculadora', href: '/herramientas/calculadora-presupuesto' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-20 relative">
            {/* Logo */}
            <Link href="/" className="absolute left-0 group z-10 flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Ahorrín - Tu Coach de Finanzas Personales Uruguay"
                width={40}
                height={40}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <span className={`text-2xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-foreground' : isBlogPage ? 'text-white' : 'text-foreground'
              }`}>
                Ahorrín
              </span>
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg relative group ${
                      isScrolled ? 'text-foreground hover:text-primary' : isBlogPage ? 'text-white hover:text-white/90' : 'text-foreground hover:text-primary'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 ${
                      isScrolled ? 'bg-primary' : isBlogPage ? 'bg-white' : 'bg-primary'
                    } group-hover:w-3/4 transition-all duration-300`} />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="absolute right-0 hidden md:flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-medium"
                  >
                    Iniciar sesión
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 group font-medium"
                  >
                    Comenzar gratis
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-xl transition-colors absolute right-0 z-10 ${
                isScrolled ? 'text-foreground' : isBlogPage ? 'text-white' : 'text-foreground'
              }`}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-20 z-40 md:hidden"
          >
            <div className="mx-4 rounded-2xl border border-border/50 bg-background/98 backdrop-blur-xl shadow-xl shadow-black/10">
              <div className="px-6 py-6 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-3 px-4 text-base font-medium rounded-xl transition-all group"
                    >
                      {link.name}
                      <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-6 space-y-3 border-t border-border/50 mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link href="/login" className="block">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center font-medium"
                      >
                        Iniciar sesión
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link href="/signup" className="block">
                      <Button
                        size="sm"
                        className="w-full justify-center bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/25 font-medium group"
                      >
                        Comenzar gratis
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

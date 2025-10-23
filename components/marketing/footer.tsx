'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="inline-block mb-4 group">
              <span className="text-2xl font-bold">Ahorrín</span>
            </Link>
            <p className="text-sm  max-w-xs leading-relaxed">
              Organizá tus finanzas automáticamente. Hecho para 🇺🇾
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Producto</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-sm   transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-sm   transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm   transition-colors"
                >
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm   transition-colors"
                >
                  Crear cuenta
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-sm   transition-colors"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos"
                  className="text-sm   transition-colors"
                >
                  Términos de uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm ">
              © {new Date().getFullYear()} Ahorrín. Hecho en 🇺🇾
            </p>
            <p className="text-sm ">
              Control financiero simple y automático
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

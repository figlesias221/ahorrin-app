import Link from 'next/link';
import { Home, BookOpen, Calculator, Mail, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <p className="text-7xl sm:text-8xl font-bold text-primary mb-4">404</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Esta página no existe
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            La URL a la que intentás acceder no está disponible. Puede que la
            hayamos movido o que el link esté roto.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          <Link
            href="/"
            className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <Home className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Inicio</p>
              <p className="text-xs text-muted-foreground">Página principal</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Link>

          <Link
            href="/blog"
            className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <BookOpen className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Blog</p>
              <p className="text-xs text-muted-foreground">Guías de finanzas</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Link>

          <Link
            href="/herramientas"
            className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <Calculator className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Herramientas</p>
              <p className="text-xs text-muted-foreground">Calculadoras gratis</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Link>

          <Link
            href="/contacto"
            className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <Mail className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Contacto</p>
              <p className="text-xs text-muted-foreground">Reportar el error</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        </div>

        <div className="bg-muted/40 border border-border rounded-lg p-5 text-center">
          <p className="text-sm text-muted-foreground">
            Quizás te interese leer{' '}
            <Link
              href="/blog/irpf-uruguay-2026-guia-completa-tramos-deducciones"
              className="text-primary hover:underline font-medium"
            >
              la guía de IRPF 2026
            </Link>{' '}
            o usar la{' '}
            <Link
              href="/herramientas/calculadora-salario-liquido"
              className="text-primary hover:underline font-medium"
            >
              calculadora de salario líquido
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

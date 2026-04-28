import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageCircle, AlertCircle, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto | Ahorrin',
  description:
    'Contactá al equipo de Ahorrin. Soporte, sugerencias, consultas comerciales o reportar errores. Respondemos en menos de 48 horas hábiles.',
  alternates: { canonical: 'https://www.ahorrin.app/contacto' },
  openGraph: {
    title: 'Contacto | Ahorrin',
    description: 'Escribinos. Soporte, sugerencias, prensa o consultas comerciales.',
    url: 'https://www.ahorrin.app/contacto',
  },
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-background pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contactanos</h1>
        <p className="text-xl text-muted-foreground leading-relaxed mb-12">
          Cualquier consulta, sugerencia o problema que tengas, estamos del otro lado del mail.
          Respondemos en menos de 48 horas hábiles.
        </p>

        <section className="mb-10 grid sm:grid-cols-2 gap-4">
          <a
            href="mailto:hola@ahorrin.app"
            className="block p-6 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors"
          >
            <Mail className="w-6 h-6 text-primary mb-3" />
            <h2 className="font-bold mb-1">Soporte general</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Para consultas sobre tu cuenta, problemas con la app o cualquier duda de uso.
            </p>
            <p className="text-sm text-primary font-medium">hola@ahorrin.app</p>
          </a>

          <a
            href="mailto:hola@ahorrin.app?subject=Sugerencia%20o%20feedback"
            className="block p-6 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors"
          >
            <MessageCircle className="w-6 h-6 text-primary mb-3" />
            <h2 className="font-bold mb-1">Sugerencias y feedback</h2>
            <p className="text-sm text-muted-foreground mb-2">
              ¿Falta una funcionalidad? ¿Qué te gustaría que mejoremos? Nos encanta leer ideas.
            </p>
            <p className="text-sm text-primary font-medium">hola@ahorrin.app</p>
          </a>

          <a
            href="mailto:hola@ahorrin.app?subject=Reporte%20de%20bug"
            className="block p-6 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors"
          >
            <AlertCircle className="w-6 h-6 text-primary mb-3" />
            <h2 className="font-bold mb-1">Reportar un error</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Si algo no funciona como debería, contanos qué pasó. Si podés, adjuntá una captura.
            </p>
            <p className="text-sm text-primary font-medium">hola@ahorrin.app</p>
          </a>

          <a
            href="mailto:hola@ahorrin.app?subject=Consulta%20comercial"
            className="block p-6 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors"
          >
            <BookOpen className="w-6 h-6 text-primary mb-3" />
            <h2 className="font-bold mb-1">Prensa y consultas comerciales</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Periodistas, partnerships, integraciones o entrevistas. Respondemos consultas
              serias.
            </p>
            <p className="text-sm text-primary font-medium">hola@ahorrin.app</p>
          </a>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Antes de escribirnos</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Si tu consulta es sobre cómo usar Ahorrin, es probable que ya esté respondida en
            nuestra <Link href="/blog" className="text-primary hover:underline">sección de
            blog</Link> o en las páginas de cada herramienta. Por ejemplo:
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>¿Cómo descargo mi extracto del banco?</strong> Está en{' '}
              <Link href="/bancos-uruguay" className="text-primary hover:underline">
                Bancos en Uruguay
              </Link>
              , con instrucciones por banco.
            </li>
            <li>
              <strong>¿Cómo se calcula mi salario líquido?</strong>{' '}
              <Link
                href="/herramientas/calculadora-salario-liquido"
                className="text-primary hover:underline"
              >
                Calculadora de salario líquido
              </Link>
            </li>
            <li>
              <strong>¿Cómo armo un presupuesto mensual?</strong>{' '}
              <Link
                href="/herramientas/calculadora-presupuesto"
                className="text-primary hover:underline"
              >
                Calculadora de presupuesto
              </Link>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Lo que no hacemos</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Para que sepas qué esperar antes de escribirnos: <strong>no damos asesoramiento
            financiero, fiscal o legal personalizado</strong>. Nuestro contenido educativo es
            general; para decisiones específicas (qué inversión te conviene, cómo declarar tu
            IRPF en un caso particular, qué estructura empresarial elegir) consultá con un
            contador o asesor habilitado.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Tampoco somos un banco ni intermediarios financieros. No movemos plata, no abrimos
            cuentas, no operamos inversiones. Somos solo una herramienta de software.
          </p>
        </section>

        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-3">Información de la empresa</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Empresa:</strong> Larson Labs
            </li>
            <li>
              <strong className="text-foreground">Producto:</strong> Ahorrin
            </li>
            <li>
              <strong className="text-foreground">Email:</strong>{' '}
              <a href="mailto:hola@ahorrin.app" className="text-primary hover:underline">
                hola@ahorrin.app
              </a>
            </li>
            <li>
              <strong className="text-foreground">Ubicación:</strong> Montevideo, Uruguay
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

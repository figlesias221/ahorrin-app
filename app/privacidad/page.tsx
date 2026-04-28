import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Ahorrin',
  description:
    'Cómo Ahorrin recopila, usa y protege tus datos personales y financieros. Política transparente alineada con la Ley 18.331 de Uruguay y prácticas internacionales.',
  alternates: { canonical: 'https://www.ahorrin.app/privacidad' },
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-background pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Política de Privacidad</h1>
        </div>
        <p className="text-muted-foreground mb-12">Última actualización: 28 de abril de 2026</p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8 bg-card border border-border rounded-lg p-6">
            <p className="text-base leading-relaxed mb-0">
              En Ahorrin tomamos tu privacidad en serio. Este documento explica qué datos
              recopilamos, cómo los usamos, con quién los compartimos y qué derechos tenés sobre
              tu información. Está alineado con la Ley 18.331 de Protección de Datos Personales de
              Uruguay y con prácticas internacionales (GDPR).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Quién es responsable de tus datos</h2>
            <p className="text-muted-foreground mb-3">
              El responsable del tratamiento de datos personales es <strong>Larson Labs</strong>,
              empresa registrada en Uruguay, operadora del producto Ahorrin
              (<a href="https://www.ahorrin.app" className="text-primary hover:underline">www.ahorrin.app</a>).
            </p>
            <p className="text-muted-foreground">
              Para cualquier consulta relacionada con privacidad, escribinos a{' '}
              <a href="mailto:hola@ahorrin.app" className="text-primary hover:underline">
                hola@ahorrin.app
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Qué datos recopilamos</h2>

            <h3 className="text-xl font-semibold mb-2 mt-4">2.1. Datos que vos nos das</h3>
            <ul className="space-y-2 text-muted-foreground ml-6 list-disc">
              <li>
                <strong>Datos de cuenta:</strong> email, nombre y contraseña (almacenada con hash
                bcrypt, nunca en texto plano).
              </li>
              <li>
                <strong>Datos financieros:</strong> los movimientos de los extractos bancarios que
                vos subís, las categorías que asignás y los presupuestos que configurás.
              </li>
              <li>
                <strong>Datos de pago:</strong> si te suscribís al plan pago, los datos de tu
                tarjeta los procesa nuestro proveedor de pagos (Stripe / Mercado Pago). Ahorrin
                no almacena números de tarjeta.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-6">
              2.2. Datos que recopilamos automáticamente
            </h3>
            <ul className="space-y-2 text-muted-foreground ml-6 list-disc">
              <li>
                <strong>Datos técnicos:</strong> dirección IP (anonimizada), tipo de navegador,
                sistema operativo, páginas visitadas dentro del sitio.
              </li>
              <li>
                <strong>Datos de uso:</strong> qué funcionalidades usás, frecuencia de uso, errores
                que encontrás. Lo usamos para mejorar el producto.
              </li>
              <li>
                <strong>Cookies:</strong> usamos cookies esenciales (sesión, preferencias) y
                cookies analíticas (Google Analytics). Podés rechazar las analíticas desde la
                configuración del navegador.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-6">
              2.3. Lo que NO recopilamos
            </h3>
            <ul className="space-y-2 text-muted-foreground ml-6 list-disc">
              <li>
                <strong>Credenciales bancarias.</strong> Nunca te pedimos tu usuario o contraseña
                del banco. Solo trabajamos con extractos que vos descargás.
              </li>
              <li>
                <strong>Documento de identidad.</strong> No pedimos cédula ni pasaporte.
              </li>
              <li>
                <strong>Datos sensibles.</strong> No recopilamos información sobre salud,
                religión, orientación sexual, ideología política u origen étnico.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Para qué usamos tus datos</h2>
            <ul className="space-y-2 text-muted-foreground ml-6 list-disc">
              <li>
                <strong>Operar el servicio.</strong> Mostrarte tus movimientos, calcular tu
                presupuesto, generar reportes, enviarte notificaciones que pediste.
              </li>
              <li>
                <strong>Mejorar el producto.</strong> Analizar cómo se usa la app de forma
                agregada y anónima, identificar errores y oportunidades.
              </li>
              <li>
                <strong>Comunicación con vos.</strong> Avisos sobre tu cuenta, cambios en
                términos, novedades del producto. Podés desuscribirte del marketing en cualquier
                momento.
              </li>
              <li>
                <strong>Cumplir obligaciones legales.</strong> Responder a requerimientos de
                autoridades competentes cuando exista un mandato legal válido.
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">
              <strong>Lo que no hacemos con tus datos:</strong> no los vendemos, no los alquilamos
              y no los compartimos con terceros para publicidad. No usamos tus datos financieros
              identificables para entrenar modelos de IA.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Con quién compartimos datos</h2>
            <p className="text-muted-foreground mb-3">
              Ahorrin trabaja con un conjunto acotado de proveedores que nos ayudan a operar el
              servicio. Cada uno accede solo a los datos estrictamente necesarios para su función:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6 list-disc">
              <li>
                <strong>Supabase</strong> (base de datos y autenticación) — almacenamiento de tus
                datos. Datacenters en regiones controladas con cifrado en reposo.
              </li>
              <li>
                <strong>Vercel</strong> (hosting y CDN) — sirve la aplicación web.
              </li>
              <li>
                <strong>Stripe / Mercado Pago</strong> (procesamiento de pagos) — solo si te
                suscribís al plan pago.
              </li>
              <li>
                <strong>Google Analytics</strong> (analítica) — datos agregados y anonimizados de
                uso.
              </li>
              <li>
                <strong>Proveedores de email transaccional</strong> (Resend / Postmark) —
                envío de emails operativos (verificación de cuenta, reseteo de contraseña).
              </li>
              <li>
                <strong>Proveedores de IA</strong> (cuando uses funcionalidades de
                categorización con IA) — procesan los textos de tus movimientos sin información
                identificatoria, según los términos de cero retención de datos del proveedor.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Cuánto tiempo guardamos tus datos</h2>
            <p className="text-muted-foreground mb-3">
              Mientras tu cuenta esté activa, conservamos tus datos para poder ofrecerte el
              servicio. Si eliminás tu cuenta, borramos tus datos personales y financieros en un
              plazo máximo de <strong>30 días</strong>, salvo que la ley nos obligue a retenerlos
              por más tiempo (por ejemplo, datos de facturación por 5 años para fines fiscales).
            </p>
            <p className="text-muted-foreground">
              Los logs técnicos anonimizados (sin datos personales) pueden retenerse hasta 12
              meses para análisis de seguridad y debugging.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Tus derechos (Ley 18.331)</h2>
            <p className="text-muted-foreground mb-3">
              Como titular de los datos, tenés derecho a:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6 list-disc">
              <li>
                <strong>Acceder</strong> a los datos personales que tenemos sobre vos.
              </li>
              <li>
                <strong>Rectificar</strong> datos inexactos o incompletos.
              </li>
              <li>
                <strong>Suprimir</strong> tus datos (derecho al olvido), salvo retención legal
                obligatoria.
              </li>
              <li>
                <strong>Oponerte</strong> al tratamiento de tus datos para fines de marketing.
              </li>
              <li>
                <strong>Portar</strong> tus datos a otra plataforma en formato estructurado
                (exportación).
              </li>
              <li>
                <strong>Presentar reclamos</strong> ante la Unidad Reguladora y de Control de
                Datos Personales (URCDP) de Uruguay si considerás que tus derechos no fueron
                respetados.
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Para ejercer cualquiera de estos derechos, escribinos a{' '}
              <a href="mailto:hola@ahorrin.app" className="text-primary hover:underline">
                hola@ahorrin.app
              </a>{' '}
              desde el email asociado a tu cuenta. Respondemos en un plazo máximo de 10 días
              hábiles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Seguridad</h2>
            <p className="text-muted-foreground mb-3">
              Aplicamos medidas técnicas y organizativas razonables para proteger tu información:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6 list-disc">
              <li>Cifrado en tránsito (HTTPS / TLS 1.3) y en reposo (AES-256).</li>
              <li>Contraseñas almacenadas con hash bcrypt (no se pueden recuperar).</li>
              <li>
                Acceso a base de datos restringido a personal autorizado y auditado mediante logs.
              </li>
              <li>Backups automáticos diarios con cifrado.</li>
              <li>Autenticación de dos factores opcional para usuarios.</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Ningún sistema es 100% seguro. Si detectamos una brecha que afecte tus datos, te
              notificamos en un plazo máximo de 72 horas según las prácticas internacionales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Publicidad y AdSense</h2>
            <p className="text-muted-foreground mb-3">
              Algunas páginas del sitio (especialmente el blog y herramientas gratuitas) muestran
              publicidad servida por <strong>Google AdSense</strong>. Google y sus socios pueden
              usar cookies y tecnologías similares para servir anuncios relevantes basados en tu
              actividad de navegación previa, según la{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                política de publicidad de Google
              </a>
              .
            </p>
            <p className="text-muted-foreground">
              Podés desactivar la personalización de anuncios desde{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                la configuración de anuncios de Google
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Menores de edad</h2>
            <p className="text-muted-foreground">
              Ahorrin no está dirigido a menores de 18 años. No recopilamos a sabiendas datos de
              menores. Si te enterás de que un menor creó una cuenta, contactanos y la
              eliminaremos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Cambios a esta política</h2>
            <p className="text-muted-foreground">
              Podemos actualizar esta política cuando agreguemos funcionalidades nuevas o cambien
              las normas aplicables. Si los cambios son materiales, te avisamos por email con al
              menos 15 días de anticipación. La fecha de "última actualización" arriba de este
              documento siempre refleja la versión vigente.
            </p>
          </section>

          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3">Resumen en una frase</h2>
            <p className="text-muted-foreground">
              Tus datos son tuyos. Los usamos solo para que la app funcione, no los vendemos, los
              borramos cuando los pidas, y aplicamos buenas prácticas de seguridad para
              protegerlos.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

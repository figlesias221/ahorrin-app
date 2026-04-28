import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Ahorrin',
  description:
    'Quiénes somos, qué hacemos y por qué creamos Ahorrin. Una herramienta de finanzas personales hecha en Uruguay, por uruguayos, para uruguayos.',
  alternates: { canonical: 'https://www.ahorrin.app/sobre-nosotros' },
  openGraph: {
    title: 'Sobre Nosotros | Ahorrin',
    description:
      'Conocé al equipo y la historia detrás de Ahorrin, la herramienta de finanzas personales hecha en Uruguay.',
    url: 'https://www.ahorrin.app/sobre-nosotros',
  },
};

export default function SobreNosotrosPage() {
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

        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Sobre Ahorrin</h1>
        <p className="text-xl text-muted-foreground leading-relaxed mb-12">
          Una herramienta de finanzas personales hecha en Uruguay, sin venderte productos
          financieros, sin pedirte tus claves bancarias, y sin compartir tus datos.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Por qué existe Ahorrin</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            En Uruguay, organizar tus finanzas personales es una mezcla incómoda de planillas de
            Excel, capturas de pantalla del home banking, y aplicaciones internacionales que no
            entienden cómo funcionan los bancos uruguayos, ni los impuestos uruguayos, ni la doble
            moneda peso-dólar que tenemos todos.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Las opciones disponibles son frustrantes: o usás apps que conectan con tu banco
            (cuando funciona) compartiendo tus credenciales con un tercero, o seguís copiando
            movimientos a mano todos los meses. Ninguna de las dos opciones está bien.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Ahorrin nace como respuesta a esto. Subís el extracto que ya descargás de tu banco, y
            la herramienta lo categoriza automáticamente, te muestra dónde se va tu plata, y te
            ayuda a planificar mejor el mes siguiente. Sin claves bancarias, sin conexiones
            riesgosas, sin patrocinadores que te empujen a contratar productos.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Cómo funciona el modelo</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Ahorrin tiene un plan gratuito que cubre las funciones esenciales (subir extractos,
            categorizar gastos, ver gráficas, presupuesto mensual) y un plan pago para usuarios
            que quieran funciones avanzadas (categorización con IA, reportes ilimitados,
            exportación a Excel, soporte prioritario).
          </p>
          <p className="text-muted-foreground leading-relaxed">
            No vendemos tus datos. No compartimos información personal con terceros para
            publicidad. Cuando recomendamos un banco, una tarjeta o un broker en el blog, lo
            hacemos sin recibir comisión — y aclaramos cuándo hay un programa de afiliados.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Quién está detrás</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Ahorrin lo desarrolla un pequeño equipo basado en Montevideo. La empresa se llama
            <strong> Larson Labs</strong> y construye productos digitales para el mercado
            uruguayo. El producto está liderado por Federico Iglesias, desarrollador full-stack
            con experiencia en startups SaaS.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            No somos un banco, no somos asesores financieros y no estamos regulados por el BCU.
            Somos una herramienta de software. Las decisiones financieras siguen siendo tuyas;
            nuestro trabajo es darte mejor información para tomarlas.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Nuestros principios</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Privacidad primero.</strong> Tus extractos son tuyos. No los miramos, no
                los vendemos y no los usamos para entrenar modelos de IA con datos identificables.
              </span>
            </li>
            <li className="flex gap-3">
              <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Honestidad antes que upsell.</strong> Si una funcionalidad no es necesaria
                para vos, no te la vamos a empujar. Si te conviene un competidor para tu caso, te
                lo decimos.
              </span>
            </li>
            <li className="flex gap-3">
              <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Hecho en Uruguay para Uruguay.</strong> Entendemos cómo funcionan el IRPF,
                BPS, FONASA, las UI, la doble moneda, los aguinaldos y el sistema bancario local
                porque convivimos con eso todos los días.
              </span>
            </li>
            <li className="flex gap-3">
              <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Educar más que vender.</strong> Nuestro blog cubre temas reales (impuestos,
                inversiones, deudas) con números concretos, no con marketing.
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-10 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Contacto</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <a href="mailto:hola@ahorrin.app" className="text-primary hover:underline">
                hola@ahorrin.app
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Montevideo, Uruguay</span>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-4">
            ¿Tenés un comentario, una idea o un bug que reportar?{' '}
            <Link href="/contacto" className="text-primary hover:underline">
              Escribinos por nuestro formulario de contacto
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

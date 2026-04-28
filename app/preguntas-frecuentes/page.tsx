import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes | Ahorrin',
  description:
    'Respuestas a las preguntas más comunes sobre IRPF, FONASA, BPS, inversiones, bancos uruguayos y cómo usar Ahorrin.',
  alternates: { canonical: 'https://www.ahorrin.app/preguntas-frecuentes' },
  openGraph: {
    title: 'Preguntas Frecuentes | Ahorrin',
    description:
      'Respuestas claras a preguntas comunes sobre finanzas personales en Uruguay.',
    url: 'https://www.ahorrin.app/preguntas-frecuentes',
    type: 'website',
  },
};

interface FAQ {
  q: string;
  a: string;
  link?: { label: string; href: string };
}

interface Section {
  title: string;
  description: string;
  faqs: FAQ[];
}

const sections: Section[] = [
  {
    title: 'Sobre Ahorrin',
    description: 'Cómo funciona la plataforma, planes y privacidad',
    faqs: [
      {
        q: '¿Qué es Ahorrin?',
        a: 'Ahorrin es una herramienta de finanzas personales para uruguayos. Subís los extractos que descargás de tu home banking y la aplicación los categoriza automáticamente, te muestra dónde se va tu plata y te ayuda a presupuestar mejor.',
      },
      {
        q: '¿Es gratis?',
        a: 'Hay un plan gratuito que cubre las funciones esenciales (subir extractos, categorización, presupuesto, gráficas básicas) y un plan pago para usuarios que necesitan funciones avanzadas (categorización con IA ilimitada, exportes, soporte prioritario).',
        link: { label: 'Ver planes', href: '/pricing' },
      },
      {
        q: '¿Tienen acceso a mi cuenta bancaria?',
        a: 'No. Ahorrin nunca pide tu usuario o contraseña del banco. Vos descargás el extracto desde tu home banking y lo subís manualmente. No hay conexión live con ningún banco.',
      },
      {
        q: '¿Qué bancos uruguayos soportan?',
        a: 'BROU, BBVA, Itaú, Santander, Scotiabank y Heritage. Aceptamos los formatos Excel, CSV y PDF que exportan estos bancos desde su home banking.',
        link: { label: 'Ver guía por banco', href: '/bancos-uruguay' },
      },
      {
        q: '¿Mis datos están seguros?',
        a: 'Tus extractos se guardan cifrados. No vendemos información a terceros, no usamos datos identificables para entrenar IA, y podés borrar tu cuenta en cualquier momento.',
        link: { label: 'Política de privacidad', href: '/privacidad' },
      },
    ],
  },
  {
    title: 'IRPF, BPS y FONASA',
    description: 'Impuestos al trabajo y aportes obligatorios',
    faqs: [
      {
        q: '¿Cómo se calcula mi salario líquido?',
        a: 'Tu sueldo nominal tiene tres descuentos: BPS (15%), FONASA (3% a 8% según cargas familiares) e IRPF (escala progresiva 0% a 36%). Lo que queda es tu líquido. La calculadora online te lo muestra al detalle.',
        link: {
          label: 'Calculadora de salario líquido',
          href: '/herramientas/calculadora-salario-liquido',
        },
      },
      {
        q: '¿Qué deducciones puedo hacer en el IRPF?',
        a: 'Las principales son: cargas familiares (hijos, cónyuge), aportes BPS, FONASA pagado, cuota de hipotecario para vivienda única (hasta 36 BPC anuales) y servicios profesionales en porcentajes acotados.',
        link: {
          label: 'Guía de deducciones IRPF',
          href: '/blog/deducciones-irpf-2026-descontar-legalmente',
        },
      },
      {
        q: '¿Cuándo vence la declaración de IRPF?',
        a: 'La DGI publica el calendario fiscal cada año. Generalmente, los empleados con un solo empleador no necesitan declarar; los que tienen ingresos múltiples o quieren reclamar devolución sí deben presentar declaración jurada.',
        link: {
          label: 'Calendario fiscal Uruguay 2026',
          href: '/blog/calendario-fiscal-uruguay-2026-fechas',
        },
      },
      {
        q: '¿Cómo me devuelven el FONASA?',
        a: 'Si aportaste FONASA durante el año y tu carga total fue inferior al beneficio que te corresponde, recibís devolución. La gestiona BPS automáticamente entre marzo y junio del año siguiente, depositando en tu caja de ahorro.',
        link: {
          label: 'Guía de devolución FONASA',
          href: '/blog/devolucion-fonasa-2026-quien-cobra-como-reclamar',
        },
      },
      {
        q: '¿Puedo cobrar IRPF a la baja en el ajuste anual?',
        a: 'Sí. Si pagaste de más durante el año (por errores en retenciones, deducciones no aplicadas, etc.), la DGI te devuelve la diferencia tras la declaración jurada anual.',
      },
    ],
  },
  {
    title: 'Inversiones y ahorro',
    description: 'Plazo fijo, UI, ETFs, brokers y diversificación',
    faqs: [
      {
        q: '¿Conviene plazo fijo en pesos, UI o dólares?',
        a: 'Depende del horizonte y del riesgo cambiario. UI te protege contra inflación (mantiene poder adquisitivo); pesos rinde más nominal pero pierde si la inflación es alta; dólares te cubre de devaluación pero rinde menos en términos reales. Para fondo de emergencia: caja de ahorro o UI a corto plazo.',
        link: {
          label: 'Comparativa de plazos fijos',
          href: '/blog/plazo-fijo-uruguay-2026-tasas-comparativa',
        },
      },
      {
        q: '¿Cómo invierto desde Uruguay en ETFs internacionales?',
        a: 'A través de un broker internacional como Interactive Brokers (IBKR). Abrís cuenta online, transferís dólares desde tu banco uruguayo, y comprás ETFs como VOO, VTI o BND. Hay otros brokers también, pero IBKR es el más usado por uruguayos.',
        link: {
          label: 'Guía de inversión Uruguay',
          href: '/blog/como-invertir-uruguay-2026-brokers-ibkr-opciones',
        },
      },
      {
        q: '¿Son seguras las Letras de Regulación Monetaria del BCU?',
        a: 'Tienen el riesgo país soberano uruguayo, que es bajo dentro de Latam pero no es cero. Rinden por encima de la inflación y son una de las mejores opciones de bajo riesgo en Uruguay para ahorros mayores.',
        link: {
          label: 'Letras del BCU explicadas',
          href: '/blog/letras-regulacion-monetaria-uruguay-inversion-segura',
        },
      },
      {
        q: '¿Cuánto debería tener en fondo de emergencia?',
        a: 'Entre 3 y 6 meses de gastos básicos. Para una persona con $50.000 de gastos mensuales, eso son entre $150.000 y $300.000 líquidos en caja de ahorro o instrumento de muy bajo riesgo.',
      },
    ],
  },
  {
    title: 'Trabajo independiente y empresa',
    description: 'Monotributo, unipersonal, SAS, IRAE',
    faqs: [
      {
        q: '¿Conviene monotributo, unipersonal o SAS?',
        a: 'Monotributo es para baja facturación con tributación simplificada. Unipersonal es persona física con DGI/BPS, sin separación patrimonial. SAS es sociedad por acciones con limitación de responsabilidad, ideal a partir de cierta facturación.',
        link: {
          label: 'Comparativa monotributo vs unipersonal vs SAS',
          href: '/blog/monotributo-vs-unipersonal-vs-sas-uruguay-2026',
        },
      },
      {
        q: '¿Qué es IRAE y en qué se diferencia del IRPF?',
        a: 'IRAE es el impuesto del 25% a la utilidad neta de empresas. IRPF es el impuesto progresivo (0% a 36%) sobre ingresos personales. Si tributás como empresa (SAS, unipersonal optada por IRAE), pagás IRAE sobre la utilidad. Si tributás como persona, IRPF sobre el ingreso.',
        link: {
          label: 'IRAE vs IRPF en detalle',
          href: '/blog/irae-vs-irpf-diferencias-emprendedores-uruguay',
        },
      },
      {
        q: '¿Cómo facturo al exterior siendo freelancer?',
        a: 'Necesitás estar inscripto en DGI (unipersonal o SAS), emitir factura electrónica o e-factura, y declarar el ingreso. La exportación de servicios suele estar exenta de IVA, pero no de IRPF/IRAE.',
        link: {
          label: 'Guía de facturación al exterior',
          href: '/blog/facturar-exterior-uruguay-freelancers-it',
        },
      },
    ],
  },
  {
    title: 'Bancos y préstamos',
    description: 'Hipotecarios, personales, tarjetas',
    faqs: [
      {
        q: '¿Qué banco tiene la mejor tasa hipotecaria?',
        a: 'En el segmento privado, BBVA suele liderar con tasas en UI cercanas al 5,9%. En el sector público, BROU y BHU tienen condiciones competitivas, especialmente para vivienda única. Las tasas cambian con frecuencia: comparar en el momento de la consulta es clave.',
        link: {
          label: 'Guía completa de hipotecarios',
          href: '/blog/prestamos-hipotecarios-uruguay-2025-guia-completa',
        },
      },
      {
        q: '¿Qué es el CFT y por qué importa?',
        a: 'El Costo Financiero Total incluye todo lo que pagás por un crédito: tasa, seguros, comisiones, IVA. Una "tasa nominal del 25%" puede tener un CFT del 38% o más. Siempre comparalo entre bancos al pedir un préstamo.',
      },
      {
        q: '¿Conviene tener cuenta en varios bancos?',
        a: 'Es común y útil. Caja de ahorro hasta cierto monto suele ser gratuita, diversificás riesgo de caída de sistemas y podés combinar lo mejor de cada banco (mejor red de cajeros con BROU, mejor app con Itaú, etc.).',
        link: { label: 'Comparativa de bancos', href: '/bancos-uruguay' },
      },
    ],
  },
];

export default function PreguntasFrecuentesPage() {
  const allFAQs = sections.flatMap((s) => s.faqs);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFAQs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.ahorrin.app' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Preguntas Frecuentes',
        item: 'https://www.ahorrin.app/preguntas-frecuentes',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="bg-background pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground">Inicio</Link></li>
              <li><ChevronRight className="w-3 h-3" /></li>
              <li className="text-foreground font-medium">Preguntas Frecuentes</li>
            </ol>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Preguntas Frecuentes</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12">
            Las preguntas que más nos hacen sobre finanzas personales en
            Uruguay y sobre cómo funciona Ahorrin. Si tu duda no está acá,
            escribinos a{' '}
            <a href="mailto:hola@ahorrin.app" className="text-primary hover:underline">
              hola@ahorrin.app
            </a>
            .
          </p>

          {/* Section navigation */}
          <nav className="mb-12 grid sm:grid-cols-2 gap-3">
            {sections.map((s, i) => (
              <a
                key={i}
                href={`#section-${i}`}
                className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.faqs.length} preguntas</p>
                </div>
              </a>
            ))}
          </nav>

          <div className="space-y-16">
            {sections.map((section, sectionIdx) => (
              <section
                key={sectionIdx}
                id={`section-${sectionIdx}`}
                className="scroll-mt-24"
              >
                <header className="mb-6 pb-4 border-b border-border">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground">{section.description}</p>
                </header>

                <div className="space-y-6">
                  {section.faqs.map((faq, i) => (
                    <article
                      key={i}
                      className="bg-card border border-border rounded-lg p-6"
                    >
                      <h3 className="text-lg font-bold mb-3">{faq.q}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        {faq.a}
                      </p>
                      {faq.link && (
                        <Link
                          href={faq.link.href}
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                        >
                          {faq.link.label}
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 bg-card border border-border rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold mb-3">¿No encontraste lo que buscabas?</h2>
            <p className="text-muted-foreground mb-4">
              Escribinos y respondemos en menos de 48 horas hábiles.
            </p>
            <Link
              href="/contacto"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90"
            >
              Ir a Contacto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

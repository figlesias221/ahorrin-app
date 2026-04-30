import { Metadata } from 'next';
import Link from 'next/link';
import { Check, FileUp, Shield, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bancos en Uruguay 2026: Comparativa Completa de Servicios y Extractos',
  description:
    'Comparativa real de los principales bancos uruguayos: BROU, BBVA, Itaú, Santander, Scotiabank y Heritage. Cómo descargar extractos, comisiones, servicios digitales y diferencias clave.',
  keywords: [
    'bancos uruguay',
    'comparativa bancos uruguay',
    'mejor banco uruguay',
    'extracto bancario uruguay',
    'home banking uruguay',
    'comisiones bancos uruguay',
    'descargar extracto banco uruguay',
  ],
  alternates: {
    canonical: 'https://www.ahorrin.app/bancos-uruguay',
  },
  openGraph: {
    title: 'Bancos en Uruguay 2026: Comparativa Completa',
    description:
      'Análisis honesto y comparativa de los principales bancos en Uruguay. Servicios, comisiones, extractos digitales y diferencias clave.',
    url: 'https://www.ahorrin.app/bancos-uruguay',
  },
};

const banks = [
  {
    name: 'BROU',
    fullName: 'Banco República Oriental del Uruguay',
    type: 'Estatal',
    foundedYear: 1896,
    color: 'bg-blue-600',
    summary:
      'El banco más grande del país y el único estatal. Tiene la red de sucursales y cajeros más extensa del Uruguay, y es donde se acreditan la mayoría de sueldos públicos y jubilaciones.',
    pros: [
      'Mayor red de sucursales y cajeros del país',
      'Cuenta básica gratuita disponible',
      'Acceso a líneas de crédito subsidiadas (BROU Premia)',
      'Domicilio del Estado para sueldos y jubilaciones',
    ],
    cons: [
      'Home banking menos moderno que la banca privada',
      'Demoras en sucursales presenciales en horarios pico',
      'Trámites burocráticos más lentos',
    ],
    extractoFormat:
      'Descargá el extracto en formato CSV o PDF desde eBROU → Cuentas → Movimientos → Exportar.',
  },
  {
    name: 'BBVA',
    fullName: 'BBVA Uruguay',
    type: 'Privado · Capital español',
    foundedYear: 1920,
    color: 'bg-[#004481]',
    summary:
      'Banco privado con foco en clientes asalariados de ingresos medios y altos. Es uno de los más fuertes en préstamos hipotecarios, con la tasa más baja del mercado privado en UI (5.9% al cierre de 2025).',
    pros: [
      'App móvil sólida con biometría y notificaciones',
      'Tasa hipotecaria competitiva en UI',
      'Tarjetas con beneficios en gastronomía y comercios',
      'Cuenta sueldo sin costo si tu empleador la deposita',
    ],
    cons: [
      'Costos de mantenimiento si no tenés la nómina activa',
      'Atención telefónica con tiempos de espera variables',
      'Algunos cargos por transferencias internacionales',
    ],
    extractoFormat:
      'En BBVA Net Cash o BBVA App, ingresá a Cuentas → Movimientos → Exportar como Excel o PDF.',
  },
  {
    name: 'Itaú',
    fullName: 'Banco Itaú Uruguay',
    type: 'Privado · Capital brasileño',
    foundedYear: 1972,
    color: 'bg-[#EC7000]',
    summary:
      'Uno de los bancos con mejor experiencia digital en Uruguay. Su app y home banking son referencia del mercado, y suelen ser pioneros en productos como tarjetas con cashback y cuentas en dólares automatizadas.',
    pros: [
      'Mejor banca digital del país según varios rankings 2024-2025',
      'Itaú Personnalité para clientes premium con beneficios exclusivos',
      'Buena app móvil con UX clara',
      'Promociones de cashback frecuentes',
    ],
    cons: [
      'Requisitos de ingresos relativamente altos',
      'Comisiones más caras en cuentas básicas',
      'Cobro por transferencias internacionales por encima de cierto monto',
    ],
    extractoFormat:
      'En itau.com.uy, ingresá a Cuentas → Movimientos del período → Descargar (Excel, PDF o CSV).',
  },
  {
    name: 'Santander',
    fullName: 'Santander Uruguay',
    type: 'Privado · Capital español',
    foundedYear: 1980,
    color: 'bg-[#EC0000]',
    summary:
      'Parte del grupo Santander global. Suele tener buenas condiciones para personas con ingresos en dólares (freelancers internacionales, empleados de zona franca) y un fuerte foco en hipotecarios.',
    pros: [
      'Producto fuerte para ingresos en dólares',
      'Tasas hipotecarias competitivas',
      'Red internacional para transferencias entre filiales Santander',
      'Inversiones (fondos comunes, bonos) accesibles desde el home banking',
    ],
    cons: [
      'Menor cantidad de sucursales que BBVA o Itaú',
      'Mantenimiento de cuenta más caro sin paquete',
      'App con algunas limitaciones en funcionalidades avanzadas',
    ],
    extractoFormat:
      'Desde Online Banking → Cuentas → Estado de cuenta → Descargar PDF o Excel.',
  },
  {
    name: 'Scotiabank',
    fullName: 'Scotiabank Uruguay',
    type: 'Privado · Capital canadiense',
    foundedYear: 1968,
    color: 'bg-[#EC111A]',
    summary:
      'Parte del grupo canadiense Scotiabank. En Uruguay suele tener tarjetas con buenos programas de millas y puntos, y es uno de los bancos con mejor servicio para personas con perfil internacional.',
    pros: [
      'Programa de millas y puntos atractivo',
      'Buen servicio para personas con cuentas en dólares y pesos',
      'Tarjetas premium (Visa Infinite, Mastercard Black) con beneficios reales',
    ],
    cons: [
      'Red de sucursales más limitada',
      'Costos elevados sin paquete activo',
      'Algunos productos requieren ingresos altos para acceder',
    ],
    extractoFormat:
      'En Scotia en Línea, entrá a Cuentas → Movimientos → Exportar a Excel o PDF.',
  },
  {
    name: 'Heritage',
    fullName: 'Banco Heritage',
    type: 'Privado · Capital local',
    foundedYear: 2002,
    color: 'bg-[#0066CC]',
    summary:
      'Banco más chico, con foco en pymes, comercio exterior e inversiones. Suele ser elegido por profesionales independientes y empresas medianas que buscan trato más cercano que en los bancos grandes.',
    pros: [
      'Atención más personalizada',
      'Productos pensados para pymes y comercio exterior',
      'Buena alternativa para diversificar entre varios bancos',
    ],
    cons: [
      'Pocas sucursales',
      'Servicios digitales menos desarrollados que la competencia',
      'Menor cantidad de cajeros en RedBROU y Banred',
    ],
    extractoFormat:
      'Desde e-Heritage → Cuentas → Movimientos → Descargar (Excel, CSV, PDF).',
  },
];

export default function BancosUruguayPage() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Bancos en Uruguay 2026: Comparativa Completa',
    description:
      'Análisis comparativo de los principales bancos uruguayos: BROU, BBVA, Itaú, Santander, Scotiabank y Heritage.',
    author: { '@type': 'Organization', name: 'Ahorrin' },
    publisher: {
      '@type': 'Organization',
      name: 'Ahorrin',
      logo: { '@type': 'ImageObject', url: 'https://www.ahorrin.app/logo.svg' },
    },
    datePublished: '2026-04-28',
    dateModified: '2026-04-28',
    mainEntityOfPage: 'https://www.ahorrin.app/bancos-uruguay',
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <p className="text-sm text-muted-foreground mb-3">Última actualización: abril 2026</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Bancos en Uruguay 2026: Comparativa Completa
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              En Uruguay operan seis bancos comerciales relevantes para personas físicas: uno
              estatal (BROU) y cinco privados (BBVA, Itaú, Santander, Scotiabank, Heritage). Esta
              guía analiza, sin marketing bancario de por medio, qué diferencia a cada uno y cómo
              descargar extractos para llevar tus cuentas al día.
            </p>
          </header>

          <section className="mb-12 p-6 rounded-lg bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold mb-2">Nota importante</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ahorrin no recibe comisiones de ningún banco. Esta comparativa se basa en datos
                  públicos, tarifarios oficiales y experiencia real de uso. Las condiciones cambian
                  con frecuencia: verificá siempre con el banco antes de tomar una decisión.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Cuál banco te conviene</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Si tu prioridad es <strong>red de cajeros y sucursales</strong>, BROU no tiene
              competencia. Si querés <strong>la mejor app móvil</strong>, Itaú o BBVA. Si tu sueldo
              entra <strong>en dólares</strong>, Santander o Scotiabank suelen ser más eficientes.
              Para <strong>préstamos hipotecarios baratos en UI</strong>, BBVA y BHU (banco
              hipotecario) lideran. Para <strong>pymes y trato cercano</strong>, Heritage es una
              opción honesta.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Lo más importante: en Uruguay no hay un banco objetivamente "mejor". Hay un banco
              mejor para tu perfil. La gente que está conforme con su banco suele cumplir tres
              condiciones: tiene la nómina depositada ahí, no paga comisiones (porque está dentro
              de un paquete activo) y usa la app más que las sucursales.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Análisis banco por banco</h2>
            <div className="space-y-8">
              {banks.map((bank) => (
                <article
                  key={bank.name}
                  className="border border-border rounded-lg p-6 bg-card"
                >
                  <header className="flex items-center gap-4 mb-4">
                    <div
                      className={`${bank.color} w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0`}
                    >
                      {bank.name.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{bank.fullName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {bank.type} · Fundado en {bank.foundedYear}
                      </p>
                    </div>
                  </header>

                  <p className="text-muted-foreground mb-5 leading-relaxed">{bank.summary}</p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-5">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">A favor</h4>
                      <ul className="space-y-1.5">
                        {bank.pros.map((pro) => (
                          <li key={pro} className="flex gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">A tener en cuenta</h4>
                      <ul className="space-y-1.5">
                        {bank.cons.map((con) => (
                          <li key={con} className="flex gap-2 text-sm text-muted-foreground">
                            <span className="text-amber-600 shrink-0 mt-0.5">·</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/40 rounded p-3 text-sm">
                    <p className="font-medium mb-1 flex items-center gap-2">
                      <FileUp className="w-4 h-4" />
                      Cómo descargar tu extracto
                    </p>
                    <p className="text-muted-foreground">{bank.extractoFormat}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Cómo elegir entre varios bancos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              En la práctica, mucha gente en Uruguay tiene cuenta en más de un banco: una para el
              sueldo (donde el empleador deposita), otra para ahorros o cuentas conjuntas. Esto es
              común y útil — las cajas de ahorro hasta cierto monto son gratuitas, y diversificar
              entre bancos reduce el riesgo si uno tiene caída de sistema.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Antes de abrir una cuenta, fijate en cuatro cosas: <strong>1)</strong> costo mensual
              real (incluyendo cargo por mantenimiento si no cumplís ciertos requisitos);{' '}
              <strong>2)</strong> red de cajeros incluida (RedBROU, Banred); <strong>3)</strong>{' '}
              límite de transferencias gratis por mes; <strong>4)</strong> facilidad de exportar
              extractos para tu contador o para apps de finanzas personales.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Sobre extractos: todos los bancos uruguayos permiten descargar movimientos en formato
              digital, pero con diferentes calidades. CSV o Excel es lo ideal para procesar después.
              PDF es útil para presentar como comprobante, pero malo para análisis automatizado.
            </p>
          </section>

          <section className="mb-12 bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Cómo Ahorrin trabaja con extractos bancarios
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ahorrin permite subir extractos exportados desde cualquiera de estos bancos (CSV o
              Excel) y los categoriza automáticamente. <strong>No conectamos con tu banco</strong>,
              no pedimos credenciales y no tenemos acceso a tu cuenta — vos descargás el archivo
              desde tu home banking y lo subís manualmente.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Esto es importante porque en Uruguay la mayoría de bancos no exponen una API pública
              tipo Open Banking, así que cualquier herramienta que diga conectarse "en vivo" o está
              raspando el home banking (riesgoso) o está mintiendo. El método de subir extractos es
              el más seguro y el que recomienda cualquier contador.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Probar Ahorrin gratis
            </Link>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Lecturas relacionadas</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog/prestamos-hipotecarios-uruguay-2025-guia-completa"
                  className="text-primary hover:underline"
                >
                  Préstamos hipotecarios en Uruguay: guía completa
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/mejores-tarjetas-credito-uruguay-2026-comparativa"
                  className="text-primary hover:underline"
                >
                  Mejores tarjetas de crédito en Uruguay 2026
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/plazo-fijo-uruguay-2026-tasas-comparativa"
                  className="text-primary hover:underline"
                >
                  Plazo fijo en Uruguay: comparativa de tasas
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/transferencias-internacionales-uruguay-opciones-costos"
                  className="text-primary hover:underline"
                >
                  Transferencias internacionales: opciones y costos
                </Link>
              </li>
            </ul>
          </section>

          <footer className="text-sm text-muted-foreground border-t border-border pt-6">
            <p>
              Esta página se actualiza periódicamente. Si detectás un dato incorrecto, escribinos a{' '}
              <a href="mailto:hola@ahorrin.app" className="text-primary hover:underline">
                hola@ahorrin.app
              </a>
              . Ahorrin no recibe pagos de los bancos mencionados.
            </p>
          </footer>
        </div>
      </article>
    </div>
  );
}

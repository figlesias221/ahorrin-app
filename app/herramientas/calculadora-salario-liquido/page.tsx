import { SalaryCalculator } from '@/components/free-tools/salary-calculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculadora de Salario Líquido Uruguay 2025 | Herramienta Gratuita | Ahorrin',
  description: '¿Cuánto te queda después de impuestos? Calculá tu salario líquido en Uruguay 2025. IRPF, BPS, Fonasa actualizados. Compará escenarios. 100% gratis.',
  keywords: [
    'calculadora sueldo liquido uruguay',
    'salario liquido uruguay 2025',
    'calculadora irpf uruguay',
    'calcular impuestos sueldo uruguay',
    'cuanto me queda de sueldo uruguay',
    'sueldo neto uruguay',
    'calculadora bps uruguay',
    'fonasa calculadora uruguay',
    'impuestos sueldo uruguay 2025',
    'cuanto gano liquido uruguay',
    'calcular aporte bps',
    'irpf sueldo uruguay',
    'sueldo en mano uruguay'
  ],
  openGraph: {
    title: 'Calculadora de Salario Líquido Uruguay 2025 | Ahorrin',
    description: '¿Cuánto te queda realmente después de impuestos? Calculá tu salario líquido con IRPF, BPS y Fonasa actualizados 2025.',
    type: 'website',
    url: 'https://www.ahorrin.app/herramientas/calculadora-salario-liquido',
    locale: 'es_UY',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Salario Líquido Uruguay 2025',
    description: '¿Cuánto te queda después de IRPF, BPS y Fonasa? Calculalo gratis.',
  },
  alternates: {
    canonical: 'https://www.ahorrin.app/herramientas/calculadora-salario-liquido',
  },
};

export default function CalculadoraSalarioLiquidoPage() {
  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculadora de Salario Líquido Uruguay 2025',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'UYU',
    },
    description: 'Calculadora gratuita de salario líquido para Uruguay 2025. Ingresá tu salario nominal y obtené tu sueldo neto después de IRPF, BPS y Fonasa con las tasas actualizadas.',
    featureList: [
      'Cálculo de IRPF según franjas DGI 2025',
      'Aportes BPS actualizados (15%)',
      'Fonasa según carga familiar',
      'Comparador de escenarios (aumentos de sueldo)',
      'Desglose detallado de descuentos',
      'Cálculo de aguinaldo neto'
    ],
    audience: {
      '@type': 'Audience',
      audienceType: 'Trabajadores en relación de dependencia en Uruguay',
      geographicArea: {
        '@type': 'Country',
        name: 'Uruguay'
      }
    }
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cómo se calcula el salario líquido en Uruguay?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El salario líquido es tu sueldo nominal menos los descuentos obligatorios: BPS (15%), Fonasa (3-8% según carga familiar) e IRPF (0-36% según franjas de ingreso). Las franjas de IRPF 2025 van desde 0% para ingresos hasta $60,596 hasta 36% para montos superiores a $456,768.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Qué es el IRPF y cuánto me descuentan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El IRPF (Impuesto a la Renta de las Personas Físicas) es un impuesto progresivo que va de 0% a 36%. Tenés una deducción mínima no imponible de $60,596. Sobre el excedente se aplican franjas: 10% hasta $86,566, 15% hasta $119,890, 24% hasta $177,416, 25% hasta $239,698, 27% hasta $456,768 y 36% sobre lo que supere ese monto.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Cuánto es el aporte a BPS en 2025?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El aporte al BPS (Banco de Previsión Social) es del 15% de tu salario nominal para trabajadores en relación de dependencia. Este porcentaje está vigente desde hace varios años y se descuenta automáticamente de tu recibo de sueldo.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Cómo funciona el descuento de Fonasa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fonasa varía según tu carga familiar: 3% si no tenés hijos a cargo, 4.5% con 1 hijo, 6% con 2 hijos o más. Se calcula sobre tu salario nominal y financia el sistema de salud mutual.'
        }
      },
      {
        '@type': 'Question',
        name: '¿El aguinaldo también tiene descuentos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, el aguinaldo (o sueldo anual complementario) también tiene los mismos descuentos: BPS (15%), Fonasa (3-8%) e IRPF según las franjas. Esta calculadora te permite calcular tu aguinaldo neto.'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="bg-background pt-28 sm:pt-36 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Calculadora de Salario Líquido Uruguay 2026
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            Ingresá tu sueldo nominal y descubrí cuánto te queda realmente después de IRPF, BPS
            y FONASA. La calculadora usa las franjas y tasas oficiales actualizadas, te
            desglosa cada descuento y te permite simular escenarios (aumentos, cambios de
            categoría FONASA, etc.).
          </p>
          <p className="text-muted-foreground leading-relaxed">
            En Uruguay la diferencia entre el salario nominal y el líquido es importante. Un
            sueldo nominal de $100.000 termina siendo aproximadamente $74.000 en mano para una
            persona soltera sin hijos, y aún menos si tiene cargas familiares en FONASA. Saber
            la cifra real es lo primero para presupuestar bien.
          </p>
        </div>
      </section>

      <SalaryCalculator />

      <section className="bg-background py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h2 className="text-3xl font-bold mb-6">Cómo se calcula tu salario líquido en Uruguay</h2>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Tu sueldo nominal (el "bruto" que figura en el contrato) tiene tres descuentos
            obligatorios para empleados en relación de dependencia: <strong>BPS</strong> (15%),{' '}
            <strong>FONASA</strong> (entre 3% y 8% según cargas familiares) e{' '}
            <strong>IRPF</strong> (escala progresiva de 0% a 36%). Lo que queda es tu salario
            líquido.
          </p>

          <h3 className="text-2xl font-semibold mb-4">BPS (15%)</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            El aporte a la Seguridad Social es del 15% del nominal y va al sistema previsional
            (jubilaciones). Es fijo y se aplica a todo trabajador en relación de dependencia. No
            tiene mínimo no imponible, se descuenta desde el primer peso.
          </p>

          <h3 className="text-2xl font-semibold mb-4">FONASA (3% a 8%)</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            El aporte a la Salud depende de tu situación familiar y de tu nivel de ingresos:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-4 ml-6 list-disc">
            <li>
              <strong>Sin cónyuge ni hijos a cargo:</strong> 3% si ganás hasta 2,5 BPC; 4,5% si
              superás ese umbral.
            </li>
            <li>
              <strong>Con hijos a cargo:</strong> +2% adicional respecto del caso base.
            </li>
            <li>
              <strong>Con cónyuge a cargo:</strong> +2% adicional respecto del caso base.
            </li>
            <li>
              <strong>Con cónyuge e hijos a cargo:</strong> hasta 8% en total.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-6">
            FONASA es el que más sorpresas trae cuando alguien ve por primera vez su recibo.
            Tener un hijo cambia tu líquido en aproximadamente 2% del nominal a partir del mes
            siguiente al nacimiento (si registrás la carga ante BPS).
          </p>

          <h3 className="text-2xl font-semibold mb-4">IRPF (Categoría II — escala progresiva)</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            El IRPF de Categoría II se aplica solo sobre el excedente del mínimo no imponible y
            por escalas progresivas. Para 2026, las franjas referenciales (sujetas a ajuste por
            BPC) son aproximadamente:
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2">Tramo del nominal</th>
                  <th className="text-left p-2">Tasa marginal</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <td className="p-2">Hasta el mínimo no imponible</td>
                  <td className="p-2">0%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2">Tramo siguiente</td>
                  <td className="p-2">10%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2">Tramo siguiente</td>
                  <td className="p-2">15%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2">Tramo siguiente</td>
                  <td className="p-2">24%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2">Tramo siguiente</td>
                  <td className="p-2">25%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2">Tramo siguiente</td>
                  <td className="p-2">27%</td>
                </tr>
                <tr>
                  <td className="p-2">Tramo más alto</td>
                  <td className="p-2">36%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Importante: la tasa marginal es la que se paga sobre el último peso ganado, no sobre
            el total. Si ganás $200.000 nominales, no pagás 24% sobre toda esa cifra; pagás 0% en
            la primera porción, 10% en la siguiente, 15% en la otra, etc. La tasa efectiva
            promedio es siempre menor que la marginal de tu tramo.
          </p>

          <h3 className="text-2xl font-semibold mb-4">Deducciones IRPF que pueden bajar tu impuesto</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Sobre el IRPF calculado, tenés derecho a deducirte ciertos conceptos que pueden
            reducir el impuesto:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-6 ml-6 list-disc">
            <li>
              <strong>Cargas familiares:</strong> deducción por hijos menores de 18 años o
              mayores con discapacidad.
            </li>
            <li>
              <strong>FONASA pagado:</strong> el aporte a Salud es deducible parcialmente.
            </li>
            <li>
              <strong>Aportes jubilatorios:</strong> el aporte BPS es deducible.
            </li>
            <li>
              <strong>Cuota préstamo hipotecario para vivienda única:</strong> hasta 36 BPC anuales.
            </li>
            <li>
              <strong>Servicios profesionales:</strong> ciertas deducciones por asesoría
              contable, médica, etc., en porcentajes acotados.
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4">Aguinaldo: cómo se calcula y se descuenta</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            El aguinaldo (sueldo anual complementario) se paga en dos cuotas: junio y diciembre.
            Cada cuota equivale a una doceava parte de los sueldos cobrados en el semestre
            anterior. Tiene los mismos descuentos que un sueldo común: BPS, FONASA e IRPF.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Un truco que muchos no saben: si tu sueldo te ubica cerca del límite de un tramo
            IRPF, el aguinaldo puede empujarte a un tramo superior <strong>solo en el mes de
            cobro</strong>, lo que hace que la retención sea más alta de lo esperado. Es normal,
            no es un error: al final del año fiscal eso se balancea cuando hagas la declaración
            anual.
          </p>

          <h3 className="text-2xl font-semibold mb-4">Diferencia con monotributistas y unipersonales</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Esta calculadora es para empleados en <strong>relación de dependencia</strong>. Si
            sos monotributista, unipersonal o titular de SAS, tu situación tributaria es
            distinta — tenés IRAE en lugar de IRPF (o un régimen simplificado), y los aportes a
            BPS son fijos según categoría, no porcentuales. Para esos casos podés leer nuestra{' '}
            <a
              href="/blog/monotributo-uruguay-2025-guia-completa-requisitos-costos"
              className="text-primary hover:underline"
            >
              guía de monotributo
            </a>{' '}
            o la{' '}
            <a
              href="/blog/irae-vs-irpf-diferencias-emprendedores-uruguay"
              className="text-primary hover:underline"
            >
              comparativa IRAE vs IRPF
            </a>
            .
          </p>

          <h3 className="text-2xl font-semibold mb-4">Cómo usar esta calculadora</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Cargá tu sueldo nominal mensual, indicá si tenés cónyuge o hijos a cargo a efectos
            de FONASA, y la herramienta calcula:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-6 ml-6 list-disc">
            <li>Tu salario líquido mensual.</li>
            <li>Aporte a BPS, FONASA e IRPF desglosado.</li>
            <li>Tasa efectiva total (qué porcentaje de tu nominal es descuento).</li>
            <li>Comparador: cuánto cambia tu líquido si recibís un aumento.</li>
            <li>Aguinaldo neto estimado para junio y diciembre.</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-6">
            La calculadora usa las tasas vigentes a la fecha de última actualización. Las franjas
            del IRPF se ajustan anualmente por BPC, así que pueden variar levemente respecto a
            tu recibo. Para información oficial, consultá el sitio de la{' '}
            <a
              href="https://www.dgi.gub.uy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              DGI
            </a>{' '}
            y del{' '}
            <a
              href="https://www.bps.gub.uy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              BPS
            </a>
            .
          </p>

          <p className="text-sm text-muted-foreground border-t border-border pt-6 mt-8">
            Esta calculadora es informativa y educativa. Los valores son estimaciones; tu recibo
            de sueldo real puede variar levemente por redondeos, retroactivos, partidas no
            gravadas o convenios particulares. Para asesoramiento fiscal específico, consultá
            con un contador habilitado.
          </p>
        </div>
      </section>
    </>
  );
}

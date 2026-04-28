import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Glosario Financiero Uruguay 2026 | Definiciones de Términos',
  description:
    'Diccionario de términos financieros uruguayos. IRPF, BPS, FONASA, UI, BCU, IRAE, IBKR, ETF, CFT y más. Definiciones claras con ejemplos.',
  alternates: { canonical: 'https://www.ahorrin.app/glosario' },
  keywords: [
    'glosario financiero uruguay',
    'diccionario financiero',
    'que es irpf',
    'que es ui uruguay',
    'que es fonasa',
    'términos financieros uruguay',
  ],
  openGraph: {
    title: 'Glosario Financiero Uruguay | Ahorrin',
    description:
      'Definiciones claras de IRPF, BPS, FONASA, UI, BCU, ETF y todos los términos que necesitás conocer.',
    url: 'https://www.ahorrin.app/glosario',
    type: 'website',
  },
};

interface Term {
  term: string;
  abbr?: string;
  definition: string;
  example?: string;
  related?: { label: string; href: string }[];
}

const terms: Term[] = [
  {
    term: 'AFAP',
    abbr: 'Administradora de Fondos de Ahorro Previsional',
    definition:
      'Empresas privadas que administran el ahorro jubilatorio individual del régimen mixto uruguayo. En Uruguay operan República AFAP, Sura AFAP, Itaú AFAP e Integración AFAP. Todo trabajador en relación de dependencia que supere cierto umbral de ingresos aporta obligatoriamente a una AFAP.',
    example:
      'Si ganás más de aproximadamente $80.000 nominales, parte de tu aporte BPS va al BPS solidario y otra parte a una AFAP que vos elegís.',
    related: [
      { label: 'BPS', href: '#bps' },
      { label: 'Jubilación', href: '#jubilacion' },
    ],
  },
  {
    term: 'Aguinaldo',
    abbr: 'Sueldo Anual Complementario (SAC)',
    definition:
      'Pago semestral obligatorio en Uruguay equivalente a la doceava parte del total de remuneraciones cobradas en el período. Se paga en junio (por enero-junio) y diciembre (por julio-diciembre).',
    example:
      'Si ganaste $60.000 mensuales durante todo el primer semestre, tu aguinaldo de junio será aproximadamente $30.000 (12 sueldos / 24 = medio sueldo por semestre, antes de descuentos).',
  },
  {
    term: 'BCU',
    abbr: 'Banco Central del Uruguay',
    definition:
      'Autoridad monetaria del país. Regula el sistema financiero, emite moneda, fija tasas de referencia y publica indicadores económicos como inflación, tipo de cambio y reservas internacionales.',
  },
  {
    term: 'BHU',
    abbr: 'Banco Hipotecario del Uruguay',
    definition:
      'Banco estatal especializado en créditos hipotecarios para vivienda. Suele ofrecer mejores condiciones que la banca privada para perfiles de ingresos medios y bajos, pero con procesos más lentos.',
  },
  {
    term: 'BPC',
    abbr: 'Base de Prestaciones y Contribuciones',
    definition:
      'Unidad de cuenta uruguaya que se ajusta anualmente y se usa como referencia para múltiples prestaciones, multas, montos mínimos no imponibles y franjas tributarias. La fija el Poder Ejecutivo.',
    example:
      'Las franjas del IRPF están expresadas en BPC. Si la BPC vale $7.000, una franja de "10 BPC" equivale a $70.000.',
  },
  {
    term: 'BPS',
    abbr: 'Banco de Previsión Social',
    definition:
      'Organismo estatal encargado de la seguridad social en Uruguay. Administra jubilaciones, pensiones, asignaciones familiares y los aportes obligatorios al sistema previsional. Los empleados aportan 15% de su sueldo nominal.',
    example:
      'En tu recibo de sueldo, "Aporte Jubilatorio 15%" es BPS. De un nominal de $50.000, $7.500 van a BPS.',
    related: [
      { label: 'AFAP', href: '#afap' },
      { label: 'FONASA', href: '#fonasa' },
    ],
  },
  {
    term: 'BROU',
    abbr: 'Banco República Oriental del Uruguay',
    definition:
      'Banco estatal y el más grande del país. Tiene la red más extensa de sucursales y cajeros, y es donde se acreditan la mayoría de sueldos públicos y jubilaciones.',
    related: [{ label: 'Bancos en Uruguay', href: '/bancos-uruguay' }],
  },
  {
    term: 'CFT',
    abbr: 'Costo Financiero Total',
    definition:
      'Indicador que muestra el costo verdadero de un préstamo o crédito, incluyendo no solo la tasa de interés sino también seguros obligatorios, comisiones, gastos administrativos e impuestos. Siempre es mayor que la tasa nominal.',
    example:
      'Un préstamo con tasa nominal anual de 25% puede tener un CFT de 38% una vez que sumás seguro de vida obligatorio, comisión de apertura e IVA sobre intereses.',
  },
  {
    term: 'DGI',
    abbr: 'Dirección General Impositiva',
    definition:
      'Organismo estatal recaudador de impuestos en Uruguay. Administra IRPF, IVA, IRAE, IMESI y otros tributos nacionales.',
  },
  {
    term: 'ETF',
    abbr: 'Exchange-Traded Fund',
    definition:
      'Fondo cotizado en bolsa que replica un índice (ej. S&P 500) o sector. Se compra y vende como una acción, pero internamente diversifica entre cientos de activos. Costos bajos y alta liquidez. En Uruguay se accede principalmente a través de brokers internacionales como Interactive Brokers (IBKR).',
    example:
      'VOO es un ETF que replica el índice S&P 500: con una sola compra, exponés tu plata a las 500 empresas más grandes de EE.UU.',
  },
  {
    term: 'Fondo de Emergencia',
    definition:
      'Reserva de dinero líquido (en caja de ahorro o instrumento de muy bajo riesgo) destinada a cubrir gastos imprevistos sin tener que endeudarse. Se recomienda que cubra entre 3 y 6 meses de gastos básicos.',
  },
  {
    term: 'FONASA',
    abbr: 'Fondo Nacional de Salud',
    definition:
      'Sistema que financia la cobertura de salud de los trabajadores formales en Uruguay. Aportan el empleado (3% a 8% según cargas familiares) y el empleador. Permite elegir entre prestadores integrales (mutualistas o ASSE).',
    example:
      'Una persona soltera sin hijos aporta 3% si gana hasta cierto umbral, y 4,5% si lo supera. Con dos hijos el aporte sube a 6,5% u 8%.',
    related: [{ label: 'BPS', href: '#bps' }],
  },
  {
    term: 'IBKR',
    abbr: 'Interactive Brokers',
    definition:
      'Broker internacional muy usado por uruguayos para invertir en acciones, ETFs y bonos del exterior. Tiene comisiones bajas y aceptan transferencias internacionales desde Uruguay.',
  },
  {
    term: 'INE',
    abbr: 'Instituto Nacional de Estadística',
    definition:
      'Organismo estatal que produce las estadísticas oficiales del país. Publica el IPC (índice de precios al consumo), datos de empleo, cuentas nacionales y censo.',
  },
  {
    term: 'IPC',
    abbr: 'Índice de Precios al Consumo',
    definition:
      'Mide la variación promedio de precios de una canasta representativa de bienes y servicios en Uruguay. Lo publica el INE mensualmente y es la medida oficial de inflación. Se usa también para ajustar UI, alquileres y obligaciones contractuales.',
    related: [
      { label: 'UI', href: '#ui' },
      {
        label: 'Calculadora de inflación real',
        href: '/herramientas/inflacion-real',
      },
    ],
  },
  {
    term: 'IRAE',
    abbr: 'Impuesto a las Rentas de Actividades Económicas',
    definition:
      'Impuesto del 25% sobre la utilidad neta de empresas (S.A., SAS, SRL, sucursales). Sustituye al IRPF cuando se trabaja a través de una sociedad. Permite deducir gastos relacionados con la actividad.',
    related: [
      { label: 'IRPF', href: '#irpf' },
      { label: 'SAS', href: '#sas' },
    ],
  },
  {
    term: 'IRPF',
    abbr: 'Impuesto a la Renta de las Personas Físicas',
    definition:
      'Impuesto sobre los ingresos personales en Uruguay. Tiene dos categorías: Cat. I (rentas de capital, alquileres, intereses, dividendos) y Cat. II (rentas del trabajo en relación de dependencia o servicios personales). Cat. II es progresivo, con franjas que van de 0% a 36%.',
    example:
      'Si ganás $100.000 nominales en relación de dependencia, no pagás 24% sobre todo. Pagás 0% en la primera franja, luego 10%, luego 15%, etc., hasta el último peso ganado.',
  },
  {
    term: 'ISR',
    abbr: 'Incremental Static Regeneration',
    definition:
      'Término técnico de desarrollo web sin relación con tributos uruguayos. No confundir con "ISR" del impuesto sobre la renta de otros países (en Uruguay es IRPF).',
  },
  {
    term: 'IVA',
    abbr: 'Impuesto al Valor Agregado',
    definition:
      'Impuesto al consumo aplicado a casi todas las operaciones de compra-venta de bienes y servicios en Uruguay. Tasa básica: 22%. Tasa mínima: 10% (alimentos, medicamentos). Algunos servicios están exentos.',
  },
  {
    term: 'Jubilación',
    definition:
      'Beneficio mensual vitalicio al que se accede al cumplir la edad mínima (60 años con 30 años de aportes; o 65 años con menos años) y haber aportado al sistema. En Uruguay el cálculo combina BPS y AFAP.',
    related: [
      { label: 'AFAP', href: '#afap' },
      { label: 'BPS', href: '#bps' },
    ],
  },
  {
    term: 'Letra de Regulación Monetaria',
    abbr: 'LRM',
    definition:
      'Instrumento de deuda emitido por el BCU para regular la cantidad de dinero en circulación. Las personas pueden invertir en LRM a través de algunos bancos o corredores; ofrece rendimientos por encima de la inflación con bajo riesgo (riesgo país soberano uruguayo).',
  },
  {
    term: 'Literal E',
    definition:
      'Régimen tributario simplificado para pequeñas empresas (Literal E del IVA) en Uruguay. Tiene un tope de facturación anual y simplifica el pago de impuestos a una cuota fija mensual.',
    related: [
      { label: 'Monotributo', href: '#monotributo' },
      { label: 'IRAE', href: '#irae' },
    ],
  },
  {
    term: 'Monotributo',
    definition:
      'Régimen simplificado del BPS para profesionales y microempresarios con baja facturación. Pagás una cuota fija mensual que cubre tributos previsionales y de salud, sin necesidad de hacer declaraciones de IRPF/IRAE.',
  },
  {
    term: 'Plazo Fijo',
    definition:
      'Depósito bancario por un plazo determinado (30, 60, 90 días, 1 año) a una tasa de interés acordada. En Uruguay se pueden hacer en pesos, UI o dólares. Suelen requerir un mínimo de USD 1.000 o equivalente.',
  },
  {
    term: 'PYME',
    abbr: 'Pequeña y Mediana Empresa',
    definition:
      'Categorización empresarial según facturación y cantidad de empleados. En Uruguay, la mayoría de las empresas son PYMES y tienen acceso a regímenes y créditos diferenciados.',
  },
  {
    term: 'SAS',
    abbr: 'Sociedad por Acciones Simplificada',
    definition:
      'Tipo societario flexible y de bajo costo de creación, ideal para startups y pequeños emprendimientos. Se constituye en pocos días y permite un único accionista. Tributa IRAE.',
  },
  {
    term: 'Tasa Nominal Anual',
    abbr: 'TNA',
    definition:
      'Tasa de interés anual sin capitalización. Usada en publicidad bancaria. Generalmente es menor que la tasa efectiva (TEA) que sí incluye el efecto de la capitalización.',
  },
  {
    term: 'UI',
    abbr: 'Unidad Indexada',
    definition:
      'Unidad de cuenta uruguaya cuyo valor se ajusta diariamente según el IPC. Sirve para mantener el poder adquisitivo en contratos de largo plazo (alquileres, hipotecas, préstamos). El BCU publica el valor diario.',
    example:
      'Un préstamo hipotecario de 1.000.000 UI a 20 años: la deuda en pesos sube todos los meses, pero su valor real (en términos de poder adquisitivo) se mantiene.',
    related: [{ label: 'IPC', href: '#ipc' }],
  },
  {
    term: 'Unipersonal',
    definition:
      'Empresa con un único titular, persona física. En Uruguay se inscribe en BPS y DGI, factura a su nombre y tributa IRPF Cat. I/II o IRAE según ingresos. Sin separación patrimonial entre la empresa y la persona.',
  },
  {
    term: 'Zona Franca',
    definition:
      'Áreas geográficas dentro de Uruguay con beneficios fiscales especiales. Las empresas instaladas en zona franca quedan exentas de la mayoría de impuestos, pero deben cumplir requisitos de actividad y empleo.',
  },
];

export default function GlosarioPage() {
  const sortedTerms = [...terms].sort((a, b) => a.term.localeCompare(b.term, 'es'));
  const letters = Array.from(new Set(sortedTerms.map((t) => t.term[0].toUpperCase()))).sort();

  const definedTermJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Glosario Financiero Uruguay',
    description: 'Diccionario de términos financieros y tributarios uruguayos',
    hasDefinedTerm: sortedTerms.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      alternateName: t.abbr,
      description: t.definition,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.ahorrin.app' },
      { '@type': 'ListItem', position: 2, name: 'Glosario', item: 'https://www.ahorrin.app/glosario' },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="bg-background pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
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
              <li className="text-foreground font-medium">Glosario</li>
            </ol>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Glosario Financiero Uruguay</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            Definiciones claras de los términos que aparecen en tus recibos de
            sueldo, contratos bancarios e inversiones. Sin tecnicismos
            innecesarios, con ejemplos concretos para Uruguay.
          </p>

          <div className="flex flex-wrap gap-2 mb-12">
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-10 h-10 flex items-center justify-center bg-card border border-border rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>

          <div className="space-y-12">
            {letters.map((letter) => (
              <section key={letter} id={`letter-${letter}`}>
                <h2 className="text-3xl font-bold mb-6 pb-2 border-b border-border">
                  {letter}
                </h2>
                <dl className="space-y-8">
                  {sortedTerms
                    .filter((t) => t.term[0].toUpperCase() === letter)
                    .map((t) => (
                      <div
                        key={t.term}
                        id={t.term.toLowerCase().replace(/\s+/g, '-')}
                        className="scroll-mt-24"
                      >
                        <dt className="mb-2">
                          <span className="text-2xl font-bold">{t.term}</span>
                          {t.abbr && (
                            <span className="text-base text-muted-foreground ml-3">
                              ({t.abbr})
                            </span>
                          )}
                        </dt>
                        <dd className="text-muted-foreground leading-relaxed mb-3">
                          {t.definition}
                        </dd>
                        {t.example && (
                          <dd className="bg-muted/40 border-l-4 border-primary/40 pl-4 py-2 text-sm text-muted-foreground rounded-r-md mb-3">
                            <strong className="text-foreground">Ejemplo:</strong>{' '}
                            {t.example}
                          </dd>
                        )}
                        {t.related && t.related.length > 0 && (
                          <dd className="flex flex-wrap gap-2 text-sm">
                            <span className="text-muted-foreground">Ver también:</span>
                            {t.related.map((r) => (
                              <Link
                                key={r.href}
                                href={r.href}
                                className="text-primary hover:underline"
                              >
                                {r.label}
                              </Link>
                            ))}
                          </dd>
                        )}
                      </div>
                    ))}
                </dl>
              </section>
            ))}
          </div>

          <div className="mt-16 bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              ¿Falta un término?
            </h2>
            <p className="text-muted-foreground">
              Si encontrás un concepto financiero o tributario uruguayo que no
              está acá, escribinos a{' '}
              <a href="mailto:hola@ahorrin.app" className="text-primary hover:underline">
                hola@ahorrin.app
              </a>{' '}
              y lo agregamos. El glosario crece con el aporte de la comunidad.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

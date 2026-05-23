import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText, RefreshCcw, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Metodología y fuentes | Ahorrin',
  description:
    'Cómo investigamos, calculamos y revisamos el contenido de Ahorrin. Fuentes oficiales (DGI, BPS, BCU, MEF), proceso de fact-checking y frecuencia de actualización.',
  alternates: { canonical: 'https://www.ahorrin.app/metodologia' },
  openGraph: {
    title: 'Metodología y fuentes | Ahorrin',
    description:
      'Cómo investigamos, calculamos y revisamos el contenido de Ahorrin: fuentes oficiales, fact-checking y actualizaciones.',
    url: 'https://www.ahorrin.app/metodologia',
  },
};

const sources = [
  {
    name: 'DGI — Dirección General Impositiva',
    url: 'https://www.dgi.gub.uy',
    use: 'IRPF, IRAE, IVA, monotributo, calendario de vencimientos, formularios oficiales.',
  },
  {
    name: 'BPS — Banco de Previsión Social',
    url: 'https://www.bps.gub.uy',
    use: 'Aportes jubilatorios, FONASA, FRL, asignaciones familiares, licencias.',
  },
  {
    name: 'BCU — Banco Central del Uruguay',
    url: 'https://www.bcu.gub.uy',
    use: 'Tipo de cambio oficial, tasas de interés, valor UI y UR, regulación financiera.',
  },
  {
    name: 'INE — Instituto Nacional de Estadística',
    url: 'https://www.ine.gub.uy',
    use: 'IPC, índice de salarios, datos demográficos.',
  },
  {
    name: 'MEF — Ministerio de Economía y Finanzas',
    url: 'https://www.gub.uy/ministerio-economia-finanzas',
    use: 'Cambios normativos, presupuesto nacional, leyes y decretos en materia fiscal.',
  },
  {
    name: 'Parlamento del Uruguay',
    url: 'https://parlamento.gub.uy',
    use: 'Leyes vigentes y proyectos en discusión.',
  },
];

export default function MetodologiaPage() {
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

        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Metodología y fuentes
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed mb-12">
          Cómo investigamos, calculamos y revisamos cada artículo, glosario y calculadora. Sin
          atajos, sin AI inventada y sin números sacados de aire.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Cómo escribimos un artículo
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground leading-relaxed">
            <li>
              <strong>Investigación primaria.</strong> Partimos de la fuente oficial (DGI, BPS,
              BCU, MEF, INE) y leemos la normativa vigente — leyes, decretos, resoluciones —
              antes de escribir una línea.
            </li>
            <li>
              <strong>Cálculo manual.</strong> Reproducimos los cálculos relevantes (IRPF, BPS,
              FONASA, FRL, IVA) en planilla con casos reales antes de incluir cualquier número
              en el artículo.
            </li>
            <li>
              <strong>Redacción humana.</strong> El contenido lo escribe una persona del equipo,
              en general Federico, fundador de Ahorrin. Usamos asistentes de redacción
              para ortografía y estilo, pero no para inventar datos ni cálculos.
            </li>
            <li>
              <strong>Revisión cruzada.</strong> Antes de publicar, contrastamos los números
              contra al menos dos fuentes oficiales y, si es posible, contra recibos o
              constancias reales (anonimizados).
            </li>
            <li>
              <strong>Citamos.</strong> Linkeamos a la fuente oficial cuando es relevante para
              que vos puedas verificarlo.
            </li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Cómo construimos las calculadoras
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Las calculadoras de Ahorrin (Salario Líquido, Presupuesto, Inflación Real, Conversor
            de Extractos) usan los parámetros oficiales del año vigente:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed mb-4">
            <li>
              Tramos del IRPF y mínimos no imponibles según el último ajuste publicado por DGI.
            </li>
            <li>Aportes BPS (15% personal), FONASA (3-8% según tramo y dependientes) y FRL (0,1%).</li>
            <li>Valor de la BPC, UI y UR actualizado contra publicaciones oficiales.</li>
            <li>
              Aguinaldo y salario vacacional calculados según las leyes 12.840 y 12.590 con
              ajustes vigentes.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Cuando hay un cambio normativo (ajuste de tramos, nuevos topes, cambios de tasas),
            actualizamos los parámetros en cuanto se publica el cambio oficial. Las calculadoras
            son referencia: para liquidaciones formales, hablá con tu contador.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <RefreshCcw className="w-6 h-6 text-primary" />
            Frecuencia de actualización
          </h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
            <li>
              <strong>Inmediata</strong> ante cambios normativos relevantes (nueva ley, nuevo
              decreto, ajuste de tramos).
            </li>
            <li>
              <strong>Mensual</strong> para artículos sensibles a tasas (plazos fijos, dólar, UI,
              tarjetas).
            </li>
            <li>
              <strong>Trimestral</strong> para guías generales (IRPF, monotributo, comparativas
              bancarias).
            </li>
            <li>
              <strong>Anual</strong> obligatorio para revisar todo el catálogo, aunque no haya
              habido cambios.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Cada artículo muestra la fecha de publicación y la fecha de última revisión. Si ves
            algo desactualizado,{' '}
            <Link href="/contacto" className="text-primary hover:underline">
              avisanos
            </Link>{' '}
            y lo corregimos.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Fuentes oficiales que usamos</h2>
          <ul className="space-y-4">
            {sources.map((s) => (
              <li
                key={s.url}
                className="border border-border rounded-lg p-4 hover:border-primary/40 transition-colors"
              >
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
                >
                  {s.name}
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-sm text-muted-foreground mt-1">{s.use}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Conflictos de interés y publicidad</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Ahorrin se sostiene con dos fuentes de ingreso: suscripciones del producto y
            publicidad display (Google AdSense). La publicidad la gestiona Google y los anuncios
            que ves no son recomendaciones nuestras. Cuando recomendamos un banco, una tarjeta o
            un broker en el blog, lo hacemos sin recibir comisión, salvo que aclaremos
            explícitamente que hay un programa de afiliados.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            No vendemos datos personales. No compartimos información con anunciantes para
            segmentación más allá del estándar de AdSense.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Errores y correcciones</h2>
          <p className="text-muted-foreground leading-relaxed">
            Si encontrás un error, número viejo o información desactualizada, escribinos a{' '}
            <a
              href="mailto:hola@ahorrin.app"
              className="text-primary hover:underline"
            >
              hola@ahorrin.app
            </a>{' '}
            o usá el{' '}
            <Link href="/contacto" className="text-primary hover:underline">
              formulario de contacto
            </Link>
            . Las correcciones se reflejan con una nota al pie del artículo y la fecha de última
            revisión se actualiza.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
          <p className="text-muted-foreground leading-relaxed">
            Ahorrin no es asesor financiero, contador ni estudio jurídico, y no está regulado
            por el BCU. El contenido del sitio es informativo. Antes de tomar decisiones
            financieras importantes (inversión, deuda, declaración de impuestos), consultá con
            un profesional habilitado en Uruguay.
          </p>
        </section>
      </div>
    </div>
  );
}

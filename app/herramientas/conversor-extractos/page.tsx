import { CsvConverter } from '@/components/free-tools/csv-converter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conversor de Extractos Bancarios Uruguay | CSV a Excel | Ahorrin',
  description:
    'Convertí extractos bancarios de cualquier banco uruguayo (Itaú, BBVA, Scotiabank, BROU, Santander, Heritage) a formato Excel estandarizado. Gratis y sin registro.',
  keywords: [
    'convertir extracto itau excel',
    'convertir extracto bbva excel',
    'formato csv banco uruguay',
    'extracto scotiabank excel',
    'convertir extracto brou',
    'extracto bancario excel uruguay',
    'csv a excel banco',
  ],
  openGraph: {
    title: 'Conversor de Extractos Bancarios Uruguay | Ahorrin',
    description:
      'Convertí extractos de cualquier banco uruguayo a Excel estandarizado. Gratis.',
    type: 'website',
    url: 'https://www.ahorrin.app/herramientas/conversor-extractos',
  },
  alternates: {
    canonical: 'https://www.ahorrin.app/herramientas/conversor-extractos',
  },
};

export default function ConversorExtractosPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Conversor de Extractos Bancarios Uruguay',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'UYU' },
    description:
      'Herramienta gratuita para convertir extractos bancarios de cualquier banco uruguayo (Itaú, BBVA, Scotiabank, BROU, Santander, Heritage) a formato Excel estandarizado.',
    featureList: [
      'Conversión de CSV a Excel',
      'Soporte para todos los bancos uruguayos',
      'Formato estandarizado',
      'Procesamiento en el navegador (privado)',
      'Sin registro requerido',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-background pt-28 sm:pt-36 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Conversor de Extractos Bancarios Uruguay
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            Subí el extracto que descargaste de tu banco uruguayo (BROU, BBVA, Itaú, Santander,
            Scotiabank, Heritage) y obtené un Excel limpio, estandarizado y listo para usar en
            cualquier planilla. Procesamiento 100% en el navegador: tus datos no salen de tu
            computadora.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Cada banco exporta los extractos con un formato distinto: distinto orden de columnas,
            distintas codificaciones de fecha, distintos separadores. Esta herramienta los
            normaliza a una estructura común con columnas <code>Fecha</code>,{' '}
            <code>Descripción</code>, <code>Monto</code>, <code>Saldo</code>.
          </p>
        </div>
      </section>

      <CsvConverter />

      <section className="bg-background py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h2 className="text-3xl font-bold mb-6">
            Por qué necesitás convertir el extracto que te da el banco
          </h2>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Los archivos que descargás del home banking en Uruguay vienen con sorpresas. Algunos
            ejemplos reales:
          </p>

          <ul className="space-y-2 text-muted-foreground mb-6 ml-6 list-disc">
            <li>
              <strong>BROU:</strong> exporta CSV con separador punto y coma, fechas en formato
              dd/mm/yyyy y montos con coma decimal. Excel en español lo abre bien, pero Google
              Sheets en inglés lo importa todo en una columna.
            </li>
            <li>
              <strong>BBVA:</strong> ofrece XLSX, pero las primeras líneas son un encabezado de
              banco (con nombre del titular, número de cuenta, fechas) que confunde cualquier
              análisis automático.
            </li>
            <li>
              <strong>Itaú:</strong> exporta CSV bien estructurado, pero los créditos y débitos
              vienen en columnas separadas en lugar de un único campo "Monto" con signo.
            </li>
            <li>
              <strong>Santander:</strong> incluye una columna de "Comprobante" con códigos
              internos que no le sirven a nadie excepto a un cajero del banco.
            </li>
            <li>
              <strong>Scotiabank:</strong> puede exportar dos formatos distintos según en qué
              parte del home banking pidas el extracto, y son incompatibles entre sí.
            </li>
          </ul>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Esto significa que si querés analizar tus gastos de varios bancos juntos (cosa común
            en Uruguay donde mucha gente tiene cuenta en dos o tres) no podés simplemente
            apilarlos en un Excel. Hay que normalizar antes.
          </p>

          <h3 className="text-2xl font-semibold mb-4">Cómo descargar tu extracto</h3>

          <h4 className="text-xl font-semibold mb-2 mt-6">BROU</h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Ingresá a eBROU → seleccioná tu cuenta → Movimientos → en la parte superior derecha
            hay un ícono de descarga. Elegí formato <strong>Excel</strong> o <strong>CSV</strong>{' '}
            y el rango de fechas (máximo 6 meses por descarga).
          </p>

          <h4 className="text-xl font-semibold mb-2 mt-6">BBVA</h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            En BBVA Net Cash o en la app: Cuentas → Movimientos → botón "Exportar". Te deja
            elegir entre Excel, CSV y PDF. Para esta herramienta usá Excel o CSV.
          </p>

          <h4 className="text-xl font-semibold mb-2 mt-6">Itaú</h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            En itau.com.uy: ingresá a tu cuenta → Movimientos del período → seleccioná las fechas
            → "Descargar". Itaú te ofrece varios formatos; Excel es el más limpio.
          </p>

          <h4 className="text-xl font-semibold mb-2 mt-6">Santander</h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            En Online Banking: Cuentas → Estado de cuenta → en la última pantalla tenés "Descargar
            PDF" y "Descargar Excel".
          </p>

          <h4 className="text-xl font-semibold mb-2 mt-6">Scotiabank</h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            En Scotia en Línea: Cuentas → Movimientos → ícono de descarga arriba a la derecha.
            Excel es el formato más usable.
          </p>

          <h4 className="text-xl font-semibold mb-2 mt-6">Heritage</h4>
          <p className="text-muted-foreground leading-relaxed mb-6">
            En e-Heritage: Cuentas → Movimientos → Descargar (CSV o Excel).
          </p>

          <h3 className="text-2xl font-semibold mb-4">Es seguro subir mi extracto acá</h3>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Sí, porque el procesamiento ocurre <strong>en tu navegador</strong>. Cuando subís el
            archivo, no se envía a ningún servidor: todo el parseo y la conversión los hace
            JavaScript localmente, en tu computadora. Cuando descargás el Excel resultante, sale
            del mismo lugar.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Podés verificarlo abriendo las DevTools del navegador (F12), ir a la pestaña
            Network y subir un archivo: vas a ver que no hay ninguna request al servidor. Es
            puramente client-side.
          </p>

          <h3 className="text-2xl font-semibold mb-4">Cuándo usar esta herramienta</h3>
          <ul className="space-y-2 text-muted-foreground mb-6 ml-6 list-disc">
            <li>
              <strong>Para llevar contabilidad personal en Excel.</strong> Si llevás tus gastos en
              una planilla, esta herramienta te ahorra el copiado y pegado.
            </li>
            <li>
              <strong>Para mandar el extracto al contador.</strong> Si tu contador trabaja con un
              formato específico, esta herramienta te lo deja listo.
            </li>
            <li>
              <strong>Para subirlo a otra app de finanzas.</strong> El formato estandarizado es
              compatible con la mayoría de las apps que aceptan importación CSV.
            </li>
            <li>
              <strong>Para combinar varios bancos.</strong> Si tenés cuenta en BROU e Itaú, podés
              convertir ambos extractos al mismo formato y unirlos.
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4">Si querés algo más automatizado</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Esta herramienta convierte el archivo, pero no lo categoriza. Si querés que tus
            gastos se clasifiquen automáticamente en categorías (alimentación, transporte,
            vivienda, etc.) y ver gráficas mes a mes,{' '}
            <a href="/signup" className="text-primary hover:underline">
              creá una cuenta gratuita en Ahorrin
            </a>
            : la app hace el mismo proceso pero además te da análisis y reportes.
          </p>

          <p className="text-sm text-muted-foreground border-t border-border pt-6 mt-8">
            Conversión gratuita y sin registro. Procesamiento client-side. No almacenamos tus
            archivos.
          </p>
        </div>
      </section>
    </>
  );
}

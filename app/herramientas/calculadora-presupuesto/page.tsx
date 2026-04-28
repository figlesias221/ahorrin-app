import { BudgetCalculator } from '@/components/free-tools/budget-calculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculadora de Presupuesto Uruguay | Herramienta Gratuita | Ahorrin',
  description:
    'Calculá tu presupuesto mensual en Uruguay. Ingresá tus ingresos y gastos, y obtené recomendaciones personalizadas para controlar tus finanzas. 100% gratis.',
  keywords: [
    'calculadora presupuesto uruguay',
    'presupuesto mensual uruguay',
    'como hacer presupuesto uruguay',
    'planificar gastos uruguay',
    'finanzas personales uruguay',
    'control gastos uruguay',
    'regla 50 30 20 uruguay',
  ],
  openGraph: {
    title: 'Calculadora de Presupuesto Uruguay | Ahorrin',
    description:
      'Calculá tu presupuesto mensual en Uruguay. Ingresá tus ingresos y gastos, y obtené recomendaciones personalizadas.',
    type: 'website',
    url: 'https://www.ahorrin.app/herramientas/calculadora-presupuesto',
  },
  alternates: {
    canonical: 'https://www.ahorrin.app/herramientas/calculadora-presupuesto',
  },
};

export default function CalculadoraPresupuestoPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculadora de Presupuesto Uruguay',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'UYU' },
    description:
      'Calculadora gratuita de presupuesto mensual para Uruguay. Ingresá tus ingresos y gastos por categoría y obtené un análisis detallado de tu situación financiera.',
    featureList: [
      'Cálculo de presupuesto mensual personalizado',
      'Análisis por categorías de gastos',
      'Comparación con promedios uruguayos',
      'Recomendaciones financieras personalizadas',
      'Visualización de distribución de gastos',
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Qué es la regla 50/30/20 de presupuesto?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'La regla 50/30/20 sugiere destinar 50% de tu ingreso líquido a necesidades básicas (vivienda, alimentación, transporte, salud), 30% a gastos de estilo de vida (entretenimiento, salidas, suscripciones) y 20% a ahorro e inversiones. En Uruguay, con costo de vida en alza, muchos ajustan a 60/20/20 o 70/15/15 según el ingreso.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuánto debería ahorrar por mes en Uruguay?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Lo ideal es entre 15% y 20% de tu ingreso líquido. Si tu sueldo nominal es $80.000 y líquido $58.000, deberías apuntar a ahorrar entre $8.700 y $11.600 mensuales. Si recién empezás, comenzá con 5% e incrementá un punto por mes.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cómo calculo mi presupuesto si mis ingresos varían?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Si sos freelancer o tenés ingresos variables, presupuestá sobre el promedio de los últimos 6-12 meses, o mejor aún sobre el mes más bajo. Esto te da un colchón natural en los meses buenos. Tratá de tener siempre 3-6 meses de gastos básicos como fondo de emergencia.',
        },
      },
    ],
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
            Calculadora de Presupuesto Uruguay 2026
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            Una calculadora simple para ver, en cinco minutos, en qué se está yendo tu plata y
            cuánto te queda libre para ahorrar o invertir cada mes. Sin registro, sin compartir
            datos, todo se procesa en tu navegador.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Cargá tus ingresos líquidos (lo que efectivamente te entra a la cuenta después de
            IRPF, BPS y FONASA) y tus gastos por categoría. La herramienta te muestra tu balance,
            te compara con la regla 50/30/20 y te marca dónde estás gastando de más respecto del
            promedio de hogares uruguayos.
          </p>
        </div>
      </section>

      <BudgetCalculator />

      <section className="bg-background py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h2 className="text-3xl font-bold mb-6">Cómo armar un presupuesto que realmente uses</h2>

          <p className="text-muted-foreground leading-relaxed mb-4">
            La mayoría de los presupuestos fracasan no porque la persona no sepa hacer cuentas,
            sino porque son demasiado optimistas o demasiado complicados. Si te armás un Excel
            con 47 categorías y reglas elaboradas, lo vas a abandonar al tercer mes. Si te ponés
            metas heroicas tipo "voy a ahorrar el 40% de mi sueldo", también.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Un presupuesto útil cumple tres condiciones: <strong>1)</strong> está basado en tus
            gastos reales (no aspiracionales) de los últimos 3 meses, <strong>2)</strong> tiene
            un puñado de categorías amplias en lugar de docenas chicas, <strong>3)</strong> deja
            margen para imprevistos. Si lo armás así, podés mantenerlo a largo plazo.
          </p>

          <h3 className="text-2xl font-semibold mb-4">La regla 50/30/20 adaptada a Uruguay</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            La regla americana clásica dice: 50% para necesidades, 30% para deseos, 20% para
            ahorro. En Uruguay esa proporción es difícil de cumplir si vivís solo o sos joven,
            porque el alquiler en Montevideo se come una porción enorme del sueldo. Una persona
            que gana $50.000 líquidos y alquila a $25.000 ya consumió todo el 50% solo en
            vivienda.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Para ingresos uruguayos típicos, una distribución más realista es{' '}
            <strong>60% necesidades / 20% estilo de vida / 20% ahorro</strong>. Si recién
            empezás a trabajar y todavía no llegás al ahorro de 20%, no te frustres: empezá con
            5% y aumentá un punto por mes. Lo importante es la consistencia, no la magnitud
            inicial.
          </p>

          <h3 className="text-2xl font-semibold mb-4">Categorías que conviene tener</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Para un presupuesto manejable en Uruguay, alcanza con estas categorías:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-6 ml-6 list-disc">
            <li>
              <strong>Vivienda:</strong> alquiler o cuota hipotecaria, gastos comunes, OSE, UTE,
              Antel, internet, gas.
            </li>
            <li>
              <strong>Alimentación:</strong> supermercado, ferias, almuerzos en el trabajo. Si
              salís mucho a comer, separalo en "delivery / restaurantes" para verlo.
            </li>
            <li>
              <strong>Transporte:</strong> nafta + STM si tenés auto, o ómnibus + Uber si no.
            </li>
            <li>
              <strong>Salud:</strong> mutualista, FONASA si te lo descuentan, medicamentos,
              consultas privadas.
            </li>
            <li>
              <strong>Deudas:</strong> cuotas de tarjeta, préstamos, pago mínimo de cualquier
              línea de crédito activa.
            </li>
            <li>
              <strong>Estilo de vida:</strong> entretenimiento, suscripciones (Netflix, Spotify,
              gimnasio), compras de ropa, regalos.
            </li>
            <li>
              <strong>Ahorro e inversión:</strong> lo que va a plazo fijo, FCA, broker (IBKR,
              etc.) o caja de ahorro destinada a fondo de emergencia.
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4">El error más común en Uruguay</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Mucha gente arma su presupuesto en pesos y se olvida del efecto inflación. Con una
            inflación anual entre 6% y 8% (la del último ciclo), tus categorías de supermercado
            y servicios suben todos los meses, mientras tu sueldo (si es nominal en pesos) solo
            ajusta una o dos veces al año por convenio. Resultado: te empiezan a faltar pesos a
            mitad de año sin que cambie tu estilo de vida.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Una solución es revisar el presupuesto cada 3 meses, no cada 12. Otra es expresar
            las metas de ahorro en UI o dólares, no en pesos. Si querés ahorrar el equivalente
            a USD 200 por mes, cuando el dólar suba vas a tener que poner más pesos, pero el
            valor real del ahorro se mantiene.
          </p>

          <h3 className="text-2xl font-semibold mb-4">Fondo de emergencia primero</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Antes de invertir en plazos fijos, FCA, ETFs o cualquier otra cosa, asegurate de
            tener un fondo de emergencia equivalente a entre 3 y 6 meses de gastos básicos. En
            Uruguay 2026, eso significa para la mayoría de la gente entre $150.000 y $400.000
            (UYU) líquidos en una caja de ahorro, no invertidos.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Sin ese colchón, cualquier imprevisto (perder el trabajo, una enfermedad, un auto que
            se rompe) te tira a la deuda de tarjeta, que en Uruguay tiene tasas brutales que
            superan fácilmente el 80% efectivo anual. Pagar tarjeta en cuotas con financiación
            es la trampa financiera número uno acá.
          </p>

          <h3 className="text-2xl font-semibold mb-4">Cómo usar esta calculadora</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Cargá tus ingresos líquidos mensuales y tus gastos por categoría. Si no sabés
            exactamente cuánto gastás, mirá los movimientos de los últimos 3 meses en tu home
            banking y promediá. La herramienta te devuelve:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-6 ml-6 list-disc">
            <li>Tu balance mensual (ingresos menos gastos).</li>
            <li>Tu tasa de ahorro como porcentaje del ingreso.</li>
            <li>La distribución de tus gastos en porcentaje, comparada con la regla 50/30/20.</li>
            <li>Recomendaciones puntuales sobre categorías donde estás por encima del promedio.</li>
          </ul>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Ningún cálculo se guarda en nuestros servidores: todo corre en tu navegador. Si
            querés trackear tu presupuesto mes a mes y que la categorización ocurra
            automáticamente desde tus extractos bancarios, podés{' '}
            <a href="/signup" className="text-primary hover:underline">
              crear una cuenta gratuita en Ahorrin
            </a>
            .
          </p>

          <h3 className="text-2xl font-semibold mb-4">Preguntas frecuentes</h3>

          <h4 className="text-xl font-semibold mb-2 mt-6">¿Sirve para freelancers e ingresos variables?</h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Sí. En ese caso, presupuestá sobre el promedio de los últimos 6-12 meses, o mejor
            aún sobre el mes más bajo. Eso te deja margen los meses buenos.
          </p>

          <h4 className="text-xl font-semibold mb-2 mt-6">¿Tengo que incluir el aguinaldo?</h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            No en la planilla mensual. Tratá los aguinaldos (junio y diciembre) como ingresos
            extraordinarios y destinalos directo a ahorro/inversión, deudas o gastos grandes
            planificados (vacaciones, electrodomésticos). Si los mezclás con el sueldo mensual,
            se diluyen y no notás el efecto.
          </p>

          <h4 className="text-xl font-semibold mb-2 mt-6">¿Y los gastos en dólares?</h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Convertí todos tus gastos a la misma moneda (recomiendo pesos) usando el dólar
            promedio del mes. Si tenés ingresos en dólares, hacé al revés y convertí los gastos
            en pesos a dólares. Lo importante es no mezclar.
          </p>

          <h4 className="text-xl font-semibold mb-2 mt-6">
            ¿Cada cuánto debo revisar el presupuesto?
          </h4>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Una vez por mes para revisar la última, y una vez por trimestre para ajustar las
            categorías y los promedios. Cualquier cambio importante (mudanza, cambio de trabajo,
            inicio o fin de una deuda) amerita una revisión inmediata.
          </p>

          <p className="text-sm text-muted-foreground border-t border-border pt-6 mt-8">
            Esta herramienta es educativa y no constituye asesoramiento financiero personalizado.
            Para decisiones específicas, consultá con un asesor financiero habilitado.
          </p>
        </div>
      </section>
    </>
  );
}

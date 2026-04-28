import { InflationCalculator } from '@/components/free-tools/inflation-calculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculadora de Inflación Real Uruguay | Herramienta Gratuita | Ahorrin',
  description:
    'Calculá tu inflación real personalizada en Uruguay. El BCU dice 5%, pero ¿cuánto subieron TUS gastos realmente? Descubrí tu inflación real según tus categorías de consumo.',
  keywords: [
    'inflacion real uruguay',
    'calculadora inflacion uruguay',
    'cuanto subieron mis gastos',
    'inflacion personalizada uruguay',
    'IPC uruguay',
    'costo de vida uruguay',
  ],
  openGraph: {
    title: 'Calculadora de Inflación Real Uruguay | Ahorrin',
    description:
      'El BCU dice una cosa, tu bolsillo dice otra. Calculá tu inflación real según tus gastos.',
    type: 'website',
    url: 'https://www.ahorrin.app/herramientas/inflacion-real',
  },
  alternates: {
    canonical: 'https://www.ahorrin.app/herramientas/inflacion-real',
  },
};

export default function InflacionRealPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculadora de Inflación Real Uruguay',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'UYU' },
    description:
      'Calculá tu inflación real personalizada en Uruguay. Descubrí cuánto subieron realmente tus gastos según tus categorías de consumo, más allá del IPC oficial del BCU.',
    featureList: [
      'Cálculo de inflación personalizada por categorías',
      'Comparación con IPC oficial del BCU',
      'Análisis por categorías de gasto',
      'Visualización de impacto por categoría',
      'Recomendaciones para mitigar inflación',
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
            Calculadora de Inflación Real Uruguay
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            El INE publica un IPC oficial promedio para todos los uruguayos, pero tu inflación
            personal puede ser muy distinta. Si gastás más en alquiler y educación que el
            promedio, tu IPC personal va a ser más alto. Si gastás poco en transporte público,
            será más bajo. Esta calculadora te dice qué tan rápido se está encareciendo TU vida.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Cargá cuánto gastás por categoría y la herramienta calcula tu inflación
            personalizada usando los pesos de cada rubro y la variación promedio del IPC para
            cada uno. Te compara con el IPC general del BCU para ver si estás "arriba" o
            "abajo" del promedio nacional.
          </p>
        </div>
      </section>

      <InflationCalculator />

      <section className="bg-background py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h2 className="text-3xl font-bold mb-6">
            Por qué la inflación oficial no refleja tu situación
          </h2>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Cuando el INE anuncia que la inflación de Uruguay fue 5,8% en el último año, ese
            número es un promedio ponderado de cientos de productos y servicios consumidos por
            un "hogar tipo". El problema es que tu hogar no es ese hogar tipo. Si sos joven
            soltero alquilando en Pocitos, tu canasta de consumo no se parece a la de una pareja
            con dos hijos en el interior.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            La canasta del IPC tiene pesos fijos (cuánto representa alimentación vs vivienda vs
            transporte) basados en la Encuesta Continua de Hogares. Pero esos pesos son un
            promedio nacional. Tu situación real puede tener pesos completamente distintos:
            alguien que se mudó hace poco probablemente esté gastando 40% en vivienda, mientras
            que un propietario de larga data quizá gaste 5%.
          </p>

          <h3 className="text-2xl font-semibold mb-4">
            Por qué los rubros no se mueven juntos
          </h3>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Distintas categorías tienen inflaciones muy distintas. En el último ciclo en
            Uruguay, por ejemplo:
          </p>

          <ul className="space-y-2 text-muted-foreground mb-6 ml-6 list-disc">
            <li>
              <strong>Alquileres:</strong> tendieron a subir cerca o por encima del promedio,
              especialmente en Montevideo capital.
            </li>
            <li>
              <strong>Educación privada (colegios, universidades):</strong> sube siempre por
              encima del IPC general — entre 8% y 12% anual históricamente.
            </li>
            <li>
              <strong>Salud privada (mutualistas):</strong> aumentos autorizados anualmente que
              suelen ir cerca del IPC, pero con saltos en algunos años.
            </li>
            <li>
              <strong>Tecnología y electrónica:</strong> tendieron a subir menos que el promedio,
              o incluso a bajar en términos reales.
            </li>
            <li>
              <strong>Transporte público:</strong> aumentos discretos por decisión política, no
              continuos.
            </li>
            <li>
              <strong>Combustibles:</strong> volátiles, dependen del precio internacional del
              crudo y de la decisión de paridad de Ancap.
            </li>
          </ul>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Esto significa que dos personas con el mismo ingreso pueden tener experiencias muy
            distintas de inflación. Quien tenga hijos en colegio privado y mutualista premium
            ve su poder adquisitivo erosionado más rápido que quien gasta sobre todo en
            tecnología o transporte público.
          </p>

          <h3 className="text-2xl font-semibold mb-4">Cómo te afecta tener inflación alta</h3>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Si tu sueldo es nominal en pesos y se ajusta una vez al año por convenio, una
            inflación personal de 8% significa que perdiste casi 8% de poder adquisitivo en el
            año (suponiendo que el ajuste salarial te llegó al final). Sobre un sueldo líquido
            de $60.000, eso son $4.800 mensuales que se evaporan al final del período.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Por eso muchos uruguayos optan por tener parte del ahorro en{' '}
            <strong>Unidades Indexadas (UI)</strong>, dólares o instrumentos que ajustan por
            inflación: protegen el poder adquisitivo de la plata que no usás todos los días.
          </p>

          <h3 className="text-2xl font-semibold mb-4">Estrategias contra la inflación</h3>

          <ul className="space-y-3 text-muted-foreground mb-6 ml-6 list-disc">
            <li>
              <strong>Plazos fijos en UI:</strong> tu plata sigue al IPC. No te hace ganar
              dinero real, pero no perdés contra la inflación. Mejor que tener ahorros parados
              en pesos.
            </li>
            <li>
              <strong>Letras de Regulación Monetaria (BCU):</strong> instrumento de bajo riesgo
              que rinde por encima de la inflación. Accesible vía corredor de bolsa o algunos
              bancos.
            </li>
            <li>
              <strong>Diversificación en dólares:</strong> si parte de tu plata está en USD, te
              cubre del riesgo de devaluación abrupta del peso, aunque no necesariamente de la
              inflación en dólares.
            </li>
            <li>
              <strong>Cambiar de mutualista o servicios:</strong> si tu mutualista subió 12% y
              hay otra que sube 8%, es momento de comparar y eventualmente cambiar.
            </li>
            <li>
              <strong>Negociar el alquiler en UI fija:</strong> si tu contrato lo permite, tener
              el alquiler fijo en UI te protege de subas reales en los próximos años.
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4">Cómo usar esta herramienta</h3>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Cargá tus gastos mensuales por categoría (alimentación, vivienda, transporte, salud,
            educación, etc.) y la calculadora estima tu inflación personalizada. Te muestra:
          </p>

          <ul className="space-y-2 text-muted-foreground mb-6 ml-6 list-disc">
            <li>Tu IPC personal estimado para los últimos 12 meses.</li>
            <li>Comparación contra el IPC oficial del BCU.</li>
            <li>Qué categorías te están "comiendo" más poder adquisitivo.</li>
            <li>Cuánto tendrías que aumentar tu sueldo para mantener tu nivel de vida.</li>
          </ul>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Los datos de inflación por rubro son estimaciones basadas en publicaciones recientes
            del INE. La herramienta no usa tus datos personales para entrenar modelos: todo el
            cálculo corre en tu navegador.
          </p>

          <h3 className="text-2xl font-semibold mb-4">Preguntas frecuentes</h3>

          <h4 className="text-xl font-semibold mb-2 mt-6">¿Es exacto este cálculo?</h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Es una estimación. Usamos los promedios del INE por rubro y los ponderamos según
            tus gastos. Puede tener una desviación de uno o dos puntos respecto a tu inflación
            real, pero te da una idea bastante fiel de hacia dónde va tu poder adquisitivo.
          </p>

          <h4 className="text-xl font-semibold mb-2 mt-6">
            Mi inflación dio 12% — ¿es mucho?
          </h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Si el IPC oficial está entre 5 y 7%, una inflación personal de 12% indica que estás
            en categorías que suben fuerte (típicamente educación privada, salud, alquileres en
            Montevideo capital). No necesariamente es malo si tu sueldo crece a la par, pero es
            una señal de que tenés que cuidar el ajuste salarial o reducir gastos en esas
            categorías.
          </p>

          <h4 className="text-xl font-semibold mb-2 mt-6">¿Y si gano en dólares?</h4>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Si ganás en dólares y gastás en pesos, tu "inflación efectiva" depende del tipo de
            cambio. En períodos donde el dólar sube más rápido que la inflación en pesos, tu
            poder adquisitivo aumenta automáticamente. En períodos de estabilidad o atraso
            cambiario (como buena parte de 2023-2024 en Uruguay), perdés poder adquisitivo
            relativo.
          </p>

          <p className="text-sm text-muted-foreground border-t border-border pt-6 mt-8">
            Esta herramienta es educativa. Para análisis financiero formal, consultá con un
            asesor habilitado o un contador.
          </p>
        </div>
      </section>
    </>
  );
}

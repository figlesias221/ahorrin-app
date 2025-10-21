import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

// This will be replaced with actual markdown/MDX content loading
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
  };
  keywords: string[];
}

// Mock data - will be replaced with actual content loading
const blogPosts: Record<string, BlogPost> = {
  'organizar-finanzas-personales-uruguay-2025': {
    slug: 'organizar-finanzas-personales-uruguay-2025',
    title: 'Cómo Organizar tus Finanzas Personales en Uruguay [2025]',
    excerpt:
      'Guía completa paso a paso para tomar control de tus finanzas personales en Uruguay.',
    content: `
      <p class="lead">¿Sentís que tu plata se evapora antes de fin de mes? ¿No sabés exactamente en qué gastás? El 68% de los uruguayos no lleva un control detallado de sus gastos. En esta guía completa, te muestro paso a paso cómo tomar control de tu dinero.</p>

      <h2>Por Qué Necesitás Organizar tus Finanzas</h2>
      <p>Organizar tus finanzas personales es crucial si querés:</p>
      <ul>
        <li>Llegar cómodo a fin de mes</li>
        <li>Pagar tus deudas de tarjeta de crédito</li>
        <li>Saber exactamente cuánto gastás en cada categoría</li>
        <li>Crear un fondo de emergencia</li>
        <li>Cumplir tus metas financieras</li>
      </ul>

      <p><strong>La realidad uruguaya en 2025</strong>: Con inflación del 4.8% anual y comisiones bancarias de $800-1,200 mensuales, cada peso cuenta. Un buen control de gastos puede ahorrarte $5,000-15,000 por año.</p>

      <h2>Paso 1: Conocé tu Situación Actual</h2>
      <p>Antes de mejorar, necesitás medir. Hacé una radiografía completa:</p>

      <h3>1.1. Calculá tus Ingresos Mensuales</h3>
      <p>Anotá TODOS tus ingresos:</p>
      <ul>
        <li>Sueldo líquido (después de BPS, IRPF, Fonasa)</li>
        <li>Aguinaldo prorrateado (aguinaldo ÷ 12)</li>
        <li>Freelance o trabajos extra</li>
        <li>Alquileres que cobrés</li>
      </ul>

      <p><strong>Ejemplo Real Uruguay 2025</strong>:</p>
      <pre>
Sueldo líquido:        $55,000
Aguinaldo/12:          $ 4,583
Freelance promedio:    $10,000
----------------------------
TOTAL MENSUAL:         $69,583
      </pre>

      <h3>1.2. Descargá tus Extractos Bancarios</h3>
      <p>Conseguí tus extractos de los últimos 3 meses:</p>
      <ul>
        <li><strong>BBVA Uruguay</strong>: Home Banking → Extractos → Descargar</li>
        <li><strong>Scotiabank</strong>: Scotia Online → Movimientos → Exportar</li>
        <li><strong>Itaú</strong>: Mi Banco Digital → Extracto → Descargar</li>
        <li><strong>BROU</strong>: e-BROU → Consultas → Excel</li>
      </ul>

      <h3>1.3. Categorizá tus Gastos</h3>
      <p>Las categorías básicas en Uruguay:</p>

      <p><strong>Gastos Fijos</strong>:</p>
      <ul>
        <li>Vivienda (alquiler/préstamo)</li>
        <li>Servicios (UTE, OSE, Antel)</li>
        <li>Transporte (STM, combustible)</li>
        <li>Salud (mutualista)</li>
      </ul>

      <p><strong>Gastos Variables</strong>:</p>
      <ul>
        <li>Supermercado</li>
        <li>Comida fuera/delivery</li>
        <li>Entretenimiento</li>
        <li>Ropa y personal</li>
      </ul>

      <h2>Paso 2: Creá tu Presupuesto Personal</h2>

      <h3>El Método 50/30/20 (Adaptado a Uruguay)</h3>
      <p>Divide tus ingresos en:</p>
      <ul>
        <li><strong>50% Necesidades Básicas</strong>: Vivienda, comida, servicios</li>
        <li><strong>30% Deseos</strong>: Salidas, entretenimiento</li>
        <li><strong>20% Ahorro</strong>: Fondo emergencia, inversiones</li>
      </ul>

      <p><strong>Alternativa realista uruguaya</strong>: 60% / 25% / 15%</p>

      <h3>La Regla de Oro: Pagáte Primero</h3>
      <p>En vez de ahorrar lo que "sobra", hacé esto:</p>
      <ol>
        <li><strong>Día 1 del mes</strong>: Transferí tu % de ahorro a cuenta separada</li>
        <li>Vivís con el resto</li>
      </ol>

      <p>Bancos uruguayos con ahorro automático:</p>
      <ul>
        <li>BBVA: Cuenta Ahorro Programado</li>
        <li>Itaú: Ahorro Automático</li>
        <li>Scotiabank: Scotia Ahorro Plus</li>
        <li>BROU: Débito automático a caja de ahorro</li>
      </ul>

      <h2>Paso 3: Automatizá tus Finanzas</h2>
      <p>La clave del éxito es la automatización:</p>

      <h3>Automatizá tus Ahorros</h3>
      <ul>
        <li>Día 1: Transferencia automática a ahorro</li>
        <li>Día 5: Inversión automática (si aplica)</li>
        <li>Día 10: Pago mínimo deudas</li>
      </ul>

      <h3>Automatizá Pagos Recurrentes</h3>
      <p>Configurá débito automático para:</p>
      <ul>
        <li>UTE, OSE, Antel (evitás multas)</li>
        <li>Tarjetas de crédito (al menos el mínimo)</li>
        <li>Mutualista, seguros</li>
        <li>Streaming (Netflix, Spotify)</li>
      </ul>

      <h2>Paso 4: Reducí tus Gastos</h2>

      <h3>Los "Gastos Hormiga"</h3>
      <p>Ejemplo real Uruguay:</p>
      <pre>
Café diario Starbucks:      $ 3,960/mes
Delivery almuerzo:          $ 4,000/mes
Snacks kiosco:              $ 2,000/mes
Taxis innecesarios:         $ 1,600/mes
----------------------------------
TOTAL DESPERDICIADO:        $11,560/mes
ANUAL:                      $138,720 🤯
      </pre>

      <p><strong>Soluciones</strong>:</p>
      <ul>
        <li>Café en casa → ahorras $3,500/mes</li>
        <li>Vianda casera → ahorras $2,500/mes</li>
        <li>Bus en vez de Uber → ahorras $1,200/mes</li>
      </ul>

      <h3>Renegocia tus Servicios</h3>
      <p>5 llamadas = $5,000 anuales de ahorro</p>
      <p>Script para Antel/Movistar/Claro:</p>
      <blockquote>"Estoy revisando mi presupuesto y veo que [COMPETENCIA] tiene planes más económicos. ¿Qué promociones tienen?"</blockquote>

      <h2>Paso 5: Creá tu Fondo de Emergencia</h2>
      <p>Tu colchón financiero es esencial:</p>

      <ul>
        <li><strong>Meta Mínima</strong>: 3 meses de gastos</li>
        <li><strong>Meta Ideal</strong>: 6 meses de gastos</li>
        <li><strong>Meta Premium</strong>: 12 meses de gastos</li>
      </ul>

      <p>Con gastos de $65,000/mes:</p>
      <ul>
        <li>Mínimo: $195,000</li>
        <li>Ideal: $390,000</li>
        <li>Premium: $780,000</li>
      </ul>

      <h3>¿Dónde Guardar tu Fondo?</h3>
      <p>Opciones en Uruguay 2025:</p>
      <table>
        <thead>
          <tr>
            <th>Opción</th>
            <th>Liquidez</th>
            <th>Rendimiento</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Caja Ahorro BROU</td>
            <td>Inmediata</td>
            <td>0.5% anual</td>
          </tr>
          <tr>
            <td>Cuenta Remunerada</td>
            <td>Inmediata</td>
            <td>3.0% anual</td>
          </tr>
          <tr>
            <td>UI BROU</td>
            <td>48 horas</td>
            <td>5.5% anual</td>
          </tr>
        </tbody>
      </table>

      <h2>Paso 6: Manéjate con las Deudas</h2>
      <p>42% de uruguayos tiene deudas de tarjeta. Si sos uno, acá tu plan:</p>

      <h3>Método Avalancha</h3>
      <ol>
        <li>Listá deudas con su tasa de interés</li>
        <li>Pagá el mínimo en todas</li>
        <li>Todo el extra va a la de MAYOR tasa</li>
        <li>Eliminala y pasá a la siguiente</li>
      </ol>

      <h2>Paso 7: Herramientas Recomendadas (Uruguay 2025)</h2>

      <h3>Apps de Control de Gastos</h3>
      <p><strong>Gasty</strong> 🇺🇾</p>
      <ul>
        <li>Importa extractos de BBVA, Scotia, Itaú, BROU</li>
        <li>Categorización automática con IA</li>
        <li>Gráficas en tiempo real</li>
        <li>GRATIS, sin conectar tu banco</li>
      </ul>

      <h2>Paso 8: Revisá y Ajustá</h2>

      <h3>Rutina Semanal (15 minutos)</h3>
      <p>Todos los domingos:</p>
      <ol>
        <li>Revisá gastos de la semana</li>
        <li>Categorizá pendientes</li>
        <li>Chequeá progreso vs presupuesto</li>
      </ol>

      <h3>Revisión Mensual (30 minutos)</h3>
      <p>Último día del mes:</p>
      <ol>
        <li>Cierre mensual completo</li>
        <li>Compará presupuesto vs real</li>
        <li>Ajustá para el mes siguiente</li>
      </ol>

      <h2>Errores Comunes a Evitar</h2>
      <ul>
        <li><strong>Ser demasiado restrictivo</strong>: Incluí presupuesto de "caprichos"</li>
        <li><strong>No trackear efectivo</strong>: Pedí siempre ticket</li>
        <li><strong>Olvidar gastos anuales</strong>: Prorrateá todo</li>
        <li><strong>Compararte con otros</strong>: Tu situación es única</li>
        <li><strong>Rendirte rápido</strong>: Primeros 3 meses son difíciles, después automático</li>
      </ul>

      <h2>Metas Financieras Realistas</h2>

      <h3>Meta 3 Meses</h3>
      <ul>
        <li>Fondo emergencia: 1 mes de gastos</li>
        <li>Deuda reducida 30%</li>
        <li>Hábito de tracking establecido</li>
      </ul>

      <h3>Meta 6 Meses</h3>
      <ul>
        <li>Fondo emergencia: 3 meses de gastos</li>
        <li>Deuda reducida 60%</li>
        <li>Gastos hormiga eliminados</li>
      </ul>

      <h3>Meta 12 Meses</h3>
      <ul>
        <li>Fondo emergencia completo (6 meses)</li>
        <li>Deuda CERO</li>
        <li>Primera inversión</li>
        <li>Ahorro 15-20% constante</li>
      </ul>

      <h2>Conclusión: Empezá Hoy</h2>
      <p>Organizar tus finanzas no es complicado:</p>

      <p><strong>Los 3 Pilares</strong>:</p>
      <ol>
        <li><strong>Conocer</strong>: Sabé exactamente cuánto ganás y gastás</li>
        <li><strong>Planificar</strong>: Creá un presupuesto realista</li>
        <li><strong>Automatizar</strong>: Dejá que la tecnología trabaje por vos</li>
      </ol>

      <p><strong>Empezá HOY</strong>:</p>
      <ol>
        <li>Descargá tus extractos (5 min)</li>
        <li>Categorizá tus gastos (15 min)</li>
        <li>Creá tu presupuesto (20 min)</li>
        <li>Configurá tu primera transferencia automática</li>
      </ol>

      <p><strong>Miles de uruguayos ya lo lograron. Vos también podés.</strong></p>
    `,
    category: 'Educación Financiera',
    date: '2025-10-21',
    readTime: '12 min',
    author: {
      name: 'Equipo Gasty',
      avatar: '/logo.svg',
    },
    keywords: [
      'finanzas personales uruguay',
      'como organizar finanzas',
      'presupuesto personal',
      'control de gastos',
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return {
      title: 'Post no encontrado',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: `https://www.gasty.app/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      url: `https://www.gasty.app/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-b from-primary/5 to-background py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary font-medium mb-8 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>

          <div className="mb-6">
            <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('es-UY', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{post.readTime} de lectura</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* CTA Section */}
      <section className="bg-primary/5 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            ¿Listo para tomar control de tus finanzas?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Comenzá a usar Gasty gratis y organiza tus gastos en minutos
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* Schema.org Article Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            author: {
              '@type': 'Organization',
              name: post.author.name,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Gasty',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.gasty.app/logo.png',
              },
            },
            datePublished: post.date,
            dateModified: post.date,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://www.gasty.app/blog/${post.slug}`,
            },
            keywords: post.keywords.join(', '),
          }),
        }}
      />
    </div>
  );
}

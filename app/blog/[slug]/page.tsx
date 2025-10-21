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
      <p class="lead">Si llegás a fin de mes y no tenés ni idea en qué se te fue la plata, este post es para vos. Ya sé, ya sé... "otro artículo más sobre finanzas". Pero este es diferente. Sin vueltas, sin frases motivacionales vacías. Solo lo que funciona en Uruguay, en 2025.</p>

      <div class="callout-info">
        <strong>💡 Dato real:</strong> El uruguayo promedio gasta $11,500 al mes en "gastos hormiga" (café, delivery, taxis). Eso son $138,000 al año. ¿Te imaginás qué podrías hacer con esa plata?
      </div>

      <h2>La verdad incómoda sobre tus finanzas</h2>
      <p>Mirá, te voy a ser sincero. No vas a organizar tus finanzas en 5 minutos con un "hack mágico". Pero SÍ podés lograrlo en menos de una hora, y una vez que lo tengas andando, son 15 minutos por semana.</p>

      <p>La mayoría de la gente no controla sus gastos porque:</p>
      <ul>
        <li><strong>Es aburrido</strong> (obvio, no te voy a mentir)</li>
        <li><strong>Parece complicado</strong> (spoiler: no lo es)</li>
        <li><strong>Da miedo</strong> ver la realidad de los números</li>
        <li><strong>No saben por dónde arrancar</strong> (por eso estás acá)</li>
      </ul>

      <p>Pero acá está el tema: <strong>con inflación del 4.8% y comisiones bancarias que te sacan $1,000+ por mes</strong>, no controlar tus gastos te está costando MUCHO más que el tiempo que te llevaría hacerlo.</p>

      <h2>Paso 1: La radiografía (sin anestesia)</h2>
      <p>Antes de cambiar algo, tenés que saber dónde estás parado. Y sí, puede doler un poco. Pero como cuando vas al médico: mejor saber.</p>

      <h3>Cuánta plata entra realmente</h3>
      <p>No me vengas con "gano 80 mil". Quiero saber cuánto te queda EN LA MANO. Después de BPS, IRPF, Fonasa, y todo lo que el estado te saca (con amor 💙).</p>

      <div class="example-box">
        <p><strong>📊 Ejemplo real (un desarrollador de Montevideo):</strong></p>
        <pre>
Sueldo líquido:        $55,000   ← Lo que realmente cobrás
Aguinaldo ÷ 12:        $ 4,583   ← No te olvides de esto
Freelo promedio:       $10,000   ← Los laburos extra
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total real/mes:        $69,583   ← Con ESTO trabajás
        </pre>
      </div>

      <h3>Bajate los extractos (sí o sí)</h3>
      <p>Necesitás los extractos de los últimos 3 meses. No, "más o menos" no sirve. <strong>3 meses completos.</strong></p>

      <div class="bank-list">
        <p><strong>🏦 BBVA:</strong> Home Banking → Extractos → Descargar (formato Excel)</p>
        <p><strong>🏦 Scotia:</strong> Scotia Online → Movimientos → Exportar CSV</p>
        <p><strong>🏦 Itaú:</strong> Mi Banco Digital → Extracto → Descargar</p>
        <p><strong>🏦 BROU:</strong> e-BROU → Consultas → Excel (el más fácil, sorprendentemente)</p>
      </div>

      <div class="callout-warning">
        <strong>⚠️ Pro tip:</strong> Pedí los extractos en EXCEL o CSV, no en PDF. El PDF después tenés que pasarlo a mano y vas a putear. Preguntame cómo lo sé.
      </div>

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

      <h2>Paso 2: El presupuesto que SÍ vas a cumplir</h2>

      <p>Olvidate del método 50/30/20 que leíste en Medium traducido de Estados Unidos. En Uruguay no funciona. ¿Por qué? Porque con alquileres de $30,000 y salarios de $60,000, las cuentas no dan.</p>

      <h3>La regla 60/25/15 (versión uruguaya)</h3>
      <div class="callout-info">
        <strong>💰 Dividí tu plata así:</strong><br><br>
        <strong>60% Necesidades</strong> → Alquiler, comida, servicios, transporte<br>
        <strong>25% Quiero</strong> → Salidas, Netflix, ropa, caprichos<br>
        <strong>15% Ahorro</strong> → Fondo de emergencia, futuro<br>
      </div>

      <p>Y sí, ese 15% de ahorro parece poco. Pero es <strong>REALISTA</strong>. Y realista que lo cumplas es mejor que "20%" que nunca hacés.</p>

      <h3>La regla de oro: Pagáte primero a VOS</h3>
      <p>Acá es donde la mayoría se equivoca. Dicen "voy a ahorrar lo que sobre". ¿Sabés qué sobre? NADA. Nunca sobra nada.</p>

      <p><strong>Hacelo al revés:</strong></p>
      <ol>
        <li>Día 1 del mes: Ya cobraste → Transferencia AUTOMÁTICA a ahorro</li>
        <li>Viví el resto del mes con lo que queda</li>
        <li>Repeat</li>
      </ol>

      <div class="callout-warning">
        <strong>🏦 Ahorro automático en bancos uruguayos:</strong><br><br>
        <strong>BBVA:</strong> "Cuenta Ahorro Programado" (configuralo en Home Banking)<br>
        <strong>Itaú:</strong> "Ahorro Automático" (el más fácil de configurar)<br>
        <strong>Scotia:</strong> "Scotia Ahorro Plus"<br>
        <strong>BROU:</strong> Débito automático a caja de ahorro (old school pero funciona)
      </div>

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

      <h2>Paso 4: Cortá la grasa (sin sufrir)</h2>

      <h3>Los gastos hormiga que te están matando</h3>
      <p>Preparate mentalmente para esto. Agarrá los extractos y sumá cuánto gastaste en estas boludeces:</p>

      <div class="example-box">
        <p><strong>🐜 Gastos hormiga del uruguayo promedio:</strong></p>
        <pre>
Café en Starbucks/Juan Valdez:  $3,960/mes   (son $132 × 30 días)
Delivery cuando hay comida:     $4,000/mes   (3-4 pedidos por semana)
"Compritas" del super:          $2,000/mes   (esas cosas que no necesitabas)
Uber pa' 6 cuadras:             $1,600/mes   (porque llovía/hacía frío/tenías fiaca)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total tirado al tacho:          $11,560/mes
                                $138,720/AÑO 🤯
        </pre>
      </div>

      <p>Con esa plata podrías:</p>
      <ul>
        <li>Un viaje a Brasil de 10 días</li>
        <li>3 meses de alquiler</li>
        <li>Un fondo de emergencia completo</li>
        <li>O seguir tomando café a $132</li>
      </ul>

      <h3>Cómo negociar con Antel (y no morir en el intento)</h3>
      <p>Llamá a Antel, Movistar o Claro. Usá EXACTAMENTE este script (funciona, lo probé):</p>

      <blockquote>
        <p><strong>"Hola, estoy revisando mis gastos y vi que [COMPETENCIA] tiene un plan similar a $XXX menos. ¿Qué opciones tenés para retenerme como cliente?"</strong></p>
      </blockquote>

      <p>9 de cada 10 veces te van a ofrecer un descuento o mejora. <strong>Resultado: $5,000 ahorrados al año con 5 minutos de llamada.</strong></p>

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

      <h2>La parte donde te digo que arranques ya</h2>
      <p>Mirá, llegaste hasta acá. Eso ya dice algo. La mayoría lee el título y se va.</p>

      <p>Organizar tus finanzas no es sexy. No es emocionante. Pero sabés qué SÍ es emocionante?</p>
      <ul>
        <li>No estresarte a fin de mes</li>
        <li>Poder comprarte algo sin culpa</li>
        <li>Tener plata guardada pa' cuando se rompa la heladera</li>
        <li>Dormir tranquilo</li>
      </ul>

      <div class="callout-info">
        <strong>🎯 Plan de acción - AHORA:</strong><br><br>
        <strong>Paso 1 (5 min):</strong> Bajá tus extractos de los últimos 3 meses<br>
        <strong>Paso 2 (15 min):</strong> Pasalos a una planilla o usá Gasty (shameless plug 😎)<br>
        <strong>Paso 3 (10 min):</strong> Sumá ingresos y egresos. Mirá la realidad.<br>
        <strong>Paso 4 (5 min):</strong> Configurá una transferencia automática para tu ahorro<br>
      </div>

      <p><strong>Total: 35 minutos.</strong> Lo que dura un capítulo de Breaking Bad.</p>

      <p>La diferencia entre vos hoy y vos en 6 meses no es el sueldo. Es lo que hacés con la plata que ya tenés.</p>

      <p><strong>Arrancá hoy. En serio.</strong></p>
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
            className="blog-content"
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

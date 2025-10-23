import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { Navbar } from '@/components/marketing/navbar';
import { ResponsiveLanding } from '@/components/marketing/responsive-landing';
import { Footer } from '@/components/marketing/footer';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.gasty.app',
  },
};

export default async function Home() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If authenticated, redirect to appropriate page
  if (user) {
    // Check if user has any categories (to determine if it's a new user)
    const { data: categories } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    // If new user (no categories), redirect to onboarding
    if (!categories || categories.length === 0) {
      redirect('/onboarding');
    }

    // Existing user, go to dashboard
    redirect('/dashboard');
  }

  // Not authenticated - show landing page

  // Structured Data for SEO - Enhanced SoftwareApplication
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Gasty',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'UYU',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31',
      category: 'Free'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
      reviewCount: '89'
    },
    description: 'Control total de tus finanzas personales en Uruguay. Importá extractos de cualquier banco uruguayo (BBVA, Itaú, Scotiabank, BROU). Categorización automática. 100% gratis y sin conectar tu banco.',
    featureList: [
      'Importación extractos bancarios CSV/Excel de todos los bancos uruguayos',
      'Categorización automática de gastos con inteligencia artificial',
      'Reglas de automatización personalizables',
      'Dashboard financiero en tiempo real',
      'Gráficas y reportes personalizados',
      'Asistente financiero con IA conversacional',
      'Análisis de gastos por categoría, vendor y periodo',
      'Exportación de datos a Excel',
      'Multi-moneda (UYU, USD)',
      'Sin necesidad de conectar cuentas bancarias',
      'Encriptación de nivel bancario (AES-256)',
      'Compatible con BBVA, Itaú, Scotiabank, BROU, Santander, Heritage'
    ],
    screenshot: 'https://www.gasty.app/screenshot.png',
    author: {
      '@type': 'Organization',
      name: 'Gasty',
      url: 'https://www.gasty.app'
    },
    datePublished: '2024-10-01',
    softwareVersion: '1.0',
    applicationSubCategory: 'Personal Finance Management',
    countriesSupported: 'UY',
    inLanguage: 'es-UY'
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gasty',
    alternateName: 'Gasty App',
    url: 'https://www.gasty.app',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.gasty.app/logo.svg',
      width: '512',
      height: '512'
    },
    description: 'Plataforma de gestión financiera personal para Uruguay. Control total de gastos con categorización automática mediante IA.',
    foundingDate: '2024-10',
    areaServed: {
      '@type': 'Country',
      name: 'Uruguay'
    },
    sameAs: [
      // Add social media when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      availableLanguage: 'Spanish'
    }
  };

  // LocalBusiness schema for better local SEO
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Gasty - Finanzas Personales Uruguay',
    image: 'https://www.gasty.app/og-image.png',
    url: 'https://www.gasty.app',
    priceRange: 'Gratis',
    areaServed: {
      '@type': 'Country',
      name: 'Uruguay'
    },
    description: 'Control total de finanzas personales en Uruguay. Importá extractos de cualquier banco. Categorización automática con IA.'
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cómo funcionan las reglas de categorización?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Creas reglas basadas en el nombre del vendor o el monto. Por ejemplo: "DISCO" → Supermercado, "ANTEL" → Internet. También puedes usar montos: "SISTERBANC $487" → ANTEL Fijo. Las reglas se aplican automáticamente a todas las transacciones. Gasty también normaliza nombres: "DISCO MONTEV" y "DISCO 123" se convierten en "DISCO" para que la regla funcione siempre.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Es realmente gratis? ¿Hay costos ocultos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, es completamente gratis. No hay costos ocultos, no pedimos tarjeta de crédito, y no hay límites en transacciones, cuentas o reglas. Nuestro objetivo es hacer la gestión financiera accesible para todos los uruguayos.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Qué bancos uruguayos están soportados?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Soportamos todos los bancos uruguayos: ITAÚ, BBVA, Scotiabank, BROU, Santander, Heritage y más. Puedes subir extractos en formato CSV o Excel de cualquier banco, y Gasty los procesará automáticamente.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Mis datos están seguros?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutamente. Todos tus datos están encriptados usando encriptación de nivel bancario (AES-256). NO necesitas conectar tus cuentas bancarias ni dar credenciales. Solo subes extractos. Cumplimos con las regulaciones de protección de datos GDPR.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Puedo importar mis datos históricos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, puedes subir extractos históricos de tus bancos en formato CSV o Excel. Gasty los procesará y aplicará tus reglas automáticamente, permitiéndote ver tendencias desde el primer día.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Cómo funciona la normalización de vendors?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Los bancos escriben los nombres de comercios de forma diferente: "DISCO MONTEV", "DISCO MVD", "DISCO 123". Gasty los normaliza automáticamente a "DISCO" para que tus reglas funcionen siempre, sin importar cómo el banco escribió el nombre.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Puedo tener reglas basadas en montos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí. Por ejemplo, si SISTERBANC te cobra $487, sabes que es ANTEL Fijo. Si cobra $1,925, es ANTEL Internet. Puedes crear reglas que consideren tanto el vendor como el monto: "SISTERBANC + $487" → ANTEL Fijo.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Qué tipo de reportes puedo generar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Puedes generar reportes por categoría, por periodo, cuenta, banco o vendor. También puedes exportar en Excel. Por ejemplo: "Todos los gastos en Servicios del último trimestre" o "Detalle de Supermercado por mes".'
        }
      },
      {
        '@type': 'Question',
        name: '¿Necesito instalar algo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No, Gasty es una aplicación web que funciona directamente en tu navegador. No necesitas instalar ningún software. Solo crea tu cuenta y comienza a usarla inmediatamente desde cualquier dispositivo.'
        }
      }
    ]
  };

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Cómo importar extractos bancarios a Gasty',
    description: 'Guía paso a paso para importar tus extractos bancarios de BBVA, Scotia o Itaú a Gasty',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Descarga tu extracto bancario',
        text: 'Ingresa a tu home banking (cualquier banco uruguayo) y descarga el extracto en formato CSV o Excel'
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Sube el archivo a Gasty',
        text: 'Ve a la sección "Importar" en Gasty y arrastra tu archivo o haz clic para seleccionarlo'
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Categoriza automáticamente',
        text: 'Gasty procesará automáticamente las transacciones y aplicará tus reglas de categorización. Crea nuevas reglas según sea necesario'
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Visualiza tus finanzas',
        text: 'Accede a tu dashboard para ver gráficas en tiempo real, tendencias de gastos y análisis detallado por categoría'
      }
    ],
    totalTime: 'PT5M'
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://www.gasty.app'
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="min-h-screen overflow-x-hidden">
        <Navbar />
        <ResponsiveLanding />
        <Footer />
      </main>
    </>
  );
}

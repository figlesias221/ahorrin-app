import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { Navbar } from '@/components/marketing/navbar';
import { ResponsiveLanding } from '@/components/marketing/responsive-landing';
import { Footer } from '@/components/marketing/footer';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://gasty-app.xyz221.workers.dev',
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

  // Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Gasty',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'UYU',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
    description: 'Aplicación de gestión financiera personal con categorización automática mediante IA, compatible con extractos de BBVA, Scotia e Itaú Uruguay.',
    featureList: [
      'Asistente financiero con IA conversacional',
      'Importación de extractos bancarios PDF/Excel',
      'Categorización automática con IA',
      'Dashboard en tiempo real',
      'Gráficas y reportes personalizados',
      'Categorías personalizables',
      'Reglas de automatización',
      'Exportación a Excel',
      'Multi-moneda (UYU, USD)'
    ],
    screenshot: 'https://gasty-app.xyz221.workers.dev/screenshot.png',
    author: {
      '@type': 'Organization',
      name: 'Gasty',
    },
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gasty',
    url: 'https://gasty-app.xyz221.workers.dev',
    logo: 'https://gasty-app.xyz221.workers.dev/logo.png',
    description: 'Plataforma de gestión financiera personal para Uruguay',
    sameAs: [
      // 'https://twitter.com/gastyapp',
      // 'https://facebook.com/gastyapp',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <main className="min-h-screen">
        <Navbar />
        <ResponsiveLanding />
        <Footer />
      </main>
    </>
  );
}

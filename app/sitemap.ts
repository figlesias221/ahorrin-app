import { MetadataRoute } from 'next';
import { getAllPostsMetadata } from '@/lib/mdx';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.ahorrin.app';
  const currentDate = new Date();

  const blogPosts = getAllPostsMetadata().map(post => ({
    slug: post.slug!,
    date: post.date,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sobre-nosotros`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // Bancos consolidado (reemplaza /bbva, /itau, /santander, /scotiabank, /brou, /heritage)
    {
      url: `${baseUrl}/bancos-uruguay`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // Blog
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),

    // Free tools
    {
      url: `${baseUrl}/herramientas`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/herramientas/calculadora-presupuesto`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/herramientas/conversor-extractos`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/herramientas/inflacion-real`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/herramientas/calculadora-salario-liquido`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
  ];
}

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
    // Top-tier: home + main content hubs
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/herramientas`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },

    // High-priority commercial pages
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bancos-uruguay`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // Free tools (high-conversion, indexable)
    {
      url: `${baseUrl}/herramientas/calculadora-salario-liquido`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
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

    // Blog posts — bumped priority and freshness signal so Google
    // moves them out of "Discovered – currently not indexed"
    ...blogPosts.map((post) => {
      const postDate = new Date(post.date);
      // Use the more recent of (post date, 30 days ago) as lastModified
      // so Google sees these as "still fresh / worth crawling"
      const thirtyDaysAgo = new Date(currentDate);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const lastModified = postDate > thirtyDaysAgo ? postDate : thirtyDaysAgo;
      return {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    }),

    // Trust pages (lower priority, don't compete with content)
    {
      url: `${baseUrl}/sobre-nosotros`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    // Auth pages (kept indexable but very low priority — no SEO value)
    {
      url: `${baseUrl}/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];
}

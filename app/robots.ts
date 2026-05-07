import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.ahorrin.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/auth/',
          '/onboarding/',
          '/settings/',
          '/transactions/',
          '/categories/',
          '/upload/',
          '/summary/',
          '/rules/',
          '/ai/',
          '/login',
          '/signup',
          '/forgot-password',
          '/reset-password',
        ],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

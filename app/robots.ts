import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.gasty.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/onboarding/',
          '/settings/',
          '/transactions/',
          '/categories/',
          '/upload/',
          '/summary/',
          '/rules/',
          '/ai/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

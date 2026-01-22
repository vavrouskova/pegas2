import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/*?osoba=*'],
    },
    sitemap: `${process.env.FRONTEND_URL}/sitemap.xml`,
  };
}

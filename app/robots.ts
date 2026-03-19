import type { MetadataRoute } from 'next';

const isProduction = process.env.APP_ENV === 'production';

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/*?osoba=*'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_FRONTEND_URL?.replace(/\/$/, '')}/sitemap.xml`,
  };
}

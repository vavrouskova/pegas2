import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  reactCompiler: true,
  htmlLimitedBots:
    /Googlebot|Bingbot|Yandex|DuckDuckBot|Slurp|Baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|applebot|SeznamBot/i,
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/sitemap/:name',
        destination: '/api/sitemap/:name',
      },
    ];
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    unoptimized: true,
    minimumCacheTTL: 600,
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'wp.antstudio.cz',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  async headers() {
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL?.replace(/\/$/, '') || '';

    const securityHeaders = [
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Download-Options',
        value: 'noopen',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'Referrer-Policy',
        value: 'no-referrer-when-downgrade',
      },
      {
        key: 'Permissions-Policy',
        value: 'geolocation=self',
      },
      {
        key: 'Content-Security-Policy',
        value: 'upgrade-insecure-requests;',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains',
      },
    ];

    const corsHeaders = [
      {
        key: 'Access-Control-Allow-Methods',
        value: 'GET, POST, PUT, DELETE, OPTIONS',
      },
      {
        key: 'Access-Control-Allow-Headers',
        value:
          'Content-Type, Authorization, X-Requested-With, Accept, Origin, Referer, User-Agent, RSC, Next-Router-State-Tree, Next-Url, Next-Router-Prefetch',
      },
      {
        key: 'Access-Control-Allow-Credentials',
        value: 'true',
      },
    ];

    return [
      {
        source: '/:all*(svg|jpg|png|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=9999999999, must-revalidate',
          },
        ],
      },
      // CORS headers for same-origin requests
      ...(frontendUrl
        ? [
            {
              source: '/(.*)',
              has: [
                {
                  type: 'header' as const,
                  key: 'origin',
                  value: frontendUrl,
                },
              ],
              headers: [
                ...securityHeaders,
                ...corsHeaders,
                {
                  key: 'Access-Control-Allow-Origin',
                  value: frontendUrl,
                },
              ],
            },
          ]
        : []),
      // Default security headers for all requests
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
} satisfies NextConfig;

// TEMP: Skip Sentry in development for performance testing
const configWithPlugins = withBundleAnalyzer(withNextIntl(nextConfig));

export default process.env.NODE_ENV === 'production'
  ? withSentryConfig(configWithPlugins, {
      // For all available options, see:
      // https://www.npmjs.com/package/@sentry/webpack-plugin#options

      org: 'ant-studio',

      project: 'pegas',

      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,

      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
      // This can increase your server load as well as your hosting bill.
      // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
      // side errors will fail.
      tunnelRoute: '/monitoring',

      webpack: {
        // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
        // See the following for more information:
        // https://docs.sentry.io/product/crons/
        // https://vercel.com/docs/cron-jobs
        automaticVercelMonitors: true,

        // Tree-shaking options for reducing bundle size
        treeshake: {
          // Automatically tree-shake Sentry logger statements to reduce bundle size
          removeDebugLogging: true,
        },
      },
    })
  : configWithPlugins;

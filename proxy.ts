import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

// eslint-disable-next-line no-restricted-imports -- Required for next-intl middleware configuration
import { routing } from './i18n/routing';

/**
 * Proxy middleware for handling internationalization and redirects
 *
 * Future implementation notes (when backend is ready):
 * - Add WordPress redirect handling via /wp-json/wp/v2/redirects endpoint
 * - Implement domain replacement for redirect URLs
 * - Add custom path header for static asset handling
 *
 * See PROXY_IMPLEMENTATION.md for detailed implementation guide
 */
export async function proxy(request: NextRequest) {
  // Handle internationalization routing
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/_vercel`, or are `favicon.ico`
    '/((?!api|_next|_vercel|favicon|images|videos).*)',
  ],
};

import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { findRedirect, getRedirectsFromCache, setRedirectsCache } from '@/utils/redirect-cache';

// eslint-disable-next-line no-restricted-imports -- Required for next-intl middleware configuration
import { routing } from './i18n/routing';

// Create the i18n middleware
const intlMiddleware = createMiddleware(routing);

// Fetch redirects from WordPress GraphQL
const fetchRedirectsForMiddleware = async () => {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetRedirects {
      redirection {
        redirects {
          origin
          target
          code
          type
          matchType
        }
      }
    }
  `;

  try {
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Middleware: Failed to fetch redirects:', response.statusText);
      return [];
    }

    const { data, errors } = await response.json();

    if (errors) {
      console.error('Middleware: GraphQL errors:', errors);
      return [];
    }

    return data?.redirection?.redirects || [];
  } catch (error) {
    console.error('Middleware: Error fetching redirects:', error);
    return [];
  }
};

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.') // Files with extensions
  ) {
    return NextResponse.next();
  }

  // Get redirects from cache or fetch fresh
  const cachedRedirects = getRedirectsFromCache();
  const redirects =
    cachedRedirects ??
    (await (async () => {
      const freshRedirects = await fetchRedirectsForMiddleware();
      setRedirectsCache(freshRedirects);
      return freshRedirects;
    })());

  // Check for redirect match
  const redirect = findRedirect(pathname, redirects);

  if (redirect) {
    const isExternal = redirect.target.startsWith('http://') || redirect.target.startsWith('https://');
    const destinationUrl = isExternal ? redirect.target : new URL(redirect.target, request.url).toString();

    return NextResponse.redirect(destinationUrl, redirect.code);
  }

  // No redirect found, proceed with i18n middleware
  return intlMiddleware(request);
};

export const config = {
  matcher: ['/((?!api|_next|_vercel|favicon|images|videos|sitemap|.*\\..*).*)'],
};

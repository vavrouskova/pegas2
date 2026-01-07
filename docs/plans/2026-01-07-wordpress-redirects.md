# WordPress Redirects Integration - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate WordPress Redirection plugin redirects into Next.js middleware for automatic URL redirection.

**Architecture:** Fetch redirects from WordPress GraphQL API, cache them in-memory, and apply them via Next.js middleware. Redirects are revalidated periodically (every 5 minutes) to balance freshness with performance.

**Tech Stack:** Next.js 16 middleware, WordPress GraphQL (WPGraphQL + Redirection plugin), Edge Runtime

---

## Task 1: Add GraphQL Query Function for Redirects

**Files:**
- Modify: `src/api/wordpress-api.ts` (add new function at end of file)

**Step 1: Add TypeScript interface for redirect**

Add this interface at the top of the file with other interfaces:

```typescript
export interface WordPressRedirect {
  origin: string;
  target: string;
  code: number;
  type: string;
  matchType: string;
}
```

**Step 2: Add the fetch function**

Add this function at the end of the file:

```typescript
export const fetchRedirects = async (): Promise<WordPressRedirect[]> => {
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
      next: { tags: ['wordpress', 'redirects'], revalidate: 300 },
    });

    if (!response.ok) {
      console.error('Failed to fetch redirects:', response.statusText);
      return [];
    }

    const { data, errors } = await response.json();

    if (errors) {
      console.error('GraphQL errors fetching redirects:', errors);
      return [];
    }

    return data?.redirection?.redirects || [];
  } catch (error) {
    console.error('Error fetching redirects:', error);
    return [];
  }
};
```

**Step 3: Verify the function works**

Run in Node REPL or create a temporary test:

```bash
# From project root, run a quick test
npx tsx -e "
import { fetchRedirects } from './src/api/wordpress-api';
fetchRedirects().then(r => console.log('Redirects:', JSON.stringify(r, null, 2)));
"
```

Expected: Array with at least one redirect (`/testovaci-redirect` → `/jak-postupovat`)

**Step 4: Commit**

```bash
git add src/api/wordpress-api.ts
git commit -m "feat: add GraphQL query function for WordPress redirects"
```

---

## Task 2: Create Redirect Cache Utility

**Files:**
- Create: `src/utils/redirect-cache.ts`

**Step 1: Create the cache utility**

This utility caches redirects in-memory for Edge Runtime compatibility:

```typescript
import { WordPressRedirect } from '@/api/wordpress-api';

interface RedirectCache {
  redirects: WordPressRedirect[];
  lastFetched: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cache: RedirectCache | null = null;

export const getRedirectsFromCache = (): WordPressRedirect[] | null => {
  if (!cache) return null;

  const now = Date.now();
  if (now - cache.lastFetched > CACHE_TTL_MS) {
    return null; // Cache expired
  }

  return cache.redirects;
};

export const setRedirectsCache = (redirects: WordPressRedirect[]): void => {
  cache = {
    redirects,
    lastFetched: Date.now(),
  };
};

export const findRedirect = (
  pathname: string,
  redirects: WordPressRedirect[]
): WordPressRedirect | undefined => {
  // Exact match first
  const exactMatch = redirects.find((r) => r.origin === pathname);
  if (exactMatch) return exactMatch;

  // Match without trailing slash
  const normalizedPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return redirects.find((r) => {
    const normalizedOrigin = r.origin.endsWith('/') ? r.origin.slice(0, -1) : r.origin;
    return normalizedOrigin === normalizedPathname;
  });
};
```

**Step 2: Commit**

```bash
git add src/utils/redirect-cache.ts
git commit -m "feat: add in-memory redirect cache utility"
```

---

## Task 3: Create Next.js Middleware

**Files:**
- Create: `middleware.ts` (in project root)
- Modify: `proxy.ts` (rename and integrate)

**Step 1: Create the middleware file**

Create `middleware.ts` in the project root:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';

import { findRedirect, getRedirectsFromCache, setRedirectsCache } from '@/utils/redirect-cache';

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
  let redirects = getRedirectsFromCache();

  if (!redirects) {
    redirects = await fetchRedirectsForMiddleware();
    setRedirectsCache(redirects);
  }

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
```

**Step 2: Delete the old proxy.ts file**

The proxy.ts file is now redundant as its functionality is merged into middleware.ts:

```bash
rm proxy.ts
```

**Step 3: Verify middleware works**

Start the dev server and test the redirect:

```bash
# In a separate terminal, test the redirect
curl -I http://localhost:3000/testovaci-redirect
```

Expected: `HTTP/1.1 301 Moved Permanently` with `Location: /jak-postupovat`

**Step 4: Commit**

```bash
git add middleware.ts
git rm proxy.ts
git commit -m "feat: add middleware with WordPress redirect support"
```

---

## Task 4: Add API Route for Manual Redirect Revalidation

**Files:**
- Create: `app/api/v1/revalidate-redirects/route.ts`

**Step 1: Create the revalidation endpoint**

This allows WordPress to trigger redirect cache refresh after changes:

```typescript
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  const expectedKey = process.env.WORDPRESS_API_KEY;

  // Verify authorization
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Revalidate the redirects cache tag
    revalidateTag('redirects');

    return NextResponse.json({
      success: true,
      message: 'Redirects cache revalidated',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error revalidating redirects:', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
};

export const GET = () => {
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 });
};
```

**Step 2: Commit**

```bash
git add app/api/v1/revalidate-redirects/route.ts
git commit -m "feat: add API endpoint for redirect cache revalidation"
```

---

## Task 5: Test Complete Integration

**Files:**
- No file changes

**Step 1: Test the redirect flow**

With dev server running:

```bash
# Test redirect works
curl -I http://localhost:3000/testovaci-redirect

# Expected output should include:
# HTTP/1.1 301 Moved Permanently
# Location: http://localhost:3000/jak-postupovat
```

**Step 2: Test non-existent redirect**

```bash
# Test that normal pages still work
curl -I http://localhost:3000/o-nas

# Expected: HTTP/1.1 200 OK (or the actual page response)
```

**Step 3: Test revalidation endpoint**

```bash
# With proper auth header
curl -X POST http://localhost:3000/api/v1/revalidate-redirects \
  -H "Authorization: Bearer YOUR_WORDPRESS_API_KEY" \
  -H "Content-Type: application/json"

# Expected: {"success":true,"message":"Redirects cache revalidated",...}
```

**Step 4: Commit any fixes if needed**

If tests reveal issues, fix them and commit.

---

## Task 6: Final Cleanup and Documentation

**Files:**
- Modify: `CLAUDE.md` (add redirect documentation)

**Step 1: Add documentation about redirects**

Add this section to CLAUDE.md under "WordPress Integration":

```markdown
### WordPress Redirects

- Redirects managed via WordPress Redirection plugin
- Fetched via GraphQL and cached in middleware (5-minute TTL)
- Middleware handles redirect matching before i18n routing
- Revalidation endpoint: `POST /api/v1/revalidate-redirects`
- Cache tags: `wordpress`, `redirects`
```

**Step 2: Final commit**

```bash
git add CLAUDE.md
git commit -m "docs: add WordPress redirects documentation"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Add GraphQL query function | `src/api/wordpress-api.ts` |
| 2 | Create redirect cache utility | `src/utils/redirect-cache.ts` |
| 3 | Create Next.js middleware | `middleware.ts`, delete `proxy.ts` |
| 4 | Add revalidation API endpoint | `app/api/v1/revalidate-redirects/route.ts` |
| 5 | Test complete integration | No file changes |
| 6 | Documentation | `CLAUDE.md` |

**Total estimated tasks:** 6 major tasks, ~15 individual steps

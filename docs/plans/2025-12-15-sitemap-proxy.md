# Sitemap Proxy Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a sitemap proxy that fetches XML sitemaps from WordPress backend and replaces backend URLs with frontend URLs.

**Architecture:** Next.js route handlers will fetch sitemap XML from WordPress, transform URLs using existing helper functions, and return the modified XML. Two endpoints needed: sitemap index (`/sitemap.xml`) and individual sitemaps (`/sitemap/[name].xml`).

**Tech Stack:** Next.js App Router route handlers, existing `replaceWordpressUrl()` and `removeSitemapStylesheet()` helpers from `src/utils/helper.ts`.

---

## Task 1: Create Sitemap Index Route Handler

**Files:**
- Create: `app/sitemap.xml/route.ts`

**Step 1: Create the route handler file**

```typescript
import { NextResponse } from 'next/server';

import { removeSitemapStylesheet, replaceWordpressUrl } from '@/utils/helper';

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const frontendUrl = process.env.FRONTEND_URL;

  if (!backendUrl || !frontendUrl) {
    return new NextResponse('Missing environment variables', { status: 500 });
  }

  try {
    const response = await fetch(`${backendUrl}/sitemap_index.xml`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch sitemap from backend', { status: response.status });
    }

    let xml = await response.text();

    // Remove WordPress stylesheet
    xml = removeSitemapStylesheet(xml);

    // Replace backend URLs with frontend URLs
    xml = replaceWordpressUrl(xml, frontendUrl);

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Sitemap fetch error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
```

**Step 2: Verify the route works**

Run: `curl http://localhost:3000/sitemap.xml | head -20`
Expected: XML output with frontend URLs (e.g., URLs containing `FRONTEND_URL` value, not `NEXT_PUBLIC_BACKEND_URL`)

**Step 3: Commit**

```bash
git add app/sitemap.xml/route.ts
git commit -m "feat: add sitemap index proxy route handler"
```

---

## Task 2: Create Dynamic Sitemap Route Handler

**Files:**
- Create: `app/sitemap/[name]/route.ts`

**Step 1: Create the dynamic route handler**

```typescript
import { NextRequest, NextResponse } from 'next/server';

import { removeSitemapStylesheet, replaceWordpressUrl } from '@/utils/helper';

type RouteParams = {
  params: Promise<{ name: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { name } = await params;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const frontendUrl = process.env.FRONTEND_URL;

  if (!backendUrl || !frontendUrl) {
    return new NextResponse('Missing environment variables', { status: 500 });
  }

  // Validate sitemap name to prevent path traversal
  const validSitemapPattern = /^[\w-]+-sitemap\.xml$/;
  if (!validSitemapPattern.test(name)) {
    return new NextResponse('Invalid sitemap name', { status: 400 });
  }

  try {
    const response = await fetch(`${backendUrl}/${name}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch sitemap from backend', { status: response.status });
    }

    let xml = await response.text();

    // Remove WordPress stylesheet
    xml = removeSitemapStylesheet(xml);

    // Replace backend URLs with frontend URLs
    xml = replaceWordpressUrl(xml, frontendUrl);

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Sitemap fetch error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
```

**Step 2: Verify the dynamic route works**

Run: `curl http://localhost:3000/sitemap/post-sitemap.xml | head -20`
Expected: XML output with post URLs using frontend domain

Run: `curl http://localhost:3000/sitemap/page-sitemap.xml | head -20`
Expected: XML output with page URLs using frontend domain

**Step 3: Commit**

```bash
git add app/sitemap/[name]/route.ts
git commit -m "feat: add dynamic sitemap proxy for individual sitemaps"
```

---

## Task 3: Update Sitemap Index URLs to Point to Frontend Routes

**Files:**
- Modify: `app/sitemap.xml/route.ts`

**Context:** The sitemap index currently has URLs like `https://frontend.com/post-sitemap.xml` but our dynamic route is at `/sitemap/post-sitemap.xml`. We need to transform these URLs.

**Step 1: Add URL path transformation to sitemap index handler**

Update `app/sitemap.xml/route.ts`:

```typescript
import { NextResponse } from 'next/server';

import { removeSitemapStylesheet, replaceWordpressUrl } from '@/utils/helper';

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const frontendUrl = process.env.FRONTEND_URL;

  if (!backendUrl || !frontendUrl) {
    return new NextResponse('Missing environment variables', { status: 500 });
  }

  try {
    const response = await fetch(`${backendUrl}/sitemap_index.xml`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch sitemap from backend', { status: response.status });
    }

    let xml = await response.text();

    // Remove WordPress stylesheet
    xml = removeSitemapStylesheet(xml);

    // Replace backend URLs with frontend URLs
    xml = replaceWordpressUrl(xml, frontendUrl);

    // Transform sitemap URLs from /post-sitemap.xml to /sitemap/post-sitemap.xml
    xml = xml.replace(
      /(<loc>[^<]*?)(\/([\w-]+-sitemap\.xml)<\/loc>)/g,
      '$1/sitemap/$3</loc>'
    );

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Sitemap fetch error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
```

**Step 2: Verify the transformation**

Run: `curl http://localhost:3000/sitemap.xml | grep -o '<loc>[^<]*</loc>' | head -5`
Expected: URLs like `<loc>https://your-frontend.com/sitemap/post-sitemap.xml</loc>`

**Step 3: Commit**

```bash
git add app/sitemap.xml/route.ts
git commit -m "feat: transform sitemap index URLs to use /sitemap/ path"
```

---

## Task 4: Verify Full Sitemap Chain Works

**Files:** None (verification only)

**Step 1: Test sitemap index**

Run: `curl -s http://localhost:3000/sitemap.xml`
Expected: Valid XML with `<sitemapindex>` containing `<sitemap>` entries pointing to `/sitemap/*.xml`

**Step 2: Test individual sitemaps**

Run: `curl -s http://localhost:3000/sitemap/post-sitemap.xml | head -30`
Expected: Valid XML with `<urlset>` containing `<url>` entries with frontend URLs

Run: `curl -s http://localhost:3000/sitemap/page-sitemap.xml | head -30`
Expected: Valid XML with page URLs

**Step 3: Test invalid sitemap name (security)**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/sitemap/../../../etc/passwd`
Expected: `400` (Bad Request)

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete sitemap proxy implementation

- Add sitemap index route at /sitemap.xml
- Add dynamic sitemap routes at /sitemap/[name]
- Transform WordPress URLs to frontend URLs
- Include security validation for sitemap names
- Add 1-hour caching for performance"
```

---

## Summary

After completing all tasks, you will have:

1. `/sitemap.xml` - Serves the sitemap index with transformed URLs
2. `/sitemap/[name]` - Serves individual sitemaps (post-sitemap.xml, page-sitemap.xml, etc.)

All URLs in the sitemaps will use `FRONTEND_URL` instead of `NEXT_PUBLIC_BACKEND_URL`.

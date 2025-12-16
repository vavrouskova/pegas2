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
      next: { tags: ['wordpress'], revalidate: 3600 },
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
    // Only transform if /sitemap/ is not already in the path (idempotent)
    xml = xml.replace(/(<loc>[^<]*?)\/(?!sitemap\/)([\w-]+-sitemap\.xml<\/loc>)/g, '$1/sitemap/$2');

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

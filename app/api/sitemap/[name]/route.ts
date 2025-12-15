import { NextRequest, NextResponse } from 'next/server';

import { removeSitemapStylesheet, replaceWordpressUrl } from '@/utils/helper';

type RouteParameters = {
  params: Promise<{ name: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParameters) {
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

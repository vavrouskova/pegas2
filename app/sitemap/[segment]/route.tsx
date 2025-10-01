import { removeSitemapStylesheet, replaceWordpressUrl } from '@/utils/helper';

async function getSitemapData(segment: string) {
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${segment}`);
}

export async function GET(request: Request, { params }: { params: Promise<{ segment: string }> }) {
  const { segment } = await params;

  const response = await getSitemapData(segment);

  if (!response.ok) {
    console.error('Failed to fetch sitemap data:', response.statusText);
  }

  let body = await response.text();
  body = removeSitemapStylesheet(body);
  body = replaceWordpressUrl(body, `${process.env.FRONTEND_URL}`);

  return new Response(body, { headers: { 'Content-Type': 'text/xml' } });
}

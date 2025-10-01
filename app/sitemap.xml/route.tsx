import { removeSitemapStylesheet, replaceWordpressUrl } from '@/utils/helper';

async function getSitemapData() {
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sitemap_index.xml`);
}

export async function GET() {
  const response = await getSitemapData();

  if (!response.ok) {
    console.error('Failed to fetch sitemap data:', response.statusText);
  }

  let body = await response.text();
  body = removeSitemapStylesheet(body);
  body = replaceWordpressUrl(body, `${process.env.FRONTEND_URL}/sitemap`);

  return new Response(body, { headers: { 'Content-Type': 'text/xml' } });
}

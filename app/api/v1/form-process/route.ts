import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';
  const url = `${baseUrl}/wp-json/api/v1/form-process`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WORDPRESS_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type') || '';
      const isHtml = contentType.includes('text/html');

      console.error(`Form proxy failed: ${response.status} ${response.statusText} (${url})`, isHtml ? '[HTML response - likely Cloudflare]' : await response.text());

      return Response.json(
        { error: isHtml ? 'Backend is currently unreachable (Cloudflare challenge)' : `Backend error: ${response.statusText}` },
        { status: 502 },
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Form proxy fetch error:', error);
    return Response.json({ error: 'Failed to reach backend server' }, { status: 502 });
  }
}

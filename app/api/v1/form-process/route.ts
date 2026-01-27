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

    const contentType = response.headers.get('content-type') || '';
    const isHtml = contentType.includes('text/html');

    if (isHtml) {
      console.error(`Form proxy blocked by Cloudflare: ${response.status} (${url})`);
      return Response.json(
        { error: 'Backend is currently unreachable (Cloudflare challenge)' },
        { status: 502 },
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Form proxy failed: ${response.status} ${response.statusText} (${url})`, errorText);
      return Response.json(
        { error: `Backend error: ${response.statusText}` },
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

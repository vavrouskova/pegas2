import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

  const response = await fetch(`${baseUrl}/wp-json/api/v1/form-process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.WORDPRESS_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return Response.json({ error: errorText }, { status: response.status });
  }

  const data = await response.json();
  return Response.json(data);
}

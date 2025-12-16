import { revalidateTag } from 'next/cache';

export async function GET() {
  // Revalidate both tags - backendApi uses 'api', wordpress-api will use 'wordpress'
  revalidateTag('api', 'max');
  revalidateTag('wordpress', 'max');

  return Response.json({ revalidated: true, tags: ['api', 'wordpress'] });
}

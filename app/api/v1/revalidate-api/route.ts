import { revalidateTag } from 'next/cache';

export async function GET() {
  revalidateTag('api');

  return Response.json({ revalidated: true });
}

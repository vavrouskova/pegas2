import { revalidateTag } from 'next/cache';

export async function GET() {
  revalidateTag('api', 'max');

  return Response.json({ revalidated: true });
}

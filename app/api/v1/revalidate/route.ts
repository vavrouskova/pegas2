import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');

  if (path) {
    revalidatePath(path);

    return Response.json({ revalidated: true });
  }

  return Response.json({
    revalidated: false,
    message: 'Missing path to revalidate',
  });
}

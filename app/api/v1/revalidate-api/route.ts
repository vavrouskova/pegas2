import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const isRevalidationAuthorized = (authHeader: string | null, expectedKey?: string) => {
  return Boolean(expectedKey && authHeader === `Bearer ${expectedKey}`);
};

export const POST = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  const expectedKey = process.env.WORDPRESS_API_KEY;

  if (!isRevalidationAuthorized(authHeader, expectedKey)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    revalidateTag('api', 'max');
    revalidateTag('wordpress', 'max');

    return NextResponse.json({
      success: true,
      message: 'React cache revalidated',
      tags: ['api', 'wordpress'],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error revalidating React cache:', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
};

export const GET = () => {
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 });
};

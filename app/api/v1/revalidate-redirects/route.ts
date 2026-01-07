import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  const expectedKey = process.env.WORDPRESS_API_KEY;

  // Verify authorization
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Revalidate the redirects cache tag
    revalidateTag('redirects', 'max');

    return NextResponse.json({
      success: true,
      message: 'Redirects cache revalidated',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error revalidating redirects:', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
};

export const GET = () => {
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 });
};

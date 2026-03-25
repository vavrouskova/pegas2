import crypto from 'crypto';
import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { getPreviewPostById, isValidPreviewType } from '@/api/preview';
import type { PreviewPostType } from '@/api/preview';
import { defaultLocale, locales } from '@/i18n/routing';

/**
 * Simple slugify for generating URL-safe strings from Czech titles.
 * Used as fallback when a draft post has no slug yet.
 */
const slugify = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get('secret');
  const id = searchParams.get('id');
  const type = searchParams.get('type');

  // 1. Validate secret (timing-safe comparison)
  const expectedSecret = process.env.NEXT_PREVIEW_KEY;

  if (
    !secret ||
    !expectedSecret ||
    secret.length !== expectedSecret.length ||
    !crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(expectedSecret))
  ) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  // 2. Validate required parameters
  if (!id || !type) {
    return NextResponse.json({ error: 'Missing id or type parameter' }, { status: 400 });
  }

  const numericId = Number(id);
  if (isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
    return NextResponse.json({ error: 'Invalid id parameter' }, { status: 400 });
  }

  if (!isValidPreviewType(type)) {
    return NextResponse.json({ error: `Invalid type: ${type}` }, { status: 400 });
  }

  // 3. Fetch slug via authenticated GraphQL
  let post;
  try {
    post = await getPreviewPostById(numericId, type as PreviewPostType);
  } catch (error) {
    console.error('Preview route error:', error);
    return NextResponse.json({ error: 'Preview fetch failed' }, { status: 500 });
  }

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  // 4. Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  // 5. Redirect to the page with preview searchParams
  // Private posts have a slug; drafts may not — derive from title or fall back to databaseId
  const slug = post.slug || slugify(post.title) || String(post.databaseId);
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || request.nextUrl.origin;
  const requestedLocale = searchParams.get('locale');
  const locale = requestedLocale && (locales as readonly string[]).includes(requestedLocale) ? requestedLocale : defaultLocale;
  const redirectUrl = new URL(`/${locale}/${slug}`, baseUrl);
  redirectUrl.searchParams.set('previewId', id);
  redirectUrl.searchParams.set('previewType', type);

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set('__preview_attempted', '1', {
    maxAge: 60,
    httpOnly: true,
    sameSite: 'lax',
  });

  return response;
};

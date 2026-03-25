import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { cookies, draftMode } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import {
  getPreviewBlogPost,
  getPreviewBranch,
  getPreviewPostup,
  getPreviewReference,
  getPreviewSeoById,
  getPreviewService,
  isValidPreviewType,
} from '@/api/preview';
import {
  checkSlugType,
  getBlogPostBySlug,
  getBranchBySlug,
  getBranchesCount,
  getPostupBySlug,
  getReferenceBySlug,
  getServiceBySlug,
  getServicesByTaxonomy,
} from '@/api/wordpress-api';
import {
  renderBlogPost,
  renderBranch,
  renderPostup,
  renderReference,
  renderService,
} from '@/lib/preview/renderers';
import { getSeoDataBySlug } from '@/utils/seo';

interface SlugPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
  searchParams: Promise<{
    previewId?: string;
    previewType?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: SlugPageProps): Promise<Metadata> {
  const { isEnabled } = await draftMode();
  const { previewId, previewType } = await searchParams;

  // Preview SEO — only when Draft Mode is active AND preview params are valid
  const previewIdNum = previewId ? Number(previewId) : NaN;
  if (isEnabled && previewId && previewType && isValidPreviewType(previewType) && Number.isInteger(previewIdNum) && previewIdNum > 0) {
    const seo = await getPreviewSeoById(previewIdNum, previewType);

    return {
      title: seo?.title || seo?.opengraphTitle || 'Preview',
      description: seo?.metaDesc || seo?.opengraphDescription || '',
      robots: { index: false, follow: false },
      openGraph: {
        title: seo?.opengraphTitle || seo?.title,
        description: seo?.opengraphDescription || seo?.metaDesc,
        images: seo?.opengraphImage?.sourceUrl
          ? [
              {
                url: seo.opengraphImage.sourceUrl,
                width: seo.opengraphImage.mediaDetails?.width,
                height: seo.opengraphImage.mediaDetails?.height,
                alt: seo.opengraphImage.altText,
              },
            ]
          : undefined,
      },
    };
  }

  // Normal SEO flow (published pages — also when Draft Mode cookie lingers)
  const { slug } = await params;

  const slugType = await checkSlugType(slug);
  if (slugType === 'post') {
    return getSeoDataBySlug('post', slug);
  }

  if (slugType === 'referencePost') {
    return getSeoDataBySlug('referencePost', slug);
  }

  if (slugType === 'pobockaPost') {
    return getSeoDataBySlug('pobockaPost', slug);
  }

  if (slugType === 'postupPost') {
    return getSeoDataBySlug('postupPost', slug);
  }

  return getSeoDataBySlug('sluzbyPost', slug);
}

const SlugPage = async ({ params, searchParams }: SlugPageProps) => {
  const { slug, locale } = await params;
  const t = await getTranslations();
  const { isEnabled: isPreview } = await draftMode();
  const { previewId, previewType } = await searchParams;

  // ---------------------------------------------------------------------------
  // Preview flow (Draft Mode active + searchParams present)
  // ---------------------------------------------------------------------------
  if (isPreview && previewId && previewType && isValidPreviewType(previewType)) {
    const id = Number(previewId);
    if (!Number.isInteger(id) || id <= 0) notFound();
    const previewOptions = { isPreview: true, slug } as const;

    if (previewType === 'post') {
      const blogData = await getPreviewBlogPost(id);
      if (!blogData) notFound();
      return renderBlogPost(blogData, t, previewOptions);
    }

    if (previewType === 'referencePost') {
      const referenceData = await getPreviewReference(id);
      if (!referenceData) notFound();
      return renderReference(referenceData, t, previewOptions);
    }

    if (previewType === 'pobockaPost') {
      const [branchData, funeralEssentials] = await Promise.all([
        getPreviewBranch(id),
        getServicesByTaxonomy('doplnkove-sluzby-a-produkty'),
      ]);
      if (!branchData) notFound();
      return renderBranch({ branch: branchData, funeralEssentials }, t, previewOptions);
    }

    if (previewType === 'postupPost') {
      const [postupData, branchesCount] = await Promise.all([getPreviewPostup(id), getBranchesCount()]);
      if (!postupData) notFound();
      return renderPostup({ postup: postupData, branchesCount }, t, previewOptions);
    }

    if (previewType === 'sluzbyPost') {
      const serviceData = await getPreviewService(id);
      if (!serviceData) notFound();
      return renderService(serviceData, t, previewOptions);
    }
  }

  // ---------------------------------------------------------------------------
  // Expired/missing Draft Mode — re-enable by redirecting through /api/preview
  // Uses a short-lived cookie to prevent infinite redirect loops
  // ---------------------------------------------------------------------------
  if (previewId && previewType) {
    const cookieStore = await cookies();
    const alreadyAttempted = cookieStore.get('__preview_attempted');

    if (!alreadyAttempted) {
      const secret = process.env.NEXT_PREVIEW_KEY;

      if (secret) {
        const params = new URLSearchParams({
          secret,
          id: previewId,
          type: previewType,
          locale,
        });
        redirect(`/api/preview?${params.toString()}`);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Normal flow
  // ---------------------------------------------------------------------------
  const slugType = await checkSlugType(slug);

  if (!slugType) {
    notFound();
  }

  if (slugType === 'post') {
    const blogData = await getBlogPostBySlug(slug);
    if (!blogData) notFound();
    return renderBlogPost(blogData, t);
  }

  if (slugType === 'referencePost') {
    const referenceData = await getReferenceBySlug(slug);
    if (!referenceData) notFound();
    return renderReference(referenceData, t);
  }

  if (slugType === 'pobockaPost') {
    const [funeralEssentials, branchData] = await Promise.all([
      getServicesByTaxonomy('doplnkove-sluzby-a-produkty'),
      getBranchBySlug(slug),
    ]);
    if (!branchData) notFound();
    return renderBranch({ branch: branchData, funeralEssentials }, t, { slug });
  }

  if (slugType === 'postupPost') {
    const [postupData, branchesCount] = await Promise.all([getPostupBySlug(slug), getBranchesCount()]);
    if (!postupData) notFound();
    return renderPostup({ postup: postupData, branchesCount }, t);
  }

  // Default: sluzbyPost
  const serviceData = await getServiceBySlug(slug);
  if (!serviceData) notFound();
  return renderService(serviceData, t, { slug });
};

export default SlugPage;

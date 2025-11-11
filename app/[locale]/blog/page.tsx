import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { getBlogCategories, getBlogPosts } from '@/api/wordpress-api';
import BlogFilter from '@/components/_shared/BlogFilter';
import BlogGridSection from '@/components/_shared/BlogGridSection';
import BlogPagination from '@/components/_shared/BlogPagination';
import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import ContentSection from '@/components/_shared/ContentSection';
import PageHeroSection from '@/components/_shared/PageHeroSection';
import { POSTS_PER_PAGE } from '@/constants/blog';
import { parsePageNumber } from '@/utils/blog-helpers';
import { getSeoDataByUri } from '@/utils/seo';
import FooterClaim from '@/components/_shared/FooterClaim';

// Blog page needs to be dynamic because it uses searchParams for filtering
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('routes');

  return getSeoDataByUri('page', t('blog'));
}

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

const BlogPage = async ({ searchParams }: BlogPageProps) => {
  const params = await searchParams;
  const categoryId = params.category;
  const search = params.search;
  const page = parsePageNumber(params.page);

  const [t, blogData, categories] = await Promise.all([
    getTranslations(),
    getBlogPosts(POSTS_PER_PAGE, page, categoryId, search),
    getBlogCategories(),
  ]);

  return (
    <main className='max-w-container relative mx-auto'>
      <section className='px-4 sm:px-14'>
        <Breadcrumbs
          className='pb-18 lg:pb-43'
          pageTitle={t('blog.page-title')}
        />
        <PageHeroSection
          title={t('blog.hero.title')}
          description={t('blog.hero.description')}
        />
      </section>

      <section className='section-container relative'>
        <div className='mb-8 lg:mb-16'>
          <Suspense fallback={<div className='h-[40px]' />}>
            <BlogFilter categories={categories} />
          </Suspense>
        </div>
        <BlogGridSection posts={blogData.nodes} />
        <Suspense fallback={null}>
          <BlogPagination
            totalPages={blogData.totalPages}
            currentPage={blogData.currentPage}
          />
        </Suspense>
      </section>

      <ContentSection
        title={t('home.faq.title')}
        description={t('home.faq.description')}
        buttonText={t('home.faq.button-text')}
        link={t('home.faq.link')}
        image={{ src: '/images/ceremonies.webp', alt: t('home.faq.alt') }}
      />

      <ContentSection
        title={t('about-us.branches.title')}
        description={t('about-us.branches.description')}
        buttonText={t('about-us.branches.button-text')}
        link={t('about-us.branches.link')}
        image={{ src: '/images/room.webp', alt: t('about-us.branches.alt') }}
      />

      <ContentSection
        title={t('home.organized-by-us.title')}
        description={t('home.organized-by-us.description')}
        buttonText={t('home.organized-by-us.button-text')}
        link={t('home.organized-by-us.link')}
        image={{ src: '/images/detail-service.webp', alt: t('home.about-us.alt') }}
        imagePosition='left'
      />

      <FooterClaim />
    </main>
  );
};

export default BlogPage;

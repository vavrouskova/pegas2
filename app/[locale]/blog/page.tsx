import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { getBlogCategories, getBlogPosts } from '@/api/wordpress-api';
import BlogFilterClient from '@/components/_shared/BlogFilterClient';
import BlogGridSection from '@/components/_shared/BlogGridSection';
import BlogHeroSection from '@/components/_shared/BlogHeroSection';
import BlogPaginationClient from '@/components/_shared/BlogPaginationClient';
import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import ContentSection from '@/components/_shared/ContentSection';
import { POSTS_PER_PAGE } from '@/constants/blog';
import { parsePageNumber } from '@/utils/blog-helpers';
import { getSeoDataByUri } from '@/utils/seo';

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
    <main className='max-w-container mx-auto'>
      <section className='section-container pb-14 lg:pb-26'>
        <Breadcrumbs
          className='pb-18 lg:pb-43'
          pageTitle={t('blog.page-title')}
        />
        <BlogHeroSection
          title={t('blog.hero.title')}
          description={t('blog.hero.description')}
        />
      </section>

      <section className='section-container relative pb-12 lg:pb-20'>
        <div className='mb-8 lg:mb-16'>
          <BlogFilterClient categories={categories} />
        </div>
        <BlogGridSection posts={blogData.nodes} />
        <BlogPaginationClient
          totalPages={blogData.totalPages}
          currentPage={blogData.currentPage}
        />
      </section>

      <ContentSection
        title={t('home.faq.title')}
        description={t('home.faq.description')}
        buttonText={t('home.faq.button-text')}
        link={t('home.faq.link')}
        image={{ src: '/images/faq-image.webp', alt: t('home.faq.alt') }}
      />

      <ContentSection
        title={t('about-us.branches.title')}
        description={t('about-us.branches.description')}
        buttonText={t('about-us.branches.button-text')}
        link={t('about-us.branches.link')}
        image={{ src: '/images/room.webp', alt: t('about-us.branches.alt') }}
        imagePosition='left'
      />

      <ContentSection
        title={t('home.organized-by-us.title')}
        description={t('home.organized-by-us.description')}
        buttonText={t('home.organized-by-us.button-text')}
        link={t('home.organized-by-us.link')}
        sectionClassName='pt-[26rem] lg:pt-[15rem] pb-[21rem]'
        withFeathers
      />
    </main>
  );
};

export default BlogPage;
